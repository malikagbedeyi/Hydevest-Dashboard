import React, { useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { X } from "lucide-react";
import { CustomerService } from "../../../../services/Account/CustomerService";

const CreateRetailer = ({ data = [], setData, setView, openSubmenu, mode = "submenu", fetchData, editData = null }) => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_no: "",
    address: "",
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (editData) {
      setForm({
        firstname: editData.firstname || "",
        lastname: editData.lastname || "",
        email: editData.email || "",
        phone_no: editData.phone_no || "",
        address: editData.address || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editData) {
        await CustomerService.edit({ user_uuid: editData.user_uuid, ...form });
        setMessage("Customer updated successfully");
      } else {
        await CustomerService.create(form);
        setMessage("Customer created successfully");
      }
      if (mode === "account") {
        openSubmenu("accounts", "/dashboard/accounts/retailer");
        return;
      }
      fetchData?.(); // refresh table
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Operation failed");
    }
  };

  const handleClosePopup = () => {
    setMessage(null);
    if (message === "success")setView("table");
  };
  const handleCancel = () => {
    if (mode === "submenu" && setView) setView("table");
  };

  return (
    <>
      {message && (
        <div className="trip-card-popup">
          <div className="trip-card-popup-container">
            <div className="popup-content">
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
              <h2>{editData ? "Edit Customer" : "Create Customer"}</h2>
              <X className="close" onClick={handleCancel} />
            </div>

            <p>Enter Customer Details</p>

            <div className="account-grid">
              <div className="account-grid-content">
                <div className="grid-2">
                  <div className="form-group">
                    <label>First Name</label>
                    <input name="firstname" value={form.firstname} onChange={handleChange} placeholder="Enter First Name" />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input name="lastname" value={form.lastname} onChange={handleChange} placeholder="Enter Last Name" />
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label>Email</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Enter Email" />
                </div>

                <div className="grid-2">
                  <div className="form-group highlighted">
                    <label>Phone Number</label>
                    <input name="phone_no" value={form.phone_no} onChange={handleChange} placeholder="Enter Phone Number" />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input name="address" value={form.address} onChange={handleChange} placeholder="Enter Address" />
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              {mode === "submenu" && <button className="cancel" onClick={handleCancel}>Cancel</button>}
              <button className="create" onClick={handleSubmit}>{editData ? "Update Customer" : "Create Customer"}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateRetailer;
