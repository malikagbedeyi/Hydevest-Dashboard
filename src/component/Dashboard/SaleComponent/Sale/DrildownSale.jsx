import React, { useRef, useState } from "react";
import "../../../../assets/Styles/dashboard/Sale/drilldownpresale.scss";
import { X, Edit, Check } from "lucide-react";

const DrilldownSale = ({ data, goBack, onUpdate }) => {
  const [editingField, setEditingField] = useState(null);
  const [editableData, setEditableData] = useState({ ...data });
  const [approved, setApproved] = useState(false);
  const scrollRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editableFields = [
    "saleOption",
    "wcPieces",
    "pricePerKg",
    "noOfPallets",
    "status",
    "saleAmount",
    "totalSaleAmount",
    "depositAmount",
  ];

  const toggleEdit = (field) => setEditingField(field);

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const saveField = () => {
    setEditingField(null);
    if (onUpdate) onUpdate(editableData);
  };

  // Ensure container is always an array
  const containerArray = Array.isArray(editableData.container)
    ? editableData.container
    : editableData.container?.split(",").map((c) => c.trim()) || [];

  return (
    <div className="drilldown-wrapper" ref={scrollRef}>
      <div className="detail-body">
        <div className="drilldown-header">
          <X onClick={goBack} className="icon-drilldown" />
        </div>

        <div className="actions">
          {!approved && (
            <button className="primary" onClick={() => setApproved(true)}>
              Approve
            </button>
          )}
          <div className="status">
            <span>{approved ? "Approved" : "Not Approved"}</span>
          </div>
        </div>

        <div className="drilldown-title">
          <h2>Sale Details</h2>
        </div>

        <div className="drilldown-body">
          {editableFields.map((field) => (
            <div className="detail-row" key={field}>
              <span className="label">{field.replace(/([A-Z])/g, " $1")}:</span>
              {editingField === field ? (
                <div className="editable-field">
                  <input
                    type={field.includes("Amount") || field === "pricePerKg" ? "number" : "text"}
                    value={editableData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    onBlur={saveField}
                    autoFocus
                  />
                  <Check className="icon-check" onClick={saveField} />
                </div>
              ) : (
                <div className="editable-field">
                  <span className="value">{editableData[field] || "-"}</span>
                  <Edit className="icon-edit" onClick={() => toggleEdit(field)} />
                </div>
              )}
            </div>
          ))}

          {/* Date Created */}
          <div className="detail-row">
            <span className="label">Date Created:</span>
            <span className="value">
              {new Date(editableData.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Containers */}
          <div className="detail-row">
            <span className="label">Containers:</span>
            <div className="container-tags">
              {containerArray.map((c, i) => (
                <span key={i} className="tag">{c}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="drill-footer">
          <button className="btn outline" onClick={goBack}>
            Previous
          </button>
          <button
            className="btn primary"
            onClick={() => {
              scrollToTop();
              if (onUpdate) onUpdate(editableData);
              setApproved(false);
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

export default DrilldownSale;
