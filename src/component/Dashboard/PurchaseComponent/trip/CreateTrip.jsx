import React, { useState } from "react";
import { X, Calendar } from "lucide-react";
import "../../../../assets/Styles/dashboard/Purchase/create.scss";
import { TripServices } from "../../../../services/Trip/trip";

const CreateTrip = ({ onSuccess, setView ,data}) => {

   const [loading,setLoading] = useState(false)
    const [message,setMessage] = useState(null)
    const [messageType,setMessageType] = useState("success")
    const [original, setOriginal] = useState(null);
    const [status, setStatus] = useState(data?.status ?? 0);

  const [form, setForm] = useState({
    title: "",
    location: "",
    desc: "",
    start_date: "",
    end_date: "",
  });
const isApproved = status === 1;

  const [showPopup, setShowPopup] = useState(false);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };


const handleCreate = async () => {
  try {
    setLoading(true);
    setMessage(null);

    const payload = {
      title: form.title,
      location: form.location,
      desc: form.desc,
      start_date: form.start_date,
      end_date: form.end_date,
    };

    await TripServices.create(payload);

    setMessageType("success");
    setMessage("Trip created successfully");
    setShowPopup(true);

    // ✅ refresh BEFORE switching view
    if (onSuccess) {
      await onSuccess();
    }

    setTimeout(() => {
      setShowPopup(false);
      setView("table");
    }, 1200);

  } catch (err) {
    const EndpointMessage =
      err.response?.data?.message ||
      "Trip creation failed. Please check your input.";

    setMessageType("error");
    setMessage(EndpointMessage);
  } finally {
    setLoading(false);
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (showPopup) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={() => setView("table")} className="delete-box">✕</div>
            <div className="popup-proceeed-wrapper">
              <span>{message}</span>
              {message && messageType === "error" && (
                <span>{message}</span>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  }
  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="create-trip-modal slide-up">
      <div className="trip-card">
        <div className="header">
          <h2>Create Trip</h2>
          <X className="close-icon" onClick={() => setView("table")} />
        </div>
        <p className="subtitle">Enter the details of the new trip</p>
         {message && messageType === "error" && (
                <span style={{color:"red"}}>{message}</span>
              )}
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
  value={form.desc}
  onChange={(e) => updateForm("desc", e.target.value)}
/>

          </div>
          <div className="form-group">
  <label>Start Date</label>
  <div className="input-box">
<input
  type="date"
  value={form.start_date}
  onChange={(e) => updateForm("start_date", e.target.value)}
/>
  </div>
</div>

          <div className="form-group">
            <label>End Date</label>
            <div className="input-box">
            <input
  type="date"
  value={form.end_date}
  onChange={(e) => updateForm("end_date", e.target.value)}
/>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="create" onClick={handleCreate}>
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
