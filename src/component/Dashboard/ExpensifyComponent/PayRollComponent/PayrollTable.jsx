// PayrollTable.jsx
import React, { useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/Expensify/table.scss";
import { Trash2 } from "lucide-react";
import PayrollDrillDown from "./PayrollDrillDown";

const PayrollTable = ({ data = [], onDelete, onUpdate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [tableData, setTableData] = useState([]);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = tableData.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (date) =>
    date
      ? new Date(date)
          .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          .replace(/ /g, "-")
      : "-";

  if (selectedPayroll) {
    return (
      <PayrollDrillDown
        payroll={selectedPayroll}
        goBack={() => setSelectedPayroll(null)}
        onUpdate={(updated) => {
          onUpdate?.(updated);
          setSelectedPayroll(null);
        }}
      />
    );
  }

  return (
    <>
      <div className="userTable">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Month & Year</th>
                <th>Date Created</th>
                <th>Status</th>
                <th>Approved Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Payroll Found
                  </td>
                </tr>
              ) : (
                currentData.map((item, idx) => (
                  <tr key={item.id} onClick={() => setSelectedPayroll(item)}>
                    <td>{startIndex + idx + 1}</td>
                    <td>
                      {new Date(item.selectedMonthYear).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                      <span
                        style={{
                          color: item.status === "Approved" ? "green" : "orange",
                          fontWeight: 600,
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{formatDate(item.approvedAt)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setItemToDelete(item);
                          setShowDeletePopup(true);
                        }}
                        style={{ background: "transparent", border: "none", cursor: "pointer" }}
                      >
                        <Trash2 size={16} color="red" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>Previous</button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>Next</button>
            </div>
          )}
        </div>
      </div>

      {showDeletePopup && (
        <div className="trip-card-popup">
          <div className="trip-card-popup-container">
            <div className="popup-content">
              <p>Delete this payroll?</p>
              <div className="btn-row-delete">
                <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
                <button
                  className="create"
                  onClick={() => {
                    onDelete?.(itemToDelete.id);
                    setShowDeletePopup(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PayrollTable;
