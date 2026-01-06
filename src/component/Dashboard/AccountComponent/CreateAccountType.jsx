import React, { useState } from "react";
import CreateUser from "./User/CreateUser";
import CreatePartner from "./Partner/CreatePartner";
import CreateRetailer from "./Retailer/CreateRetailer";
import CreateSupplier from "./Supplier/CreateSupplier";
import CreateAgent from "./Agent/CreateAgent";
import CreateOperator from "./Operator/CreateOperator";
import CreateInvest from "./Invest/CreateInvest";

/* ================= SYSTEM USER ================= */
export const SystemUserType = ({ onCreate, onCancel ,openSubmenu,setUsers }) => {
  return (
    <div className="tab-section">
      <CreateUser />
    </div>
  );
};

/* ================= PARTNER ================= */
export const Partner = ({ onCreate, onCancel }) => {
 
  return (
    <div className="tab-section">
  <CreatePartner />
    </div>
  );
};
/* ================= Invest ================= */
export const Invest = ({ onCreate, onCancel }) => {
 
  return (
    <div className="tab-section">
      <CreateInvest />
    </div>
  );
};
/* ================= RETAILER ================= */
export const Retailer = ({ onCreate, onCancel }) => {
 
  return (
    <div className="tab-section">
      <CreateRetailer />
    </div>
  );
};

/* ================= SUPPLIER ================= */
export const Supplier = ({ onCreate, onCancel }) => {

  return (
    <div className="tab-section">

    <CreateSupplier />
    </div>
  );
};
/* ================= CLEARING AGENT ================= */
export const ClearingAgent = ({ onCreate, onCancel }) => {

  return (
    <div className="tab-section">
    <CreateAgent />
    </div>
  );
};



/* ================= BDC OPERATOR ================= */
export const BdcOperator = ({ onCreate, onCancel }) => {

  return (
    <div className="tab-section">
      <p>Create New BDC Operator Account</p>
      <CreateOperator />
    </div>
  );
};


/* ================= Entity ================= */
// export const Entity = ({ onCreate, onCancel }) => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     director: "",
//     otherDirector: "",
//   });

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   return (
//     <div className="tab-section">
//       <p>Create  Entity  Account </p>
//       <div className="grid-2">
//         <div className="form-group">
//             <label>Entity Name</label>
//         <input  name="name" value={form.name} onChange={handleChange} placeholder="Name" />
//         </div>
//         <div className="form-group">
//             <label>Entity Email</label>
//         <input  name="email" value={form.email} onChange={handleChange} placeholder="Email" />
//       </div>
//       </div>
//       <div className="grid-2">
//         <div className="form-group">
//             <label htmlFor="">Phone Number</label>
//         <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
//         </div>
//         <div className="form-group">
//             <label htmlFor="">Address</label>
//         <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
//       </div>
//       </div>

//       <div className="grid-2">
//         <div className="form-group">
//             <label htmlFor="">Director 1</label>
//         <input name="director" value={form.director} onChange={handleChange} placeholder="Enter Director" />
//       </div>
//         <div className="form-group">
//              <label htmlFor=""> Director 2</label>
//         <input name="otherDirector" value={form.otherDirector} onChange={handleChange} placeholder="Enter Director 2" />
//       </div>
//       </div>

//       <div className="btn-row">
//         <button className="cancel" onClick={onCancel}>Cancel</button>
//         <button className="create" onClick={() => onCreate(form)}>Create Account</button>
//       </div>
//     </div>
//   );
// };
// /* ================= BankAccount ================= */
// export const BankAccount = ({ onCreate, onCancel }) => {
//   const [form, setForm] = useState({
//     accountName: "",
//     accountNumber: "",
//     bankName: "",
//     bankNumber: "",
//     entity: "",
//     accountOfficerName: "",
//     accountOfficerNumber: "",
//     currency:"",
//   });

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   return (
//     <div className="tab-section">
//       <p>Create Bank Account </p>
//       <div className="grid-2">
//         <div className="form-group">
//             <label>Account Name</label>
//         <input  name="accountNumber" value={form.accountName} onChange={handleChange} placeholder="Enter Account Name" />
//         </div>
//          <div className="form-group">
//             <label>Account Number</label>
//         <input  name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="Enter Account Number" />
//         </div>
//       </div>
//       <div className="grid-2">
//         <div className="form-group">
//             <label htmlFor="">Bank Name</label>
//         <input name="bankName" value={form.bankName} onChange={handleChange} placeholder="Enter Bank Name" />
//         </div>
//          <div className="form-group">
//             <label htmlFor="">Bank Number</label>
//         <input name="bankNumber" value={form.bankNumber} onChange={handleChange} placeholder="Enter Bank Number" />
//         </div>
//       </div>
//       <div className="grid-2">
//          <div className="form-group highlighted">
//           <label>Entity</label>
//           <select
//             name="entity"
//             value={form.entity}
//             onChange={handleChange}
//           >
//             <option value="">Select Entity</option>
//             <option value="Admin">Admin</option>
//             <option value="Manager">Manager</option>
//             <option value="Staff">Staff</option>
//           </select>
//         </div>
//            <div className="form-group highlighted">
//           <label>Currency</label>
//           <select
//             name="currency"
//             value={form.currency}
//             onChange={handleChange}
//           >
//             <option value="">Select currency</option>
//             <option value="Admin">USD</option>
//             <option value="Manager">NGN</option>
//             <option value="Staff">GBP</option>
//           </select>
//         </div>
//         </div>
//         <div className="grid-2">
//          <div className="form-group">
//             <label>Account Officer Number</label>
//         <input  name="accountOfficerNumber" value={form.accountOfficerNumber} onChange={handleChange} placeholder="Enter Account Officer Number" />
//         </div>
//        <div className="form-group">
//             <label>Account Officer Name</label>
//         <input  name="accountOfficerName" value={form.accountOfficerName} onChange={handleChange} placeholder="Enter Account Officer Name" />
//         </div>
//         </div>
//       <div className="btn-row">
//         <button className="cancel" onClick={onCancel}>Cancel</button>
//         <button className="create" onClick={() => onCreate(form)}>Create Account</button>
//       </div>
//     </div>
//   );
// };