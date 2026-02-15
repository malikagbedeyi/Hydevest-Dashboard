import React, { useRef, useState } from 'react'
import "../../../../../assets/Styles/dashboard/Purchase/tripFinance.scss";
import { Paperclip, CalendarDays,ChevronRight,SendHorizontal, Eye, Trash2, Edit } from 'lucide-react'

const TripDocumentDrill = ({ setTrip,trip, goBack }) => {
    
 // Editable states
 const [approved, setApproved] = useState(false);
const scrollRef = useRef(null);
   const [title, setTitle] = useState(trip?.title || "No Title Set");
  const [activeTab, setActiveTab] = useState("comments");


  // Individual edit states
   const [editTitle , setEditTitle] = useState(false);
const [description, setDescription] = useState(trip?.description || "");
const [editDescription, setEditDescription] = useState(false);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  const handleChange = (e) => {
  const { name, value } = e.target;


  setTrip({ ...trip, [name]: value });
};
  return (
    <div className="finance-wrapper" ref={scrollRef}>
      {/* Header */}
      <div className="finance-header">
        <div className="breadcrumb">
            <strong>Trip</strong> 
             <ChevronRight size={16} /> 
             <span>Document</span></div>
        <div className="actions">
            {!approved && (
            <button className="primary" onClick={() => setApproved(!approved)}>
                Approve
</button>
)}
         <div className="status">
  <span>{approved ? "Approved" : "Not Approve"}</span>
</div>

        </div>
      </div>

      <div className="finance-card">

        {/* Title */}
        <div className="form-group">
             <label>Title <span>*</span></label>
           <div className="info-content-data">
              {editTitle ? (
                <input
                type="text"
                value={title}
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setEditTitle(false)}
                onKeyDown={(e) => e.key === "Enter" && setEditTitle(false)}
              />
            ) : (
                 <span>{title}</span>
             )}
              <Edit className="edit-icon" size={16} onClick={() => setEditTitle(true)} />
                 </div>
        </div>
        
        {/* Description */}
        <div className="form-group">
          <div className="trip-description">
                  <div className="desc-header">
                      <label>Description <span>*</span></label>
             {!editDescription && (
               <Edit
                 size={16}
                 className="edit-icon"
                 onClick={() => setEditDescription(true)}
               />
             )}
           </div>
           <div className="desc-body">
             {editDescription ? (
               <textarea
                 className="desc-textarea"
                 value={description}
                 autoFocus
                 onChange={(e) => setDescription(e.target.value)}
                 onBlur={() => setEditDescription(false)}
                 onKeyDown={(e) => {
                   if (e.key === "Enter" && !e.shiftKey) {
                     e.preventDefault();
                     setEditDescription(false);
                   }
                 }}
               />
             ) : (
               <p>{description}</p>
             )}
           </div>
                   </div>
              </div>

        {/* Activity / Comments */}
        <div className="activity">
          <div className="tabs">
             <span
                className={activeTab === "comments" ? "active" : ""}
                onClick={() => setActiveTab("comments")}
              >
                Comments
              </span>
              <span
                className={activeTab === "activity" ? "active" : ""}
                onClick={() => setActiveTab("activity")}
              >
                Activity Log
              </span>
          </div>
          {activeTab === "comments" &&  (
             <div className="">
          <div className="comment-box">
            <textarea placeholder="Add your comment"></textarea>
            <button><SendHorizontal size={16}/></button>
          </div>
          <div className="recent">
            <p className="recent-title">Recent</p>
            <div className="user">
              <strong>Joel Kay</strong>
              <span>02:30 pm</span>
            </div>
            <p className="text">Review the list of users with access to privileged functions</p>
          </div>
          <div className="recent">
            <div className="user">
              <strong>Joel Kay</strong>
            </div>
            <p className="text">Review the list of users with access to privileged functions</p>
          </div>
    </div>
          )}
           {activeTab === "activity" &&  (
            <div className="">

            </div>
           )}
        </div>
 <div className="footer-btns">
          <button onClick={()=>goBack(true)} className="preview">Preview</button>
          <button   onClick={() => {
    scrollToTop();
    setApproved(false); 
  }} className="create">Update</button>
        </div>
      </div>
    </div>
  )
}

export default TripDocumentDrill
