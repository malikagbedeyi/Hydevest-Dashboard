import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Loader2, ArrowLeft } from 'lucide-react';
import DeptComment from './DeptComment';
import { CustomerDeptServices } from '../../../../services/Report/CustomerDept';

const DebtDrilldown = ({ customer, sales, recoveries, goBack }) => {
  /* ================== STATES ================== */
  const [activeTab, setActiveTab] = useState("sales");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [customerComments, setCustomerComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const [salesPage, setSalesPage] = useState(1);
  const [recoveryPage, setRecoveryPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);
  const itemsPerPage = 5;

  /* ================== DATA FILTERING ================== */
  const customerSales = useMemo(() => 
    sales.filter(s => (s.customer?.user_uuid || s.customer?.id) === customer.customerId), 
  [sales, customer]);

  const customerRecoveries = useMemo(() => {
    return recoveries.filter(r => {
      const recoveryId = r.customer_id; 
      const recoveryUuid = r.customer?.user_uuid; 
      return (customer.numericId && String(recoveryId) === String(customer.numericId)) ||
             (customer.customerId && String(recoveryUuid) === String(customer.customerId));
    });
  }, [recoveries, customer]);

  /* ================== API ACTIONS ================== */
  const fetchComments = async () => {
    if (!customerSales.length) return;
    setLoadingComments(true);
    try {
      // Fetch comments for every sale this customer has
      const commentPromises = customerSales.map(sale => 
        CustomerDeptServices.DeptCommentlist(sale.sale_uuid)
      );
      
      const responses = await Promise.all(commentPromises);
      const allComments = responses
        .flatMap(res => res.data?.record?.data || [])
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
      setCustomerComments(allComments);
    } catch (err) {
      console.error("Failed to fetch debt comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [customerSales]);

  const handlePostComment = async (commentText) => {
    if (!customerSales.length) return;
    try {
      const targetSaleUuid = customerSales[0].sale_uuid;
      await CustomerDeptServices.DeptCommentCreate({
        sale_uuid: targetSaleUuid,
        comment: commentText
      });
      fetchComments();
    } catch (err) {
      console.error("Error creating debt comment", err);
    }
  };

  /* ================== UTILS ================== */
  const formatMoney = (val) => "₦" + Number(val || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });
  
  const paginate = (data, page) => data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const paginatedSales = paginate(customerSales, salesPage);
  const paginatedRecoveries = paginate(customerRecoveries, recoveryPage);
  const paginatedComments = paginate(customerComments, commentPage);

    const formatDate = (date) =>
    date
      ? new Date(date)
          .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          .replace(/ /g, "-")
      : "-";
      


  return (
    <div className="drilldown">
      <div className="section-report-head" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={goBack} className="back-btn-circle"><ArrowLeft size={20}/></button>
        <h3>Customer Name: {customer.customerName}</h3>
      </div>

      {/* 1. TOP METRICS GRID */}
      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item">
            <p className="small">Total Purchases</p>
            <h2>{formatMoney(customer.totalSaleAmount)}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Total Paid</p>
            <h2 style={{ color: 'green' }}>{formatMoney(customer.totalAmountPaid)}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Outstanding Debt</p>
            <h2 style={{ color: "red" }}>{formatMoney(customer.outstanding)}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Payment Status</p>
            <h2 style={{ color: customer.outstanding <= 0 ? "green" : "orange" }}>
              {customer.outstanding <= 0 ? "Settled" : "Part Payment"}
            </h2>
          </div>
        </div>
      </div>

      {/* 2. TABBED CONTENT SECTION */}
      <section style={{ background: "#fff", padding: "20px", borderRadius: "16px", marginTop: "20px", boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div className="tab-section">
          <div className="tab-header" style={{ display: 'flex', alignItems: 'center' }}>
            <button className={activeTab === "sales" ? "active" : ""} onClick={() => setActiveTab("sales")}>Sales History ({customerSales.length})</button>
            <button className={activeTab === "recoveries" ? "active" : ""} onClick={() => setActiveTab("recoveries")}>Recoveries ({customerRecoveries.length})</button>
            <button className={activeTab === "comment" ? "active" : ""} onClick={() => setActiveTab("comment")}>Notes & Comments ({customerComments.length})</button>

            <button onClick={() => setShowCommentModal(true)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px", padding: "8px 15px", borderRadius: "8px", border: "none", background: "#581aae", color: "#fff", cursor: "pointer", fontSize: '13px' }}>
              <Plus size={16} /> Add Note
            </button>
          </div>

          <div className="tab-body" style={{ marginTop: '20px' }}>
            {/* SALES TABLE */}
            {activeTab === "sales" && (
              <div className="userTable">
                <div className="table-wrap">
                  <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
                    <thead>
                      <tr><th>S/N</th><th>Sale ID</th><th>Container</th><th>Sale Amount</th><th>Paid</th><th>Balance</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {paginatedSales.map((s, idx) => (
                        <tr key={s.id}>
                          <td>{String((salesPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                          <td>{s.sale_unique_id}</td>
                          <td>TRN-{s.container?.tracking_number}</td>
                          <td>{formatMoney(s.total_sale_amount)}</td>
                          <td style={{ color: 'green' }}>{formatMoney(s.amount_paid)}</td>
                          <td style={{ color: 'red' }}>{formatMoney(s.total_sale_amount - s.amount_paid)}</td>
                          <td>{new Date(s.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination">
                    <button disabled={salesPage === 1} onClick={() => setSalesPage(p => p - 1)}>Prev</button>
                    <span>{salesPage} / {Math.ceil(customerSales.length / itemsPerPage) || 1}</span>
                    <button disabled={salesPage >= Math.ceil(customerSales.length / itemsPerPage)} onClick={() => setSalesPage(p => p + 1)}>Next</button>
                  </div>
                </div>
              </div>
            )}

            {/* RECOVERY TABLE */}
            {activeTab === "recoveries" && (
              <div className="userTable">
                <div className="table-wrap">
                  <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
                    <thead>
                      <tr><th>S/N</th><th>Recovery ID</th><th>Method</th><th>Amount</th><th>Collector</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {paginatedRecoveries.length > 0 ? paginatedRecoveries.map((r, idx) => (
                        <tr key={r.id}>
                          <td>{String((recoveryPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                          <td>{r.recovery_unique_id}</td>
                          <td>{r.payment_method || 'Bank Transfer'}</td>
                          <td style={{ color: 'green', fontWeight: '600' }}>{formatMoney(r.amount)}</td>
                          <td>{r.creator_info?.firstname}</td>
                          <td>{new Date(r.created_at).toLocaleDateString()}</td>
                        </tr>
                      )) : <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No recovery records found.</td></tr>}
                    </tbody>
                  </table>
                  <div className="pagination">
                    <button disabled={recoveryPage === 1} onClick={() => setRecoveryPage(p => p - 1)}>Prev</button>
                    <span>{recoveryPage} / {Math.ceil(customerRecoveries.length / itemsPerPage) || 1}</span>
                    <button disabled={recoveryPage >= Math.ceil(customerRecoveries.length / itemsPerPage)} onClick={() => setRecoveryPage(p => p + 1)}>Next</button>
                  </div>
                </div>
              </div>
            )}

            {/* COMMENTS TABLE */}
            {activeTab === "comment" && (
              <div className="userTable">
                <div className="table-wrap">
                  {loadingComments ? <div style={{textAlign: 'center', padding: '40px'}}><Loader2 className="animate-spin" color="#581aae"/></div> : (
                    <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
                      <thead>
                        <tr><th>S/N</th><th>Date</th><th>Logged By</th><th> Comment</th></tr>
                      </thead>
                      <tbody>
                        {paginatedComments.length > 0 ? paginatedComments.map((c, idx) => (
                          <tr key={c.id}>
                            <td>{String((commentPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                            <td>{formatDate(c.created_at)}</td> 
                            <td><span style={{ fontWeight: '600', color: '#581aae' }}>{c.creator_info?.firstname} {c.creator_info?.lastname}</span></td>
                            <td>{c.comment}</td>
                          </tr>
                        )) : <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No notes found for this account.</td></tr>}
                      </tbody>
                    </table>
                  )}
                  <div className="pagination">
                    <button disabled={commentPage === 1} onClick={() => setCommentPage(p => p - 1)}>Prev</button>
                    <span>{commentPage} / {Math.ceil(customerComments.length / itemsPerPage) || 1}</span>
                    <button disabled={commentPage >= Math.ceil(customerComments.length / itemsPerPage)} onClick={() => setCommentPage(p => p + 1)}>Next</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="btn-row" style={{ marginTop: '25px' }}>
        <button className="cancel" onClick={goBack}>Back to Main Report</button>
      </div>

      {/* COMMENT MODAL */}
      {showCommentModal && (
        <DeptComment 
          comments={customerComments}
          addComment={handlePostComment}
          onClose={() => setShowCommentModal(false)}
        />
      )}
    </div>
  );
};

export default DebtDrilldown;