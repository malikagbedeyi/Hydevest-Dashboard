import React, { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import PermissionService from "../../../../services/Admin/PermissionService";
import "../../../../assets/Styles/dashboard/create.scss";

const AssignPermissions = ({ role }) => {
  const [permissions, setPermissions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [original, setOriginal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPerms, setOpenPerms] = useState(false);
  const [searchPerm, setSearchPerm] = useState("");

  // popup
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  /* ================= FETCH ASSIGN LIST ================= */
  const fetchAssignList = async () => {
    try {
      const raw = await PermissionService.getAssignList({
        role_uuid: role.role_uuid,
      });
      
      const records = raw.map(p => ({
        perm_uuid: p.perm_uuid || p.permission_uuid,
        name: p.name || p.permission_name,
        assigned:
          p.assigned === 1 ||
          p.assigned === "1" ||
          p.assigned === true ||
          p.is_assigned === 1 ||
          p.is_assigned === "1",
      }));
      
      setPermissions(records);
      
      const assigned = records
        .filter(p => p.assigned)
        .map(p => p.perm_uuid);
      
      setOriginal(assigned);
      setSelected(assigned);
      
    } catch (err) {
      setMessageType("error");
      setMessage("Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (role?.role_uuid) {
    fetchAssignList();
  }
}, [role?.role_uuid]);

  /* ================= CHECKBOX TOGGLE ================= */
  const togglePermission = (uuid) => {
    setSelected((prev) =>
      prev.includes(uuid)
        ? prev.filter((id) => id !== uuid)
        : [...prev, uuid]
    );
  };

  /* ================= SELECT ALL / UNSELECT ALL ================= */
  const toggleSelectAll = () => {
    if (selected.length === permissions.length) {
      setSelected([]);
    } else {
      setSelected(permissions.map((p) => p.perm_uuid));
    }
  };

  /* ================= SAVE HANDLER ================= */
  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const toAssign = selected.filter((id) => !original.includes(id));
      const toUnassign = original.filter((id) => !selected.includes(id));

      if (!toAssign.length && !toUnassign.length) {
        setMessageType("error");
        setMessage("No changes detected");
        return;
      }

      if (toAssign.length) {
        await PermissionService.assignPermissions({
          role_uuid: role.role_uuid,
          perm_uuids: toAssign,
        });
      }

      if (toUnassign.length) {
        await PermissionService.unassignPermissions({
          role_uuid: role.role_uuid,
          perm_uuids: toUnassign,
        });
      }

      setMessageType("success");
      setMessage("Permissions updated successfully!");
      setOriginal(selected);
    } catch (err) {
      setMessageType("error");
      setMessage(
        err.response?.data?.message || "Failed to update permissions"
      );
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => setMessage(null);

  const filteredPerms = permissions.filter((p) =>
    p.name.toLowerCase().includes(searchPerm.toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <>
      {/* ===== POPUP MESSAGE ===== */}
      {message && (
        <div className="trip-card-popup">
          <div className="trip-card-popup-container">
            <div className={`popup-content ${messageType}`}>
              <div onClick={closePopup} className="delete-box">✕</div>
              <span>{message}</span>
            </div>
          </div>
        </div>
      )}

      {/* ===== ASSIGN PERMISSIONS CARD ===== */}
      <div className="create-container-permission">
        <div className="header">
            <h2>Assign Permissions</h2>
        </div>

        <div className="permission-grid">
          {/* <p>Assigning permissions for role: <b>{role.name}</b></p> */}
          <div className=""
           style={{alignItems:"flex-end",display:"flex" ,justifyContent:"flex-end"}}>
          <p>Role: <b>{role.name}</b></p> 
          </div>
          <div className="form-group-select">
            <label>Permissions</label>
            <div className="custom-select">
              {/* ===== SELECT BOX ===== */}
              <div
                className="custom-select-drop"
                onClick={() => setOpenPerms(!openPerms)}
              >
                <div className="select-box">
                  Assign / Unassign Permission
                </div>
                <ChevronDown />
              </div>

              {/* ===== DROPDOWN ===== */}
              {openPerms && (
                <div className="select-dropdown">
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    value={searchPerm}
                    onChange={(e) => setSearchPerm(e.target.value)}
                  />

                  {/* Select All */}
                  {permissions.length > 0 && (
                    <div className="option-permission select-all" onClick={toggleSelectAll}>
                      <input
                        type="checkbox"
                        checked={selected.length === permissions.length}
                        readOnly
                      />
                      <span>
                        {selected.length === permissions.length ? "Unselect All" : "Select All"}
                      </span>
                    </div>
                  )}

                  {/* Permission List */}
                  {loading ? (
                    <div className="option-permission">Loading...</div>
                  ) : filteredPerms.length === 0 ? (
                    <div className="option-permission">No permissions found</div>
                  ) : (
                    filteredPerms.map((perm) => (
                      <div   key={perm.perm_uuid}
                        className="option-permission-grid"
                        onClick={() => togglePermission(perm.perm_uuid)}>
                        <input
                          type="checkbox"
                          checked={selected.includes(perm.perm_uuid)}
                          readOnly />
                        <span style={{ marginLeft: "8px" }}>{perm.name}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ===== SAVE BUTTON ===== */}
          <div className="btn-row" style={{display:"flex",alignItems:"flex-start",justifyContent:"flex-start",}}>
            <button className="create" onClick={handleSave} disabled={loading}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignPermissions;
