import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { ChevronDown, X } from "lucide-react";

const PrivilegeOptions = ["NT Admin", "Manager", "User"];
const statusOptions = ["Active", "Disabled"];

const CreateSupplier = ({ users, setUsers, setView, openSubmenu }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    agentName: "",
    location: "",
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
    setSuccessMessage("Supplier successfully created");
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
            <h2>Create Supplier</h2>
            <X size={18} className="close" onClick={() => setView("table")} />
          </div>

          <p>Enter the details of new Supplier</p>

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
            <label htmlFor="">Phone Number</label>
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
        </div>
        <div className="form-group">
            <label htmlFor="">Address</label>
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
      </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
            <label htmlFor="">Code Name</label>
        <input name="agentName" value={form.agentName} onChange={handleChange} placeholder="Code Name" />
      </div>
        <div className="form-group">
            <label htmlFor="">Location</label>
        <input  name="location" value={form.location} onChange={handleChange} placeholder="Location" />
      </div>
      </div>

          {/* ACTIONS */}
          <div className="btn-row">
            <button className="cancel" onClick={() => setView("table")}>
              Cancel
            </button>
            <button className="create" onClick={handleCreate}>
              Create Supplier
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default CreateSupplier;
