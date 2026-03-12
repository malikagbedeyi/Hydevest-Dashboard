import React, { useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/Sale/presaleTable.scss";
import { Trash2 } from "lucide-react";
import DrillDownRecovery from "./DrillDownRecovery";

const RecoveryTable = ({
  data = [],
  pagination = {},
  onPageChange,
  onDelete,
  onUpdate,
  handleRowClick,
}) => {

  const [tableData, setTableData] = useState([]);


  // 🔴 delete popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [recoveryToDelete, setRecoveryToDelete] = useState(null);

  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  const openDeletePopup = (e, recovery) => {
    e.stopPropagation();
    setRecoveryToDelete(recovery);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (!recoveryToDelete) return;
    onDelete(recoveryToDelete.recovery_uuid);
    setShowDeletePopup(false);
    setRecoveryToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setRecoveryToDelete(null);
  };


  // const handleUpdate = (updatedRecovery) => {
  //   if (onUpdate) onUpdate(updatedRecovery);
  //   setSelectedRecovery(null);
  // };

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  };



  return (
    <>
      <div className="userTable ">
       
        <div className="table-wrap">
          <table
            className="table"
            style={{ width: "100%", minWidth: "100%", maxWidth: "100%" }}
          >
            <thead>
              <tr>
                <th>S/N</th>
                <th>Sale ID</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Amount Paid</th>
                {/* <th>Balance</th> */}
                <th>Created By</th>
                <th>payment Status</th>
                <th>Payment Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    No Recoveries Found
                  </td>
                </tr>
              ) : (
                tableData.map((rec, idx) => (
                  <tr key={rec.id} onClick={() => handleRowClick?.(rec)}>
                    <td>{(pagination.page - 1) * pagination.limit + idx + 1} </td>
                    <td>{rec.sale?.sale_unique_id}</td>
                    <td>{rec.customerName}</td>
                    <td>{rec.customerPhone}</td>

                    <td>{formatMoney(rec.amountPaid)}</td>
                    <td>{rec.creator_info.firstname} {rec.creator_info.lastname}</td>
                    <td style={{color:rec?.sale?.payment_status=== "Full Payment" ? "green":"orange"}}> {rec?.sale?.payment_status}</td>
                    <td>{formatDate(rec.createdAt)}</td>
                    
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="delete-btn"
                        onClick={(e) => openDeletePopup(e, rec)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 color="red" size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Backend Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </button>

              <p>
                {pagination.page} / {pagination.totalPages}
              </p>

              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
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
                  <button className="cancel" onClick={cancelDelete}>
                    Cancel
                  </button>

                  <button className="create" onClick={confirmDelete}>
                    Delete
                  </button>
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