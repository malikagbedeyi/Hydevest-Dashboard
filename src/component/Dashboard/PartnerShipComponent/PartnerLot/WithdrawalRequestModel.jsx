import React, { useState } from "react";
import { X, Paperclip } from "lucide-react";

const WithdrawalRequestModel = ({ onClose, onSubmit }) => {

  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    file: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFile = (e) => {
    setForm(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const submit = () => {
    if (!form.title || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="modal-overlay">

      <div className="modal-card">

        <div className="modal-header">
          <h3 style={{color:"#581aae"}}>Request Withdrawal</h3>
                    <X style={{color:"red"}} size={18} onClick={onClose} />
        </div>

        <div className="grid-2">

          <div className="form-group">
            <label>Request Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter request title"
            />
          </div>

          <div className="form-group">
            <label>Request Amount</label>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
            />
          </div>

          <div className="form-group full">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter request description"
            />
          </div>

          <div className="form-group full">
            <label>Upload File</label>

            <div className="file-upload">
              <Paperclip size={16} />
              <input type="file" onChange={handleFile} />
            </div>
          </div>

        </div>

        <div className="btn-row">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="create" onClick={submit}>
            Submit Request
          </button>
        </div>

      </div>

    </div>
  );
};

export default WithdrawalRequestModel;