import React, { useState } from 'react'
import { Plus, X, Edit, Trash2, ChevronDown, ChevronUp, Paperclip } from "lucide-react";

const TripExpenseData = ({handleRowClick,currentData , openDeletePopup , financeData}) => {
   

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
  
    const totalPages = Math.ceil(financeData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFinance = financeData.slice(startIndex, startIndex + itemsPerPage);
  
    const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

    const formatCurrency = (value, currencyCode) => {
        const SAFE_CURRENCY_CODES = ["USD", "GBP", "EUR", "CAD", "AUD", "JPY", "CNY", "ZAR", "GHS", "NGN",];
      
        const safeCode = SAFE_CURRENCY_CODES.includes(currencyCode)
          ? currencyCode
          : "USD"; // fallback
      
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: safeCode,
          minimumFractionDigits: 2,
        }).format(Number(value || 0));
      };
      
  
  const formatNGN = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(Number(value || 0));

  const formatDate = (date) =>
    date
      ? new Date(date)
          .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          .replace(/ /g, "-")
      : "-";


  return (
    <div>
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
                      <th>Amount</th>
                      <th>Currency</th>
                      <th>Rate</th>
                      <th>Amount (NGN)</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan="11" style={{ textAlign: "center" }}>
                          No Trip Expense Data Found
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
                          <td>{formatCurrency(item.amount, item.currency)}</td>
                          <td>{item.currencySymbol} {item.currency}</td>

                           <td>{item.rate}</td>
                            <td>{formatNGN(item.amountNGN)}</td>
                            <td>{item.check||"other"}</td>
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
    </div>
  )
}

export default TripExpenseData
