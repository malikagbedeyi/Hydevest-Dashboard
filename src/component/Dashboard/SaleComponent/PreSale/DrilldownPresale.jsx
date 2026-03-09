import React, { useEffect, useMemo, useState } from "react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import EditableField from "./EditableField";
import { PresaleServices } from "../../../../services/Sale/presale";

const DrilldownPresale = ({ data, goBack, onUpdate }) => {
  /* ---------------------------------
     STATE
  ---------------------------------- */
  const [editableData, setEditableData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);
 const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState(null);
   const closePopup = () => {
    setPopupMessage(null);
    setPopupType(null);
  };
  /* ---------------------------------
     HYDRATE DATA
  ---------------------------------- */
  useEffect(() => {
    if (data) {
      setEditableData(data);
      // setApproved(data.status === 1);
    }
  }, [data]);
useEffect(() => {
  if (!data) return;

  setEditableData({
    ...data,
    pallets: Array.isArray(data.pallets)
      ? data.pallets.map(p => ({
          pallet_uuid: p.pallet_uuid,
          no_of_pallets: Number(p.no_of_pallets || 0),
          pallet_pieces: Number(p.pallet_pieces || 0),
        }))
      : [],
    total_no_of_boxes: Number(data.total_no_of_boxes || data.wc_pieces || 0),
  });
    // setApproved(data.status === 1);
}, [data]);
const totalPallets = useMemo(() => {
  return (editableData.pallets || []).reduce(
    (sum, p) => sum + Number(p.no_of_pallets || 0),
    0
  );
}, [editableData.pallets]);
useEffect(() => {
  setEditableData(prev => ({
    ...prev,
    total_no_of_pallets: totalPallets,
  }));
}, [totalPallets]);
  /* ---------------------------------
     EXPECTED REVENUE (MATCH TABLE)
  ---------------------------------- */
const expectedRevenue = useMemo(() => {
  const wcPieces = Number(editableData?.wc_pieces ?? 0);
  const pricePerPiece = Number(editableData?.price_per_piece ?? 0);
  return wcPieces * pricePerPiece;
}, [editableData.wc_pieces, editableData.price_per_piece]);

  /* ---------------------------------
     FIELD UPDATE HANDLER
  ---------------------------------- */
  const handleChange = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

/* ---------------------------------
   APPROVE HANDLER
---------------------------------- */
 const handleApprove = async () => {
    if (!editableData?.pre_sale_uuid) return;
    setLoading(true);

    try {
      const newStatus = 1;
      const payload = { pre_sale_uuid: editableData.pre_sale_uuid, status: newStatus };

      const response = await PresaleServices.changeApproval(payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response?.data?.success) {
        setEditableData(prev => ({ ...prev, status: newStatus }));
        onUpdate?.({ ...editableData, status: newStatus });

        setPopupMessage("✅ Pre-sale approved successfully!");
        setPopupType("success");
      } else {
        setPopupMessage(`❌ Failed to approve pre-sale: ${response?.data?.message || "Unknown error"}`);
        setPopupType("error");
      }
    } catch (err) {
      setPopupMessage(`❌ Error approving pre-sale: ${err.message || "Unknown error"}`);
      setPopupType("error");
    } finally {
      setLoading(false);
    }
  };

/* ---------------------------------
   SAVE & APPROVE IN ONE CLICK
---------------------------------- */
const handleSave = async () => {
  setLoading(true);

  try {
    const saleOption = editableData?.sale_option?.toUpperCase()?.trim();
    let response;

    /* -------------------------
       BOX SALE
    -------------------------- */
    if (saleOption === "BOX SALE") {
      response = await PresaleServices.editBoxSale({
        pre_sale_uuid: editableData.pre_sale_uuid,
        total_no_of_boxes: Number(editableData.total_no_of_boxes),
        price_per_piece: Number(editableData.price_per_piece),
        wc_pieces: Number(editableData.wc_pieces),
        expected_sales_revenue: expectedRevenue,
      });
    }

    /* -------------------------
       SPLIT SALE
    -------------------------- */
    if (saleOption === "SPLIT SALE") {
      const pallets = editableData.pallets || [];
      if (!pallets.length) throw new Error("Split Sale requires pallet distribution");

      const payload = {
        pre_sale_uuid: editableData.pre_sale_uuid,
        wc_average_weight: Number(editableData.wc_average_weight),
        wc_pieces: Number(editableData.wc_pieces),
        price_per_piece: Number(editableData.price_per_piece),
        price_per_kg: Number(editableData.price_per_kg),
        total_no_of_pallets: Number(editableData.total_no_of_pallets),
        pallets_uuid: pallets.map(p => p.pallet_uuid).join(","),
        no_of_pallets: pallets.map(p => p.no_of_pallets).join(","),
        pallet_pieces: pallets.map(p => p.pallet_pieces).join(","),
      };

      console.log("🔵 SPLIT SALE PAYLOAD:", payload);
      response = await PresaleServices.editSplitSale(payload);
    }

    /* -------------------------
       MIXED SALE
    -------------------------- */
    if (saleOption === "MIXED SALE") {

       const pallets = editableData.pallets || [];
      if (!pallets.length) throw new Error("Split Sale requires pallet distribution");

      const payload = {
        pre_sale_uuid: editableData.pre_sale_uuid,
        wc_average_weight: Number(editableData.wc_average_weight),
        wc_pieces: Number(editableData.wc_pieces),
        price_per_piece: Number(editableData.price_per_piece),
        price_per_kg: Number(editableData.price_per_kg),
        total_no_of_pallets: Number(editableData.total_no_of_pallets),
        pallets_uuid: pallets.map(p => p.pallet_uuid).join(","),
        no_of_pallets: pallets.map(p => p.no_of_pallets).join(","),
        pallet_pieces: pallets.map(p => p.pallet_pieces).join(","),
      };
      response = await PresaleServices.editMixedSale(payload)
    }

    /* -------------------------
       IF SAVE SUCCESSFUL, APPROVE IF NEEDED
    -------------------------- */
    if (response?.data?.success) {
      if(approved){
        handleApprove();
      }else{
        setApproved(!approved)
      }
      setPopupMessage("✅ Pre-sale updated successfully!");
        setPopupType("success");
        goBack();
      } else {
        setPopupMessage(`❌ Failed to update pre-sale: ${response?.data?.message || "Unknown error"}`);
        setPopupType("error");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Unknown error";
      setPopupMessage(`❌ Error saving pre-sale: ${message}`);
      setPopupType("error");
  } finally {
    setLoading(false);
  }
};

/* -------------------------
   WC PIECES & TOTALS
-------------------------- */
useEffect(() => {
  if (!editableData) return;

  let totalPieces = editableData.wc_pieces ?? 0; // start with server value

  if (editableData.sale_option === "SPLIT SALE" && editableData.pallets?.length) {
    // sum from pallets
    totalPieces = editableData.pallets.reduce(
      (sum, p) => sum + (Number(p.no_of_pallets) * Number(p.pallet_pieces) || 0),
      0
    );
  } else if (editableData.sale_option === "MIXED SALE" && editableData.pallets?.length) {
    // sum from pallets
    totalPieces = editableData.pallets.reduce(
      (sum, p) => sum + (Number(p.no_of_pallets) * Number(p.pallet_pieces) || 0),
      0
    );
  } else if (editableData.sale_option === "BOX SALE") {
    // use total_no_of_boxes if present, otherwise fallback to server value
    totalPieces = Number(editableData.total_no_of_boxes ?? editableData.wc_pieces ?? 0);
  }

  setEditableData(prev => ({
    ...prev,
    wc_pieces: totalPieces,
    total_no_of_pallets: editableData.pallets?.reduce(
      (sum, p) => sum + Number(p.no_of_pallets || 0),
      0
    ),
  }));
}, [editableData.pallets, editableData.sale_option, editableData.total_no_of_boxes]);

  /* ---------------------------------
     POPUP RENDER
  ---------------------------------- */
  if (popupMessage) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={closePopup} className="delete-box" style={{ color: "red" }}>✕</div>
            <div className="popup-proceeed-wrapper">
              <span style={{ color: popupType === "error" ? "red" : "green", fontWeight: 600 }}>
                {popupMessage}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="drilldown">

      {/* ===== SUMMARY ===== */}
      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item">
            <p>Price per KG (NGN)</p>
            <h2>{editableData?.price_per_kg ?? "-"}</h2>
          </div>

          <div className="summary-item">
            <p>WC Avg Weight (kg)</p>
            <h2>{editableData?.wc_average_weight ?? "-"}</h2>
          </div>

          <div className="summary-item">
            <p>WC Pieces</p>
            <h2>{editableData?.wc_pieces ?? "-"}</h2>
          </div>

          <div className="summary-item">
            <p>Expected Revenue</p>
            <h2>{expectedRevenue.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="detail-body">

        {/* ACTION BAR */}
<div className="actions">
  {!approved && (
    <button
      className="primary"
      onClick={() => setApproved(true)}  
      disabled={loading}
    >
      {loading ? "Approving..." : "Approve"}
    </button>
  )}

  <div className="status">
    <span>{approved ? "Approved" : "Not Approved"}</span>
  </div>
</div>

        {/* DETAILS */}
        <div className="section-grid">
          <section>
            <div className="section-head">
              <h2>Pre-Sale Details</h2>
            </div>

            <div className="grid-2">

              <div className="form-group">
                <label>Sale Option</label>
                <input readOnly value={editableData?.sale_option ?? "-"} />
              </div>
<div className="form-group">
  <label>Container</label>
  <input readOnly value={editableData?.container?.title ?? "—"}
  />
</div>
              <EditableField
                label="WC Avg Weight (kg)"
                field="wc_average_weight"
                value={editableData?.wc_average_weight}
                editingField={editingField}
                setEditingField={setEditingField}
                onChange={handleChange}
                type="number"
              />

              <EditableField
  label="WC Pieces"
  field="wc_pieces"
  value={editableData?.wc_pieces}
  editingField={editingField}
  setEditingField={setEditingField}
  onChange={handleChange}
  type="number"
  // readOnly={true} // prevents manual override
/>

              <EditableField
                label="Price Per Pic"
                field="price_per_piece"
                value={editableData?.price_per_piece}
                editingField={editingField}
                setEditingField={setEditingField}
                onChange={handleChange}
                type="number"
              />

              <EditableField
                label="Price Per KG"
                field="price_per_kg"
                value={editableData?.price_per_kg}
                editingField={editingField}
                setEditingField={setEditingField}
                onChange={handleChange}
                type="number"
              />
                      {editableData?.sale_option === "SPLIT SALE" && (
              <EditableField  style={{display:"grid", gridTemplateColumns:"1fr"}}
                label="Total No of Pallets"
                field="total_no_of_pallets"
                value={editableData?.total_no_of_pallets}
                editingField={editingField}
                setEditingField={setEditingField}
                onChange={handleChange}
                type="number"
              />
              )}
            </div>
        {editableData?.sale_option === "MIXED SALE" && "MIXED SALE" && (
  <section>
    <div className="section-head">
      <h2>Pallet Distribution</h2>
    </div>

   {editableData.pallets?.map((pallet, index) => (
  <div
    className="grid-2 pallet-row"
    key={pallet.pallet_uuid}
  >
    {/* No of Pallets */}
    <EditableField
      label="No of Pallets"
      value={pallet.no_of_pallets}
      type="number"
       editingField={editingField}
    setEditingField={setEditingField}
      onChange={(_, val) => {
        const updated = [...editableData.pallets];
        updated[index].no_of_pallets = Number(val);
        handleChange("pallets", updated);
      }}
    />

    {/* Pallet Pieces */}
    <EditableField
      label="Pallet Pieces"
      value={pallet.pallet_pieces}
      type="number"
       editingField={editingField}
    setEditingField={setEditingField}
      onChange={(_, val) => {
        const updated = [...editableData.pallets];
        updated[index].pallet_pieces = Number(val);
        handleChange("pallets", updated);
      }}
    />

    {/* Total Pieces */}
    <div className="form-group">
      <label>Total Pieces</label>
      <input
        readOnly
        value={pallet.no_of_pallets * pallet.pallet_pieces}
      />
    </div>
  </div>
))}
  </section>
)}
<div className="grid-2">
   <div className="form-group">
                <label>Expected Revenue (NGN)</label>
                <input readOnly value={expectedRevenue.toLocaleString()} />
              </div>
              <div className="form-group">
                <label>Date Created</label>
                <input
                  readOnly
                  value={
                    editableData?.created_at
                      ? new Date(editableData.created_at).toLocaleString()
                      : "-"
                  }
                />
              </div>
</div>
          </section>

          {/* FOOTER */}
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
    </div>
  );
};

export default DrilldownPresale;