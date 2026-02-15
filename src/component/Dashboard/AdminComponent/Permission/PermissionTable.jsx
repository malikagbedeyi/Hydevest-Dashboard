import React from "react";
import "../../../../assets/Styles/dashboard/table.scss";

const PermissionTable = ({
  data,
  loading,
  page,
  totalPages,
  onPageChange,
  setView,
  setEditPermission,
}) => {
  const handleEdit = (perm) => {
    setEditPermission(perm);
    setView("edit");
  };

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{ width: "100%",maxWidth:"100%",minWidth:"100%" }}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Details</th>
              <th>Created by</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="4">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td >No Permission Found</td></tr>
            ) : (
              data.map((p, idx) => (
                <tr key={p.perm_uuid} onClick={() => handleEdit(p)}>
                  <td>{idx + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.details || "-"}</td>
                    <td>{p.creator_info.firstname} {p.creator_info.lastname}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default PermissionTable;
