import React from "react";
import "../../../../assets/Styles/dashboard/account/userTable.scss";

const SupplierTable = ({ data, currentPage, totalPages, onPageChange, onEdit }) => {
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table"  style={{ width: "120%", minWidth: "120%",maxWidth:"120%" }}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Code Name</th>
              <th>Location</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No Supplier created yet
                </td>
              </tr>
            ) : (
              data.map((user, idx) => (
                <tr key={user.user_uuid} onClick={() => onEdit?.(user)}>
                  <td>{startIndex + idx + 1}</td>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_no}</td>
                  <td>{user.address}</td>
                  <td>{user.supplier_data?.code_name}</td>
                  <td>{user.supplier_data?.location}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
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

export default SupplierTable;
