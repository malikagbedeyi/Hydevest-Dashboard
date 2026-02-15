import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/account/userTable.scss";

const BankAccountTable = ({  data }) => {
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
              <th>Account Name</th>
              <th>Account Number</th>
              <th>Bank Name</th>
              <th>Email</th>
              <th>Entity</th>
              <th>Account OfficerName</th>
              <th>Account OfficerNumber</th>
              <th>Currency</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Data created yet
                </td>
              </tr>
            ) : (
              currentData.map((data, idx) => (
                <tr key={data.id}>
                <td>{startIndex + idx + 1}</td>
                <td>{data.accountName}</td>
                <td>{data.accountNumber}</td>
                <td>{data.bankName}</td>
                <td>{data.email || "-"}</td>
              <td>{data.entity?.name || "-"}</td>
                <td>{data.accountOfficerName}</td>
                <td>{data.accountOfficerNumber}</td>
              <td>{data.currency?.symbol} {data.currency?.code}</td>
                <td>{new Date(data.createdAt).toLocaleDateString()}</td>
              </tr>              
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankAccountTable;
