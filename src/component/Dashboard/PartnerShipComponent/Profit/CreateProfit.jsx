import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/create.scss";
import { ChevronDown, Paperclip, Trash2 } from "lucide-react";

const typeOptions = ["Asset", "Liability", "Equity", "Income", "Expense"];

const CreateProfit = ({ setView, onCreate }) => {

  return (
    <div className="trip-modal">
      <div className="create-container-modal">
        <div className="create-container-card">
          <h2>Create Profit</h2>
          <p>Enter Profit details</p>

          
          {/* Actions */}
          <div className="btn-row" style={{marginTop:"10%"}}>
            <button className="cancel" onClick={() => setView("table")}>
              Cancel</button>
            <button className="create">Submit </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfit
