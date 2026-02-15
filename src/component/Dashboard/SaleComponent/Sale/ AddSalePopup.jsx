import React from "react";
import { X, ChevronDown } from "lucide-react";
import {
  totalPurchase
} from "./hooks/useSaleCalculations";

const AddSalePopup = ({open,onClose,form,setForm,dynamicContainerOptions,activeContainerId, setActiveContainerId,addPallet,removeAddSale,handlePalletChange,handleSaveSaleItems,getPalletOptionsForContainer,isPurchasePriceLowerThanPresale,formatMoneyNGN, formatNumber,}) => {

    const [pallets, setPallets] = useState([]);
const [openContainerDropdowns, setOpenContainerDropdowns] = useState({});
const [openPalletDropdowns, setOpenPalletDropdowns] = useState({});
const [palletContainers, setPalletContainers] = useState({});

const handlePalletChange = (index, field, value) => {
  const updated = [...form.pallets];
  updated[index][field] = value;

  setForm((prev) => ({ ...prev, pallets: updated }));
};
// const addPallet = (containerId = activeContainerId) => {
//   if (!containerId) return;

//   setForm(prev => ({
//     ...prev,
//     pallets: [
//       ...prev.pallets,
//       {
//         id: crypto.randomUUID(),
//         pieces: "",
//         saleAmount: "",
//         palletOption: "",
//         containerId,
//         createdAt: new Date().toISOString(),
//       },
//     ],
//   }));
// };
// const removeAddSale = (index) => {
//     const updated = form.pallets.filter((_, i) => i !== index);
//     setForm(prev => ({ ...prev, pallets: updated }));
//     if (updated.length === 0) setSalePop(false);
//   };
 
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
  const addPallet = () => {
    setPallets(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        pieces: "",
        saleAmount: "",
        palletOption: "",
        containerId: activeContainerId,
        createdAt: new Date().toISOString(),
      },
    ]);
  };
  
  const handlePalletChange = (index, field, value) => {
    const updated = [...pallets];
    updated[index][field] = value;
    setPallets(updated);
  };
  
  const removeAddSale = (index) => {
    setPallets(prev => prev.filter((_, i) => i !== index));
  };
  
  if (!open) return null;

  return (
    <div className="add-sale-popup">
      <div className="popup-overlay"></div>

      <div className="add-sale-content">
        <X size={18} className="close" onClick={onClose} />

        <div className="sale-pallet-section">
          <div className="header">
            <h5>Add Sale</h5>
            <button type="button" onClick={addPallet}>
              Add More
            </button>
          </div>

          {form.pallets.map((pallet, index) => (
            <div key={pallet.id}>
              <div className="grid-5">

                {/* CONTAINER SELECT */}
                {dynamicContainerOptions.length > 1 && (
                  <div className="form-group-select-sale mt-2">
                    <label>View Container</label>

                    <div
                      className="custom-select-drop"
                      onClick={() =>
                        setOpenContainerDropdowns(prev => ({
                          ...prev,
                          [index]: !prev[index],
                        }))
                      }
                    >
                      <div className="select-box">
                        {palletContainers[index]
                          ? dynamicContainerOptions.find(
                              c => c.id === palletContainers[index]
                            )?.name
                          : "Select Container"}
                      </div>
                      <ChevronDown />
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
                )}

                {/* PURCHASE PRICE */}
                <div className="form-group">
                  <label>Purchase Price (Per Pieces)</label>
                  <input
                    value={formatNumber(pallet.pieces)}
                    onChange={e =>
                      handlePalletChange(index, "pieces", e.target.value)
                    }
                  />

                  {isPurchasePriceLowerThanPresale(pallet) && (
                    <small className="error-text">
                      Purchase price is lower than presale price
                    </small>
                  )}
                </div>

                {/* PALLET COUNT */}
                <div className="form-group">
                  <label>No Of Pallet Purchased</label>
                  <input
                    type="number"
                    value={pallet.saleAmount}
                    onChange={e =>
                      handlePalletChange(index, "saleAmount", e.target.value)
                    }
                  />
                </div>

                {/* PALLET OPTION */}
                <div className="form-group-select">
                  <label>Pallet Distribution</label>

                  <div
                    className="custom-select-drop"
                    onClick={() =>
                      setOpenPalletDropdowns(prev => ({
                        ...prev,
                        [index]: !prev[index],
                      }))
                    }
                  >
                    <div className="select-box">
                      {pallet.palletOption || "Select Option"}
                    </div>
                    <ChevronDown />
                  </div>

                  {openPalletDropdowns[index] && (
                    <div className="sale-select-dropdown">
                      {getPalletOptionsForContainer(
                        pallet.containerId || activeContainerId
                      ).map(opt => (
                        <span
                          key={opt}
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

                {/* TOTAL */}
                <div className="form-group">
                  <label>Sale Amount</label>
                  <input
                    readOnly
                    value={formatMoneyNGN(totalPurchase(pallet))}
                  />
                </div>
              </div>

              <div className="seperate-sale"></div>
            </div>
          ))}

          <div className="btn-row">
            <button
              className="cancel"
              onClick={() =>
                removeAddSale(form.pallets.length - 1)
              }
            >
              Remove
            </button>
            <button
  className="create"
  onClick={() => {
    const cleanPallets = pallets.map(p => ({
      ...p,
      pieces: Number(p.pieces),
      saleAmount: Number(p.saleAmount),
      palletOption: Number(p.palletOption),
      total: totalPurchase(p),
    }));

    onSave(cleanPallets);
  }}
>
  Save
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSalePopup;
