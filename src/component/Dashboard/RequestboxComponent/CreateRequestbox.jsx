import React, { useState } from "react";
import { X } from "lucide-react";
import "../../../assets/Styles/dashboard/Purchase/create.scss";

const CreateRequestbox = ({ onCreate, setView }) => {
  const [form, setForm] = useState({
    title: "",
    recipient: "",
    message: "",
    priority: "normal",
    dueDate: "",
    attachments: null,
  });

  const [showPopup, setShowPopup] = useState(false);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateRequest = () => {
    if (!form.title || !form.recipient || !form.message) {
      alert("Please fill in all required fields!");
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
              <span>Request successfully sent</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-trip-modal">
      <div className="trip-card">
        <div className="header">
          <h2>Create Request</h2>
          <X className="close-icon" onClick={() => setView("table")} />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Title</label>
            <input
              placeholder="Enter title"
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Recipient</label>
            <input
              placeholder="Enter recipient"
              value={form.recipient}
              onChange={(e) => updateForm("recipient", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              placeholder="Enter your message"
              value={form.message}
              onChange={(e) => updateForm("message", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              value={form.priority}
              onChange={(e) => updateForm("priority", e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => updateForm("dueDate", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Attachment</label>
            <input
              type="file"
              onChange={(e) => updateForm("attachments", e.target.files[0])}
            />
          </div>
        </div>

        <div className="btn-row">
          <button className="create" onClick={handleCreateRequest}>
            Send Request
          </button>
          <button className="cancel" onClick={() => setView("table")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestbox;
