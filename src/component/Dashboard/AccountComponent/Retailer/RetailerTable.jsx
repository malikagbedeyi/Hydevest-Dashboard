import React from "react";
import "../../../../assets/Styles/dashboard/account/userTable.scss";

const RetailerTable = ({ data, currentPage, totalPages, onPageChange, onEdit }) => {
  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{ width: "110%", minWidth: "110%",maxWidth:"110%" }}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Customer found
                </td>
              </tr>
            ) : (
              data.map((user, idx) => (
                <tr key={user.user_uuid} onClick={() => onEdit?.(user)}>
                  <td>{(currentPage - 1) * 10 + idx + 1}</td>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_no}</td>
                  <td>{user.address}</td>
                  <td>{new Date(user.createdAt || user.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RetailerTable;
