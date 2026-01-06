import React from 'react'
import { Plus, X, Edit, Trash2, ChevronDown, ChevronUp, Paperclip } from "lucide-react";


const TripDocumentTable = ({tripFileData,handleDeleteTripFile,handleDocumentRowClick,formatDate,}) => {

    
  return (
    <div>
      <div className="userTable">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Title</th>
              <th>Description</th>
              <th>Files</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tripFileData.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Trip Document Found
                </td>
              </tr>
            ) : (
              tripFileData.map((item, idx) => (
                <tr
                key={item.id}
                onClick={() => handleDocumentRowClick({...item,sn: idx + 1,})} 
                style={{ cursor: "pointer" }}
              >
                <td>{idx + 1}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.attachments?.length || 0} file(s)</td>
                <td>{formatDate(item.createdAt)}</td>
                <td>
                  <span style={{ color: "green", fontWeight: 600 }}>
                    {item.status}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <Trash2
                    size={16}
                    color="red"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteTripFile(item.id)}
                  />
                </td>
              </tr>
              
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}

export default TripDocumentTable
