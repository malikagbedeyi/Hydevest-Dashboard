import React, { useEffect, useState } from "react";
import { Paperclip, Eye, Trash2, Edit } from "lucide-react";
import { ExpenseServices } from "../../../../../services/Trip/expense";

const FileAttachment = ({ expense_uuid }) => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [editingFileId, setEditingFileId] = useState(null);
  const [editFileName, setEditFileName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editFile, setEditFile] = useState(null);

  const fetchAttachments = async () => {
    if (!expense_uuid) return;
    try {
      const res = await ExpenseServices.attachmentList({ expense_uuid });
      const records = Array.isArray(res.data?.record?.data)
        ? res.data.record.data
        : [];
      setFiles(records);
    } catch (err) {
      console.error("Failed to fetch attachments", err);
      setFiles([]);
    }
  };

  const displayedFiles = showAll ? files : files.slice(0, 3);

  const handleUpload = async () => {
    if (!file || !fileName) return;
    const formData = new FormData();
    formData.append("expense_uuid", expense_uuid);
    formData.append("file_name", fileName);
    formData.append("attachment", file);
    if (desc) formData.append("desc", desc);

    try {
      setLoading(true);
      await ExpenseServices.attachmentCreate(formData);
      setFile(null);
      setFileName("");
      setDesc("");
      fetchAttachments();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async (attachment_uuid) => {
    const formData = new FormData();
    formData.append("attachment_uuid", attachment_uuid);
    formData.append("file_name", editFileName);
    formData.append("desc", editDesc);
    if (editFile) formData.append("attachment", editFile);

    try {
      setLoading(true);
      await ExpenseServices.attachmentEdit(formData);
      setEditingFileId(null);
      setEditFileName("");
      setEditDesc("");
      setEditFile(null);
      fetchAttachments();
    } catch (err) {
      console.error("Failed to edit attachment", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [expense_uuid]);

  return (
    <div className="attachment">
      <div className="attach-head">
        <h4>Attachment</h4>
        <label className="attach-btn" style={{cursor:"pointer"}}>
          <Paperclip size={16} /> Attach File
          <input
            type="file"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
      </div>

      {file && (
        <>
          <div className="grid-2 mt-5 mb-5">
            <div className="form-group">
              <label>File Name</label>
              <input
                placeholder="Enter File name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
          </div>
          <div className="footer-btns">
            <button
              className="create mt-3"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </>
      )}

      <div className="recent-files">
        <p>Recent Files Attached</p>

        {files.length === 0 ? (
          <p>No attachments yet</p>
        ) : (
          displayedFiles.map((item) => (
            <div key={item.attachment_uuid} className="edit file-row">
              {editingFileId === item.attachment_uuid ? (
                <>
                <div className="">
                <div className="grid-3">
                <div className="form-group">
                    <label >File Name</label>
                  <input  type="text"  value={editFileName}  onChange={(e) => setEditFileName(e.target.value)}  />
                  </div>
                  <div className="form-group">
                    <label htmlFor=""> Description</label>
                  <input type="text"value={editDesc}onChange={(e) => setEditDesc(e.target.value)} placeholder=" Enter Description" />
                  </div>
                  <div className="form-group">
                    <label ></label>
                  <input type="file" onChange={(e) => setEditFile(e.target.files[0])} />
                  </div>
                  </div>
                  <div className="footer-btns mb-3">
                  <button className="create"
                    onClick={() => handleEditSave(item.attachment_uuid)}  disabled={loading}   >  Save
                  </button>
                  <button className="preview"
                    onClick={() => setEditingFileId(null)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
     <span>{item.file_name}</span>
    <div className="icons">
      <Eye
        size={16}
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (item.file) {
            window.open(item.file, "_blank", "noopener,noreferrer");
          } else {
            alert("File path not found in the record");
          }
        }}
      />
      <Edit
        size={16}
        onClick={() => {
          setEditingFileId(item.attachment_uuid);
          setEditFileName(item.file_name);
          setEditDesc(item.desc || "");
          setEditFile(null);
        }}
      />
      {/* <Trash2 size={16} /> */}
    </div>
  </>
)}
            </div>
          ))
        )}

        {files.length > 3 && (
          <span
            className="view-all"
            onClick={() => setShowAll((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            {showAll ? "View less" : "View all"}
          </span>
        )}
      </div>
    </div>
  );
};

export default FileAttachment;
