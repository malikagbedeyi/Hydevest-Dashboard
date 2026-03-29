import { useState, useEffect } from 'react';
import { SaleServices } from '../../../services/Sale/sale';
import { RecoveryServices } from '../../../services/Sale/recovery';
import { ContainerServices } from '../../../services/Trip/container';
import { PresaleServices } from '../../../services/Sale/presale';
import { ExpenseServices } from '../../../services/Trip/expense';
import { TripServices } from '../../../services/Trip/trip';

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
    containerMatric: {}
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiToDate = `${activeFilters.to} 23:59:59`;


      
      const [salesRes, recoveryRes, containerRes, presaleRes, tripRes] = await Promise.all([
        SaleServices.list({ from_date: activeFilters.from, to_date: apiToDate, per_page: 1000 }),
        RecoveryServices.list({ from_date: activeFilters.from, to_date: apiToDate, per_page: 1000 }),
        ContainerServices.list({ page: 1, per_page: 1000 }), 
        PresaleServices.list({ from_date: activeFilters.from, to_date: apiToDate, per_page: 1000 }),
        TripServices.list({ page: 1, per_page: 1000 }) 
      ]);


      const salesRaw = salesRes?.data?.record?.data || [];
      const salesMatric = salesRes?.data || {};
      const presalesRaw = presaleRes?.data?.record?.data || [];
      const presalesMatric = presaleRes?.data || {};
      const recoveryRaw = recoveryRes?.data?.record?.data || [];
      const containersRaw = containerRes?.data?.record?.data || [];
      const containerMatric = containerRes?.data || {};
      const tripsRaw = tripRes?.data?.record?.data || [];

      /* ================= 1. CALCULATE LANDING COST MAP (KEPT) ================= */
      const tripUuids = [...new Set(containersRaw.map(c => c.trip?.trip_uuid).filter(Boolean))];
      const allExps = await Promise.all(
        tripUuids.map(uuid => 
          ExpenseServices.list({ trip_uuid: uuid }).then(res => ({ uuid, data: res.data?.record?.data || [] }))
        )
      );

      const landingCostMap = {};
      containersRaw.forEach(cont => {
        const tripExp = allExps.find(e => e.uuid === cont.trip?.trip_uuid)?.data || [];
        const tripContCount = containersRaw.filter(c => c.trip_id === cont.trip_id).length;
        
        const finance = tripExp.reduce((acc, item) => {
          if (Number(item.is_container_payment) === 1) {
            acc.purchaseNgn += Number(item.total_amount || 0);
            acc.purchaseUsd += Number(item.amount || 0);
          } else { 
            acc.overhead += Number(item.total_amount || 0); 
          }
          return acc;
        }, { purchaseNgn: 0, purchaseUsd: 0, overhead: 0 });

        const fxRate = finance.purchaseUsd > 0 ? finance.purchaseNgn / finance.purchaseUsd : 0;
        const overheadShare = tripContCount > 0 ? finance.overhead / tripContCount : 0;
        const amountUSD = (Number(cont.unit_price_usd || 0) * Number(cont.pieces || 0)) + Number(cont.shipping_amount_usd || 0);
        const surcharge = cont.funding?.toLowerCase() === "partner" ? Number(cont.surcharge_ngn || 0) : 0;
        
        landingCostMap[cont.id] = (amountUSD * fxRate) + surcharge + overheadShare;
      });

      /* ================= 2. CUSTOMER DEBT LOGIC (NEW CHANGE) ================= */
      const customerMap = {};
      salesRaw.forEach((sale) => {
        const custId = sale.customer?.user_uuid || sale.customer?.id;
        if (!custId) return;

        if (!customerMap[custId]) {
          customerMap[custId] = { totalSale: 0, totalPaid: 0 };
        }
        customerMap[custId].totalSale += Number(sale.total_sale_amount || 0);
        customerMap[custId].totalPaid += Number(sale.amount_paid || 0);
      });

      // Total Debt calculation based on your report logic: sale - paid
      const calculatedTotalDebt = Object.values(customerMap).reduce((acc, curr) => {
        const diff = curr.totalSale - curr.totalPaid;
        return acc + (diff > 0 ? diff : 0);
      }, 0);

      const debtorsCount = Object.values(customerMap).filter(c => c.totalSale > c.totalPaid).length;

      /* ================= 3. CHART DATA (KEPT & UPDATED) ================= */
      const start = new Date(activeFilters.from);
      const end = new Date(activeFilters.to);
      const chartBase = [];

      let currentBucketDate = new Date(start.getFullYear(), start.getMonth(), 1);
      while (currentBucketDate <= end) {
        const label = currentBucketDate.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
        chartBase.push({ name: label, Debt: 0, recovered: 0, Sales: 0, ExpProfit: 0, ActProfit: 0 });
        currentBucketDate.setMonth(currentBucketDate.getMonth() + 1);
      }

      // Monthly Sales and Profit Logic
      presalesRaw.forEach(pre => {
        const label = new Date(pre.created_at).toLocaleString('en-GB', { month: 'short', year: 'numeric' });
        const bucket = chartBase.find(b => b.name === label);
        if (!bucket) return;
        const expectedRev = Number(pre.expected_sales_revenue || 0);
        const containerIds = [pre.container_one_id, pre.container_two_id].filter(Boolean);
        const totalLandingCost = containerIds.reduce((sum, id) => sum + (landingCostMap[id] || 0), 0);
        bucket.ExpProfit += (expectedRev - totalLandingCost);
      });

      chartBase.forEach((bucket) => {
        bucket.Sales = salesRaw
          .filter(s => new Date(s.created_at).toLocaleString('en-GB', { month: 'short', year: 'numeric' }) === bucket.name)
          .reduce((sum, s) => sum + Number(s.total_sale_amount || 0), 0);
      });

      if (chartBase.length > 0) {
        chartBase[chartBase.length - 1].Debt = calculatedTotalDebt;
        chartBase[chartBase.length - 1].recovered = recoveryRaw.reduce((sum, r) => sum + Number(r.amount || 0), 0);
      }

      /* ================= 4. PIE CHART AGGREGATIONS (KEPT) ================= */
      const pieData = presalesRaw.reduce((acc, curr) => {
        const opt = curr.sale_option?.toUpperCase().trim();
        if (['BOX SALE', 'SPLIT SALE'].includes(opt)) {
          const ex = acc.find(i => i.name === opt);
          if (ex) ex.value += 1; else acc.push({ name: opt, value: 1 });
        }
        return acc;
      }, []);

      const sourceNationPie = containersRaw.reduce((acc, curr) => {
        const val = curr.source_nation?.toUpperCase().trim() || "UNSPECIFIED";
        const ex = acc.find(i => i.name === val);
        if (ex) ex.value += 1; else acc.push({ name: val, value: 1 });
        return acc;
      }, []);

      const supplierPie = containersRaw.reduce((acc, curr) => {
        const val = curr.supplier_code?.trim() || "NO CODE";
        const ex = acc.find(i => i.name === val);
        if (ex) ex.value += 1; else acc.push({ name: val, value: 1 });
        return acc;
      }, []);

      /* ================= 5. METRICS & COUNTS (KEPT) ================= */
      const validPresaleContainerIds = new Set([
        ...presalesRaw.map(p => p.container_one_id),
        ...presalesRaw.map(p => p.container_two_id)
      ].filter(Boolean));

      const inTransitTripIds = tripsRaw.filter(t => t.progress === "INTRANSIT").map(t => t.id);
      const inTransitCount = containersRaw.filter(c => inTransitTripIds.includes(c.trip_id)).length;

      setData({
        totalContainer: validPresaleContainerIds.size,
        inTransitCount,
        debtorsCount,
        totalSales: salesRes?.data?.total_sales_count || 0,
        totalRevenue: salesRaw.reduce((sum, s) => sum + Number(s.total_sale_amount || 0), 0),
        totalRecovered: recoveryRaw.reduce((sum, r) => sum + Number(r.amount || 0), 0),
        pendingBalance: calculatedTotalDebt,
        chartData: chartBase,
        salesMatric,
        presalesMatric,
        containerMatric,
        pieData,
        sourceNationPie,
        supplierPie,
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