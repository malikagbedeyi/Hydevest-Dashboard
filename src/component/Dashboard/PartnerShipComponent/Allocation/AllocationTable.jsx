import React from "react";
import "../../../../assets/Styles/dashboard/table.scss";
import { Trash2 } from "lucide-react";

const AllocationTable = ({ data, onRowClick, onDelete }) => {


    return (
      <div className="userTable">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Container</th>
                <th>Estimated</th>
                <th>Invested</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
  
            <tbody>
  {data.map((row, idx) => {
    const invested = row.allocations.reduce(
      (s, a) => s + Number(a.amount || 0),
      0
    );

    const outstanding = Math.max(
      row.estimatedAmount - invested,
      0
    );

    return (
      <tr key={`${row.id}-${idx}`} onClick={() => onRowClick(row)}
        style={{ cursor: "pointer" }}>
        <td>{idx + 1}</td>
        <td>{row.containerTrackingNumber}</td>
        <td>{row.estimatedAmount.toLocaleString("en-NG")}</td>
        <td>{invested.toLocaleString("en-NG")}</td>
        <td>{outstanding.toLocaleString("en-NG")}</td>
        <td>{outstanding === 0 ? "Allocated" : "Partial"}</td>
        <td>
          <button
            className="remove"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.id);
            }}
          >
            <Trash2   size={16}/>
          </button>
        </td>
      </tr>
    );
  })}
</tbody>


          </table>
        </div>
      </div>
    );
  };
  

export default AllocationTable;
