import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/account/userTable.scss";

const OperatorTable = ({ users }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Email</th>
              <th>BDC Name</th>
              <th>BDC Number</th>
              <th>Bank Name</th>
              <th>Bank Number</th>
              <th>BDC Contact</th>
              <th>Address</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No BDC Operator created yet
                </td>
              </tr>
            ) : (
              currentUsers.map((user, idx) => (
                <tr key={user.id}>
                  <td>{startIndex + idx + 1}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.agentName}</td>
                  <td>{user.agentNumber}</td>
                  <td>{user.bankName}</td>
                  <td>{user.bankNumber}</td>
                    <td>{user.licenseNumber}</td>
                    <td>{user.address}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperatorTable;
