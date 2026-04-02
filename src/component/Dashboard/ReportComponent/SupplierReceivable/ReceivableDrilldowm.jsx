import React, { useState } from 'react';

const ReceivableDrilldowm = ({ data, goBack }) => {
  const [activeTab, setActiveTab] = useState("presale");
  const [palletPage, setPalletPage] = useState(1);
  const itemsPerPage = 5;

  // Formatters
  const formatUSD = (val) => `$${Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatNGN = (val) => `₦${Number(val || 0).toLocaleString()}`;
  const formatNumber = (val) => Number(val || 0).toLocaleString();

  // Pallet Pagination Logic
  const pallets = data?.pallets || [];
  const totalPalletPages = Math.ceil(pallets.length / itemsPerPage);
  const paginatedPallets = pallets.slice((palletPage - 1) * itemsPerPage, palletPage * itemsPerPage);

  return (
    <div className="drilldown">
      {/* 1. TOP METRICS GRID */}
      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item">
            <p className="small">Contract Amount</p>
            <h2>{formatUSD(data.contractAmount)}</h2>
          </div>

          <div className="summary-item">
            <p className="small">Actual Loaded Value</p>
            <h2>{formatUSD(data.actualLoadedValue)}</h2>
          </div>

          <div className="summary-item">
            <p className="small">Supplier Receivable</p>
            <h2 style={{ color: data.receivable > 0 ? "#581aae" : "green" }}>
              {formatUSD(data.receivable)}
            </h2>
          </div>

          <div className="summary-item">
            <p className="small">Payment Status</p>
            <h2 style={{ color: data.statusColor }}>
              {data.status}
            </h2>
          </div>
        </div>
      </div>

      {/* 2. TABBED SECTION */}
      <section style={{ background: "#fff", padding: "20px", borderRadius: "16px", marginTop: "20px" }}>
        <div className="tab-section">
          <div className="tab-header">
            <button 
              className={activeTab === "presale" ? "active" : ""} 
              onClick={() => setActiveTab("presale")}
            >
              Presale Record
            </button>
            <button 
              className={activeTab === "pallet" ? "active" : ""} 
              onClick={() => setActiveTab("pallet")}
            >
              Pallet Record ({pallets.length})
            </button>
          </div>

          <div className="tab-body" style={{ marginTop: '20px' }}>
            
            {/* TAB 1: PRESALE RECORD (TABLE FORMAT) */}
            {activeTab === "presale" && (
              <div className="userTable">
                <div className="table-wrap">
                  <table className="table" style={{ width: "130%", maxWidth: "130%" }}>
                    <thead>
                      <tr>
                        <th>Tracking Number</th>
                        <th>Container Unique ID</th>
                        <th>Presale Unique ID</th>
                        <th>Sale Option</th>
                        <th>Source Nation</th>
                        <th>Contract Pieces</th>
                        <th>Actual Loaded Pieces</th>
                        <th>Unit Price (USD)</th>
                        <th>Expected Revenue (NGN)</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr>
                       <td style={{ fontWeight: '600' }}>TRN-{data.container?.tracking_number}</td>
                      <td>{data.container?.container_unique_id}</td>
                      <td>{data.pre_sale_unique_id}</td>
                      <td>{data.sale_option}</td>
                      <td>{data.container?.source_nation || 'N/A'}</td>
                      <td>{formatNumber(data.container?.pieces)}</td>
                      <td>{formatNumber(data.container_loaded_pieces)}</td>
                      <td>{formatUSD(data.container?.unit_price_usd)}</td>
                      <td style={{ color: "green", fontWeight: "600" }}>{formatNGN(data.expected_sales_revenue)}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: PALLET RECORD (TABLE FORMAT) */}
            {activeTab === "pallet" && (
              <div className="userTable">
                <div className="table-wrap">
                  <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th>Pallet ID</th>
                        <th>Pieces per Pallet</th>
                        <th>Number of Pallets</th>
                        <th>Total Pieces</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPallets.length > 0 ? paginatedPallets.map((pallet, idx) => (
                        <tr key={pallet.id}>
                          <td>{String((palletPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                          <td>{pallet.pallet_uuid?.slice(0, 8).toUpperCase() || 'N/A'}</td>
                          <td>{formatNumber(pallet.pallet_pieces)}</td>
                          <td>{formatNumber(pallet.no_of_pallets)}</td>
                          <td style={{ fontWeight: "600" }}>{formatNumber(pallet.pallet_pieces * pallet.no_of_pallets)}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No pallet records found</td></tr>
                      )}
                    </tbody>
                  </table>
                  
                  {pallets.length > itemsPerPage && (
                    <div className="pagination">
                      <button disabled={palletPage === 1} onClick={() => setPalletPage(p => p - 1)}>Previous</button>
                      <span>Page {palletPage} of {totalPalletPages}</span>
                      <button disabled={palletPage >= totalPalletPages} onClick={() => setPalletPage(p => p + 1)}>Next</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="btn-row">
        <button className="cancel" onClick={goBack}>Previous</button>
      </div>
    </div>
  );
};

export default ReceivableDrilldowm;