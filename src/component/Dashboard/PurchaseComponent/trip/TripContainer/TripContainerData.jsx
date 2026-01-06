import React from 'react'
import { Plus, X, Edit, Trash2, ChevronDown, ChevronUp, Paperclip } from "lucide-react";

const TripContainerData = ({handleContainerRowClick,containerData,handleDeleteContainer}) => {
    const formatMoney = (value) =>
    new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const formatDate = (date) =>
    date
      ? new Date(date)
          .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          .replace(/ /g, "-")
      : "-";


  return (
    <div>
      <div className="userTable">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Title</th>
              <th>Description</th>
               <th>Container Number</th>
               <th>Pieces</th>
               <th>Unit Price (USD)</th>
               <th>Amount (USD)</th>
               <th>Qouted Amount (USD)</th>
              <th>Created Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {containerData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Container Data Found
                </td>
              </tr>
            ) : (
              containerData.map((item, idx) => (
                <tr key={item.id} onClick={() => handleContainerRowClick({...item,sn: idx + 1,})} style={{ cursor: "pointer" }}>
                  <td>{idx + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>TN {item.trackingNumber}</td>
                  <td>{item.unitpieces || "0"}</td>
                  <td>{item.unitPrice || "0.00"}</td>
                  <td>{item.amountUsd || "0.00"} </td>
                  <td>{item.quotedAmountUsd || "0.00"} </td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>
                    <span style={{ color: "orange", fontWeight: 600 }}>
                      {item.status}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <Trash2 size={16}
                    color="red" style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteContainer(item.id)}/></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}

export default TripContainerData
