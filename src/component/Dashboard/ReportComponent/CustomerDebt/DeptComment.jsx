import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const DeptComment = ({ comments, addComment, onClose }) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    addComment({ id: Date.now(), title: "New Comment", text: newComment });
    setNewComment("");
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        background: "#fff",
        padding: "50px 30px",
        borderRadius: "12px",
        width: "600px",
        maxHeight: "80vh",
        overflowY: "auto",
        position: "relative"
      }}>
        <h3 style={{color:"#581aae"}}>Add  Comments</h3>
        <X onClick={onClose} style={{ position: "absolute", top: "10px", right: "10px",color:"red" ,cursor:"pointer"}} />

        <div style={{ margin: "10px 0" }}>
          {comments.length === 0 && <p>No comments yet.</p>}
          {comments.map((c, idx) => (
            <div key={c.id} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              <strong>{c.title}:</strong>
              <p>{c.text}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <textarea
            type="text"
            value={newComment}q
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add new comment"
            style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <button onClick={handleAddComment} style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: "5px", background: "#581aae", color: "#fff", borderRadius: "6px", border: "none", cursor: "pointer" }}>
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeptComment;