import React from "react";
import "../../../../assets/Styles/dashboard/table.scss";

const BonusTable = ({ data }) => {
  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Email</th>
              <th>Salary</th>
              <th>Total Bonus</th>
              <th>No. of Bonuses</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Bonus Created
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>₦{item.salary.toLocaleString()}</td>
                  <td>₦{item.totalBonus.toLocaleString()}</td>
                  <td>{item.bonuses.length}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BonusTable;
