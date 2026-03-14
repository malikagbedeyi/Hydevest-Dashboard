import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

const DebtTable = ({ data, onRowClick, goBack }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return data.filter(c => 
      c.customerName.toLowerCase().includes(search.toLowerCase()) || 
      c.customerPhone.includes(search)
    );
  }, [data, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="userTable">
      <div className="top-content">
        <div className="top-content-wrapper">
          <div className="right-wrapper">
            <div className="right-wrapper-input">
              <Search className="input-icon" />
              <input placeholder="Search customer name or number..." onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}} />
            </div>
          </div>
        </div>
      </div>
      <div className="table-wrap">
        <table className="table" style={{ maxWidth: "100%", width: "100%", minWidth: "100%" }}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Total Sale Amount</th>
              <th>Amount Paid</th>
              <th>Outstanding</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, idx) => (
              <tr key={row.customerId} onClick={() => onRowClick(row)} style={{ cursor: "pointer" }}>
                <td>{String((currentPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                <td>{row.customerUniqueId}</td>
                <td>{row.customerName}</td>
                <td>{row.customerPhone}</td>
                <td>₦{row.totalSaleAmount.toLocaleString()}</td>
                <td>₦{row.totalAmountPaid.toLocaleString()}</td>
                <td style={{ color: 'red', fontWeight: '600' }}>₦{row.outstanding.toLocaleString()}</td>
                <td>
                  <span style={{ color: row.outstanding <= 0 ? "green" : "orange" }}>
                    {row.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
            <span>{currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>
      <div className="btn-row" style={{ marginTop: '20px' }}>
        <button className="cancel" onClick={goBack}>Previous</button>
      </div>
    </div>
  );
};

export default DebtTable;