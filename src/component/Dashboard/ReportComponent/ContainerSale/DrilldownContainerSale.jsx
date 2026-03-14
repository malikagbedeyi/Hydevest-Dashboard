import React, { useState, useMemo } from 'react'
import '../../../../assets/Styles/dashboard/drilldown.scss'
import '../../../../assets/Styles/dashboard/table.scss'

const DrilldownContainerSale = ({formatDate, data, goBack, sales = [], presales = [], recoveries = [] }) => {
  const [activeTab, setActiveTab] = useState("sales");

const [salesPage, setSalesPage] = useState(1);
  const [recoveryPage, setRecoveryPage] = useState(1);
  const itemsPerPage = 5;

const presaleAmount = useMemo(() => {
    const found = presales.find(p => p.container_one_id === data.containerId || p.container_two_id === data.containerId);
    return found ? Number(found.expected_sales_revenue) || 0 : 0;
  }, [presales, data.containerId]);

  const containerSales = useMemo(() => {
    return sales.filter(sale => sale.container_id === data.containerId);
  }, [sales, data.containerId]);

  const containerRecoveries = useMemo(() => {
    return recoveries.filter(rec => rec.container_id === data.containerId);
  }, [recoveries, data.containerId]);


  const paginatedSales = useMemo(() => {
    return containerSales.slice((salesPage - 1) * itemsPerPage, salesPage * itemsPerPage);
  }, [containerSales, salesPage]);

  const paginatedRecoveries = useMemo(() => {
    return containerRecoveries.slice((recoveryPage - 1) * itemsPerPage, recoveryPage * itemsPerPage);
  }, [containerRecoveries, recoveryPage]);
    
  const formatMoneyNGN = (value) =>
    value === undefined || value === null 
      ? "₦0.00" 
      : "₦" + Number(value).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  return (
    <div className="drilldown">
      <div className="drill-summary-grid">
        <div className="drill-summary">
                    <div className="summary-item">
            <p className='small'>Expected Revenue (presale)</p>
            <h2>{formatMoneyNGN(presaleAmount)}</h2>
          </div>
          <div className="summary-item">
            <p className='small'> Sales to Date</p>
            <h2>{formatMoneyNGN(data.totalSaleAmount)}</h2>
          </div>
          <div className="summary-item">
            <p className='small'> Recovery to Date</p>
            <h2>{formatMoneyNGN(data.SamountPaid)}</h2>
          </div>
          <div className="summary-item">
            <p className='small'>Amount Receivable</p> 
            <h2 style={{ color: data.balance > 0 ? "orange" : "green" }}>
              {data.balance === 0 ? "Fully Paid" : formatMoneyNGN(data.balance)}
            </h2>
          </div>
           <div className="summary-item">
            <p className='small'> UnSold  Stock</p>
            <h2>{formatMoneyNGN(0)}</h2>
          </div>
        </div>
      </div>

      <section style={{ background: "#fff", padding: "20px", borderRadius: "16px", marginTop: "20px" }}>
        <div className="tab-section">
          <div className="tab-header">
            <button
              className={activeTab === "sales" ? "active" : ""}
              onClick={() => setActiveTab("sales")}
            >
              Sale Records ({containerSales.length})
            </button>

            <button
              className={activeTab === "recovery" ? "active" : ""}
              onClick={() => setActiveTab("recovery")}
            >
              Recovery Records ({containerRecoveries.length})
            </button>
          </div>

          {activeTab === "sales" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ maxWidth: "100%", width:"100%",minWidth:"100%" }}>
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>Sale ID</th>
                      <th>Customer</th>
                      <th>Sale Option</th>
                      <th>Total Sale Amount</th>
                      <th>Amount Paid</th>
                      <th>Payment Method</th>
                      <th>Payment Status</th>
                      <th>Date Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSales.length === 0 ? (
                      <tr><td colSpan="7" style={{ textAlign: 'center' }}>No records</td></tr>
                    ) : (
                      paginatedSales.map((sale, idx) => (
                        <tr key={sale.id}>
                           <td>{String(idx + 1).padStart(2, "0")}</td>
                          <td>{sale.sale_unique_id}</td>
                          <td>{sale.customer?.firstname} {sale.customer?.lastname}</td>
                          <td>{sale.presale?.sale_option || "—"}</td>
                          <td>{formatMoneyNGN(sale.total_sale_amount)}</td>
                          <td>{formatMoneyNGN(sale.amount_paid)}</td>
                          <td>{sale.sale_payments?.[0]?.payment_method || "N/A"}</td>
                          <td style={{color: sale.payment_status === "Full Payment" ? "green" : "orange"}}>{sale.payment_status}</td>
                          <td>{formatDate(sale.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {containerSales.length > itemsPerPage && (
                  <div className="pagination">
                    <button disabled={salesPage === 1} onClick={() => setSalesPage(p => p - 1)}>Prev</button>
                    <span>{salesPage} / {Math.ceil(containerSales.length / itemsPerPage)}</span>
                    <button disabled={salesPage * itemsPerPage >= containerSales.length} onClick={() => setSalesPage(p => p + 1)}>Next</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "recovery" && (
            <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ maxWidth: "100%", width:"100%",minWidth:"100%" }}>
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>Recovery ID</th>
                      <th>Sale Ref</th>
                      <th>Customer</th>
                      <th>Amount Paid</th>
                      <th>Payment Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                   {paginatedRecoveries.map((rec, idx) => (
                        <tr key={rec.id}>
                          <td>{String(idx + 1).padStart(2, "0")}</td>
                          <td>{rec.recovery_unique_id}</td>
                          <td>{rec.sale?.sale_unique_id}</td>
                          <td>{rec.customer?.firstname} {rec.customer?.lastname}</td>
                          <td style={{ color: 'green' }}>{formatMoneyNGN(rec.amount)}</td>
                          <td style={{color: rec.payment_status === "Balance Payment" ? "green" : "orange"}}>{rec.payment_status}</td>
                          <td>{formatDate(rec.created_at)}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
                {containerRecoveries.length > itemsPerPage && (
                  <div className="pagination">
                    <button disabled={recoveryPage === 1} onClick={() => setRecoveryPage(p => p - 1)}>Prev</button>
                    <span>{recoveryPage} / {Math.ceil(containerRecoveries.length / itemsPerPage)}</span>
                    <button disabled={recoveryPage * itemsPerPage >= containerRecoveries.length} onClick={() => setRecoveryPage(p => p + 1)}>Next</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="btn-row" style={{ marginTop: '20px' }}>
          <button className="cancel" onClick={goBack}>Previous</button>
        </div>
      </section>
    </div>
  )
}

export default DrilldownContainerSale;