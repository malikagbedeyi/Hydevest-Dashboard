import React, { useEffect, useState } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import "../../../../assets/Styles/dashboard/Purchase/create.scss";
import { TripServices } from "../../../../services/Trip/trip";
import { SupplierService } from "../../../../services/Account/SupplierService";
import { ClearingAgentService } from "../../../../services/Account/ClearingAgentService";

const CreateTrip = ({ onSuccess, setView, data }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [status, setStatus] = useState(data?.status ?? 0);

  // Lists for dropdowns
  const [suppliers, setSuppliers] = useState([]);
  const [clearingAgents, setClearingAgents] = useState([]);

  // Dropdown toggle states
  const [openSupplierDrop, setOpenSupplierDrop] = useState(false);
  const [openClearingDrop, setOpenClearingDrop] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    desc: "",
    start_date: "",
    end_date: "",
    clearing_agent: "",
    Supplier: "",
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch Suppliers and Clearing Agents
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supRes, clearRes] = await Promise.all([
          SupplierService.list(),
          ClearingAgentService.list(),
        ]);
        setSuppliers(supRes?.data?.record?.data || []);
        setClearingAgents(clearRes?.data?.record?.data || []);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };
    fetchData();
  }, []);

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
        supplier: form.Supplier, 
        clearing_agent: form.clearing_agent, 
      };

      await TripServices.create(payload);

      setMessageType("success");
      setMessage("Trip created successfully");
      setShowPopup(true);

      if (onSuccess) {
        await onSuccess();
      }

      setTimeout(() => {
        setShowPopup(false);
        setView("table");
      }, 1200);
    } catch (err) {
      const EndpointMessage =
        err.response?.data?.message || "Trip creation failed. Please check your input.";
      setMessageType("error");
      setMessage(EndpointMessage);
    } finally {
      setLoading(false);
    }
  };

  const [showPopup, setShowPopup] = useState(false);

  if (showPopup) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={() => setView("table")} className="delete-box">✕</div>
            <div className="popup-proceeed-wrapper">
              <span>{message}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-trip-modal slide-up">
      <div className="trip-card">
        <div className="header">
          <h2>Create Trip</h2>
          <X className="close-icon" onClick={() => setView("table")} />
        </div>
        <p className="subtitle">Enter the details of the new trip</p>
        
        {message && messageType === "error" && (
          <span style={{ color: "red", marginBottom: "10px", display: "block" }}>{message}</span>
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
                    onChange={(e) => updateForm("title", e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group-content">
                <label>Location</label>
                <div className="input-box">
                  <input
                    placeholder="Enter Location"
                    value={form.location}
                    onChange={(e) => updateForm("location", e.target.value)}
                  />
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
            <label>Supplier</label>
            <div className="custom-select-container" style={{ position: "relative" }}>
              <div 
                className="input-box" 
                onClick={() => setOpenSupplierDrop(!openSupplierDrop)}
                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <input
                  readOnly
                  placeholder="Select Supplier"
                  value={form.Supplier}
                  style={{ cursor: "pointer", border: "none", outline: "none", width: "100%" }}
                />
                <ChevronDown size={18} />
              </div>
              
              {openSupplierDrop && (
                <div className="dropdown-list" style={{ position: "absolute", top: "100%", left: 0, width: "100%", background: "#fff", zIndex: 10, boxShadow: "0 4px 6px rgba(0,0,0,0.1)", borderRadius: "8px", maxHeight: "200px", overflowY: "auto" }}>
                  {suppliers.length > 0 ? suppliers.map((sup) => (
                    <div 
                      key={sup.id} 
                      className="dropdown-item" 
                      style={{ padding: "10px", cursor: "pointer" }}
                      onClick={() => {
                        updateForm("Supplier", `${sup.firstname} ${sup.lastname}`);
                        setOpenSupplierDrop(false);
                      }}
                    >
                      {sup.supplier_data?.code_name} -{sup.firstname} {sup.lastname}
                    </div>
                  )) : <div style={{ padding: "10px" }}>No Suppliers found</div>}
                </div>
              )}
            </div>
          </div>

          {/* Clearing Agent Dropdown */}
          <div className="form-group">
            <label>Clearing Agent</label>
            <div className="custom-select-container" style={{ position: "relative" }}>
              <div 
                className="input-box" 
                onClick={() => setOpenClearingDrop(!openClearingDrop)}
                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <input
                  readOnly
                  placeholder="Select Clearing Agent"
                  value={form.clearing_agent}
                  style={{ cursor: "pointer", border: "none", outline: "none", width: "100%" }}
                />
                <ChevronDown size={18} />
              </div>

              {openClearingDrop && (
                <div className="dropdown-list" style={{ position: "absolute", top: "100%", left: 0, width: "100%", background: "#fff", zIndex: 10, boxShadow: "0 4px 6px rgba(0,0,0,0.1)", borderRadius: "8px", maxHeight: "200px", overflowY: "auto" }}>
                  {clearingAgents.length > 0 ? clearingAgents.map((agent) => (
                    <div 
                      key={agent.id} 
                      className="dropdown-item" 
                      style={{ padding: "10px", cursor: "pointer" }}
                      onClick={() => {
                        updateForm("clearing_agent", `${agent.firstname} ${agent.lastname}`);
                        setOpenClearingDrop(false);
                      }}
                    >
                      {agent.firstname} {agent.lastname}
                    </div>
                  )) : <div style={{ padding: "10px" }}>No Agents found</div>}
                </div>
              )}
            </div>
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
          <button className="create" onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create Trip"}
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