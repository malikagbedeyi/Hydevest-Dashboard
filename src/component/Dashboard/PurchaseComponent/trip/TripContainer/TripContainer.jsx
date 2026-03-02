import React, { useState } from "react";
import "../../../../../assets/Styles/dashboard/Purchase/createcontainer.scss";
import { X } from "lucide-react";
import { ContainerServices } from "../../../../../services/Trip/container";

const TripContainer = ({ onCreate, setShowItemData, setShowModal,tripUuid }) => {
  /* ================= FORM STATE ================= */
const [form, setForm] = useState({
  title: "",trackingNumber: "",description: "",
});

  const [loading, setLoading] = useState(false);

  /* ================= CREATE HANDLER ================= */

const [error, setError] = useState(null);

const handleCreate = async () => {
  try {
    setLoading(true);

    if (!form.title || !form.trackingNumber || !form.description) {
      alert("All fields are required");
      return;
    }

    const payload = new FormData();
    payload.append("trip_uuid", tripUuid);
    payload.append("title", form.title);
    payload.append("tracking_number", form.trackingNumber);
    payload.append("desc", form.description);

    const res = await ContainerServices.create(payload);

   const createdContainer = res.data?.record || res.data;

    if (!createdContainer) {
      throw new Error("Invalid create response");
    }

    // ✅ Update parent state and close modal immediately
    onCreate(createdContainer);
    setShowItemData(true);
    setShowModal(false);

  } catch (err) {
    console.error("Container create failed:", err.response?.data || err);
    alert(err.response?.data?.message || "Failed to create container");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="trip-modal">
      <div className="create-expense-modal">
        <div className="create-expense-card">
          {error && <p style={{color:'red', marginBottom:'10px'}}>{error}</p>}
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
              value={form.title}  onChange={(e) => setForm({ ...form, title: e.target.value })
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
            <button className="create" onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : "Create"}</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TripContainer;
