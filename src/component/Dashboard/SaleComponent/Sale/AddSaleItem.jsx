import React from "react";
import { X, ChevronDown } from "lucide-react";
import { totalPurchase } from "./hooks/useSaleCalculations";

const AddSaleItem = ({
  form,
  setForm,
  salePop,
  setSalePop,
  dynamicContainerOptions,
  formatNumber,

  openContainerDropdowns,
  setOpenContainerDropdowns,

  openPalletDropdowns,
  setOpenPalletDropdowns,

  palletOptionsByContainer,

  addPallet,
  handlePalletChange,
  handleSaveSaleItems,
  removeAddSale,
  isPurchasePriceLowerThanPresale,
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
            <button
              type="button"
              className="add-more-btn"
              onClick={addPallet}
            >
              Add More
            </button>
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
                  {dynamicContainerOptions.length > 1 && (
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
                                  handlePalletChange(index, "containerId", container.id);
                                  handlePalletChange(index, "pallet_uuid", "");
                                  handlePalletChange(index, "palletOption", "");
                                  handlePalletChange(index, "noOfPallets", "");
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
                  )}

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
                        Price is lower than pre-sale price per piece
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
  value={pallet.noOfPallets}
  onChange={(e) => {
    const raw = Number(e.target.value) || 0;
    const safeQty = Math.min(raw, pallet.remaining_no_of_pallets);

    handlePalletChange(index, "noOfPallets", safeQty);
  }}
/>

{pallet.remaining_no_of_pallets > 0 && (
  <small className="error">
    Only {pallet.remaining_no_of_pallets} pallet(s) remaining
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