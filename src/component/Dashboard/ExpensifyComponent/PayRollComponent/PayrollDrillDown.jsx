
import React, { useState } from "react";
import { ChevronRight, X, Download } from "lucide-react";
import "../../../../assets/Styles/dashboard/Expensify/drilldown.scss";
import logo from '../../../../assets/Images/Logo/LogoMain.png';

const PayrollDrillDown = ({ payroll, goBack, onUpdate }) => {
  const [data, setData] = useState(payroll);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const approvePayroll = () => {
    const updated = {
      ...data,
      status: "Approved",
      approvedAt: new Date().toISOString(),
    };
    setData(updated);
    onUpdate?.(updated);
  };

  // 👉 DOWNLOAD PAYSLIP
  const downloadPayslip = (emp) => {
    const content = `
PAYSLIP
------------------------
Employee Name: ${emp.name}
Month & Year: ${new Date(data.selectedMonthYear).toLocaleString("default", {
      month: "long",
      year: "numeric",
    })}
Gross Salary: ₦${emp.salaryWithBonus.toLocaleString()}
PAYE: ₦${emp.paye.toLocaleString()}
Bonus: ₦${emp.bonusAmount.toLocaleString()}
Net Pay: ₦${emp.netPay.toLocaleString()}
Status: ${data.status}
Date Generated: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${emp.name}-Payslip.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // 👉 PAYSLIP VIEW
  if (selectedEmployee) {
    return (
      <div className="payslip-wrapper">
        <div className=" payslip-card">
          <div className="payslip-logo">
            <img src={logo} alt="" />
          </div>
          <h3>Payslip</h3>

          <div className="payslip-row">
            <span>Employee Name</span>
            <strong>{selectedEmployee.name}</strong>
          </div>

          <div className="payslip-row">
            <span>Month & Year</span>
            <strong>
              {new Date(data.selectedMonthYear).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </strong>
          </div>

          <div className="payslip-row">
            <span>Gross Salary</span>
            <strong>₦{selectedEmployee.salaryWithBonus.toLocaleString()}</strong>
          </div>

          <div className="payslip-row">
            <span>PAYE</span>
            <strong>₦{selectedEmployee.paye.toLocaleString()}</strong>
          </div>

          <div className="payslip-row">
            <span>Bonus</span>
            <strong>₦{selectedEmployee.bonusAmount.toLocaleString()}</strong>
          </div>

          <div className="payslip-row">
            <span>Net Pay</span>
            <strong>₦{selectedEmployee.netPay.toLocaleString()}</strong>
          </div>

          <div className="btn-row">
            <button className="outline" onClick={() => setSelectedEmployee(null)}>
              Back
            </button>
            <button className="create" onClick={() => downloadPayslip(selectedEmployee)}>
              <Download size={16} /> Download
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 👉 PAYROLL DRILLDOWN
  return (
    <div className="drill-wrapper">
      <div className="drill-header">
        <div className="breadcrumb">
          <strong>Payroll</strong>
          <ChevronRight size={16} />
          <span>Details</span>
        </div>

        <div className="actions">
          {data.status !== "Approved" && (
            <button className="primary" onClick={approvePayroll}>
              Approve
            </button>
          )}
          <button
            style={{
              color: data.status === "Approved" ? "#fff" : "orange",
              padding: "10px 20px",
              borderRadius: "6px",
              background: data.status === "Approved" ? "#581aae" : "#fff",
              border: data.status === "Approved" ? "none" : "1px solid #581aae",
            }}
          >
            {data.status}
          </button>
        </div>
      </div>
      <div className="drilldown-card">
        <div className="form-group">
          <label>Month & Year</label>
          <input
            readOnly
            value={new Date(data.selectedMonthYear).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          />
        </div>

        <div className="payrollTable">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Gross</th>
                <th>PAYE</th>
                <th>Net Pay</th>
                <th>Bonus</th>
              </tr>
            </thead>
            <tbody>
              {data.employees.map((emp) => (
                <tr key={emp.id} onClick={() => setSelectedEmployee(emp)}>
                  <td>{emp.name}</td>
                  <td>₦{emp.salaryWithBonus.toLocaleString()}</td>
                  <td>₦{emp.paye.toLocaleString()}</td>
                  <td>₦{emp.netPay.toLocaleString()}</td>
                  <td>₦{emp.bonusAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="btn-row">
          <button className="outline" onClick={goBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollDrillDown;
