import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/account/userTable.scss";

const AgentTable = ({ data = [], onEdit, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Bank Name</th>
              <th>Bank Account</th>
              <th>Company Reg. No</th>
              <th>Address</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
          {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Clearning Agent Found
                </td>
              </tr>
            ) : (
              currentData.map((agent, idx) => (
                <tr
                  key={agent.user_uuid}
                  onClick={() => onEdit?.(agent)}
                  style={{ cursor: onEdit ? "pointer" : "default" }} >
                  <td>{startIndex + idx + 1}</td>
                  <td>{agent.firstname} {agent.lastname} </td>
                  <td>{agent.email}</td>
                  <td>{agent.phone_no}</td>
                  <td>{agent.clearing_agent_bank?.bank_name}</td>
                  <td>{agent.clearing_agent_bank?.bank_account}</td>
                  <td>{agent.clearing_agent_bank?.company_registration_number}</td>
                  <td>{agent.address}</td>
                  <td>
                    {agent.created_at
                      ? new Date(agent.created_at).toLocaleDateString()
                      : "--"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentTable;
