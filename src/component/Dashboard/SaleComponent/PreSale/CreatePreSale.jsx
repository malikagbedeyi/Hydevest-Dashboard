import React, { useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/create.scss";
import { ChevronDown, X } from "lucide-react";
import { PresaleServices } from "../../../../services/Sale/presale";

export const saleType = [
  { id: 1, saleName: "Box Sale" },
  { id: 2, saleName: "Split Sale" },
  // { id: 3, saleName: "Mixed Sale" },
];

const CreatePreSale = ({ setDatas, setView, containersData, refreshTable }) => { 
  const [form, setForm] = useState({
    saleOption: "",containerOption: "",wcAverageWeight: "", wcPieces: "", 
    container_loaded_pieces:"",
    pricePerKg: "",pricePerPic: "",noOfPallets: "",pallets: [{ pieces: "", count: "" }],
  });

  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState(null); 

  // -----------------------------
  // SALE OPTION SELECT
  // -----------------------------
  const [openSelect2, SetOpenSelect2] = useState(false);
  const [selectedValues2, setSelectedValues2] = useState([]);
const [expandedContainers, setExpandedContainers] = useState([]);

  const toggleSelect2 = (item) => {
  setSelectedValues2([item]);
  setSelectedValues([]); 
  setForm((prev) => ({ ...prev, saleOption: item.saleName }));
  SetOpenSelect2(false);
};

  const formatDate = (date) =>
    date
      ? new Date(date)
          .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          .replace(/ /g, "-")
      : "-";

  // -----------------------------
  // CONTAINER MULTI SELECT
  // -----------------------------
  const [openSelect, SetOpenSelect] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);

const filterOption = (containersData ?? []).filter((item) => {
  const title = item.title ?? "";
  const containerId = item.container_unique_id ?? "";
  const trackingNumber = item.tracking_number ?? ""
  return (
    title.toLowerCase().includes(search.toLowerCase()) || 
    containerId.toLowerCase().includes(search.toLowerCase()) || 
    trackingNumber.toLowerCase().includes(search.toLowerCase()) 
  );
});


const toggleSelect = (item) => {
  setSelectedValues((prev) => {
    const exists = prev.some(
      (v) => v.container_uuid === item.container_uuid
    );

    // If clicked again → unselect
    if (exists) {
      return prev.filter(
        (v) => v.container_uuid !== item.container_uuid
      );
    }

    let maxAllowed = Infinity;

    if (selectedSale === "Box Sale" || selectedSale === "Split Sale") {
      maxAllowed = 1;
    }

    if (selectedSale === "Mixed Sale") {
      maxAllowed = 2;
    }

    // If only 1 allowed → replace the previous selection
    if (maxAllowed === 1) {
      return [item];
    }

    // If 2 allowed (Mixed Sale)
    if (prev.length >= maxAllowed) {
      const updated = [...prev];
      updated.shift(); // remove first selected
      return [...updated, item];
    }

    return [...prev, item];
  });
};

const toggleContainerDetails = (uuid) => {
  setExpandedContainers((prev) =>
    prev.includes(uuid)
      ? prev.filter((id) => id !== uuid)
      : [...prev, uuid]
  );
};
  // -----------------------------
  // FORM HANDLERS
  // -----------------------------
  const cleanNumber = (value) => value.replace(/[^\d.]/g, "");

  const formatMoneyNGN = (value) =>
    value === "" ? "" : "₦" + Number(value).toLocaleString("en-NG");

  const formatNumber = (value) =>
    value === "" ? "" : Number(value).toLocaleString("en-NG");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleaned = cleanNumber(value);
    setForm((prev) => ({ ...prev, [name]: cleaned }));
  };

  const handlePalletNumberChange = (index, field, value) => {

  if (/^\d*$/.test(value)) {
    const updated = [...form.pallets];
    updated[index][field] = value;

    setForm((prev) => ({
      ...prev,
      pallets: updated,
    }));
  }
};
  const addPallet = () => {
    setForm((prev) => ({ ...prev, pallets: [...prev.pallets, { pieces: "", count: "" }] }));
  };
  const removePallet = (index) => {
    const updated = form.pallets.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, pallets: updated }));
  };

  const expectedRevenue = () => {
    const totalPieces = parseFloat(form.wcPieces) || 0;
    const price = parseFloat(form.pricePerPic) || 0;
    return (totalPieces * price).toFixed(2);
  };

  // -----------------------------
  // DERIVED TOTALS
  // -----------------------------
  const totalPalletCount = form.pallets.reduce((sum, p) => sum + Number(p.count || 0), 0);
  const totalPalletPieces = form.pallets.reduce(
    (sum, p) => sum + Number(p.pieces || 0) * Number(p.count || 0),
    0
  );
  const maxPalletsAllowed = Number(form.noOfPallets || 0);
  const maxPiecesAllowed = Number(form.wcPieces || 0);
  const palletCountExceeded = maxPalletsAllowed > 0 && totalPalletCount > maxPalletsAllowed;
  const palletPiecesExceeded = maxPiecesAllowed > 0 && totalPalletPieces > maxPiecesAllowed;

  const getValidationError = () => {
    if (palletCountExceeded)
      return `❌ Total pallets entered (${totalPalletCount}) must not exceed Total Number of Pallets (${maxPalletsAllowed})`;
    if (palletPiecesExceeded)
      return `❌ Total pallet pieces (${totalPalletPieces}) must not exceed WC Pieces (${maxPiecesAllowed})`;
    return null;
  };
  const palletCountEqual =
  maxPalletsAllowed > 0 && totalPalletCount === maxPalletsAllowed;
const palletPiecesEqual =
  maxPiecesAllowed > 0 && totalPalletPieces === maxPiecesAllowed;

const palletCountLess =
  maxPalletsAllowed > 0 && totalPalletCount < maxPalletsAllowed;

const palletPiecesLess =
  maxPiecesAllowed > 0 && totalPalletPieces < maxPiecesAllowed;

  // -----------------------------
  // HANDLE CREATE WITH API
  // -----------------------------
const getBackendErrorMessage = (error) => {
  const data = error?.response?.data;

  if (!data) return "❌ Something went wrong. Please try again.";

  // Case 1: simple string message
  if (typeof data.message === "string") {
    return `❌ ${data.message}`;
  }

  // Case 2: array of errors
  if (Array.isArray(data.message)) {
    return `❌ ${data.message.join(", ")}`;
  }

  // Case 3: Laravel-style validation errors object
  if (data.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors).flat();
    return `❌ ${messages.join(", ")}`;
  }

  return "❌ Request failed. Please check your input.";
};
const handleCreate = async () => {
  const error = getValidationError();
  if (error) {
    setPopupMessage(error);
    setPopupType("error");
    return;
  }

  if (!selectedSale) {
    setPopupMessage("Select a sale option");
    setPopupType("error");
    return;
  }

  if (selectedValues.length === 0) {
    setPopupMessage("Select at least one container");
    setPopupType("error");
    return;
  }

  if (Number(form.wcAverageWeight) <= 0 || Number(form.wcPieces) <= 0) {
    setPopupMessage("WC Average Weight and WC Pieces must be > 0");
    setPopupType("error");
    return;
  }

  let payload = null;
  let response;

  try {
    /* -----------------------
       BOX SALE
    ------------------------ */
    if (selectedSale === "Box Sale") {
      if (selectedValues.length !== 1) {
        setPopupMessage("Box Sale requires exactly 1 container");
        setPopupType("error");
        return;
      }

      payload = {
        container_uuid: selectedValues[0]?.container_uuid,
        wc_average_weight: Number(form.wcAverageWeight),
        container_loaded_pieces:Number(form.container_loaded_pieces),
        wc_pieces: Number(form.wcPieces),
        price_per_kg: Number(form.pricePerKg),
        price_per_piece: Number(form.pricePerPic),
      };

      response = await PresaleServices.createBoxSale(payload);
    }

    /* -----------------------
       SPLIT SALE
    ------------------------ */
    if (selectedSale === "Split Sale") {
      if (selectedValues.length !== 1) {
        setPopupMessage("Split Sale requires exactly 1 container");
        setPopupType("error");
        return;
      }

      payload = {
        container_uuid: selectedValues[0]?.container_uuid,
        wc_average_weight: Number(form.wcAverageWeight),
        wc_pieces: Number(form.wcPieces),
        price_per_kg: Number(form.pricePerKg),
        container_loaded_pieces:Number(form.container_loaded_pieces),
        price_per_piece: Number(form.pricePerPic),
        total_no_of_pallets: Number(form.noOfPallets),
        pallet_pieces: form.pallets.map(p => p.pieces).join(","),
        no_of_pallets: form.pallets.map(p => p.count).join(","),
      };

      response = await PresaleServices.createSplitSale(payload);
    }

    /* -----------------------
       MIXED SALE
    ------------------------ */
    if (selectedSale === "Mixed Sale") {
      if (selectedValues.length !== 2) {
        setPopupMessage("Mixed Sale requires exactly 2 containers");
        setPopupType("error");
        return;
      }

      payload = {
        container_uuid: selectedValues[0]?.container_uuid,
        container_uuid_two: selectedValues[1]?.container_uuid,
        wc_average_weight: Number(form.wcAverageWeight),
        wc_pieces: Number(form.wcPieces),
        price_per_kg: Number(form.pricePerKg),
        container_loaded_pieces:Number(form.container_loaded_pieces),
        price_per_piece: Number(form.pricePerPic),
        total_no_of_pallets: Number(form.noOfPallets),
        pallet_pieces: form.pallets.map(p => p.pieces).join(","),
        no_of_pallets: form.pallets.map(p => p.count).join(","),
      };

      response = await PresaleServices.createMixedSale(payload);
    }

    /* -----------------------
       SUCCESS HANDLING
    ------------------------ */
   if (response?.data?.success) {
    
  if (refreshTable) refreshTable(); 
  setPopupMessage("✅ Pre-sale successfully created");
  setPopupType("success");
}
   else {
  setPopupMessage(`❌ ${response?.data?.message || "Failed to create pre-sale"}`);
  setPopupType("error");
  return;
}
  } catch (err) {
  console.error("Error creating pre-sale:", err.response?.data || err);

  const backendMessage = getBackendErrorMessage(err);
  setPopupMessage(backendMessage);
  setPopupType("error");
  
}
};

  const closePopup = () => {
    setPopupMessage(null);
    if (popupType === "success") setView("table");
    setPopupType(null);
  };

  const selectedSale = selectedValues2[0]?.saleName;

const hasStartedPalletDistribution = form.pallets.some(
  (p) => Number(p.count || 0) > 0 || Number(p.pieces || 0) > 0
);

  // -----------------------------
  // RENDER JSX (UNCHANGED)
  // -----------------------------
  if (popupMessage) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={closePopup} className="delete-box" style={{ color: "red" }}>✕</div>
            <div className="popup-proceeed-wrapper">
              <span style={{ color: popupType === "error" ? "red" : "green", fontWeight: 600 }}>
                {popupMessage}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // JSX (UNCHANGED)
  // -----------------------------
  return (
    <div className="trip-modal slide-up">
      <div className="create-container-modal">
        <div className="create-container-card">

          <div className="header">
            <div className="header-content">
            <h2>Create Pre-Sale</h2>
            </div>
            <X size={18} className="close" onClick={() => setView("table")} />
          </div>
          <div className="tab-section">
            <p>Enter the details of new Pre-sale</p>
            <div className="grid-2">
              {/* Sale Option */}
              <div className="form-group-select">
                <label>Sale Option</label>
                <div className="custom-select">
                  <div className="custom-select-drop">
                    <div className="select-box" onClick={() => SetOpenSelect2(!openSelect2)}>
                      {selectedValues2.length === 0 ? (
                        <span className="placeholder">Sale Option</span>
                      ) : (
                        <span className="tag">{selectedValues2[0].saleName}</span>
                      )}
                    </div>
                    <div className="custom-select-icon" onClick={() => SetOpenSelect2(!openSelect2)}>
                      <ChevronDown className={openSelect2 ? "up" : "down"} />
                    </div>
                  </div>

                  <div className={openSelect2 ? "select-dropdown2 select-dropdown" : "d-none"}>
                    {saleType.map((item) => {
                      const selected = selectedValues2[0]?.id === item.id;
                      
                      return (
                        <div className="option-item">
                        <label key={item.id}>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleSelect2(item)}
                          />
                          <span>{item.saleName}</span>
                        </label>
                        </div>
                      );
                   
                    })}
                  </div>
                </div>
              </div>

              {/* Containers */}
              <div className="form-group-select">
                <label>Container</label>
                <div className="custom-select">
                  <div className="custom-select-drop">
                    <div className="select-box" onClick={() => {if (!selectedSale) {setPopupMessage("Please select a Sale Option first");setPopupType("error");return;}SetOpenSelect(!openSelect);}}>
                      {selectedValues.length === 0 ? (
                        <span className="">Select Container(s)</span>
                      ) : (
                        <div className="selected-tags">
                          {selectedValues.map((item) => (
                            <span className="tag" key={item.container_uuid}>{item.tracking_number}</span>
                            ))}
                        </div>
                      )}
                    </div>
                    <div className="custom-select-icon" onClick={() => {if (!selectedSale) {setPopupMessage("Please select a Sale Option first");setPopupType("error");return;}SetOpenSelect(!openSelect);}}>
                      <ChevronDown className={openSelect ? "up" : "down"} />
                    </div>
                  </div>
                  <div className={openSelect ? "select-dropdown" : "d-none"}>
                    <input
                      type="text"
                      className="search-input"
                      value={search}
                      placeholder="Search..."
                      onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="option">
                      {filterOption.map((item) => {
                        const checked = selectedValues.some((v) => v.container_uuid === item.container_uuid);
                        return (
                          <label key={item.container_unique_id} >
                            <input  onClick={() => SetOpenSelect(false)}
                              type="checkbox" 
                              checked={checked}
                              onChange={() => toggleSelect(item)}/>
                              <div className="grid-option"
                              style={{
                                display:"flex",
                                gap:"10px"
                              }}
                              >
                            <span>{item.container_unique_id} :</span>
                            <span style={{letterSpacing:"1",color:"#581aae",fontWeight:"520"}}>{item.tracking_number}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Container Details */}
            <div className="">
   {selectedValues.map((container) => {
const isExpanded = expandedContainers.includes(container.container_uuid);


  return (
    <div className="sale-grid-3" key={container.container_uuid}>
      <div className="container-details">
        <div
          className="container-header"
          style={{ display: "flex", justifyContent: "space-between",alignItems:"center", cursor: "pointer" }}
          onClick={() => toggleContainerDetails(container.container_uuid)} >
          <h5 className="" style={{color:"#581aae"}} >TN {container.tracking_number}</h5>
          <ChevronDown
            className={isExpanded ? "up" : "down"}
            size={18}
          />
        </div>

        {isExpanded && (
          <ul style={{color:"gray"}}>
            <li>Container ID : {container.container_unique_id}</li> 
            <li>Description: {container.desc}</li>
            <li>Title : {container.title}</li>
            <li>Total Extimated Price NGN : {formatMoneyNGN(container.total_estimated_price_ngn ?? "0")}</li>
            <li>Average Weight: {container.average_weight ?? "0"}</li>
            <li> Pieces: {container.pieces ?? "0"}</li>
            <li>Unit Price ($): {container.unit_price_usd ?? "0"}</li>
            <li>Amount ($): ${Number(container.unit_price_usd  * container.pieces ?? 0).toLocaleString()}</li>
             {container.funding === "ENTITY" ? (
              <>
              <li>Max Weight: {container.max_weight ?? "-"}</li>
               <li>Status: {container.status === 1 ? "Approved": "Pending"}</li>
               </> ) : (<>
             <li>Quoted Price ($): {container.quoted_price_usd ?? "-"}</li>
            <li>Quoted Amount ($): ${Number((container.quoted_price_usd ?? 0) * (container.pieces ?? 0)).toLocaleString()}</li>
            </>)}
            <li> Funding: {container.funding }</li>
            <li>Created Date: {formatDate(container.created_at)}</li>
          </ul>
        )}
      </div>
    </div>
  );
})}
            </div>

            <h4 className="mt-5 mb-4" style={{color:"#581aae"}}>Pre-sale Details</h4>
            {(selectedSale === "Split Sale" || selectedSale === "Mixed Sale") && (
              <div className="from-pallet-option">
                <div className="grid-split-3">
                  <div className="form-group">
                    <label>WC Average Weight (kg)</label>
                    <input
                      name="wcAverageWeight"
                      value={form.wcAverageWeight}
                      onChange={handleChange}
                      placeholder="Enter WC Average Weight"
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Number of Pallets</label>
                    <input
                      name="noOfPallets"
                      value={form.noOfPallets}
                      onChange={handleChange}
                      placeholder="Enter Total Number of Pallets"
                    />
                  </div>
                  <div className="form-group">
                    <label >Container Loaded Pieces</label>
                     <input
                      name="container_loaded_pieces"
                      value={formatNumber(form.container_loaded_pieces)}
                      onChange={handleChange}
                      placeholder="Enter Container Loaded Pieces"
                    />
                  </div>
                </div>
                <div className="grid-split-3">
                  <div className="form-group">
                    <label>Price Per Pic (₦)</label>
                    <input
                      name="pricePerPic"
                      value={formatMoneyNGN(form.pricePerPic)}
                      onChange={handleChange}
                      placeholder="Enter Price Per Pic"
                    />
                  </div>
                 
                  <div className="form-group">
                    <label>WC Pieces</label>
                    <input
                      name="wcPieces"
                      value={formatNumber(form.wcPieces)}
                      onChange={handleChange}
                      placeholder="Enter WC Pieces"
                    />
                  </div>
                  <div className="form-group">
                    <label>Price Per Kg (₦)</label>
                    <input
                      name="pricePerKg"
                      value={formatMoneyNGN(form.pricePerKg)}
                      onChange={handleChange}
                      placeholder="Enter Price Per KG"
                    />
                  </div>
                </div>
                <div className="pallet-section">
                  <div className="header">
                    <h4 style={{color:"#581aae"}}>Pallet Distribution</h4>
                    <button className="create mb-3" type="button" onClick={addPallet}>Add Pallet</button>
                  </div>
                  {palletCountExceeded && (
  <p className="error-text" style={{color:"red"}}>
    ❌ Total pallets entered ({totalPalletCount}) must not  exceeds
    Total Number of Pallets ({maxPalletsAllowed})
  </p>
)}

{palletPiecesExceeded && (
  <p className="error-text" style={{color:"red"}}>
    ❌ Total pallet pieces ({totalPalletPieces}) must not exceeds
    WC Pieces ({maxPiecesAllowed})
  </p>
)}
{/* Pallet Distribution Warnings */}
{hasStartedPalletDistribution && !palletCountExceeded && !palletPiecesExceeded && (
  <>
    {/* Total Pallets */}
    <p
      style={{
        color: palletCountEqual ? "green" : "#d4a017",
        fontWeight: palletCountEqual ? 600 : 500,
        margin: 0,
      }}
    >
      {palletCountEqual
        ? `✅ Total number of pallets in the distribution tallies with total number of Pre-Sale pallets (${totalPalletCount}/${maxPalletsAllowed})`
        : `⚠️ Total number of pallets in the distribution does NOT tally with total number of Pre-Sale pallets (${totalPalletCount}/${maxPalletsAllowed})`}
    </p>

    {/* Total Pieces */}
    <p
      style={{
        color: palletPiecesEqual ? "green" : "#d4a017",
        fontWeight: palletPiecesEqual ? 600 : 500,
      }}
    >
      {palletPiecesEqual
        ? `✅ Total number of pallet pieces in the distribution tallies with Pre-Sale WC Pieces (${totalPalletPieces}/${maxPiecesAllowed})`
        : `⚠️ Total number of pallet pieces in the distribution does NOT tally with Pre-Sale WC Pieces (${totalPalletPieces}/${maxPiecesAllowed})`}
    </p>
  </>
)}
                  {form.pallets.map((pallet, index) => (
                    <div key={index}>
                      <div className="grid-2">
                        <div className="form-group">
                          <label>Pallet Pieces</label>
                         <input
  type="text"
  value={pallet.pieces}
  onChange={(e) =>
    handlePalletNumberChange(index, "pieces", e.target.value)
  }
/>
                        </div>

                        <div className="form-group">
                          <label>No. of Pallets</label>
                          <input
  type="text"
  value={pallet.count}
  onChange={(e) =>
    handlePalletNumberChange(index, "count", e.target.value)
  }
/>
                        </div>
                      </div>

                      <div className="pallet-btn">
                        <button className="remove mb-3" type="button" onClick={() => removePallet(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-group">
                    <label>Expected Sale Revenue (₦)</label>
                    <input value={formatMoneyNGN(expectedRevenue())} readOnly placeholder="Auto-calculated" />
                  </div>
              </div>
            )}
            {/* Box Sale */}
            {selectedSale === "Box Sale" && (
              <div className="from-box-sale">
                <div className="grid-split-3">
                  <div className="form-group">
                    <label>WC Average Weight (kg)</label>
                    <input
                      name="wcAverageWeight"
                      value={form.wcAverageWeight}
                      onChange={handleChange}
                      placeholder="Enter WC Average Weight"
                    />
                  </div>
                  <div className="form-group">
                    <label>Price Per Kg (₦)</label>
                    <input
                      name="pricePerKg"
                      value={form.pricePerKg}
                      onChange={handleChange}
                      placeholder="Enter Price Per KG"
                    />
                  </div>        
                  <div className="form-group">
                    <label >Container Loaded Pieces</label>
                     <input
                      name="container_loaded_pieces"
                      value={formatNumber(form.container_loaded_pieces)}
                      onChange={handleChange}
                      placeholder="Enter Container Loaded Pieces"
                    />
                  </div>
                </div>
                <div className="grid-split-3">
                 
                <div className="form-group">
                    <label>WC Pieces</label>
                    <input
                      name="wcPieces"
                      value={form.wcPieces}
                      onChange={handleChange}
                      placeholder="Enter WC Pieces"
                    />
                  </div>
                  <div className="form-group">
                    <label>Price Per Pic (₦)</label>
                    <input
                      name="pricePerPic"
                      value={form.pricePerPic}
                      onChange={handleChange}
                      placeholder="Enter Price Per Pic"
                    />
                  </div>
                  <div className="form-group">
                    <label>Expected Sale Revenue (₦)</label>
                    <input value={expectedRevenue()} readOnly placeholder="Auto-calculated" />
                  </div>
                </div>
              </div>
            )}

            <div className="btn-row">
             <button className="cancel" onClick={() => setView("table")}>
              Cancel
              </button>
              <button className="create" onClick={handleCreate}
              >
                Create Pre-sale </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


export default CreatePreSale;