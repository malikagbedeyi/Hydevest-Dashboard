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

/* ================= 3. TIME-SERIES BUCKETS (RE-ALIGNED TO REPORT) ================= */
const start = new Date(activeFilters.from);
const end = new Date(activeFilters.to);
const chartBase = [];

let currentBucketDate = new Date(start.getFullYear(), start.getMonth(), 1);
while (currentBucketDate <= end) {
  const label = currentBucketDate.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
  chartBase.push({ name: label, Debt: 0, recovered: 0, Sales: 0, ExpProfit: 0, ActProfit: 0 });
  currentBucketDate.setMonth(currentBucketDate.getMonth() + 1);
}

const validPresaleContainerIds = new Set([
  ...presalesRaw.map(p => p.container_one_id),
  ...presalesRaw.map(p => p.container_two_id)
].filter(Boolean));


const containerSalesMap = {};

salesRaw.forEach((sale) => {
  if (!validPresaleContainerIds.has(sale.container_id)) return;

  const id = sale.container_id;

 if (!containerSalesMap[id]) {
  containerSalesMap[id] = {
    revenue: 0,
    paid: 0,
    created_at: sale.created_at
  };
} else {
  if (new Date(sale.created_at) > new Date(containerSalesMap[id].created_at)) {
    containerSalesMap[id].created_at = sale.created_at;
  }
}

  containerSalesMap[id].revenue += Number(sale.total_sale_amount || 0);
  containerSalesMap[id].paid += Number(sale.amount_paid || 0);
});

Object.entries(containerSalesMap).forEach(([containerId, data]) => {
  const label = new Date(data.created_at).toLocaleString('en-GB', {
    month: 'short',
    year: 'numeric'
  });

  const bucket = chartBase.find(b => b.name === label);
  if (!bucket) return;

  const lcost = landingCostMap[containerId] || 0;

  const revenue = data.revenue;
  const paid = data.paid;

  bucket.Sales += revenue;
  bucket.Debt += Math.max(revenue - paid, 0);
  bucket.recovered += paid;

  bucket.ActProfit += (revenue - lcost);
});

presalesRaw.forEach(pre => {
  const label = new Date(pre.created_at).toLocaleString('en-GB', {
    month: 'short',
    year: 'numeric'
  });

  const bucket = chartBase.find(b => b.name === label);
  if (!bucket) return;

  const expectedRev = Number(pre.expected_sales_revenue || 0);

  const containerIds = [
    pre.container_one_id,
    pre.container_two_id
  ].filter(Boolean);

  const totalLandingCost = containerIds.reduce((sum, id) => {
    return sum + (landingCostMap[id] || 0);
  }, 0);

  bucket.ExpProfit += (expectedRev - totalLandingCost);
});
      /* ================= 4. PIE CHART AGGREGATIONS ================= */
      
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
        const existing = acc.find(i => i.name === val);
        if (existing) existing.value += 1;
        else acc.push({ name: val, value: 1 });
        return acc;
      }, []);

      const supplierPie = containersRaw.reduce((acc, curr) => {
        const val = curr.supplier_code?.trim() || "NO CODE";
        const existing = acc.find(i => i.name === val);
        if (existing) existing.value += 1;
        else acc.push({ name: val, value: 1 });
        return acc;
      }, []);

      /* ================= 5. METRICS & COUNTS ================= */
      
      const inTransitTripIds = tripsRaw.filter(t => t.progress === "INTRANSIT").map(t => t.id);
      const inTransitCount = containersRaw.filter(c => inTransitTripIds.includes(c.trip_id)).length;

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

const filteredActProfit = chartBase.reduce((sum, b) => sum + b.ActProfit, 0);
const filteredRevenue = chartBase.reduce((sum, b) => sum + b.Sales, 0);
const filteredRecovered = chartBase.reduce((sum, b) => sum + b.recovered, 0);

const netMargin = filteredRevenue > 0 ? (filteredActProfit / filteredRevenue) * 100 : 0;

setData({
  totalContainer: validPresaleContainerIds.size, 
  inTransitCount,
  debtorsCount,
totalSales: Object.keys(containerSalesMap).length,
  totalRevenue: filteredRevenue,
  totalRecovered: filteredRecovered,
  netMargin: netMargin,
  pendingBalance: Math.max(filteredRevenue - filteredRecovered, 0),
  chartData: chartBase, 
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