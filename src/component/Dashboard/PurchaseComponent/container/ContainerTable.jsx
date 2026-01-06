import React from "react";
import { Trash2 } from "lucide-react";
import "../../../../assets/Styles/dashboard/Purchase/table.scss";

const ContainerTable = ({ containers, onDelete, onRowClick ,avgContainerRate = 0,
    formatNumber, totalAmountUSD = 0, totalAmountNGN = 0, totalContainers = 0, totalUnitPriceUSD = 0, }) => {

    const formatDate = (date) =>
    date
      ? new Date(date)
          .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          .replace(/ /g, "-")
      : "-";
    
      const safeFormatNumber =
  typeof formatNumber === "function"
    ? formatNumber
    : (num = 0) =>
        Number(num || 0).toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });

  return (
    <div className="userTable">
        <div className="drill-summary-grid">
      <div className="drill-summary">

<div className="summary-item">
  <p className="small">Total Amount (NGN)</p>
  <h2>
    {new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(totalAmountNGN)}
  </h2>
</div>
<div className="summary-item">
  <p className="small">Total Trip</p>
  <h2>3</h2>
</div>

<div className="summary-item">
  <p className="small">Total Container</p>
  <h2>{totalContainers}</h2>
</div>

<div className="summary-item">
  <p className="small">Total Pieces</p>
  <h2>{safeFormatNumber(totalUnitPriceUSD)}</h2>
</div>
<div className="summary-item">
  <p className="small">Average Fx Rate</p>
  <h2>{safeFormatNumber(avgContainerRate)}</h2>
</div>

    </div>
    </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Container ID</th>
              <th>	Description</th>
              <th>Container title</th>
              <th>Container Tracking Number</th>
              <th>Container Tracking Name</th>
              <th>Pieces</th>
              <th>Unit Price(USD)</th>
              <th>Amount (USD)</th>
              <th>Qouted Amount (USD)</th>
              <th>Created Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {containers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Containers Found
                </td>
              </tr>
            ) : (
              containers.map((c, idx) => (
                <tr key={c.id} onClick={() => onRowClick(c)}>
                  <td>{idx + 1}</td>
                  <td>{c.sn}</td>
                  <td>{c.description}</td>
                  <td>{c.title}</td>
                  <td>TN{c.trackingNumber}</td> 
                  <td>{c.modelName}</td>
                  <td>{c.unitpieces || "0"}</td>
                  <td>{c.unitPrice || "0.00"}</td>
                  <td>{c.amountUsd || "0.00"} </td>
                  <td>{c.quotedAmountUsd || "0.00"} </td>
                  <td>{formatDate(c.createdAt)}</td>
                   <td>
                    <span style={{ color: "orange", fontWeight: 600 }}>
                      {c.status}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <Trash2
                      size={16}
                      color="red"
                      style={{ cursor: "pointer" }}
                      onClick={() => onDelete(c.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContainerTable;
