import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { X } from "lucide-react";
import { PartnerService } from "../../../../services/Account/PartnerService";

const CreatePartner = ({data, setView, onSuccess, mode  }) => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_no: "",
    password: "", 
    bank_name: "",
    bank_account: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [status, setStatus] = useState(data?.status ?? 0);
const isApproved = status === 1;

  useEffect(() => {
    if (mode === "edit" && data) {
      setForm({
        user_uuid: data.user_uuid,
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        email: data.email || "",
        phone_no: data.phone_no || "",
        password: "",
        bank_name: data.partner_bank?.bank_name || "",
        bank_account: data.partner_bank?.bank_account || "",
      });
    }
  }, [mode, data]);
  useEffect(() => {
    if (mode === "edit" && data) {
      setStatus(data.status ?? 0);
    }
  }, [data, mode]);
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
  
      await PartnerService.edit({
        user_uuid: form.user_uuid,
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        phone_no: form.phone_no,
      });
  
      await PartnerService.editBank({
        user_uuid: form.user_uuid,
        bank_name: form.bank_name,
        bank_account: form.bank_account,
      });
      if (form.password) {
        await PartnerService.changePassword(
          form.user_uuid,
          form.password
        );
      }
  
      setMessageType("success");
      setMessage("Partner updated successfully");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreate = async () => {
    try {
      setLoading(true);
      setMessage(null);
  
      if (mode === "edit") {
        await handleUpdate();
      } else {
        await PartnerService.create(form);
      }
      

    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        "partner failed. Please check your input.";
  
      setMessageType("error");
      setMessage(backendMessage);
    } finally {
      setLoading(false);
    }
    if (mode === "submenu" && typeof setView === "function") {
      setView("table");
    }
  }

  const handleClosePopup = () => {
    setMessage(null);
  
    if (messageType === "success") {
      onSuccess?.();        // refresh table
      setView("table");     // ALWAYS go back
    }
  };
  
  const handleCancel = () => {
    if (mode === "submenu"){
     setView("table");
    }
  };
  const payload = { ...form };
  if (mode === "edit" && !payload.password) {
    delete payload.password;
  }
  const handleApprove = async () => {
    try {
      setLoading(true);
      await PartnerService.changeStatus(form.user_uuid, 1);
      setStatus(1); // approved
      setMessageType("success");
      setMessage("Partner approved successfully");
    } catch (err) {
      setMessageType("error");
      setMessage(
        err.response?.data?.message || "Failed to approve partner"
      );
    } finally {
      setLoading(false);
    }
  };
  
  /* ================= MESSAGE POPUP ================= */
  if (message) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className={`popup-content ${messageType}`}>
            <div onClick={handleClosePopup} className="delete-box">✕</div>
            <span>{message}</span>
          </div>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="trip-modal">
      <div className="create-container-modal">
        <div className="create-container-card">
        {mode === "edit" && !isApproved && (
  <div className="approval-bar">
    <span className="status-badge pending">Pending</span>
    <button
      className="approve-btn"
      onClick={handleApprove}
      disabled={loading}
    >
      Approve Partner
    </button>
  </div>
)}

          <div className="header">
          <h3>{mode === "edit" ? "Edit Partner" : "Create New Partner"}</h3>
            <X size={18} className="close" onClick={() => setView("table")} />
          </div>

          <p>Enter the details for  Partner</p>

          <div className="account-grid-content">
            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="">First Name</label>
                <input name="firstname" placeholder="First Name" value={form.firstname} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="">Last Name</label>
                <input name="lastname" placeholder="Last Name"  value={form.lastname} onChange={handleChange} />
              </div>
            
              <div className="form-group">
                <label htmlFor="">Email</label>
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
              </div>
          
            <div className="form-group">
              <label htmlFor="">Phone No</label>
              <input name="phone_no" placeholder="Phone Number" value={form.phone_no} onChange={handleChange} />
            </div>
            {mode !== "edit" && (
  <div className="form-group">
    <label>New Password (optional)</label>
    <input  type="password"  name="password"   placeholder="Enter Password"
      value={form.password} onChange={handleChange}
    />
  </div>
)}
            
             {mode === "edit" && (
  <div className="form-group">
    <label>New Password (optional)</label>
    <input  type="password"  name="password"   placeholder="Enter New Password to Change Password"
      value={form.password} onChange={handleChange}
    />
  </div>
)}

            
              <div className="form-group">
                <label htmlFor="">Bank Name</label>
                <input name="bank_name" placeholder="Bank Name" value={form.bank_name} onChange={handleChange} />
              </div>
                </div>
                <div className="form-group">
                <label htmlFor="">Bank Account Number</label>
                <input name="bank_account" type="number" placeholder="Bank Account" value={form.bank_account} onChange={handleChange} />          
              </div>

           <div className="btn-row">
                {mode === "submenu" && (
                  <button className="cancel" onClick={handleCancel}>Cancel</button>
                )}
                <button className="create" onClick={handleCreate}>
                {mode === "edit" ? "Update Partner" : "Create Partner"}
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePartner;
