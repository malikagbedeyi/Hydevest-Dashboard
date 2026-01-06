import React, { useState } from "react";
import { X, Calendar } from "lucide-react";
import "../../../../assets/Styles/dashboard/Purchase/create.scss";

const CreateTrip = ({ onCreate, setView }) => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "pending",
  });

  const [showPopup, setShowPopup] = useState(false);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateTrip = () => {
    if (
      !form.title ||
      !form.description ||
      !form.startDate ||
      !form.endDate
    ) {
      console.log("Form incomplete", form);
      return;
    }
  
    const payload = {
      id: Date.now(),
      ...form,
      createdAt: new Date().toISOString(),
    };
  
    onCreate(payload);
    setShowPopup(true);
  };
  

  if (showPopup) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={() => setView("table")} className="delete-box">✕</div>
            <div className="popup-proceeed-wrapper">
              <span>Trip successfully created</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="create-trip-modal">
      <div className="trip-card">
        <div className="header">
          <h2>Create Trip</h2>
          <X className="close-icon" onClick={() => setView("table")} />
        </div>
        <p className="subtitle">Enter the details of the new trip</p>
        <div className="form-grid">
          <div className="form-group">
          <div className="form-group-wrapper"> 
          <div className="form-group-content">
            <label>Title</label>
            <div className="input-box">
            <input
            placeholder="Enter Title"
            value={form.title}
            onChange={(e) => updateForm("title", e.target.value)} />
            </div> 
            </div>
            <div className="form-group-content">
            <label>Location</label>
            <div className="input-box">
            <input
            placeholder="Enter Location"
            value={form.location}
            onChange={(e) => updateForm("location", e.target.value)} />
          </div>
          </div>
          </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
            placeholder="Enter Description"
            value={form.description}
            onChange={(e) => updateForm("description", e.target.value)}/>
          </div>
          <div className="form-group">
  <label>Start Date</label>
  <div className="input-box">
    <input
      type="date"
      value={form.startDate}
      onChange={(e) => updateForm("startDate", e.target.value)}
    />
  </div>
</div>

          <div className="form-group">
            <label>End Date</label>
            <div className="input-box">
              <input type="date" 
               value={form.endDate}
               onChange={(e) => updateForm("endDate", e.target.value)}
             />
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="create" onClick={handleCreateTrip}>
            Create Trip
          </button>
          <button className="cancel" onClick={() => setView("table")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
