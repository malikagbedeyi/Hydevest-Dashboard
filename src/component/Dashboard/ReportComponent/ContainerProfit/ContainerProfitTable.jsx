import React, { useState, useMemo } from "react";
import { Search, Calendar } from "lucide-react";

const ContainerProfitTable = ({ data, onRowClick, goBack, dateRange, setDateRange }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return data.filter(c => 
      c.tracking_number?.toLowerCase().includes(search.toLowerCase()) || 
      c.container_unique_id?.toLowerCase().includes(search.toLowerCase()) ||
      c.trip?.trip_unique_id?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="top-content">
        <div className="top-content-wrapper">
          <div className="right-wrapper" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            
            {/* Search Input */}
            <div className="right-wrapper-input">
              <Search className="input-icon" />
              <input 
                placeholder="Search Tracking No or Trip ID..." 
                onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}} 
              />
            </div>

            {/* ✅ Date Range Filters */}
            <div className="date-filter-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '5px 15px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <Calendar size={16} color="#581aae" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '10px', color: '#666' }}>Trip End From</label>
                <input 
                  type="date" 
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({...prev, from: e.target.value}))}
                  style={{ border: 'none', outline: 'none', fontSize: '12px' }}
                />
              </div>
              <span style={{ color: '#ccc' }}>|</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '10px', color: '#666' }}>To</label>
                <input 
                  type="date" 
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({...prev, to: e.target.value}))}
                  style={{ border: 'none', outline: 'none', fontSize: '12px' }}
                />
              </div>
              {(dateRange.from || dateRange.to) && (
                <button 
                  onClick={() => setDateRange({ from: "", to: "" })}
                  style={{ border: 'none', background: 'none', color: 'red', fontSize: '12px', cursor: 'pointer', marginLeft: '5px' }}
                >
                  Clear
                </button>
              )}
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
                <th>Tracking No</th>
                <th>Landing Cost</th>
                <th>Expected Revenue</th>
                <th>Expected Profit</th>
                <th>Actual Revenue</th>
                <th>Actual Profit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? currentItems.map((row, idx) => (
                <tr key={row.id || idx} onClick={() => onRowClick(row)} style={{ cursor: "pointer" }}>
                  <td>{String((currentPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                  <td>{row.trip?.trip_unique_id}</td>
                  <td>TRN-{row.tracking_number}</td>
                  <td>₦{row.landingCost.toLocaleString()}</td>
                  <td>₦{row.expectedRevenue.toLocaleString()}</td>
                  <td style={{color: row.expectedProfit >= 0 ? 'green' : 'red'}}>₦{row.expectedProfit.toLocaleString()}</td>
                  <td>₦{row.actualRevenue.toLocaleString()}</td>
                  <td style={{color: row.actualProfit >= 0 ? 'green' : 'red'}}>₦{row.actualProfit.toLocaleString()}</td>
                  <td style={{color:"orange"}}>{"In-progress"}</td>
                </tr>
              )) : (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>No records found for the selected period.</td></tr>
              )}
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
        <div className="btn-row" style={{marginTop: '20px'}}><button className="cancel" onClick={goBack}>Previous</button></div>
      </div>
    </>
  );
};
  

export default ContainerProfitTable;