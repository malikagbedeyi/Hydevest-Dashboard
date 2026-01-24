import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import '../../../../assets/Styles/dashboard/table.scss'

const ContainerSaleTable = ({  presales,containerReportData,onRowClick,goBack,}) => {

  const data = containerReportData;
// ===== DERIVED SUMMARY TOTALS =====
const totalContainers = data.length;

const totalSaleAmount = data.reduce(
  (sum, item) => sum + (Number(item.totalSaleAmount) || 0),
  0
);

const totalRecoveryAmount = data.reduce(
  (sum, item) => sum + (Number(item.amountPaid) || 0),
  0
);

const totalOutstandingBalance = data.reduce(
  (sum, item) => sum + (Number(item.balance) || 0),
  0
);
const totalPresaleAmount = presales.reduce(
  (sum, p) => sum + (Number(p.expectedRevenue) || 0),
  0
);


  return (
    <div>
     <div className="drill-summary-grid">
  <div className="drill-summary">
    <div className="summary-item">
      <p>Total Containers</p>
      <h2>{totalContainers}</h2>
    </div>
    <div className="summary-item">
      <p>Total Sale Amount</p>
      <h2>₦{totalSaleAmount.toLocaleString()}</h2>
    </div>
    <div className="summary-item">
      <p>Total Recovery Amount</p>
      <h2>₦{totalRecoveryAmount.toLocaleString()}</h2>
    </div>
    <div className="summary-item">
      <p>Outstanding Balance</p>
      <h2>₦{totalOutstandingBalance.toLocaleString()}</h2>
    </div>
    <div className="summary-item">
  <p>Total Presale Amount</p>
  <h2>₦{totalPresaleAmount.toLocaleString()}</h2>
</div>
  </div>
</div>

        <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper" />
                <div className="right-wrapper">
                  <div className="right-wrapper-input">
                    <Search className="input-icon" />
                    <input type="text" placeholder="Search" />
                  </div>
                  <div className="select-input">
                    <div className="filter">
                      <span>Add Filter</span>
                      <Filter />
                    </div>
                  </div>
                  <div className="select-input">
                    <div className="select-input-field">
                      <span>All Field</span>
                      <ChevronDown />
                    </div>
                  </div>
                  <div className="import-input"><p>Export</p></div>
                </div>
              </div>
            </div>
   
      <div className="userTable">
        <div className="table-wrap">
          <table className="table" style={{ maxWidth: "100%", width:"100%",minWidth:"100%" }}>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Container</th>
                <th>Total Sale Amount </th>
                <th>Total Recovery Amount</th>
                <th>Outstanding </th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No Report Records Found
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr
                    key={row.containerId}
                    onClick={() => onRowClick(row)}
                    style={{ cursor: "pointer" }}>
                    <td>{idx + 1}</td>
                    <td>{row.containerName}</td>
                    <td>{row.totalSaleAmount.toLocaleString()}</td>
                    <td>{row.amountPaid.toLocaleString()}</td>
                    <td>{row.balance.toLocaleString()}</td>
                    <td  style={{
                        fontWeight: 600,
                        color:
                          row.balance === 0
                            ? "green"
                            : row.balance === row.balance
                            ? "orange"
                            : "",
                      }}> {row.balance === 0 ? "Fully Paid"  : "Not Fully Paid "}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="btn-row">
        <button className="cancel" onClick={goBack}>
          Previous
        </button>
      </div>
    </div>
  );
};

export default ContainerSaleTable;
