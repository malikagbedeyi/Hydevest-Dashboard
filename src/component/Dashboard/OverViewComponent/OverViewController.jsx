import React, { useState } from 'react';
import { DollarSign, Loader2, PlaneTakeoff, Tag, PlusCircle, ArrowRight, Calendar, X, Filter, Check, Ship, BarChart3, Users, FileText } from "lucide-react";
import "../../../assets/Styles/dashboard/drilldown.scss"; 
import { useOutletContext } from 'react-router-dom';
import { useDashboardData } from './useDashboardData';
import DashboardCharts from './DashboardCharts';

const OverViewController = () => {
  const { openSubmenuFromChild } = useOutletContext();
  const [navigating, setNavigating] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const defaultRange = {
    from: new Date(new Date().setMonth(new Date().getMonth() - 5)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  };

  const [activeFilters, setActiveFilters] = useState(defaultRange);
  const [tempFilters, setTempFilters] = useState(defaultRange);

  const { loading, data: dashboardData } = useDashboardData(activeFilters);

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
        <p style={{ color: '#581aae', fontWeight: '600' }}>Syncing Data...</p>
      </div>
    );
  }

  return (
    <div className="drilldown" style={{ padding: "20px" }}>
      {/* FILTER CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
           {showFilter && (
             <div style={{ display: 'flex', gap: '10px', background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
               <input type="date" value={tempFilters.from} onChange={(e) => setTempFilters(p => ({...p, from: e.target.value}))} />
               <input type="date" value={tempFilters.to} onChange={(e) => setTempFilters(p => ({...p, to: e.target.value}))} />
               <button onClick={() => setActiveFilters(tempFilters)} style={{ background: '#581aae', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 10px' }}><Check size={14}/></button>
             </div>
           )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowFilter(!showFilter)} style={{ border: '1px solid #581aae', color: '#581aae', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', background: '#fff' }}><Filter size={14} /> Filter</button>
          <button onClick={() => { setActiveFilters(defaultRange); setShowFilter(false); }} style={{ color: '#ff4d4f', border: 'none', cursor: 'pointer', background: 'none' }}><X size={14} /> Reset</button>
        </div>
      </div>
      
      {/* METRICS GRID */}
      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item"><p className="small">Revenue</p><h2>₦{(dashboardData.salesMatric.total_sales_amount)}</h2></div>
          <div className="summary-item"><p className="small">Recovered</p><h2>₦{(dashboardData.salesMatric.total_amount_paid)}</h2></div>
          <div className="summary-item"><p className="small">Outstanding</p><h2 style={{ color: "orange" }}>₦{(dashboardData.salesMatric.outstanding_balance)}</h2></div>
              {/* <div className="summary-item">   <p className="small">Net Margin %</p> <h2 style={{ color: dashboardData.netMargin >= 0 ? '#22c55e' : '#ff4d4f' }}> {dashboardData.netMargin.toFixed(1)}% </h2> </div> */}
          <div className="summary-item"><p className="small">Sales</p><h2>{dashboardData.salesMatric.total_sales_count}</h2></div>
        </div>
      </div>

      {/* CHARTS & ACTIONS GRID */}
      <div className="grid-overview-main mt-4" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <DashboardCharts 
          chartData={dashboardData.chartData} 
          pieData={dashboardData.pieData} 
          formatCurrency={formatCurrency} 
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* QUICK ACTIONS */}
          <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h4>Quick Actions</h4>
            <div className="mt-3" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{ background: '#fff', border: '1px solid #581aae', color: '#581aae', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => handleAction("/dashboard/purchase", "/dashboard/trip", "create")}><PlaneTakeoff size={18} /> New Trip</button>
              <button style={{ background: '#fff', border: '1px solid #581aae', color: '#581aae', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => handleAction("/dashboard/sales", "/dashboard/pre-sale", "create")}><Tag size={18} /> New Presale</button>
              <button className="action-btn-animated" style={{ background: '#581aae', border: 'none', color: '#fff', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => handleAction("/dashboard/sales", "/dashboard/sales", "create")}><PlusCircle size={18} /> New Sale</button>
              <button style={{ background: '#fff', border: '1px solid #581aae', color: '#581aae', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => handleAction("/dashboard/sales", "/dashboard/recovery", "create")}><DollarSign size={18} /> Add Payment</button>
            </div>
          </div>

         {/* CONTAINERS IN TRANSIT */}
          <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: '1px solid #eee', }} 
          // onClick={() => handleAction("/dashboard/purchase", "/dashboard/trip", "table")}
           >
            <p className="small">Container In Transit</p>
            <h3 style={{ color: 'orange' }}>{dashboardData.inTransitCount}</h3>
            {/* <div style={{ color: '#581aae', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>Track Progress <ArrowRight size={12} /></div> */}
          </div>

          {/* TOTAL CONTAINERS */}
          <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: '1px solid #eee', cursor: 'pointer' }} onClick={() => handleAction("/dashboard/purchase", "/dashboard/container", "table")}>
            <p className="small">Total Containers</p>
            <h3>{dashboardData.totalContainer}</h3>
            <div style={{ color: '#581aae', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>View All <ArrowRight size={12} /></div>
          </div>

          <div style={{ marginTop: '10px', marginBottom: '-5px',display:"flex",justifyContent:"space-between" }}>
            <h5 style={{ fontWeight: '700', color: '#581aae', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} /> Reports
            </h5>
            
           <div style={{display:"flex",gap:"1vw",alignContent:"center",justifyContent:"center",cursor:"pointer"}}>
            <span style={{color:"#581aae"}} onClick={() => handleAction("/dashboard/report", "/dashboard/report")}> View</span>
             <ArrowRight size={16} color="#581aae" />
           </div>
          </div>

<div style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: '1px solid #eee', cursor: 'pointer' }} 
     onClick={() => handleAction("/dashboard/report", "/dashboard/report", "customer-dept")}>
  <p className="small">Customers Debt List</p>
  <h3 style={{ color: '#d9534f' }}>{dashboardData.debtorsCount}</h3>
  <div style={{ color: '#581aae', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
    View Debt List <ArrowRight size={12} />
  </div>
</div>
          <div style={{ background: "#fff", padding: "15px 20px", borderRadius: "16px", border: '1px solid #eee', cursor: 'pointer' }}onClick={() => handleAction("/dashboard/report", "/dashboard/report", "container-profit")}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600',color:"#581aae" }}>Container Profit Report</span>
                <ArrowRight size={16} color="#581aae" />
            </div>
          </div>

        </div>
      </div>  
    </div>  
  );
};


export default OverViewController;