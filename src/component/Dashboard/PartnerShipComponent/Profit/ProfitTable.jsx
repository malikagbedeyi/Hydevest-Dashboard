import React from "react";
import "../../../../assets/Styles/dashboard/table.scss";

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-NG", {
    maximumFractionDigits: 2,
  });

const ProfitTable = ({ data = [] }) => {
  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{width:"100%" , maxWidth:"100%",minWidth:"100%"}}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Container Tracking Number</th>
              <th>Container Delivery Amount (NGN)</th>
              <th>Quoted Amount (NGN)</th>
              <th>Difference (NGN)</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Profit Records Found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
              <tr key={`profit-${row.id}-${row.containerTrackingNumber}`}>
                  <td>{idx + 1}</td>
                  <td>{row.containerTrackingNumber}</td>
                  <td>{formatMoney(row.containerDeliveryAmount)}</td>
                  <td>{formatMoney(row.quotedAmount)}</td>
                  <td>{formatMoney(row.difference)}</td>
                  <td>
                    <span
                      style={{
                        fontWeight: 600,
                        color:
                          row.status === "Profit"
                            ? "green"
                            : row.status === "Loss"
                            ? "red"
                            : "orange",
                      }}
                    >
                      {row.status}
                    </span>
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

export default ProfitTable;
