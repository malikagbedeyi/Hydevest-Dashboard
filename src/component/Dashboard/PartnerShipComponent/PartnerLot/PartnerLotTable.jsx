import React from "react";
import "../../../../assets/Styles/dashboard/table.scss";

const formatMoney = v =>
  Number(v || 0).toLocaleString("en-NG");

const PartnerLotTable = ({ data =[],onRowClick }) => {
  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{width:"100%" , maxWidth:"100%",minWidth:"100%"}}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Partner / Entity Name</th>
              <th>Total Invested Amount</th>
              <th>Total Containers Invested</th>
              <th>Total Profit</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Partner Lot Records Found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={`partnerlot-${row.id}`}   onClick={() => onRowClick(row)}>
                  <td>{idx + 1}</td>
                  <td>{row.name}<small style={{ marginLeft: 6, opacity: 0.6 }}> ({row.assigneeType}) </small> </td>
                  <td>{formatMoney(row.totalInvestment)}</td>
                  <td>{row.totalContainers}</td>
                  <td>{formatMoney(row.totalProfit)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerLotTable;
