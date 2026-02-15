import React, { useState } from "react";
import "../../../../../assets/Styles/dashboard/Purchase/createcontainer.scss";
import { X } from "lucide-react";
import { ContainerServices } from "../../../../../services/Trip/container";

const TripContainer = ({ onCreate, setShowItemData, setShowModal,tripUuid }) => {
  /* ================= FORM STATE ================= */
const [form, setForm] = useState({
  title: "",
  trackingNumber: "",
  description: "",
});

  

  /* ================= CREATE HANDLER ================= */

const handleCreate = async () => {
  try {
    if (!form.title || !form.trackingNumber || !form.description) {
      alert("All required fields must be filled");
      return;
    }

    const payload = new FormData();
    payload.append("trip_uuid", tripUuid);
    payload.append("title", form.title);
    payload.append("tracking_number", form.trackingNumber);
    payload.append("desc", form.description);

    const res = await ContainerServices.create(payload);

    const createdContainer = res.data?.record;

    if (!createdContainer) {
      throw new Error("Invalid create response");
    }

    // ✅ backend is now the single source of truth
    onCreate(createdContainer);

    setShowItemData(true);
    setShowModal(false);
  } catch (err) {
    console.error("Container create failed:", err.response?.data || err);
  }
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

            <button
              className="create"
              onClick={handleCreate}
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
