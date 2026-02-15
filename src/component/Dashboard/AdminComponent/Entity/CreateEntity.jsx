import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/create.scss";
import { ChevronDown, X } from "lucide-react";
import { EntityServices } from "../../../../services/Admin/EntityServices";


const CreateEntity = ({ data, setData, setView, onSuccess,mode }) => {
  const [loading,setLoading] = useState(false)
  const [message,setMessage] = useState(null)
  const [messageType,setMessageType] = useState("success")
  const [original, setOriginal] = useState(null);
  const [status, setStatus] = useState(data?.status ?? 0);
  const [form, setForm] = useState({
    firstname: "",
    lastname:"",
    email: "",
    phone_no: "",
    bank_name: "",
    bank_account: "",
  });
const isApproved = status === 1;

useEffect(() => {
  if (mode === "edit" && data) {
    const mapped = {
      user_uuid: data.user_uuid,
      firstname: data.firstname || "",
      lastname: data.lastname || "",
      email: data.email || "",
      phone_no: data.phone_no || "",
      bank_name: data.entity_bank?.bank_name || "",
      bank_account: data.entity_bank?.bank_account || "",
    };

    setForm(mapped);
    setOriginal(mapped);
  }
}, [mode, data]);

  useEffect(() => {
    if (mode === "edit" && data) {
      setStatus(data.status ?? 0);
    }
  }, [data, mode]);
  const userChanged = original
  ? form.firstname !== original.firstname ||
    form.lastname !== original.lastname ||
    form.email !== original.email ||
    form.phone_no !== original.phone_no
  : false;

const bankChanged = original
  ? form.bank_name !== original.bank_name ||
    form.bank_account !== original.bank_account
  : false;
/* ================= HANDLERS ================= */
  const handleUpdate = async () => {
    try {
      setLoading(true);
  
      if (!userChanged && !bankChanged) {
        setMessageType("error");
        setMessage("No changes detected");
        return;
      }
      if (!original) return;

      if (userChanged) {
        await EntityServices.edit({
          user_uuid: form.user_uuid,
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          phone_no: form.phone_no,
        });
      }
  
      if (bankChanged) {
        await EntityServices.editBank({
          user_uuid: form.user_uuid,
          bank_name: form.bank_name,
          bank_account: form.bank_account,
        });
      }
  
      setMessageType("success");
      setMessage("Entity updated successfully");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };
  

  const handleCreate = async() => {
    if (mode === "edit") {
      await handleUpdate();
      return;
    }
    try{
      setLoading(true)
     setMessage(null);

     await EntityServices.create(form)

     setMessageType("success");
     setMessage("Entity created successfully");
 
    }catch(err){
      const EndpointMessage = 
      err.response?.data?.message || 
       "Entity Creation failed. Please check your input.";

      setMessageType("error");
      setMessage(EndpointMessage);
    }finally{
      setLoading(false )
    }
  
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleCancel = () => {
  onSuccess?.()
  setView('table')
}


  const handleClosePopup = () => {
    setMessage(null);
    if (messageType === 'success' ) {
      onSuccess?.()
      setView('table')
    }
  };

  /* ================= SUCCESS POPUP ================= */
  if (message) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={handleClosePopup} className="delete-box">✕</div>
            <span>{message}</span>
          </div>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="trip-modal">
      <div className="create-container-modal">
        <div className="create-container-card">
          {/* HEADER */}
          <div className="header">
            <h2>{mode === "edit" ? "Edit Entity" : "Create New Entity"}</h2>
            <X size={18} className="close" onClick={() => setView("table")} />
          </div>
          <p>Enter the details of new Entity</p>

          <div className="account-grid">
            <div className="account-grid-content">
            <div className="grid-2">
         <div className="form-group">
             <label>First Name</label>
         <input  name="firstname" value={form.firstname} onChange={handleChange} placeholder="Enter First Name" />
         </div>
         <div className="form-group">
             <label>Last Name</label>
         <input  name="lastname" value={form.lastname} onChange={handleChange} placeholder="Enter Last Name" />
         </div>
         <div className="form-group">
             <label>Entity Email</label>
         <input  name="email" value={form.email} onChange={handleChange} placeholder="Enter Email Address" />
       </div>
         <div className="form-group">
             <label htmlFor="">Phone Number</label>
         <input name="phone_no" value={form.phone_no} onChange={handleChange} placeholder="Enter Phone Number" />
         </div>
         <div className="form-group">
             <label htmlFor="">Bank Name</label>
         <input name="bank_name" value={form.bank_name} onChange={handleChange} placeholder="Enter Bank Name" />
      </div>
        <div className="form-group">
              <label htmlFor=""> Bank Account Number</label>
         <input name="bank_account" type="number" value={form.bank_account} onChange={handleChange} placeholder="Enter Bank Account Number" />
      </div>
      </div>
        {/* ACTIONS */}
        <div className="btn-row">
            <button className="cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button className="create" onClick={handleCreate}>
            {mode === "edit" ? "Update Entity" : "Create Entity"}
            </button>
          </div>
      </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default CreateEntity;
