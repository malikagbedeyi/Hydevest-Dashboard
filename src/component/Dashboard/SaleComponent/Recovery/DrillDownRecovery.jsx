import React, { useRef, useState } from "react";
import "../../../../assets/Styles/dashboard/Sale/drilldownpresale.scss";
import { X, Edit, Check, File } from "lucide-react";

const DrillDownRecovery = ({ data, goBack, onUpdate }) => {
  const [editingField, setEditingField] = useState(null);
  const [editableData, setEditableData] = useState({ ...data });
//   const [approved, setApproved] = useState(false);
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
        <div className="drilldown-header">
          <X onClick={goBack} className="icon-drilldown" />
        </div>

        {/* ACTIONS */}
        <div className="actions">
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

        </div>

        <div className="drilldown-title">
          <h2>Recovery Details</h2>
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
            <span className="value">{editableData.saleSN}</span>
          </div>

          {/* AMOUNT PAID (EDITABLE) */}
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

          {/* BALANCE (READ-ONLY) */}
          <div className="detail-row">
            <span className="label">Outstanding Balance:</span>
            <span className="value">
              {editableData.balance === 0 ? (
                <span style={{ color: "green" }}>Fully Paid</span>
              ) : (
                `₦${formatMoney(editableData.balance)}`
              )}
            </span>
          </div>

          {/* PAYMENT DATE */}
          <div className="detail-row">
            <span className="label">Payment Date:</span>
            <span className="value">
              {formatDate(editableData.paymentDate)}
            </span>
          </div>

          {/* COMMENT */}
          <div className="detail-row">
            <span className="label">Comment:</span>
            {editingField === "comment" ? (
              <div className="editable-field">
                <input
                  type="text"
                  value={editableData.comment || ""}
                  onChange={(e) => handleChange("comment", e.target.value)}
                  onBlur={saveField}
                  autoFocus
                />
                <Check className="icon-check" onClick={saveField} />
              </div>
            ) : (
              <div className="editable-field">
                <span className="value">{editableData.comment || "-"}</span>
                <Edit
                  className="icon-edit"
                  onClick={() => toggleEdit("comment")}
                />
              </div>
            )}
          </div>

          {/* DATE CREATED */}
          <div className="detail-row">
            <span className="label">Date Created:</span>
            <span className="value">{formatDate(editableData.createdAt)}</span>
          </div>

          {/* ATTACHMENTS */}
          <div className="detail-row">
            <span className="label">Attachments:</span>
            <div className="container-tags">
              {editableData.attachments?.length ? (
                editableData.attachments.map((file) => (
                  <span key={file.id} className="tag">
                    <File size={14} /> {file.name}
                  </span>
                ))
              ) : (
                <span className="value">No attachments</span>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="drill-footer">
          <button className="btn outline" onClick={goBack}>
            Previous
          </button>
          <button
  className="btn primary"
  onClick={() => {
    scrollToTop();
    if (onUpdate) onUpdate(editableData);
    goBack(); // ✅ ONLY HERE
  }}
>
  Update
</button>

        </div>
      </div>
    </div>
  );
};

export default DrillDownRecovery;
