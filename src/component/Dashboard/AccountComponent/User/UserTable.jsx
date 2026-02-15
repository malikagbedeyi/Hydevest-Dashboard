import React from "react";
import "../../../../assets/Styles/dashboard/table.scss";

const UserTable = ({ data, page, setPage, loading, onRowClick, onDelete }) => {
  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;

  if (loading) {
    return (
      <div className="userTable">
        <div className="table-wrap">
          <table className="table" style={{width:"100%",maxWidth:"100%",minWidth:"100%"}}>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan="9" className="skeleton-row" />
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
        <table className="table" style={{width:"100%",maxWidth:"100%",minWidth:"100%"}}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Email</th>
              <th>Job Title</th>
              <th>Phone</th>
              <th>Privilege</th>
              <th>Status</th>
              <th>Date Created</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No users created yet
                </td>
              </tr>
            ) : (
              data.map((user, idx) => (
                <tr key={user.user_uuid} onClick={() => onRowClick(user)}>
                  <td>{startIndex + idx + 1}</td>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.job_title}</td>
                  <td>{user.phone_no}</td>
                  <td>{user.role?.name || "-"}</td>
                  <td style={{color:user.status === 1 ? "green":"red"}}>
                    {user.status === 1 ? "Active" : "Disabled"}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  {/* <td onClick={(e) => e.stopPropagation()}>
                    <button
                      className="delete-btn"
                      onClick={() => onDelete(user)}
                    >
                      🗑
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>Page {page}</span>
          <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
