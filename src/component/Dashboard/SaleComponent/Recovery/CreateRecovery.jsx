import React, { useMemo, useState } from "react";
import "../../../../assets/Styles/dashboard/Sale/createPresale.scss";
import { ChevronDown, Eye, File, Paperclip, Trash2 } from "lucide-react";

const CreateRecovery = ({ SalesData = [], setView, onCreate }) => {
  /* ===================== STATE ===================== */
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [collapsedContainers , setCollapsedContainers] = useState(false)
  const [openCustomerSelect, setOpenCustomerSelect] = useState(false);
  const [openSaleSelect, setOpenSaleSelect] = useState(false);
  const [amountPaid, setAmountPaid] = useState("");
const [paymentDate, setPaymentDate] = useState("");
const [error, setError] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [attachments, setAttachments] = useState([]);

  /* ===================== CUSTOMER OPTIONS ===================== */
  const customerOptions = useMemo(() => {
    const map = new Map();
    SalesData.forEach((sale) => {
      if (!sale.customer?.name || !sale.customer?.phone) return;
  
      const key = `${sale.customer.name}-${sale.customer.phone}`;
  
      if (!map.has(key)) {
        map.set(key, {
          name: sale.customer.name,
          phone: sale.customer.phone,
        });
      }
    });
  
    return Array.from(map.values());
  }, [SalesData]);

  // filtered customers based on search input
  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customerOptions;
    return customerOptions.filter(c =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch)
    );
  }, [customerSearch, customerOptions]);
  
  /* ===================== SALES BY CUSTOMER ===================== */
  const customerSales = useMemo(() => {
    if (!selectedCustomer) return [];

    return SalesData
      .map((sale, index) => ({ ...sale, sn: index + 1,}))
      .filter(
        sale => sale.customer?.name === selectedCustomer.name &&
                sale.customer?.phone === selectedCustomer.phone
      );
  }, [selectedCustomer, SalesData]);

  /* ===================== CREATE RECOVERY ===================== */
  const handleCreateRecovery = () => {
    if (!selectedCustomer || !selectedSale) return;
  
    const paid = Number(amountPaid || 0);
    const saleBalance = Number(selectedSale.balance || 0);
  
    if (paid <= 0) {
      setError("Amount paid must be greater than zero");
      return;
    }
  
    if (paid > saleBalance) {
      setError("Amount paid cannot be greater than outstanding balance");
      return;
    }
  
    const newBalance = saleBalance - paid;
  
    const payload = {
  id: Date.now(),
  customerName: selectedCustomer.name,
  customerPhone: selectedCustomer.phone,
  saleSN: selectedSale.sn,
  amountPaid: Number(amountPaid || 0),
  balance: selectedSale.balance - Number(amountPaid || 0),
  status: "Pending", // ✅ ALWAYS START AS PENDING
  createdAt: new Date().toISOString(),
  attachments,
};

      
  
    onCreate(payload);
    setShowPopup(true);
  };
  

  const closePopup = () => {
    setShowPopup(false);
    setView("table");
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));
  };
  const formatDate = (date) => {
    if (!date) return "";
  
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replace(/ /g, "-");
  };
  const formatNumber = (value) =>
  new Intl.NumberFormat("en-NG").format(Number(value || 0));

  /* ===================== SUCCESS POPUP ===================== */
  if (showPopup) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={closePopup} className="delete-box">✕</div>
            <div className="popup-proceeed-wrapper">
              <span>Recovery successfully created</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ===================== UI ===================== */
  return (
    
    <div className="trip-modal">
      <div className="create-container-modal">
        <div className="create-container-card">

          <h2>Create Recovery</h2>
          <p>Select customer and sale</p>

          <div className="grid-2">
            {/* ================= CUSTOMER SELECT ================= */}
            <div className="form-group-select">
              <label>Customer</label>
              <div className="custom-select">
                <div className="custom-select-drop" onClick={() => setOpenCustomerSelect(!openCustomerSelect)}>
                  <div className="select-box">
                    {selectedCustomer ? (
                      <span>{selectedCustomer.name} - {selectedCustomer.phone} </span>
                    ) : (
                      <span className="placeholder">Select Customer</span>
                    )}
                  </div>
                  <ChevronDown className={openCustomerSelect ? "up" : "down"} />
                </div>
                {openCustomerSelect && (
                  <div className="select-dropdown">
                    {/* search input */}
                    <input
                      type="text"
                      placeholder="Search Customer..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="search-input"
                    />
                    {filteredCustomers.map(customer => (
                      <div
                        key={`${customer.name}-${customer.phone}`}
                        className="option-item"
                        onClick={() => {
                          setSelectedCustomer(customer); 
                          setSelectedSale(null);
                          setOpenCustomerSelect(false);
                          setCustomerSearch(""); // reset search
                        }}
                      > 
                        <div>{customer.name} - {customer.phone}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* ================= SALE SELECT ================= */}
            <div className="form-group-select">
              <label>Sale ID </label>
              <div className="custom-select">
                <div  className="custom-select-drop" onClick={() => selectedCustomer && setOpenSaleSelect(!openSaleSelect)}  >
                  <div className="select-box">
                    {selectedSale ? (
                      <span>{selectedSale.sn} - ₦{formatMoney(selectedSale.balance)}</span>
                    ) : (
                      <span className="placeholder">
                        {selectedCustomer
                          ? "Select Sale ID"
                          : "Select customer first"}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={openSaleSelect ? "up" : "down"}  />
                </div>

                {openSaleSelect && (
                  <div className="select-dropdown">
                    {customerSales.map(sale => (
                      <div
                        key={sale.sn}
                        className="option-item"
                        onClick={() => {
                          setSelectedSale(sale);
                          setOpenSaleSelect(false);
                        }}
                      >
                        <span>
                         {sale.sn} - ₦{formatMoney(sale.balance)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* ================= SALE DETAILS ================= */}
          {selectedSale && (
            <div className="grid-3">
            <div className="container-details">
            <div className="collapsed-container">
            <h4>Sale Details</h4> 
            <ChevronDown style={{cursor:"pointer"}} onClick={() => setCollapsedContainers(!collapsedContainers)}
            className={collapsedContainers ? "up" : "down"}/>
            </div> 
            {selectedSale.balance === 0 ? (
                <p style={{ color: "green" }}>Fully Paid</p>
              ) : (
                <ul className={collapsedContainers ? "" : "d-none"}>
                    <li>No Of Pallets: {formatNumber(selectedSale.noOfPallets)}</li>
                    <li>Customer Phone: {selectedSale.customer?.phone}</li>
                    <li>Total Sale Amount: ₦{formatMoney(selectedSale.totalSaleAmount)}</li>
                    <li>Payment to Date: ₦{formatMoney(selectedSale.amountPaid)}</li>
                    <li>Outstanding Balance: ₦{formatMoney(selectedSale.balance)}</li>
                    <li>Date Created: {formatDate(selectedSale.createdAt)}</li>
                </ul>
              )}
            </div>
            </div>
          )}

          {/* ================= RECOVERY SECTION & PAYMENT ================= */}
          <div className="grid-3">
            <div className="payment-header">
                <h5>Payment Details</h5>
            </div>
            <div className="grid-2" style={{background:"#fff",padding:"10px"}}>
            <div className="form-group">
                <label>Amount Paid</label>
                <input
  type="number"
  placeholder="Enter Amount Paid"
  value={amountPaid}
  min="0"
  onChange={(e) => {
    const value = Number(e.target.value || 0);

    if (selectedSale && value > selectedSale.balance) {
      setError("Amount paid cannot be more than outstanding balance");
      return;
    }

    setError("");
    setAmountPaid(value);
  }}
/>
{error && <small style={{ color: "red" }}>{error}</small>}

            </div>
            <div className="form-group">
                <label>Payment Date</label> 
                <input
  type="date"
  value={paymentDate}
  onChange={(e) => setPaymentDate(e.target.value)}
  style={{ color: "gray" }}
/>

            </div>
            </div>
            <div className="form-group">
            <label>Comment </label>
                <textarea name="" id="" ></textarea>
            </div>
            <section className="attachments">
            <input
  type="file"
  multiple
  hidden
  id="recovery-attachment"
  onChange={(e) => {
    const files = Array.from(e.target.files);

    const mappedFiles = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      file, // actual File object
    }));

    setAttachments((prev) => [...prev, ...mappedFiles]);
  }}
/>

<button
  type="button"
  className="attach-link"
  onClick={() => document.getElementById("recovery-attachment").click()}
>
  <Paperclip size={14} /> Attach File
</button>

            <div className="recent-files">
  {attachments.length === 0 && (
    <small style={{ color: "#999" }}>No attachments added</small>
  )}

  {attachments.map((f) => (
    <div key={f.id} className="file-row">
      <div>
        <div className="small-muted">{f.name}</div>
        <small>{(f.size / 1024).toFixed(1)} KB</small>
      </div>

      <div className="file-actions">
        <Trash2
          size={16}
          style={{ cursor: "pointer" }}
          onClick={() =>
            setAttachments((prev) => prev.filter(a => a.id !== f.id))
          }
        />
      </div>
    </div>
  ))}
</div>

          </section>
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="btn-row">
            <button className="cancel" onClick={() => setView("table")}>
              Cancel
            </button>
            <button
  className="create"
  disabled={
    !selectedCustomer ||
    !selectedSale ||
    !amountPaid ||
    amountPaid > selectedSale?.balance
  }
  onClick={handleCreateRecovery}
>
  Create Recovery
</button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateRecovery;
