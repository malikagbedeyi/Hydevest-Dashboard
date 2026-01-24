import React, { useState } from 'react'
import '../../../../assets/Styles/dashboard/drilldown.scss'
import '../../../../assets/Styles/dashboard/table.scss'


const DrilldownContainerSale = ({ data, goBack , sales, presales, recoveries, }) => {

  const [activeTab, setActiveTab] = useState("sales");

  const presaleAmount = presales
  .filter(p => p.containerNames?.includes(data.containerName))
  .reduce((sum, p) => sum + (Number(p.expectedRevenue) || 0), 0);
  const containerSales = sales.filter(sale =>
    sale.containers?.some(c => c.containerId === data.containerId)
  );
  
  const containerSaleIds = containerSales.map(s => s.id);

  const containerRecoveries = recoveries.filter(r =>
    containerSaleIds.includes(r.saleId)
  );
    
  const formatMoneyNGN = (value) =>
  value === "" ? "" : "₦" + Number(value).toLocaleString("en-NG");
  const formatNumber = (value) =>
  value === "" ? "" : Number(value).toLocaleString("en-NG");
    return (
      <div className="drilldown">
        <div className="drill-summary-grid">
            <div className="drill-summary">
            <div className="summary-item">
            <p>Con Tracking Number</p>
            <h2>
              TN{data.trackingNumber || 'TN0'}
            </h2>
          </div>
          <div className="summary-item">
            <p>Total Sale Amountt</p>
            <h2>₦{data.totalSaleAmount.toLocaleString()}</h2>
          </div>
          <div className="summary-item">
            <p>Total Recovery Amount</p>
            <h2>₦{data.amountPaid.toLocaleString()}</h2>
          </div>
          <div className="summary-item">
            <p>Outstanding Balance</p>
            <h2>
            ₦{data.balance === 0 ? "Fully Paid" : data.balance.toLocaleString()}
            </h2>
          </div>
          <div className="summary-item">
            <p>Presale Amount</p>
            <h2>
            ₦{formatMoneyNGN(presaleAmount)}
            </h2>
          </div>
          </div>
        </div>
      {/* <div className="section-grid"> */}
        <section style={{background:"#fff",padding:"20px",borderRadius:"16px"}}>
            {/* <div className="section-head">
            <h3> Container Sale Report</h3>
          </div> */}
          <div className="tab-section">
          <div className="tab-header">
  <button
    className={activeTab === "sales" ? "active" : ""}
    onClick={() => setActiveTab("sales")}
  >
    Sale Records
  </button>

  <button
    className={activeTab === "recovery" ? "active" : ""}
    onClick={() => setActiveTab("recovery")}
  >
    Recovery Records
  </button>
</div>
{activeTab === "sales" && (
       <div className="userTable">
       <div className="table-wrap">
  <table className="table" style={{width:"100%",minWidth:"100%",maxWidth:"100%",}}>
    <thead>
      <tr>
        <th>Container</th>
        <th>No. of Pallets</th>
        <th>Purchase Price Per Piece</th>
        <th>Customer Name</th>
        <th>Customer Phone</th>
        <th>Date Created</th>
      </tr>
    </thead>
    <tbody>
      {containerSales.map(sale => (
        <tr key={sale.id}>
          <td>{data.containerName}</td>
          <td>{sale.noOfPallets}</td>
          <td>{sale.purchasePricePerPiece.toLocaleString()}</td>
          <td>{sale.customer?.name}</td>
          <td>{sale.customer?.phone}</td>
          <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>
  </div>
)}
{activeTab === "recovery" && (
       <div className="userTable">
       <div className="table-wrap">
  <table className="table" style={{width:"100%",minWidth:"100%",maxWidth:"100%",}}>
    <thead>
      <tr>
        <th>Sale ID</th>
        <th>Customer Name</th>
        <th>Phone</th>
        <th>Amount Paid</th>
        <th>Balance</th>
        <th>Payment Date</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {containerRecoveries.map(rec => (
        <tr key={rec.id}>
          <td>{rec.saleId}</td>
          <td>{rec.customerName}</td>
          <td>{rec.customerPhone}</td>
          <td>{rec.amountPaid.toLocaleString()}</td>
          <td>{rec.balanceAfter === 0 ? "Fully Paid" : rec.balanceAfter.toLocaleString()}</td>
          <td>{new Date(rec.createdAt).toLocaleDateString()}</td>
          <td>{rec.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>
  </div>
)}

          </div>

 {/* ===== FOOTER ===== */}
            <div className="btn-row">
          <button className="cancel" onClick={goBack}>
            Previous
          </button>
        </div>
        </section>
      {/* </div> */}
    </div>

  )
}

export default DrilldownContainerSale
