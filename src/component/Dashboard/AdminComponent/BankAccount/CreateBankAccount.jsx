import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { ChevronDown, X } from "lucide-react";


const CreateBankAccount = ({ data, setData, setView, openSubmenu }) => {
  const [form, setForm] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    bankNumber: "",
    entity: "",
    accountOfficerName: "",
    accountOfficerNumber: "",
    currency:"",
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
    setSuccessMessage("Account successfully created");
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
            <h2>Create Bank Account</h2>
            <X size={18} className="close" onClick={() => setView("table")} />
          </div>
          <p>Enter the details of new Bank Account</p>

          <div className="account-grid">
            <div className="account-grid-content">
            <div className="grid-2">
        <div className="form-group">
            <label>Account Name</label>
        <input  name="accountNumber" value={form.accountName} onChange={handleChange} placeholder="Enter Account Name" />
        </div>
         <div className="form-group">
            <label>Account Number</label>
        <input  name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="Enter Account Number" />
        </div>
      </div>
      <div className="grid-2">
        <div className="form-group">
            <label htmlFor="">Bank Name</label>
        <input name="bankName" value={form.bankName} onChange={handleChange} placeholder="Enter Bank Name" />
        </div>
         <div className="form-group">
            <label htmlFor="">Bank Number</label>
        <input name="bankNumber" value={form.bankNumber} onChange={handleChange} placeholder="Enter Bank Number" />
        </div>
      </div>
      <div className="grid-2">
         <div className="form-group highlighted">
          <label>Entity</label>
          <select
            name="entity"
            value={form.entity}
            onChange={handleChange}  >
            <option value="">Select Entity</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
           <div className="form-group highlighted">
          <label>Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
          >
            <option value="">Select currency</option>
            <option value="Admin">USD</option>
            <option value="Manager">NGN</option>
            <option value="Staff">GBP</option>
          </select>
        </div>
        </div>
        <div className="grid-2">
         <div className="form-group">
            <label>Account Officer Number</label>
        <input  name="accountOfficerNumber" value={form.accountOfficerNumber} onChange={handleChange} placeholder="Enter Account Officer Number" />
        </div>
       <div className="form-group">
            <label>Account Officer Name</label>
        <input  name="accountOfficerName" value={form.accountOfficerName} onChange={handleChange} placeholder="Enter Account Officer Name" />
        </div>
        </div>
        {/* ACTIONS */}
        <div className="btn-row">
            <button className="cancel" onClick={() => setView("table")}>
              Cancel
            </button>
            <button className="create" onClick={handleCreate}>
              Create Account
            </button>
          </div>
      </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default CreateBankAccount;