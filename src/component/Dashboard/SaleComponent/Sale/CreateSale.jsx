import React, { useEffect, useState,useMemo } from "react";
import "../../../../assets/Styles/dashboard/Sale/createPresale.scss";
import { X, ChevronDown, Plus } from "lucide-react";
import SaleItemsTable from "./SaleItemsTable";
import {totalPurchase,calculateTotals,totalSaleAmount,totalPalletCount,totalPurchasePricePerPiece} from './hooks/ useSaleCalculations';
import {usePresaleHelpers} from './hooks/usePresaleHelpers';
const CUSTOMERS_KEY = "customers_data";

const CreateSale = ({ preSales = [], sales, setView, onCreate, containersData }) => {
  const [editingRow, setEditingRow] = useState(null);
  const [searchContainer, setSearchContainer] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [presaleError, setPresaleError] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [openContainerSelect, setOpenContainerSelect] = useState(false);
  const [salePop, setSalePop] = useState(false);
  const [activeContainerId, setActiveContainerId] = useState(null); 
  const [openContainerDropdowns, setOpenContainerDropdowns] = useState({});
const [palletContainers, setPalletContainers] = useState({});
  const [containerSales, setContainerSales] = useState({});
  const [collapsedContainers, setCollapsedContainers] = useState({});
  const [openPalletDropdowns, setOpenPalletDropdowns] = useState({});
  const activeContainer = containerSales[activeContainerId];  
  const dynamicContainerOptions = selectedValues;
  const {presaleByContainerId,isPurchasePriceLowerThanPresale,getPalletOptionsForContainer,  } = usePresaleHelpers(preSales);
  
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

        updated[containerId] = {
          container: {
            id: container.id,
            name: container.name,
            trackingNumber: container.trackingNumber,
          },
  pallets: [],
};

        
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

  const cleanNumber = (value) => value.replace(/[^\d.]/g, "");
  const formatMoneyNGN = (value) =>
  value === "" ? "" : "₦" + Number(value).toLocaleString("en-NG");
  const formatNumber = (value) =>
  value === "" ? "" : Number(value).toLocaleString("en-NG");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleaned = cleanNumber(value);
    setForm((prev) => ({
      ...prev,
      [name]: cleaned,
    }));
  };
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
            container: {
              id: containerObj?.id,
              name: containerObj?.name,
              trackingNumber: containerObj?.trackingNumber, // 🔥 ADD THIS
            },
            pallets: [],
          };
          
        }
  
        const cleanPallet = {
          id: pallet.id,
          pieces: Number(pallet.pieces) || 0,
          saleAmount: Number(pallet.saleAmount) || 0,
          palletOption: Number(pallet.palletOption) || 0,
          containerId,
          createdAt: pallet.createdAt,
          total: totalPurchase(pallet),
        };
  
        const existsIndex = updated[containerId].pallets.findIndex(
          p => p.id === pallet.id
        );
  
        if (existsIndex === -1) {
          updated[containerId].pallets.push(cleanPallet);
        } else {
          updated[containerId].pallets[existsIndex] = cleanPallet;
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

const balance = amountPaid >= totalSaleAmount
    ? 0 : totalSaleAmount - amountPaid;

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

  const filterContainers = (containersData || [])
  .filter((item) => {
    const name = item?.name ?? item?.title ?? "";
    return name.toLowerCase().includes(searchContainer.toLowerCase());
  })

  const toggleSelect = (item) => {
    setSelectedValues((prev) => {
      const exists = prev.some((v) => v.id === item.id);
      if (exists) return prev.filter((v) => v.id !== item.id);
  
      // Only keep serializable properties
      // return [
      //   ...prev,
      //   {
      //     id: String(item.id),
      //     name: String(item.name || ""),      
      //     containerID: item.containerID,
      //     totalPieces: item.totalPieces,
      //     netWeight: item.netWeight,
      //     maxWeight: item.maxWeight,
      //     grossWeight: item.grossWeight,
      //     netValue: item.netValue,
      //     WarehouseArrivalDat: item.WarehouseArrivalDat,
      //     createdAt: item.createdAt,
      //   },
      // ];
      return [
        ...prev,
        {
          id: item.id, // ✅ REAL container ID (number)
          name: item.name || item.title || "",
          trackingNumber: item.trackingNumber || "TN-UNKNOWN",

        },
      ];
      
      
    });
    console.log("CONTAINER ITEM:", item);
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
 
  const handleCreate = () => {
    const customer = foundCustomer;
  
    if (!customer) {
      setSuccessMessage("Please add or select a customer");
      return;
    }
    const cleanContainers = Object.values(containerSales).map(c => ({
      containerId: c.container.id,        // ✅ REAL ID
      name: c.container.name,
      trackingNumber: c.container.trackingNumber || "TN-UNKNOWN",
      pallets: c.pallets.map(p => ({
        id: p.id,
        pieces: Number(p.pieces),
        saleAmount: Number(p.saleAmount),
        palletOption: Number(p.palletOption),
        createdAt: p.createdAt,
        total: Number(p.total),
      })),
    }));
    
    const newSale = {
      id: Date.now(),
      presaleId: form.presaleId,
      totalSaleAmount,
      amountPaid: Number(amountPaid),
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
  
    onCreate(newSale);
    setView("table");
    console.log("SALE BEING SAVED:", newSale);

  };

  const closePopup = () => setSuccessMessage(null);

  const handleClick = () => {
    if (!foundCustomer) {
      const added = handleAddCustomer();
      if (!added) return;
    }
  
    handleCreate(); // ✅ NO ARGUMENT
  };

useEffect(() => {
  if (!selectedValues.length) {
    setPresaleError("");
    return;
  }


  const containersWithoutPresale = selectedValues.filter(
    c => !presaleByContainerId[c.id]
  );

  if (containersWithoutPresale.length > 0) {
    setPresaleError(
      "Some selected containers do not have a pre-sale"
    );
  } else {
    setPresaleError("");
  }
}, [selectedValues, presaleByContainerId]);

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
              <div className="form-group">
  <label>Pre-Sale ID</label>

  <input
    readOnly
    className="readonly-input"
    value={
      selectedValues.length === 0
        ? ""
        : selectedValues
            .map(c => presaleByContainerId[c.id]?.sn)
            .filter(Boolean)
            .map(sn => `ID:${sn}`)
            .join(", ")
    }
  />

  {presaleError && (
    <small className="error-text">{presaleError}</small>
  )}
</div>



            </div>
            {/* Container Details */}
            {selectedValues.length > 0 && (
  <div className="sale-grid-3">
    {selectedValues.map((container) => {
      const presale = presaleByContainerId[container.id]; // ✅ NOW VALID

      return (
        <div key={container.id} className="container-details">
          <div className="collapsed-container">
            <h4>Pre-sale Details</h4>
            <ChevronDown
              onClick={() => toggleCollapsedContainer(container.id)}
              className={collapsedContainers[container.id] ? "up" : "down"}
            />
          </div>

          <ul className={collapsedContainers[container.id] ? "" : "d-none"}>
            {presale ? (
              <>
                <li>Pre-Sale ID: {presale.sn}</li>
                <li>Sale Option: {presale.saleOption}</li>
                <li>Total Pieces: {presale.wcPieces}</li>
                <li>Total Pallets: {presale.noOfPallets}</li>
                <li>Expected Revenue: ₦{presale.expectedRevenue}</li>
                <li>Status: {presale.status}</li>
              </>
            ) : (
              <li className="error-text">
                This container has no pre-sale
              </li>
            )}
          </ul>
        </div>
      );
    })}
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
              <div className="customer-grid-3 mt-2">
              <div className="customer-details">
                <ul className="ul">
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
              pallets: [
                ...prev.pallets,
                {
                  id: crypto.randomUUID(),
                  pieces: "",
                  saleAmount: "",
                  palletOption: "",
                  containerId: activeContainerId || selectedValues[0]?.id,
                  createdAt: new Date().toISOString(),
                },
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

  {isPurchasePriceLowerThanPresale(pallet) && (
    <small className="error-text" style={{ color: "red" }}>
      Purchase Price (Per Pieces) is already less than the Price Per Pic (NGN)
    </small>
  )}
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
                     {getPalletOptionsForContainer(
  pallet.containerId || activeContainerId
).map(opt => (
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
                <input value={formatMoneyNGN(totalPurchase(pallet))} readOnly />
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
  return (
    <div className="sale-row">
      {/* ================= SALE ITEMS TABLE ================= */}
      {Object.values(containerSales).some(c => c.pallets.length > 0) && (
  <div className="sale-row">
    <SaleItemsTable
      items={tableSaleItems}
      onDelete={handleDeleteSaleItem}
      onEdit={handleEditSaleItem}
    />
    <div className="grid-2 mt-3">
      <div className="form-group">
        <h5 style={{ color: "#581aae" }}>Total Sale Amount</h5>
        <input value={formatCurrency(totalSaleAmount)} readOnly />
      </div>

      <div className="form-group">
        <h5 style={{ color: "#581aae" }}>Amount Paid</h5>
        <input
          type="number"
          value={formatMoneyNGN(amountPaid)}
          onChange={(e) => {
            const value = Number(e.target.value || 0);
            if (value > totalSaleAmount) {
              setSuccessMessage("Amount cannot exceed total sale amount");
              return;
            }
            setAmountPaid(value);
          }}
        />
      </div>
    </div>
    <div className="btn-row">
      <button
        className="cancel"
        onClick={() =>
          setView(sales && sales.length > 0 ? "table" : "empty")
        }
      >
        Cancel
      </button>
      <button
        className="create"
        disabled={!!presaleError}
        onClick={handleClick}
      >
        Create
      </button>
    </div>
  </div>
)}

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


