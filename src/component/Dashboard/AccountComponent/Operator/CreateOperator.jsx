import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { X } from "lucide-react";
import { BdcOperatorService } from "../../../../services/Account/BdcOperatorService";

const CreateOperator = ({
  setView,
  refresh,
  mode = "submenu",
  editData = null,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_no: "",
    address: "",
    company_registration_number: "",
    bank_name: "",
    bank_account: "",
  });

  /* ================= PREFILL ON EDIT ================= */
  useEffect(() => {
    if (editData) {
      setForm({
        firstname: editData.firstname || "",
        lastname: editData.lastname || "",
        email: editData.email || "",
        phone_no: editData.phone_no || "",
        address: editData.address || "",
        company_registration_number:
          editData.bdc_operator_bank?.company_registration_number || "",
        bank_name: editData.bdc_operator_bank?.bank_name || "",
        bank_account: editData.bdc_operator_bank?.bank_account || "",
      });
    }
  }, [editData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);

      if (editData) {
        // 🔹 EDIT OPERATOR
        await BdcOperatorService.edit({
          user_uuid: editData.user_uuid,
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          phone_no: form.phone_no,
          address: form.address,
          company_registration_number: form.company_registration_number,
        });

        // 🔹 EDIT BANK
        await BdcOperatorService.editBank({
          user_uuid: editData.user_uuid,
          bank_name: form.bank_name,
          bank_account: form.bank_account,
        });

        setMessage("BDC Operator updated successfully");
      } else {
        // 🔹 CREATE
        await BdcOperatorService.create(form);
        setMessage("BDC Operator created successfully");
      }

      setMessageType("success");
      refresh();
      if (mode === "submenu") setView("table");
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
    if (messageType === "success") onClose?.() || setView("table");
  };

  return (
    <>
      {/* ================= POPUP ================= */}
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

      {/* ================= MODAL ================= */}
      <div className="trip-modal">
        <div className="create-container-modal">
          <div className="create-container-card">
            <div className="header">
              <h2>{editData ? "Edit BDC Operator" : "Create BDC Operator"}</h2>
              <X className="close" onClick={() => setView("table")} />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="">First Name</label>
              <input name="firstname" value={form.firstname} onChange={handleChange} placeholder="First Name" />
              </div>
              <div className="form-group">
                <label htmlFor="">Last Name</label>
              <input name="lastname" value={form.lastname} onChange={handleChange} placeholder="Last Name" />
              </div>
              <div className="form-group">
                <label htmlFor="">Email Address</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
              </div>
              <div className="form-group">
                <label htmlFor="">Phone Number</label>
              <input name="phone_no" value={form.phone_no} onChange={handleChange} placeholder="Phone" />
              </div>
              <div className="form-group">
                <label htmlFor="">Address </label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
              </div>
              <div className="form-group">
                <label htmlFor="">Company Registration Number</label>
              <input  name="company_registration_number" value={form.company_registration_number} onChange={handleChange}  placeholder="Company Reg No"/>
              </div>
              <div className="form-group">
                <label htmlFor="">Bank Name</label>
              <input name="bank_name" value={form.bank_name} onChange={handleChange} placeholder="Bank Name" />
              </div>
              <div className="form-group">
                <label htmlFor="">Bank Account Number</label>
              <input name="bank_account" type="number" value={form.bank_account} onChange={handleChange} placeholder="Bank Account" />
              </div>
            </div>

            <div className="btn-row">
            {mode === "submenu" && (
            <button className="cancel" onClick={() => setView("table")}>Cancel</button>
            )}
              <button className="create" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : editData ? "Update Operator" : "Create Operator"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateOperator;
