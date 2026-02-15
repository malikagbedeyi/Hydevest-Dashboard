import React, { useState } from 'react'
import { Plus, X, Edit, Trash2, ChevronDown, ChevronUp, Paperclip } from "lucide-react";

const TripDocumentCreate = ({ onCreate, setShowItemData, setShowModal }) => {
    const [docTitle, setDocTitle] = useState("");
    const [docDescription, setDocDescription] = useState("");
    const [attachments, setAttachments] = useState([]);


  return (
    <div>
       <div className="create-expense-modal">
        <div className="create-expense-card">
          <h2>Create Trip Document</h2>
          <p>Enter Trip Document details</p>
          <div className="trip-document mt-4 mb-4">
          <div className="trip-document-head">
          </div>
          <div className="trid-grid">
          <div className="grid-2">
            <div className="form-group">
              <label>Title</label>
              <input type="text"
               placeholder="Enter Title"
               value={docTitle}
               onChange={(e) => setDocTitle(e.target.value)}/>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" placeholder="Enter Description" 
              value={docDescription}
              onChange={(e) => setDocDescription(e.target.value)}/>
            </div>
          </div>
          <section className="attachments">
            <div className="grid-3">
              <div className="form-group upload-box">
                <label>attachments File</label>
                <input
                  type="file"
                  hidden
                  id="trip-attachment"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const mapped = files.map((file) => ({
                      id: crypto.randomUUID(),
                      name: file.name,
                      size: file.size,
                      file,
                    }));
                    setAttachments((prev) => [...prev, ...mapped]);
                  }}
                />
                <button
                  type="button"
                  className="attach-link"
                  onClick={() => document.getElementById("trip-attachment").click()}
                >
                  <Paperclip size={14} /> Attach File
                </button>
                <div className="recent-files">
                  {attachments.length === 0 && (
                    <small style={{ color: "#999", marginLeft: "-10px" }}>No attachments added</small>
                  )}
                  {attachments.map((f) => (
                    <div key={f.id} className="file-row">
                      <div>
                        <div className="small-muted">{f.name}</div>
                        <small>{(f.size / 1024).toFixed(1)} KB</small>
                      </div>
                      <Trash2
                        size={16}
                        style={{ cursor: "pointer" }}
                        onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== f.id))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <div className="btn-row" style={{ marginTop: "10%" }}>
  <button
    className="cancel"
    onClick={() => {
      setShowItemData(true); // show table
      setShowModal(false);   // close modal
    }}
  >
    Cancel
  </button>
  <button
  className="create"
  onClick={() =>
    onCreate({
      id: Date.now(),
      title: docTitle,
      description: docDescription,
      attachments,
      createdAt: new Date().toISOString(),
      status: "Uploaded",
      
    })
  }
>
  Submit
</button>


</div>
          </div>
        </div>
          </div>
          </div>
    </div>
  )
}

export default TripDocumentCreate
