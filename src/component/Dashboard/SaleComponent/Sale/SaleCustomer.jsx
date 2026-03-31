import React, { useState } from "react";
import { CustomerService } from "../../../../services/Account/CustomerService";
import { RecoveryServices } from "../../../../services/Sale/recovery"; // Imported RecoveryServices
import { X } from "lucide-react";

const SaleCustomer = ({ onCustomerResolved }) => {
  const [phone, setPhone] = useState("");
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [showAddCustomerFields, setShowAddCustomerFields] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerAddress: "",
  });
  const [message, setMessage] = useState(null);
  const [matchingCustomers, setMatchingCustomers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

/* ================= REFACTORED SEARCH LOGIC ================= */
  const handleCustomerSearch = async (e) => {
    const value = e.target.value;
    setPhone(value);
    setFoundCustomer(null);
    setForm({ customerName: "", customerEmail: "", customerAddress: "" });

    if (!value.trim()) {
      setShowAddCustomerFields(false);
      setMatchingCustomers([]);
      return;
    }

    try {
      const res = await RecoveryServices.getCustomer(value);
      
      // console.log("Search API Response:", res.data); 

      const matches = res.data?.customer || res.data?.record || [];

      if (Array.isArray(matches) && matches.length > 0) {
        setMatchingCustomers(matches);
        setShowAddCustomerFields(false);
      } else {
        setMatchingCustomers([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setMatchingCustomers([]);
    }
  };
  const handleAddCustomer = async () => {
    if (!phone || !form.customerName || !form.customerEmail || !form.customerAddress) {
      setMessage("Please fill all customer fields");
      return;
    }

    const nameParts = form.customerName.trim().split(/\s+/);
    if (nameParts.length < 2) {
      setMessage("Please enter both First and Last name");
      return;
    }

    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(" ");

    try {
      setMessage("Creating customer...");
      const res = await CustomerService.create({
        firstname,
        lastname,
        email: form.customerEmail,
        phone_no: phone,
        address: form.customerAddress,
      });

      const raw = res.data?.record || res.data?.data || res.data;
      handleSuccess(raw);
    } catch (err) {
      const backendMessage = err.response?.data?.message || "";
      if (backendMessage.toLowerCase().includes("taken") || backendMessage.toLowerCase().includes("exists")) {
        setMessage("Customer already exists. Fetching details...");
        handleCustomerSearch({ target: { value: phone } });
      } else {
        setMessage(backendMessage || "Failed to create customer");
      }
    }
  };

  const handleSuccess = (raw) => {
    const dataSource = raw?.data || raw?.record || raw;
    const mapped = {
      id: dataSource?.id || foundCustomer?.id,
      user_uuid: dataSource?.user_uuid || foundCustomer?.user_uuid,
      name: (dataSource?.firstname && dataSource?.lastname)
        ? `${dataSource.firstname} ${dataSource.lastname}`.trim()
        : form.customerName,
      email: dataSource?.email || form.customerEmail,
      phone: dataSource?.phone_no || phone,
      address: dataSource?.address || form.customerAddress,
    };
    setFoundCustomer(mapped);
    setShowAddCustomerFields(false);
    onCustomerResolved(mapped);
    setMessage("Customer created and selected successfully");
  };

  return (
    <div className="customer-section">
      {message && (
        <div className="trip-card-popup">
          <div className="trip-card-popup-container">
            <div className="popup-content">
              <div onClick={() => setMessage(null)} className="delete-box">✕</div>
              <div className="popup-proceeed-wrapper">
                <span>{message}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <h4 className="title-text mb-4">Customer Details</h4>

      <div className="grid-4" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <div className="form-group" style={{ flex: "4", position: "relative" }}>
          <input 
            placeholder="Search customer by phone or name"
            value={phone}
            onChange={handleCustomerSearch}
          />

          {matchingCustomers.length > 0 && (
            <div className="customer-dropdown">
              {matchingCustomers.map((c) => (
                <div
                  key={c.user_uuid}
                  className="customer-option"
                  onClick={() => {
                    const mapped = {
                      id: c.id,
                      user_uuid: c.user_uuid,
                      name: `${c.firstname} ${c.lastname}`,
                      email: c.email,
                      phone: c.phone_no,
                      address: c.address,
                    };
                    setFoundCustomer(mapped);
                    onCustomerResolved(mapped);
                    setMatchingCustomers([]);
                    setPhone(`${c.firstname} ${c.lastname}`); // Set input to the selected name
                  }}
                >
                  {c.firstname} {c.lastname} — {c.phone_no}
                </div>
              ))}
            </div>
          )}
        </div>

        {!foundCustomer && (
          <button type="button" className="create" onClick={() => setShowAddCustomerFields(true)}>
            Add Customer
          </button>
        )}
      </div>

      {foundCustomer && (
        <div className="customer-grid-3 mt-2">
          <div className="customer-details">
            <ul className="ul">
              <li><strong>Name:</strong> {foundCustomer.name}</li>
              <li><strong>Email:</strong> {foundCustomer.email}</li>
              <li><strong>Address:</strong> {foundCustomer.address}</li>
            </ul>
            <button 
                className="mt-2 text-sm text-red-500 underline" 
                onClick={() => {setFoundCustomer(null); setPhone("");}}
            >
                Change Customer
            </button>
          </div>
        </div>
      )}

      {showAddCustomerFields && !foundCustomer && (
        <div className="add-customer">
          <h5 className="mt-1 mb-2">Create New Customer</h5>
          <div className="grid-2">
            <div className="form-group">
              <label>Full Name</label>
              <input name="customerName" placeholder="Enter First and Last Name" value={form.customerName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="customerEmail" type="email" placeholder="email@example.com" value={form.customerEmail} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input name="customerAddress" placeholder="Enter Customer Address" value={form.customerAddress} onChange={handleChange} />
            </div>
          </div>
          <div className="btn-row mt-3" style={{ justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="create" style={{ padding: '8px 15px' }} onClick={() => setShowAddCustomerFields(false)}>
              Cancel
            </button>
            <button type="button" className="cancel" style={{ padding: '8px 20px' }} onClick={handleAddCustomer}>
              Create Customer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleCustomer;