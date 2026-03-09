import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";

import ContainerTable from "./ContainerTable";
import ContainerLogs from "./ContainerLogs";
import DrildownContainer from "./DrildownContainer";

import { ContainerServices } from "../../../../services/Trip/container";
import { TripServices } from "../../../../services/Trip/trip";

const ContainerController = () => {
  const [view, setView] = useState("table");
  const [containers, setContainers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("table");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [selectedContainer, setSelectedContainer] = useState(null);

  const fetchContainersWithFinance = async (pageNum = page) => {
    try {
      setLoading(true);

      /* =========================
         1️⃣ FETCH CONTAINERS
      ========================= */
      const params = {
        page: pageNum,
        title: search || undefined,
        container_unique_id: search || undefined,
        date_created: search || undefined,
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
        // const fxRate = fxMap[item.trip_uuid];

return {
  ...item,
  amountUSD,
  quotedUSD,
  // amountNGN:
    // fxRate != null ? amountUSD * fxRate : null,
  // quotedNGN:
    // fxRate != null ? quotedUSD * fxRate : null,
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
    fetchContainersWithFinance(page);
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchContainersWithFinance(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);
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
     DRILLDOWN VIEW
  ========================= */
  if (view === "details" && selectedContainer) {
    return (
     <DrildownContainer
  container={selectedContainer}
  goBack={() => {
    fetchContainersWithFinance(page);
    setView("table");
  }}
  reloadTable={() => fetchContainersWithFinance(page)}
  onUpdate={(updated) => {
    setContainers((prev) =>
      prev.map((c) =>
        c.container_uuid === updated.container_uuid
          ? updated
          : c
      )
    );
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
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="select-input">
                  <div className="filter">
                    <span>Add Filter</span>
                    <Filter />
                  </div>
                </div>

                <div className="select-input">
                  <div className="select-input-field">
                    <span>All Field</span>
                    <ChevronDown />
                  </div>
                </div>
              </div>
            </div>
      <div className="drill-summary-grid mt-5">
      <div className="drill-summary">
<div className="summary-item">
  <p className="small">Total Container</p>
  <h2>{totalContainers}</h2>
</div>
<div className="summary-item">
  <p className="small">Total Amount (USD)</p>
  <h2>{"$" + totalAmountUSD.toLocaleString()}</h2>
</div>
<div className="summary-item">
  <p className="small">Total Pieces</p>
  <h2>{totalPieces.toLocaleString()}</h2>
</div>
<div className="summary-item">
  <p className="small">Total Quoted Amount (USD)</p>
  <h2>{"$" + totalQuotedUSD.toLocaleString()}</h2>
</div>
<div className="summary-item">
  <p className="small">Total Unit Price (USD)</p>
  <h2>{"$" + totalUnitPriceUSD.toLocaleString()}</h2>
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