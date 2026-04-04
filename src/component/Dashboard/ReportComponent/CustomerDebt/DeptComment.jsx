import React, { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';

const DeptComment = ({ comments, addComment, onClose }) => {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    setSubmitting(true);
    await addComment(newComment);
    setNewComment("");
    setSubmitting(false);

    onClose();
  };

  // Limit to the most recent 5 comments
  const limitedComments = comments.slice(0, 5);

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
        padding: "30px",
        borderRadius: "12px",
        width: "600px",
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}>
        <h3 style={{color:"#581aae", marginBottom: "5px"}}>Create Comments</h3>
        <p style={{fontSize: '12px', color: '#666', marginBottom: '15px'}}>Recent Comment</p>
        
        <X onClick={onClose} style={{ position: "absolute", top: "20px", right: "20px", color:"#666", cursor:"pointer"}} />

        <div style={{ flex: 1, overflowY: "auto", marginBottom: "20px", paddingRight: "10px" }}>
          {limitedComments.length === 0 ? <p style={{color: "#999"}}>No history found.</p> : 
            limitedComments.map((c) => (
              <div key={c.id} style={{ padding: "12px", borderBottom: "1px solid #eee", background: "#f9f9f9", borderRadius: "8px", marginBottom: "10px" }}>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "5px"}}>
                  <strong style={{fontSize: "13px", color: "#581aae"}}>{c.creator_info?.firstname} {c.creator_info?.lastname}</strong>
                  <span style={{fontSize: "11px", color: "#999"}}>{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <p style={{fontSize: "14px", margin: 0}}>{c.comment}</p>
              </div>
            ))
          }
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment about this debt..."
            style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ddd", minHeight: "60px", resize: "none" }}
          />
          <button 
            onClick={handleAddComment} 
            disabled={submitting}
            style={{ padding: "0 20px", display: "flex", alignItems: "center", gap: "5px", background: "#581aae", color: "#fff", borderRadius: "8px", border: "none", cursor: "pointer" }}
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Post</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeptComment;