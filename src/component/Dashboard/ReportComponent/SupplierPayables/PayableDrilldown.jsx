import React, { useState, useMemo } from 'react';

const PayableDrilldown = ({ tripData, allContainers, allExpenses, goBack }) => {
  const [activeTab, setActiveTab] = useState("containers");
  const [contPage, setContPage] = useState(1);
  const [expPage, setExpPage] = useState(1);
  const itemsPerPage = 5;

  const tripContainers = useMemo(() => 
    allContainers.filter(c => Number(c.trip_id) === Number(tripData.id) || c.trip?.trip_uuid === tripData.trip_uuid), 
  [allContainers, tripData]);

  const tripExpenses = useMemo(() => 
    allExpenses.filter(e => (Number(e.trip_id) === Number(tripData.id) || e.trip_uuid === tripData.trip_uuid) && Number(e.is_container_payment) === 1), 
  [allExpenses, tripData]);

  const paginatedContainers = tripContainers.slice((contPage - 1) * itemsPerPage, contPage * itemsPerPage);
  const paginatedExpenses = tripExpenses.slice((expPage - 1) * itemsPerPage, expPage * itemsPerPage);

  const formatUSD = (val) => `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="drilldown">
      {/* ... Summary Section ... */}
      <section style={{ background: "#fff", padding: "20px", borderRadius: "16px", marginTop: "20px" }}>
        <div className="tab-section">
          <div className="tab-header">
            <button className={activeTab === "containers" ? "active" : ""} onClick={() => setActiveTab("containers")}>Containers ({tripContainers.length})</button>
            <button className={activeTab === "expenses" ? "active" : ""} onClick={() => setActiveTab("expenses")}>Expense ({tripExpenses.length})</button>
          </div>

          {activeTab === "expenses" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ width: "100%" }}>
                  <thead>
                    <tr><th>S/N</th><th>Expense ID</th><th>USD Amount</th><th>Rate</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {paginatedExpenses.map((exp, idx) => (
                      <tr key={exp.id}>
                        <td>{String((expPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                        <td>{exp.expense_unique_id}</td>
                        <td>{formatUSD(exp.amount)}</td>
                        <td>₦{exp.rate}</td>
                        <td style={{ color: exp.status === 1 ? "green" : "orange" }}>{exp.status ? "Approved" : "Pending"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {tripExpenses.length > itemsPerPage && (
                  <div className="pagination">
                    <button disabled={expPage === 1} onClick={() => setExpPage(p => p - 1)}>Prev</button>
                    <span>{expPage} / {Math.ceil(tripExpenses.length / itemsPerPage)}</span>
                    <button disabled={expPage * itemsPerPage >= tripExpenses.length} onClick={() => setExpPage(p => p + 1)}>Next</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "containers" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ width: "100%" }}>
                  <thead>
                    <tr><th>S/N</th><th>Container ID</th><th>Tracking No</th><th>Total Cost ($)</th></tr>
                  </thead>
                  <tbody>
                    {paginatedContainers.map((cont, idx) => {
                       const totalContCost = (Number(cont.unit_price_usd) * Number(cont.pieces)) + Number(cont.shipping_amount_usd);
                       return (
                        <tr key={cont.id}>
                          <td>{String((contPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                          <td>{cont.container_unique_id}</td>
                          <td>TRN-{cont.tracking_number}</td>
                          <td style={{ fontWeight: 'bold' }}>{formatUSD(totalContCost)}</td>
                        </tr>
                       )
                    })}
                  </tbody>
                </table>
                {tripContainers.length > itemsPerPage && (
                  <div className="pagination">
                    <button disabled={contPage === 1} onClick={() => setContPage(p => p - 1)}>Prev</button>
                    <span>{contPage} / {Math.ceil(tripContainers.length / itemsPerPage)}</span>
                    <button disabled={contPage * itemsPerPage >= tripContainers.length} onClick={() => setContPage(p => p + 1)}>Next</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PayableDrilldown;