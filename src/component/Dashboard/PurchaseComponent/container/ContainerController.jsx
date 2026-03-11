import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";

import ContainerTable from "./ContainerTable";
import ContainerLogs from "./ContainerLogs";
import DrildownContainer from "./DrildownContainer";

import { ContainerServices } from "../../../../services/Trip/container";
import { TripServices } from "../../../../services/Trip/trip";
import { useTripFinance } from "../trip/hook/useTripFinance";

const ContainerController = ({ breadcrumb, navigate, goBackTo }) => {
  const [view, setView] = useState("table");
  const [containers, setContainers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("table");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [selectedContainer, setSelectedContainer] = useState(null);
const [searchField, setSearchField] = useState("all");
const [openFieldSelect, setOpenFieldSelect] = useState(false);
const [tripContainerCount, setTripContainerCount] = useState(0);
const [showFilters, setShowFilters] = useState(false);
const [openStatusSelect, setOpenStatusSelect] = useState(false);

const { avgContainerRate, financeData } = useTripFinance(
  selectedContainer?.trip?.trip_uuid
);

useEffect(() => {
}, [avgContainerRate, financeData, selectedContainer]);
const [filters, setFilters] = useState({
  status: "",
  title: "",
  container_unique_id: "",
  date_created: "",
  from_date: "",
  to_date: ""
});

useEffect(() => {
  const last = breadcrumb[breadcrumb.length - 1];

  if (!last) return;

  if (last.view === "controller") {
    setView("table");
  }

  if (last.view === "details") {
    setView("details");
    setSelectedContainer(last.trip);
  }
}, [breadcrumb]);


  const fetchContainersWithFinance = async (pageNum = page) => {
    try {
      setLoading(true);

      /* =========================
         1️⃣ FETCH CONTAINERS
      ========================= */
      const params = {
  ...filters,
  page: pageNum
};

      const containerRes = await ContainerServices.list(params);
      const containerData = containerRes.data?.record?.data || [];

      /* =========================
         2️⃣ EXTRACT UNIQUE TRIP UUIDs
      ========================= */
      const tripUuids = [
        ...new Set(
          containerData
            .map((c) => c.trip_uuid)
            .filter(Boolean)
        ),
      ];


      /* =========================
         5️⃣ CALCULATE USD + NGN PER CONTAINER
      ========================= */
      const mappedContainers = containerData.map((item) => {
        const amountUSD =
          Number(item.unit_price_usd || 0) *
            Number(item.pieces || 0) +
          Number(item.shipping_amount_usd || 0);

        const quotedUSD = Number(item.quoted_price_usd || 0);

return {
  ...item,
  amountUSD,
  quotedUSD,
};
      });

      setContainers(mappedContainers);
      setPagination(containerRes.data?.record || {});
    } catch (err) {
      console.error("❌ Fetch containers failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EFFECTS
  ========================= */
useEffect(() => {
  const timer = setTimeout(() => {
    fetchContainersWithFinance(page);
  }, 400);

  return () => clearTimeout(timer);
}, [page, filters]);
/* =========================
   CALCULATE DRILL SUMMARY
========================= */
const totalContainers = containers.length;

const totalAmountUSD = containers.reduce(
  (sum, item) => sum + (Number(item.amountUSD) || 0),
  0
);

const totalPieces = containers.reduce(
  (sum, item) => sum + (Number(item.pieces) || 0),
  0
);

const totalQuotedUSD = containers.reduce(
  (sum, item) => sum + (Number(item.quotedUSD) || 0),
  0
);

const totalUnitPriceUSD = containers.reduce(
  (sum, item) => sum + (Number(item.unit_price_usd || 0) || 0),
  0
);
/* =========================
   CALCULATE DRILL SUMMARY (FIXED)
========================= */

const getActiveRate = (itemTripUuid) => {
    if (selectedContainer?.trip?.trip_uuid === itemTripUuid && avgContainerRate > 0) {
        return avgContainerRate;
    }
    const storedData = localStorage.getItem(`trip_fx_rate_${itemTripUuid}`);
    if (storedData) {
        try {
            return JSON.parse(storedData).rate || 0;
        } catch {
            return 0;
        }
    }
    return 0;
};

  const getStoredRate = (tripUuid) => {
  const data = localStorage.getItem(`trip_fx_rate_${tripUuid}`);
  if (!data) return 0;

  try {
    return JSON.parse(data).rate || 0;
  } catch {
    return 0;
  }
};
const fxRate =
  avgContainerRate ||
  getStoredRate(selectedContainer?.trip_uuid);



/* =========================
   UNIFIED DATA SUMMARY (FIXED)
========================= */

const totals = useMemo(() => {
  const generalNGN = financeData.reduce((sum, item) => {
    return Number(item.is_container_payment) === 0 ? sum + Number(item.total_amount || 0) : sum;
  }, 0);

  const stats = containers.reduce((acc, item) => {
    const rate = getActiveRate(item.trip?.trip_uuid || item.trip_uuid);
    
    // 1. Calculate USD (Pieces * Price + Shipping)
    const amountUSD = (Number(item.unit_price_usd || 0) * Number(item.pieces || 0)) + 
                      Number(item.shipping_amount_usd || 0);
    
    // 2. Calculate Surcharge (Only for partners)
    const surcharge = item.funding?.toLowerCase() === "partner" ? Number(item.surcharge_ngn || 0) : 0;

    // 3. Calculate NGN (USD * Rate + Surcharge) - MATCHES TABLE LOGIC
    const amountNGN = rate > 0 ? (amountUSD * rate) + surcharge : 0;

    // 4. Quoted Logic (Matches table)
    const quotedUSD = Number(item.quoted_price_usd || 0) > 0 
                      ? Number(item.quoted_price_usd || 0) + Number(item.shipping_amount_usd || 0) 
                      : 0;

    return {
      totalNGN: acc.totalNGN + amountNGN,
      totalUSD: acc.totalUSD + amountUSD,
      totalQuotedUSD: acc.totalQuotedUSD + quotedUSD,
      totalUnitPrice: acc.totalUnitPrice + Number(item.unit_price_usd || 0),
      totalPieces: acc.totalPieces + Number(item.pieces || 0),
    };
  }, { totalNGN: 0, totalUSD: 0, totalQuotedUSD: 0, totalUnitPrice: 0, totalPieces: 0 });

  return { ...stats, generalNGN, count: containers.length };
}, [containers, financeData, avgContainerRate]);
// Helpers for the UI
const avgUnitPrice = totals.count > 0 ? (totals.totalUnitPrice / totals.count) : 0;
const avgQuotedPrice = totals.count > 0 ? (totals.totalQuotedUSD / totals.count) : 0;

  /* =========================
     DRILLDOWN VIEW
  ========================= */








  if (view === "details" && selectedContainer) {
    const siblingContainers = containers.filter(
    (c) => c.trip_id === selectedContainer.trip_id
  );

  const tripSpecificCount = siblingContainers.length > 0 ? siblingContainers.length : 0;

    return (
     <DrildownContainer container={selectedContainer} navigate={navigate} breadcrumb={breadcrumb}
  avgContainerRate={fxRate} totalGeneralNGN={totals.generalNGN} goBackTo={goBackTo}
totalContainerCount={tripSpecificCount}  goBack={() => {fetchContainersWithFinance(page);setView("table");}}
  reloadTable={() => fetchContainersWithFinance(page)}
  onUpdate={(updated) => {setContainers((prev) =>prev.map((c) => c.container_uuid === updated.container_uuid? updated: c));
  }}
/>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="controller">
      <div className="controller-container">
        <div className="controller-content">
          {/* ===== TOP BAR ===== */}
          <div className="top-content">
            <div className="top-content-wrapper">
              <div className="left-wrapper" />

              <div className="right-wrapper">
                <div className="right-wrapper-input">
                  <Search className="input-icon" />
<input
  placeholder="Search"
  value={search}
  onChange={(e) => {
    const value = e.target.value;

    setSearch(value);

    setFilters((prev) => {
      const updated = {
        ...prev,
        title: "",
        container_unique_id: "",
        date_created: ""
      };

      if (searchField === "all") {
        updated.title = value;
        updated.container_unique_id = value;
      } else {
        updated[searchField] = value;
      }

      return updated;
    });
  }}
/>
                </div>
                <div className="select-input">
               <div className="filter"
  onClick={() => setShowFilters(!showFilters)}>
  <span>Add Filter</span>
  <Filter />
</div>
</div>

                <div className="select-input">
  <div className="select-input-field">
    <div
      className="custom-select-drop"
      onClick={() => setOpenFieldSelect(!openFieldSelect)}
    >
      <div className="select-box">
        <span>
          {searchField === "all"
            ? "All Field"
            : searchField.charAt(0).toUpperCase() +
              searchField.slice(1)}
        </span>
      </div>

      <ChevronDown className={openFieldSelect ? "up" : "down"} />
    </div>

    {openFieldSelect && (
      <div className="custom-select-dropdown">
        {["all", "title","container ID","date_created"].map(
          (field) => (
            <div
              key={field}
              className="option-item"
              onClick={() => {
                setSearchField(field);
                setOpenFieldSelect(false);
              }}
            >
              {field === "all"
                ? "All Field"
                : field.replace("_", " ")}
            </div>
          )
        )}
      </div>
    )}
  </div>
</div>
  <div className="import-input">
                    <p>Import</p>
                  </div>

                  <div
                    className="import-input"
                    onClick={() => setView("export")}
                  >
                    <p>Export</p>
                  </div>
              </div>
            </div>
            {showFilters && (
  <div className="filters-panel">

    {/* STATUS */}
    <div className="filter-item">
      <div
        className="custom-select-drop"
        onClick={() => setOpenStatusSelect(!openStatusSelect)}
      >
        <div className="select-box">
          <span>
            {filters.status === ""
              ? "All Status"
              : filters.status === "1"
              ? "Approved"
              : "Pending"}
          </span>
        </div>

        <ChevronDown className={openStatusSelect ? "up" : "down"} />
      </div>

      {openStatusSelect && (
        <div className="custom-select-dropdown">
          <div
            className="option-item"
            onClick={() => {
              setFilters((prev) => ({
                ...prev,
                status: ""
              }));
              setOpenStatusSelect(false);
            }}
          >
            All Status
          </div>

          <div
            className="option-item"
            onClick={() => {
              setFilters((prev) => ({
                ...prev,
                status: "1"
              }));
              setOpenStatusSelect(false);
            }}
          >
            Approved
          </div>

          <div
            className="option-item"
            onClick={() => {
              setFilters((prev) => ({
                ...prev,
                status: "0"
              }));
              setOpenStatusSelect(false);
            }}
          >
            Pending
          </div>
        </div>
      )}
    </div>

    {/* FROM DATE */}
    <div className="filter-item">
      <input
        type="date"
        value={filters.from_date}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            from_date: e.target.value
          }))
        }
      />
    </div>

    {/* TO DATE */}
    <div className="filter-item">
      <input
        type="date"
        value={filters.to_date}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            to_date: e.target.value
          }))
        }
      />
    </div>
  </div>
)}
     <div className="drill-summary-grid mt-5">
  <div className="drill-summary">
    <div className="summary-item">
      <p className="small">Total Containers</p>
      <h2>{totals.count}</h2>
    </div>
    
    {/* Corrected: Total Amount in NGN */}
    <div className="summary-item">
      <p className="small">Total Amount (NGN)</p>
      <h2>{"₦" + totals.totalNGN.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
    </div>
    
    <div className="summary-item">
      <p className="small">Total Pieces</p>
      <h2>{totals.totalPieces.toLocaleString()}</h2>
    </div>
    
    {/* Corrected: Average Quoted Price per container */}
    <div className="summary-item">
      <p className="small">Average Quoted Price </p>
      <h2>{"$" + avgQuotedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
    </div>
    
    {/* Corrected: Average Unit Price per container */}
    <div className="summary-item">
      <p className="small">Average Unit Price </p>
      <h2>{"$" + avgUnitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
    </div>
  </div>
</div>
            {/* ===== TABS ===== */}
            <div className="log-tab-section">
              <div className="tab-content">
                <ul>
                  <li
                    className={activeTab === "table" ? "active" : ""}
                    onClick={() => setActiveTab("table")}
                  >
                    Container Table
                  </li>
                  <li
                    className={activeTab === "logs" ? "active" : ""}
                    onClick={() => setActiveTab("logs")}
                  >
                    Activity Log
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ===== MAIN CONTENT ===== */}
          <div className="main-content">
            {activeTab === "table" && (
              <ContainerTable
                data={containers}
                loading={loading}
                totalGeneralNGN={totals.generalNGN}
                getRate={getActiveRate}
                page={page}
                setPage={setPage}
                pagination={pagination}
                onRowClick={(container) => {
                  setSelectedContainer(container);
                  setView("details");
                }}
              />
            )}

            {activeTab === "logs" && selectedContainer && (
              <ContainerLogs
                containerUuid={selectedContainer.container_uuid}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerController;