import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { ChevronDown, X } from "lucide-react";

const PrivilegeOptions = ["NT Admin", "Manager", "User"];
const statusOptions = ["Active", "Disabled"];

const CreateEntity = ({ data, setData, setView, openSubmenu }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    director: "",
    otherDirector: "",
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

  const handleCreate = () => {
    const newdata = {
      id: crypto.randomUUID(),
      ...form,
      fullName: `${form.firstName} ${form.lastName}`, // 👈 useful later
      createdAt: new Date().toISOString(),
    };
  
    setData((prev) => [newdata, ...prev]);
    setSuccessMessage("Entity successfully created");
  };
  

  const handleClosePopup = () => {
    setSuccessMessage(null);
    setView("table");
    openSubmenu?.("data");
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
            <h2>Create Entity</h2>
            <X size={18} className="close" onClick={() => setView("table")} />
          </div>
          <p>Enter the details of new Entity</p>

          <div className="account-grid">
            <div className="account-grid-content">
            <div className="grid-2">
         <div className="form-group">
             <label>Entity Name</label>
         <input  name="name" value={form.name} onChange={handleChange} placeholder="Name" />
         </div>
         <div className="form-group">
             <label>Entity Email</label>
         <input  name="email" value={form.email} onChange={handleChange} placeholder="Email" />
       </div>
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
             <label htmlFor="">Director 1</label>
         <input name="director" value={form.director} onChange={handleChange} placeholder="Enter Director" />
      </div>
        <div className="form-group">
              <label htmlFor=""> Director 2</label>
         <input name="otherDirector" value={form.otherDirector} onChange={handleChange} placeholder="Enter Director 2" />
      </div>
        </div>
        <div className="grid-2">
        <div className="form-group">
          <label>Bank Name</label>
          <input name="bankName"
           placeholder="Enter Bank Name"
            value={form.bankName} onChange={handleChange} type="text" />
        </div>
        <div className="form-group">
          <label>Bank Account</label>
          <input name="bankAccount"
           placeholder="Enter Bank Account"
            value={form.bankAccount} onChange={handleChange} type="text" />
        </div>
      </div>
        {/* ACTIONS */}
        <div className="btn-row">
            <button className="cancel" onClick={() => setView("table")}>
              Cancel
            </button>
            <button className="create" onClick={handleCreate}>
              Create Entity
            </button>
          </div>
      </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default CreateEntity;
