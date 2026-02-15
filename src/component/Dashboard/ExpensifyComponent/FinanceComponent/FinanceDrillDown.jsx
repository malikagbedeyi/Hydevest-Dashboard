import React, { useState, useRef } from "react";
import "../../../../assets/Styles/dashboard/Expensify/drilldown.scss";
import { X, Edit, Check, File } from "lucide-react";

const FinanceDrillDown = ({ data, goBack, onUpdate }) => {
  const [editingField, setEditingField] = useState(null);
  const [editableData, setEditableData] = useState({ ...data });
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
    new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value || 0));

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date)
      .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
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
                const updated = { ...editableData, status: "Approved" };
                setEditableData(updated);
                if (onUpdate) onUpdate(updated);
              }}
            >
              Approve
            </button>
          )}
          <div className="status">
            <span>{editableData.status === "Approved" ? "Approved" : "Pending"}</span>
          </div>
        </div>

        <div className="drilldown-title">
          <h2>Finance Details</h2>
        </div>

        {/* BODY */}
        <div className="drilldown-body">
          <div className="detail-row">
            <span className="label">Title:</span>
            <span className="value">{editableData.title}</span>
          </div>

          <div className="detail-row">
            <span className="label">Description:</span>
            <span className="value">{editableData.description}</span>
          </div>

          <div className="detail-row">
            <span className="label">Type:</span>
            <span className="value">{editableData.type}</span>
          </div>

          {/* Budgeted Amount */}
          <div className="detail-row">
            <span className="label">Budgeted Amount:</span>
            {editingField === "budgetedAmount" ? (
              <div className="editable-field">
                <input
                  type="number"
                  value={editableData.budgetedAmount}
                  onChange={(e) => handleChange("budgetedAmount", Number(e.target.value))}
                  onBlur={saveField}
                  autoFocus
                />
                <Check className="icon-check" onClick={saveField} />
              </div>
            ) : (
              <div className="editable-field">
                <span className="value">₦{formatMoney(editableData.budgetedAmount)}</span>
                <Edit className={`icon-edit ${isApproved ? "disabled" : ""}`} onClick={() => !isApproved && toggleEdit("budgetedAmount")} />
              </div>
            )}
          </div>

          {/* Advance Amount */}
          <div className="detail-row">
            <span className="label">Advance Amount:</span>
            {editingField === "advanceAmount" ? (
              <div className="editable-field">
                <input
                  type="number"
                  value={editableData.advanceAmount}
                  onChange={(e) => handleChange("advanceAmount", Number(e.target.value))}
                  onBlur={saveField}
                  autoFocus
                />
                <Check className="icon-check" onClick={saveField} />
              </div>
            ) : (
              <div className="editable-field">
                <span className="value">₦{formatMoney(editableData.advanceAmount)}</span>
                <Edit className={`icon-edit ${isApproved ? "disabled" : ""}`} onClick={() => !isApproved && toggleEdit("advanceAmount")} />
              </div>
            )}
          </div>

          <div className="detail-row">
            <span className="label">Currency:</span>
            <span className="value">{editableData.currency}</span>
          </div>

          <div className="detail-row">
            <span className="label">Rate:</span>
            <span className="value">{editableData.rate}</span>
          </div>

          {/* Comment */}
          <div className="detail-row">
            <span className="label">Comment:</span>
            {editingField === "comment" ? (
              <div className="editable-field">
                <input type="text" value={editableData.comment || ""} onChange={(e) => handleChange("comment", e.target.value)} onBlur={saveField} autoFocus />
                <Check className="icon-check" onClick={saveField} />
              </div>
            ) : (
              <div className="editable-field">
                <span className="value">{editableData.comment || "-"}</span>
                <Edit className="icon-edit" onClick={() => toggleEdit("comment")} />
              </div>
            )}
          </div>

          <div className="detail-row">
            <span className="label">Date Created:</span>
            <span className="value">{formatDate(editableData.date)}</span>
          </div>

          {/* Attachments */}
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
              goBack();
            }}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceDrillDown;
