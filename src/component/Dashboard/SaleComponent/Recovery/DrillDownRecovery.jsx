import React, { useRef, useState } from "react";
import "../../../../assets/Styles/dashboard/Sale/drilldownpresale.scss";
import { X, Edit, Check, File } from "lucide-react";
import { Printer } from "lucide-react";
import RecoveryInvoice from "./RecoveryInvolce";

const DrillDownRecovery = ({ data, goBack, onUpdate }) => {
  const [editingField, setEditingField] = useState(null);
  const [editableData, setEditableData] = useState({ ...data });
const [showInvoice, setShowInvoice] = useState(false);
const isApproved = editableData.status === "Approved";

  const scrollRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleEdit = (field) => setEditingField(field);

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const saveField = () => {
    setEditingField(null);
    if (onUpdate) onUpdate(editableData);
  };

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  };

  return (
    <div className="drilldown-wrapper" ref={scrollRef}>
      <div className="detail-body">
        {/* HEADER */}
        
       <div className="drilldown-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <X onClick={goBack} className="icon-drilldown" />
          
          {/* ✅ New Print Button */}
          <button 
            onClick={() => setShowInvoice(true)}
            style={{ 
                display: 'flex', alignItems: 'center', gap: '5px', 
            }}
            className="create"
          >
            <Printer size={16} /> Receipt
          </button>
        </div>

        {/* ACTIONS */}
        {/* <div className="actions">
        {editableData.status !== "Approved" && (
  <button
    className="primary"
    onClick={() => {
      const updated = {
        ...editableData,
        status: "Approved",
      };

      setEditableData(updated);
      if (onUpdate) onUpdate(updated);
      // ❌ DO NOT goBack here
    }}
  >
    Approve
  </button>
)}

          <div className="status">
  <span>
    {editableData.status === "Approved" ? "Approved" : "Pending"}
  </span>
</div>

        </div> */}

        <div className="drilldown-title">
          <h2 style={{color:"#581aae"}}>Recovery Details</h2>
        </div>

        {/* BODY */}
        <div className="drilldown-body">
          {/* CUSTOMER */}
          <div className="detail-row">
            <span className="label">Customer Name:</span>
            <span className="value">{editableData.customerName}</span>
          </div>

          <div className="detail-row">
            <span className="label">Customer Phone:</span>
            <span className="value">{editableData.customerPhone}</span>
          </div>

          <div className="detail-row">
            <span className="label">Sale ID:</span>
            <span className="value">{editableData.saleUniqueId}</span>
          </div>
          <div className="detail-row">
            <span className="label">Amount Paid:</span>
            {editingField === "amountPaid" ? (
              <div className="editable-field">
                <input
                  type="number"
                  value={editableData.amountPaid}
                  onChange={(e) =>
                    handleChange("amountPaid", Number(e.target.value))
                  }
                  onBlur={saveField}
                  autoFocus
                />
                <Check className="icon-check" onClick={saveField} />
              </div>
            ) : (
              <div className="editable-field">
                <span className="value">
                  ₦{formatMoney(editableData.amountPaid)}
                </span>
                <Edit
  className={`icon-edit ${isApproved ? "disabled" : ""}`}
  onClick={() => !isApproved && toggleEdit("amountPaid")}
/>

              </div>
            )}
          </div>

          <div className="detail-row">
            <span className="label">Payment Status:</span>
            <span className="value">
              {editableData.paymentStatus }
            </span>
          </div>
  {/* DATE CREATED */}
          <div className="detail-row">
            <span className="label">Payment Date:</span>
            <span className="value">{formatDate(editableData.createdAt)}</span>
          </div>
          {/* COMMENT */}
          <div className="detail-row">
            <span className="label">Comment:</span>
            <span className="value">{data?.comment ? data.comment : "No comment provided"}</span>
          </div>

          {/* ATTACHMENTS */}
          <div className="detail-row">
            <span className="label">Attachments:</span>
            {data?.attachment ? (
    <a href={data.attachment} target="_blank" 
    rel="noopener noreferrer" className="attachment-link" style={{textDecoration:"none" ,color:"#581aae",marginLeft:"auto"}} >
      View Attachment
    </a>
  ) : (
    <span>No attachment</span>
  )}
  
          </div>
        </div>

        <div className="drill-footer">
          <button className="btn outline" onClick={goBack}>
            Previous
          </button>
        </div>

        {showInvoice && (
          <div className="modal-overlay" style={{ zIndex: 1000 }}>
            <div className="modal-content" style={{ width: '800px', background: '#fff', padding: 0 }}>
              <div style={{ textAlign: 'right', padding: '10px' }}>
                <X style={{ cursor: 'pointer' }} onClick={() => setShowInvoice(false)} />
              </div>
              <RecoveryInvoice data={editableData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrillDownRecovery;
