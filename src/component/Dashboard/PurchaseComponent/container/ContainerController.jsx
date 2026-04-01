import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";

import ContainerTable from "./ContainerTable";
import DrildownContainer from "./DrildownContainer";

import { ContainerServices } from "../../../../services/Trip/container";
import { TripServices } from "../../../../services/Trip/trip";
import { useTripFinance } from "../trip/hook/useTripFinance";
import { ExpenseServices } from "../../../../services/Trip/expense";
import ContainerLog from "./ContainerLog";

const ContainerController = ({ breadcrumb, navigate, goBackTo }) => {
  const [view, setView] = useState("table");
  const [containers, setContainers] = useState([]);
   const [matrix, setMatrix] = useState([]);
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
const [tripRates, setTripRates] = useState({});
const [userPermissions, setUserPermissions] = useState([]);


useEffect(() => {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData && userData.permissions) {
    const perms = userData.permissions.map(p => p.name);
    setUserPermissions(perms);
  }
}, []);

const { avgContainerRate, financeData } = useTripFinance(
  selectedContainer?.trip?.trip_uuid
);

useEffect(() => {
}, [avgContainerRate, financeData, selectedContainer]);
const [filters, setFilters] = useState({
  status: "",
  title: "",
  tracking_number:"",
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
    const params = { ...filters, page: pageNum };
    const containerRes = await ContainerServices.list(params);
    const containerData = containerRes.data?.record?.data || [];
    const containerRec = containerRes.data

    const tripUuids = [...new Set(containerData.map((c) => c.trip?.trip_uuid).filter(Boolean))];
    const financeMap = {}; 

    for (const uuid of tripUuids) {
      try {
        const res = await ExpenseServices.list({ trip_uuid: uuid });
        const records = res.data?.record?.data || res.data?.data || [];
        
        const totals = records.reduce((acc, item) => {
          if (Number(item.is_container_payment) === 1) {
            acc.purchaseNgn += Number(item.total_amount || 0);
            acc.purchaseUsd += Number(item.amount || 0);
          } else {
            acc.generalOverhead += Number(item.total_amount || 0);
          }
          return acc;
        }, { purchaseNgn: 0, purchaseUsd: 0, generalOverhead: 0 });

        const countInTrip = containerData.filter(c => c.trip?.trip_uuid === uuid).length;

        financeMap[uuid] = {
          rate: totals.purchaseUsd > 0 ? totals.purchaseNgn / totals.purchaseUsd : 0,
          overheadShare: countInTrip > 0 ? totals.generalOverhead / countInTrip : 0
        };
      } catch (err) { console.error("Map failed", err); }
    }

    setTripRates(financeMap); 
    setContainers(containerData);
    setMatrix(containerRec)
    setPagination(containerRes.data?.record || {});
  } catch (err) { console.error(err); } finally { setLoading(false); }
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

 const totalContainers = pagination.total; 


/* =========================
   CALCULATE DRILL SUMMARY (FIXED)
========================= */

const getActiveRate = (tripUuid) => {
  const rate = tripRates[tripUuid] || 0

  return rate;
};

const fxRate = selectedContainer
  ? tripRates[selectedContainer.trip?.trip_uuid]?.rate || 0
  : 0;

/* =========================
   CALCULATE DRILL SUMMARY (FIXED AVERAGES)
========================= */
const [totalGeneralNGN, setTotalGeneralNGN] = useState(0);
const summaryData = useMemo(() => {
  if (containers.length === 0) return { totalLandingCost: 0, totalPieces: 0, count: 0 };

  return containers.reduce((acc, item) => {
    const tripId = item.trip?.trip_uuid || item.trip_uuid;
    const finance = tripRates[tripId] || { rate: 0, overheadShare: 0 };
    
    const pieces = Number(item.pieces || 0);
    const amountUSD = (Number(item.unit_price_usd || 0) * pieces) + Number(item.shipping_amount_usd || 0);
    const surcharge = item.funding?.toLowerCase() === "partner" ? Number(item.surcharge_ngn || 0) : 0;
    const containerNGN = (amountUSD * finance.rate) + surcharge;
    const landingCost = containerNGN + finance.overheadShare;

    return {
      totalLandingCost: acc.totalLandingCost + landingCost,
      totalPieces: acc.totalPieces + pieces,
      totalUnitPrice: acc.totalUnitPrice + Number(item.unit_price_usd || 0),
      totalQuotedPrice: acc.totalQuotedPrice + Number(item.quoted_price_usd || 0), 
      count: acc.count + 1
    };
}, {totalLandingCost: 0,totalPieces: 0,totalUnitPrice: 0,totalQuotedPrice: 0,count: 0});
}, [containers, tripRates]);

const landingCost = summaryData.count > 0 ? (summaryData.totalLandingCost) : 0

useEffect(() => {
  if (!financeData?.length) return;

  const total = financeData.reduce((sum, item) => {
    if (Number(item.is_container_payment) === 0) {
      return sum + Number(item.total_amount || 0);
    }
    return sum;
  }, 0);

  setTotalGeneralNGN(total);
}, [financeData]);

  /* =========================
     DRILLDOWN VIEW
  ========================= */


  if (view === "details" && selectedContainer) {
    const siblingContainers = containers.filter(
    (c) => c.trip_id === selectedContainer.trip_id
  );

  if (userPermissions.includes("Fontend_can't_view_container_money_format")){
    setView("details" === false)
  }

  const tripSpecificCount = siblingContainers.length > 0 ? siblingContainers.length : 0;

    return (
     <DrildownContainer
      container={selectedContainer} 
      navigate={navigate} 
      breadcrumb={breadcrumb}
  avgContainerRate={fxRate}  
  totalGeneralNGN={totalGeneralNGN} 
  goBackTo={goBackTo}
totalContainerCount={tripSpecificCount} 
 goBack={() => {fetchContainersWithFinance(page);setView("table");}}
  reloadTable={() => fetchContainersWithFinance(page)} 
  onUpdate={(updated) => {setContainers((prev) =>prev.map((c) => c.container_uuid === updated.container_uuid? updated: c));
  }}
/>
    );
  }

  const formatMoney = (value) =>
  new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatMoneyUSD = (value) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));


  const searchFields = [
  { label: "Tracking No", value: "tracking_number" },
  { label: "Container ID", value: "container_unique_id" },
  { label: "Title", value: "title" },
  { label: "Date Created", value: "date_created" }
];

  /* =========================
     UI
  ========================= */
  return (
    <div className="controller">
      <div className="controller-container">
        <div className="controller-content">
          {/* ===== TOP BAR ===== */}
          <div className="top-content">
              <div className="drill-summary-grid mb-5">
     <div className="drill-summary">
  <div className="summary-item">
    <p className="small">Total Containers</p>
    <h2>{matrix.container_count}</h2>
  </div>

  <div className="summary-item">
    <p className="small">Average Landing Cost ₦</p>
    <h2>{"₦" + matrix.average_landing_cost}</h2>
  </div>

  <div className="summary-item">
    <p className="small">Average Pieces</p>
    <h2>{matrix.average_pieces}</h2>
  </div>

  <div className="summary-item">
    <p className="small">Average Quoted Price</p>
    <h2>{"$" + matrix.average_quoted_amount_usd}</h2>
  </div>

  <div className="summary-item">
    <p className="small">Average Unit Price</p>
    <h2>{"$" + matrix.average_unit_price_usd}</h2>
  </div>
</div>
    </div>
            <div className="top-content-wrapper">
              <div className="left-wrapper" />

              <div className="right-wrapper">
                <div className="right-wrapper-input">
                  <Search className="input-icon" />
<input
placeholder={
  searchField === "all"
    ? "Search by Tracking Number"
    : `Search by ${searchFields.find(f => f.value === searchField)?.label}`
}
  value={search}
  onChange={(e) => {
  const value = e.target.value;

  setSearch(value);

  setFilters((prev) => {
    const updated = {
      ...prev,
      title: "",
      tracking_number: "",
      container_unique_id: "",
      date_created: ""
    };

    if (searchField === "all") {
      updated.tracking_number = value;
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
    : searchFields.find(f => f.value === searchField)?.label}
</span>
      </div>

      <ChevronDown className={openFieldSelect ? "up" : "down"} />
    </div>

  {openFieldSelect && (
  <div className="custom-select-dropdown">
    <div
      className="option-item"
      onClick={() => {
        setSearchField("all");
        setOpenFieldSelect(false);
      }}
    >
      All Field
    </div>

    {searchFields.map((field) => (
      <div
        key={field.value}
        className="option-item"
        onClick={() => {
          setSearchField(field.value);
          setOpenFieldSelect(false);
        }}
      >
        {field.label}
      </div>
    ))}
  </div>
)}
  </div>
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
                  {/* <li
                    className={activeTab === "logs" ? "active" : ""}
                    onClick={() => setActiveTab("logs")}
                  >
                    Activity Log
                  </li> */}
                </ul>
              </div>
            </div>
          </div>

          {/* ===== MAIN CONTENT ===== */}
          <div className="main-content">
            {activeTab === "table" && (
              <ContainerTable
                data={containers}
                landingCost={landingCost}
                loading={loading}
                totalGeneralNGN={totalGeneralNGN} 
                getRate={getActiveRate}
                page={page} totalContainerCount={tripContainerCount} 
                setPage={setPage}
               permissionAssign={userPermissions.includes("Fontend_can't_view_container_money_format")}
                pagination={pagination}
                onRowClick={(container) => {
                  setSelectedContainer(container);
                  setView("details");
                }}
              />
            )}

            {activeTab === "logs"  && (
              <ContainerLog container_uuid={containers.container_uuid}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerController;