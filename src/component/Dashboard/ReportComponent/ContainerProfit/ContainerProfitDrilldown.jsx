import React, { useState } from 'react';

const ContainerProfitDrilldown = ({ data, goBack }) => {
  const [activeTab, setActiveTab] = useState("presale");
  const [salesPage, setSalesPage] = useState(1);
  const itemsPerPage = 5; // Smaller number for drilldown views

  const formatMoney = (val) => "₦" + Number(val).toLocaleString("en-NG");

  // Pagination Logic for Sales Tab
  const totalSalesPages = Math.ceil(data.saleRecords.length / itemsPerPage);
  const paginatedSales = data.saleRecords.slice((salesPage - 1) * itemsPerPage, salesPage * itemsPerPage);

  return (
    <div className="drilldown">
      <div className="section-report-head"><h3>Profit Analysis: TRN-{data.tracking_number}</h3></div>
      
      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item"><p className="small">Landing Cost</p><h2>{formatMoney(data.landingCost)}</h2></div>
          <div className="summary-item"><p className="small">Actual Revenue</p><h2>{formatMoney(data.actualRevenue)}</h2></div>
          <div className="summary-item"><p className="small">Net Profit</p><h2 style={{color: data.actualProfit >= 0 ? 'green' : 'red'}}>{formatMoney(data.actualProfit)}</h2></div>
        </div>
      </div>

      <section style={{ background: "#fff", padding: "20px", borderRadius: "16px", marginTop: "20px" }}>
        <div className="tab-section">
          <div className="tab-header">
            <button className={activeTab === "presale" ? "active" : ""} onClick={() => setActiveTab("presale")}>Presale Record</button>
            <button className={activeTab === "sales" ? "active" : ""} onClick={() => setActiveTab("sales")}>Sale Records ({data.saleRecords.length})</button>
          </div>

          {activeTab === "presale" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
                  <thead>
                    <tr>
                      <th>Presale ID</th>
                      <th>Sale Option</th>
                      <th>WC Pieces</th>
                      <th>Price Per Pic</th>
                      <th>Expected Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.presaleRecord ? (
                      <tr>
                        <td>{data.presaleRecord.pre_sale_unique_id}</td>
                        <td>{data.presaleRecord.sale_option}</td>
                        <td>{data.presaleRecord.wc_pieces}</td>
                        <td>{formatMoney(data.presaleRecord.price_per_piece)}</td>
                        <td>{formatMoney(data.presaleRecord.expected_sales_revenue)}</td>
                      </tr>
                    ) : (
                      <tr><td colSpan="5" style={{textAlign:'center'}}>No Presale Found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "sales" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ width: "100%", maxWidth: "100%" }}>
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Sale ID</th>
                      <th>Customer</th>
                      <th>Amount Paid</th>
                      <th>Total Sale Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSales.length > 0 ? paginatedSales.map((s, idx) => (
                      <tr key={s.id}>
                        <td>{String((salesPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}</td>
                        <td>{s.sale_unique_id}</td>
                        <td>{s.customer?.firstname} {s.customer?.lastname}</td>
                        <td>{formatMoney(s.amount_paid)}</td>
                        <td>{formatMoney(s.total_sale_amount)}</td>
                        <td>{new Date(s.created_at).toLocaleDateString()}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="6" style={{textAlign:'center'}}>No Sales Recorded</td></tr>
                    )}
                  </tbody>
                </table>
                {totalSalesPages > 1 && (
                  <div className="pagination">
                    <button disabled={salesPage === 1} onClick={() => setSalesPage(p => p - 1)}>Previous</button>
                    <span>{salesPage} / {totalSalesPages}</span>
                    <button disabled={salesPage === totalSalesPages} onClick={() => setSalesPage(p => p + 1)}>Next</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="btn-row" style={{marginTop: '20px'}}><button className="cancel" onClick={goBack}>Back to Report</button></div>
      </section>
    </div>
  );
};

export default ContainerProfitDrilldown;