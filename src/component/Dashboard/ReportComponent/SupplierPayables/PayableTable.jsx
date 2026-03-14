import React, { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";

const PayableTable = ({ data, onRowClick, goBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilters, setDateFilters] = useState({ from: "", to: "" });
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return data.filter(t => {
      const matchesSearch = t.trip_unique_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const itemDate = new Date(t.start_date);
      const matchesFrom = dateFilters.from ? itemDate >= new Date(dateFilters.from) : true;
      const matchesTo = dateFilters.to ? itemDate <= new Date(dateFilters.to) : true;

      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [data, searchTerm, dateFilters]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="top-content">
        <div className="top-content-wrapper">
          <div className="right-wrapper">
            <div className="right-wrapper-input">
              <Search className="input-icon" />
              <input placeholder="Search Trip..." onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} />
            </div>
            <div className="select-input">
              <div className="filter" onClick={() => setShowFilters(!showFilters)}>
                <span>Date Filter</span>
                <Filter size={16} />
              </div>
            </div>
          </div>
        </div>
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-item">
              <input type="date" value={dateFilters.from} onChange={(e) => setDateFilters(prev => ({...prev, from: e.target.value}))} />
            </div>
            <div className="filter-item">
              <input type="date" value={dateFilters.to} onChange={(e) => setDateFilters(prev => ({...prev, to: e.target.value}))} />
            </div>
            <button style={{margin:"0", display:"flex", color:"#581aae",background:"#fff" ,border:"1px solid #581aae",padding:".8vw 1vw",borderRadius:".8vw",alignItems:"center",justifyContent:"center"}}
             className="create" onClick={() => setDateFilters({from: "", to: ""})}>Clear</button>
          </div>
        )}
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
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((trip, idx) => (
                <tr key={trip.id} onClick={() => onRowClick(trip)} style={{ cursor: "pointer" }}>
                  <td>{String((currentPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                  <td>{trip.trip_unique_id}</td>
                  <td>{trip.title}</td>
                  <td>{trip.location}</td>
                  <td>{trip.start_date}</td>
                  <td><span style={{ color: trip.displayStatusColor }}>{trip.displayStatus}</span></td>
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
        <div className="btn-row"><button className="cancel" onClick={goBack}>Previous</button></div>
      </div>
    </>
  );
};

export default PayableTable;