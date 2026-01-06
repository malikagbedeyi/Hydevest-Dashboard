import React, { useRef, useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/Purchase/tripDetails.scss";
import { Plus, X, Edit, Trash2, ChevronDown, ChevronUp, Paperclip } from "lucide-react";

import TripFinnce from "./TripExpense/TripFinnce";
import DrildownContainer from "../container/DrildownContainer";
import TripExpense from "./TripExpense/TripExpense";
import TripContainer from "./TripContainer/TripContainer";
import TripDocumentDrill from "./TripDocument/TripDocumentDrill";
import TripExpenseData from "./TripExpense/TripExpenseData";
import TripContainerData from "./TripContainer/TripContainerData";
import TripDocumentCreate from "./TripDocument/TripDocumentCreate";
import TripDocumentTable from "./TripDocument/TripDocumentTable";

const statusOption = ["Not Started" , "Intransit " ,"Completed"];

const TripDetails = ({ trip, goBack }) => {
  /* ================== STORAGE KEYS ================== */
  const FINANCE_KEY = `trip-${trip.id}-finance`;
  const CONTAINER_KEY = `trip-${trip.id}-container`;
  const TRIP_FILE_KEY = `trip-${trip.id}-tripFile`;
  const LOG_KEY = `trip-${trip.id}-log-history`;


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
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("Not Started");
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);  
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showItemData, setShowItemData] = useState(false);
  
  /* ================== TRIP META ================== */
  const [title, setTitle] = useState(trip?.title || "");
  const [description, setDescription] = useState(trip?.description || "");

  useEffect(() => {
    if (!trip) return;
    setTitle(trip.title || "");
    setDescription(trip.description || "");
  }, [trip,status]);

  /* ================== FINANCE DATA ================== */
  const [financeData, setFinanceData] = useState(() => {
    return JSON.parse(localStorage.getItem(FINANCE_KEY)) || [];
  });

  useEffect(() => {
    localStorage.setItem(FINANCE_KEY, JSON.stringify(financeData));
  }, [financeData]);

  const handleAddFinance = (item) => {
    setFinanceData((prev) => [...prev, item]);
  
    addLog({
      module: "Trip Expense",
      action: "Created",
      title: item.title,
    });
  
    setShowModal(false);
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


  /* ================== CONTAINER DATA ================== */
  const [containerData, setContainerData] = useState(() => {
    return JSON.parse(localStorage.getItem(CONTAINER_KEY)) || [];
  });

  useEffect(() => {
    localStorage.setItem(CONTAINER_KEY, JSON.stringify(containerData));
  }, [containerData]);
 
  const handleAddContainer = (container) => {
    setContainerData((prev) => [...prev, container]);
  
    addLog({
      module: "Container",
      action: "Created",
      title: container.title,
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
        item.id === updatedContainer.id ? updatedContainer : item
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
  num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
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
  
/* ================== Activity Log ================== */
const [logHistory, setLogHistory] = useState(() => {
  return JSON.parse(localStorage.getItem(LOG_KEY)) || [];
});

useEffect(() => {
  localStorage.setItem(LOG_KEY, JSON.stringify(logHistory));
}, [logHistory]);

const addLog = ({ module, action, title }) => {
  const log = {
    id: Date.now(),
    module,
    action,
    title,
    date: new Date().toISOString(),
  };

  setLogHistory((prev) => [log, ...prev]);
};

const handleDeleteLog = (id) => {
  setLogHistory((prev) => prev.filter((log) => log.id !== id));
};
/* ================== LOG PAGINATION ================== */
const logItemsPerPage = 10;
const [logPage, setLogPage] = useState(1);

const totalLogPages = Math.ceil(logHistory.length / logItemsPerPage);
const logStartIndex = (logPage - 1) * logItemsPerPage;

const currentLogs = logHistory.slice(
  logStartIndex,
  logStartIndex + logItemsPerPage
);

const nextLogPage = () =>
  logPage < totalLogPages && setLogPage((p) => p + 1);

const prevLogPage = () =>
  logPage > 1 && setLogPage((p) => p - 1);



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
/* ================== EXPENSE CATEGORIES ================== */
const containerExpenses = financeData.filter(
  (item) => item.check === "Container Payment"
);

const generalExpenses = financeData.filter(
  (item) => item.check === "General"
);

const avgContainerRate =
  containerExpenses.length > 0
    ? containerExpenses.reduce((sum, item) => sum + Number(item.rate || 0), 0) /
      containerExpenses.length
    : 0;

    const totalContainerExpenseAmount = containerExpenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
    const totalGeneralExpenseNGN = generalExpenses.reduce(
      (sum, item) => sum + Number(item.amountNGN || 0),
      0
    );
    const totalContainers = containerData.length;

    const totalAmountNGN =
  totalContainers > 0
    ? totalContainerExpenseAmount * avgContainerRate +
      totalGeneralExpenseNGN / totalContainers
    : totalContainerExpenseAmount * avgContainerRate;

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

  /* ================== DRILLDOWN ================== */
  if (showTripDetails) {
    return <TripFinnce trip={selectedTrip}
     goBack={() => setShowTripDetails(false)} />;
  }

  if (showContainerDetails) {
    return <DrildownContainer
     container={selectedContainerDrill}
      goBack={() => setShowContainerDetails(false)}
      onUpdate={handleUpdateContainer} 
      avgContainerRate={avgContainerRate}
      formatNumber={formatNumber} totalAmountUSD={totalAmountUSD} totalAmountNGN={totalAmountNGN}
      totalContainers={totalContainers} totalUnitPriceUSD={totalUnitPriceUSD}  />;
  }
  if (showDocumentDril) {
    return <TripDocumentDrill
     trip={selectedDocument}
      goBack={() => setShowDocumentDril(false)} />;
  }

  const currentData = currentFinance;
  const tableDataContainer = containerData || [];

  /* ================== UI ================== */
  return (
    <>
    <div className="trip-details-grid">
    <div className="trip-details-grid-content">
    <div className="drill-summary-grid">
      <div className="drill-summary">
      <div className="summary-item">
  <p className="small">Total Amount (USD)</p>
  <h2>{formatNumber(totalAmountUSD)}</h2>
</div>

<div className="summary-item">
  <p className="small">Total Amount (NGN)</p>
  <h2>
    {new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(totalAmountNGN)}
  </h2>
</div>

<div className="summary-item">
  <p className="small">Total Container</p>
  <h2>{totalContainers}</h2>
</div>

<div className="summary-item">
  <p className="small">Total Pieces</p>
  <h2>{formatNumber(totalUnitPriceUSD)}</h2>
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
              {editTitle ? (
                <input
                  value={title}
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
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
              <p>{trip?.sn}</p>
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
            {!editDescription && <Edit size={16} onClick={() => setEditDescription(true)} />}
          </div>
          <div className="desc-body">
            {editDescription ? (
              <textarea
                value={description}
                autoFocus
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setEditDescription(false)}
              />
            ) : (
              <p>{description}</p>
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
                <Plus size={30} className="tab-content-icon" />
                <p>
  {activeTab === "finance"
    ? "Add Item"
    : activeTab === "container"
    ? "Add Container"
    : "Add Document"}
</p>

              </button>
            </div>
          </div>
        </div>
        {/* FINANCE TABLE */}
        {activeTab === "finance" && showItemData && (
          <div className="finance-section">
            <TripExpenseData currentData={currentData} 
          handleRowClick={handleRowClick} 
           handleAddFinance={handleAddFinance} financeData ={financeData}
            handleDeleteFinance={handleDeleteFinance} openDeletePopup={openDeletePopup} />
            {/* DELETE CONFIRM POPUP */}
            {showDeletePopup && (
              <div className="trip-card-popup">
                <div className="trip-card-popup-container">
                  <div className="popup-content">
                    <div className="popup-proceeed-wrapper">
                      <p>Are you sure you want to delete this Expense record?</p>
                      <div className="btn-row-delete">
                        <button className="cancel" onClick={cancelDelete}>
                          Cancel
                        </button>
                        <button className="create" onClick={confirmDelete}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* CONTAINER TABLE */}
        {activeTab === "container" && showItemData && (
        <div className="finance-section">
          <TripContainerData  containerData={containerData} 
          handleContainerRowClick={handleContainerRowClick} handleDeleteContainer={handleDeleteContainer} />
        </div>
        )}
{activeTab === "tripFile" && showItemData && (
  <div className="finance-section">
   
    <TripDocumentTable tripFileData={tripFileData}
    handleDeleteTripFile={handleDeleteTripFile}
     handleDocumentRowClick={handleDocumentRowClick} 
    formatDate={formatDate} />
  </div>
)}
{activeTab === "log" && (
  <div className="finance-section">
     <div className="userTable">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Module</th>
              <th>Action Performed</th>
              <th>Title</th>
              <th>Date & Time</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentLogs.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Activity Recorded
                </td>
              </tr>
            ) : (
              currentLogs.map((log, idx) => (
                <tr key={log.id}>
                  <td>{logStartIndex + idx + 1}</td>
                  <td>{log.module}</td>
                  <td>
                    <span
                      style={{
                        color:
                          log.action === "Created"
                            ? "green"
                            : log.action === "Deleted"
                            ? "red"
                            : "orange",
                        fontWeight: 600,
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td>{log.title}</td>
                  <td>
                    {formatDate(log.date)}{" "}
                    {new Date(log.date).toLocaleTimeString()}
                  </td>
                  <td>
                    <Trash2
                      size={16}
                      color="red"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDeleteLog(log.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* LOG PAGINATION */}
        {totalLogPages > 1 && (
          <div className="pagination">
            <button onClick={prevLogPage} disabled={logPage === 1}>
              Previous
            </button>
            <span>
              {logPage} / {totalLogPages}
            </span>
            <button
              onClick={nextLogPage}
              disabled={logPage === totalLogPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}
         {/* FOOTER */}
         <div className="footer-btns">
          <button onClick={() => goBack(true)} className="preview">
            Preview
          </button>

          <button
            className="create"
            onClick={() => {
              scrollToTop();
              setStatus("Not Started");
            }}
          >
            Update
          </button>
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
          />
        </div>
      )}
      {showModal && activeTab === "container" && !showItemData && (
  <div className="modal-overlay">
    <TripContainer
      onCreate={handleAddContainer}   // ✅ CORRECT
      setShowItemData={setShowItemData}
      setShowModal={setShowModal}
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
