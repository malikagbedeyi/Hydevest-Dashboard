import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/account/userTable.scss";

const UserTable = ({ users }) => {
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
              <th>Phone</th>
              <th>Privilege</th>
              <th>Status</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No users created yet
                </td>
              </tr>
            ) : (
              currentUsers.map((user, idx) => (
                <tr key={user.id}>
                  <td>{startIndex + idx + 1}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.privilege || "-"}</td>
                  <td>{user.status}</td>
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

export default UserTable;
