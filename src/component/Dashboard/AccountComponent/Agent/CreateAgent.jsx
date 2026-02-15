import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { X } from "lucide-react";
import { ClearingAgentService } from "../../../../services/Account/ClearingAgentService";

const CreateAgent = ({setView,mode = "submenu",onClose,refresh,editData = null,}) => {

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success", // success | error
  });

  const [form, setForm] = useState({
    firstname: "",lastname: "",email: "",phone_no: "",address: "",
    company_registration_number: "",bank_name: "",bank_account: "",
  });

  /* ================= PREFILL EDIT ================= */
  useEffect(() => {
    if (editData) {
      setForm({
        firstname: editData.firstname || "",lastname: editData.lastname || "",email: editData.email || "",
       phone_no: editData.phone_no || "",address: editData.address || "",company_registration_number:
      editData.clearing_agent_bank?.company_registration_number || "",bank_name: editData.clearing_agent_bank?.bank_name || "",bank_account: editData.clearing_agent_bank?.bank_account || "",
      });
    }
  }, [editData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (editData) {
        await ClearingAgentService.edit({
          user_uuid: editData.user_uuid, firstname: form.firstname,lastname: form.lastname,
          email: form.email,phone_no: form.phone_no,address: form.address,
          company_registration_number: form.company_registration_number,
        });

        await ClearingAgentService.editBank({
          user_uuid: editData.user_uuid,
          bank_name: form.bank_name,
          bank_account: form.bank_account,
        });

        showPopup("Clearing Agent updated successfully", "success");
      } else {
        await ClearingAgentService.create(form);
        showPopup("Clearing Agent created successfully", "success");
      }
      if (mode === "submenu" && typeof setView === "function") {
        setView("table");
      }
      //  refresh?.();

      // auto close after success
      setTimeout(() => {
        handleClosePopup();
      }, 2500);

    } catch (err) {
      console.error(err);
      showPopup(
        err.response?.data?.message || "Operation failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= POPUP HELPERS ================= */
  const showPopup = (message, type) => {
    setPopup({
      show: true,
      message,
      type,
    });
  };

  const handleClosePopup = () => {
    setPopup({ show: false, message: "", type: "success" });

    if (popup.type === "success") {
      if (mode === "submenu") setView("table");
      onClose?.();
    }
  };

  /* ================= UI ================= */
  return (
    <>
      {/* POPUP */}
      {popup.show && (
        <div className="trip-card-popup">
          <div className="trip-card-popup-container">
            <div className={`popup-content ${popup.type}`}>
              <div
                className="delete-box"
                onClick={handleClosePopup}
              >
                ✕
              </div>
              <span>{popup.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      <div className="trip-modal">
        <div className="create-container-modal">
          <div className="create-container-card">
            <div className="header">
              <h2>
                {editData ? "Edit Clearing Agent" : "Create Clearing Agent"}
              </h2>
              <X
                className="close"
                onClick={!loading ? onClose : undefined}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>First Name</label>
                <input name="firstname" value={form.firstname} placeholder='Enter First Name' onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="lastname" value={form.lastname}placeholder='Enter Last Name'  onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input  name="email"value={form.email} placeholder='Enter Email'   onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input  name="phone_no"value={form.phone_no}placeholder='Enter Phone'    onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input name="address"value={form.address}placeholder='Enter Address'  onChange={handleChange}/>
              </div>

              <div className="form-group">
                <label>Company Reg No</label>
                <input  name="company_registration_number" placeholder='Enter Company Reg No'  value={form.company_registration_number}  onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Bank Name</label>
                <input  name="bank_name"  value={form.bank_name} placeholder='Enter Bank Name'  onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Bank Account Number</label>
                <input type="number"   name="bank_account" placeholder='Enter Bank Account Number'  value={form.bank_account}  onChange={handleChange} />
              </div>
            </div>

            <div className="btn-row">
              {mode === "submenu" && (
                <button className="cancel" onClick={onClose} disabled={loading}>
                  Cancel</button>
                  )}

              <button className="create" onClick={handleSubmit} disabled={loading}>
                {loading? "Saving...": editData? "Update Agent": "Create Agent"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAgent;
