import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

const PayableTable = ({ data, onRowClick, goBack }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    return data.filter(t => 
      t.trip_unique_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return (
    <div className="userTable">
      <div className="top-content">
        <div className="right-wrapper">
          <div className="right-wrapper-input">
            <Search className="input-icon" />
            <input 
              type="text" 
              placeholder="Search Trip ID or Title..." 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table" style={{ width: "100%",maxWidth:"100%", }}>
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
            {filtered.map((trip, idx) => (
              <tr key={trip.id} onClick={() => onRowClick(trip)} style={{ cursor: "pointer" }}>
                <td>{idx + 1}</td>
                <td>{trip.trip_unique_id}</td>
                <td>{trip.title}</td>
                <td>{trip.location}</td>
                <td>{trip.start_date} </td>
                <td> {trip.end_date}</td>
                <td>{trip.creator_info?.firstname}</td>
                <td>
                  <span style={{ color: trip.balanceUSD <= 0 ? "green" : "orange" }}>
                    {trip.balanceUSD <= 0 ? "Settled" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="btn-row" style={{ marginTop: '20px' }}>
        <button className="cancel" onClick={goBack}>Previous</button>
      </div>
    </div>
  );
};

export default PayableTable;