import React, { useState, useRef, useEffect } from "react";
import { X, Paperclip, ChevronDown } from "lucide-react";

const ContainerRequestModel = ({ onClose, onSubmit }) => {
 const RequestQuantity = ["0.25","0.5","1"]
const dropdownRef = useRef(null);
useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpenQuantity(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
  const [openQuantity , setOpenQuantity] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    quantity: "",
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
    if (!form.title || !form.quantity) {
      alert("Please fill all required fields");
      return;
    }

    onSubmit(form);
  };
 
  return (
    <div className="modal-overlay">

      <div className="modal-card">

        <div className="modal-header">
          <h3 style={{color:"#581aae"}}>Request Container</h3>
          <X style={{color:"red"}} size={18} onClick={onClose} />
        </div>

        <div className="grid-2">

          {/* <div className="form-group">
            <label>Request Title</label>
            <input 
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter request title"
            />
          </div> */}

          <div className="form-group-select">
            <label>Request Quantity</label>
         <div className="custom-select" ref={dropdownRef}>
  <div
    className="custom-select-drop"
    onClick={() => setOpenQuantity(!openQuantity)}
  >
    <div className="select-box">
      <span>{form.quantity || "Select Quantity"}</span>
    </div>

    <ChevronDown className={openQuantity ? "up" : "down"} />
  </div>

  {openQuantity && (
    <div className="select-dropdown">
      {RequestQuantity.map((item) => (
        <div
          className="option-item"
          key={item}
          onClick={() => {
            setForm(prev => ({
              ...prev,
              quantity: item
            }));
            setOpenQuantity(false);
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )}
</div>

            
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

          {/* <div className="form-group full">
            <label>Upload File</label>

            <div className="file-upload">
              <Paperclip size={16} />
              <input type="file" onChange={handleFile} />
            </div>
          </div> */}

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

export default ContainerRequestModel;