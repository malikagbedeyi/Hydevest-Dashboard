import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { ChevronDown, X } from "lucide-react";

const PrivilegeOptions = ["NT Admin", "Manager", "User"];
const statusOptions = ["Active", "Disabled"];

const CreateUser = ({ users, setUsers, setView, openSubmenu }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    jobRole: "",
    privilege: "",
    isSystemUser: false,
    isSalary: false,
    username: "",
    tempPassword: "",
    startDate: "",
    status: "Active",
  });

  const [openPrivilege, setOpenPrivilege] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreate = () => {
    const newUser = {
      id: crypto.randomUUID(),
      ...form,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setSuccessMessage("User successfully created");
  };

  const handleClosePopup = () => {
    setSuccessMessage(null);
    setView("table");
    openSubmenu?.("users");
  };

  /* ================= SUCCESS POPUP ================= */
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

  /* ================= UI ================= */
  return (
    <div className="">
      <div className="create-container-modal">
        <div className="create-container-card">

          {/* HEADER */}
          <div className="header">
            <h2>Create User / Employee</h2>
            <X size={18} className="close" onClick={() => setView("table")} />
          </div>

          <p>Enter the details of new user</p>

          {/* BASIC INFO */}
          <div className="account-grid">
            <div className="account-grid-content">
         
          <div className="grid-2">
            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter First Name"
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter Last Name"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email"
              />
            </div>

            <div className="form-group">
              <label>Job Title</label>
              <input
                name="jobRole"
                value={form.jobRole}
                onChange={handleChange}
                placeholder="Enter Job Title"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter Address"
              />
            </div>
          </div>

          {/* SYSTEM USER */}
          <div className="form-check">
            <input
              type="checkbox"
              name="isSystemUser"
              checked={form.isSystemUser}
              onChange={handleChange}
            />
            <label style={{ marginLeft: "10px" }}>System User</label>
          </div>

          {form.isSystemUser && (
            <>
              <div className="grid-2">
                <div className="form-group">
                  <label>System Email</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="System Email"
                  />
                </div>
                <div className="form-group">
                  <label>Temporary Password</label>
                  <input
                  type="password"
                    name="tempPassword"
                    value={form.tempPassword}
                    onChange={handleChange}
                    placeholder="Temporary Password"
                  />
                </div>
              </div>
              <div className="form-group-select mb-4">
                <label>Privilege</label>
                <div className="custom-select">
                  <div
                    className="custom-select-drop"
                    onClick={() => setOpenPrivilege(!openPrivilege)}
                  >
                    <div className="select-box">
                      {form.privilege || "Select Privilege"}
                    </div>
                    <ChevronDown />
                  </div>

                  {openPrivilege && (
                    <div className="select-dropdown">
                      {PrivilegeOptions.map((opt) => (
                        <div
                          key={opt}
                          className="option-item"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, privilege: opt }));
                            setOpenPrivilege(false);
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {/* STATUS */}
          <div className="grid-2">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group-select">
              <label>Status</label>
              <div className="custom-select">
                <div
                  className="custom-select-drop"
                  onClick={() => setOpenStatus(!openStatus)}
                >
                  <div className="select-box">{form.status}</div>
                  <ChevronDown />
                </div>

                {openStatus && (
                  <div className="select-dropdown">
                    {statusOptions.map((opt) => (
                      <div
                        key={opt}
                        className="option-item"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, status: opt }));
                          setOpenStatus(false);
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="btn-row">
            <button className="cancel" onClick={() => setView("table")}>
              Cancel
            </button>
            <button className="create" onClick={handleCreate}>
              Create User
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default CreateUser;
