import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

const ReceivableTable = ({ data, onRowClick, goBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return data.filter(item => 
      item.container?.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pre_sale_unique_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatUSD = (val) => `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <>
      <div className="top-content">
        <div className="right-wrapper">
          <div className="right-wrapper-input">
            <Search className="input-icon" />
            <input placeholder="Search Tracking No..." onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="userTable">
        <div className="table-wrap">
          <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Tracking Number</th>
                <th> Amount</th>
                <th>Actual Loaded Value</th>
                <th>Supplier Receivable</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => (
                <tr key={item.id} onClick={() => onRowClick(item)} style={{ cursor: "pointer" }}>
                  <td>{String((currentPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                  <td>TRN-{item.container?.tracking_number}</td>
                  <td>{formatUSD(item.contractAmount)}</td>
                  <td>{formatUSD(item.actualLoadedValue)}</td>
                  <td style={{fontWeight: 'bold'}}>{formatUSD(item.receivable)}</td>
                  <td><span style={{ color: item.statusColor }}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
              <span>{currentPage} / {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
            </div>
          )}
        </div>
        <div className="btn-row"><button className="cancel" onClick={goBack}>Previous</button></div>
      </div>
    </>
  );
};

export default ReceivableTable;