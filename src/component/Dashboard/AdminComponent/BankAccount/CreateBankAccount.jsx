import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/account/createAccount.scss";
import { ChevronDown, X } from "lucide-react";

const CURRENCIES = [
  { country: "United States", code: "USD", symbol: "$", },
  { country: "United Kingdom", code: "GBP", symbol: "£",  },
  { country: "European Union", code: "EUR", symbol: "€", },
  { country: "China", code: "CNY", symbol: "¥",  },
  { country: "Japan", code: "JPY", symbol: "¥", },
  { country: "Canada", code: "CAD", symbol: "$", },
  { country: "South Africa", code: "ZAR", symbol: "R", },
  { country: "Ghana", code: "GHS", symbol: "₵", },
  { country: "Nigeria", code: "NGN", symbol: "₦",  },
];
const Entity = JSON.parse(localStorage.getItem("entity_data")) || [];

const CreateBankAccount = ({ data, setData, setView, openSubmenu }) => {
  const [form, setForm] = useState({    accountName: "",accountNumber: "",bankName: "",bankNumber: "",
    entity: "",accountOfficerName: "",accountOfficerNumber: "",currency: CURRENCIES[0],
  });
  const [openCurrencySelect, setOpenCurrencySelect] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [openEntitySelect, setOpenEntitySelect] = useState(false);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const assigneeOptions = [
    ...Entity.map((e) => ({
      id: e.id,
      name: e.name,
      type: "entity"
    }))
  ];
    const assigneeOptionsFiltered = assigneeOptions;
  const handleCreate = () => {
    const newdata = {
      id: crypto.randomUUID(),
      ...form,
      fullName: `${form.firstName} ${form.lastName}`, // 👈 useful later
      createdAt: new Date().toISOString(),
    };
  
    setData((prev) => [newdata, ...prev]);
    setSuccessMessage("Account successfully created");
  };
  const handleCurrencySelect = (currency) => {
    setForm((prev) => ({
      ...prev,
      currency,
    }));
  
    setOpenCurrencySelect(false); // ✅ CLOSE dropdown
  };

  const handleClosePopup = () => {
    setSuccessMessage(null);
    setView("table");
    openSubmenu?.("data");
  };

  /* ================= SUCCESS POPUP ================= */
  if (successMessage) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={handleClosePopup} className="delete-box">✕</div>
            <span>{successMessage}</span>
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
            <h2>Create Bank Account</h2>
            <X size={18} className="close" onClick={() => setView("table")} />
          </div>
          <p>Enter the details of new Bank Account</p>

          <div className="account-grid">
            <div className="account-grid-content">
            <div className="grid-2">
        <div className="form-group">
            <label>Account Name</label>
        <input  name="accountName" value={form.accountName} onChange={handleChange} placeholder="Enter Account Name" />
        </div>
         <div className="form-group">
            <label>Account Number</label>
        <input  name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="Enter Account Number" />
        </div>
      </div>
      <div className="grid-3">
           <div className="form-group">
           <label htmlFor="">Bank Name</label>
        <input name="bankName" value={form.bankName} onChange={handleChange} placeholder="Enter Bank Name" />
           </div>
      </div>
      <div className="grid-2">
      <div className="form-group-select">
  <label>Entity</label>

  <div className="custom-select">
    <div
      className="custom-select-drop"
      onClick={() => setOpenEntitySelect((prev) => !prev)}
    >
      <div className="select-box">
        {form.entity ? (
          <span>{form.entity.name}</span>
        ) : (
          <span className="placeholder">Select Entity</span>
        )}
      </div>

      <ChevronDown className={openEntitySelect ? "up" : "down"} />
    </div>

    {openEntitySelect && (
      <div className="select-dropdown">
        {assigneeOptions.map((item) => (
          <div
            key={item.id}
            className="option-item"
            onClick={() => {
              setForm((prev) => ({
                ...prev,
                entity: item,
              }));
              setOpenEntitySelect(false);
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

        <div className="form-group-select">
              <label>Currency</label>
              <div className="custom-select">
              <div
  className="custom-select-drop"
  onClick={() => setOpenCurrencySelect((prev) => !prev)}
>
  <div className="select-box">
    {form.currency
      ? `${form.currency.symbol} ${form.currency.code}`
      : "Select Currency"}
  </div>
  <ChevronDown />
</div>

                {openCurrencySelect && (
                <div className="select-dropdown">
                  {CURRENCIES.map((cur) => (
                    <div
                      key={cur.code}
                      className="option-item"
                      onClick={() => handleCurrencySelect(cur)}
                    >
                      {cur.country} ({cur.symbol} {cur.code})
                    </div>
                  ))}
                </div>
                )}
              </div>
            </div>

        </div>
        <div className="grid-2">
         <div className="form-group">
            <label>Account Officer Number</label>
        <input  name="accountOfficerNumber" value={form.accountOfficerNumber} onChange={handleChange} placeholder="Enter Account Officer Number" />
        </div>
       <div className="form-group">
            <label>Account Officer Name</label>
        <input  name="accountOfficerName" value={form.accountOfficerName} onChange={handleChange} placeholder="Enter Account Officer Name" />
        </div>
        </div>
        {/* ACTIONS */}
        <div className="btn-row">
            <button className="cancel" onClick={() => setView("table")}>
              Cancel
            </button>
            <button className="create" onClick={handleCreate}>
              Create Account
            </button>
          </div>
      </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default CreateBankAccount;