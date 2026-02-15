import React, { useEffect, useMemo, useState } from "react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import EditableField from "./EditableField";

const DrilldownPresale = ({ data, goBack, onUpdate }) => {
  const [editableData, setEditableData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (data) setEditableData(data);
  }, [data]);

  const expectedRevenue = useMemo(() => {
    return (
      (Number(editableData.wcAverageWeight) || 0) *
      (Number(editableData.pricePerKg) || 0)
    );
  }, [editableData.wcAverageWeight, editableData.pricePerKg]);

  const handleChange = (field, value) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate?.({
      ...editableData,
      expectedRevenue,
      approved,
    });
    goBack();
  };

  return (
    <div className="drilldown">
      {/* ===== SUMMARY ===== */}
      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item">
            <p>Price per KG (NGN)</p>
            <h2>{editableData.pricePerKg}</h2>
          </div>
          <div className="summary-item">
            <p>WC Avg Weight (kg)</p>
            <h2>{editableData.wcAverageWeight}</h2>
          </div>
          <div className="summary-item">
            <p>WC Pieces</p>
            <h2>{editableData.wcPieces}</h2>
          </div>
          <div className="summary-item">
            <p>Expected Revenue</p>
            <h2>{expectedRevenue}</h2>
          </div>
        </div>
      </div>
      {/* ===== BODY ===== */}
      <div className="detail-body">
        <div className="actions">
          {!approved && (
            <button className="btn primary" onClick={() => setApproved(true)}>
              Approve
            </button>
          )}
          <div className="status">
            <span>{approved ? "Approved" : "Not Approved"}</span>
          </div>
        </div>
        </div>
        <div className="section-grid">
        <section>
            <div className="section-head">
          <h2>Pre-Sale Details</h2>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label htmlFor="">Sale Option</label>
            <input type="text" value={editableData.saleOption}/>
          </div>
            <EditableField
              label="WC Avg Weight (kg)"
              field="wcAverageWeight"
              value={editableData.wcAverageWeight}
              editingField={editingField}
              setEditingField={setEditingField}
              onChange={handleChange}
              type="number"
            />
            <EditableField
              label="WC Pieces"
              field="wcPieces"
              value={editableData.wcPieces}
              editingField={editingField}
              setEditingField={setEditingField}
              onChange={handleChange}
              type="number"
            />
            <EditableField
              label="Price Per Pic"
              field="pricePerPic"
              value={editableData.pricePerPic}
              editingField={editingField}
              setEditingField={setEditingField}
              onChange={handleChange}
              type="number"
            />
            <EditableField
              label="Price Per KG"
              field="pricePerKg"
              value={editableData.pricePerKg}
              editingField={editingField}
              setEditingField={setEditingField}
              onChange={handleChange}
              type="number"
            />
            <EditableField
              label="No of Pallets"
              field="noOfPallets"
              value={editableData.noOfPallets}
              editingField={editingField}
              setEditingField={setEditingField}
              onChange={handleChange}
              type="number"
            />
            <div className="form-group">
            <label htmlFor="">Expected Revenue (NGN)</label>
            <input type="text" value={{expectedRevenue}} />
          </div>
            <EditableField
              label="Status"
              field="status"
              value={editableData.status}
              editingField={editingField}
              setEditingField={setEditingField}
              onChange={handleChange}
            />
            <div className="form-group">
            <label htmlFor="">Containers</label>
            <input type="text" value={editableData.containerNames}/>
          </div>
          <div className="form-group">
            <label htmlFor="">Date Created</label>
            <input type="text" value= {new Date(editableData.createdAt).toLocaleString()}/>
          </div>
          </div>
          </section>
      {/* ===== FOOTER ===== */}
      <div className="btn-row">
        <button className="cancel" onClick={goBack}>
          Previous
        </button>
        <button className="create" onClick={handleSave}>
          Update
        </button>
      </div>
      </div>
    </div>
  );
};

export default DrilldownPresale;
