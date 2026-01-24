import React, { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import '../../../../assets/Styles/dashboard/table.scss';
const RoleSetupTable = ({ data, setData }) => {
  const [deleteRowId, setDeleteRowId] = useState(null); // row selected for deletion
  const [showPopup, setShowPopup] = useState(false);

  // Drill-summary counts
  const totalMembers = data.length;
  const pendingReinvites = data.filter(d => d.status === "Pending").length;
  const restrictedMembers = data.filter(d => d.status === "Restricted").length;
  const accessRequests = data.filter(d => d.status === "Access Request").length;

  const handleDeleteClick = (id) => {
    setDeleteRowId(id);
    setShowPopup(true);
  };

  const confirmDelete = () => {
    setData(prev => prev.filter(d => d.id !== deleteRowId));
    setShowPopup(false);
    setDeleteRowId(null);
  };

  const cancelDelete = () => {
    setShowPopup(false);
    setDeleteRowId(null);
  };

  return (
    <div className="userTable">
      {/* Drill-summary counts */}
      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item">
            <p>Total Members</p>
            <h2>{totalMembers}</h2>
          </div>
          <div className="summary-item">
            <p>Pending Reinvites</p>
            <h2>{pendingReinvites}</h2>
          </div>
          <div className="summary-item">
            <p>Restricted</p>
            <h2>{restrictedMembers}</h2>
          </div>
          <div className="summary-item">
            <p>Access Requests</p>
            <h2>{accessRequests}</h2>
          </div>
        </div>
      </div>
      {/* Table of roles */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Role</th>
              <th>Full Name</th>
              <th>Organization</th>
              <th>Status</th>
              <th>Permissions</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d, idx) => (
              <tr key={d.id}>
                <td>{idx + 1}</td>
                <td>{d.roleType || "-"}</td>
                <td>{d.fullName || "-"}</td>
                <td>{d.organization || "-"}</td>
                <td style={{ color: d.status === "Active" ? "green" : "orange" }}
                className={d.status === "Active" ? "active" : "disabled"}>{d.status}</td>
                <td>{d.permissions.length} permission{d.permissions.length !== 1 ? "s" : ""}</td>
                <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                <td className="action" style={{color:"red"}}>
                  <Trash2 size={16} onClick={() => handleDeleteClick(d.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">
            <h3>Are you sure you want to delete this data row?</h3>
            </div>
            <div className="btn-row">
              <button className="cancel" onClick={cancelDelete}>Cancel</button>
              <button className="delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSetupTable;
