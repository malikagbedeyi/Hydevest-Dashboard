import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/account/userTable.scss";

const EntityTable = ({  data , page,setpage,loading,onEdit}) => {

const itemsPerPage = 10
const startIndex = (page - 1 ) * itemsPerPage

if (loading) {
  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{width:"100%",maxWidth:"100%",minWidth:"100%"}}>
          <tbody>
            {[...Array(1)].map((_, i) => (
              <tr key={i}>
                <td>loading</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{width:"110%",minWidth:"110%",maxWidth:"110%"}}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Bank Name</th>
              <th>Bank Account</th>
              <th>Created by</th>
              <th>Date Created</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Entity created yet
                </td>
              </tr>
            ) : (
              data.map((data, idx) => (
                <tr key={data.id} onClick={() => onEdit(data)}>
                  <td>{startIndex + idx + 1}</td>
                  <td>{data.firstname} {data.lastname} </td>
                  <td>{data.email}</td>
                  <td>{data.phone_no}</td>
                  <td>{data.entity_bank?.bank_name}</td>
                  <td>{data.entity_bank?.bank_account}</td>
                  <td>{data.creator_info?.firstname} {data.creator_info?.lastname}</td>
                  <td>{new Date(data.created_at).toLocaleDateString()}</td>
                  <td>
  <span className={`status ${data.status === 1 ? "active" : "pending"}`} 
  style={{color:data.status === 1 ? "green":"red"}}>
    {data.status === 1 ? "Active" : "Pending"}
  </span>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination" >
          <button disabled={ page===1 }  onClick={() => setpage(page -1)}>Prev </button>
          <span> {page} </span>
          <button  disabled={data.length < 10 } onClick={() => setpage(page +1)}>Next </button>
        </div>
      </div>
    </div>
  );
};

export default EntityTable;
