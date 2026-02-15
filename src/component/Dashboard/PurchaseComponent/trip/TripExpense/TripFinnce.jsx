import React, { useRef, useState, useEffect } from 'react';
import "../../../../../assets/Styles/dashboard/Purchase/tripFinance.scss";
import { Paperclip, CalendarDays, ChevronRight, SendHorizontal, Eye, Trash2, Edit } from 'lucide-react';
import { ExpenseServices } from '../../../../../services/Trip/expense';
import TripExpenseLog from './TripExpenseLog';
import TripComment from './TripComment';
import FileAttachment from "./FileAttachment";

const TripFinnce = ({ setTrip, trip, goBack }) => {
  const scrollRef = useRef(null);

  // Initialize states from trip
  const [approved, setApproved] = useState(trip?.approved || false);
  const [title, setTitle] = useState(trip?.title || "No Title Set");
  const [type, setType] = useState(trip?.location || "type not set");
  const [startDate, setStartDate] = useState(trip?.startDate || "2025-02-21");
  const [description, setDescription] = useState(trip?.desc || "");
  const [activeTab, setActiveTab] = useState("comments");
  const [loading, setLoading] = useState(false);

  // Individual edit states
  const [editTitle, setEditTitle] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editStartDate, setEditStartDate] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  /** ---------- EDIT / UPDATE HANDLER ---------- */
  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (!trip?.expense_uuid) return;

      const payload = {
        expense_uuid: trip.expense_uuid,
        title,
        desc: description,
        amount: trip.amount,
        currency: trip.currency || "NGN",
        rate: trip.rate,
        date: startDate,
        is_container_payment: trip.is_container_payment || 0,
      };

      const res = await ExpenseServices.edit(payload);

      setTrip({
        ...trip,
        ...payload,
        updated_at: res.data.updated_at || new Date().toISOString(),
        approved, // keep approval state
      });

      scrollToTop();
      goBack(true);
    } catch (err) {
      console.error("Error updating expense:", err);
    } finally {
      setLoading(false);
    }
  };

  /** ---------- APPROVE / CHANGE APPROVAL HANDLER ---------- */
  const handleApprovalChange = async () => {
    try {
      setLoading(true);
      if (!trip?.expense_uuid) return;

      const newStatus = approved ? 0 : 1;

      const payload = {
        expense_uuid: trip.expense_uuid,
        status: newStatus,
      };

      const res = await ExpenseServices.change_approval(payload);

      setApproved(newStatus === 1);

      setTrip({
        ...trip,
        approved: newStatus === 1,
        updated_at: res.data.updated_at || new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error changing approval:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finance-wrapper" ref={scrollRef}>
      {/* Header */}
      <div className="finance-header">
        <div className="breadcrumb">
          <strong>Trip</strong>
          <ChevronRight size={16} />
          <span>Expense</span>
        </div>
        <div className="actions">
          <button className="primary" onClick={handleApprovalChange} disabled={loading}>
            {approved ? "Unapprove" : "Approve"}
          </button>
          <div className="status">
            <span>{approved ? "Approved" : "Not Approved"}</span>
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
                <Edit size={16} className="edit-icon" onClick={() => setEditDescription(true)} />
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
        <div className="grid-2" style={{ marginBottom: "0.7vw" }}>
          <div className="form-group">
            <label>Type</label>
            <input type="text" value={type} />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input type="text" value={trip?.amount} />
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
            <input type="text" value={trip.rate} />
          </div>
        </div>

        {/* Attachments */}
        <FileAttachment expense_uuid={trip?.expense_uuid} />


        {/* Activity / Comments */}
        <div className="activity">
          <div className="tabs">
            <span className={activeTab === "comments" ? "active" : ""} onClick={() => setActiveTab("comments")}>Comments</span>
            <span className={activeTab === "activity" ? "active" : ""} onClick={() => setActiveTab("activity")}>Activity Log</span>
          </div>

          {activeTab === "comments" && (
  <TripComment expense_uuid={trip?.expense_uuid} />
)}


          {activeTab === "activity" && (
            <div className="activity-logs">
           {activeTab === "activity" && (
  <TripExpenseLog expense_uuid={trip?.expense_uuid} />
)}

            </div>
          )}
        </div>

        <div className="footer-btns">
          <button onClick={() => goBack(true)} className="preview">Preview</button>
          <button className="create" onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripFinnce;
