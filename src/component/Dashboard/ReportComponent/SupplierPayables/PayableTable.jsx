import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

const PayableTable = ({ data, onRowClick, goBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return data.filter(t => 
      t.trip_unique_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="top-content">
        <div className="top-content-wrapper">
          <div className="right-wrapper">
            <div className="right-wrapper-input">
              <Search className="input-icon" />
              <input 
                type="text" 
                placeholder="Search Trip ID or Title..." 
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} 
              />
            </div>
          </div>
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
                <th>Location</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Created By</th>
                <th>Payable Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((trip, idx) => (
                <tr key={trip.id} onClick={() => onRowClick(trip)} style={{ cursor: "pointer" }}>
                  <td>{String((currentPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                  <td>{trip.trip_unique_id}</td>
                  <td>{trip.title}</td>
                  <td>{trip.location}</td>
                  <td>{trip.start_date} </td>
                  <td> {trip.end_date}</td>
                  <td>{trip.creator_info?.firstname} {trip.creator_info?.lastname}</td>
                  <td>
                    <span style={{ color: trip.displayStatusColor, fontWeight: '600' }}>
                      {trip.displayStatus}
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
    </>
  );
};

export default PayableTable;