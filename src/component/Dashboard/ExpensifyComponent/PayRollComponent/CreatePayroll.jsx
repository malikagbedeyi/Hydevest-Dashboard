import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/Expensify/create.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const calculateMonthlyPAYE = (monthlyGross) => {
  const annualGross = monthlyGross * 12;

  const bands = [
    { limit: 800000, rate: 0 },
    { limit: 2200000, rate: 0.15 },
    { limit: 9000000, rate: 0.18 },
    { limit: 13000000, rate: 0.21 },
    { limit: 25000000, rate: 0.23 },
    { limit: Infinity, rate: 0.25 },
  ];

  let remaining = annualGross;
  let annualTax = 0;

  for (let band of bands) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, band.limit);
    annualTax += taxable * band.rate;
    remaining -= taxable;
  }

  return Math.round(annualTax / 12);
};

const CreatePayroll = ({ setView, onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState(null);
  const [bonusChecked, setBonusChecked] = useState(false);
  const [error, setError] = useState("");

  const employees = [
    { id: 1, name: "Kaf", salary: 1000000 },
    { id: 2, name: "Amaka", salary: 500000 },
    { id: 4, name: "Zainab", salary: 650000 },
    { id: 5, name: "Ibrahim", salary: 65000 },
    { id: 6, name: "Blessing", salary: 85000 },
  ];

  const handleDateChange = (date) => {
    const today = new Date();
    if (
      date.getFullYear() < today.getFullYear() ||
      (date.getFullYear() === today.getFullYear() &&
        date.getMonth() < today.getMonth())
    ) {
      setError("Past month or year are not valid anymore");
      setSelectedMonthYear(null);
    } else {
      setError("");
      setSelectedMonthYear(date);
    }
  };

  const handleCreatePayroll = () => {
    // Precompute employee payroll details
    const preparedEmployees = employees.map((emp) => {
      const bonusAmount = bonusChecked ? 150000 : 0;
      const salaryWithBonus = emp.salary + bonusAmount;
      const paye = calculateMonthlyPAYE(salaryWithBonus);
      const netPay = salaryWithBonus - paye;
      return {
        ...emp,
        bonusAmount,
        salaryWithBonus,
        paye,
        netPay,
      };
    });

    const payload = {
      id: Date.now(),
      title,
      description,
      payPeriod: "Month",
      selectedMonthYear: selectedMonthYear.toISOString(),
      employees: preparedEmployees,
      bonusChecked,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    onCreate?.(payload);
    setView("table");
  };

  return (
    <div className="trip-modal">
      <div className="create-container-modal">
        <div className="create-container-card">
          <h2>Create Payroll</h2>
          <p>Enter Payroll details</p>

          <div className="grid-2 mb-4">
            <div className="form-group">
              <label>Pay Period</label>
              <input type="text" value="Month" readOnly className="readonly-input" />
            </div>

            <div className="form-group">
              <label>Select Month & Year</label>
              <DatePicker
                selected={selectedMonthYear}
                onChange={handleDateChange}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                placeholderText="Select Month & Year"
                className="date-picker-input"
                calendarClassName="custom-datepicker"
              />
              {error && <small style={{ color: "red" }}>{error}</small>}
            </div>
          </div>

          {selectedMonthYear && (
            <div className="grid-3">
              <div
                className="grid-header"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <h4>Employee Details</h4>
                {selectedMonthYear.getMonth() === 11 && (
                  <div
                    className="form-check"
                    style={{ display: "flex", gap: "10px", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      checked={bonusChecked}
                      onChange={(e) => setBonusChecked(e.target.checked)}
                    />
                    <label>Add Bonus</label>
                  </div>
                )}
              </div>

              <div className="payrollTable">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Salary</th>
                      <th>Tax (PAYE)</th>
                      <th>Net Pay</th>
                      <th>Bonus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => {
                      const bonusAmount = bonusChecked ? 150000 : 0;
                      const salaryWithBonus = emp.salary + bonusAmount;
                      const paye = calculateMonthlyPAYE(salaryWithBonus);
                      const netPay = salaryWithBonus - paye;

                      return (
                        <tr key={emp.id}>
                          <td>{emp.name}</td>
                          <td>₦{salaryWithBonus.toLocaleString()}</td>
                          <td>₦{paye.toLocaleString()}</td>
                          <td>₦{netPay.toLocaleString()}</td>
                          <td>{bonusAmount ? `₦${bonusAmount.toLocaleString()}` : "₦0"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="btn-row" style={{ marginTop: "10%" }}>
            <button className="cancel" onClick={() => setView("table")}>Cancel</button>
            <button
  className="create"
  disabled={!selectedMonthYear || error} // only check month/year & errors
  onClick={handleCreatePayroll}
>
  Submit
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePayroll;
