import React from 'react';
import "../../../assets/Styles/dashboard/table.scss";

const RequestboxTable = ({ data }) => {
  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{width:"100%",maxWidth:"100%",minWidth:"100%"}}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Req ID</th>
              <th>Date</th>
              <th>Type</th>
              <th>Title</th>
              <th>Recipient</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td>{String(index + 1).padStart(2, '0')}</td>
                <td className="req-id-cell">{item.id}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>{item.type}</td>
                <td>{item.title}</td>
                <td>{item.recipient}</td>
                <td className={`priority-text ${item.priority.toLowerCase()}`}>
                  {item.priority}
                </td>
                <td>
                  <span className={`status-badge ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestboxTable;