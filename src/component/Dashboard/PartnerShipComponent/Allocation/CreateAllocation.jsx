import React, { useState } from "react";
import "../../../../assets/Styles/dashboard/create.scss";
import { ChevronDown, Paperclip, Trash2 } from "lucide-react";

const typeOptions = ["Asset", "Liability", "Equity", "Income", "Expense"];

const CreateAllocation = ({  containersData,data,setData,setView,onCreate,}) => {

    const partners = JSON.parse(localStorage.getItem("partner_data")) || [];

    const [selectedContainer, setSelectedContainer] = useState(null);
    const [selectedEstimated, setSelectedEstimated] = useState(0);
    
    const [openContainerSelect, setOpenContainerSelect] = useState(false);
    const [openPartnerSelect, setOpenPartnerSelect] = useState(false);
    
    const [search, setSearch] = useState("");
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [allocations, setAllocations] = useState([]);

  const [openSelect, SetOpenSelect] = useState(false);
 const eligibleContainers = (containersData ?? [])
 .filter((c) => {
    return (
      c.funding === "partner" &&
      Array.isArray(c.partners) &&
      c.partners.length > 0
    );
  })
  .filter((item) => {
    const tracking = item.trackingNumber ?? "";
    return tracking.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelectContainer = (item) => {
    setSelectedContainer(item);
  
    setSelectedEstimated(
      item.extimated !== undefined && item.extimated !== null
        ? item.extimated
        : 0
    );
  
    setOpenContainerSelect(false);
  };
  const totalAllocatedAmount = allocations.reduce(
    (sum, a) => sum + (Number(a.amount) || 0),
    0
  );
  
  const totalPercentage = allocations.reduce(
    (sum, a) => sum + (Number(a.percentage) || 0),
    0
  );
  
  const remainingAmount = Math.max(
    selectedEstimated - totalAllocatedAmount,
    0
  );
  
  const remainingPercentage = Math.max(100 - totalPercentage, 0);
  const handleSubmit = () => {
    if (!selectedContainer || allocations.length === 0) return;
  
    const payload = {
      id: crypto.randomUUID(),
      containerTrackingNumber: `TN${selectedContainer.trackingNumber}`,
      estimatedAmount: selectedEstimated,
      remainingAmount,
      remainingPercentage,
      allocations: allocations.map((a) => ({
        partnerId: a.partner?.id,
        partnerName: a.partner?.fullName,
        amount: a.amount,
        percentage: a.percentage
      })),
      createdAt: new Date().toISOString()
    };
  
    onCreate(payload);     // 👈 send to controller
  };
  
  return (
    <div className="trip-modal">
      <div className="create-container-modal">
        <div className="create-container-card">
        <div className="drill-summary-grid">
      <div className="drill-summary">
      <div className="summary-item">
  <p className="small">Estimated Amount (NGN)</p>
  <h2>{Number(selectedEstimated).toLocaleString("en-NG")}</h2>
</div>
      <div className="summary-item">
  <p className="small">Remaining Estimated Amount</p>
  <h2>{Number(remainingAmount).toLocaleString("en-NG")}</h2>
</div>
<div className="summary-item">
  <p className="small">Remaining Percentage</p>
  <h2>{`${remainingPercentage.toFixed(2)}%`}</h2>
</div>
<div className="summary-item">
  <p className="small">Total Percentage</p>
  <h2>{`${totalPercentage.toFixed(2)}%`}</h2>

</div>


    </div>
    </div>

        <header>
            <div className=".header-content">
          <h2>Create Allocation</h2>
          <p>Enter Allocation details</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <button type="button" className="create"
           disabled={!selectedContainer || remainingPercentage === 0}
           onClick={() =>
            setAllocations((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                partner: null,
                amount: "",
                percentage: "",
                error: "",
                openPartnerDropdown: false
              }
            ])
          }          
  >
    + Add Partner Allocation
  </button>
</div>

          </header>
          <div className="grid-2">
          <div className="form-group-select">
  <label>Container</label>
  <div className="custom-select">
    <div
      className="custom-select-drop"
      onClick={() => setOpenContainerSelect(!openContainerSelect)}
    >
      <div className="select-box">
        {selectedContainer ? (
          <span>TN{selectedContainer.trackingNumber}</span>
        ) : (
          <span className="placeholder">Select Container</span>
        )}
      </div>
      <ChevronDown className={openContainerSelect ? "up" : "down"} />
    </div>

    {openContainerSelect && (
      <div className="select-dropdown">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {eligibleContainers.map((item) => (
          <div
            key={item.id}
            className="option-item"
            onClick={() => handleSelectContainer(item)}
          >
            TN{item.trackingNumber}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

<div className="form-group">
  <label>Estimated Amount (NGN)</label>
  <input
    type="text"
    value={Number(selectedEstimated).toLocaleString("en-NG")}
    readOnly
  />
</div>
          </div>

          {allocations.map((row, index) => (
  <div className="grid-cover" key={row.id} style={{ marginTop: 15 }}>
    <div className="grid-cover-container">
    <div className="form-group-select">
  <label>Partner</label>

  <div className="custom-select">
    <div
      className="custom-select-drop"
      onClick={() => {
        const updated = [...allocations];
        updated[index].openPartnerDropdown =
          !updated[index].openPartnerDropdown;
        setAllocations(updated);
      }}
    >
      <div className="select-box">
        {row.partner ? (
          <span>{row.partner.fullName}</span>
        ) : (
          <span className="placeholder">Select Partner</span>
        )}
      </div>

      <ChevronDown
        className={row.openPartnerDropdown ? "up" : "down"}
      />
    </div>

    {row.openPartnerDropdown && (
      <div className="select-dropdown">
        {partners.map((p) => (
          <div
            key={p.id}
            className="option-item"
            onClick={() => {
              const updated = [...allocations];
              updated[index].partner = p;
              updated[index].openPartnerDropdown = false;
              setAllocations(updated);
            }}
          >
            {p.fullName}
          </div>
        ))}
      </div>
    )}
  </div>
</div>
    <div className="form-group">
      <label>Amount</label>
      <input
        type="number"
        value={row.amount}
        onChange={(e) => {
          const value = Number(e.target.value);
          const updated = [...allocations];

          if (value > remainingAmount + (row.amount || 0)) {
            updated[index].error =
              "Amount input must not be greater than estimated amount";
          } else {
            updated[index].error = "";
            updated[index].amount = value;
            updated[index].percentage =
              selectedEstimated > 0
                ? ((value / selectedEstimated) * 100).toFixed(2)
                : 0;
          }

          setAllocations(updated);
        }}
        placeholder="Enter amount"
      />

      {row.error && <small className="error">{row.error}</small>}
    </div>
    <div className="form-group">
      <label>Percentage</label>
      <input type="text" value={row.percentage} readOnly />
    </div>
    <button type="button" className="remove" onClick={() => setAllocations((prev) =>
          prev.filter((a) => a.id !== row.id)
        )
      }
    >
      <Trash2 size={16} />
    </button>
    </div>
  </div>
))}

          
          {/* Actions */}
          <div className="btn-row" style={{marginTop:"10%"}}>
            <button className="cancel" onClick={() => setView("table")}>
              Cancel</button>
              <button className="create" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAllocation
