import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

const ReceivableTable = ({ data, onRowClick, goBack }) => {
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => data.filter(t => 
    t.title?.toLowerCase().includes(search.toLowerCase()) || 
    t.trip_unique_id?.toLowerCase().includes(search.toLowerCase())
  ), [data, search]);

  const currentItems = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const formatUSD = (val) => `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    const formatNumber = (val) => Number(val || 0).toLocaleString();

  return (
    <>
      <div className="top-content">
        <div className="right-wrapper-input">
          <Search className="input-icon" />
          <input placeholder="Search Trip ID or Title..." onChange={(e) => {setSearch(e.target.value); setPage(1);}} />
        </div>
      </div>
      <div className="userTable">
        <div className="table-wrap">
          <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Trip ID</th>
                <th>Title</th>
                <th> Purchase Pieces</th>
                <th> Loaded Pieces</th>
                <th> Shortfall</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((trip, idx) => (
                <tr key={trip.id} onClick={() => onRowClick(trip)} style={{ cursor: "pointer" }}>
                  <td>{String((page - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                  <td>{trip.trip_unique_id}</td>
                  <td>{trip.title}</td>
                  <td>{formatNumber(trip.totalPieces)}</td>
                  <td>{formatNumber(trip.totalLoaderPieces)}</td>
                  <td>{formatNumber(trip.receivable)}</td>
                  <td style={{ color:trip.progress === "COMPLETED" ? "green" : trip.progress === "NOT STARTED" ? "red" : "orange"   }}>{trip.progress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="btn-row"><button className="cancel" onClick={goBack}>Previous</button></div>
      </div>
    </>
  );
};

export default ReceivableTable;