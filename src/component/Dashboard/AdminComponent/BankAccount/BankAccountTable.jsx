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
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Director</th>
              <th>Other Director</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Entity created yet
                </td>
              </tr>
            ) : (
              currentData.map((data, idx) => (
                <tr key={data.id}>
                  <td>{startIndex + idx + 1}</td>
                  <td>{data.name} </td>
                  <td>{data.email}</td>
                  <td>{data.phone}</td>
                  <td>{data.address}</td>
                  <td>{data.director}</td>
                  <td>{data.otherDirector} </td>
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
