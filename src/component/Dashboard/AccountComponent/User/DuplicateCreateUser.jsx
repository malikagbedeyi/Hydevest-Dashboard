import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { X } from "lucide-react";

const DuplicateCreateUser = ({ users, setUsers, setView, openSubmenu }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    jobRole: "",
  
    salaryAnnual: "",
    salaryMonthly: "",
  
    bonuses: [],
    deductions: [],
  
    isSystemUser: false,
    isSalary: false,
    username: "",
    tempPassword: "",
  
    privilege: "",
    startDate: "",
    status: "Active",
    disabledDate: "",
  });
  

  const [successMessage, setSuccessMessage] = useState(null);

  /* ===================== HANDLERS ===================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addBonus = () => {
    setForm((prev) => ({
      ...prev,
      bonuses: [
        ...prev.bonuses,
        { description: "", amount: "" },
      ],
    }));
  };
  const removeBonus = (index) => {
    setForm((prev) => ({
      ...prev,
      bonuses: prev.bonuses.filter((_, i) => i !== index),
    }));
  };
  const handleBonusChange = (index, field, value) => {
    setForm((prev) => {
      const updatedBonuses = [...prev.bonuses];
      updatedBonuses[index] = {
        ...updatedBonuses[index],
        [field]: value,
      };
      return { ...prev, bonuses: updatedBonuses };
    });
  };

  const addDeduction = () => {
    setForm((prev) => ({
      ...prev,
      deductions: [
        ...prev.deductions,
        { description: "", amount: "" },
      ],
    }));
  };
  
  const removeDeduction = (index) => {
    setForm((prev) => ({
      ...prev,
      deductions: prev.deductions.filter((_, i) => i !== index),
    }));
  };
  
  const handleDeductionChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.deductions];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, deductions: updated };
    });
  };
  const handleCreate = () => {
    const newUser = {
      ...form,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      mustChangePassword: form.isSystemUser,
    };

    setUsers([newUser, ...users]);
    setSuccessMessage("User successfully created");
  };

  const handleClosePopup = () => {
    setSuccessMessage(null);
    setView(users.length > 0 ? "table" : "empty");
    openSubmenu?.("users");
  };

  /* ===================== SUCCESS POPUP ===================== */
  if (successMessage) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={handleClosePopup} className="delete-box">✕</div>
            <span>{successMessage}</span>
          </div>
        </div>
      </div>
    );
  }

  /* ===================== UI ===================== */
  return (
    <div className="trip-modal">
      <div className="create-container-modal">
        <div className="create-container-card">

          {/* HEADER */}
          <div className="header">
            <h2>Create User / Employee</h2>
            <X size={18} className="close" onClick={() => setView("table")} />
          </div>

          <p>Enter the details of new user</p>

          {/* BASIC INFO */}
          <div className="grid-2">
            <div className="form-group">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <input name="jobRole" value={form.jobRole} onChange={handleChange} />
            </div>
          </div>

  <div className="form-check">
            <input
              type="checkbox"
              name="isSalary"
              checked={form.isSalary}
              onChange={handleChange}
            />
            <label style={{margin:"10px"}}>Salary Earning</label>
          </div>
          {form.isSalary && (
          <div className="">
          <div className="grid-2">
            <div className="form-group">
              <label>Salary (Annual)</label>
              <input
                type="number"
                value={form.salaryAnnual}
                onChange={(e) => {
                  const annual = Number(e.target.value);
                  setForm((prev) => ({
                    ...prev,
                    salaryAnnual: annual,
                    salaryMonthly: annual ? (annual / 12).toFixed(2) : "",
                  }));
                }}
              />
            </div>
            <div className="form-group">
              <label>Monthly Salary</label>
              <input value={form.salaryMonthly} disabled />
            </div>
          </div>
          <div className="form-group">
  <label>Bonus</label>

  {form.bonuses.length === 0 && (
    <small className="muted">No bonus added</small>
  )}

  {form.bonuses.map((bonus, i) => (
    <div
      key={i}
      className="bonus-row"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr auto",
        gap: "10px",
        marginBottom: "8px",
      }}
    >
      <input
        type="text"
        placeholder="description"
        value={bonus.description}
        onChange={(e) =>
          handleBonusChange(i, "description", e.target.value)
        }
      />

      <input
        type="number"
        placeholder="Amount"
        value={bonus.amount}
        onChange={(e) =>
          handleBonusChange(i, "amount", e.target.value)
        }
      />

      <button
        type="button"
        className="create"
        onClick={() => removeBonus(i)}
      >
        Remove
      </button>
    </div>
  ))}

  <button style={{
    width:"50%",
    alignItems:"center",
    display:"flex",
    justifyContent:"center",
    margin: "10px auto 0 auto",
  }}
    type="button"
    className="create"
    onClick={addBonus}
  >
    + Add Bonus
  </button>
</div>
<div className="form-group">
  <label>Deductions</label>

  {form.deductions.length === 0 && (
    <small className="muted">No deduction added</small>
  )}

  {form.deductions.map((deduction, i) => (
    <div
      key={i}
      className="deduction-row"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr auto",
        gap: "10px",
        marginBottom: "8px",
      }}
    >
      <input
        type="text"
        placeholder="Description"
        value={deduction.description}
        onChange={(e) =>
          handleDeductionChange(i, "description", e.target.value)
        }
      />

      <input
        type="number"
        placeholder="Amount"
        value={deduction.amount}
        onChange={(e) =>
          handleDeductionChange(i, "amount", e.target.value)
        }
      />

      <button
        type="button"
        className="create"
        onClick={() => removeDeduction(i)}
      >
        Remove
      </button>
    </div>
  ))}

  <button
    type="button"
    className="create"
    style={{
      width: "50%",
      margin: "10px auto 0 auto",
      display: "flex",
      justifyContent: "center",
    }}
    onClick={addDeduction}
  >
    + Add Deduction
  </button>
</div>
</div>
   )}

          {/* SYSTEM USER */}
          <div className="form-check">
            <input
              type="checkbox"
              name="isSystemUser"
              checked={form.isSystemUser}
              onChange={handleChange}
            />
            <label style={{margin:"10px"}}>System User</label>
          </div>

          {form.isSystemUser && (
            <div className="">
            <div className="grid-2">
              <div className="form-group">
                <label>Email Address</label>
                <input name="username" value={form.username} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Temporary Password</label>
                <input name="tempPassword" value={form.tempPassword} onChange={handleChange} />
                {/* <small>User must change password on first login</small> */}
              </div>
            </div>
            <div className="form-group">
            <label>Privilege</label>
            <select name="privilege" value={form.privilege} onChange={handleChange}>
              <option value="">Select Privilege</option>
              <option value="NT_ADMIN">NT Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="USER">User</option>
            </select>
          </div>
           </div>
          )}

          {/* DATES & STATUS */}
          <div className="grid-2">
            <div className="form-group" >
              <label>Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>


          {/* ACTIONS */}
          <div className="btn-row">
            <button className="cancel" onClick={() => setView("table")}>Cancel</button>
            <button className="create" onClick={handleCreate}>Create User</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DuplicateCreateUser;
