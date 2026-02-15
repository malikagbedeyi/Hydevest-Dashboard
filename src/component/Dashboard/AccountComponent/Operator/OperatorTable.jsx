import React from "react";
import "../../../../assets/Styles/dashboard/account/userTable.scss";

const OperatorTable = ({
  data = [],
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
}) => {
  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Bank Name</th>
              <th>Bank Account</th>
              <th>Company Reg No</th>
              <th>Address</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No BDC Operator created yet
                </td>
              </tr>
            ) : (
              data.map((user, idx) => (
                <tr
                  key={user.user_uuid}
                  onClick={() => onEdit?.(user)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{(currentPage - 1) * 10 + idx + 1}</td>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_no}</td>
                  <td>{user.bdc_operator_bank?.bank_name || "-"}</td>
                  <td>{user.bdc_operator_bank?.bank_account || "-"}</td>
                  <td>{user.bdc_operator_bank?.company_registration_number}</td>
                  <td>{user.address}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OperatorTable;
