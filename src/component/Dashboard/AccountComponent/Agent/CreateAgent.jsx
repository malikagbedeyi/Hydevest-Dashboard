import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { ChevronDown, X } from "lucide-react";

const PrivilegeOptions = ["NT Admin", "Manager", "User"];
const statusOptions = ["Active", "Disabled"];

const CreateAgent = ({ users, setUsers, setView, openSubmenu }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    personnelName: "",
    bankName: "",
    bankNumber: "",
    agentContact: "",
    address: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // const handleChange = (e) =>
  // setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = () => {
    const newdata = {
      id: crypto.randomUUID(),
      ...form,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newdata, ...prev]);
    setSuccessMessage("Agent successfully created");
  };

  const handleClosePopup = () => {
    setSuccessMessage(null);
    setView("table");
    openSubmenu?.("users");
  };

  /* ================= SUCCESS POPUP ================= */
  if (successMessage) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={handleClosePopup} className="delete-box">✕</div>
            <span>{successMessage}</span>
          </div>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="">
      <div className="create-container-modal">
        <div className="create-container-card">

          {/* HEADER */}
          <div className="header">
            <h2>Create Clearing Agent</h2>
            <X size={18} className="close" onClick={() => setView("table")} />
          </div>
 
          <p>Enter the details of new Clearing Agent</p>

          {/* BASIC INFO */}
          <div className="account-grid">
            <div className="account-grid-content">
            <div className="grid-2">
            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter First Name"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter Last Name"
              />
            </div>
      </div>
      <div className="form-group mb-4">
          <label>Email</label>
          <input name="email"
           placeholder="Enter Email"
            value={form.email} onChange={handleChange} type="email" />
        </div>
         <div className="grid-2">
        <div className="form-group">
            <label>Phone Number</label>
                  <input name="phone" onChange={handleChange} placeholder="Enter Phone Number" />
        </div>
         <div className="form-group">
            <label>Agent Personnel Name</label>
                  <input name="personnelName" onChange={handleChange} placeholder="Enter Agent Personnel Name" />
        </div>
        </div>
         <div className="grid-2">
        <div className="form-group">
            <label>Bank Name</label>
                  <input name="bankName" onChange={handleChange} placeholder="Enter Bank Name" />
        </div>
         <div className="form-group">
            <label>Bank Number</label>
                  <input name="bankNumber" onChange={handleChange} placeholder="Enter Bank Number" />
        </div>
        </div>
         <div className="grid-2">
        <div className="form-group">
            <label>Agent Contact</label>
                  <input name="agentContact" onChange={handleChange} placeholder="Enter Agent Contact" />
        </div>
         <div className="form-group">
            <label>Address</label>
                  <input name="address" onChange={handleChange} placeholder="Enter Address" />
        </div>
        </div>

          {/* ACTIONS */}
          <div className="btn-row">
            <button className="cancel" onClick={() => setView("table")}>
              Cancel
            </button>
            <button className="create" onClick={handleCreate}>
              Create Clearing Agent
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default CreateAgent;
