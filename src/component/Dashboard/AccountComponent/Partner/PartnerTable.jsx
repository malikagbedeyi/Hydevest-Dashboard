import React from "react";
import "../../../../assets/Styles/dashboard/account/userTable.scss";

const PartnerTable = ({ data = [], loading, onEdit }) => {

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{width:"100%",maxWidth:"100%",minWidth:"100%"}}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Bank</th>
              <th>Account</th>
              <th>Date Created</th>
              
              <th>Status</th>
              
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Partner Found
                </td>
              </tr>
            ) : (
              data.map((p, idx) => (
                <tr key={p.user_uuid} onClick={() => onEdit(p)}>
                 <td>{idx + 1}</td>
                 <td>{p.firstname} {p.lastname}</td>
                 <td>{p.email}</td>
                 <td>{p.phone_no}</td>
                 <td>{p.partner_bank?.bank_name || "-"}</td>
                <td>{p.partner_bank?.bank_account || "-"}</td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
  <span className={`status ${p.status === 1 ? "active" : "pending"}`} 
  style={{color:p.status === 1 ? "green":"red"}}>
    {p.status === 1 ? "Active" : "Pending"}
  </span>
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default PartnerTable;
