import React, { useState, useMemo } from 'react';

const PayableDrilldown = ({ tripData, allContainers, allExpenses, goBack }) => {
  const [activeTab, setActiveTab] = useState("containers");

  const tripContainers = useMemo(() => 
    allContainers.filter(c => 
      Number(c.trip_id) === Number(tripData.id) || c.trip?.trip_uuid === tripData.trip_uuid
    ), 
  [allContainers, tripData]);

  const tripExpenses = useMemo(() => 
    allExpenses.filter(e => 
      (Number(e.trip_id) === Number(tripData.id) || e.trip_uuid === tripData.trip_uuid) 
      && Number(e.is_container_payment) === 1
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
            <p className="small"> Amount owed Supplier </p>
            <h2>{formatUSD(tripData.supplierAmount)}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Amount Paid to Supplier</p>
            <h2 style={{ color: "green" }}>{formatUSD(tripData.amountPaidSupplier)}</h2>
          </div>
           <div className="summary-item">
            <p className="small">Payment Status</p>
            <h2  style={{ color: tripData.displayStatusColor, fontWeight: '600' }}>{tripData.displayStatus}</h2>
          </div>
        </div>
      </div>

      <section style={{ background: "#fff", padding: "20px", borderRadius: "16px", marginTop: "20px" }}>
        <div className="tab-section">
          <div className="tab-header">
            <button className={activeTab === "containers" ? "active" : ""} onClick={() => setActiveTab("containers")}>
              Containers ({tripContainers.length})
            </button>
            <button className={activeTab === "expenses" ? "active" : ""} onClick={() => setActiveTab("expenses")}>
              Expense ({tripExpenses.length})
            </button>
          </div>

          {activeTab === "expenses" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
                  <thead>
                    <tr>
                      <th>Expense ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>USD Amount</th>
                      <th>Rate</th>
                      <th>Total NGN</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tripExpenses.length === 0 ? (
                      <tr><td colSpan="7" style={{ textAlign: 'center' }}>No Container Payments found for this trip</td></tr>
                    ) : (
                      tripExpenses.map(exp => (
                        <tr key={exp.id}>
                          <td>{exp.expense_unique_id}</td>
                          <td>{exp.title}</td>
                          <td>Container Payment</td>
                          <td>{formatUSD(exp.amount)}</td>
                          <td>₦{exp.rate}</td>
                          <td>₦{exp.total_amount?.toLocaleString()}</td>
                          <td style={{ color: exp.status === 1 ? "green" : "orange" }}>
                            {exp.status ? "Approved" : "Pending"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "containers" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
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
                    {tripContainers.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign: 'center' }}>No Containers found for this trip</td></tr>
                    ) : (
                      tripContainers.map(cont => {
                         const totalContCost = (Number(cont.unit_price_usd) * Number(cont.pieces)) + Number(cont.shipping_amount_usd);
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
                      })
                    )}
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