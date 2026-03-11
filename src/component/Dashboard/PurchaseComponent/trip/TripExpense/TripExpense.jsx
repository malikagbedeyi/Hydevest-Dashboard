import React, { useState } from "react";
import { ChevronDown, Paperclip, Trash2 } from "lucide-react";
import { ExpenseServices } from "../../../../../services/Trip/expense";

const typeOptions = ["Expense"];

const CURRENCIES = [
  { country: "United States", code: "USD", symbol: "$",  },
  { country: "United Kingdom", code: "GBP", symbol: "£", },
  { country: "European Union", code: "EUR", symbol: "€",  },
  { country: "China", code: "CNY", symbol: "¥",  },
  { country: "Japan", code: "JPY", symbol: "¥",  },
  { country: "Canada", code: "CAD", symbol: "$", },
  { country: "South Africa", code: "ZAR", symbol: "R", },
  { country: "Ghana", code: "GHS", symbol: "₵",  },
  { country: "Nigeria", code: "NGN", symbol: "₦", },
];

  const PAYMENT_TYPES = [
  { label: "Container Payment", value: 1 },
  { label: "General Payment", value: 0 },
];

const TripExpense = ({ onCreate, setShowItemData, setShowModal, tripUuid ,showMessage}) => {
  const [openTypeSelect, setOpenTypeSelect] = useState(false);
  const [typeSearch, setTypeSearch] = useState(false);
  const [openCurrencySelect, setOpenCurrencySelect] = useState(false);
const [openPaymentSelect, setOpenPaymentSelect] = useState(false);
const [message, setMessage] = useState(null);
const [messageType, setMessageType] = useState("success");
const [form, setForm] = useState({
  title: "",
  description: "",
  type: "",
  date: "",
  amount: "",
  currency: CURRENCIES[0],
  rate: CURRENCIES[0].rate,
  amountNGN: 0,
  attachments: [],
  comment: "",
  is_container_payment: 0, // default General Payment
});

  /** ---------- handlers ---------- */
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "amount") updated.amountNGN = Number(value || 0) * prev.rate;
      return updated;
    });
  };

const handlePaymentSelect = (option) => {
  setForm((prev) => ({
    ...prev,
    is_container_payment: option.value,
  }));

  setOpenPaymentSelect(false);
};

  const handleCurrencySelect = (currency) => {
    setForm((prev) => ({
      ...prev,
      currency,
      rate: currency.rate,
      amountNGN: Number(prev.amount || 0) * currency.rate,
    }));
    setOpenCurrencySelect(false);
  };

const handleCreate = async () => {
  try {

    if (!form.title || !form.amount || !form.date) {
      setMessageType("error");
      setMessage("Title, amount and date are required");
      return;
    }

    const payload = new FormData();

    payload.append("trip_uuid", tripUuid);
    payload.append("title", form.title);
    payload.append("date", form.date);
    payload.append("amount", Number(form.amount));
    payload.append("currency", form.currency.code);
    payload.append("rate", Number(form.rate));
    payload.append("is_container_payment", form.is_container_payment);
    payload.append("desc", form.description || "");
    payload.append("comment", form.comment || "");

    form.attachments.forEach((f) => {
      payload.append("attachment", f.file);
    });

    const res = await ExpenseServices.create(payload);

    onCreate({
      expense_uuid: res.data.record?.expense_uuid,
      title: form.title,
      amount: Number(form.amount),
      currency: form.currency.code,
      rate: Number(form.rate,
      ),
      is_container_payment: form.is_container_payment,
      status: 0,
      date: form.date,
      created_at: res.data.record?.created_at,
    });

    setMessageType("success");
    setMessage(res.data?.message || "Expense created successfully");

  } catch (err) {

    setMessageType("error");
    setMessage(
      err.response?.data?.message || "Failed to create expense"
    );

  }
};
const handleClosePopup = () => {
  setMessage(null);

  if (messageType === "success") {
  onCreate({
    title: form.title
  });

  setShowModal(false);
  setShowItemData(true);
}
};

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
  

  /** ---------- render ---------- */
  return (
    <div className="trip-modal">
      <div className="create-expense-modal">
        <div className="create-expense-card">
          <h2 style={{ fontSize: "1.4vw", color: "#581aae" }}>Create Trip Expense</h2>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "1vw" }}>Enter Trip Expense details</p>
          </div> 

          {/* Title & Description */}
          <div className="grid-2">
            <div className="form-group">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Enter item name" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} />
            </div>
            <div className="form-group-select"> 
  <label>Select Payment Type</label>

  <div className="custom-select">
    <div
      className="custom-select-drop"
      onClick={() => setOpenPaymentSelect((prev) => !prev)}
    >
      <div className="select-box">
        {form.is_container_payment === 1
          ? "Container Payment"
          : "General Payment"}
      </div>

      <ChevronDown />
    </div>

    {openPaymentSelect && (
      <div className="select-dropdown">
        {PAYMENT_TYPES.map((option) => (
          <div
            key={option.value}
            className="option-item"
            onClick={() => handlePaymentSelect(option)}
          >
            {option.label}
          </div>
        ))}
      </div>
    )}
  </div>
</div>
          <div className="form-group mb-4">
              <label>Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} />
            </div> 
            </div>
          <div className="grid-4">
            <div className="form-group">
              <label>Amount</label>
              <input type="number" name="amount" placeholder="Enter Amount" value={form.amount} onChange={handleChange} />
            </div>
            <div className="form-group-select">
              <label>Currency</label>
              <div className="custom-select">
                <div className="custom-select-drop" onClick={() => setOpenCurrencySelect((prev) => !prev)}>
                  <div className="select-box">
                    {form.currency ? `${form.currency.symbol} ${form.currency.code}` : "Select Currency"}
                  </div>
                  <ChevronDown />
                </div>
                {openCurrencySelect && (
                  <div className="select-dropdown">
                    {CURRENCIES.map((cur) => (
                      <div key={cur.code} className="option-item" onClick={() => handleCurrencySelect(cur)}>
                        {cur.country} ({cur.symbol} {cur.code})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Rate</label>
              <input type="text" name="rate" placeholder="Enter Rate"  value={form.rate} onChange={handleChange}  />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Comment</label>
              <textarea name="comment" value={form.comment} onChange={handleChange} />
            </div>
            <section className="attachments">
              <div className="grid-3">
                <div className="form-group upload-box">
                  <label>Upload</label>
                  <input
                    type="file"
                    hidden
                    id="finance-attachment"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setForm((prev) => ({
                        ...prev,
                        attachments: [
                          ...prev.attachments,
                          ...files.map((f) => ({
                            id: crypto.randomUUID(),
                            name: f.name,
                            size: f.size,
                            file: f,
                          })),
                        ],
                      }));
                    }}
                  />
                  <button type="button" className="attach-link" onClick={() => document.getElementById("finance-attachment").click()}>
                    <Paperclip size={14} /> Attach File
                  </button>
                  <div className="recent-files">
                    {form.attachments.length === 0 && (
                      <small style={{ color: "#999", marginLeft: "-10px", fontSize: "0.9vw" }}>No attachments added</small>
                    )}
                    {form.attachments.map((f) => (
                      <div key={f.id} className="file-row">
                        <div>
                          <div className="small-muted">{f.name}</div>
                          <small>{(f.size / 1024).toFixed(1)} KB</small>
                        </div>
                        <Trash2
                          size={16}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setForm((prev) => ({ ...prev, attachments: prev.attachments.filter((a) => a.id !== f.id) }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Actions */}
          <div className="btn-row">
            <button className="cancel" onClick={() => { setShowItemData(true); setShowModal(false); }}>
              Cancel
            </button>
            <button className="create" onClick={handleCreate}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripExpense;
