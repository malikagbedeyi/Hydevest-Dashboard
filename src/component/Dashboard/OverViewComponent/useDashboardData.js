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
    supplierPie: []      
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiToDate = `${activeFilters.to} 23:59:59`;

      const [salesRes, recoveryRes, containerRes, presaleRes, tripRes] = await Promise.all([
        SaleServices.list({ from_date: activeFilters.from, to_date: apiToDate }),
        RecoveryServices.list({ from_date: activeFilters.from, to_date: apiToDate }),
        ContainerServices.list({ page: 1, limit: 1000 }), 
        PresaleServices.list({ from_date: activeFilters.from, to_date: apiToDate }),
        TripServices.list({ page: 1, limit: 1000 }) 
      ]);

      const salesRaw = salesRes?.data?.record?.data || [];
      const presalesRaw = presaleRes?.data?.record?.data || [];
      const containersRaw = containerRes?.data?.record?.data || [];
      const tripsRaw = tripRes?.data?.record?.data || [];

      /* ================= 2. CALCULATE LANDING COST MAP (REPORT LOGIC) ================= */
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

/* ================= 3. TIME-SERIES BUCKETS (FIXED & ALIGNED) ================= */
const start = new Date(activeFilters.from);
const end = new Date(activeFilters.to);
const chartBase = [];

// Initialize buckets
let currentBucketDate = new Date(start.getFullYear(), start.getMonth(), 1);
while (currentBucketDate <= end) {
  const label = currentBucketDate.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
  chartBase.push({ name: label, Debt: 0, recovered: 0, Sales: 0, ExpProfit: 0, ActProfit: 0 });
  currentBucketDate.setMonth(currentBucketDate.getMonth() + 1);
}

// Map Presales by ID for faster lookup
const presaleMap = {};
presalesRaw.forEach(p => {
  presaleMap[p.container_one_id] = p;
  if(p.container_two_id) presaleMap[p.container_two_id] = p;
});

// A. Calculate Actual Profit (Revenue - Cost)
salesRaw.forEach(sale => {
  const label = new Date(sale.created_at).toLocaleString('en-GB', { month: 'short', year: 'numeric' });
  const bucket = chartBase.find(b => b.name === label);
  
  if (bucket) {
    const totalSale = Number(sale.total_sale_amount || 0);
    const paid = Number(sale.amount_paid || 0);
    
    bucket.Sales += totalSale;
    bucket.Debt += Math.max(totalSale - paid, 0);
    bucket.recovered += paid;

    // RULE: Only calculate profit if Presale exists for this container
    if (presaleMap[sale.container_id]) {
      const cost = landingCostMap[sale.container_id] || 0;
      bucket.ActProfit += (totalSale - cost);
    }
  }
});

// B. Calculate Expected Profit (Target Revenue - Cost)
presalesRaw.forEach(pre => {
  const label = new Date(pre.created_at).toLocaleString('en-GB', { month: 'short', year: 'numeric' });
  const bucket = chartBase.find(b => b.name === label);
  
  if (bucket && pre.container_one_id) {
    const expectedRev = Number(pre.expected_sales_revenue || 0);
    const cost = landingCostMap[pre.container_one_id] || 0;
    
    // Aligned with Report Logic: Only add if cost > 0 to avoid skewed data
    if (cost > 0) {
      bucket.ExpProfit += (expectedRev - cost);
    }
  }
});
      /* ================= 4. PIE CHART AGGREGATIONS ================= */
      
      // I. Sale Method (Presales)
      const pieData = presalesRaw.reduce((acc, curr) => {
        const opt = curr.sale_option?.toUpperCase().trim();
        if (['BOX SALE', 'SPLIT SALE'].includes(opt)) {
          const ex = acc.find(i => i.name === opt);
          if (ex) ex.value += 1; else acc.push({ name: opt, value: 1 });
        }
        return acc;
      }, []);

      // II. Source Nation Ratio (Containers)
      const sourceNationPie = containersRaw.reduce((acc, curr) => {
        const val = curr.source_nation?.toUpperCase().trim() || "UNSPECIFIED";
        const existing = acc.find(i => i.name === val);
        if (existing) existing.value += 1;
        else acc.push({ name: val, value: 1 });
        return acc;
      }, []);

      // III. Supplier Distribution Ratio (Containers)
      const supplierPie = containersRaw.reduce((acc, curr) => {
        const val = curr.supplier_code?.trim() || "NO CODE";
        const existing = acc.find(i => i.name === val);
        if (existing) existing.value += 1;
        else acc.push({ name: val, value: 1 });
        return acc;
      }, []);

      /* ================= 5. METRICS & COUNTS ================= */
      
      // In Transit Check
      const inTransitTripIds = tripsRaw.filter(t => t.progress === "INTRANSIT").map(t => t.id);
      const inTransitCount = containersRaw.filter(c => inTransitTripIds.includes(c.trip_id)).length;

      // Debtor Count Check
      const debtorMap = {};
      salesRaw.forEach(sale => {
        const custId = sale.customer?.user_uuid || sale.customer?.id;
        if (custId) {
          if (!debtorMap[custId]) debtorMap[custId] = { total: 0, paid: 0 };
          debtorMap[custId].total += Number(sale.total_sale_amount || 0);
          debtorMap[custId].paid += Number(sale.amount_paid || 0);
        }
      });
      const debtorsCount = Object.values(debtorMap).filter(c => c.total > c.paid).length;

      /* ================= 6. DATA STATE UPDATE ================= */
      const totalRev = salesRaw.reduce((sum, s) => sum + Number(s.total_sale_amount || 0), 0);
      const totalRec = salesRaw.reduce((sum, s) => sum + Number(s.amount_paid || 0), 0);
    const filteredActProfit = chartBase.reduce((sum, b) => sum + b.ActProfit, 0);
const filteredRevenue = chartBase.reduce((sum, b) => sum + b.Sales, 0);

const netMargin = filteredRevenue > 0 ? (filteredActProfit / filteredRevenue) * 100 : 0;

setData({
  totalContainer: containersRaw.length,
  inTransitCount,
  debtorsCount,
  totalSales: salesRes?.data?.record?.total || salesRaw.length,
  totalRevenue: filteredRevenue,
  totalRecovered: totalRec,
  netMargin: netMargin,
  pendingBalance: Math.max(filteredRevenue - totalRec, 0),
  chartData: chartBase.map(b => ({...b})), 
  pieData,
  sourceNationPie,
  supplierPie
});
    } catch (err) { 
      console.error("Dashboard Hook Logic Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, [activeFilters]);

  return { loading, data };
};