import React, { useState, useMemo } from 'react';

const PayableDrilldown = ({ tripData, allContainers, allExpenses, goBack }) => {
  const [activeTab, setActiveTab] = useState("expenses");


const tripContainers = useMemo(() => 
  allContainers.filter(c => 
    Number(c.trip_id) === Number(tripData.id) || c.trip?.trip_uuid === tripData.trip_uuid
  ), 
[allContainers, tripData]);

const tripExpenses = useMemo(() => 
  allExpenses.filter(e => 
    Number(e.trip_id) === Number(tripData.id) || e.trip_uuid === tripData.trip_uuid
  ), 
[allExpenses, tripData]);
  const formatUSD = (val) => `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="drilldown">
      <div className="section-report-head">
        <h3>Trip: {tripData.trip_unique_id} - {tripData.title}</h3>
      </div>

      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item">
            <p className="small">Total Shipping Amount</p>
            <h2>{formatUSD(tripData.totalShipping)}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Total Amount USD</p>
            <h2>{formatUSD(tripData.totalAmountUsd)}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Supplier Amount (Total)</p>
            <h2>{formatUSD(tripData.supplierAmount)}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Amount Paid Supplier</p>
            <h2 style={{ color: "green" }}>{formatUSD(tripData.amountPaidSupplier)}</h2>
          </div>
        </div>
      </div>

      <section style={{ background: "#fff", padding: "20px", borderRadius: "16px", marginTop: "20px" }}>
        <div className="tab-section">
          <div className="tab-header">
            <button className={activeTab === "expenses" ? "active" : ""} onClick={() => setActiveTab("expenses")}>
              Trip Expenses ({tripExpenses.length})
            </button>
            <button className={activeTab === "containers" ? "active" : ""} onClick={() => setActiveTab("containers")}>
              Containers ({tripContainers.length})
            </button>
          </div>

          {activeTab === "expenses" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ width: "100%",maxWidth:"100%", }}>
                  <thead>
                    <tr>
                      <th>Expense ID</th>
                      <th>Title</th>
                      <th> Category </th>
                      <th>USD Amount</th>
                      <th>Rate</th>
                      <th>Total NGN</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tripExpenses.map(exp => (
                      <tr key={exp.id}>
                        <td>{exp.expense_unique_id}</td>
                        <td>{exp.title}</td>
                        <td>{exp.is_container_payment ? "Container Payment" : "General Payment"}</td>
                        <td>{formatUSD(exp.amount)}</td>
                        <td>₦{exp.rate}</td>
                        <td>₦{exp.total_amount?.toLocaleString()}</td>
                        <td style={{ color: exp.status === 1  ? "green" : "orange" }}>{exp.status ? "Approved" : "Pending"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "containers" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ width: "100%",maxWidth:"100%", }}>
                  <thead>
                    <tr>
                      <th>Container ID</th>
                      <th>Tracking Number</th>
                      <th>Pieces</th>
                      <th>Unit Price ($)</th>
                      <th>Shipping ($)</th>
                      <th>Total Cost ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tripContainers.map(cont => {
                       const totalContCost = (cont.unit_price_usd * cont.pieces) + cont.shipping_amount_usd;
                       return (
                        <tr key={cont.id}>
                          <td>{cont.container_unique_id}</td>
                          <td>TRN-{cont.tracking_number}</td>
                          <td>{cont.pieces?.toLocaleString()}</td>
                          <td>{formatUSD(cont.unit_price_usd)}</td>
                          <td>{formatUSD(cont.shipping_amount_usd)}</td>
                          <td style={{ fontWeight: 'bold' }}>{formatUSD(totalContCost)}</td>
                        </tr>
                       )
                    })}
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

export default PayableDrilldown;