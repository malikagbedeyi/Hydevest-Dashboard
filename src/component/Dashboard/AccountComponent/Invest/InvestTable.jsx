import React from "react";
import "../../../../assets/Styles/dashboard/account/userTable.scss";
import { InvestorService } from "../../../../services/Account/InvestorService";

const InvestTable = ({ data, refresh, onEdit, currentPage, totalPages, onPageChange }) => {
  const toggleStatus = async (user) => {
    try {
      await InvestorService.changeStatus(user.user_uuid, user.status === 1 ? 0 : 1);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

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
              <th>Bank Name</th>
              <th>Bank Account Number</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Investor found
                </td>
              </tr>
            ) : (
              data.map((u, idx) => (
                <tr key={u.user_uuid} onClick={() => onEdit?.(u)}>
                  <td>{(currentPage - 1) * 10 + idx + 1}</td>
                  <td>{u.firstname} {u.lastname}</td>
                  <td>{u.email}</td>
                  <td>{u.phone_no}</td>
                  <td>{u.hynvest_bank?.bank_name || "-"}</td>
                  <td>{u.hynvest_bank?.bank_account || "-"}</td>
                  <td>
                    <button
                      onClick={() => toggleStatus(u)}
                      style={{ color: u.status === 1 ? "green" : "red" }}
                    >
                      {u.status === 1 ? "Active" : "Disabled"}
                    </button>
                  </td>
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

export default InvestTable;
