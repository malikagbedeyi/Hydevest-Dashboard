import { useState, useEffect } from 'react';
import { SaleServices } from '../../../services/Sale/sale';
import { RecoveryServices } from '../../../services/Sale/recovery';
import { ContainerServices } from '../../../services/Trip/container';
import { PresaleServices } from '../../../services/Sale/presale';
import { ExpenseServices } from '../../../services/Trip/expense';
import { TripServices } from '../../../services/Trip/trip';
import { calculateWeightedRate, calculateOverheadShare } from '../../../utils/financeMath';

export const useDashboardData = (activeFilters) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalRecovered: 0,
    pendingBalance: 0,
    totalContainer: 0,
    inTransitCount: 0,
    debtorsCount: 0,
    chartData: [],
    pieData: [],          
    sourceNationPie: [],  
    supplierPie: [],
    salesMatric: {},
    presalesMatric: {},
    containerMatric: {},
    hideContent: false 
  });

  /* ================= HELPERS: AGGRESSIVE FETCHING ================= */
  const fetchAll = async (service, params = {}) => {
    let allData = [];
    let page = 1;
    let hasMore = true;
    try {
      while (hasMore) {
        const res = await service.list({ ...params, page, per_page: 100 });
        const record = res?.data?.record;
        const data = record?.data || res?.data?.data || [];
        
        allData = [...allData, ...data];
        
        const lastPage = record?.last_page || 1;
        if (page >= lastPage || data.length === 0) {
          hasMore = false;
        } else {
          page++;
        }
      }
    } catch (e) {
      console.error(`Aggressive fetch failed for ${service}`, e);
    }
    return allData;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiToDate = `${activeFilters.to} 23:59:59`;

      const userData = JSON.parse(localStorage.getItem("user"));
      const perms = userData?.permissions?.map(p => p.name) || [];
      const hideContent = perms.includes("Fontend_hide_overview_content") && userData?.is_superuser === 0;

      /* ================= 1. AGGRESSIVE DATA COLLECTION ================= */

      const [salesRaw, recoveryRaw, containersRaw, presalesRaw, tripsRaw, salesMatrixRes] = await Promise.all([
        fetchAll(SaleServices, { from_date: activeFilters.from, to_date: apiToDate }),
        fetchAll(RecoveryServices, { from_date: activeFilters.from, to_date: apiToDate }),
        fetchAll(ContainerServices), 
        fetchAll(PresaleServices, { from_date: activeFilters.from, to_date: apiToDate }),
        fetchAll(TripServices),
        SaleServices.list({ from_date: activeFilters.from, to_date: apiToDate }) // To get backend calculated Matrix
      ]);

      const salesMatric = salesMatrixRes?.data || {};

      /* ================= 2. CALCULATE LANDING COST MAP (SYNCED) ================= */
      const tripUuids = [...new Set(containersRaw.map(c => c.trip?.trip_uuid).filter(Boolean))];
      
      // Fetch expenses for every trip found
      const allExps = await Promise.all(
        tripUuids.map(uuid => 
          fetchAll(ExpenseServices, { trip_uuid: uuid })
            .then(data => ({ uuid, data }))
            .catch(() => ({ uuid, data: [] })) 
        )
      );

      const landingCostMap = {};
      containersRaw.forEach(cont => {
        const tripExp = allExps.find(e => e.uuid === cont.trip?.trip_uuid)?.data || [];
        // Divisor must be based on ALL containers in that trip
        const tripContCount = containersRaw.filter(c => Number(c.trip_id) === Number(cont.trip_id)).length;
        
        const fxRate = calculateWeightedRate(tripExp);
        const overheadShare = calculateOverheadShare(tripExp, tripContCount);

        const amountUSD = (Number(cont.unit_price_usd || 0) * Number(cont.pieces || 0)) + Number(cont.shipping_amount_usd || 0);
        const surcharge = Number(cont.surcharge_ngn || 0);
        
        landingCostMap[cont.id] = (amountUSD * fxRate) + surcharge + overheadShare;
      });

      /* ================= 3. CHART LOGIC (RECOVERED & DEBT) ================= */
      const start = new Date(activeFilters.from);
      const end = new Date(activeFilters.to);
      const chartBase = [];

      let currentBucketDate = new Date(start.getFullYear(), start.getMonth(), 1);
      while (currentBucketDate <= end) {
        const label = currentBucketDate.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
        chartBase.push({ name: label, Debt: 0, recovered: 0, Sales: 0, ExpProfit: 0 });
        currentBucketDate.setMonth(currentBucketDate.getMonth() + 1);
      }

      chartBase.forEach((bucket) => {
        const salesInMonth = salesRaw.filter(s => 
          new Date(s.created_at).toLocaleString('en-GB', { month: 'short', year: 'numeric' }) === bucket.name
        );

        const monthlyRevenue = salesInMonth.reduce((sum, s) => sum + Number(s.total_sale_amount || 0), 0);
        const monthlyRecovered = salesInMonth.reduce((sum, s) => sum + Number(s.amount_paid || 0), 0);
        
        bucket.Sales = monthlyRevenue;
        bucket.recovered = monthlyRecovered;
        bucket.Debt = Math.max(0, monthlyRevenue - monthlyRecovered);

        // Expected Profit logic
        const presalesInMonth = presalesRaw.filter(p => 
            new Date(p.created_at).toLocaleString('en-GB', { month: 'short', year: 'numeric' }) === bucket.name
        );
        
        presalesInMonth.forEach(pre => {
            const expectedRev = Number(pre.expected_sales_revenue || 0);
            const containerIds = [pre.container_one_id, pre.container_two_id].filter(Boolean);
            const totalLandingCost = containerIds.reduce((sum, id) => sum + (landingCostMap[id] || 0), 0);
            bucket.ExpProfit += (expectedRev - totalLandingCost);
        });
      });

      /* ================= 4. DEBTOR COUNT & IN-TRANSIT ================= */
      const inTransitTripIds = tripsRaw.filter(t => t.progress === "INTRANSIT").map(t => t.id);
      const inTransitCount = containersRaw.filter(c => inTransitTripIds.includes(c.trip_id)).length;

      const customerMap = {};
      salesRaw.forEach(s => {
        const cid = s.customer_id;
        if(!customerMap[cid]) customerMap[cid] = { rev: 0, paid: 0 };
        customerMap[cid].rev += Number(s.total_sale_amount || 0);
        customerMap[cid].paid += Number(s.amount_paid || 0);
      });
      const debtorsCount = Object.values(customerMap).filter(c => c.rev > c.paid).length;


      /* ================= 5. PIE CHART AGGREGATIONS (FIXED) ================= */
      const pieData = presalesRaw.reduce((acc, curr) => {
        const opt = curr.sale_option?.toUpperCase().trim();
        // Requirement: only BOX and SPLIT sale
        if (['BOX SALE', 'SPLIT SALE'].includes(opt)) {
          const ex = acc.find(i => i.name === opt);
          if (ex) {
            ex.value += 1;
          } else {
            acc.push({ name: opt, value: 1 });
          }
        }
        return acc;
      }, []);


      /* ================= 6. STATE UPDATE ================= */
      setData({
        totalContainer: containersRaw.length,
        inTransitCount,
        debtorsCount,
        totalSales: salesRaw.length,
        totalRevenue: salesRaw.reduce((sum, s) => sum + Number(s.total_sale_amount || 0), 0),
        totalRecovered: salesRaw.reduce((sum, s) => sum + Number(s.amount_paid || 0), 0),
        pendingBalance: salesMatric?.outstanding_balance || 0,
        chartData: chartBase,
        salesMatric,
        containerMatric: { container_count: containersRaw.length },
        pieData, 
        hideContent 
      });

    } catch (err) { 
      console.error("Dashboard Hook Logic Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, [activeFilters]);

  return { loading, data };
};