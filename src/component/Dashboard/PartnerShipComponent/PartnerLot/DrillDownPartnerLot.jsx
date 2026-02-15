import React, { useState,useRef, useEffect, useMemo } from "react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import {ChevronLeft,ChevronDown, ChevronUp, Paperclip, Download,  Edit,  Trash2,  X,  Eye,  File,  Plus, Calendar, SendHorizontal} from "lucide-react";

const fundingOption = ["partner" ," entity "]

const DrillDownPartnerLot = ({ data,onCancel }) => {
    const allocations = data.allocations || [];  
    const [showDetails, setShowDetails] = useState(true);
    const [showInvestment, setShowInvestment] = useState(true);
    const [showProfit, setShowProfit] = useState(true);
    const [showRemittance, setShowRemittance] = useState(true);
    const allocationRows = data.allocations || [];
    const [activeTab, setActiveTab] = useState("details"); // default tab
    const [tableTab, setTableTab] = useState("container");
    
const derived = useMemo(() => {
  const totalContainers = allocationRows.length;

  const totalInvestment = allocationRows.reduce(
    (s, a) => s + Number(a.amount || 0),
    0
  );

  return {
    totalContainers,
    totalInvestment,
  };
}, [allocationRows]);

const createdYear = useMemo(() => {
  if (!data.createdAt) return "—";
  return new Date(data.createdAt).getFullYear();
}, [data.createdAt]);

  return (
  <div className="drilldown" >
      {/* HEADER */}
      <div className="drill-summary-grid">
      <div className="drill-summary">
      <div className="summary-item">
  <p className="small">Total Completed Container</p>
  <h2>{data.completedContainers}</h2>
</div>

<div className="summary-item">
  <p className="small">Total Containers</p>
  <h2>{data.totalContainers}</h2>
</div>

<div className="summary-item">
  <p className="small">Total Completed Investment</p>
  <h2>
    {data.completedInvestment.toLocaleString("en-NG")}
  </h2>
</div>

<div className="summary-item">
  <p className="small">Total In-Progress Investment</p>
  <h2>
    {data.inTransitInvestment.toLocaleString("en-NG")}
  </h2>
</div>
    
<div className="summary-item">
  <p className="small">Earned Profit</p>
<h2>----</h2>
</div>

        </div> </div>
        <div className="tab-section" >
          <div className="tab-header" style={{background:"#fff",}}>
            <button  className={activeTab === "details" ? "active-request" : ""} style={{fontSize:"1.1vw"}}
              onClick={() => setActiveTab("details")} > Details  </button>

            <button  className={activeTab === "request" ? "active-request" : ""} 
             onClick={() => setActiveTab("request")}> Request
              </button>
          </div>
 
</div>
{activeTab === "details" && (
    <div className="section-grid">
    <div className="readOnly-details">
  <div className="readOnly-wrapper">
    <div className="readOnly-content">
      <h4>{data.name}</h4>
      <span>{data.phone}</span>
      <span>{data.email}</span>
    </div>

    <div className="readOnly-content">
      <h5>Available for container</h5>
      <p>—</p>
      <p>
        {data.assigneeType === "partner" ? "Partner" : "Entity"} Since{" "}
        {createdYear}
      </p>
    </div>
  </div>
</div>

      <div className="section-grid-container">
        <div className="section-grid-content">
      {/* ================= DETAILS ================= */}
      <section className="section details">
      <header className="section-head">
          <h3>Container</h3>
          <button className="section-head-icon" 
          onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? <ChevronUp /> : <ChevronDown />}
          </button>
        </header>
        {showDetails && (
            <div className="">
         <div className="grid-2">
         <div className="form-group">
                <label htmlFor="">	Total Container</label>
                <input type="text"  value={data.totalContainers}  readOnly/>
            </div>
         <div className="form-group">
                <label htmlFor="">Sales Completed</label>
                <input type="text" value={data.completedContainers} readOnly />
            </div>
            <div className="form-group">
                <label htmlFor="">	Pre-Sold Containers</label>
                <input type="text" value={data.presoldContainer}  readOnly />
            </div>
            <div className="form-group">
                <label htmlFor="">In Transit</label>
                <input type="text" value={data.inTransitContainers}  readOnly/>
            </div>
         </div>
              </div>
        )}

      </section>
      <section className="section details">
      <header className="section-head">
          <h3>Investment(NGN)</h3>
          <button className="section-head-icon" 
          onClick={() => setShowInvestment(!showInvestment)}>
            {showInvestment ? <ChevronUp /> : <ChevronDown />}
          </button>
        </header>
        {showInvestment && (
            <div className="">
         <div className="grid-2">
         <div className="form-group">
                <label htmlFor="">	Total Investment Amount</label>
                <input type="text"  value={data.totalInvestment.toLocaleString("en-NG")} readOnly/>
            </div>
         <div className="form-group">
                <label htmlFor="">Sales Completed</label>
                <input type="text"  value={data.completedInvestment.toLocaleString("en-NG")}readOnly />
            </div>
            <div className="form-group">
                <label htmlFor="">	Pre Sold Containers</label>
                <input type="text" value={data.presoldContainerAmount}  readOnly />
            </div>
            <div className="form-group">
                <label htmlFor="">In Transit</label>
                <input type="text"  value={data.inTransitInvestment.toLocaleString("en-NG")}  readOnly/>
            </div>
         </div>
              </div>
        )}

      </section>
      <section className="section details">
      <header className="section-head">
          <h3>Profit</h3>
          <button className="section-head-icon" 
          onClick={() => setShowProfit(!showProfit)}>
            {showProfit ? <ChevronUp /> : <ChevronDown />}
          </button>
        </header>
        {showProfit && (
            <div className="">
         <div className="grid-2">
         <div className="form-group">
                <label htmlFor="">Profit Gain</label>
                <input type="text"  value={data.profitGain}  readOnly/>
            </div>
         <div className="form-group">
                <label htmlFor="">Earn Profit</label>
                <input type="text" value={data.earnProfit} readOnly />
            </div>
            <div className="form-group">
                <label htmlFor="">	Expected Profit</label>
                <input type="text" value={data.expectedProfit}  readOnly />
            </div>
         </div>
              </div>
        )}

      </section>
      <section className="section details">
      <header className="section-head">
          <h3>Remittance</h3>
          <button className="section-head-icon" 
          onClick={() => setShowRemittance(!showRemittance)}>
            {showRemittance ? <ChevronUp /> : <ChevronDown />}
          </button>
        </header>
        {showRemittance && (
            <div className="">
         <div className="grid-2">
         <div className="form-group">
                <label htmlFor="">Outstanding Withdrawal Balance</label>
                <input type="text"  value={data.withdrawalBalance}  readOnly/>
            </div>
         <div className="form-group">
                <label htmlFor="">Total Amount Earned</label>
                <input type="text" value={data.amountEarned} readOnly />
            </div>
            <div className="form-group">
                <label htmlFor="">Total Amount Withdrawal</label>
                <input type="text" value={data.withdrawalAmount}  readOnly />
            </div>
         </div>
              </div>
        )}

      </section>
      <section>
      <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{width:"130%", maxWidth:"130%",minWidth:"130%"}}>
          <thead>
            <tr>
             <th>Container ID</th>
              <th>Container Tracking Number</th>
              <th>Container Deleivery Amount</th>
              <th>Amount Invest (slef)</th>
              <th>Percentage Invested</th>
              <th>Total Sale Amount </th>
              <th>Profit (Container)</th>
              <th>Profit (Self)</th>
            </tr>
          </thead>
          <tbody>
  {allocations.length === 0 ? (
    <tr>
      <td colSpan="7" style={{ textAlign: "center" }}>
        No Container Data Found
      </td>
    </tr>
  ) : (
    allocations.map((row, idx) => (
<tr key={row.rowId}>


            {/* <td>{row.id}</td> */}
      <td>{row.containerTrackingNumber}</td>
      <td></td>
      <td>{row.amount.toLocaleString("en-NG")}</td>
      <td>{row.percentage}%</td>
      <td>{row.estimatedAmount.toLocaleString("en-NG")}</td>
      <td> {row.isCompleted ? "Completed" : "In Transit"} </td>
      <td></td>
    </tr>
    ))
  )}
</tbody>

        </table>
      </div>
    </div>
      </section>
      {/* FOOTER */}
      <div className="drill-footer">
        <button className="btn outline"onClick={() => onCancel("table")}>Previous</button>
        {/* <button className="btn primary">Update </button> */}

      </div>
      </div>
      </div>
    </div>
    )}
    {activeTab === "request" && (
    <div className="section-grid mt-5">
      <div className="section-grid-container">
        <div className="section-grid-content">
        <section className="section details">
        <header className="section-head">
        <h3>Request </h3>
        </header>
        <div className="btn-row" style={{display:"flex",justifyContent:"flex-end"}}>
        <button  className="cancel">Request For Container</button>
        <button className="create">Request For Withdraw</button>
      </div>
      <section>
      <div className="userTable">
      <div className="table-wrap">
      <div className="tab-section" >
          <div className="tab-header" >
            <button  className={tableTab === "container" ? "active" : ""} style={{fontSize:"1.1vw"}}
              onClick={() => setTableTab("container")} > Request container  </button>

            <button  className={tableTab === "Withdrawal" ? "active" : ""} 
             onClick={() => setTableTab("Withdrawal")}> Request For  Withdrawal
              </button>
          </div>
          </div>
          {tableTab === "container" && (
        <table className="table" style={{width:"100%", maxWidth:"100%",minWidth:"100%"}}>
          <thead>
            <tr>
             <th>S/N</th>
              <th>Request Title</th>
              <th>Request File</th>
              <th>Description</th>
              <th>Request Quantity</th>
            </tr>
          </thead>
          <tbody>
  {allocations.length === 0 ? (
    <tr>
      <td colSpan="7" style={{ textAlign: "center" }}>
        No Container Data Found
      </td>
    </tr>
  ) : (
    allocations.map((row, idx) => (
<tr key={row.rowId}>
  <td>{idx + 1}</td>
      <td>{}</td>
      <td>{}</td>
      <td>{}</td>
      <td>{} </td>
    </tr>
    ))
  )}
</tbody>

        </table>
        )}
           {tableTab === "Withdrawal" && (
        <table className="table" style={{width:"100%", maxWidth:"100%",minWidth:"100%"}}>
          <thead>
            <tr>
             <th>S/N</th>
              <th>Request Title</th>
              <th>Request File</th>
              <th>Description</th>
              <th>Request Amount</th>
            </tr>
          </thead>
          <tbody>
  {allocations.length === 0 ? (
    <tr>
      <td colSpan="7" style={{ textAlign: "center" }}>
        No Container Data Found
      </td>
    </tr>
  ) : (
    allocations.map((row, idx) => (
<tr key={row.rowId}>
  <td>{idx + 1}</td>
      <td>{}</td>
      <td>{}</td>
      <td>{}</td>
      <td>{} </td>
    </tr>
    ))
  )}
</tbody>

        </table>
        )}
      </div>
    </div>
      </section>
        </section>
      </div>
    </div>
    </div>
  )}
    </div> 

  );
};


export default DrillDownPartnerLot
