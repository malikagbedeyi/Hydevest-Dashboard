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

        purchasePrice: "",
        noOfPallets: "",

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

const buildCreatePayload = (customer) => {
  if (!customer?.user_uuid) {
    throw new Error("Customer is required");
  }

  const containers = Object.values(containerSales);
  if (!containers.length) {
    throw new Error("At least one container is required");
  }

  const container = containers[0];
  const presale = presaleByContainerId[container.container.id];

  if (!presale?.pre_sale_uuid) {
    throw new Error("Missing pre-sale UUID");
  }

  const purchase_prices = [];
  const pallets_purchased = [];
  const pallet_uuids = [];

  container.pallets.forEach(p => {
    if (!p.noOfPallets || !p.purchasePrice) return;

    purchase_prices.push(p.purchasePrice);
    pallets_purchased.push(p.noOfPallets);
    pallet_uuids.push(p.pallet_uuid);
  });

  if (
    !purchase_prices.length ||
    purchase_prices.length !== pallets_purchased.length ||
    pallets_purchased.length !== pallet_uuids.length
  ) {
    throw new Error("Invalid pallet data");
  }

  const total_sale_amount = container.pallets.reduce(
    (sum, p) => sum + p.total,
    0
  );

  return {
    container_uuid: container.container.container_uuid,
    pre_sale_uuid: presale.pre_sale_uuid,
    customer_uuid: customer.user_uuid,

    purchase_prices: purchase_prices.join(","),
    pallets_purchased: pallets_purchased.join(","),
    pallet_uuids: pallet_uuids.join(","),

    total_sale_amount,
    amount_paid: Number(amountPaid) || 0,
  };
  
};

  const handleCreate = async (customer) => {
    try {
      const payload = buildCreatePayload(customer);
      console.log("Sale payload ready to send:", payload);
      await onCreate(payload);
      setView("table");
      console.log("FINAL PAYLOAD:", payload);
    } catch (err) {
      console.error("Create sale failed", err);
      if (err.response) setSuccessMessage(err.response.data?.message || "Failed to create sale");
      else setSuccessMessage(err.message || "Failed to create sale");
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
const palletsWithUUID = pallets.map(p => ({
  pallet_uuid: p.pallet_uuid,
  pallet_pieces: Number(p.pallet_pieces) || 0,
  remaining_no_of_pallets: Number(p.remaining_no_of_pallets) || 0
}));
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

  setContainerSales(prev => {
    const updated = { ...prev };

    form.pallets.forEach(p => {
      const {
        containerId,
        pallet_uuid,
        purchasePrice,
        noOfPallets,
        remaining_no_of_pallets,
      } = p;

      if (!containerId || !pallet_uuid) return;

      const safeQty = Math.min(
        Number(noOfPallets) || 0,
        Number(remaining_no_of_pallets) || 0
      );

      if (!updated[containerId]) {
        const containerMeta = selectedValues.find(c => c.id === containerId);
        if (!containerMeta) return;

        updated[containerId] = {
          container: {
            id: containerMeta.id,
            container_uuid: containerMeta.container_uuid,
            name: containerMeta.name,
          },
          pallets: [],
        };
      }

 if (!p.palletOption || !p.purchasePrice || !safeQty) return;

const palletData = {
  id: p.id,
  pallet_uuid,
  palletOption: Number(p.palletOption),
  purchasePrice: Number(p.purchasePrice),
  noOfPallets: safeQty,
  total:
    Number(p.purchasePrice) *
    safeQty *
    Number(p.palletOption),
  createdAt: p.createdAt,
};

      const index = updated[containerId].pallets.findIndex(
        x => x.pallet_uuid === pallet_uuid
      );

      if (index === -1) {
        updated[containerId].pallets.push(palletData);
      } else {
        updated[containerId].pallets[index] = palletData;
      }
    });

    return updated;
  });

  setForm(prev => ({ ...prev, pallets: [] }));
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
                <label key={item.id} onClick={() => setOpenContainerSelect(false)}>
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


