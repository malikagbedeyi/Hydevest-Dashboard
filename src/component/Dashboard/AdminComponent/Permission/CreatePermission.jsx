import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import PermissionService from "../../../../services/Admin/PermissionService";

const CreatePermission = ({ setView, fetchPermissions, mode, editData }) => {
  const [form, setForm] = useState({
    name: "",
    details: "",
    perm_uuid: "",
    status: 1,
  });

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && editData) {
      setForm({
        name: editData.name || "",
        details: editData.details || "",
        perm_uuid: editData.perm_uuid,
        status: editData.status ?? 1,
      });
    }
  }, [mode, editData]);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setMessageType("error");
      setMessage("Permission name cannot be empty!");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      if (mode === "edit") {
        await PermissionService.editPermission(form);
        setMessage("Permission updated successfully!");
      } else {
        await PermissionService.createPermission(form);
        setMessage("Permission created successfully!");
      }

      setMessageType("success");
      await fetchPermissions();
    } catch (err) {
      console.error("Permission save failed:", err);

      const apiMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        `Failed to ${mode === "edit" ? "update" : "create"} permission`;

      setMessageType("error");
      setMessage(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setMessage(null);
    if (messageType === "success") {
      setView("table");
    }
  };

  return (
    <>
      {/* ===== POPUP MESSAGE ===== */}
      {message && (
        <div className="trip-card-popup">
          <div className="trip-card-popup-container">
            <div className={`popup-content ${messageType}`}>
              <div onClick={handleClosePopup} className="delete-box"
              style={{color:"red",cursor:"pointer"}}>✕</div>
              <span>{message}</span>
            </div>
          </div>
        </div>
      )}

      {/* ===== FORM MODAL ===== */}
      <div className="trip-modal">
        <div className="create-container-modal">
          <div className="create-container-card">
            <div className="header">
              <h2>{mode === "edit" ? "Edit Permission" : "Create Permission"}</h2>
              <X onClick={() => setView("table")} style={{color:"red",cursor:"pointer"}} />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Permission Name</label>
                <input
                  placeholder="Permission name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Details</label>
                <input
                  placeholder="Details"
                  value={form.details}
                  onChange={(e) =>
                    setForm({ ...form, details: e.target.value })
                  }
                />
              </div>

              <div className="btn-row" style={{ marginLeft: "auto" }}>
                <button
                  className="create"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {mode === "edit" ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePermission;
