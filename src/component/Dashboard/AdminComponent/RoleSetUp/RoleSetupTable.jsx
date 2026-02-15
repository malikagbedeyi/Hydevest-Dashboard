import React from "react";
import "../../../../assets/Styles/dashboard/table.scss";

const RoleSetupTable = ({data,loading,page,totalPages,onPageChange,setView,setEditRole,}) => {

  const handleEdit = (role) => {
    setEditRole(role);
    setView("edit");
  };

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{ width: "100%",maxWidth:"100%",minWidth:"100%" }}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Role Name</th>
              <th>Details</th>
              <th>Assign Permission</th>
              <th>Created by</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Loading roles...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No Role Found
                </td>
              </tr>
            ) : (
              data.map((d, idx) => (
                <tr key={d.role_uuid}   onClick={() => handleEdit(d)}>
                  <td>{idx + 1}</td>
                  <td>{d.name || "-"}</td>
                  <td>{d.details || "-"}</td>
                  <td>{d.permissions_count} </td>
                  <td>{d.creator_info.firstname} {d.creator_info.lastname}</td>
                  <td>{new Date(d.created_at).toLocaleDateString()}</td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSetupTable;
