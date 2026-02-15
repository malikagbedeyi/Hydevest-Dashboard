import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { X } from "lucide-react";
import { SupplierService } from "../../../../services/Account/SupplierService";

const CreateSupplier = ({
  data = [],
  setData,
  setView,
  openSubmenu,
  mode = "submenu",
  refresh,
  editData = null,
  onClose
}) => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_no: "",
    address: "",
    code_name: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  // Populate form if editing
  useEffect(() => {
    if (editData) {
      setForm({
        firstname: editData.firstname || "",
        lastname: editData.lastname || "",
        email: editData.email || "",
        phone_no: editData.phone_no || "",
        address: editData.address || "",
        code_name: editData.supplier_data?.code_name || "",
        location: editData.supplier_data?.location || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);

      if (editData) {
        // Edit supplier
        await SupplierService.edit({
          user_uuid: editData.user_uuid,
          ...form,
        });
        setMessage("Supplier updated successfully");
      } else {
        // Create supplier
        await SupplierService.create(form);
        setMessage("Supplier created successfully");
      }

      setMessageType("success");

      // Refresh table data
      if (typeof refresh === "function") refresh();

      // Close view or submenu
      if (mode === "submenu" && typeof setView === "function") {
        setView("table");
      }
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
    if (mode === "submenu" && setView) setView("table");
    else onClose?.();
  };

  return (
    <>
      {/* Success/Error Popup */}
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

      {/* Modal Form */}
      <div className="trip-modal">
        <div className="create-container-modal">
          <div className="create-container-card">
            <div className="header">
              <div>
                <h2>{editData ? "Edit Supplier" : "Create Supplier"}</h2>
                <p>Enter Supplier details</p>
              </div>
              <X className="close" onClick={handleCancel} />
            </div>

            <div className="grid-2 mt-3">
              <div className="form-group">
                <label>First Name</label>
                <input
                  name="firstname"
                  placeholder="Enter First Name"
                  value={form.firstname}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  name="lastname"
                  placeholder="Enter Last Name"
                  value={form.lastname}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  name="phone_no"
                  placeholder="Phone"
                  value={form.phone_no}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Code Name</label>
                <input
                  name="code_name"
                  placeholder="Code Name"
                  value={form.code_name}
                  onChange={handleChange}
                />
              </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

            <div className="btn-row">
              {mode === "submenu" && (
                <button className="cancel" onClick={handleCancel}>Cancel</button>
              )}
              <button className="create" onClick={handleSubmit} disabled={loading}>
                {loading ? (editData ? "Updating..." : "Saving...") : editData ? "Update Supplier" : "Create Supplier"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateSupplier;
