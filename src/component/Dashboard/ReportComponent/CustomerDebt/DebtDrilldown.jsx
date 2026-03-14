import React, { useState, useMemo } from 'react';

const DebtDrilldown = ({ customer, sales, recoveries, goBack }) => {
  const [activeTab, setActiveTab] = useState("sales");

  const customerSales = useMemo(() => 
    sales.filter(s => (s.customer?.user_uuid || s.customer?.id) === customer.customerId), 
  [sales, customer]);

// Inside DebtDrilldown.jsx

const customerRecoveries = useMemo(() => {
  return recoveries.filter(r => {
    const recoveryCustId = r.customer_id || r.customer?.id || r.customer_uuid || r.customer?.user_uuid;
    
    const targetCustId = customer.customerId; 
    return String(recoveryCustId) === String(targetCustId);
  });
}, [recoveries, customer]);
  const formatMoney = (val) => "₦" + Number(val).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  return (
    <div className="drilldown">
      <div className="section-report-head"><h3>Details: {customer.customerName}</h3></div>

      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item">
            <p className="small">Total Sale Amount</p>
            <h2>{formatMoney(customer.totalSaleAmount)}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Total Recovered</p>
            <h2>{formatMoney(customer.totalAmountPaid)}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Current Outstanding</p>
            <h2 style={{ color: "red" }}>{formatMoney(customer.outstanding)}</h2>
          </div>
        </div>
      </div>

      <section style={{ background: "#fff", padding: "20px", borderRadius: "16px", marginTop: "20px" }}>
        <div className="tab-section">
          <div className="tab-header">
            <button className={activeTab === "sales" ? "active" : ""} onClick={() => setActiveTab("sales")}>
              Sales Records ({customerSales.length})
            </button>
            <button className={activeTab === "recoveries" ? "active" : ""} onClick={() => setActiveTab("recoveries")}>
              Recovery Records ({customerRecoveries.length})
            </button>
          </div>

          {activeTab === "sales" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ maxWidth: "100%", width:"100%",minWidth:"100%" }}>
                  <thead>
                    <tr>
                      <th>Sale ID</th>
                      <th>Container</th>
                      <th>Sale Amount</th>
                      <th>Paid</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerSales.map(s => (
                      <tr key={s.id}>
                        <td>{s.sale_unique_id}</td>
                        <td>{s.container?.tracking_number}</td>
                        <td>{formatMoney(s.total_sale_amount)}</td>
                        <td>{formatMoney(s.amount_paid)}</td>
                        <td>{s.payment_status}</td>
                        <td>{new Date(s.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "recoveries" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ maxWidth: "100%", width:"100%",minWidth:"100%" }}>
                  <thead>
                    <tr>
                      <th>Recovery ID</th>
                      <th>Sale Ref</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerRecoveries.map(r => (
                      <tr key={r.id}>
                        <td>{r.recovery_unique_id}</td>
                        <td>{r.sale?.sale_unique_id || "N/A"}</td>
                        <td style={{ color: 'green' }}>{formatMoney(r.amount)}</td>
                        <td>{r.payment_method}</td>
                        <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="btn-row" style={{ marginTop: '20px' }}>
          <button className="cancel" onClick={goBack}>Back to Report</button>
        </div>
      </section>
    </div>
  );
};

export default DebtDrilldown;