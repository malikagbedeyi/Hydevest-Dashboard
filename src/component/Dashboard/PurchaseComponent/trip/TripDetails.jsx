import React, { useRef, useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/Purchase/tripDetails.scss";
import { Plus,  Edit, ChevronDown, ChevronUp,  } from "lucide-react";

import TripFinnce from "./TripExpense/TripFinnce";
import DrildownContainer from "../container/DrildownContainer";
import TripExpense from "./TripExpense/TripExpense";
import TripContainer from "./TripContainer/TripContainer";
import TripDocumentDrill from "./TripDocument/TripDocumentDrill";
import TripExpenseData from "./TripExpense/TripExpenseData";
import TripContainerData from "./TripContainer/TripContainerData";
import TripDocumentCreate from "./TripDocument/TripDocumentCreate";
import TripDocumentTable from "./TripDocument/TripDocumentTable";
import TripLog from "./TripLog";
import { TripServices } from "../../../../services/Trip/trip";
import { useTripFinance } from "./hook/useTripFinance";
const statusOption = ["Not Started", "Intransit", "Completed"];

const mapProgressToUI = (progress) => {
  switch (progress) {
    case "NOT STARTED":
      return "Not Started";
    case "INTRANSIT":
      return "Intransit";
    case "COMPLETED":
      return "Completed";
    default:
      return "Not Started";
  }
};
const mapUIToProgress = (ui) => {
  switch (ui) {
    case "Not Started":
      return "NOT STARTED";
    case "Intransit":
      return "INTRANSIT";
    case "Completed":
      return "COMPLETED";
    default:
      return "NOT STARTED";
  }
};



const TripDetails = ({ trip, goBack }) => {
  /* ================== STORAGE KEYS ================== */
  const TRIP_FILE_KEY = `trip-${trip.id}-tripFile`;



  /* ================== BASIC STATE ================== */
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState("finance");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [selectedContainerDrill, setSelectedContainerDrill] = useState(null);
  const [showContainerDetails, setShowContainerDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocumentDril, setShowDocumentDril] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
   const [editStartDate, setEditStartDate] = useState(false);
  const [editEndate, setEditEndate] = useState(false);
  // Parent component
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);  
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showItemData, setShowItemData] = useState(false);
  const [loading, setLoading] = useState(false);
const [message, setMessage] = useState(null);
const [messageType, setMessageType] = useState(null);
const[closePopup,setClosePopup] = useState(false)
const [expenseReloadKey, setExpenseReloadKey] = useState(0);
  /* ================== TRIP META ================== */
  const [title, setTitle] = useState(trip?.title || "");
const [description, setDescription] = useState(trip?.desc || "");
const [location, setLocation] = useState(trip?.location || "");
const [startDate, setStartDate] = useState(trip?.start_date || "");
const [endDate, setEndDate] = useState(trip?.end_date || "");
const [containerReloadKey, setContainerReloadKey] = useState(0);

const originalRef = useRef(null);

useEffect(() => {
  if (!trip) return;

  const original = {
    title: trip.title || "",
    description: trip.desc || "",
    location: trip.location || "",
    start_date: trip.start_date || "",
    end_date: trip.end_date || "",
    progress: trip.progress || "NOT STARTED",
  };

  originalRef.current = original;

  setTitle(original.title);
  setDescription(original.description);
  setLocation(original.location);
  setStartDate(original.start_date);
  setEndDate(original.end_date);
  setStatus(mapProgressToUI(original.progress));
}, [trip]);


const hasChanges = () => {
  if (!originalRef.current) return false;

  const o = originalRef.current;

  return (
    title !== o.title ||
    description !== o.description ||
    location !== o.location ||
    startDate !== o.start_date ||
    endDate !== o.end_date ||
    mapUIToProgress(status) !== o.progress
  );
};


  /* ================== FINANCE DATA ================== */
  const {financeData,setFinanceData,avgContainerRate,loading: financeLoading,} = useTripFinance(trip?.trip_uuid);
// const [financeData, setFinanceData] = useState([]);

// useEffect(() => {
//   if (!trip?.trip_uuid) return;

//   const fetchFinance = async () => {
//     try {
//       const res = await TripServices.getExpenses(trip.trip_uuid);
//       setFinanceData(res.data?.data || []);
//     } catch (err) {
//       console.error("Failed to fetch finance", err);
//     }
//   };

//   fetchFinance();
// }, [trip?.trip_uuid]);

const handleAddFinance = async (payload) => {
  try {
    const res = await TripServices.createExpense(trip.trip_uuid, payload);
    setFinanceData((prev) => [res.data, ...prev]);
    setExpenseReloadKey((k) => k + 1); 
    addLog({
      module: "Trip Expense",
      action: "Created",
      title: res.data.title,
    });

    setShowModal(false);

  } catch (err) {
    console.error(err);
  }
};

const handleDeleteFinance = (id) => {
  const item = financeData.find((i) => i.id === id);

  setFinanceData((prev) => prev.filter((item) => item.id !== id));

  if (item) {
    addLog({
      module: "Trip Expense",
      action: "Deleted",
      title: item.title,
    });
  }
};
useEffect(() => {
  if (!trip?.trip_uuid) return;
  if (!avgContainerRate || avgContainerRate <= 0) return;

  const key = `trip_fx_rate_${trip.trip_uuid}`;

  localStorage.setItem(key, JSON.stringify({
    rate: avgContainerRate,
    savedAt: Date.now(),
  }));
}, [trip?.trip_uuid, avgContainerRate]);


  /* ================== CONTAINER DATA ================== */
 const [containerData, setContainerData] = useState([]);


const handleAddContainer = (container) => {
  if (!container) return;

  // Calculate NGN and quoted NGN
  const amountUSD =
    (Number(container.unit_price_usd || 0) * Number(container.pieces || 0)) +
    Number(container.shipping_amount_usd || 0);

  const amountNGN = amountUSD * Number(avgContainerRate || 0);

  const quotedUSD = Number(container.quoted_price_usd || 0);
  const quotedNGN =
    quotedUSD * Number(avgContainerRate || 0) +
    (container.funding === "partner" ? Number(container.surcharge || 0) * Number(avgContainerRate || 0) : 0);

  setContainerData((prev) => [
    ...prev,
    { ...container, amountUSD, amountNGN, quotedUSD, quotedNGN },
  ]);

  setContainerReloadKey((k) => k + 1);

  addLog({
    module: "Container",
    action: "Created",
    title: container.title || "Container",
  });

  setShowItemData(true);
  setShowModal(false);
};
  const handleDeleteContainer = (id) => {
    const item = containerData.find((i) => i.id === id);
  
    setContainerData((prev) => prev.filter((item) => item.id !== id));
  
    if (item) {
      addLog({
        module: "Container",
        action: "Deleted",
        title: item.title,
      });
    }
  };
const handleUpdateContainer = (updatedContainer) => {
  setContainerData((prev) =>
    prev.map((item) =>
      item.id === updatedContainer.id
        ? {
            ...item,
            ...updatedContainer,
            entity_uuid: updatedContainer.entity_uuid, // force it
          }
        : item
    )
  );
};


  
  const totalAmountUSD = containerData.reduce((sum, item) => {
    const value = Number(item.amountUsd) || 0;
    return sum + value;
  }, 0);
  const totalUnitPriceUSD = containerData.reduce((sum, item) => {
    const value = Number(item.unitpieces) || 0;
    return sum + value;
  }, 0);

const formatNumber = (num) =>
  Math.round(Number(num || 0)).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  });

    
   
  /* ================== Trip File  DATA ================== */
  const [tripFileData, setTripFileData] = useState(() => {
    return JSON.parse(localStorage.getItem(TRIP_FILE_KEY)) || [];
  });

  useEffect(() => {
    localStorage.setItem(TRIP_FILE_KEY, JSON.stringify(tripFileData));
  }, [tripFileData]);
 
  const handleAddTripFile = (file) => {
    setTripFileData((prev) => [...prev, file]);
  
    addLog({
      module: "Trip Document",
      action: "Created",
      title: file.title,
    });
    setShowItemData(true);
    setShowModal(false);
  };
  
  const handleDeleteTripFile = (id) => {
    const item = tripFileData.find((i) => i.id === id);
  
    setTripFileData((prev) => prev.filter((item) => item.id !== id));
  
    if (item) {
      addLog({
        module: "Trip Document",
        action: "Deleted",
        title: item.title,
      });
    }
  };
  const LOG_KEY = `trip-${trip.id}-log-history`;
/* ================== Log  ================== */
const addLog = ({ module, action, title }) => {
  const log = {
    id: Date.now(),
    module,
    action,
    title,
    date: new Date().toISOString(),
  };

  const existing = JSON.parse(localStorage.getItem(LOG_KEY)) || [];
  localStorage.setItem(LOG_KEY, JSON.stringify([log, ...existing]));
};

  
  /* ================== PAGINATION ================== */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(financeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFinance = financeData.slice(startIndex, startIndex + itemsPerPage);


  /* ================== FORMATTERS ================== */
  const formatDate = (date) =>
  date
    ? new Date(date)
        .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        .replace(/ /g, "-")
    : "-";
/* ================== CALCULATIONS ================== */

const calculateAverageFxRate = (expenses = []) => {
  const valid = expenses.filter(
    (item) =>
      Number(item.is_container_payment) === 1 &&
      Number(item.rate) > 0
  );

  if (!valid.length) return 0;

  const total = valid.reduce(
    (sum, item) => sum + Number(item.rate),
    0
  );

  return total / valid.length;
};
const calculateContainerUSD = (item) => {
  const base =
    Number(item.unit_price_usd || 0) * Number(item.pieces || 0) +
    Number(item.shipping_amount_usd || 0);

  const surcharge =
    item.funding === "partner" ? Number(item.surcharge || 0) : 0;

  return base + surcharge;
};

const calculateContainerNGN = (item, rate) =>
  calculateContainerUSD(item) * Number(rate || 0);

// const avgContainerRate = calculateAverageFxRate(financeData);

/* ================== FINANCE SUMMARY (CORRECT) ================== */

const totalExpenseNGN = financeData.reduce((sum, item) => {
  return sum + Number(item.total_amount || 0);
}, 0);

const totalExpenseUSD = financeData.reduce((sum, item) => {
  if (item.currency === "USD") {
    return sum + Number(item.amount || 0);
  }
  return sum;
}, 0);

const totalContainers = containerData.length;
const totalTrip = financeData.length;

const totalPieces = containerData.reduce(
  (sum, item) => sum + Number(item.pieces || 0),
  0
);

const totalContainerUSD = containerData.reduce((sum, item) => {
  const base =
    Number(item.unit_price_usd || 0) * Number(item.pieces || 0) +
    Number(item.shipping_amount_usd || 0);

  const surcharge =
    item.funding === "partner" ? Number(item.surcharge || 0) : 0;

  return sum + base + surcharge;
}, 0);

const totalContainerNGN = containerData.reduce((sum, item) => {
  return sum + calculateContainerNGN(item, avgContainerRate);
}, 0);

const avgContainerExpenseNGN =
  totalContainers > 0 ? totalContainerNGN / totalContainers : 0;





let summaryNGN = 0;
let summaryUSD = 0;

if (activeTab === "finance") {
  summaryNGN = totalExpenseNGN;
  summaryUSD = totalExpenseUSD;
}

if (activeTab === "container") {
  summaryNGN = totalContainerNGN;     
  summaryUSD = avgContainerExpenseNGN; 
}


useEffect(() => {
}, [financeData]);


  /* ================== UTILITY FUNCTIONS ================== */
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleRowClick = (item) => {
    setSelectedTrip(item);
    setShowTripDetails(true);
  };

  const handleContainerRowClick = (container) => {
  setSelectedContainerDrill(container);
  setShowContainerDetails(true);
};
  const handleDocumentRowClick = (item) => {
    setSelectedDocument(item);
    setShowDocumentDril(true);
  };
  
  const openDeletePopup = (item) => {
    setItemToDelete(item);
    setShowDeletePopup(true);
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setShowDeletePopup(false);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      handleDeleteFinance(itemToDelete.id);
      setItemToDelete(null);
      setShowDeletePopup(false);
    }
  };

const handleUpdate = async () => {
  if (!hasChanges()) {
    setMessageType("error");
    setMessage("No changes detected");
    return;
  }
  try {
    setLoading(true);
const payload = {
  trip_uuid: trip.trip_uuid,
  title,
  desc: description || "",
  location: location || "",
  start_date: startDate || "",
  end_date: endDate || "",
  status: 1,
  progress: mapUIToProgress(status),
};
await TripServices.edit(payload);
    setMessageType("success");
    setMessage("Trip updated successfully");
    originalRef.current = {
      title,
      description,
      location,
      start_date: startDate,
      end_date: endDate,
      progress: mapUIToProgress(status),
    };
  } catch (err) {
    setMessageType("error");
    setMessage(err.response?.data?.message || "Update failed");
  } finally {
    setLoading(false);
  }
};

  /* ================== DRILLDOWN ================== */
  if (showTripDetails) {
    return <TripFinnce trip={selectedTrip} 
     goBack={() => setShowTripDetails(false)}
      setTrip={setSelectedTrip} 
onApprovalChange={(updatedExpense) => {
  setFinanceData((prev) =>
    prev.map((item) => {

      if (item.expense_uuid === updatedExpense.expense_uuid) {
        return {
          ...item,
          status: updatedExpense.status, // 1 or 0
          approved: updatedExpense.approved, // true or false
        };
      }
      return item;
      
    })
  );
}}

 />;

  }

  if (showContainerDetails) {
    return <DrildownContainer  container={selectedContainerDrill}
      goBack={() => setShowContainerDetails(false)}  onUpdate={handleUpdateContainer} 
      avgContainerRate={avgContainerRate} formatNumber={formatNumber} totalAmountUSD={totalAmountUSD} totalAmountNGN={totalContainerNGN}
      totalContainers={totalContainers} totalUnitPriceUSD={totalUnitPriceUSD}
      reloadTable={() => setContainerReloadKey(k => k + 1)}  />;
  }
  if (showDocumentDril) {
    return <TripDocumentDrill
     trip={selectedDocument}
      goBack={() => setShowDocumentDril(false)} />;
  }

  const currentData = currentFinance;
const handleCloseMessage = () => {
  setMessage(null);
  if (messageType === "success") {
    goBack(true);
  }
};
  /* ================== UI ================== */
  if (message) {
            //  {message && ( <div className={`alert ${messageType}`}>{message}</div>)}
    return (
      <div className="trip-card-popup" >
        <div className="trip-card-popup-container">
          <div className={`popup-content ${messageType}`}>
            <div  onClick={() => {handleCloseMessage();}}className="delete-box">✕</div>
            <span>{message}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="trip-details-grid">
    <div className="trip-details-grid-content">
    <div className="drill-summary-grid">
      <div className="drill-summary">

<div className="summary-item">
  <p className="small">Total Amount (NGN)</p>
  <h2>{"₦" + summaryNGN.toLocaleString("en-NG")}</h2>
</div>

<div className="summary-item">
  <p className="small">
    {activeTab === "container"
      ? "Average Expense (NGN)"
      : "Total Amount (USD)"}
  </p>
  <h2>{formatNumber(summaryUSD)}</h2>
</div>

<div className="summary-item">
<p className="small">
    {activeTab === "container"
      ? "Total Container"
      : "Total Trip"}
  </p>
  <h2>{  activeTab === "container" ? totalContainers : totalTrip}</h2>
</div>

<div className="summary-item">
  <p className="small">Total Pieces</p>
  <h2>{formatNumber(totalPieces)}</h2>
</div>

<div className="summary-item">
  <p className="small">Average Fx Rate</p>
  <h2>{formatNumber(avgContainerRate)}</h2>
</div>



    </div>
    </div>
      <div className="trip-details-container" ref={scrollRef}>
        <div className="top-trip-content">
             {/* HEADER */}
        <div className="trip-header">
          <div className="title-content">
            <div className="title-header">
              <h4>Trip Title :</h4>
              {editTitle ? (   <input  value={title} autoFocus  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setEditTitle(false)}
                />
              ) : (
                <div className="title-header-content">
                  <p>{title}</p>
                  <Edit size={14} onClick={() => setEditTitle(true)} />
                </div>
              )}
            </div>
            <div className="title-header">
              <h4>Trip ID :</h4>
              <p>{trip?.trip_unique_id}</p>
            </div>
          </div>

          <div className="header-btns">
            <button
              onClick={() => {
                setShowItemData(false);
                setShowModal(true);
              }}
            >
              <Plus size={20} />
              <span>
  {activeTab === "finance"
    ? "Add Item"
    : activeTab === "container"
    ? "Add Container"
    : "Add Document"}
</span>

            </button>

            <div className="status-dropdown">
  <button
    className="status"
    onClick={() => setOpenStatusDropdown((p) => !p)}
  >
    <span>{status}</span>
    {openStatusDropdown ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    )}
  </button>

  {openStatusDropdown && (
    <div className="status-dropdown-menu">
      {statusOption.map((opt) => (
        <div
          key={opt}
          className={`status-option ${status === opt ? "active" : ""}`}
          onClick={() => {
            setStatus(opt);
            setOpenStatusDropdown(false);
          }}
        >
          {opt}
        </div>
      ))}
    </div>
  )}
</div>

          </div>
        </div>
        {/* DESCRIPTION */}
        <div className="trip-description">
  <div className="desc-header">
    <h4>Description</h4>
    {!editDescription && (
      <Edit size={16} onClick={() => setEditDescription(true)} />
    )}
  </div>

  <div className="desc-body">
    {editDescription ? (
      <textarea
        className="desc-textarea"
        value={description}
        autoFocus
        onChange={(e) => setDescription(e.target.value)}
        onBlur={() => setEditDescription(false)}
      />
    ) : (
      <textarea
        className="desc-textarea"
        value={description}
        readOnly
      />
    )}
  </div>
</div>

        <div className="grid-3 mt-4">
         <div className="form-group">
  <label>Location</label>
  {!editLocation && (
    <Edit size={16} onClick={() => setEditLocation(true)} />
  )}

  {editLocation ? (
    <input
      type="text"
      value={location}
      autoFocus
      onChange={(e) => setLocation(e.target.value)}
      onBlur={() => setEditLocation(false)}
    />
  ) : (
    <input type="text" value={location} readOnly />
  )}
</div>
           <div className="form-group">
  <label>Start Date</label>
  {!editStartDate && (
    <Edit size={16} onClick={() => setEditStartDate(true)} />
  )}

  {editStartDate ? (
    <input
      type="date"
      value={startDate}
      autoFocus
      onChange={(e) => setStartDate(e.target.value)}
      onBlur={() => setEditStartDate(false)}
    />
  ) : (
    <input type="date" value={startDate} readOnly />
  )}
</div>
                    <div className="form-group">
  <label >End Date</label>
  {!editEndate && (
    <Edit size={16} onClick={() => setEditEndate(true)} />
  )}

  {editEndate ? (
    <input
      type="date"
      value={endDate}
      autoFocus
      onChange={(e) => setEndDate(e.target.value)}
      onBlur={() => setEditEndate(false)}
    />
  ) : (
    <input type="date" value={endDate} readOnly />
  )}
</div>
        </div>
        </div>
       
        {/* TABS */}
        <div className="tabs">
          <div className="tab-wrapper">
            <div className="tab-content">
              <span
                className={activeTab === "finance" ? "active" : ""}
                onClick={() => setActiveTab("finance")}
              >
                Trip Expense
              </span>
              <span  className={activeTab === "container" ? "active" : ""}
                onClick={() => setActiveTab("container")}  >  Container  </span>

              <span className={activeTab === "tripFile" ? "active" : ""}
                onClick={() => setActiveTab("tripFile")} >Trip Document</span>

              <span className={activeTab === "log" ? "active" : ""}
              onClick={() => setActiveTab("log")}>Activity Log</span>
            </div>
            
            <div className="tab-content">
              <button
                onClick={() => {
                  setShowItemData(false);
                  setShowModal(true);
                }}>
                  {activeTab !== "log" && (
                <Plus size={30} className="tab-content-icon" />
                )}
                <p>
  {activeTab === "finance"
    ? "Add Item"
    : activeTab === "container"
    ? "Add Container"
    : activeTab === "tripFile"
    ? "Add Document":
    ""}
</p>

              </button>
            </div>
          </div>
        </div>
        {/* FINANCE TABLE */}
    {activeTab === "finance" && (
  <div className="finance-section">
    <TripExpenseData  financeData={financeData}   currentData={currentData} setFinanceData={setFinanceData}
    handleRowClick={handleRowClick}handleDeleteFinance={handleDeleteFinance}
      openDeletePopup={openDeletePopup} tripUuid={trip.trip_uuid} reloadKey={expenseReloadKey}/>
  </div>
)}

        {/* CONTAINER TABLE */}
       {activeTab === "container" && (
  <div className="finance-section">
    <TripContainerData
  containerData={containerData}
  setContainerData={setContainerData}
  handleContainerRowClick={handleContainerRowClick}
  handleDeleteContainer={handleDeleteContainer}
  avgContainerRate={avgContainerRate}
  tripUuid={trip.trip_uuid}
   reloadKey={containerReloadKey}
/>

  </div>
       )}
    {activeTab === "tripFile" && (
       <div className="finance-section">
    <TripDocumentTable  tripFileData={tripFileData} handleDeleteTripFile={handleDeleteTripFile} 
    handleDocumentRowClick={handleDocumentRowClick} formatDate={formatDate}/>
  </div>
       )}
      {activeTab === "log" && (
        <TripLog addLog={addLog} trip={trip} formatDate={formatDate} />
       )}
         {/* FOOTER */}
         <div className="footer-btns"> 
          <button onClick={() => goBack(true)} className="preview">   Preview </button>  
          <button className="create"  disabled={loading}  onClick={handleUpdate}>
             {loading ? "Updating..." : "Update"} </button>

         </div>
          </div>
         </div>
       </div>
      {/* MODAL */}
      {showModal && activeTab === "finance" && !showItemData &&  (
        <div className="modal-overlay">
          <TripExpense
            onCreate={handleAddFinance}
            setShowItemData={setShowItemData}
            setShowModal={setShowModal}
             tripUuid={trip.trip_uuid}
          />
        </div>
      )}
      {showModal && activeTab === "container" && !showItemData && (
  <div className="modal-overlay">
    <TripContainer
      onCreate={handleAddContainer}   // ✅ CORRECT
      setShowItemData={setShowItemData}
      setShowModal={setShowModal}
       reloadKey={containerReloadKey}
       tripUuid={trip.trip_uuid}

    />
  </div>
)}

       {showModal && activeTab === "tripFile" && !showItemData && (
        <div className="modal-overlay">
            <TripDocumentCreate
      onCreate={handleAddTripFile}   
      setShowItemData={setShowItemData}
      setShowModal={setShowModal}
    />
        </div>
      )}
    </>
  );
};

export default TripDetails;
