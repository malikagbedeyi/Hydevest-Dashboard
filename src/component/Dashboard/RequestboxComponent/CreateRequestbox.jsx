import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

const REQUEST_TYPES = ["Finance", "Inventory", "Logistics", "Administrative"];
const PRIORITIES = ["Normal", "High", "Urgent"];

const CreateRequestbox = ({ onCreate, setView }) => {
  const [openType, setOpenType] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "Administrative",
    recipient: "",
    message: "",
    priority: "Normal",
    dueDate: "",
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.title || !form.recipient || !form.message) {
      alert("Please fill required fields");
      return;
    }

    const payload = {
      ...form,
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    onCreate(payload);
  };

  return (
    <div className="trip-modal slide-up">
      <div className="create-container-modal">
        <div className="create-container-card">
        
      <div className="trip-card">
        <div className="header mb-4">
          <h2>New Request</h2>
          <X className="close-icon" onClick={() => setView("table")} />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Title</label>
            <input   placeholder="Enter Request Title"   value={form.title} 
              onChange={(e) => updateForm("title", e.target.value)} 
            />
          </div>
            <div className="form-group-select">
              <label>Request Type</label>
              <div className="custom-select">
                <div className="custom-select-drop" onClick={() => setOpenType(!openType)}>
                  <span>{form.type}</span>
                  <ChevronDown size={16} />
                </div>
                {openType && (
                  <div className="select-dropdown">
                    {REQUEST_TYPES.map((t) => (
                      <div 
                        key={t} 
                        className="option-item" 
                        onClick={() => {
                          updateForm("type", t); 
                          setOpenType(false);
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid" style={{background:"#fff"}}>
               <div className="form-group mb-3">
              <label>Recipient Name</label>
              <input 
                placeholder="e.g. Admin Manager" 
                value={form.recipient} 
                onChange={(e) => updateForm("recipient", e.target.value)} 
              />
            </div>
               <div className="form-group-select mb-3">
              <label>Priority Level</label>
              <div className="custom-select">
                <div className="custom-select-drop" onClick={() => setOpenPriority(!openPriority)}>
                  <span className={`select-box-${form.priority.toLowerCase()}`}>
                    {form.priority}
                  </span>
                  <ChevronDown size={16} />
                </div>
                {openPriority && (
                  <div className="select-dropdown">
                    {PRIORITIES.map((p) => (
                      <div 
                        key={p} 
                        className="option-item" 
                        onClick={() => {
                          updateForm("priority", p); 
                          setOpenPriority(false);
                        }}
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Due Date (Optional)</label>
              <input 
                type="date" 
                value={form.dueDate} 
                onChange={(e) => updateForm("dueDate", e.target.value)} 
              />
            </div>
            </div>
          <div className="form-group">
            <label>Message Detail</label>
            <textarea 
              className="request-textarea " style={{height:"30vh"}}
              placeholder="Provide more context for your request..." 
              value={form.message} 
              onChange={(e) => updateForm("message", e.target.value)} 
            />
          </div>
        </div>

        <div className="btn-row">
          <button className="create" onClick={handleSubmit}>Send Request</button>
          <button className="cancel" onClick={() => setView("table")}>Cancel</button>
        </div>
      </div>
    </div>
      </div>
        </div>
  );
};

export default CreateRequestbox;