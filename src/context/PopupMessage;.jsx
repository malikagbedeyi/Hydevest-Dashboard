import React from "react";

const PopupMessage = ({ message, type = "success", onClose }) => {
  if (!message) return null;

  return (
    <div className="trip-card-popup">
      <div className="trip-card-popup-container">
        <div className={`popup-content ${type}`}>
          <div className="delete-box" onClick={onClose}>✕</div>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default PopupMessage;