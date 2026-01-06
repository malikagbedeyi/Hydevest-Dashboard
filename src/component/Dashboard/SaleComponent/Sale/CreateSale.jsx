import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/Sale/createPresale.scss";
import { X, ChevronDown, Plus } from "lucide-react";
import { SaleContainerData } from "../../PurchaseComponent/container/ContainerData";
import SaleItemsTable from "./SaleItemsTable";

const CUSTOMERS_KEY = "customers_data";

const CreateSale = ({ preSales = [], sales, setSales, setView, data, onCreate }) => {
  const [editingRow, setEditingRow] = useState(null);
  const [searchContainer, setSearchContainer] = useState("");
  const [searchPresale, setSearchPresale] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedValues2, setSelectedValues2] = useState([]);
  const [selectedValues3, setSelectedValues3] = useState([]);
  const [openContainerSelect, setOpenContainerSelect] = useState(false);
  const [openPresaleSelect, setOpenPresaleSelect] = useState(false);
  const [salePop, setSalePop] = useState(false);
  const [activeContainerId, setActiveContainerId] = useState(null); 
  const [openContainerDropdowns, setOpenContainerDropdowns] = useState({});
const [palletContainers, setPalletContainers] = useState({});
  const [containerSales, setContainerSales] = useState({});
  const [collapsedContainers, setCollapsedContainers] = useState({});
  const [openPalletDropdowns, setOpenPalletDropdowns] = useState({});
  const activeContainer = containerSales[activeContainerId];  
  const dynamicContainerOptions = selectedValues;
  const selectedContainerName = dynamicContainerOptions.find(c => c.id === activeContainerId)?.name || "";

  const [form, setForm] = useState({
    presaleId: "", container: "",noOfPallets: "", saleOption: "", wcPieces: "",
    customerPhone: "", customerName: "", customerLocation: "", customerAddress: "", 
    noOfPalletInput: "", saleAmount: "", totalSaleAmount: "", depositAmount: "", 
    pallets: [],
  });
  useEffect(() => {
    if (selectedValues.length === 0) return;
  
    setContainerSales(prev => {
      const updated = { ...prev };
  
      selectedValues.forEach(container => {
        const containerId = container.id; // ✅ DEFINE IT HERE
  
        if (!updated[containerId]) {
          updated[containerId] = {
            container: {
              id: container.id,
              name: container.name,
            },
            pallets: [],
          };
        }
      });
  
      return updated;
    });
  
    // Set first container as active by default
    if (!activeContainerId) {
      setActiveContainerId(selectedValues[0].id);
    }
  
    // Auto-open first container
    if (selectedValues.length > 0) {
      setCollapsedContainers({ [selectedValues[0].id]: true });
    }
  }, [selectedValues]);
  
  const handlePalletChange = (index, field, value) => {
    const updated = [...form.pallets];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, pallets: updated }));
  };
  const addPallet = (containerId = activeContainerId) => {
    if (!containerId) return;
  
    setForm(prev => ({
      ...prev,
      pallets: [
        ...prev.pallets,
        {
          id: crypto.randomUUID(),
          pieces: "",
          saleAmount: "",
          palletOption: "",
          containerId,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  };
  
  
  const removeAddSale = (index) => {
      const updated = form.pallets.filter((_, i) => i !== index);
      setForm(prev => ({ ...prev, pallets: updated }));
      if (updated.length === 0) setSalePop(false);
    };
  const toggleContainerDropdown = (index) => {
    setOpenContainerDropdowns(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const tableSaleItems = selectedValues.flatMap(container => {
    const cSales = containerSales[container.id];
    if (!cSales) return [];
    return cSales.pallets.map(p => ({
      palletId: p.id,
      containerId: container.id,
      containerName: container.name,
      ...p,
    }));
  });

  const toggleCollapsedContainer = (id) => {
    setCollapsedContainers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleSaveSaleItems = () => {
    if (!form.pallets.length) return;
  
    setContainerSales(prev => {
      const updated = { ...prev };
  
      form.pallets.forEach((pallet) => {
        const containerId = pallet.containerId || activeContainerId;
        if (!containerId) return;
      
        if (!updated[containerId]) {
          const containerObj = selectedValues.find(c => c.id === containerId);
          updated[containerId] = {
            container: containerObj || { id: containerId, name: "Unknown Container" },
            pallets: [],
          };
        }
      
        const exists = updated[containerId].pallets.some(p => p.id === pallet.id);
        if (!exists) {
          updated[containerId].pallets.push({
            ...pallet,
            total: totalPurchase(pallet),
          });
        } else {
          // Update existing pallet
          updated[containerId].pallets = updated[containerId].pallets.map(p =>
            p.id === pallet.id ? { ...p, ...pallet, total: totalPurchase(pallet) } : p
          );
        }
      });
      
      return updated;
    });
  
    setForm(prev => ({ ...prev, pallets: [] }));
    setSalePop(false);
    setEditingRow(null);
  };
const handleEditSaleItem = (row) => {
  const palletData = containerSales[row.containerId].pallets.find(
    (p) => p.id === row.palletId
  );

  if (!palletData) return;

  setForm(prev => ({
    ...prev,
    pallets: [{
      ...palletData,
    }],
  }));  

  setActiveContainerId(row.containerId);
  setSalePop(true);
  setEditingRow({ containerId: row.containerId, palletIndex: containerSales[row.containerId].pallets.findIndex(p => p.id === row.palletId) });
};
const totalPurchase = (pallet) => {
  const pieces = parseFloat(pallet.pieces) || 0;          
  const saleAmount = parseFloat(pallet.saleAmount) || 0;
  const price = parseFloat(pallet.palletOption) || 0;     

  return pieces * saleAmount * price;                     
};
const handleDeleteSaleItem = (row) => {
  setContainerSales(prev => {
    const updated = { ...prev };

    updated[row.containerId].pallets =
      updated[row.containerId].pallets.filter(
        p => p.id !== row.palletId
      );

    return updated;
  });
};
const totalSaleAmount = tableSaleItems.reduce(
  (sum, item) => sum + (Number(item.total) || 0),
  0
);
const balance = amountPaid >= totalSaleAmount
    ? 0 : totalSaleAmount - amountPaid;
const balanceLabel =
  amountPaid >= totalSaleAmount ? "Fully Paid" : balance;

const calculateTotals = (pallets) => {
  if (!pallets || pallets.length === 0) {
    return { pieces: 0, pallets: 0, totalPalletOption: 0, amount: 0 };
  }
  const totalPieces = pallets.reduce(
    (sum, p) => sum + (parseFloat(p.pieces) || 0),
    0
  );
  const totalPallets = pallets.reduce(
    (sum, p) => sum + (parseFloat(p.saleAmount) || 0),
    0
  );
  const totalPalletOption = pallets.reduce(
    (sum, p) => sum + (parseFloat(p.palletOption) || 0),
    0
  );
  const totalAmount = pallets.reduce(
    (sum, p) => sum + totalPurchase(p),  
    0
  );
  return {
    pieces: totalPieces,
    pallets: totalPallets,
    totalPalletOption: totalPalletOption,
    amount: totalAmount,
  };
};
const totalPalletCount = Object.values(containerSales).reduce(
  (sum, c) => sum + c.pallets.reduce(
    (s, p) => s + (Number(p.saleAmount) || 0), 0
  ),
  0
);

const totalPurchasePricePerPiece = Object.values(containerSales).reduce(
  (sum, c) => sum + c.pallets.reduce(
    (s, p) => s + (Number(p.pieces) || 0), 0
  ),
  0
);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value);

  const [customers, setCustomers] = useState(() => {
    return JSON.parse(localStorage.getItem(CUSTOMERS_KEY)) || [];
  });

  const [foundCustomer, setFoundCustomer] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showAddCustomerFields, setShowAddCustomerFields] = useState(false);

  const filterContainers = SaleContainerData.filter((item) =>
    item.name.toLowerCase().includes(searchContainer.toLowerCase())
  ).slice(0, 5);

  const toggleSelect = (item) => {
    setSelectedValues((prev) => {
      const exists = prev.some((v) => v.id === item.id);
      if (exists) return prev.filter((v) => v.id !== item.id);
  
      // Only keep serializable properties
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          containerID: item.containerID,
          totalPieces: item.totalPieces,
          netWeight: item.netWeight,
          maxWeight: item.maxWeight,
          grossWeight: item.grossWeight,
          netValue: item.netValue,
          WarehouseArrivalDat: item.WarehouseArrivalDat,
        },
      ];
    });
  }; 
  const filteredPresales = preSales
    .filter((p) => p && p.sn && p.sn.toString().includes(searchPresale))
    .slice(0, 10);

  const handlePresaleSelect = (presale) => {
    setSelectedValues2([presale.sn]); // display S/N in the selected box
    setForm((prev) => ({
      ...prev,
      presaleId: presale.sn,           // store S/N in the form
      noOfPallets: presale.noOfPallets || "",
      saleOption: presale.saleOption || "",
      wcPieces: presale.wcPieces || "",
    }));
    setOpenPresaleSelect(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleCustomerPhone = (e) => {
    const phone = e.target.value;
    setForm((prev) => ({ ...prev, customerPhone: phone }));

    const customer = customers.find((c) => c.phone === phone);
    setFoundCustomer(customer || null);
    setShowAddCustomerFields(!customer);
  };
  const handleAddCustomer = () => {
    if (!form.customerName || !form.customerPhone || !form.customerLocation || !form.customerAddress) {
      setSuccessMessage("Please fill all customer fields");
      return null;
    }
  
    const existingCustomer = customers.find(c => c.phone === form.customerPhone);
  
    if (existingCustomer) {
      setFoundCustomer(existingCustomer);
      setShowAddCustomerFields(false);
      return existingCustomer; // <-- return the object, not true
    }
  
    const newCustomer = {
      phone: form.customerPhone,
      name: form.customerName,
      location: form.customerLocation,
      address: form.customerAddress,
    };
  
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updatedCustomers));
  
    setFoundCustomer(newCustomer);
    setShowAddCustomerFields(false);
    setSuccessMessage("Customer added successfully!");
  
    return newCustomer; // <-- always return object
  };
  
  const togglePalletDropdown = (index) => {
    setOpenPalletDropdowns(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
 
  const handleCreate = (customer = foundCustomer) => {
    if (!form.presaleId) return setSuccessMessage("Please select a Container");
    if (!customer) return setSuccessMessage("Please add or select a customer");
    
    const hasAnyPallet = Object.values(containerSales).some(c => c.pallets.length > 0);
    if (!hasAnyPallet) return setSuccessMessage("Please save at least one sale item");

    if (customer instanceof Event) {
      console.error("Event leaked into handleCreate:", customer);
      return;
    }
    
    const cleanContainers = Object.values(containerSales).map(c => ({
      containerId: c.container.id,
      name: c.container.name,
      pallets: c.pallets.map(p => ({
        id: p.id,
        pieces: Number(p.pieces),
        saleAmount: Number(p.saleAmount),
        palletOption: Number(p.palletOption),
        createdAt: p.createdAt,
        total: Number(p.total),
      })),
      totals: {
        pieces: Number(calculateTotals(c.pallets).pieces),
        pallets: Number(calculateTotals(c.pallets).pallets),
        totalPalletOption: Number(calculateTotals(c.pallets).totalPalletOption),
        amount: Number(calculateTotals(c.pallets).amount),
      },
    }));
    const newSale = {
      id: Date.now(),
      presaleId: form.presaleId,
      totalSaleAmount,
      amountPaid,
      balance,
      noOfPallets: totalPalletCount,
      purchasePricePerPiece: totalPurchasePricePerPiece,
      customer: {
        name: customer.name,
        phone: customer.phone,
        location: customer.location,
        address: customer.address,
      },
    
      containers: cleanContainers,
      createdAt: new Date().toISOString(),
    };
    console.log("New Sale:", newSale);
    onCreate(newSale);
    setSuccessMessage("Sale successfully created!");
    setTimeout(() => {
      setSuccessMessage(null);
      setView("table");
    }, 2000);
  };
  const handleSalePop = () => {
    setSalePop(!salePop);
  };
  const closePopup = () => setSuccessMessage(null);

  const handleClick = () => {
    let customer = foundCustomer;
  
    if (!customer) {
      const addedCustomer = handleAddCustomer();
      if (!addedCustomer) return;
      customer = addedCustomer;
    }
  
    handleCreate(customer);
  };
  

  if (successMessage) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={closePopup} className="delete-box">✕</div>
            <div className="popup-proceeed-wrapper">
              <span>{successMessage}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="trip-modal">
      <div className="create-container-modal">
        <div className="create-container-card">
          <div className="header">
            <h2>Create Sale</h2>
            <X
              size={18}
              className="close"
              onClick={() => setView(sales && sales.length > 0 ? "table" : "empty")}
            />
          </div>
          <div className="tab-section">
             {/* Container & Pre-Sale dropdowns */}
          <div className="">
            <p>Enter the details of new Sale</p>
            <div className="grid-2">
              {/* Container Multi-select */}
              <div className="form-group-select">
                <label>Container</label>
                <div className="custom-select">
                  <div className="custom-select-drop">
                    <div className="select-box">
                      {selectedValues.length === 0 ? (
                        <span className="placeholder">Select Container(s)</span>
                      ) : (
                        <div className="selected-tags">
                          {selectedValues.map((item) => (
                            <span className="tag" key={item.id}>{item.name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div
                      className="custom-select"
                      onClick={() => setOpenContainerSelect(!openContainerSelect)}
                    >
                      <ChevronDown className={openContainerSelect ? "up" : "down"} />
                    </div>
                  </div>
                  <div className={openContainerSelect ? "select-dropdown" : "d-none"}>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchContainer}
                      onChange={(e) => setSearchContainer(e.target.value)}
                      className="search-input"
                    />
                    <div className="option">
                      {filterContainers.map((item) => {
                        const checked = selectedValues.some((v) => v.id === item.id);
                        return (
                          <label key={item.id} onClick={() => setOpenContainerSelect(false)}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleSelect(item)}
                            />
                            <span>{item.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-sale Dropdown */}
             <div className="form-group-select">
  <label>Pre-Sale ID</label>
  <div className="custom-select">
    <div className="custom-select-drop">
      <div className="select-box">
        {selectedValues2.length === 0 ? (
          <span className="placeholder">Select Pre-sale ID</span>
        ) : (
          <div className="selected-tags">
            <span>{selectedValues2[0]}</span>
          </div>
        )}
      </div>
      <div
        className="custom-select"
        onClick={() => setOpenPresaleSelect(!openPresaleSelect)}
      >
        <ChevronDown className={openPresaleSelect ? "up" : "down"} />
      </div>
    </div>

   <div className={openPresaleSelect ? "select-dropdown" : "d-none"}>
  <input
    type="text"
    placeholder="Search Pre-sale ID"
    value={searchPresale}
    onChange={(e) => setSearchPresale(e.target.value)}
    className="search-input"
  />
  <div className="option">
    {filteredPresales.length > 0 ? (
      filteredPresales.map((p) => (
        <label key={p.id} onClick={() => handlePresaleSelect(p)}>
          <span>{p.sn}</span> {/* Show S/N here */}
        </label>
      ))
    ) : (
      <span style={{ padding: "5px", display: "block" }}>No Pre-sale IDs found</span>
    )}
  </div>
</div>

  </div>
</div>
            </div>
            {/* Container Details */}
           {selectedValues.length > 0 && (
  <div className="grid-3">
    {selectedValues.map((container) => (
      <div key={container.id} className="container-details">
        <div className="collapsed-container">
        <h4>Pre-sale Details </h4>
        <ChevronDown
  onClick={() => toggleCollapsedContainer(container.id)}
  className={collapsedContainers[container.id] ? "up" : "down"}/>
</div>
<ul className={collapsedContainers[container.id] ? "" : "d-none"}>
          <li>Container ID: {container.containerID}</li>
          <li>Total Pieces: {container.totalPieces}</li>
          <li>Total Pallet: {form.noOfPallets}</li>
          <li> Available Pallet: {container.netWeight}</li>
          <li>Price Per Pieces: {container.maxWeight}</li>
          <li>Gross Weight: {container.grossWeight}</li>
          <li>Net Value: {container.netValue}</li>
          <li>Arrival Date: {container.WarehouseArrivalDat}</li>
          <li>Pallet Pieces : {form.wcPieces} </li>
        </ul>
      </div>
    ))}
  </div>
)}
              </div>
            {/* Customer Section */}
            <div className="">
            <h4 className="mb-4" style={{marginTop:""}} >Customer Details</h4>
            <div className="customer-header">
              <div className="grid-4" style={{ display: "flex", alignItems: "center",justifyContent:"center", gap: "20px" }}>
                <div className="form-group" style={{ flex: "4" }}>
                  <input
                    name="customerPhone"
                    value={form.customerPhone}
                    onChange={handleCustomerPhone}
                    placeholder="Enter customer phone number"
                  />
                </div>
                <div style={{ flex: "1" }}>
                  {!foundCustomer && (
                    <button
                      type="button"
                      className="create-customer"
                      onClick={() => setShowAddCustomerFields(true)}
                    >
                      Add Customer
                    </button>
                  )}
                </div>
              </div>
            </div>

            {foundCustomer && (
              <div className="grid-3 mt-2">
              <div className="customer-details">
                <ul>
                  <li>Name: {foundCustomer.name}</li>
                  <li>State: {foundCustomer.location}</li>
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
                    <input name="customerName" value={form.customerName} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input name="customerLocation" value={form.customerLocation} onChange={handleChange} />
                  </div>
                </div>
                <div className="grid-3">
                <div className="form-group">
                    <label>Address</label>
                    <input name="customerAddress" value={form.customerAddress} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}
            </div>
            {/* Sale Details */}
            <div className="sale-details">
  {/* Header */}
  <div className="sale-header-details">
      <>
        <h3>Sale Details</h3>
        <button
          type="button"
          className="add-item-btn"
          onClick={() => {
            if (!activeContainerId && selectedValues.length > 0) {
              setActiveContainerId(selectedValues[0].id);
            }
            setForm(prev => ({
              ...prev,
              pallets: prev.pallets.length ? prev.pallets : [
                { pieces: "", saleAmount: "", palletOption: "" }
              ],
            }));
          
            setSalePop(true);
          }}
          
        >
          <Plus size={16} /> Add Item
        </button>
      </>
  </div>

  {/* ================= ADD SALE POPUP ================= */}
  <div className={salePop ? "add-sale-popup" : "d-none"}>
    <div className="popup-overlay"></div>

    <div className="add-sale-content">
      <X size={18} className="close" onClick={() => setSalePop(false)} />

      <div className="sale-pallet-section">
        <div className="header">
          <h5>Add Sale</h5>
          <button type="button" onClick={addPallet}>Add More</button>
        </div>

        {form.pallets.map((pallet, index) => (
          <div key={index}>
            <div className="grid-5">
            {dynamicContainerOptions.length > 1 && (
  <div className="sale-grid">
    <div className="form-group-select-sale mt-2">
      <label>View Container</label>
      <div className="custom-select">
      <div
  className="custom-select-drop"
  onClick={() => toggleContainerDropdown(index)}
>
  <div className="select-box">
    {palletContainers[index] ? (
      <span>
        {dynamicContainerOptions.find(
          c => c.id === palletContainers[index]
        )?.name}
      </span>
    ) : (
      <span className="placeholder">Select Container</span>
    )}
  </div>
  <ChevronDown
    className={openContainerDropdowns[index] ? "up" : "down"}
  />
</div>

{openContainerDropdowns[index] && (
  <div className="select-dropdown-sale">
    {dynamicContainerOptions.map(container => (
      <span
        key={container.id}
        onClick={() => {
          setPalletContainers(prev => ({
            ...prev,
            [index]: container.id,
          }));
          setActiveContainerId(container.id);
          setOpenContainerDropdowns(prev => ({
            ...prev,
            [index]: false,
          }));
        }}
      >
        {container.name}
      </span>
    ))}
  </div>
)}

      </div>
    </div>
  </div>
)}
            <div className="form-group">
                <label>Purchase Price (Per Pieces)</label>
                <input
                  value={pallet.pieces}
                  onChange={(e) =>
                    handlePalletChange(index, "pieces", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>No Of Pallet Purchased</label>
                <input
                  type="number"
                  value={pallet.saleAmount}
                  onChange={(e) =>
                    handlePalletChange(index, "saleAmount", e.target.value)
                  }
                />
              </div>
            <div className="form-group-select">
                <label>Pallet Distribution</label>

                <div className="sale-custom-select">
                  <div className="custom-select-drop">
                    <div className="select-box">
                      {pallet.palletOption || (
                        <span className="placeholder">Pallet Option</span>
                      )}
                    </div>
                    <div className="" onClick={() => togglePalletDropdown(index)}  >
                      <ChevronDown
                        className={openPalletDropdowns[index] ? "up" : "down"}
                      />
                    </div>
                  </div>
                  {openPalletDropdowns[index] && (
                    <div className="sale-select-dropdown">
                      {[100, 97, 101].map(opt => (
                        <span 
                          key={opt}
                          className="option-sale"
                          onClick={() => {
                            handlePalletChange(index, "palletOption", opt);
                            setOpenPalletDropdowns(prev => ({
                              ...prev,
                              [index]: false,
                            }));
                          }}
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label> Sale Amount </label>
                <input value={totalPurchase(pallet)} readOnly />
              </div>
            </div>

            <div className="seperate-sale"></div>
          </div>
        ))}

        <div className="btn-row">
          <button className="cancel"  onClick={() => removeAddSale(form.pallets.length - 1)}>
            remove 
          </button>
          <button className="create" onClick={handleSaveSaleItems}>
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* ================= ACTIVE CONTAINER TOTALS ================= */}
  {activeContainer && activeContainer.pallets.length > 0 && (() => {
  const totals = calculateTotals(activeContainer.pallets);

  return (
    <div className="sale-row">
     
      {/* ================= SALE ITEMS TABLE ================= */}
{tableSaleItems.length > 0 && (
  <>
    <SaleItemsTable
      items={tableSaleItems}
      onDelete={handleDeleteSaleItem}
      onEdit ={handleEditSaleItem}
    />
    <div className="grid-2 mt-3">
    <div className="form-group">
          <h5 style={{color:"#581aae"}}>Total Sale Amount</h5>
          <input value={formatCurrency(totalSaleAmount)} readOnly style={{color:"gray",border:"none", }} />
        </div>
        <div className="form-group">
            <h5 style={{color:"#581aae"}}>Amount Paid</h5>
            <input
  type="number"
  value={amountPaid}
  onChange={(e) => {
    const value = Number(e.target.value || 0);

    if (value > totalSaleAmount) {
      setSuccessMessage("Amount cannot more total sale amount");
      return;
    }

    setAmountPaid(value);
  }}
/>

              </div>
    </div>
  </>
)}

      <div className="btn-row">
        <button
          className="cancel"
          onClick={() =>
            setView(sales && sales.length > 0 ? "table" : "empty")
          }
        >
          Cancel
        </button>
        <button className="create" onClick={() => handleClick()}>
          Create
        </button>
      </div>
    </div>
  );
})()}
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSale;


