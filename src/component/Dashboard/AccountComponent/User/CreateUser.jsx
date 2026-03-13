import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { ChevronDown, X } from "lucide-react";
import { SystemUserService } from '../../../../services/Account/systemUser.service';
import { RoleService } from "../../../../services/Account/roleSetup.service";

const StatusOptions = [
  { label: "Active", value: 1 },
  { label: "Disabled", value: 0 }
];

const CreateUser = ({ user, mode = "submenu", setView, setData, onSuccess, openSubmenu }) => {
  const [form, setForm] = useState({
    firstname: "", lastname: "", email: "",phone_no: "",address: "",job_title: "",is_system_user: 1,
    system_email: "",role_uuid: "",password: "",start_date: "",status: 1
  });

  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [openPrivilege, setOpenPrivilege] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);

  // Populate form for edit
  useEffect(() => {
    if (user && mode === "edit") {
      setForm({
        user_uuid: user.user_uuid,
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phone_no: user.phone_no || "",
        address: user.address || "",
        job_title: user.job_title || "",
        is_system_user: user.is_system_user,
        system_email: user.system_email || "",
        role_uuid: user.role_uuid || "",
        password: "", // optional for edit
        start_date: user.start_date || "",
        status: user.status
      });
    }
  }, [user, mode]);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const res = await RoleService.list();
        setRoles(res.data?.record || []);
      } catch (err) {
        console.error("Failed to fetch roles", err);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? (checked ? 1 : 0) : value }));
  };

  const handleCreate = async () => {
    // 🔒 Validate system user fields
    try {
      if (mode === "edit") {
        await SystemUserService.edit(form);
      } else {
        if (form.is_system_user === 1) {
          const required = ["system_email", "password", "role_uuid", "start_date"];
          for (const field of required) {
            if (!form[field]) {
              alert(`${field.replace("_", " ")} is required`);
              return;
            }
          }
        }
        await SystemUserService.create(form);
        showPopup("System user created successfully");
      }  
      setTimeout(() => {
        setPopupMessage(null);
        onSuccess();
      }, 500);
  

      // onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit user.");
    }
  };
 
  const showPopup = (message) => {
    setPopupMessage(message);
  };
  
 
   /** 🔹 Change Role Immediately */
   const handleChangeRole = async (role_uuid) => {
    // CREATE MODE → just update form
    if (mode !== "edit") {
      setForm(prev => ({ ...prev, role_uuid }));
      return;
    }
  
    // EDIT MODE → call API
    if (!form.user_uuid) {
      showPopup("User ID missing");
      return;
    }
  
    try {
      await SystemUserService.changeRole(form.user_uuid, role_uuid);
      setForm(prev => ({ ...prev, role_uuid }));
      // ❌ no success message (as you requested)
    } catch (err) {
      showPopup(err.response?.data?.message || "Failed to update role");
    }
  };
  
  const handleChangeStatus = async (status) => {
    // CREATE MODE
    if (mode !== "edit") {
      setForm(prev => ({ ...prev, status }));
      return;
    }
  
    // EDIT MODE
    if (!form.user_uuid) {
      showPopup("User ID missing");
      return;
    }
  
    try {
      await SystemUserService.changeStatus(form.user_uuid, status);
      setForm(prev => ({ ...prev, status }));
    } catch (err) {
      showPopup(err.response?.data?.message || "Failed to update status");
    }
  };
  const handleChangePassword = async () => {
    if (!form.password) {
      showPopup("Enter a new password");
      return;
    }
  
    if (!form.user_uuid) {
      showPopup("User ID missing");
      return;
    }
  
    try {
      await SystemUserService.changePassword(form.user_uuid, form.password);
      showPopup("Password updated successfully");
      setForm(prev => ({ ...prev, password: "" }));
    } catch (err) {
      showPopup(err.response?.data?.message || "Failed to update password");
    }
  };
  
  
  const handleCancel = () => {
    if (mode === "submenu" && setView) setView("table");
  };

  return (
    <>
    {popupMessage && (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={() => setPopupMessage(null)} className="delete-box">✕</div>
            <span>{popupMessage}</span>
          </div>
        </div>
      </div>
    )}
    <div className="trip-modal">
      <div className="create-container-modal">
        <div className="create-container-card">
          <div className="header">
            <h2>{mode === "edit" ? "Edit User / Employee" : "Create User / Employee"}</h2>
            <X size={18} className="close" onClick={() => setView("table")} />
          </div>

          <p>Enter the details of the user</p>

          <div className="account-grid">
            <div className="account-grid-content">

              {/* Basic Info */}
              <div className="grid-2">
                <div className="form-group">
                  <label>First Name</label>
                  <input name="firstname" value={form.firstname} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input name="lastname" value={form.lastname} onChange={handleChange} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" value={form.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input name="job_title" value={form.job_title} onChange={handleChange} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Phone No</label>
                  <input name="phone_no" value={form.phone_no} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input name="address" value={form.address} onChange={handleChange} />
                </div>
              </div>

              {/* System User */}
              <div className="form-check">
                <input
  type="checkbox"
  name="is_system_user"
  checked={form.is_system_user === 1}
  onChange={(e) =>
    setForm(prev => ({
      ...prev,
      is_system_user: e.target.checked ? 1 : 0
    }))
  }/>
                <label style={{ marginLeft: "10px" }}>System User</label>
              </div>

              {form.is_system_user === 1 && (
                <>
                  <div className="grid-2">
                    <div className="form-group">
                      <label>System Email</label>
                      <input name="system_email" value={form.system_email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input type="password" name="password" value={form.password} onChange={handleChange} placeholder={mode==="edit"?"......":""} />
                      {mode==="edit" && <button type="button" className="create mt-3" onClick={handleChangePassword}>Update Password</button>}
                    </div>
                  </div>
                  {/* Role Select */}
                    {mode !== "edit" && form.is_system_user === 1 && (
    <div className="form-group-select mb-4">
      <label>Privilege</label>
      <div className="custom-select">
        <div className="custom-select-drop" onClick={() => setOpenPrivilege(!openPrivilege)}>
          <div className="select-box">
            {roles.find(r => r.role_uuid === form.role_uuid)?.name || "Select Role"}
          </div>
          <ChevronDown />
        </div>
        {openPrivilege && (
          <div className="select-dropdown">
            {loadingRoles ? (
              <div className="option-item">Loading roles...</div>
            ) : (
              roles.map(role => (
                <div
                  key={role.role_uuid}
                  className="option-item"
                  onClick={() => { handleChangeRole(role.role_uuid); setOpenPrivilege(false); }}
                >
                  {role.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
    )}
                  {mode === "edit" && form.is_system_user === 1 && (
    <div className="form-group-select mb-4">
      <label>Privilege</label>
      <div className="custom-select">
        <div className="custom-select-drop" onClick={() => setOpenPrivilege(!openPrivilege)}>
          <div className="select-box">
            {roles.find(r => r.role_uuid === form.role_uuid)?.name || "Select Role"}
          </div>
          <ChevronDown />
        </div>
        {openPrivilege && (
          <div className="select-dropdown">
            {loadingRoles ? (
              <div className="option-item">Loading roles...</div>
            ) : (
              roles.map(role => (
                <div
                  key={role.role_uuid}
                  className="option-item"
                  onClick={() => { handleChangeRole(role.role_uuid); setOpenPrivilege(false); }}
                >
                  {role.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
    )}
                </>
              )}

              {/* Status / Start Date */}
              <div className="grid-2">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" name="start_date" value={form.start_date} onChange={handleChange} />
                </div>
                  {mode !== "edit" && form.is_system_user === 1 && (
                <div className="form-group-select">
                  <label>Status</label>
                  <div className="custom-select">
                    <div className="custom-select-drop" onClick={() => setOpenStatus(!openStatus)}>
                      <div className="select-box">
                        {StatusOptions.find(s => s.value === form.status)?.label}
                      </div>
                      <ChevronDown />
                    </div>
                    {openStatus && (
                      <div className="select-dropdown">
                        {StatusOptions.map(opt => (
                          <div key={opt.value} className="option-item" onClick={() => { handleChangeStatus(opt.value); setOpenStatus(false); }}>
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                )}
                {mode === "edit"  && (
                <div className="form-group-select">
                  <label>Status</label>
                  <div className="custom-select">
                    <div className="custom-select-drop" onClick={() => setOpenStatus(!openStatus)}>
                      <div className="select-box">
                        {StatusOptions.find(s => s.value === form.status)?.label}
                      </div>
                      <ChevronDown />
                    </div>
                    {openStatus && (
                      <div className="select-dropdown">
                        {StatusOptions.map(opt => (
                          <div key={opt.value} className="option-item" onClick={() => { handleChangeStatus(opt.value); setOpenStatus(false); }}>
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                )}
              </div>

              {/* Buttons */}
              <div className="btn-row">
                {mode === "submenu" && (
                  <button className="cancel" onClick={handleCancel}>Cancel</button>
                )}
                <button className="create" onClick={handleCreate}>
                  {mode==="edit"?"Update System User":"Create System User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  )
};

export default CreateUser;