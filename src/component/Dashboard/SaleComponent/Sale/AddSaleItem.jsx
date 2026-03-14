import React from "react";
import { X, ChevronDown, Plus } from "lucide-react";
import { totalPurchase } from "./hooks/useSaleCalculations";
// import "../../../../assets/Styles/dashboard/create.scss";

const AddSaleItem = ({
  form,
  setForm,
  salePop,
  setSalePop,
  dynamicContainerOptions,
  formatNumber,
  openPalletDropdowns,
  setOpenPalletDropdowns,
  palletOptionsByContainer,
  activeContainerId,
  addPallet,
  handlePalletChange,
  handleSaveSaleItems,
  removeAddSale,
  isPurchasePriceLowerThanPresale,
}) => {
  if (!salePop) return null;

  const togglePalletDropdown = (index) => {
    setOpenPalletDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const onlyNumbers = (value) => value.replace(/[^0-9]/g, "");

  return (
    <div className="add-sale-popup">
      <div className="popup-overlay" />
      <div className="add-sale-content">
        <X size={18} className="close" onClick={() => setSalePop(false)} />

        <div className="sale-pallet-section">
          {/* ===== Header ===== */}
          <div className="header">
            <h5 style={{ fontSize: "1.2vw" }}>Add Sale</h5>
            {/* ===== Add More Button ===== */}
            <button
              type="button"
              className="add-more-btn"
              onClick={() => {const containerId =activeContainerId ||dynamicContainerOptions?.[0]?.id ||null;
                if (!containerId) return;

                const palletList = palletOptionsByContainer[containerId] || [];
                if (!palletList.length) {
                  alert("No pallets available for this container");
                  return;
                }

                addPallet(containerId);
              }}
            >
              <Plus size={16} /> Add More
            </button>
          </div>

          {/* ===== Pallet Items ===== */}
          {form.pallets.map((pallet, index) => {
            const palletOptions =
              pallet.containerId ? palletOptionsByContainer[pallet.containerId] || [] : [];

            const remainingPallets =
              palletOptions.find((p) => p.pallet_uuid === pallet.pallet_uuid)
                ?.remaining_no_of_pallets ?? 0;

            return (
              <div key={pallet.id}>
                <div className="grid-2">
                  {/* ===== Purchase Price ===== */}
                  <div className="form-group">
                    <label>Purchase Price (Per Piece)</label>
                   <input
  type="text"
  value={pallet.purchasePrice}
  onChange={(e) => {
    const raw = onlyNumbers(e.target.value);
    handlePalletChange(index, "purchasePrice", Number(raw) || 0);
  }}
/>
{isPurchasePriceLowerThanPresale(pallet) && (
  <small className="error">
    Purchase price is lower than pre-sale price ({formatNumber(pallet.pricePerPic)})
  </small>
)}
                  </div>

                  {/* ===== No of Pallets ===== */}
                  <div className="form-group">
                    <label>No. of Pallets Purchased</label>
                    <input
  type="text"
  value={pallet.noOfPallets}
  onChange={(e) => {
    const raw = onlyNumbers(e.target.value);
    const qty = Number(raw) || 0;
    const safeQty = qty > remainingPallets ? remainingPallets : qty;
    handlePalletChange(index, "noOfPallets", safeQty);
  }}
/>
                    <small className="error">
                      {remainingPallets > 0
                        ? `Only ${remainingPallets} pallet(s) remaining`
                        : "No pallets remaining"}
                    </small>
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
                          {pallet.palletOption
                            ? `${pallet.palletOption} Pieces`
                            : <span className="placeholder">Pallet Option</span>}
                        </div>
                        <ChevronDown className={openPalletDropdowns[index] ? "up" : "down"} />
                      </div>

                      {openPalletDropdowns[index] && (
                        <div className="sale-select-dropdown">
                          {!pallet.containerId ? (
                            <span className="option-sale disabled">Select a container first</span>
                          ) : palletOptions.length === 0 ? (
                            <span className="option-sale disabled">No pallet options available</span>
                          ) : ( 
                            palletOptions.map((opt) => (
                              <span
                                key={opt.pallet_uuid}
                                className="option-sale"
                                onClick={() => {
                                  handlePalletChange(index, "palletOption", opt.pallet_pieces);
                                  handlePalletChange(index, "pallet_uuid", opt.pallet_uuid);
                                  setOpenPalletDropdowns((prev) => ({ ...prev, [index]: false }));
                                }}
                              >
                                {opt.pallet_pieces} Pieces
                                {opt.remaining_no_of_pallets > 0
                                  ? ` - ${opt.remaining_no_of_pallets} pallets remaining`
                                  : " - No pallets remaining"}
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
                    <input type="text" readOnly value={formatNumber(totalPurchase(pallet))} />
                  </div>
                </div>

                {/* ===== Remove Button ===== */}
                <div className="btn-row mt-2">
                  <button
                    className="cancel"
                    onClick={() => removeAddSale(index)}
                  >
                    Remove
                  </button>
                </div>

                <div className="seperate-sale" />
              </div>
            );
          })}

          {/* ===== Footer ===== */}
          <div className="btn-row mt-3">
            <button className="create" onClick={handleSaveSaleItems}>
              Save All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSaleItem;