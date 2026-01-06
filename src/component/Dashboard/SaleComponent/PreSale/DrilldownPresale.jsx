import React, { useRef, useState } from "react";
import "../../../../assets/Styles/dashboard/Sale/drilldownpresale.scss";
import { X, Edit, Check } from "lucide-react";

const DrilldownPresale = ({ data, goBack, onUpdate }) => {
  const [editingField, setEditingField] = useState(null);
  const [editableData, setEditableData] = useState({ ...data });
 const [approved, setApproved] = useState(false);
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
    if (onUpdate) onUpdate(editableData); // Optional: send updated data back to parent
  };

  return (
    <div className="drilldown-wrapper" ref={scrollRef}>
        <div className="drill-summary-grid">
  <div className="drill-summary">
  <div className="summary-item">
      <p className="small">Price per KG (NGN)</p>
      <h2>
        {editableData.pricePerKg}
      </h2>
    </div>
    <div className="summary-item">
      <p className="small">WC Avg Weight (kg)</p>
      <h2>{editableData.wcAverageWeight}</h2>
    </div>
    <div className="summary-item">
      <p className="small">Price Per Pic</p>
      <h2>{editableData.pricePerPic}</h2>
    </div>
    <div className="summary-item">
      <p className="small">WC Pieces</p>
      <h2>{editableData.wcPieces}</h2>
    </div>
    <div className="summary-item">
      <p className="small">Expected Revenue (NGN)</p>
      <h2>{editableData.wcAverageWeight * editableData.pricePerKg} </h2>
    </div>

  </div>
</div>
          <div className="detail-body">
      <div className="drilldown-header">
        {/* <X onClick={goBack} className="icon-drilldown" /> */}
      </div>
            <div className="actions">
            {!approved && (
            <button className="primary" onClick={() => setApproved(!approved)}>
                Approve  </button>
            )}
                 <div className="status">
                    <span>{approved ? "Approved" : "Not Approved"}</span>
                </div>

        </div>
      <div className="drilldown-title">
        <h2>Pre-Sale Details</h2>
      </div>
      <div className="drilldown-body">
        {/* Sale Option */}
        <div className="detail-row">
          <span className="label">Sale Option:</span>
          <span className="value"> {data.saleOption} </span>
        </div>
        {/* WC Average Weight */}
        <div className="detail-row">
          <span className="label">WC Avg Weight (kg):</span>
          {editingField === "wcAverageWeight" ? (
            <div className="editable-field">
              <input
                type="number"
                value={editableData.wcAverageWeight}
                onChange={(e) => handleChange("wcAverageWeight", e.target.value)}
                onBlur={saveField}
                autoFocus
              />
              <Check className="icon-check" onClick={saveField} />
            </div>
          ) : (
            <div className="editable-field">
              <span className="value">{editableData.wcAverageWeight}</span>
              <Edit
                className="icon-edit"
                onClick={() => toggleEdit("wcAverageWeight")}
              />
            </div>
          )}
        </div>
        {/* WC Pieces */}
        <div className="detail-row">
          <span className="label">WC Pieces:</span>
          {editingField === "wcPieces" ? (
            <div className="editable-field">
              <input
                type="number"
                value={editableData.wcPieces}
                onChange={(e) => handleChange("wcPieces", e.target.value)}
                onBlur={saveField}
                autoFocus
              />
              <Check className="icon-check" onClick={saveField} />
            </div>
          ) : (
            <div className="editable-field">
              <span className="value">{editableData.wcPieces}</span>
              <Edit
                className="icon-edit"
                onClick={() => toggleEdit("wcPieces")}
              />
            </div>
          )}
        </div>
         {/* Price per pic */}
        <div className="detail-row">
          <span className="label">Price per Pic (NGN):</span>
          {editingField === "pricePerKg" ? (
            <div className="editable-field">
              <input
                type="number"
                value={editableData.pricePerPic}
                onChange={(e) => handleChange("pricePerPic", e.target.value)}
                onBlur={saveField}
                autoFocus
              />
              <Check className="icon-check" onClick={saveField} />
            </div>
          ) : (
            <div className="editable-field">
              <span className="value">{editableData.pricePerPic}</span>
              <Edit
                className="icon-edit"
                onClick={() => toggleEdit("pricePerPic")}
              />
            </div>
          )}
        </div>
        {/* Price per KG */}
        <div className="detail-row">
          <span className="label">Price per KG (NGN):</span>
          {editingField === "pricePerKg" ? (
            <div className="editable-field">
              <input
                type="number"
                value={editableData.pricePerKg}
                onChange={(e) => handleChange("pricePerKg", e.target.value)}
                onBlur={saveField}
                autoFocus
              />
              <Check className="icon-check" onClick={saveField} />
            </div>
          ) : (
            <div className="editable-field">
              <span className="value">{editableData.pricePerKg}</span>
              <Edit
                className="icon-edit"
                onClick={() => toggleEdit("pricePerKg")}
              />
            </div>
          )}
        </div>
        {/* No. of Pallets */}
        <div className="detail-row">
          <span className="label">No. of Pallets:</span>
          {editingField === "noOfPallets" ? (
            <div className="editable-field">
              <input
                type="number"
                value={editableData.noOfPallets}
                onChange={(e) => handleChange("noOfPallets", e.target.value)}
                onBlur={saveField}
                autoFocus
              />
              <Check className="icon-check" onClick={saveField} />
            </div>
          ) : (
            <div className="editable-field">
              <span className="value">{editableData.noOfPallets || "-"}</span>
              <Edit
                className="icon-edit"
                onClick={() => toggleEdit("noOfPallets")}
              />
            </div>
          )}
        </div>

        {/* Expected Revenue */}
        <div className="detail-row">
          <span className="label">Expected Revenue (NGN):</span>
          <span className="value">{editableData.wcAverageWeight * editableData.pricePerKg}</span>
        </div>

        {/* Status */}
        <div className="detail-row">
          <span className="label">Status:</span>
          {editingField === "status" ? (
            <div className="editable-field">
              <input
                type="text"
                value={editableData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                onBlur={saveField}
                autoFocus
              />
              <Check className="icon-check" onClick={saveField} />
            </div>
          ) : (
            <div className="editable-field">
              <span className="value status">{editableData.status}</span>
              <Edit
                className="icon-edit"
                onClick={() => toggleEdit("status")}
              />
            </div>
          )}
        </div>
   {/* Containers */}
          
   <div className="detail-row">
          <span className="label">Containers:</span>
          <div className="container-tags">
             <div className="editable-field">
            <input type="text"
            value={data.containerNames} />
            </div>
          </div>
      </div>
        {/* Date Created */}
        <div className="detail-row">
          <span className="label">Date Created:</span>
          <span className="value">{new Date(editableData.createdAt).toLocaleString()}</span>
        </div>
      </div>
      </div>
        <div className="drill-footer">
        <button className="btn outline" onClick={goBack}>Previous</button>
        <button className="btn primary"  
         onClick={() => { 
             scrollToTop(); 
              goBack()
         setApproved(false);  }} >Update</button>
      </div>
      </div>
  );
};

export default DrilldownPresale;
