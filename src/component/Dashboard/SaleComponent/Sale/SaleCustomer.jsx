import React, { useState } from "react";
import { CustomerService } from "../../../../services/Account/CustomerService";

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

  /* -------------------------
     HANDLE INPUT CHANGE
  -------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* -------------------------
     FIND CUSTOMER BY PHONE
  -------------------------- */
  const handlePhoneSearch = async (e) => {
    const value = e.target.value.trim();
    setPhone(value);

    if (!value) {
      setFoundCustomer(null);
      setShowAddCustomerFields(false);
      return;
    }

    try {
      const res = await CustomerService.list();
      const customers = res.data?.record?.data || [];

      const customer = customers.find(
        c => String(c.phone_no) === String(value)
      );

      if (!customer) {
        setFoundCustomer(null);
        setShowAddCustomerFields(true);
        return;
      }

const mapped = {
  id: customer.id,
  user_uuid: customer.user_uuid, // ✅ include UUID here
  name: `${customer.firstname} ${customer.lastname}`.trim(),
  email: customer.email,
  phone: customer.phone_no,
  address: customer.address,
};

    setFoundCustomer(mapped);
setShowAddCustomerFields(false);
onCustomerResolved(mapped);  
    } catch (err) {
      console.error(err);
      setShowAddCustomerFields(true);
    }
  };

  /* -------------------------
     CREATE CUSTOMER
  -------------------------- */
  const handleAddCustomer = async () => {
    if (!phone || !form.customerName || !form.customerEmail || !form.customerAddress) {
      setMessage("Please fill all customer fields");
      return;
    }

    const [firstname, ...rest] = form.customerName.trim().split(" ");
    const lastname = rest.join(" ") || "";

    try {
      const res = await CustomerService.create({
        firstname,
        lastname,
        email: form.customerEmail,
        phone_no: phone,
        address: form.customerAddress,
      });

      const raw = res.data?.data || res.data?.record || res.data;
      console.log('customer',res.data)
      const mapped = {
        id: raw.id,
        user_uuid: raw.user_uuid,
        name: `${raw.firstname} ${raw.lastname}`.trim(),
        email: raw.email,
        phone: raw.phone_no,
        address: raw.address,
      };

     setFoundCustomer(mapped);
setShowAddCustomerFields(false);
onCustomerResolved(mapped);  
      setMessage("Customer created successfully");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create customer");
    }
  };

  return (
    <div className="customer-section">
      <h4 className="title-text mb-4">Customer Details</h4>

      {/* PHONE INPUT */}
      <div className="grid-4" style={{ display: "flex", alignItems: "center",justifyContent:"center", gap: "20px" }}>
        <div className="form-group" style={{ flex: "4" }}>
          <input
            placeholder="Enter customer phone number"
            value={phone}
            onChange={handlePhoneSearch}
          />
        </div>

        {!foundCustomer && (
          <button
            type="button"
            className="create"
            onClick={() => setShowAddCustomerFields(true)}
          >
            Add Customer
          </button>
        )}
      </div>

      {/* FOUND CUSTOMER */}
      {foundCustomer && (
              <div className="customer-grid-3 mt-2">
              <div className="customer-details">
              <ul className="ul">
        <li>Name: {foundCustomer.name}</li>
        <li>Email: {foundCustomer.email}</li>
        <li>Address: {foundCustomer.address}</li>
      </ul>
              </div>
              </div>
            )}

            {showAddCustomerFields && !foundCustomer && (
              <div className="add-customer">
                <h5 className="mt-1 mb-2">Create New Customer</h5>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Name</label>
                    <input name="customerName" placeholder="Enter Customer Name" value={form.customerName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input name="customerEmail" placeholder="Enter Customer Email Address" value={form.customerEmail} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input name="customerAddress" placeholder="Enter Customer Address" value={form.customerAddress} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}
      {message && <small className="info-text">{message}</small>}
    </div>
  );
};

export default SaleCustomer;