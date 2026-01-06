import React, { useState } from "react";
import "../../../../../assets/Styles/dashboard/Purchase/createcontainer.scss";
import { X } from "lucide-react";

const TripContainer = ({ onCreate, setShowItemData, setShowModal }) => {
  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    title: "", trackingNumber: "", description: "", unitpieces: "", 
    unitPrice: "", amountUsd: "", averageWeight: "", maxWeight: "", 
    entity: "", invoiceNumber: "", piece: "", pricePerPieces: "", 
    sourceNation: "", sourceLocation: "", sourcePart: "", destinationPort: "", 
    funding: "", supplyCode: "", warehouseChargeNGN: "", offloadAndSorting: "",
    quotedPriceUsd:  "", quotedAmountUsd: "",surcharge:"",extimated:"",
  });
  

  /* ================= CREATE HANDLER ================= */
  const handleCreateContainer = () => {
    const payload = {
      id: Date.now(),
      ...form, // 🔥 ALL fields now exist
      createdAt: new Date().toISOString(),
      status: "Pending",
    };
  
    onCreate(payload);
    setShowItemData(true);
    setShowModal(false);
  
    // reset
    setForm({
      title: "",
      trackingNumber: "",
      description: "",
      unitpieces: "",
      unitPrice: "",
      amountUsd: "",
      averageWeight: "",
      maxWeight: "",
      entity: "",
      invoiceNumber: "",
      piece: "",
      pricePerPieces: "",
      sourceNation: "",
      sourceLocation: "",
      sourcePart: "",
      destinationPort: "",
      funding: "",
      supplyCode: "",
      warehouseChargeNGN: "",
      offloadAndSorting: "",
      quotedPriceUsd:  "",
      quotedAmountUsd: "",
      surcharge:"",
      extimated:"",
    });
  };
  

  return (
    <div className="trip-modal">
      <div className="create-expense-modal">
        <div className="create-expense-card">
          
          {/* HEADER */}
          <div className="header">
            <h2>Create Container</h2>
            <X
              size={18}
              className="close"
              onClick={() => {
                setShowItemData(true);
                setShowModal(false);
              }}
            />
          </div>

          <p className="subtitle">Enter the details of the new container</p>

          {/* FORM */}
          <div className="grid-2">
            <div className="form-group">
              <label>Title</label>
              <input type="text"   placeholder="Enter Title"
              value={form.title} onChange={(e) =>  setForm({ ...form, title: e.target.value })
              }/>
            </div>

            <div className="form-group highlighted">
              <label>Container Tracking Number</label>
              <input
                type="text"
                placeholder="Enter Tracking Number"
                value={form.trackingNumber}
                 onChange={(e) =>  setForm({ ...form, trackingNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description <span>*</span></label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>  setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* BUTTONS */}
          <div className="btn-row" style={{ marginTop: "10%" }}>
            <button
              className="cancel"
              onClick={() => {
                setShowItemData(true);
                setShowModal(false);
              }}
            >
              Cancel
            </button>

            <button
              className="create"
              onClick={handleCreateContainer}
              // disabled={!title || !trackingNumber}
            >
              Submit
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TripContainer;
