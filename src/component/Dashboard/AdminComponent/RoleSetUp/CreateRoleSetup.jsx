import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/create.scss";
import { X } from "lucide-react";
import RoleService from "../../../../services/Admin/RoleService";
import AssignPermissions from "./AssignPermissions";

const CreateRoleSetup = ({ data, setData, setView, fetchRoles, mode = "create", editData = null }) => {
  const [form, setForm] = useState({
    name: "",
    details: "",
    role_uuid: "",
  });

  const [message, setMessage] = useState(null); // popup message
  const [messageType, setMessageType] = useState("success"); // 'success' | 'error'
  const [loading, setLoading] = useState(false);

  // Prefill form if editing
  useEffect(() => {
    if (mode === "edit" && editData) {
      setForm({
        name: editData.name || "",
        details: editData.details || "",
        role_uuid: editData.role_uuid,
      });
    }
  }, [mode, editData]);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setMessageType("error");
      setMessage("Role name cannot be empty!");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      let resMessage = "";

      if (mode === "edit") {
        await RoleService.editRole(form);
        resMessage = "Role updated successfully!";
      } else {
        await RoleService.createRole(form);
        resMessage = "Role created successfully!";
      }

      setMessageType("success");
      setMessage(resMessage);

      await fetchRoles(); // Refresh table
    } catch (err) {
      console.error(`Error ${mode === "edit" ? "updating" : "creating"} role`, err);
      setMessageType("error");

      // Capture API message if exists
      const apiMessage =
        err.response?.data?.message || err.response?.data?.errors?.[0] || 
        `Failed to ${mode === "edit" ? "update" : "create"} role`;
      setMessage(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  // Close popup handler
  const handleClosePopup = () => {
    setMessage(null);
    if (messageType === "success") setView("table"); // go back to table on success
  };

  return (
    <>
      {/* ================= POPUP MESSAGE ================= */}
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

      {/* ================= FORM MODAL ================= */}
      <div className="trip-modal">
        <div className="create-container-modal">
          <div className="create-container-card">
            <div className="header">
              <div>
                <h2>{mode === "edit" ? "Edit Role" : "Create Role"}</h2>
                <p>{mode === "edit" ? "Update role details" : "Enter role name and optional details"}</p>
              </div>
              <X
                size={18}
                style={{ color: "red" }}
                className="close"
                onClick={() => setView("table")}
              />
            </div>

            <div className="role-content">
              <div className="role-style">
                <div className="grid-2">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Enter Role Name"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Details (Optional)</label>
                    <input
                      type="text"
                      placeholder="Enter Details"
                      value={form.details}
                      onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))}
                    />
                  </div>
                </div>
                {mode === "edit" && editData && (
  <>
    <hr style={{ margin: "30px 0" }} />
    <AssignPermissions role={editData} />
  </>
)}

                <div className="btn-row">
                  <button className="cancel" onClick={() => setView("table")}>
                    Cancel
                  </button>
                  <button className="create" onClick={handleSubmit} disabled={loading}>
                    {mode === "edit" ? "Update Role" : "Create Role"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateRoleSetup;
