import { Plus } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import DeptComment from './DeptComment';

const DebtDrilldown = ({ customer, sales, recoveries, goBack }) => {
  const [activeTab, setActiveTab] = useState("sales");
  const [salesPage, setSalesPage] = useState(1);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [customerComments, setCustomerComments] = useState([]);
  const [recoveryPage, setRecoveryPage] = useState(1);
  const itemsPerPage = 5;

  const customerSales = useMemo(() => 
    sales.filter(s => (s.customer?.user_uuid || s.customer?.id) === customer.customerId), 
  [sales, customer]);

  const customerRecoveries = useMemo(() => {
    return recoveries.filter(r => {
      const recoveryCustomerId = r.customer_id; 
      const recoveryCustomerUuid = r.customer?.user_uuid; 
      const isNumericMatch = customer.numericId && String(recoveryCustomerId) === String(customer.numericId);
      const isUuidMatch = customer.customerId && String(recoveryCustomerUuid) === String(customer.customerId);
      return isNumericMatch || isUuidMatch;
    });
  }, [recoveries, customer]);

  // Pagination Logic
  const paginatedSales = customerSales.slice((salesPage - 1) * itemsPerPage, salesPage * itemsPerPage);
  const paginatedRecoveries = customerRecoveries.slice((recoveryPage - 1) * itemsPerPage, recoveryPage * itemsPerPage);

  const formatMoney = (val) => "₦" + Number(val).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  const addComment = (comment) => {
    setCustomerComments(prev => [...prev, comment]);
  };
  return (
    <div className="drilldown">
      <div className="section-report-head"><h3>Details: {customer.customerName}</h3></div>

      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item"><p className="small">Total Sale Amount</p><h2>{formatMoney(customer.totalSaleAmount)}</h2></div>
          <div className="summary-item"><p className="small">Total Recovered</p><h2>{formatMoney(customer.totalAmountPaid)}</h2></div>
          <div className="summary-item"><p className="small">Current Outstanding</p><h2 style={{ color: "red" }}>{formatMoney(customer.outstanding)}</h2></div>
        </div>
      </div>

      <section style={{ background: "#fff", padding: "20px", borderRadius: "16px", marginTop: "20px" }}>
        <div className="tab-section">
          <div className="tab-header">
            <button className={activeTab === "sales" ? "active" : ""} onClick={() => setActiveTab("sales")}>Sales Records ({customerSales.length})</button>
            <button className={activeTab === "recoveries" ? "active" : ""} onClick={() => setActiveTab("recoveries")}>Recovery Records ({customerRecoveries.length})</button>
            <button className={activeTab === "comment" ? "active" : ""} onClick={() => setActiveTab("comment")}>Comments Table</button>

                 <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={() => setShowCommentModal(true)} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "6px", border: "1px solid #581aae", background: "#fff", cursor: "pointer" }}>
            <Plus size={16} /> Add Comment
          </button>
        </div>
</div>
          {activeTab === "sales" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Sale ID</th>
                      <th>Container</th>
                      <th>Sale Amount</th>
                      <th>Paid</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSales.map((s, idx) => (
                      <tr key={s.id}>
                        <td>{String((salesPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                        <td>{s.sale_unique_id}</td>
                        <td>{s.container?.tracking_number}</td>
                        <td>{formatMoney(s.total_sale_amount)}</td>
                        <td>{formatMoney(s.amount_paid)}</td>
                        <td>{new Date(s.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {customerSales.length > itemsPerPage && (
                  <div className="pagination">
                    <button disabled={salesPage === 1} onClick={() => setSalesPage(p => p - 1)}>Previous</button>
                    <span>{salesPage} / {Math.ceil(customerSales.length / itemsPerPage)}</span>
                    <button disabled={salesPage * itemsPerPage >= customerSales.length} onClick={() => setSalesPage(p => p + 1)}>Next</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "recoveries" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Recovery ID</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRecoveries.map((r, idx) => (
                      <tr key={r.id}>
                        <td>{String((recoveryPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                        <td>{r.recovery_unique_id}</td>
                        <td style={{ color: 'green' }}>{formatMoney(r.amount)}</td>
                        <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {customerRecoveries.length > itemsPerPage && (
                  <div className="pagination">
                    <button disabled={recoveryPage === 1} onClick={() => setRecoveryPage(p => p - 1)}>Previous</button>
                    <span>{recoveryPage} / {Math.ceil(customerRecoveries.length / itemsPerPage)}</span>
                    <button disabled={recoveryPage * itemsPerPage >= customerRecoveries.length} onClick={() => setRecoveryPage(p => p + 1)}>Next</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "comment" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Comment ID</th>
                      <th>Title</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                   <tr>
                    <td></td>
                      <td></td>
                       <td>No comment Found</td>
                       <td></td>
                   </tr>
                  </tbody>
                </table>
                {customerRecoveries.length > itemsPerPage && (
                  <div className="pagination">
                    <button disabled={recoveryPage === 1} onClick={() => setRecoveryPage(p => p - 1)}>Previous</button>
                    <span>{recoveryPage} / {Math.ceil(customerRecoveries.length / itemsPerPage)}</span>
                    <button disabled={recoveryPage * itemsPerPage >= customerRecoveries.length} onClick={() => setRecoveryPage(p => p + 1)}>Next</button>
                  </div>
                )}
              </div>
            </div>
          )}
      {showCommentModal && (
        <DeptComment 
          comments={customerComments}
          addComment={addComment}
          onClose={() => setShowCommentModal(false)}
        />
      )}


        </div>
        <div className="btn-row" style={{ marginTop: '20px' }}><button className="cancel" onClick={goBack}>Back to Report</button></div>
      </section>
    </div>
  );
};

export default DebtDrilldown;