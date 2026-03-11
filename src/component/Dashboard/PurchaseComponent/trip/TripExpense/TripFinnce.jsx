import React, { useRef, useState, useEffect } from 'react';
import "../../../../../assets/Styles/dashboard/Purchase/tripFinance.scss";
import { Paperclip, CalendarDays, ChevronRight, SendHorizontal, Eye, Trash2, Edit, ChevronDown } from 'lucide-react';
import { ExpenseServices } from '../../../../../services/Trip/expense';
import TripExpenseLog from './TripExpenseLog';
import TripComment from './TripComment';
import FileAttachment from "./FileAttachment";


const PAYMENT_TYPES = [
  { label: "Container Payment", value: 1 },
  { label: "General Payment", value: 0 },
];

const TripFinnce = ({ setTrip, trip,previous, goBack, onApprovalChange }) => {

  const scrollRef = useRef(null);

  // Initialize states from trip
  const [approved, setApproved] = useState(false);
  const [title, setTitle] = useState(trip?.title || "No Title Set");
  const [type, setType] = useState(trip?.location || "type not set");
const [date, setDate] = useState(trip?.date || trip?.created_at || "");
  const [description, setDescription] = useState(trip?.desc || "");
  const [activeTab, setActiveTab] = useState("comments");
  const [loading, setLoading] = useState(false);
const [amount, setAmount] = useState(trip?.amount || "");
const [rate, setRate] = useState(trip?.rate || "");
const [isContainerPayment, setIsContainerPayment] = useState(
  trip?.is_container_payment ?? 0
);

const [openPaymentSelect, setOpenPaymentSelect] = useState(false);
const [editIsContainerPayment, setEditIsContainerPayment] = useState(false);
  // Individual edit states
  const [editTitle, setEditTitle] = useState(false);
  const [editDescription, setEditDescription] = useState(false);

const [editAmount, setEditAmount] = useState(false);
const [editRate, setEditRate] = useState(false);
const [editDate, setEditDate] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // const approved = trip?.approved;

  /** ---------- EDIT / UPDATE HANDLER ---------- */
  const handleUpdate = async () => {
    if (!trip?.expense_uuid) return;

    try {
      setLoading(true);
      const payload = {
        expense_uuid: trip.expense_uuid,
        title: title,
        desc: description,
        amount: amount,
        currency: trip.currency || "NGN",
        rate: rate,
        date: date,
        is_container_payment: isContainerPayment,
        status: trip.status,
        approved: trip.approved,
      };

      const res = await ExpenseServices.edit(payload);

      const updatedTrip = {
        ...trip,
        ...payload,
        updated_at: res.data.updated_at || new Date().toISOString(),
      };

      setTrip(updatedTrip);
      onApprovalChange?.(updatedTrip); 
      handleApprovalChange()
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      goBack(true);

    } catch (err) {
      console.error("Error updating expense:", err);
    } finally {
      setLoading(false);
    }
  };

  /** ---------- APPROVE / CHANGE APPROVAL HANDLER ---------- */
  const handleApprovalChange = async () => {
    if (!trip?.expense_uuid) return;

    const newStatus = approved ? 1 : 0;

    // Optimistic update
    const updated = { ...trip, status: newStatus, approved: newStatus === 1 };
    setTrip(updated);
    onApprovalChange?.(updated);

    try {
      setLoading(true);
      await ExpenseServices.change_approval({
        expense_uuid: trip.expense_uuid,
        status: newStatus,
      });
    } catch (err) {
      console.error("Error changing approval:", err);

      // Rollback if API fails
      const rollback = { ...trip };
      setTrip(rollback);
      onApprovalChange?.(rollback);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    date
      ? new Date(date)
          .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          .replace(/ /g, "-")
      : "-";

const formatInputDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};
  return (
    <div className="finance-wrapper" ref={scrollRef}>
      {/* Header */}
      <div className="finance-header">
        <div className=""></div>
        <div className="actions">
<button
  className={approved ? "d-none" : "primary"}
  onClick={() => setApproved(true)}  
  disabled={loading}
>
  {loading ? "Approving..." : "Approve"}
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
   <div className="form-group-select mb-5">
  <label>Select Payment Type</label>

  <div className="custom-select">

    {/* SELECT DISPLAY */}
    <div
      className="custom-select-drop"
      onClick={() => setOpenPaymentSelect(!openPaymentSelect)}
    >
      <div className="select-box">
        {isContainerPayment === 1
          ? "Container Payment"
          : "General Payment"}
      </div>

      <ChevronDown
        className={openPaymentSelect ? "up" : "down"}
      />
    </div>

    {/* DROPDOWN */}
    {openPaymentSelect && (
      <div className="select-dropdown">
        {PAYMENT_TYPES.map((option) => (
          <div
            key={option.value}
            className="option-item"
            onClick={() => {
              setIsContainerPayment(option.value);
              setOpenPaymentSelect(false);
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

          <div className="form-group ">
  <label>Amount</label>

  <div className="info-content-data">
    {editAmount ? (
      <input
        type="text"
        value={amount}
        autoFocus
        onChange={(e) => setAmount(e.target.value)}
        onBlur={() => setEditAmount(false)}
        onKeyDown={(e) => e.key === "Enter" && setEditAmount(false)}
      />
    ) : (
      <span>{amount}</span>
    )}

    <Edit
      className="edit-icon"
      size={16}
      onClick={() => setEditAmount(true)}
    />
  </div>
</div>
        </div>

        {/* Date & Rate */}
        <div className="grid-2">
          <div className="form-group date">
  <label>Date</label>

  <div className="date-input">
    <div className="info-content-data">
      {editDate ? (
        <input
          type="date"
          value={formatInputDate(date)}
          autoFocus
          onChange={(e) => setDate(e.target.value)}
          onBlur={() => setEditDate(false)}
          onKeyDown={(e) => e.key === "Enter" && setEditDate(false)}
        />
      ) : (
        <h2>{date}</h2>
      )}

      <Edit
        className="edit-icon"
        size={16}
        onClick={() => setEditDate(true)}
      />
    </div>

    <CalendarDays size={18} />
  </div>
</div>
          <div className="form-group">
  <label>Rate</label>

  <div className="info-content-data">
    {editRate ? (
      <input
        type="text"
        value={rate}
        autoFocus
        onChange={(e) => setRate(e.target.value)}
        onBlur={() => setEditRate(false)}
        onKeyDown={(e) => e.key === "Enter" && setEditRate(false)}
      />
    ) : (
      <span>{rate}</span>
    )}

    <Edit
      className="edit-icon"
      size={16}
      onClick={() => setEditRate(true)}
    />
  </div>
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
