import React, { useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/Sale/presaleTable.scss";
import { Trash2 } from "lucide-react";
import DrillDownRecovery from "./DrillDownRecovery";

const RecoveryTable = ({ data = [], onDelete, onUpdate }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [tableData, setTableData] = useState([]);

  const [selectedRecovery, setSelectedRecovery] = useState(null); // track clicked recovery

  // 🔴 delete popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [recoveryToDelete, setRecoveryToDelete] = useState(null);

  useEffect(() => {
    setTableData(data || []);
  }, [data]);
  

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = tableData.slice(startIndex, startIndex + itemsPerPage);
  const nextPage = () => currentPage < totalPages && setCurrentPage(p => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(p => p - 1);

  const openDeletePopup = (e, recovery) => {
    e.stopPropagation();
    setRecoveryToDelete(recovery);
    setShowDeletePopup(true);
  };
  const confirmDelete = () => {
    if (!recoveryToDelete) return;
    onDelete(recoveryToDelete.id);
    setShowDeletePopup(false);
    setRecoveryToDelete(null);
  };
  const cancelDelete = () => {
    setShowDeletePopup(false);
    setRecoveryToDelete(null);
  };
  const handleRowClick = (recovery) => {
    setSelectedRecovery(recovery);
  };
  const handleUpdate = (updatedRecovery) => {
    if (onUpdate) onUpdate(updatedRecovery);
    setSelectedRecovery(null);
  };
  const formatMoney = (value) =>
    new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date)
      .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      .replace(/ /g, "-");
  };
  if (selectedRecovery) {
    return <DrillDownRecovery data={selectedRecovery} goBack={() => setSelectedRecovery(null)} onUpdate={handleUpdate} />;
  }

  return (
    <>
      <div className="userTable">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Sale ID</th>
                <th>Amount Paid</th>
                <th>Balance</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>No Recoveries Found</td>
                </tr>
              ) : (
                currentData.map((rec, idx) => (
                  <tr key={rec.id} onClick={() => handleRowClick(rec)}>
                    <td>{startIndex + idx + 1}</td>
                    <td>{rec.customerName}</td>
                    <td>{rec.customerPhone}</td>
                    <td>{rec.saleSN}</td>
                    <td>{formatMoney(rec.amountPaid)}</td>
                    <td>{rec.balance === 0 ? <span style={{ color: "green" }}>Fully Paid</span> : formatMoney(rec.balance)}</td>
                    <td>{formatDate(rec.createdAt)}</td>
                    <td>
  {rec.status === "Approved" ? (
    <span style={{ color: "green", fontWeight: 600 }}>Approved</span>
  ) : (
    <span style={{ color: "orange", fontWeight: 600 }}>Pending</span>
  )}
</td>

                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="delete-btn"
                        onClick={(e) => openDeletePopup(e, rec)}
                        style={{ background: "transparent", border: "none", cursor: "pointer" }}
                      >
                        <Trash2 color="red" size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={prevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button onClick={nextPage} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 DELETE CONFIRM POPUP */}
      {showDeletePopup && (
        <div className="trip-card-popup">
          <div className="trip-card-popup-container">
            <div className="popup-content">
              <div className="popup-proceeed-wrapper">
                <p>Are you sure you want to delete this recovery?</p>
                <div className="btn-row-delete">
                  <button className="cancel" onClick={cancelDelete}>Cancel</button>
                  <button className="create" onClick={confirmDelete}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecoveryTable;
