import React, { useState } from 'react';

const ReceivableDrilldowm = ({ trip, goBack }) => {
  const [activeTab, setActiveTab] = useState("containers");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Formatters
  const formatUSD = (val) => `$${Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatNumber = (val) => Number(val || 0).toLocaleString();

  // Pagination for the inner table
  const totalItems = trip.tripPresales.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentData = trip.tripPresales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="drilldown">
      {/* 1. TRIP SUMMARY GRID */}
      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item"><p className="small">Shortfall Pieces</p><h2>{formatNumber(trip.totalPieces - trip.totalLoaderPieces)}</h2></div>
          <div className="summary-item"><p className="small">Total Purchase Pieces</p><h2>{formatUSD(trip.totalPieces)}</h2></div>
          <div className="summary-item"><p className="small">Total Loaded Pieces</p><h2>{formatUSD(trip.totalLoaderPieces)}</h2></div>
          <div className="summary-item">
            <p className="small">Total Shortfall</p>
            <h2 style={{color: trip.receivable > 0 ? '#581aae' : 'green'}}>{formatUSD(trip.receivable)}</h2>
          </div>
        </div>
      </div>

      <section style={{ background: "#fff", padding: "20px", borderRadius: "16px", marginTop: "20px" }}>
        <div className="tab-section">
          <div className="tab-header">
            <button 
              className={activeTab === "containers" ? "active" : ""} 
              onClick={() => setActiveTab("containers")}
            >
              Containers ({totalItems})
            </button>
          </div>

          <div className="tab-body" style={{ marginTop: '20px' }}>
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Container ID</th>
                      <th>Tracking No</th>
                      <th>Purchase Pieces</th>
                      <th>Loaded Pieces</th>
                       <th>Shortfall Pieces</th>
                      <th>Unit Price</th>
                      <th>Shortfall ($)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((p, idx) => {
                      const contractVal = Number(p.container?.pieces || 0) * Number(p.container?.unit_price_usd || 0);
                      const loadedVal = Number(p.container_loaded_pieces || 0) * Number(p.container?.unit_price_usd || 0);
                      const rowShortfall = contractVal - loadedVal;
                      const shortfallPieces = Number(p.container?.pieces || 0) - Number(p.container_loaded_pieces || 0)
                      const serialNumber = ((currentPage - 1) * itemsPerPage) + (idx + 1);

                      return (
                        <tr key={p.id}>
                          <td>{String(serialNumber).padStart(2, '0')}</td>
                          <td>{p.container?.container_unique_id}</td>
                          <td>TRN-{p.container?.tracking_number}</td>
                          <td>{formatNumber(p.container?.pieces)}</td>
                          <td>{formatNumber(p.container_loaded_pieces)}</td>
                          <td>{formatNumber(shortfallPieces)}</td>
                          <td>{formatUSD(p.container?.unit_price_usd)}</td>
                          <td style={{ fontWeight: '600' }}>{formatUSD(rowShortfall)}</td>
                          <td>
                            <span style={{ color: rowShortfall <= 0 ? "green" : "orange" }}>
                              {rowShortfall <= 0 ? "Settled" : "Outstanding"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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
            </div>
          </div>
        </div>
      </section>

      <div className="btn-row" style={{marginTop: '20px'}}>
        <button className="cancel" onClick={goBack}>Back to Table</button>
      </div>
    </div>
  );
};

export default ReceivableDrilldowm;