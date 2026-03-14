import React, { useEffect, useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Package, Activity, Clock, PlusCircle, ArrowRight, Loader2, PlaneTakeoff, Tag, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "../../../assets/Styles/dashboard/drilldown.scss"; 
import { RecoveryServices } from '../../../services/Sale/recovery';
import { SaleServices } from '../../../services/Sale/sale';
import { useOutletContext } from 'react-router-dom';
import { ContainerServices } from '../../../services/Trip/container';

const OverViewController = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalRecovered: 0,
    pendingBalance: 0,
    recentSales: [],
    chartData: []
  });

  // Date Filter State
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 5)).toISOString().split('T')[0], // 6 months ago
    to: new Date().toISOString().split('T')[0] // Today
  });

  const { openSubmenuFromChild } = useOutletContext();
  const [navigating, setNavigating] = useState(false);

/* ================= FETCH DATA (UPDATED LOGIC) ================= */
const fetchData = async () => {
  try {
    setLoading(true);
    
    const apiFromDate = dateRange.from;
    const apiToDate = `${dateRange.to} 23:59:59`; 

    const [salesRes, recoveryRes, containerRes] = await Promise.all([
      SaleServices.list({ from_date: apiFromDate, to_date: apiToDate }), 
      RecoveryServices.list({ from_date: apiFromDate, to_date: apiToDate }),
      ContainerServices.list({ page: 1 })
    ]);

    const salesRaw = salesRes?.data?.record?.data || [];
  
    const totalSalesFromBackend = salesRes?.data?.record?.total || salesRaw.length;

    /* ================= GENERATE CHART DATA ================= */
    const start = new Date(dateRange.from);
    const end = new Date(dateRange.to);
    const chartBase = {};

    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    while (current <= end) {
      const label = current.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
      chartBase[label] = { name: label, Sales: 0, recovered: 0 };
      current.setMonth(current.getMonth() + 1);
    }

    salesRaw.forEach(sale => {
      const date = new Date(sale.created_at);
      const label = date.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
      if (chartBase[label]) {
        chartBase[label].Sales += Number(sale.total_sale_amount || 0);
        chartBase[label].recovered += Number(sale.amount_paid || 0);
      }
    });

    const totalRev = salesRaw.reduce((sum, s) => sum + Number(s.total_sale_amount || 0), 0);
    const totalRec = salesRaw.reduce((sum, s) => sum + Number(s.amount_paid || 0), 0);

    setDashboardData({
      totalContainer: containerRes?.data?.record?.total || 0,
      totalSales: totalSalesFromBackend, // Show 9 here
      totalRevenue: totalRev,
      totalRecovered: totalRec,
      pendingBalance: Math.max(totalRev - totalRec, 0),
      recentSales: salesRaw.slice(0, 7), 
      chartData: Object.values(chartBase) 
    });
  } catch (err) {
    console.error("Error loading overview data", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);

  const handleAction = (parentId, path, action) => {
    setNavigating(true);
    setTimeout(() => { openSubmenuFromChild(parentId, path, action); }, 400);
  };

  if (loading || navigating) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <Loader2 size={50} className="animate-spin" color="#581aae" />
        <p style={{ color: '#581aae', fontWeight: '600' }}>{navigating ? "Opening modules..." : "Syncing Data..."}</p>
      </div>
    );
  }

  return (
    <div className="drilldown" style={{ padding: "20px" }}>
      
      {/* 1. TOP METRICS */}
      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item">
            <p className="small">Total Sales (Period)</p>
            <h2>{formatCurrency(dashboardData.totalRevenue)}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Total Recovered</p>
            <h2>{formatCurrency(dashboardData.totalRecovered)}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Outstanding</p>
            <h2 style={{ color: "orange" }}>{formatCurrency(dashboardData.pendingBalance)}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Sales Record</p>
            <h2>{dashboardData.totalSales}</h2>
          </div>
        </div>
      </div>

      <div className="grid-overview-main mt-4" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* CHART SECTION */}
        <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ fontWeight: '600', color: "#581aae" }}>Sales vs Recovery Trend</h4>
            
            {/* DATE FILTERS */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f8f9fa', padding: '5px 10px', borderRadius: '8px', border: '1px solid #eee' }}>
                <Calendar size={14} color="#581aae" />
                <input 
                  type="date" 
                  value={dateRange.from} 
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  style={{ border: 'none', background: 'transparent', fontSize: '12px', outline: 'none' }}
                />
                <span style={{ fontSize: '12px', color: '#999' }}>to</span>
                <input 
                  type="date" 
                  value={dateRange.to} 
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  style={{ border: 'none', background: 'transparent', fontSize: '12px', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#581aae" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#581aae" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="Sales" stroke="#581aae" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="recovered" stroke="#22c55e" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* QUICK ACTIONS BOX */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", color: "#581aae",boxShadow: '0 4px 12px rgba(0,0,0,0.1)'  }}>
            <h4>Quick Actions</h4>
            <div className="mt-3" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
<button 
  style={{ background: '#fff', border: '1px solid #581aae', color: '#581aae', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
  onClick={() => handleAction("/dashboard/purchase", "/dashboard/trip", "create")}
>
  <PlaneTakeoff size={18} /> Create New Trip
</button>

              <button style={{  background: '#fff', border: '1px solid #581aae', color: '#581aae', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                onClick={() => handleAction("/dashboard/sales", "/dashboard/pre-sale", "create")}>
                <Tag size={18} /> Create Presale
              </button>
              <button className="action-btn-animated" style={{ background: '#581aae', border: 'none', color: '#fff', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
              onClick={() => handleAction("/dashboard/sales", "/dashboard/sales", "create")}>
                <PlusCircle size={18} /> Record New Sale
              </button>
              
              <button style={{  background: '#fff', border: '1px solid #581aae', color: '#581aae',padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                           onClick={() => handleAction("/dashboard/sales", "/dashboard/recovery", "create")}>
                <DollarSign size={18} /> Add Payment
              </button>
            </div>
          </div>

          <div style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' ,  marginTop:"1vw",background: "#fff", padding: "20px", borderRadius: "16px", border: '1px solid #eee' }}>
            <p  className="summary-card-hover"  onClick={() => handleAction("/dashboard/purchase", "/dashboard/container", "table")} style={{ color: '#666' }}>Total Containers</p>
            <h3 style={{ margin: '5px 0',cursor: 'pointer', }}>{dashboardData.totalContainer}</h3>
            <div style={{ color: '#581aae', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={() =>  handleAction("/dashboard/report", "/dashboard/report", "container-sale")}>
              View Reports <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>  

      {/* 3. RECENT ACTIVITY TABLE */}
      <div className="mt-4" style={{ background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <Clock size={20} color="#581aae" />
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600" }}>Recent Sales Activity</h3>
        </div>

        <div className="userTable">
          <div className="table-wrap">
            <table className="table" style={{ width: "100%", minWidth: "100%", maxWidth: "100%" }}>
              <thead>
                <tr>
                  <th>Sale ID</th>
                  <th>Customer</th>
                  <th>Container</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td style={{ fontWeight: "600", color: "#581aae" }}>{sale.sale_unique_id}</td>
                    <td>{sale.customer?.firstname} {sale.customer?.lastname}</td>
                    <td>{sale.container?.title}</td>
                    <td>{formatCurrency(sale.total_sale_amount)}</td>
                    <td>
                      <span className={`status ${sale.payment_status === "Full Payment" ? "Approve" : "pending"}`}
                        style={{ color: sale.payment_status === "Full Payment" ? "green" : "orange" }}>
                        {sale.payment_status}
                      </span>
                    </td>
                    <td>{new Date(sale.created_at).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverViewController;