import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/Expensify/create.scss";
import { ChevronDown, Paperclip, Trash2 } from "lucide-react";

const typeOptions = ["Asset", "Liability", "Equity", "Income", "Expense"];

const CreateFinance = ({ setView, onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [openTypeSelect, setOpenTypeSelect] = useState(false);
  const [typeSearch, setTypeSearch] = useState("");

  const [date, setDate] = useState("");
  const [budgetedAmount, setBudgetedAmount] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [currency, setCurrency] = useState("$ dollar");
  const [rate, setRate] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleCreateFinance = () => {
    const payload = {
      id: Date.now(),
      title,
      description,
      type,
      date,
      amount: Number(advanceAmount),
      currency,
      rate,
      attachments,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    
    onCreate?.(payload);
    setView("table");
  };

  const filteredTypeOptions = typeOptions.filter((opt) =>
    opt.toLowerCase().includes(typeSearch.toLowerCase())
  );

  return (
    <div className="trip-modal">
      <div className="create-container-modal">
        <div className="create-container-card">
          <h2>Create Finance</h2>
          <p>Enter finance details</p>

          {/* Title & Description */}
          <div className="grid-2">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter item name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Enter item description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Type & Date */}
          <div className="grid-2">
            <div className="form-group-select">
              <label>Type</label>
              <div className="custom-select">
                <div
                  className="custom-select-drop"
                  onClick={() => setOpenTypeSelect(!openTypeSelect)}
                >
                  <div className="select-box">
                    {type ? <span>{type}</span> : <span className="placeholder">Select Type</span>}
                  </div>
                  <ChevronDown className={openTypeSelect ? "up" : "down"} />
                </div>

                {openTypeSelect && (
                  <div className="select-dropdown"  style={{zIndex:"99"}}>
                    <input
                      type="text"
                      placeholder="Search Type..."
                      value={typeSearch}
                      onChange={(e) => setTypeSearch(e.target.value)}
                      className="search-input"
                    />
                    {filteredTypeOptions.map((opt) => (
                      <div
                        key={opt}
                        className="option-item"
                        onClick={() => {
                          setType(opt);
                          setOpenTypeSelect(false);
                          setTypeSearch("");
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

         
          {/* Currency & Rate */}
          <div className="grid-4">
          <div className="form-group">
              <label> Amount</label>
              <input
                type="number"
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(e.target.value)}
                placeholder="Enter  Amount"
              />
            </div>
          <div className="form-group-select">
              <label>Currency</label>
              <div className="custom-select">
                <div className="custom-select-drop">
                  <div className="select-box" >{currency}</div>
                  <ChevronDown />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Rate</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="2"
              />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="">comment</label>
              <textarea name=""></textarea>
            </div>
            <section className="attachments">
            <div className="grid-3">
              <div className="form-group upload-box">
                <label>Upload</label>
                <input  type="file" hidden
                  id="finance-attachment"
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
                  onClick={() => document.getElementById("finance-attachment").click()}
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
          </div>

          {/* Actions */}
          <div className="btn-row" style={{marginTop:"10%"}}>
            <button className="cancel" onClick={() => setView("table")}>
              Cancel
            </button>
            <button
              className="create"
              disabled={!title || !advanceAmount || !type}
              onClick={handleCreateFinance}
            >
              Submit 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFinance;
