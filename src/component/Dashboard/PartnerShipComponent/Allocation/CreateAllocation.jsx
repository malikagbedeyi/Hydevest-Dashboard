import React, { useEffect, useState, useMemo } from "react";
import "../../../../assets/Styles/dashboard/create.scss";
import { ChevronDown, Trash2 } from "lucide-react";
import { PartnerService } from "../../../../services/Account/PartnerService";
import { EntityServices } from "../../../../services/Admin/EntityServices";

const CreateAllocation = ({drilldownMode = false,containersData,data,setData,setView,onCreate,}) => {
  

  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
   const [entity, setEntity] = useState([]);
  const [entityLoading,setEntityLoading]= useState(false)
  // core state
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [selectedEstimated, setSelectedEstimated] = useState(0);
  const [allocations, setAllocations] = useState([]);

  // ui state
  const [openContainerSelect, setOpenContainerSelect] = useState(false);
  const [openAllocationPopup, setOpenAllocationPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [search, setSearch] = useState("");

  // editing state
  const [draftAllocations, setDraftAllocations] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingDraftId, setEditingDraftId] = useState(null);


  const fetchPartners = async () => {
    try {
      setPartnersLoading(true);
      const res = await PartnerService.list({ page: 1 });
      setPartners(res.data?.record?.data || []);
    } catch (err) {
      console.error("Failed to fetch partners", err);
    } finally {
      setPartnersLoading(false);
    }
  };
  useEffect(() => {
    fetchPartners();
  }, []);
    const fetchEntity = async () => {
      try{
        setEntityLoading(true)
        const res = await EntityServices.list({page:1})
        setEntity(res.data?.record?.data || []);


      }catch (err){
        console.error("Failed to fecth Entity",err)
      }finally{
        setEntityLoading(false)
      }
    }
    useEffect(() => {
      fetchEntity();
    }, []);
  const eligibleContainers = (containersData ?? [])
    .filter(
      c =>
        c.funding === "partner" &&
        Array.isArray(c.partners) &&
        c.partners.length > 0
    )
    .filter(c =>
      String(c.trackingNumber ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    useEffect(() => {
      if (!drilldownMode || !data?.length) return;
  
      const record = data[0];
  
      const container = containersData.find(
        c => `TN${c.trackingNumber}` === record.containerTrackingNumber
      );
  
      if (container) {
        setSelectedContainer(container);
        setSelectedEstimated(record.estimatedAmount);
      }
  
      setAllocations(
        record.allocations.map(a => ({
          id: crypto.randomUUID(),
          assignee: {
            id: a.assigneeId,
            name: a.assigneeName,
            type: a.assigneeType,
          },
          amount: a.amount,
          percentage: a.percentage,
        }))
      );
    }, [drilldownMode, data, containersData]);
  
  const handleSelectContainer = (item) => {
    const previousAllocations = data.filter(
      d => d.containerTrackingNumber === `TN${item.trackingNumber}`
    );
  
    const totalInvested = previousAllocations.reduce(
      (sum, r) =>
        sum +
        r.allocations.reduce((s, a) => s + Number(a.amount || 0), 0),
      0
    );
  
    const remaining = Math.max(
      (item.estimatedAmount || item.extimated || 0) - totalInvested,
      0
    );
    
  
    setSelectedContainer(item);
    setSelectedEstimated(remaining);
    setAllocations([]);
    setOpenContainerSelect(false);
  };
  const totals = useMemo(() => {
    const amount = allocations.reduce(
      (s, a) => s + Number(a.amount || 0),
      0
    );
    const percentage = allocations.reduce(
      (s, a) => s + Number(a.percentage || 0),
      0
    );
    return { amount, percentage };
  }, [allocations]);

  const remainingAmount = Math.max(
    selectedEstimated - totals.amount,
    0
  );
  const remainingPercentage = Math.max(
    100 - totals.percentage,
    0
  );
  const handleSubmit = () => {
    if (!selectedContainer) return;

    if (totals.amount > selectedEstimated) {
      setInfoMessage("Total allocation exceeds estimated amount.");
      setShowInfoPopup(true);
      return;
    }

    if (totals.percentage > 100) {
      setInfoMessage("Total allocation percentage cannot exceed 100%.");
      setShowInfoPopup(true);
      return;
    }

    const payload = buildAllocationPayload();

    drilldownMode ? setData([payload]) : onCreate(payload);
  };
  const buildAllocationPayload = () => {
    const total = allocations.reduce(
      (s, a) => s + Number(a.amount || 0),
      0
    );
  
    return {
      id: drilldownMode ? data[0].id : crypto.randomUUID(),
      __version: crypto.randomUUID(), // 👈 ADD THIS      
      containerTrackingNumber: `TN${selectedContainer.trackingNumber}`,
      estimatedAmount: selectedEstimated,
      remainingAmount: Math.max(selectedEstimated - total, 0),
      remainingPercentage:
        selectedEstimated > 0
          ? Number(
              (((selectedEstimated - total) / selectedEstimated) * 100).toFixed(2)
            )
          : 0,
      allocations: allocations.map(a => ({
        assigneeId: a.assignee.id,
        assigneeName: a.assignee.name,
        assigneeType: a.assignee.type,
        amount: Number(a.amount),
        percentage: Number(a.percentage)
      })),
      createdAt: drilldownMode
        ? data[0].createdAt
        : new Date().toISOString()
    };
  };

const assigneeOptions = [
  ...(Array.isArray(partners)
    ? partners.map((p) => ({
        id: p.user_uuid,
        name: `${p.firstname} ${p.lastname}`.trim(),
        type: "partner",
      }))
    : []),

  ...(Array.isArray(entity)
    ? entity.map((e) => ({
        id: e.user_uuid,
        name: `${e.firstname} ${e.lastname}`.trim(),
        type: "entity",
      }))
    : []),
];

    const assigneeOptionsFiltered = assigneeOptions;
    
    const handleEditDraftRow = (row) => {
        setEditMode(true);
        setEditingDraftId(row.id);
        setOpenAllocationPopup(true);
      
        setDraftAllocations([
          {
            ...row,
            openPartnerDropdown: false,
            error: ""
          }
        ]);
      };

  return (
    <div className="trip-modal">
      <div className="create-container-modal">
        <div className="create-container-card">
        <div className="drill-summary-grid">
  <div className="drill-summary">
    <div className="summary-item">
      <p className="small">Estimated Delieving Amount (NGN)</p>
      <h2>{Number(selectedEstimated).toLocaleString("en-NG")}</h2>
    </div>

    <div className="summary-item">
      <p className="small">Outstanding Estimated Amount</p>
      <h2>{Number(remainingAmount).toLocaleString("en-NG")}</h2>
    </div>

    <div className="summary-item">
      <p className="small">Allocated Percentage</p>
      <h2>{`${totals.percentage.toFixed(2)}%`}</h2>
    </div>

    <div className="summary-item">
      <p className="small">Outstanding Percentage</p>
      <h2>{`${remainingPercentage.toFixed(2)}%`}</h2>
    </div>
  </div>
</div>
<header className="header">
  <div className="header-content">
    <h2>{drilldownMode ? "Allocation Details" : "Create Allocation"}</h2>
    {!drilldownMode && <p>Enter allocation details</p>}
  </div>

  <button
    className="create"
    onClick={() => {
      if (!selectedContainer) {
        setInfoMessage("Please select a container first.");
        setShowInfoPopup(true);
        return;
      }

      if (remainingAmount === 0) {
        setInfoMessage("Estimated amount has been fully allocated.");
        setShowInfoPopup(true);
        return;
      }

      setDraftAllocations([
        {
          id: crypto.randomUUID(),
          assignee: null,
          amount: "",
          percentage: "",
          error: "",
          openPartnerDropdown: false,
        },
      ]);
      setOpenAllocationPopup(true);
    }}
  >
    Add Allocation
  </button>
</header>

<div className="grid-2">
  <div className="form-group-select">
    <label>Container</label>

    <div className="custom-select">
      <div
        className="custom-select-drop"
        onClick={() => setOpenContainerSelect(v => !v)}
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
            onChange={e => setSearch(e.target.value)}
          />

          {eligibleContainers.map(item => (
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
    <label>Estimated Delieving Amount (NGN)</label>
    <input
      type="text"
      readOnly
      value={Number(selectedEstimated).toLocaleString("en-NG")}
    />
  </div>
</div>

          {openAllocationPopup && (
  <div className="popup-overlay">
    <div className="popup">
    <div style={{ display: "flex", justifyContent: "flex-end", marginButtom: 10 }}
    className={editMode ? "d-none" : ""}>
    <button
  type="button"
  className="create"
  disabled={!selectedContainer || selectedEstimated === 0 || remainingPercentage === 0}
  onClick={() => {
    setDraftAllocations(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        assignee: null,
        amount: "",
        percentage: "",
        error: "",
        openPartnerDropdown: false
      }
    ]);
  }}
  >+ Add  Allocation
        {selectedContainer && selectedEstimated === 0 && (
  <small className="error">
    Allocation completed for this container
  </small>
)}

</button>
          </div>
      <div className="popup-header">
      <h3>{editMode ? "Edit Allocation" : "Add Allocation"}</h3>
        <button onClick={() => {
            setOpenAllocationPopup(false);
            setEditMode(false);
            setEditingDraftId(null);
            setDraftAllocations([]);
        }} >✕</button>
      </div>
            <div className="popup-content">
            {draftAllocations.map((row, index) => (
  <div className="grid-cover" key={row.id} style={{ marginTop: 15 }}>
    <div className="grid-cover-container">
    <div className="form-group-select">
    <label>Partner / Entity</label>
  <div className="custom-select">
    <div className="custom-select-drop" onClick={() => {
        const updated = [...draftAllocations];
        updated[index].openPartnerDropdown =
          !updated[index].openPartnerDropdown;
        setDraftAllocations(updated)      
      }}>
      <div className="select-box">
      {row.assignee ? (
      <span>  {row.assignee.name} <small style={{ marginLeft: 6, opacity: 0.6 }}> ({row.assignee.type})</small> </span>
       ) : ( <span className="placeholder">Select Partner or Entity</span>
)}
      </div>
      <ChevronDown className={row.openPartnerDropdown ? "up" : "down"}/>
    </div>
    {row.openPartnerDropdown && (
      <div className="select-dropdown">
       {assigneeOptionsFiltered.map((item) => (
     <div key={`${item.type}-${item.id}`} className="option-item" onClick={() => {
            const updated = [...draftAllocations];
            updated[index].assignee = item;
            updated[index].openPartnerDropdown = false;
            setDraftAllocations(updated);
        }} >
     <span>{item.name}</span> <small style={{ marginLeft: 8, opacity: 0.6 }}>
      {item.type === "partner" ? "Partner" : "Entity"}
    </small>
  </div>
  ))}
   </div>
    )}
  </div>
</div>
    <div className="form-group">
      <label>Amount</label>
      <input type="number"  value={row.amount}onChange={(e) => {
  const value = Number(e.target.value);
  const updated = [...draftAllocations];

  if (value > remainingAmount) {
    updated[index].error = "Amount exceeds Estimate Amount ";
  } else {
    updated[index].error = "";
    updated[index].amount = value;
    updated[index].percentage =
      selectedEstimated > 0
        ? ((value / selectedEstimated) * 100).toFixed(2)
        : 0;
  }

  setDraftAllocations(updated);
}}
placeholder="Enter amount" /> 
        {row.error && <small className="error">{row.error}</small>}
    </div>
    <div className="form-group">
      <label>Percentage</label>
      <input type="text" value={row.percentage} readOnly />
    </div>  
    <button type="button" className={editMode ? "d-none" : "remove"} onClick={() => {
  setDraftAllocations(prev =>
    prev.filter(a => a.id !== row.id)
  );
}}
> <Trash2 size={16} /></button>
    </div>
  </div>
   ))}
      </div>
      <div className="popup-footer">
  <button
    className="remove"
    onClick={() => {
      setOpenAllocationPopup(false);
      setDraftAllocations([]);
      setEditMode(false);
      setEditingDraftId(null);
    }}
  >
    Cancel
  </button>

  <button
    className="create"
    onClick={() => {
      if (editMode && editingDraftId) {
        setAllocations(prev =>
          prev.map(a =>
            a.id === editingDraftId
              ? {
                  ...a,
                  assignee: draftAllocations[0].assignee,
                  amount: Number(draftAllocations[0].amount),
                  percentage: Number(draftAllocations[0].percentage),
                }
              : a
          )
        );
      } else {
        setAllocations(prev => [...prev, ...draftAllocations]);
      }

      setDraftAllocations([]);
      setOpenAllocationPopup(false);
      setEditMode(false);
      setEditingDraftId(null);
    }}
  >
    {editMode ? "Update Allocation" : "Submit Added Allocation"}
  </button>
</div>

    </div>
  </div>
)}
{allocations.length > 0 && (
 <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{width:"100%" , maxWidth:"100%",minWidth:"100%"}}>
      <thead>
        <tr>
          <th>S/N</th>
          <th>Partner </th>
          <th>Amount</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        {allocations.map((row, i) => (
            <tr key={row.id} onClick={() => handleEditDraftRow(row)}
            style={{ cursor: "pointer" }}>
            <td>{i + 1}</td>
            <td>{row.assignee.name} ({row.assignee.type})</td>
            <td>{Number(row.amount).toLocaleString("en-NG")}</td>
            <td>{row.percentage}%</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  </div>
)}
{showInfoPopup && (
  <div className="popup-overlay">
    <div className="popup">
      <div className="popup-header">
        <h3>Notice</h3>
        <button onClick={() => setShowInfoPopup(false)}>✕</button>
      </div>

      <div className="popup-content">
        <p style={{ textAlign: "center", fontSize: 16 }}>
          {infoMessage}
        </p>
      </div>

      <div className="popup-footer">
        <button
          className="create"
          onClick={() => setShowInfoPopup(false)}
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}

          {/* Actions */}
          <div className="btn-row" style={{ marginTop: "10%" }}>
  {!drilldownMode ? (
    <>
      <button className="cancel" onClick={() => setView("table")}>
        Cancel
      </button>
      <button className="create" onClick={handleSubmit}>
        Submit
      </button>
    </>
  ) : (
    <button
      className="create"
      disabled={!selectedContainer || allocations.length === 0}
      onClick={handleSubmit}
    >
      Update Allocation
    </button>
  )}
</div>



        </div>
      </div>
    </div>
  );
};

export default CreateAllocation
