import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/Sale/createPresale.scss";
import { ChevronDown, X } from "lucide-react";

export const saleType = [
  { id: 1, saleName: "Box Sale" },
  { id: 2, saleName: "Split Sale" },
  { id: 3, saleName: "Mixed Sale" },
];

const CreatePreSale = ({ users, setUsers, setView, openSubmenu,containersData }) => {
  const [form, setForm] = useState({
    saleOption: "",
    containerOption:"",
    wcAverageWeight: "",
    wcPieces: "",
    pricePerKg: "",
    pricePerPic:"",
    noOfPallets: "",
    pallets: [{ pieces: "", count: "" }],
  });

  const [successMessage, setSuccessMessage] = useState(null);

  // -----------------------------
  // SALE OPTION SELECT
  // -----------------------------
  const [openSelect2, SetOpenSelect2] = useState(false);
  const [selectedValues2, setSelectedValues2] = useState([]);

  const toggleSelect2 = (item) => {
    setSelectedValues2([item]);
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
  const filterOption = (containersData ?? [])
  .filter((item) => {
    const title = item.title ?? "";
    const modelName = item.modelName ?? "";

    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      modelName.toLowerCase().includes(search.toLowerCase())
    );
  })
  // .slice(0, 5);


  const toggleSelect = (item) => {
    setSelectedValues((prev) => {
      const exists = prev.some((v) => v.id === item.id);
      if (exists) {
        return prev.filter((v) => v.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  // -----------------------------
  // FORM HANDLERS
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePalletChange = (index, field, value) => {
    const updated = [...form.pallets];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, pallets: updated }));
  };

  const addPallet = () => {
    setForm((prev) => ({
      ...prev,
      pallets: [...prev.pallets, { pieces: "", count: "" }],
    }));
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
  // CREATE PRE-SALE (Corrected)
  // -----------------------------
  const handleCreate = () => {
    const newSale = {
      ...form,

      saleOption: selectedValues2[0]?.saleName || "",
      selectedContainers: selectedValues,

      noOfPallets: form.noOfPallets,
      containerNames: selectedValues.map((c) => c.title),

      expectedRevenue: expectedRevenue(),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

   setUsers(prev => [newSale, ...prev]);
setSuccessMessage("Pre-sale successfully created");
  };

 const closePopup = () => {
  setSuccessMessage(null);
  setView("table"); 
  if (openSubmenu) openSubmenu("users");
};

  const selectedSale = selectedValues2[0]?.saleName;

  // -----------------------------
  // SUCCESS POPUP
  // -----------------------------
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

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div className="trip-modal">
      <div className="create-container-modal">
        <div className="create-container-card">

          <div className="header">
            <h2>Create Pre-Sale</h2>
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
                    <div className="select-box">
                      {selectedValues2.length === 0 ? (
                        <span className="placeholder">Sale Option</span>
                      ) : (
                        <span className="tag">{selectedValues2[0].saleName}</span>
                      )}
                    </div>
                    <div className="custom-select" onClick={() => SetOpenSelect2(!openSelect2)}>
                      <ChevronDown className={openSelect2 ? "up" : "down"} />
                    </div>
                  </div>

                  <div className={openSelect2 ? "select-dropdown2 select-dropdown" : "d-none"}>
                    {saleType.map((item) => {
                      const selected = selectedValues2[0]?.id === item.id;
                      return (
                        <label key={item.id}>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleSelect2(item)}
                          />
                          <span>{item.saleName}</span>
                        </label>
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
                    <div className="select-box">
                      {selectedValues.length === 0 ? (
                        <span className="placeholder">Select Container(s)</span>
                      ) : (
                        <div className="selected-tags">
                          {selectedValues.map((item) => (
                            <span className="tag" key={item.sn}>{item.title}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="custom-select" onClick={() => SetOpenSelect(!openSelect)}>
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
                        const checked = selectedValues.some((v) => v.id === item.id);
                        return (
                          <label key={item.id} onClick={() => SetOpenSelect(false) }>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleSelect(item)}/>
                              <div className="grid-option"
                              style={{
                                display:"flex",
                                gap:"10px"
                              }}
                              >
                                <span>{item.sn} :</span>
                            <span> {item.modelName} ({item.title})</span>
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
            <div className="grid-3">
              {selectedValues.map((container) => (
                <div key={container.id} className="container-details">
                  <h4>{container.title}</h4>
                  <ul>
                    <li>Container ID: {container.sn}</li>
                    <li>Description: {container.description}</li>
                    <li>Tracking Number:TN {container.trackingNumber}</li>
                    <li>Unit Pieces: {container.unitpieces}</li>
                    <li>Unit Price: {container.unitPrice}</li>
                    <li>AmountUsd: {container.amountUsd}</li>
                    <li>Quoted AmountUsd: {container.quotedAmountUsd}</li>
                    <li>Created Date: {formatDate(container.createdAt)}</li>
                  </ul>
                </div>
              ))}
            </div>

            {/* Pre-sale details section */}
            <h4 className="mt-5 mb-3">Pre-sale Details</h4>

            {(selectedSale === "Split Sale" || selectedSale === "Mixed Sale") && (
              <div className="from-pallet-option">
                <div className="grid-2">
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
                </div>

                <div className="grid-split-3">
                  <div className="form-group">
                    <label>Price Per Pic (NGN)</label>
                    <input
                      name="pricePerPic"
                      value={form.pricePerPic}
                      onChange={handleChange}
                      placeholder="Enter Price Per Pic"
                    />
                  </div>
                 
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
                    <label>Price Per Kg (NGN)</label>
                    <input
                      name="pricePerKg"
                      value={form.pricePerKg}
                      onChange={handleChange}
                      placeholder="Enter Price Per KG"
                    />
                  </div>
                </div>

                <div className="pallet-section">
                  <div className="header">
                    <label>Pallet Distribution</label>
                    <button type="button" onClick={addPallet}>Add Pallet</button>
                  </div>

                  {form.pallets.map((pallet, index) => (
                    <div key={index}>
                      <div className="grid-2">
                        <div className="form-group">
                          <label>Pallet Pieces</label>
                          <input
                            type="number"
                            value={pallet.pieces}
                            onChange={(e) =>
                              handlePalletChange(index, "pieces", e.target.value)
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label>No. of Pallets</label>
                          <input
                            type="number"
                            value={pallet.count}
                            onChange={(e) =>
                              handlePalletChange(index, "count", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="pallet-btn">
                        <button type="button" onClick={() => removePallet(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-group">
                    <label>Expected Sale Revenue (NGN)</label>
                    <input value={expectedRevenue()} readOnly placeholder="Auto-calculated" />
                  </div>
              </div>
            )}

            {/* Box Sale */}
            {selectedSale === "Box Sale" && (
              <div className="from-box-sale">
                <div className="grid-2">
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
                    <label>Price Per Kg (NGN)</label>
                    <input
                      name="pricePerKg"
                      value={form.pricePerKg}
                      onChange={handleChange}
                      placeholder="Enter Price Per KG"
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
                    <label>Price Per Pic (NGN)</label>
                    <input
                      name="pricePerPic"
                      value={form.pricePerPic}
                      onChange={handleChange}
                      placeholder="Enter Price Per Pic"
                    />
                  </div>
                  <div className="form-group">
                    <label>Expected Sale Revenue (NGN)</label>
                    <input value={expectedRevenue()} readOnly placeholder="Auto-calculated" />
                  </div>
                </div>
              </div>
            )}

            <div className="btn-row">
             <button className="cancel" onClick={() => setView("table")}>
              Cancel
              </button>
              <button className="create" onClick={handleCreate}>
                Create Pre-sale
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


export default CreatePreSale;