import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { X } from "lucide-react";
import { InvestorService } from "../../../../services/Account/InvestorService";

const CreateInvest = ({setView, mode="submenu",onClose, refresh, editData = null }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_no: "",
    password: "",
    bank_name: "",
    bank_account: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        firstname: editData.firstname || "",
        lastname: editData.lastname || "",
        email: editData.email || "",
        phone_no: editData.phone_no || "",
        password: "",
        bank_name: editData.hynvest_bank?.bank_name || "",
        bank_account: editData.hynvest_bank?.bank_account || "",
      });
    }
  }, [editData]);

  const handleChange = (e) =>
  setForm({ ...form, [e.target.name]: e.target.value });


  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);

      if (editData) {
        await InvestorService.edit({
          user_uuid: editData.user_uuid,
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          phone_no: form.phone_no,
        });

        await InvestorService.editBank({
          user_uuid: editData.user_uuid,
          bank_name: form.bank_name,
          bank_account: form.bank_account,
        });
       
        if (form.password) {
          await InvestorService.changePassword(editData.user_uuid, form.password);
        }

        setMessage("Investor updated successfully");
      } else {
        await InvestorService.create(form);
        setMessage("Investor created successfully");
      }
      if (mode === "submenu" && typeof setView === "function") {
        setView("table");
      }
      setMessageType("success");
      refresh();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Operation failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setMessage(null);
    if (messageType === "success") onClose?.();
  };
  const handleCancel = () => {
    if (mode === "submenu" && setView) {
      setView("table")
    }
  };
  return (
    <>
      {message && (
        <div className="trip-card-popup">
          <div className="trip-card-popup-container">
            <div className={`popup-content ${messageType}`}>
              <div onClick={handleClosePopup} className="delete-box">✕</div>
              <span>{message}</span>
            </div>
          </div>
        </div>
      )}

      <div className="trip-modal">
        <div className="create-container-modal">
          <div className="create-container-card">
            <div className="header">
              <div>
                <h2>{editData ? "Edit Investor" : "Create Investor"}</h2>
                <p>Enter Investor details</p>
              </div>
              <X className="close" onClick={onClose} />
            </div>

            <div className="grid-2 mt-3">
              <div className="form-group">
                <label>First Name</label>
                <input name="firstname" placeholder="Enter firstname" value={form.firstname} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="lastname" placeholder="Enter lastname" value={form.lastname} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" placeholder="Enter email " value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Phone No</label>
                <input name="phone_no" placeholder="Enter phone_no" value={form.phone_no} onChange={handleChange} />
              </div>
              {editData ? (
                <div className="form-group">
                  <label>Change Password</label>
                  <input
                    type="password"
                    placeholder="Leave empty to keep current password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" placeholder="Enter password" name="password" value={form.password} onChange={handleChange} />
                </div>
              )}
              <div className="form-group">
                <label>Bank Name</label>
                <input name="bank_name" placeholder="Enter " value={form.bank_name} onChange={handleChange} />
              </div>
            </div>
             <div className="form-group">
                <label>Bank Account</label>
                <input name="bank_account" placeholder="Enter " type="number" value={form.bank_account} onChange={handleChange} />
              </div>
            <div className="btn-row">
  {mode === "submenu" && (
    <button className="cancel" onClick={onClose}>
      Cancel
    </button>
  )}<button className="create" onClick={handleSubmit} disabled={loading}>
  {loading ? "Saving..." : editData ? "Update Investor" : "Create Investor"}
          </button>  
</div>
         
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateInvest;
