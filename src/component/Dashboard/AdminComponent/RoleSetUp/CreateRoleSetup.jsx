import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/create.scss";
import { ChevronDown, X } from "lucide-react";
import { PERMISSIONS } from "./Permissions";

const statusOptions = ["Active", "Disabled"];
const roleTypes = ['NT Admin','Manager','User'];
// const organizations = ['Acc'];

const CreateRoleSetup = ({ data, setData, setView }) => {
  const [openDropdown, setOpenDropdown] = useState({
    roleType: false,
    // organization: false,
    status: false,
    permissions: false,
  });

  const [form, setForm] = useState({
    // name: "",
    fullName:"",
    email: "",
    roleType: "",
    organization: "",
    status: "Active",
    permissions: [],
  });

  const togglePermission = (perm) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const handleCreate = () => {
    if (!form.fullName.trim() || !form.email.trim()) return;
    const newRole = {
      id: window.crypto?.randomUUID?.() || Math.random().toString(36).substring(2, 10),
      ...form,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => [newRole, ...prev]);
    setView("table");
  };

  const renderDropdown = (label, key, options) => (
    <div className="form-group-select">
      <label>{label}</label>
      <div className="custom-select">
      <div className="custom-select-drop"  onClick={() => setOpenDropdown((prev) => ({ ...prev, [key]: !prev[key] }))}>
      <div className="select-box" style={{color:"gray"}}>
          {form[key] || `Select ${label}`}
        </div>
        <div className="custom-select">
          <ChevronDown className={openDropdown[key] ? "up" : "down"} />
          </div>
            </div>
       
        {openDropdown[key] && (
          <div className="select-dropdown">
            {options.map((opt) => (
              <div
                key={opt}
                className="rolesoption"
                onClick={() => {
                  setForm((prev) => ({ ...prev, [key]: opt }));
                  setOpenDropdown((prev) => ({ ...prev, [key]: false }));
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="trip-modal">
    <div className="create-container-modal">
      <div className="create-container-card">
        <div className="header">
            <div className="">
            <h2>Create Role</h2>
          <p>Define role details and assign permissions</p>
            </div>
          <X size={18} style={{color:"red"}} className="close" onClick={() => setView("table")} />
        </div>
        <div className="role-content">
            <div className="role-style">
        <div className=" grid-2">
        {renderDropdown("Role Type", "roleType", roleTypes)}

          <div className="form-group">
            <label htmlFor="">Name</label>
            <input type="text" placeholder="Enter Full Name"
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="e.g manager@email.com"
            />
          </div>
          <div className="form-group-select">
            <label>Permissions</label>
            <div className="custom-select">
                <div className="custom-select-drop"  onClick={() =>setOpenDropdown((prev) => ({ ...prev, permissions: !prev.permissions }))}>
              <div className="select-box" style={{color:"gray"}}>
              <span>  {form.permissions.length === 0 ? "Select Permissions" : form.permissions.join(", ")}</span>
              </div>
              <div className="Custom-select">
                <ChevronDown className={openDropdown.permissions ? "up" : "down"} />
                </div>
              </div>
              
              {openDropdown.permissions && (
                <div className="select-dropdown">
                  {Object.values(PERMISSIONS).flat().map((perm) => (
                    <label key={perm} className="rolesoption">
                      <input className=""
                        type="checkbox"
                        checked={form.permissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                      />
                      <div className="">{perm.replaceAll("_", " ")}</div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="">Organization</label>
            <input type="text" placeholder="Enter Organization" 
              onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))}/>
          </div>
          {/* {renderDropdown("Organization", "organization", organizations)} */}
          {renderDropdown("Status", "status", statusOptions)}
          
          {/* Permissions multi-select */}
        </div>
        <div className="btn-row">
          <button className="cancel" onClick={() => setView("table")}>
            Cancel
          </button>
          <button className="create" onClick={handleCreate}>
            Create Role
          </button>
        </div>
        </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreateRoleSetup;
