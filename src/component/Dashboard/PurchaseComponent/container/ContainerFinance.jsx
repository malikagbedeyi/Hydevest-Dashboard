import React, { useRef, useState } from 'react'
import "../../../../assets/Styles/dashboard/Purchase/tripFinance.scss";
import { Paperclip, CalendarDays,ChevronRight,SendHorizontal, Eye, Trash2, Edit } from 'lucide-react'

const ContainerFinance = ({ setTrip,trip, goBack }) => {
    
 // Editable states
 const [approved, setApproved] = useState(false);
const scrollRef = useRef(null);
   const [title, setTitle] = useState(trip?.title || "No Title Set");
  const [budget, setBudget] = useState(trip?.amount || "12,345");
  const [type, setType] = useState(trip?.location || "type not set");
  const [startDate, setStartDate] = useState(trip?.startDate || "2025-02-21");
  const [endDate, setEndDate] = useState(trip?.endDate || "2025-02-21");
  const [activeTab, setActiveTab] = useState("comments");
  const typeBase = trip?.typeBase || trip.type; 
const amountBase = trip?.amountBase || trip.amount;
const rateBase = trip?.rateBase || trip.rate;

const typeOptions = generateFiveOptions(typeBase);
const amountOptions = generateFiveOptions(amountBase);
const rateOptions = generateFiveOptions(rateBase);

  // Individual edit states
   const [editTitle , setEditTitle] = useState(false);
  const [editBudget, setEditBudget] = useState(false);
  const [editStartDate, setEditStartDate] = useState(false);
  const [editType, setEditType] = useState(false);
  const [editEndDate, setEditEndDate] = useState(false);
const [description, setDescription] = useState(trip?.description || "");
const [editDescription, setEditDescription] = useState(false);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function generateFiveOptions(baseValue) {
  if (Array.isArray(baseValue)) return baseValue;

  return [
    baseValue,
    `${baseValue} 2`,
    `${baseValue} 3`,
    `${baseValue} 4`,
    `${baseValue} 5`,
  ];
}
  const handleChange = (e) => {
  const { name, value } = e.target;

  // Keep original values untouched
  if (name === "type") {
    setTrip({ 
      ...trip, 
      type: value,
      typeBase: typeBase   // <-- BASE NEVER CHANGES
    });
    return;
  }

  if (name === "amount") {
    setTrip({ 
      ...trip, 
      amount: value,
      amountBase: amountBase
    });
    return;
  }

  if (name === "rate") {
    setTrip({ 
      ...trip, 
      rate: value,
      rateBase: rateBase
    });
    return;
  }

  setTrip({ ...trip, [name]: value });
};
  return (
    <div className="finance-wrapper" ref={scrollRef}>
      {/* Header */}
      <div className="finance-header">
        <div className="breadcrumb">
            <strong>Container</strong> 
             <ChevronRight size={16} /> 
             <span>Expenses</span></div>
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
        {/* Type & Amount */}
        <div className="grid-2">
          <div className="form-group">
            <label>Type</label>
<select 
  name="type"
  value={trip.type}
  onChange={handleChange}
>
  {typeOptions.map((item, index) => (
    <option key={index} value={item}>
      {item}
    </option>
  ))}
</select>

          </div>

          <div className="form-group">
            <label>Amount</label>
      <select 
  name="amount"
  value={trip.amount}
  onChange={handleChange}
>
  {amountOptions.map((amt, index) => (
    <option key={index} value={amt}>
      ₦ {isNaN(amt) ? amt : Number(amt).toLocaleString()}
    </option>
  ))}
</select>


          </div>
        </div>

        {/* Date & Rate */}
        <div className="grid-2">
          <div className="form-group date">
            <label>Date</label>
            <div className="date-input">
              <div className="info-content-data">
                              {editStartDate ? (
                                <input
                                  type="date"
                                  value={startDate}
                                  autoFocus
                                  onChange={(e) => setStartDate(e.target.value)}
                                  onBlur={() => setEditStartDate(false)}
                                  onKeyDown={(e) => e.key === "Enter" && setEditStartDate(false)}
                                />
                              ) : (
                                <h2>{startDate}</h2>
                              )}
                              <Edit className="edit-icon" size={16} onClick={() => setEditStartDate(true)} />
                            </div>
              <CalendarDays size={18} />
            </div>
          </div>

          <div className="form-group">
            <label>Rate</label>
      <select 
  name="rate"
  value={trip.rate}
  onChange={handleChange}
>
  {rateOptions.map((rt, index) => (
    <option key={index} value={rt}>
      $ {rt}
    </option>
  ))}
</select>

          </div>
        </div>

        {/* Attachments */}
        <div className="attachment">
          <div className="attach-head">
            <h4>Attachment</h4>
            <button className="attach-btn"><Paperclip size={16}/> Attach File</button>
          </div>

          <div className="recent-files">
            <p>Recent Files Attached</p>
            <div className="file-row">
              <span>File A</span>
              <div className="icons">
                <Eye size={16} />
                <Edit size={16} />
                <Trash2 size={16} />
              </div>
            </div>

            <div className="file-row">
              <span>File B</span>
              <div className="icons">
                <Eye size={16} />
                <Edit size={16} />
                <Trash2 size={16} />
              </div>
            </div>

            <span className="view-all">View all</span>
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


export default ContainerFinance
