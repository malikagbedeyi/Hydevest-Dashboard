import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/create.scss";
import { ChevronDown, Paperclip, Trash2 } from "lucide-react";
import { RecoveryServices } from "../../../../services/Sale/recovery";

const CreateRecovery = ({ setView, onCreate }) => {

  /* ===================== STATE ===================== */

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerSales, setCustomerSales] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [openCustomerSelect, setOpenCustomerSelect] = useState(false);
  const [openSaleSelect, setOpenSaleSelect] = useState(false);
  const [amountPaid, setAmountPaid] = useState("");
  const [amountPaidRaw, setAmountPaidRaw] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(customerSearch);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); 
  const [creating, setCreating] = useState(false);
const [availablePayments] = useState(["Cash", "Transfer"]);
  const [openPaymentDropdown, setOpenPaymentDropdown] = useState(false);
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attachments, setAttachments] = useState([]);
  const [collapsedContainers, setCollapsedContainers] = useState(false);
const [popup, setPopup] = useState({open: false,type: "", message: ""});



  /* ===================== CUSTOMER SEARCH ===================== */

  useEffect(() => {

  const timer = setTimeout(() => {
    setDebouncedSearch(customerSearch);
  }, 500);

  return () => clearTimeout(timer);

}, [customerSearch]);

useEffect(() => {
  if (!debouncedSearch) {
    setCustomers([]);
    return;
  }
  const fetchCustomers = async () => {

    try {
setLoadingCustomer(true);
      const res = await RecoveryServices.getCustomer(customerSearch);
setLoadingCustomer(false);
      const customer = res?.data?.customer;

      if (!customer) {
        setCustomers([]);
        return;
      }

      setCustomers([{
        uuid: customer.user_uuid,
        name: `${customer.firstname} ${customer.lastname}`,
        phone: customer.phone_no
      }]);

    } catch (err) {

      console.error("Customer fetch failed", err);
      setCustomers([]);

    }

  };

  fetchCustomers();
}, [customerSearch,debouncedSearch]);



  /* ===================== FETCH SALES BY CUSTOMER ===================== */

  useEffect(() => {

    if (!selectedCustomer?.uuid) return;

    const fetchCustomerSales = async () => {

      try {

        const res = await RecoveryServices.getCustomerSales(selectedCustomer.uuid);
        const records = res?.data?.record || [];
        const mapped = records.map((sale, idx) => ({

          ...sale,
          sn: idx + 1,
          balance:
            Number(sale.total_sale_amount || 0) -
            Number(sale.amount_paid || 0) ,
          noOfPallets: sale.presale?.total_no_of_pallets || 0,
          customer: {
            phone: selectedCustomer.phone
          },
          totalSaleAmount: sale.total_sale_amount,
          amountPaid: sale.amount_paid,
          createdAt: sale.created_at

        }));

        setCustomerSales(mapped);

      } catch (err) {

        console.error("Failed to load customer sales", err);
        setCustomerSales([]);

      }

    };

    fetchCustomerSales();

  }, [selectedCustomer]);
const handleKeyDown = (e) => {

  if (e.key === "ArrowDown") {
    setHighlightIndex((prev) => Math.min(prev + 1, customers.length - 1));
  }

  if (e.key === "ArrowUp") {
    setHighlightIndex((prev) => Math.max(prev - 1, 0));
  }

  if (e.key === "Enter") {
    const customer = customers[highlightIndex];
    if (customer) {
      setSelectedCustomer(customer);
      setOpenCustomerSelect(false);
    }
  }

};

  /* ===================== CREATE RECOVERY ===================== */

  const handleCreateRecovery = async () => {

    if (!selectedCustomer || !selectedSale) return;
    const paid = Number(amountPaidRaw || 0); 
    const saleBalance = Number(selectedSale.balance || 0);

    if (paid <= 0) {
      showError("Amount paid must be greater than zero");
      return;
    }

    if (paid > saleBalance) {
      showError("Amount paid cannot be greater than outstanding balance");
      return;
    }

  let payload;

if (attachments.length > 0) {
  payload = new FormData();

  payload.append("customer_uuid", selectedCustomer.uuid);
  payload.append("sale_uuid", selectedSale.sale_uuid);
  payload.append("amount", paid);
  payload.append("payment_date", paymentDate);
  payload.append("comment", "");
  payload.append("payment_method", paymentMethod || "Cash");

  attachments.forEach((file) => {
    payload.append("attachment", file.file);
  });

} else {

  payload = {
    customer_uuid: selectedCustomer.uuid,
    sale_uuid: selectedSale.sale_uuid,
    amount: paid,
    payment_date: paymentDate,
    comment: "",
    payment_method: paymentMethod || "Cash"
  };

}
try {
  console.log("Sending recovery payload:");
  
setCreating(true);
const res = await RecoveryServices.create(payload);
  setCreating(false);
  if (res?.data?.success) {
    const message = res?.data?.message || "Recovery created successfully";

    showSuccess(message);
  } else {
    showError(
      res?.data?.message ||
      res?.data?.error ||
      "Failed to create recovery"
    );

  }

} catch (err) {

  console.error("Create recovery failed");

  if (err.response) {

    console.log("Status:", err.response.status);
    console.log("Backend message:", err.response.data);

    showError(
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Backend rejected the request"
    );

  } else {

    showError("Network error. Please check your connection.");

  }

}
  };


  /* ===================== RESET AFTER SUCCESS ===================== */
const showSuccess = (message) => {
  setPopup({
    open: true, type: "success", message
  });
setTimeout(() => {
  closePopup("success");
}, 3000);

}
const showError = (message) => {
  setPopup({
    open: true,
    type: "error",
    message
  });
};

const closePopup = (type) => {
  setPopup({ open: false, type: "", message: "" });

if (type === "success") {
  onCreate(); 
  setView("table");
  setSelectedCustomer(null);
  setSelectedSale(null);
  setAmountPaid("");
  setAmountPaidRaw("");
  setAttachments([]);
  setCustomerSales([]);
  setCustomers([]);
}
};

  /* ===================== HELPERS ===================== */

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value || 0));

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-NG").format(Number(value || 0));

  const formatDate = (date) => {

    if (!date) return "";

    return new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
      .replace(/ /g, "-");

  };


  /* ===================== SUCCESS POPUP ===================== */

  /* ===================== UI ===================== */

  return (

    <div className="trip-modal">

       {popup.open && (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={closePopup} className="delete-box">✕</div>
            <div className="popup-proceeed-wrapper">
              <span style={{ color: popup.type === "error" ? "#d32f2f" : "#2e7d32" }}>
                {popup.message}
              </span>
            </div>
          </div>
        </div>
      </div>
    )}
      <div className="create-container-modal">
        <div className="create-container-card">
          <div className="tab-section">
          <h2 >Create Recovery</h2>
          <p>Select customer and sale</p>

          {/* ================= CUSTOMER SELECT ================= */}
          <div className="grid-2">
            <div className="form-group-select">

              <label>Customer</label>

              <div className="custom-select">

                <div
                  className="custom-select-drop"
                  onClick={() => {  setOpenCustomerSelect(!openCustomerSelect);
                    if (!customers.length) {setCustomerSearch(""); }}}>

                  <div className="select-box">

                    {selectedCustomer ? (
                      <span>
                        {selectedCustomer.name} - {selectedCustomer.phone}
                      </span>
                    ) : (
                      <span className="placeholder">Select Customer</span>
                    )}

                  </div>
                  <ChevronDown className={openCustomerSelect ? "up" : "down"}  />

                </div>

                {openCustomerSelect && (

                  <div className="select-dropdown">

                    <input
                      type="text"
                      placeholder="Search customer by phone number"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="search-input"
                      onKeyDown={handleKeyDown}
                    />
                    {loadingCustomer && ( <div className="option-item">Searching...</div>)}
                    {!loadingCustomer && customers.length === 0 && debouncedSearch && (
                      <div className="option-item">Customer not found</div>)}
                    {customers.map((customer) => (
                      <div
                        key={customer.uuid}
                        className="option-item"
                        onClick={() => {
                          setSelectedCustomer(customer);
setCustomerSearch("");
setOpenCustomerSelect(false);
setCustomers([]);
                        }}
                      >
                        {customer.name} - {customer.phone}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* ================= SALE SELECT ================= */}
              <div className="form-group-select">
                <label>Sale ID</label>
                <div className="custom-select">
                  <div className="custom-select-drop"
                    onClick={() => selectedCustomer && setOpenSaleSelect(!openSaleSelect)} >
                    <div className="select-box">
                      {selectedSale ? (
                        <span>
                          {selectedSale.sale_unique_id} - ₦{formatMoney(selectedSale.balance)}
                        </span>

                      ) : (

                        <span className="placeholder">

                          {selectedCustomer
                            ? "Select Sale ID"
                            : "Select customer first"}

                        </span>

                      )}

                    </div>

                    <ChevronDown className={openSaleSelect ? "up" : "down"} />
                  </div>

                  {openSaleSelect && (
                    <div className="select-dropdown">
                      {customerSales.map((sale) => (
                        <div  key={sale.sale_uuid} className="option-item"onClick={() => {
                            setSelectedSale(sale); setOpenSaleSelect(false);}} >
                          {sale.sale_unique_id} - ₦{formatMoney(sale.balance)}
                        </div>
                      ))}
                    </div>

                )}
              </div>
            </div>
          </div>

          {/* ================= SALE DETAILS ================= */}

          {selectedSale && (
            <div className="sale-grid-3">
              <div className="container-details">
                <div className="collapsed-container">
                  <h4>Sale Details</h4>
                  <ChevronDown  className={collapsedContainers ? "up" : "down"}
                    style={{ cursor: "pointer" }}
                    onClick={() => setCollapsedContainers(!collapsedContainers)}
                  />
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


          {/* ================= PAYMENT SECTION ================= */}

          <div className="sale-grid-3">

            <div className="payment-header">
              <h5>Payment Details</h5>
            </div>

            <div className="grid-2" style={{ background: "#fff", padding: "10px" }}>
             <div className="form-group">
  <label>Amount Paid</label>
  <input
    type="text"
    placeholder="Enter Amount Paid"
    value={amountPaidRaw.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
    onChange={(e) => {
      const raw = e.target.value.replace(/,/g, "");
      const numberValue = Number(raw);

      if (isNaN(numberValue)) return;

      if (selectedSale && numberValue > selectedSale.balance) {
        showError("Amount paid cannot be greater than outstanding balance");
        return;
      }

      setAmountPaidRaw(numberValue);
    }}
  />
</div>

              <div className="form-group">

                <label>Payment Date</label>

                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />

              </div>
<div className="form-group-select ">
  <label>Payment Method</label>

  <div className="custom-select">
    <div className="custom-select-drop" onClick={() => setOpenPaymentDropdown(prev => !prev)}>
      <div className="select-box">
        {paymentMethod ? (
          <span>{paymentMethod}</span>
        ) : (
          <span className="placeholder">Select Method</span>
        )}
      </div>
      <div className="custom-select-icon">
        <ChevronDown className={openPaymentDropdown ? "up" : "down"} />
      </div>
    </div>

    {openPaymentDropdown && (
      <div className="select-dropdown">
        {availablePayments.map((method) => (
          <span
            key={method}
            className="option-item"  style={{padding:"10px"}}
            onClick={() => {
              setPaymentMethod(method);
              setOpenPaymentDropdown(false);
            }}
          >
            {method}
          </span>
        ))}
      </div>
    )}
  </div>
</div>
            {/* ================= COMMENT ================= */}
            <div className="form-group">

              <label>Comment</label>

              <textarea />

            </div>
            </div>


            {/* ================= ATTACHMENTS ================= */}

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
                    file
                  }));

                  setAttachments((prev) => [...prev, ...mappedFiles]);

                }}
              />

              <button
                type="button"
                className="attach-link"
                onClick={() =>
                  document.getElementById("recovery-attachment").click()
                }
              >

                <Paperclip size={14} /> Attach File

              </button>


              <div className="recent-files">

                {attachments.length === 0 && (
                  <small style={{ color: "#999" }}>
                    No attachments added
                  </small>
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
                          setAttachments((prev) =>
                            prev.filter((a) => a.id !== f.id)
                          )
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

            <button
              className="cancel"
              onClick={() => setView("table")}
            >
              Cancel
            </button>

<button
  className="create"
  disabled={
    creating ||
    !selectedCustomer ||
    !selectedSale ||
    !amountPaidRaw ||
    amountPaidRaw > selectedSale?.balance
  }
  onClick={handleCreateRecovery}
>
  {creating ? "Creating..." : "Create Recovery"}
</button>

          </div>

        </div>
        </div>
      </div>
    </div>
  );

};

export default CreateRecovery;