import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";
import CreateSale from "./CreateSale";
import SaleTable from "./SaleTable";
import DrilldownSale from "./DrildownSale";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "sales_data";
const PRESALE_KEY = "presales_data";

const SaleController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  const [selectedSale, setSelectedSale] = useState(null);
  const location = useLocation();
  // Initialize sales from localStorage
  const [sales, setSales] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  });
  const TRIP_KEY = "trip_data";
  const [trips, setTrips] = useState(() => {
    return JSON.parse(localStorage.getItem(TRIP_KEY)) || [];
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Set view based on existing sales
  const [view, setView] = useState(() => {
    const savedSales = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return savedSales.length ? "table" : "empty" ;
  });

  const [presales, setPresales] = useState([]);
  // Load presales and add serial number (S/N)
  useEffect(() => {
    const savedPresales = JSON.parse(localStorage.getItem(PRESALE_KEY)) || [];
    const presalesWithSN = savedPresales.map((p, index) => ({ ...p, sn: index + 1 }));
    setPresales(presalesWithSN);
  }, []);

  // Persist sales whenever it updates
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  }, [sales]);

  // Auto-open create modal if requested
  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate, setAutoOpenCreate]);
  const [containers, setContainers] = useState(() => {
    let allContainers = [];
    trips.forEach((trip) => {
      const tripContainers =
        JSON.parse(localStorage.getItem(`trip-${trip.id}-container`)) || [];
      tripContainers.forEach((c) => (c.modelName = trip.title || "Unknown"));
      allContainers = [...allContainers, ...tripContainers];
    });
    return allContainers;
  });
  useEffect(() => {
    let allContainers = [];
    trips.forEach((trip) => {
      const tripContainers =
        JSON.parse(localStorage.getItem(`trip-${trip.id}-container`)) || [];
      tripContainers.forEach((c) => (c.modelName = trip.title || "Unknown"));
      allContainers = [...allContainers, ...tripContainers];
    });
    setContainers(allContainers);
    setView(allContainers.length ? "table" : "empty");
  }, [trips]);
  useEffect(() => {
    setSales(prev =>
      prev.map(sale => ({
        ...sale,
        totalSaleAmount: Number(sale.totalSaleAmount) || 0,
        noOfPallets: Number(sale.noOfPallets) || 0,
        purchasePricePerPiece: Number(sale.purchasePricePerPiece) || 0,
      }))
    );
  }, []);


  const filteredContainers = containers.filter((c) => {
    const title = c.title ?? "";
    const modelName = c.modelName ?? "";
  
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modelName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const migrateSalesTrackingNumbers = (sales, containers) => {
    let changed = false;
  
    const containerMap = {};
    containers.forEach(c => {
      containerMap[c.id] = c.trackingNumber;
    });
  
    const updatedSales = sales.map(sale => {
      const updatedContainers = sale.containers.map(c => {
        if (!c.trackingNumber || c.trackingNumber === "TN-UNKNOWN") {
          const realTracking = containerMap[c.containerId];
          if (realTracking) {
            changed = true;
            return {
              ...c,
              trackingNumber: realTracking,
            };
          }
        }
        return c;
      });
  
      return {
        ...sale,
        containers: updatedContainers,
      };
    });
  
    return { updatedSales, changed };
  };
  const normalizedContainers = containers.map(c => ({
    ...c,
    name: c.name || c.title || "Unnamed Container",
    trackingNumber:c.trackingNumber ||  "TN-UNKNOWN",
  }));
  useEffect(() => {
    if (!sales.length || !normalizedContainers.length) return;
  
    const { updatedSales, changed } =
      migrateSalesTrackingNumbers(sales, normalizedContainers);
  
    if (changed) {
      setSales(updatedSales);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSales));
    }
  }, [normalizedContainers]);
  


  
  // Add a new sale

  const handleAddSale = (newSale) => {
    const saleId = newSale.id; // 🔥 single source of truth
  
    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSales));
    setView("table");
  
    if (Number(newSale.amountPaid) > 0) {
      const recoveryData =
        JSON.parse(localStorage.getItem("recovery_storage")) || [];
  
      const balanceAfter = Math.max(
        Number(newSale.totalSaleAmount || 0) - Number(newSale.amountPaid),
        0
      );
  
      const firstRecovery = {
        id: Date.now(),               // recovery id
        saleId: saleId,               // ✅ LINK TO SALE
        customerName: newSale.customer?.name || "Unknown",
        customerPhone: newSale.customer?.phone || "N/A",
        amountPaid: Number(newSale.amountPaid),
        balanceAfter,
        createdAt: new Date().toISOString(),
        status: balanceAfter === 0 ? "Approved" : "Pending",
        isInitial: true,
      };
  
      localStorage.setItem(
        "recovery_storage",
        JSON.stringify([...recoveryData, firstRecovery])
      );
    }
  };
  
  const handleDeleteSale = (saleId) => {
    // 1️⃣ Delete sale
    const updatedSales = sales.filter((s) => s.id !== saleId);
    setSales(updatedSales);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSales));
  
    // 2️⃣ Delete linked recoveries
    const recoveries =
      JSON.parse(localStorage.getItem("recovery_storage")) || [];
  
    const filteredRecoveries = recoveries.filter(
      (r) => r.saleId !== saleId
    );
  
    localStorage.setItem(
      "recovery_storage",
      JSON.stringify(filteredRecoveries)
    );
  };
  const handleRowClick = (sale) => {
    setSelectedSale(sale);
    setView("drilldown"); // 🔥 switch view to drilldown page
  };
  
  // const handleUpdate = (updatedSale) => {
  //   if (onUpdate) onUpdate(updatedSale);
  //   setSelectedSale(null);
  // };
  
  return (
    <div className="controller">
      <div className="controller-container">
        <div className="controller-content">
          {(view === "empty" || view === "table") && (
            <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper" />

                <div className="right-wrapper">
                  <div className="right-wrapper-input">
                    <Search className="input-icon" />
                    <input type="text" placeholder="Search" />
                  </div>

                  <div className="select-input">
                    <div className="filter">
                      <span>Add Filter</span>
                      <Filter />
                    </div>
                  </div>

                  <div className="select-input">
                    <div className="select-input-field">
                      <span>All Field</span>
                      <ChevronDown />
                    </div>
                  </div>

                  <div className="import-input"><p>Import</p></div>
                  <div className="import-input"><p>Export</p></div>

                  <button onClick={() => setView("create")}>Record Sale</button>
                </div>
              </div>
            </div>
          )}

          <div className="main-content">
            {sales.length === 0 && view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No sale Created Yet</p>
                  <span>A sale created would be saved here automatically</span>
                </div>
              </div>
            )}

            {sales.length > 0 && view === "table" && 
            <SaleTable 
            sales={sales}
            onDelete={handleDeleteSale} 
            handleRowClick={handleRowClick} />
              }

            {view === "create" && (
             <CreateSale
             preSales={presales}
             sales={sales}
             containersData={normalizedContainers}
             setView={setView}
             openSubmenu={openSubmenu}
             onCreate={handleAddSale}
           />           
            )}
           {view === "drilldown" && selectedSale && (
  <DrilldownSale 
    data={selectedSale} 
    goBack={() => setView("table")} 
    onUpdate={(updatedSale) => {
      // Update the sales array
      setSales((prevSales) =>
        prevSales.map((s) => (s.id === updatedSale.id ? updatedSale : s))
      );
      setView("table");
    }}
  />
)}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleController;
















/************************************************************************************************ */












import React from "react";
import { X, ChevronDown } from "lucide-react";
import { totalPurchase } from "./hooks/useSaleCalculations";

const AddSaleItem = ({
  form,setForm,salePop,setSalePop,dynamicContainerOptions,formatNumber,openContainerDropdowns,setOpenContainerDropdowns,
  openPalletDropdowns,setOpenPalletDropdowns,palletOptionsByContainer,activeContainerId,
  addPallet,handlePalletChange,handleSaveSaleItems,removeAddSale,isPurchasePriceLowerThanPresale,
}) => {

  if (!salePop) return null;

  const toggleContainerDropdown = (index) => {
    setOpenContainerDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const togglePalletDropdown = (index) => {
    setOpenPalletDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="add-sale-popup">
      <div className="popup-overlay" />

      <div className="add-sale-content">
        <X size={18} className="close" onClick={() => setSalePop(false)} />

        <div className="sale-pallet-section">
          {/* ===== Header ===== */}
          <div className="header">
            <h5 style={{ fontSize: "1.2vw" }}>Add Sale</h5>
            {/* <button
  type="button"
  className="add-more-btn"
  onClick={() => addPallet(activeContainerId)}
>
  Add More
</button> */}
          </div>

          {/* ===== Pallets ===== */}
          {form.pallets.map((pallet, index) => {
            const palletOptions =
              pallet.containerId
                ? palletOptionsByContainer[pallet.containerId] || []
                : [];

            const selectedContainer = dynamicContainerOptions.find(
              (c) => c.id === pallet.containerId
            );

            const selectedPalletMeta = palletOptions.find(
              (p) => p.pallet_uuid === pallet.pallet_uuid
            );

            const remainingPallets =
              selectedPalletMeta?.remaining_no_of_pallets ?? 0;

            return (
              <div key={pallet.id}>
                <div className="grid-5">

                  {/* ===== Container Selector ===== */}
                  {/* {dynamicContainerOptions.length > 1 && (
                    <div className="form-group-select">
                      <label>Container</label>

                      <div className="sale-custom-select">
                        <div
                          className="custom-select-drop"
                          onClick={() => toggleContainerDropdown(index)}
                        >
                          <div className="select-box">
                            {selectedContainer ? (
                              <span>{selectedContainer.name}</span>
                            ) : (
                              <span className="placeholder">
                                Select Container
                              </span>
                            )}
                          </div>
                          <ChevronDown
                            className={
                              openContainerDropdowns[index] ? "up" : "down"
                            }
                          />
                        </div>

                        {openContainerDropdowns[index] && (
                          <div className="sale-select-dropdown">
                            {dynamicContainerOptions.map((container) => (
                              <span
                                key={container.id}
                                className="option-sale"
                               onClick={() => {
  const pallets = palletOptionsByContainer[container.id] || [];

  handlePalletChange(index, "containerId", container.id);
  handlePalletChange(index, "pallet_uuid", "");
  handlePalletChange(index, "palletOption", "");
  handlePalletChange(index, "noOfPallets", "");

  handlePalletChange(
    index,
    "remaining_no_of_pallets",
    pallets[0]?.remaining_no_of_pallets || 0
  );

  setOpenContainerDropdowns((prev) => ({
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
                  )} */}

                  {/* ===== Purchase Price ===== */}
                  <div className="form-group">
                    <label>Purchase Price (Per Piece)</label>
<input
  type="number"
  value={pallet.purchasePrice}
  onChange={(e) =>
    handlePalletChange(
      index,
      "purchasePrice",
      Number(e.target.value) || 0
    )
  }
/>
                    {isPurchasePriceLowerThanPresale(pallet) && (
                      <small className="error">
                        Price is lower than pre-sale price per piece {pallet.pricePerPic}
                      </small>
                    )}
                  </div>

                  {/* ===== No of Pallets ===== */}
                  <div className="form-group">
                    <label>No. of Pallets Purchased</label>
  <input
  type="number"
  min={0}
  max={pallet.remaining_no_of_pallets}
  disabled={pallet.remaining_no_of_pallets === 0}
  value={pallet.noOfPallets}
  onChange={(e) => {
    const raw = Number(e.target.value) || 0;
const max = Number(pallet.remaining_no_of_pallets) || 0;

const safeQty = raw > max ? max : raw;

    handlePalletChange(index, "noOfPallets", safeQty);
  }}
/>

{pallet.remaining_no_of_pallets > 0 && (
 <small className="error">
  {pallet.remaining_no_of_pallets > 0
    ? `Only ${pallet.remaining_no_of_pallets} pallet(s) remaining`
    : "No pallets remaining"}
</small>
)}
                  </div>

                  {/* ===== Pallet Distribution ===== */}
                  <div className="form-group-select">
                    <label>Pallet Distribution</label>

                    <div className="sale-custom-select">
                      <div
                        className="custom-select-drop"
                        onClick={() => togglePalletDropdown(index)}
                      >
                        <div className="select-box">
                          {pallet.palletOption ? (
                            `${pallet.palletOption} Pieces`
                          ) : (
                            <span className="placeholder">
                              Pallet Option
                            </span>
                          )}
                        </div>
                        <ChevronDown
                          className={
                            openPalletDropdowns[index] ? "up" : "down"
                          }
                        />
                      </div>

                      {openPalletDropdowns[index] && (
                        <div className="sale-select-dropdown">
                          {!pallet.containerId ? (
                            <span className="option-sale disabled">
                              Select a container first
                            </span>
                          ) : palletOptions.length === 0 ? (
                            <span className="option-sale disabled">
                              No pallet options available
                            </span>
                          ) : (
                            palletOptions.map((opt) => (
                              <span
                                key={opt.pallet_uuid}
                                className="option-sale"
                                onClick={() => {
                                  handlePalletChange(index, "palletOption", opt.pallet_pieces);
                                  handlePalletChange(index, "pallet_uuid", opt.pallet_uuid);
                                  setOpenPalletDropdowns((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }));
                                }}
                              >
                                {opt.pallet_pieces} Pieces
                              </span>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ===== Total ===== */}
                  <div className="form-group">
                    <label>Sale Amount</label>
                    <input
                      type="text"
                      readOnly
                      value={formatNumber(totalPurchase(pallet))}
                    />
                  </div>
                </div>

                <div className="seperate-sale" />
              </div>
            );
          })}

          {/* ===== Footer ===== */}
          <div className="btn-row">
            <button
              className="cancel"
              onClick={() => removeAddSale(form.pallets.length - 1)}
            >
              Remove
            </button>

            <button
              className="create"
              onClick={handleSaveSaleItems}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSaleItem;





  import React, { useEffect, useState, useMemo } from "react";
  import "../../../../assets/Styles/dashboard/create.scss";
  import { X, ChevronDown, Plus } from "lucide-react";
  import SaleItemsTable from "./SaleItemsTable";
  import { totalPurchase, calculateTotals, totalSaleAmount, totalPalletCount, totalPurchasePricePerPiece } from './hooks/useSaleCalculations';
  import { usePresaleHelpers } from './hooks/usePresaleHelpers';
  import { SaleServices } from "../../../../services/Sale/sale";
  import SaleCustomer from "./SaleCustomer";
  import AddSaleItem from "./AddSaleItem";

  const CreateSale = ({ setView, onCreate, preSales = [], containersData = [], sales = [] }) => {

    const [editingRow, setEditingRow] = useState(null);
    const [searchContainer, setSearchContainer] = useState("");
    const [amountPaid, setAmountPaid] = useState("");
    const [presaleError, setPresaleError] = useState("");
    const [selectedValues, setSelectedValues] = useState([]);
    const [openContainerSelect, setOpenContainerSelect] = useState(false);
    const [salePop, setSalePop] = useState(false);
    const [activeContainerId, setActiveContainerId] = useState(null);
    const [openContainerDropdowns, setOpenContainerDropdowns] = useState({});
    const [containerSales, setContainerSales] = useState({});
    const [collapsedContainers, setCollapsedContainers] = useState({});
    const [openPalletDropdowns, setOpenPalletDropdowns] = useState({});
    const [palletOptionsByContainer, setPalletOptionsByContainer] = useState({});
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [selectedContainer, setSelectedContainer] = useState(null);

    const dynamicContainerOptions = selectedValues;

    const { presaleByContainerId, isPurchasePriceLowerThanPresale } = usePresaleHelpers(preSales);

    const [form, setForm] = useState({
      presaleId: "",
      container: "",
      noOfPallets: "",
      saleOption: "",
      wcPieces: "",
      noOfPalletInput: "",
      saleAmount: "",
      totalSaleAmount: "",
      depositAmount: "",
      pallets: [],
    });

    // ---------------------- HANDLE FORM CHANGES ----------------------
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePalletChange = (index, field, value) => {
      setForm(prev => {
        const updatedPallets = [...prev.pallets];
        updatedPallets[index] = { ...updatedPallets[index], [field]: value };
        return { ...prev, pallets: updatedPallets };
      });
    };

  const addPallet = (containerId) => {
    const resolvedContainerId =
      containerId || activeContainerId || selectedValues[0]?.id;

    if (!resolvedContainerId) return;

    const palletList = palletOptionsByContainer[resolvedContainerId] || [];
    if (!palletList.length) {
      setSuccessMessage("No pallets available for this container");
      return;
    }

    // Prevent duplicate pallet UUIDs
    const usedUUIDs = form.pallets.map(p => p.pallet_uuid);

    const available = palletList.find(
      p => !usedUUIDs.includes(p.pallet_uuid)
    );

    if (!available) {
      setSuccessMessage("All pallets for this container have been added");
      return;
    }

    setForm(prev => ({
      ...prev,
      pallets: [
        ...prev.pallets,
        {
          id: crypto.randomUUID(),
          containerId: resolvedContainerId,

          pallet_uuid: available.pallet_uuid,
          palletOption: available.pallet_pieces,
          purchasePrice: 0,noOfPallets: 0,

          remaining_no_of_pallets: available.remaining_no_of_pallets || 0,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    setSalePop(true);
  };

    const removeAddSale = (index) => {
      const updated = form.pallets.filter((_, i) => i !== index);
      setForm(prev => ({ ...prev, pallets: updated }));
      if (!updated.length) setSalePop(false);
    };

    const toggleContainerDropdown = (index) => {
      setOpenContainerDropdowns(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const toggleCollapsedContainer = (id) => {
      setCollapsedContainers(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // ---------------------- SYNC SELECTED CONTAINERS ----------------------
    useEffect(() => {
      if (!selectedValues.length) return;
      setContainerSales(prev => {
        const updated = { ...prev };
        selectedValues.forEach(container => {
          if (!updated[container.id]) {
            updated[container.id] = {
              container: {
                id: container.id,
                container_uuid: container.container_uuid,
                name: container.name || container.title || "",
                trackingNumber: container.trackingNumber || "TN-UNKNOWN",
              },
              pallets: [],
            };
          }
        });
        return updated;
      });
    }, [selectedValues]);

    // ---------------------- FORMATTERS ----------------------
    const formatMoneyNGN = (value) => value === "" || value === null || value === undefined ? "" : "₦" + Number(value).toLocaleString("en-NG");
    const formatNumber = (value) => value === "" ? "" : Number(value).toLocaleString("en-NG");
    const parseMoney = (value) => Number(String(value).replace(/[^\d]/g, "")) || 0;

    // ---------------------- TABLE DATA ----------------------
    const tableSaleItems = useMemo(() => Object.values(containerSales).flatMap(container =>
      container.pallets.map(p => ({
        palletId: p.id,
        containerId: container.container.id,
        containerName: container.container.name,
        purchasePrice: p.purchasePrice,
        noOfPallets: p.noOfPallets,
        palletOption: p.palletOption,
        total: p.total,
        createdAt: p.createdAt,
      }))
    ), [containerSales]);

    const activeContainer = useMemo(() => {
      if (activeContainerId && containerSales[activeContainerId]) return containerSales[activeContainerId];
      return Object.values(containerSales).find(c => c.pallets.length > 0);
    }, [activeContainerId, containerSales]);

    const computedTotalSaleAmount = useMemo(() => totalSaleAmount(tableSaleItems), [tableSaleItems]);
    const computedNoOfPallets = totalPalletCount(containerSales);
    const computedPurchasePricePerPiece = totalPurchasePricePerPiece(containerSales);

    const isBoxSale = useMemo(() => selectedValues.some(c => presaleByContainerId[c.id]?.saleOption === "Box Sale"), [selectedValues, presaleByContainerId]);
    const isNonBoxSale = useMemo(() => selectedValues.some(c => presaleByContainerId[c.id]?.saleOption === "Split Sale"), [selectedValues, presaleByContainerId]);

    const saleOptionType = useMemo(() => {
      if (isBoxSale && isNonBoxSale) return "Mixed Sale";
      if (isBoxSale) return "Box Sale";
      return "Split Sale";
    }, [isBoxSale, isNonBoxSale]);

    const computedTotalSaleAmountFinal = isBoxSale ? Number(form.totalSaleAmount || 0) : computedTotalSaleAmount;

    const balance = amountPaid >= computedTotalSaleAmountFinal ? 0 : computedTotalSaleAmountFinal - amountPaid;

    // ---------------------- CUSTOMER / PAYMENTS ----------------------
    const handleClick = () => {
      if (!selectedCustomer) {
        setSuccessMessage("Please select or create a customer");
        return;
      }
      handleCreate(selectedCustomer);
    };

const buildCreatePayloads = (customer) => {
  if (!customer?.user_uuid) throw new Error("Customer is required");

  const container = activeContainer; // only a single active container now

  if (!container?.pallets?.length) throw new Error("No pallets added for the container");

  const pallets = container.pallets;

  const purchase_prices = [];
  const pallets_purchased = [];
  const pallet_uuids = [];
  let total_sale_amount = 0;

  pallets.forEach(p => {
    const price = Number(p.purchasePrice) || 0;
    const qty = Number(p.noOfPallets) || 0;
    const pieces = Number(p.palletOption) || 0;

    if (!price || !qty || !p.pallet_uuid) return;

    purchase_prices.push(price);
    pallets_purchased.push(qty);
    pallet_uuids.push(p.pallet_uuid);

    total_sale_amount += price * qty * pieces;
  });

  if (!purchase_prices.length) throw new Error("No valid pallets to create sale");

  const presale = presaleByContainerId[container.container.id];
  if (!presale?.pre_sale_uuid)
    throw new Error(`Pre-sale not found for container ${container.container.name}`);

  return [
    {
      container_uuid: container.container.container_uuid,
      pre_sale_uuid: presale.pre_sale_uuid,
      customer_uuid: customer.user_uuid,
      purchase_prices,
      pallets_purchased,
      pallet_uuids,
      total_sale_amount,
      amount_paid: Number(amountPaid) || 0,
    }
  ];
};
const handleCreate = async (customer) => {
  try {
    const [payload] = buildCreatePayloads(customer);

    // Cap amount paid to the total sale amount
    const finalPayload = {
      ...payload,
      amount_paid: Math.min(Number(amountPaid) || 0, payload.total_sale_amount),
    };


    await onCreate(finalPayload);

    setView("table");
  } catch (err) {
    console.error("Create sale failed:", err);
    setSuccessMessage(
      err.response?.data?.message || err.message || "Failed to create sale"
    );
  }
};

    // ---------------------- FETCH PALLETS ----------------------
    useEffect(() => {
      if (!selectedValues.length) return;

      const fetchPalletsForContainers = async () => {
        for (const container of selectedValues) {
          const presale = presaleByContainerId[container.id];
          if (!presale?.pre_sale_unique_id) continue;
          if (palletOptionsByContainer[container.id]) continue;

          try {
            const res = await SaleServices.getPallets({ pre_sale_uuid: presale.pre_sale_uuid });
            const pallets = res?.data?.pallets || [];
const palletsWithUUID = pallets.map(p => {
  const remaining = Number(p.remaining_no_of_pallets) || 0;

  return {
    pallet_uuid: p.pallet_uuid,
    pallet_pieces: Number(p.pallet_pieces) || 0,

    // never allow negative remaining pallets
    remaining_no_of_pallets: remaining < 0 ? 0 : remaining
  };
});
            setPalletOptionsByContainer(prev => ({ ...prev, [container.id]: palletsWithUUID }));
          } catch (err) {
            console.error("Failed to fetch pallets for container:", container.name, err);
          }
        }
      };

      fetchPalletsForContainers();
    }, [selectedValues, presaleByContainerId]);

    // ---------------------- SELECTED CONTAINERS ERRORS ----------------------
    useEffect(() => {
      if (!selectedValues.length) {
        setPresaleError("");
        return;
      }
      const containersWithoutPresale = selectedValues.filter(c => !presaleByContainerId[c.id]);
      setPresaleError(containersWithoutPresale.length ? "Some selected containers do not have a pre-sale" : "");
    }, [selectedValues, presaleByContainerId]);

    useEffect(() => {
      if (!activeContainerId && selectedValues.length) setActiveContainerId(selectedValues[0].id);
    }, [selectedValues, activeContainerId]);

    const filterContainers = (containersData || []).filter(item => {
      const name = item?.name ?? item?.title ?? "";
      return name.toLowerCase().includes(searchContainer.toLowerCase());
    });

    const toggleSelect = (item) => {
      setSelectedValues(prev => {
        const exists = prev.some(v => v.id === item.id);
        if (exists) {
          const hasSales = containerSales[item.id]?.pallets?.length > 0;
          if (hasSales) { setSuccessMessage("You cannot remove a container that already has sale items"); return prev; }
          return prev.filter(v => v.id !== item.id);
        }
        return [...prev, { id: item.id, container_uuid: item.container_uuid, name: item.name || item.title || "", trackingNumber: item.tracking_number || "TN-UNKNOWN" }];
      });
    };

    const closePopup = () => setSuccessMessage(null);

    // ---------------------- SAVE / EDIT SALE ITEMS ----------------------
const handleSaveSaleItems = () => {
  if (!form.pallets.length) return;

  setContainerSales((prev) => {
    const updated = { ...prev };

    form.pallets.forEach((p) => {
      const containerId = p.containerId || activeContainerId;
      if (!containerId) return;

      const qty = Number(p.noOfPallets) || 0;
      const price = Number(p.purchasePrice) || 0;
      const pieces = Number(p.palletOption) || 0;

      const safeQty = Math.min(
        qty,
        Number(p.remaining_no_of_pallets) || 0
      );

      if (!safeQty || !price || !p.pallet_uuid) return;

      // ensure container exists
      if (!updated[containerId]) {
        const meta = selectedValues.find((c) => c.id === containerId);
        if (!meta) return;

        updated[containerId] = {
          container: {
            id: meta.id,
            container_uuid: meta.container_uuid,
            name: meta.name,
          },
          pallets: [],
        };
      }

      const palletData = {
        id: p.id,
        pallet_uuid: p.pallet_uuid,
        palletOption: pieces,
        purchasePrice: price,
        noOfPallets: safeQty,
        total: price * safeQty * pieces,
        createdAt: p.createdAt || new Date().toISOString(),
      };

      const index = updated[containerId].pallets.findIndex(
        (x) => x.id === p.id
      );

      if (index === -1) {
        updated[containerId].pallets.push(palletData);
      } else {
        updated[containerId].pallets[index] = palletData;
      }
    });

    return updated;
  });

  setForm((prev) => ({
    ...prev,
    pallets: [],
  }));

  setSalePop(false);
  setEditingRow(null);
};

    const handleEditSaleItem = (row) => {
      const palletData = containerSales[row.containerId]?.pallets.find(p => p.id === row.palletId);
      if (!palletData) return;
      setForm(prev => ({ ...prev, pallets: [{ ...palletData }] }));
      setActiveContainerId(row.containerId);
      setSalePop(true);
      setEditingRow({ containerId: row.containerId, palletIndex: containerSales[row.containerId].pallets.findIndex(p => p.id === row.palletId) });
    };

    const handleDeleteSaleItem = (row) => {
      setContainerSales(prev => {
        const updated = { ...prev };
        updated[row.containerId].pallets = updated[row.containerId].pallets.filter(p => p.id !== row.palletId);
        return updated;
      });
    };

    // ---------------------- RENDER ----------------------
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
      {/* ==================== Container Multi-select ==================== */}
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
                    <span className="tag" key={item.id}>
                      {item.name || item.title}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div
              className="custom-select-icon"
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
                  <label key={item.id} >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSelect(item)}
                    />
                    <span>{item.name || item.title}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== Pre-sale Dropdown ==================== */}
      <div className="form-group">
        <label>Pre-Sale ID</label>
  <input
    readOnly
    className="readonly-input"
    value={
      selectedValues.length === 0
        ? ""
        : selectedValues
            .map(c => presaleByContainerId[c.id]?.pre_sale_unique_id)
            .filter(Boolean)
            .map(sn => `ID:${sn}`)
            .join(", ")
    }
  />
  {presaleError && <small className="error-text">{presaleError}</small>}
      </div>
    </div>

    {/* ==================== Container Details / Pre-sale Info ==================== */}
    {selectedValues.length > 0 && (
      <div className="sale-grid-3">
      {selectedValues.map(container => {
    const presale = presaleByContainerId[container.id];
    return (
      <div key={container.id} className="container-details">
        <div className="collapsed-container">
          <h4 className="mt-4">{container.name} - Pre-sale Details</h4>
          <ChevronDown
            onClick={() => toggleCollapsedContainer(container.id)}
            className={collapsedContainers[container.id] ? "up" : "down"}
          />
        </div>
        <ul className={collapsedContainers[container.id] ? "" : "d-none"}>
          {presale ? (
            <>
              <li>Pre-Sale ID: {presale.pre_sale_unique_id}</li>
              <li>Sale Option: {presale.sale_option}</li>
              <li>Total Pieces: {presale.wc_pieces}</li>
              <li>Total Pallets: {presale.total_no_of_pallets}</li>
              <li>Expected Revenue: ₦{presale.expected_sales_revenue}</li>
              <li>Status: {presale.status}</li>
            </>
          ) : (
            <li className="error-text">This container has no pre-sale</li>
          )}
        </ul>
      </div>
    );
  })}
      </div>
    )}

          </div>
              {/* Customer Section */}
          <SaleCustomer
    onCustomerResolved={(customer) => {
      setSelectedCustomer(customer);
    }}
  />

              {/* Sale Details */}
              <div className="sale-details">
    {/* Header */}
    <div className="sale-header-details">
        <>
          <h3 className="title-text" >Sale Details</h3>

  {["Split Sale", "Mixed Sale"].includes(saleOptionType) && (
    <button
      type="button"
      className="add-item-btn"
      onClick={() => {
  const containerId = activeContainerId || selectedValues[0]?.id;
  if (!containerId || !palletOptionsByContainer[containerId]?.length) {
    setSuccessMessage("No pallets loaded yet for this container");
    return;
  }
  addPallet(containerId);
      }}
    >
      <Plus size={16} /> Add Item
    </button>
  )}





        </>
    </div>

    {/* ================= ADD SALE POPUP ================= */}
    <div className={salePop ? "add-sale-popup" : "d-none"}>
      <AddSaleItem formatNumber={formatNumber} 
      form={form} setForm={setForm} salePop={salePop} setSalePop={setSalePop}  activeContainerId={activeContainerId} dynamicContainerOptions={dynamicContainerOptions}
      openContainerDropdowns={openContainerDropdowns}setOpenContainerDropdowns={setOpenContainerDropdowns} openPalletDropdowns={openPalletDropdowns} setOpenPalletDropdowns={setOpenPalletDropdowns}
    palletOptionsByContainer={palletOptionsByContainer} addPallet={addPallet} handlePalletChange={handlePalletChange} handleSaveSaleItems={handleSaveSaleItems} removeAddSale={removeAddSale} isPurchasePriceLowerThanPresale={isPurchasePriceLowerThanPresale}
  />
    </div>

    {/* ================= ACTIVE CONTAINER TOTALS ================= */}
    {activeContainer && activeContainer.pallets.length > 0 && (() => {
    return (
      <div className="sale-row">
      {/* ================= SALE ITEMS TABLE ================= */}
  {tableSaleItems.length > 0 && (
    <div className="sale-row mt-3">
      <SaleItemsTable
        items={tableSaleItems}
        onDelete={handleDeleteSaleItem}
        onEdit={handleEditSaleItem}
        formatNumber={formatNumber}
      />
    </div>
  )}

      </div>
    );
  })()}
      <div className="grid-2 mt-3">
  <div className="form-group">
    <label style={{ color: "#581aae" }}>Total Sale Amount</label>

    <input
    type="text"
    readOnly={!isBoxSale}
    value={
      isBoxSale
        ? formatMoneyNGN(form.totalSaleAmount)
        : formatMoneyNGN(computedTotalSaleAmount)
    }
    onChange={(e) => {
      if (!isBoxSale) return;

      const raw = parseMoney(e.target.value);

      setForm(prev => ({
        ...prev,
        totalSaleAmount: raw,
      }));
    }}
  />

  </div>

  <div className="form-group">
    <label style={{ color: "#581aae" }}>Amount Paid</label>
  <input type="text"  value={formatMoneyNGN(amountPaid)}  onChange={(e) => { const raw = parseMoney(e.target.value);
      const maxAmount = isBoxSale  ? Number(form.totalSaleAmount || 0) : computedTotalSaleAmount;
      if (raw > maxAmount) {
        setSuccessMessage("Amount cannot exceed total sale amount");
        return;
      }
      setAmountPaid(raw);
    }}/>
  </div>
      </div>

      <div className="btn-row">
        <button  className="cancel"  onClick={() =>  setView(sales && sales.length > 0 ? "table" : "empty")  } >
          Cancel </button>
        <button className="create" disabled={!!presaleError ||(isBoxSale && !form.totalSaleAmount) ||(!isBoxSale && computedTotalSaleAmount <= 0)}
        onClick={handleClick}> Create</button>

      </div>
  </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default CreateSale;


