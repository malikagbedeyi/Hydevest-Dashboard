import React, { useState } from "react";
import { ChevronDown, Paperclip, Trash2 } from "lucide-react";

const typeOptions = ["Expense"];

const CURRENCIES = [
  { country: "United States", code: "USD", symbol: "$", rate: 1550 },
  { country: "United Kingdom", code: "GBP", symbol: "£", rate: 1950 },
  { country: "European Union", code: "EUR", symbol: "€", rate: 1700 },
  { country: "China", code: "CNY", symbol: "¥", rate: 215 },
  { country: "Japan", code: "JPY", symbol: "¥", rate: 10.5 },
  { country: "Canada", code: "CAD", symbol: "$", rate: 1150 },
  { country: "South Africa", code: "ZAR", symbol: "R", rate: 85 },
  { country: "Ghana", code: "GHS", symbol: "₵", rate: 130 },
  { country: "Nigeria", code: "NGN", symbol: "₦", rate: 1 },
];

const TripExpense = ({ onCreate, setShowItemData, setShowModal }) => {
  const [openTypeSelect, setOpenTypeSelect] = useState(false);
  const [typeSearch, setTypeSearch] = useState(false);
  const [openCurrencySelect, setOpenCurrencySelect] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    date: "",
    amount: "",
    checkbox:false,
    currency: CURRENCIES[0],
    rate: CURRENCIES[0].rate,
    amountNGN: 0,
    attachments: [],
  });

  /** ---------- handlers ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "amount") {
        updated.amountNGN = Number(value || 0) * prev.rate;
      }

      return updated;
    });
  };
  const formatCurrency = (value, currencyCode) => {
    const SAFE_CURRENCY_CODES = ["USD", "GBP", "EUR", "CAD", "AUD", "JPY", "CNY", "ZAR", "GHS", "AED"];
  
    const safeCode = SAFE_CURRENCY_CODES.includes(currencyCode)
      ? currencyCode
      : "USD"; // fallback
  
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: safeCode,
      minimumFractionDigits: 2,
    }).format(Number(value || 0));
  };
  
  const handleCurrencySelect = (currency) => {
    setForm((prev) => ({
      ...prev,
      currency,
      rate: currency.rate,
      amountNGN: Number(prev.amount || 0) * currency.rate,
    }));
  
    setOpenCurrencySelect(false); // ✅ CLOSE dropdown
  };
  
  const handleCreate = () => {
    onCreate({
      id: Date.now(),
      ...form,
      amount: Number(form.amount),
      currency: form.currency.code,
      currencySymbol: form.currency.symbol,
  
      // ✅ THIS IS THE KEY PART
      check: form.checkbox ? "Container Payment" : "General",
  
      status: "Pending",
      createdAt: new Date().toISOString(),
    });
  
    setShowItemData(true);
    setShowModal(false);
  };
  

  /** ---------- render ---------- */
  return (
    <div className="trip-modal">
      <div className="create-expense-modal">
        <div className="create-expense-card">
          <h2>Create Trip Expense</h2>
          <div className="" style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
          }}>
          <p>Enter Trip Expense details</p>
          <div className=""  style={{
            display:"flex",
            gap:"10px",
            alignItems:"center",
          }}>
         <input
  type="checkbox"
  checked={form.checkbox}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      checkbox: e.target.checked,
    }))
  }
/>
<span>Container Payment</span>

          </div>
          </div>
          {/* Title & Description */}
          <div className="grid-2">
            <div className="form-group">
              <label>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter item name"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
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
                    {form.type || "Select Type"}
                  </div>
                  <ChevronDown />
                </div>

                {openTypeSelect && (
                  <div className="select-dropdown">
                    {typeOptions.map((opt) => (
                      <div
                        key={opt}
                        className="option-item"
                        onClick={() => {
                          setForm((p) => ({ ...p, type: opt }));
                          setOpenTypeSelect(false);
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
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Amount / Currency / Rate */}
          <div className="grid-4">
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
              />
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

            <div className="form-group">
              <label>Rate</label>
              <input value={form.rate} readOnly />
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
            <button type="button" className="attach-link"
              onClick={() =>
                document.getElementById("finance-attachment").click()
              }
            >
              <Paperclip size={14} /> Attach File
            </button>
                <div className="recent-files">
                  {form.attachments.length === 0 && (
                    <small style={{ color: "#999", marginLeft: "-10px" }}>No attachments added</small>
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
                        onClick={() => form.attachments((prev) => prev.filter((a) => a.id !== f.id))}
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
            <button
              className="cancel"
              onClick={() => {
                setShowItemData(true);
                setShowModal(false);
              }}
            >
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
