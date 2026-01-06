import React, { useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/Expensify/table.scss";
import { Trash2 } from "lucide-react";
import FinanceDrillDown from "./FinanceDrillDown";

const FinanceTable = ({ data = [], onDelete, onUpdate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [tableData, setTableData] = useState([]);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // 🔴 drilldown state
  const [selectedFinance, setSelectedFinance] = useState(null);

  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = tableData.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  const openDeletePopup = (item) => {
    setItemToDelete(item);
    setShowDeletePopup(true);
  };
  const confirmDelete = () => {
    if (!itemToDelete) return;
    onDelete(itemToDelete.id);
    setShowDeletePopup(false);
    setItemToDelete(null);
  };
  const cancelDelete = () => {
    setShowDeletePopup(false);
    setItemToDelete(null);
  };

  const handleRowClick = (item) => {
    setSelectedFinance(item);
  };

  const handleUpdate = (updatedItem) => {
    if (onUpdate) onUpdate(updatedItem);
    setSelectedFinance(null);
  };

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value || 0));

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date)
      .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      .replace(/ /g, "-");
  };

  // 🔹 Show drilldown if a row is selected
  if (selectedFinance) {
    return <FinanceDrillDown 
    data={selectedFinance}
     goBack={() => setSelectedFinance(null)} 
     onUpdate={handleUpdate} />;
  }

  return (
    <>
      <div className="userTable">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Title</th>
                <th>Description</th>
                <th>Type</th>
                <th>Date</th>
                <th> Amount</th>
                <th>Currency</th>
                <th>Rate</th>
                <th> Amount (NGN)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    No Finance Data Found
                  </td>
                </tr>
              ) : (
                currentData.map((item, idx) => (
                  <tr key={item.id} onClick={() => handleRowClick(item)}>
                    <td>{startIndex + idx + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.type}</td>
                    <td>{formatDate(item.date)}</td>
                    <td>{formatMoney(item.budgetedAmount)}</td>
                    <td>{formatMoney(item.amount)}</td>
                    <td>{item.currency}</td>
                    <td>{item.rate}</td>
                    <td>
                      {item.status === "Approved" ? (
                        <span style={{ color: "green", fontWeight: 600 }}>Approved</span>
                      ) : (
                        <span style={{ color: "orange", fontWeight: 600 }}>Pending</span>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="delete-btn"
                        onClick={() => openDeletePopup(item)}
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
              <span>
                {currentPage} / {totalPages}
              </span>
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
                <p>Are you sure you want to delete this finance record?</p>
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

export default FinanceTable;
