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
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [openContainerSelect, setOpenContainerSelect] = useState(false);
  const [salePop, setSalePop] = useState(false);
  const [activeContainerId, setActiveContainerId] = useState(null);
  const [openContainerDropdowns, setOpenContainerDropdowns] = useState({});
  const [containerSales, setContainerSales] = useState({});
  const [collapsedContainers, setCollapsedContainers] = useState({});
  const [openPalletDropdowns, setOpenPalletDropdowns] = useState({});
const [openPaymentDropdown, setOpenPaymentDropdown] = useState(false);
  const [palletOptionsByContainer, setPalletOptionsByContainer] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
const [discount, setDiscount] = useState(0);
const [paymentMethod, setPaymentMethod] = useState(""); // CASH or TRANSFER
const [availablePayments, setAvailablePayments] = useState(["CASH", "TRANSFER"]);
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
    const resolvedContainerId = containerId || activeContainerId || selectedContainer?.id;
    if (!resolvedContainerId) return;

    const palletList = palletOptionsByContainer[resolvedContainerId] || [];
    if (!palletList.length) {
      setSuccessMessage("No pallets available for this container");
      return;
    }

    const usedUUIDs = form.pallets.map(p => p.pallet_uuid);
    const available = palletList.find(p => !usedUUIDs.includes(p.pallet_uuid));
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
          purchasePrice: 0,
          noOfPallets: 0,
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

  // ---------------------- SYNC SELECTED CONTAINER ----------------------
  useEffect(() => {
    if (!selectedContainer) return;
    const id = selectedContainer.id;
    setContainerSales(prev => {
      const updated = { ...prev };
      if (!updated[id]) {
        updated[id] = {
          container: {
            id: selectedContainer.id,
            container_uuid: selectedContainer.container_uuid,
            name: selectedContainer.name || selectedContainer.title || "",
            trackingNumber: selectedContainer.trackingNumber || "TN-UNKNOWN",
          },
          pallets: [],
        };
      }
      return updated;
    });
  }, [selectedContainer]);

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



const saleOptionType = useMemo(() => {
  if (!selectedContainer) return "";
  const presale = presaleByContainerId[selectedContainer.id];
  return (presale?.sale_option || "").toLowerCase().trim();
}, [selectedContainer, presaleByContainerId]);

const isBoxSale = saleOptionType === "box sale";
const isSplitOrMixedSale = ["split sale", "mixed sale"].includes(saleOptionType);

const computedTotalSaleAmountFinal = isBoxSale
  ? Number(form.totalSaleAmount || 0) - discount
  : computedTotalSaleAmount - discount;

const balance =
  amountPaid >= computedTotalSaleAmountFinal
    ? 0
    : computedTotalSaleAmountFinal - amountPaid;
  // ---------------------- CUSTOMER / PAYMENTS ----------------------
  const handleClick = () => {
    if (!selectedCustomer) {
      setSuccessMessage("Please select or create a customer");
      return;
    }
    handleCreate(selectedCustomer);
  };
  const getBackendPalletPieces = (containerId, palletUUID) => {
  const pallets = palletOptionsByContainer[containerId] || [];
  const pallet = pallets.find(p => p.pallet_uuid === palletUUID);
  return Number(pallet?.pallet_pieces) || 0;
};
const buildCreatePayload = (customer) => {
  if (!customer?.user_uuid) throw new Error("Customer is required");
  if (!selectedContainer) throw new Error("Container is required");

  const presale = presaleByContainerId[selectedContainer.id];
  if (!presale?.pre_sale_uuid) throw new Error(`Pre-sale not found for container ${selectedContainer.name}`);

  const containerData = containerSales[selectedContainer.id];
  if (!containerData?.pallets?.length) throw new Error("No pallets added");

  const purchase_prices = containerData.pallets.map(p => Number(p.purchasePrice));
  const pallets_purchased = containerData.pallets.map(p => Number(p.noOfPallets));
  const pallet_uuids = containerData.pallets.map(p => p.pallet_uuid);
  const pallet_pieces = containerData.pallets.map(p => p.palletOption);

  return {
    container_uuid: selectedContainer.container_uuid,
    pre_sale_uuid: presale.pre_sale_uuid,
    customer_uuid: customer.user_uuid,
    purchase_prices: purchase_prices.join(","),       // ✅ array as CSV
    pallets_purchased: pallets_purchased.join(","),   // ✅ array as CSV
    pallet_uuids: pallet_uuids.join(","),             // ✅ array as CSV
    pallet_pieces: pallet_pieces.join(","),           // ✅ array as CSV
    amount_paid: Number(amountPaid) || 0,
    total_sale_amount: containerData.pallets.reduce((sum, p) => sum + Number(p.total || 0), 0) - discount,
    discount,
    payment_method: paymentMethod || "NO payment method selected",
    balance,
  };
};

const handleCreate = async (customer) => {
  try {
    const payload = buildCreatePayload(customer);

    // Show loader while saving
    setSuccessMessage("Saving sale...");
    
    const message = await onCreate(payload); 
    setSuccessMessage(message);             
    // Reset form after success
    setForm({ ...form, pallets: [], totalSaleAmount: "" });
    setSelectedContainer(null);
    setAmountPaid("");
    setPaymentMethod("");
    setDiscount(0);

    setTimeout(() => setView("table"), 1200); 
  } catch (err) {
    const errorMsg =
      err.response?.data?.message || err.message || "Failed to create sale";
    setSuccessMessage(errorMsg);
    console.error("Backend Error:", err.response?.data || err);
  }
};
const handleSaveSaleItems = () => {
  if (!form.pallets.length) return;
  const containerId = activeContainerId;
  if (!containerId) return;

  setContainerSales(prev => {
    const updated = { ...prev };
    if (!updated[containerId]) updated[containerId] = { container: activeContainer.container, pallets: [] };

    form.pallets.forEach(p => {
      const price = Number(p.purchasePrice) || 0;
      const qty = Math.min(Number(p.noOfPallets) || 0, Number(p.remaining_no_of_pallets) || 0);
      const pieces = Number(p.palletOption) || 0;

      if (!price || !qty || !p.pallet_uuid) return;

      const palletData = {
        id: p.id,
        pallet_uuid: p.pallet_uuid,
        palletOption: pieces,
        purchasePrice: price,
        noOfPallets: qty,
        total: price * qty * pieces, // ✅ store total here
        createdAt: p.createdAt || new Date().toISOString(),
      };

      const index = updated[containerId].pallets.findIndex(x => x.id === p.id);
      if (index === -1) updated[containerId].pallets.push(palletData);
      else updated[containerId].pallets[index] = palletData;
    });

    return updated;
  });

  setForm(prev => ({ ...prev, pallets: [] })); 
  setSalePop(false);
  setEditingRow(null);
};

  // ---------------------- FILTER CONTAINERS ----------------------
  const filterContainers = (containersData || []).filter(item => {
    const name = item?.name ?? item?.title ?? "";
    return name.toLowerCase().includes(searchContainer.toLowerCase());
  });

  const toggleSelect = (item) => {
    if (activeContainerId && containerSales[item.id]?.pallets?.length > 0) {
      setSuccessMessage("You cannot remove a container that already has sale items");
      return;
    }
    setSelectedContainer(item);
  };

  // ---------------------- FETCH PALLETS ----------------------
  useEffect(() => {
    if (!selectedContainer) return;

    const fetchPalletsForContainer = async () => {
      const container = selectedContainer;
      const presale = presaleByContainerId[container.id];
      if (!presale?.pre_sale_unique_id) return;
      if (palletOptionsByContainer[container.id]) return;

      try {
        const res = await SaleServices.getPallets({ pre_sale_uuid: presale.pre_sale_uuid });
        const pallets = res?.data?.pallets || [];
        const palletsWithUUID = pallets.map(p => ({
          pallet_uuid: p.pallet_uuid,
          pallet_pieces: Number(p.pallet_pieces) || 0,
          remaining_no_of_pallets: Math.max(Number(p.remaining_no_of_pallets) || 0, 0)
        }));
        setPalletOptionsByContainer(prev => ({ ...prev, [container.id]: palletsWithUUID }));
      } catch (err) {
        console.error("Failed to fetch pallets for container:", container.name, err);
      }
    };

    fetchPalletsForContainer();
  }, [selectedContainer, presaleByContainerId]);

  // ---------------------- SELECTED CONTAINER ERROR ----------------------
  useEffect(() => {
    if (!selectedContainer) {
      setPresaleError("");
      return;
    }
    const hasPresale = !!presaleByContainerId[selectedContainer.id];
    setPresaleError(hasPresale ? "" : "This container does not have a pre-sale");
  }, [selectedContainer, presaleByContainerId]);

  useEffect(() => {
    if (!activeContainerId && selectedContainer) setActiveContainerId(selectedContainer.id);
  }, [selectedContainer, activeContainerId]);
// Delete a sale item
const handleDeleteSaleItem = (palletId, containerId) => {
  setContainerSales(prev => {
    const updated = { ...prev };
    if (!updated[containerId]) return updated;

    updated[containerId].pallets = updated[containerId].pallets.filter(p => p.id !== palletId);
    return updated;
  });
};

const handleEditSaleItem = (palletId, containerId) => {
  const palletToEdit = containerSales[containerId]?.pallets.find(p => p.id === palletId);
  if (!palletToEdit) return;

  // Add containerId to the pallet object
  setForm(prev => ({
    ...prev,
    pallets: [{ ...palletToEdit, containerId }],
  }));

  setActiveContainerId(containerId);
  setSalePop(true);
  setEditingRow(palletId);
};


 
// ---------------------- FETCH Payment ----------------------
useEffect(() => {
  if (!form.presaleId) return;

  const fetchPayments = async () => {
    try {
      const res = await SaleServices.payments({ sale_uuid: form.presaleId });
      // You can process these if you want, e.g., show existing payment history
    } catch (err) {
      console.error("Failed to fetch sale payments", err);
    }
  };

  fetchPayments();
}, [form.presaleId]);
  // ---------------------- RENDER ----------------------
  if (successMessage) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={() => setSuccessMessage(null)} className="delete-box">✕</div>
            <div className="popup-proceeed-wrapper">
              <span>{successMessage}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }


    return (

  <div className="trip-modal slide-up">
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
          <p>Enter the details of new Sale</p>

          <div className="grid-2">
            {/* ==================== Container Select ==================== */}
            <div className="form-group-select">
              <label>Container</label>

              <div className="custom-select">
                <div className="custom-select-drop">
                  <div className="select-box">
                    {selectedContainer ? (
                      <span>{selectedContainer.name || selectedContainer.title}</span>
                    ) : (
                      <span className="placeholder">Select Container</span>
                    )}
                  </div>

                  <div
                    className="custom-select-icon"
                    onClick={() => setOpenContainerSelect(!openContainerSelect)}
                  >
                    <ChevronDown className={openContainerSelect ? "up" : "down"} />
                  </div>
                </div>

                {openContainerSelect && (
                  <div className="select-dropdown">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchContainer}
                      onChange={(e) => setSearchContainer(e.target.value)}
                      className="search-input"
                    />

                    <div className="option">
                      {filterContainers.map((item) => (
                        <label key={item.id}>
                          <input
                          onClick={() => setOpenContainerSelect(false)}
                            type="radio"
                            checked={selectedContainer?.id === item.id}
                            onChange={() => toggleSelect(item)}
                          />
                          <span>{item.name || item.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* ==================== Pre-sale ID ==================== */}
            <div className="form-group">
              <label>Pre-Sale ID</label>
              <input
                readOnly
                className="readonly-input"
                value={
                  selectedContainer
                    ? presaleByContainerId[selectedContainer.id]?.pre_sale_unique_id || ""
                    : ""
                }
              />
              {presaleError && <small className="error-text">{presaleError}</small>}
            </div>
          </div>

          {/* ==================== Container Details / Pre-sale Info ==================== */}
          {selectedContainer && (
            <div className="sale-grid-3">
              <div className="container-details">
                <div className="collapsed-container">
                  <h4 className="mt-4">{selectedContainer.name} - Pre-sale Details</h4>
                  <ChevronDown
                    onClick={() => toggleCollapsedContainer(selectedContainer.id)}
                    className={collapsedContainers[selectedContainer.id] ? "up" : "down"}
                  />
                </div>
                <ul className={collapsedContainers[selectedContainer.id] ? "" : "d-none"}>
                  {presaleByContainerId[selectedContainer.id] ? (
                    <>
                      <li>Pre-Sale ID: {presaleByContainerId[selectedContainer.id].pre_sale_unique_id}</li>
                      <li>Sale Option: {presaleByContainerId[selectedContainer.id].sale_option}</li>
                      <li>Total Pieces: {presaleByContainerId[selectedContainer.id].wc_pieces}</li>
                      <li>Total Pallets: {presaleByContainerId[selectedContainer.id].total_no_of_pallets}</li>
                      <li>Expected Revenue: ₦{presaleByContainerId[selectedContainer.id].expected_sales_revenue}</li>
                      <li>Status: {presaleByContainerId[selectedContainer.id].status}</li>
                    </>
                  ) : (
                    <li className="error-text">This container has no pre-sale</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* ==================== Customer Section ==================== */}
          <SaleCustomer
            onCustomerResolved={(customer) => setSelectedCustomer(customer)}
          />

          {/* ==================== Sale Details ==================== */}
          <div className="sale-details">
            <div className="sale-header-details">
              <h3 className="title-text">Sale Details</h3>

{isSplitOrMixedSale && (
  <button
    type="button"
    className="add-item-btn"
    onClick={() => {
      const containerId = activeContainerId || selectedContainer?.id;
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
            </div>

            {/* ================= ADD SALE POPUP ================= */}
            <AddSaleItem
              formatNumber={formatNumber}
              form={form}
              setForm={setForm}
              salePop={salePop}
              setSalePop={setSalePop}
              activeContainerId={activeContainerId}
              dynamicContainerOptions={selectedContainer ? [selectedContainer] : []}
              openContainerDropdowns={openContainerDropdowns}
              setOpenContainerDropdowns={setOpenContainerDropdowns}
              openPalletDropdowns={openPalletDropdowns}
              setOpenPalletDropdowns={setOpenPalletDropdowns}
              palletOptionsByContainer={palletOptionsByContainer}
              addPallet={addPallet}
              handlePalletChange={handlePalletChange}
              handleSaveSaleItems={handleSaveSaleItems}
              removeAddSale={removeAddSale}
              isPurchasePriceLowerThanPresale={isPurchasePriceLowerThanPresale}
            />

            {/* ================= ACTIVE CONTAINER TOTALS / TABLE ================= */}
            {activeContainer && activeContainer.pallets.length > 0 && (
              <div className="sale-row">
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
            )}

            {/* ================== Totals & Payments ================== */}
            <div className="grid-2 mt-3">
  {/* Discount */}
  <div className="form-group">
    <label>Discount</label>
    <input
      type="text"
      min={0}
      value={discount}
      onChange={(e) => {
        const value = (e.target.value) || 0;
        setDiscount(value);
      }}
    />
  </div>

  {/* Payment Method */}
<div className="form-group-select">
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
 <div className="form-group">
                <label style={{ color: "#581aae" }}>Total Sale Amount</label>

<input
  type="text"
  readOnly={!isBoxSale}
  value={
  isBoxSale
    ? formatMoneyNGN(form.totalSaleAmount - discount)
    : formatMoneyNGN(computedTotalSaleAmount - discount)
}
  onChange={(e) => {
    if (!isBoxSale) return;
    const raw = parseMoney(e.target.value);
    setForm(prev => ({ ...prev, totalSaleAmount: raw }));
  }}
/>
              </div>


              <div className="form-group">
                <label style={{ color: "#581aae" }}>Amount Paid</label>
                <input
                  type="text"
                  value={formatMoneyNGN(amountPaid)}
                  onChange={(e) => {
                    const raw = parseMoney(e.target.value);
                    const maxAmount = isBoxSale ? Number(form.totalSaleAmount || 0) : computedTotalSaleAmount;
                    if (raw > maxAmount) {
                      setSuccessMessage("Amount cannot exceed total sale amount");
                      return;
                    }
                    setAmountPaid(raw);
                  }}
                />
              </div>
            </div>

            {/* ================== Action Buttons ================== */}
            <div className="btn-row">
              <button
                className="cancel"
                onClick={() => setView(sales && sales.length > 0 ? "table" : "empty")}
              >
                Cancel
              </button>
              <button
                className="create"
                disabled={
                  !!presaleError ||
                  (isBoxSale && !form.totalSaleAmount) ||
                  (!isBoxSale && computedTotalSaleAmount <= 0)
                }
                onClick={handleClick}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

    );
  };

  export default CreateSale;


