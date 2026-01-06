import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/account/userTable.scss";

const AllocationTable = ({  data }) => {
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
              <th>Container Tracking Number</th>
              <th>Partner Name</th>
              <th>Estimated Price (NGN)</th>
              <th>Remaining Estimated Price</th>
              <th>Amount</th>
              <th>Percentage</th>
              <th>Remaining %</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
  {currentData.length === 0 ? (
    <tr>
      <td colSpan="9" style={{ textAlign: "center" }}>
        No Allocation created yet
      </td>
    </tr>
  ) : (
    currentData.map((row, idx) => (
      <tr key={row.id}>
        <td>{startIndex + idx + 1}</td>
        <td>{row.containerTrackingNumber}</td>
        <td>
          {row.allocations.map(a => a.partnerName).join(", ")}
        </td>
        <td>{row.estimatedAmount.toLocaleString("en-NG")}</td>
        <td>{row.remainingAmount.toLocaleString("en-NG")}</td>
        <td>
          {row.allocations.map(a =>
            a.amount.toLocaleString("en-NG")
          ).join(", ")}
        </td>
        <td>
          {row.allocations.map(a =>
            `${a.percentage}%`
          ).join(", ")}
        </td>
        <td>{row.remainingPercentage}%</td>
        <td>
          {new Date(row.createdAt).toLocaleDateString()}
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

export default AllocationTable
