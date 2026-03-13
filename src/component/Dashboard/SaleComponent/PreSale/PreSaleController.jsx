import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";

import CreatePreSale from "./CreatePreSale";
import PreSaleTable from "./PreSaleTable";
import DrilldownPresale from "./DrilldownPresale";
import PresaleLog from "./PresaleLog";

import { PresaleServices } from "../../../../services/Sale/presale";
import { SaleServices } from "../../../../services/Sale/sale";

const PreSaleController = ({ openSubmenu }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [datas, setDatas] = useState([]);
  const [containers, setContainers] = useState([]);

  const [view, setView] = useState("table"); // table | create | edit
  const [activeTab, setActiveTab] = useState("table"); // table | logs

  const [editingSale, setEditingSale] = useState(null);
  const [page, setPage] = useState(1);
const [loadingTable, setLoadingTable] = useState(false);
const [pagination, setPagination] = useState({
  currentPage: 1,
  lastPage: 1,
  total: 0,
});
const [search, setSearch] = useState("");
const [searchField, setSearchField] = useState("all");
const [openFieldSelect, setOpenFieldSelect] = useState(false);

const [showFilters, setShowFilters] = useState(false);
const [openStatusSelect, setOpenStatusSelect] = useState(false);
const [openSaleOptionSelect, setOpenSaleOptionSelect] = useState(false);

const [filters, setFilters] = useState({
  status: "",
  pre_sale_unique_id: "",
  sale_option: "",
  date_created: "",
  from_date: "",
  to_date: ""
});

const logFields = ["all", "Pre-sale ID", "Performed By"];
const preSaleFields = ["all", "pre_sale_unique_id", "sale_option", "date_created"]; 
const activeFields = activeTab === "table" ? preSaleFields : logFields;

useEffect(() => {
  setSearchField("all");
  setSearch("");
}, [activeTab]);

 /* ================= FETCH SALE CONTAINERS ================= */
useEffect(() => {
  const fetchContainers = async () => {
    try {
      // Use Sale container list endpoint instead of presale
      const res = await PresaleServices.containerList({});
      setContainers(res.data?.record ?? []);
    } catch (err) {
      console.error("Failed to fetch sale containers:", err);
      setContainers([]);
    }
  };

  fetchContainers();
}, []);

  /* ================= FETCH PRESALES ================= */
 const fetchPreSales = async (pageNum = page) => {
  setLoadingTable(true);

  try {
    const res = await PresaleServices.list({
  ...filters,
  page: pageNum
});
    const record = res.data?.record;

    setDatas(record?.data ?? []);

    setPagination({
      currentPage: record?.current_page ?? 1,
      lastPage: record?.last_page ?? 1,
      total: record?.total ?? 0,
    });

  } catch (err) {
    console.error(err);
    setDatas([]);
  } finally {
    setLoadingTable(false);
  }
};

useEffect(() => {
  const timer = setTimeout(() => {
    fetchPreSales(page);
  }, 400);

  return () => clearTimeout(timer);
}, [page, filters]);

const metrics = datas.reduce(
  (acc, sale) => {
    const wcPieces = Number(sale.wc_pieces) || 0;
    const pricePerPiece = Number(sale.price_per_piece) || 0;
    const pricePerKg = Number(sale.price_per_kg) || 0;

    const containersCount = sale.container ? 1 : 0;

    const totalPallets = Number(sale.total_no_of_pallets) || 0;
    const totalPalletPieces = Number(sale.pallet_pieces) || 0;
    const totalExpectedRev = Number(sale.expected_sales_revenue) || 0;

    acc.totalPreSales += 1;
    acc.totalWcPieces += wcPieces;
    acc.totalContainers += containersCount;

    acc.totalPricePerPiece += pricePerPiece;
    acc.totalPricePerKg += pricePerKg;

    acc.totalPallets += totalPallets;
    acc.totalPalletPieces += totalPalletPieces;

    acc.totalExpectedRev += totalExpectedRev;

    return acc;
  },
  {
    totalPreSales: 0,
    totalWcPieces: 0,
    totalContainers: 0,
    totalPricePerPiece: 0,
    totalPricePerKg: 0,
    totalPallets: 0,
    totalPalletPieces: 0,
    totalExpectedRev: 0,
  }
);
const avgExpectedRevenue =
  metrics.totalPreSales > 0
    ? metrics.totalExpectedRev / metrics.totalPreSales
    : 0;

const avgPricePerPiece =
  metrics.totalPreSales > 0
    ? metrics.totalPricePerPiece / metrics.totalPreSales
    : 0;

const avgPricePerKg =
  metrics.totalPreSales > 0
    ? metrics.totalPricePerKg / metrics.totalPreSales
    : 0;
    const avgPieces =
  metrics.totalPreSales > 0
    ? metrics.totalWcPieces / metrics.totalPreSales
    : 0;

  const formatMoneyNGN = (value) =>
    value === "" ? "" : "₦" + Number(value).toLocaleString("en-NG");

  const formatNumber = (value) =>
    value === "" ? "" : Number(value).toLocaleString("en-NG");

  /* ================= EDIT VIEW ================= */
  if (view === "edit" && editingSale) {
    return (
<DrilldownPresale
  data={editingSale}
  goBack={() => {
    setView("table");
    fetchPreSales(page);
  }}
  onUpdate={(updatedRecord, navigate = true) => {
    setDatas(prev =>
      prev.map(d =>
        d.pre_sale_uuid === updatedRecord.pre_sale_uuid
          ? updatedRecord
          : d
      )
    );
  }}
/>
    );
  }

  /* ================= CREATE VIEW ================= */
  if (view === "create") {
    return (
      <CreatePreSale
        containersData={containers}
        setView={setView}
        datas={datas} // Current list
      setDatas={setDatas}
        refreshTable={() => fetchPreSales(1)}
      />
    );
  }

  /* ================= MAIN CONTROLLER ================= */
  return (
    <div className="controller">
      <div className="controller-container">
        <div className="controller-content">

          {/* ===== TOP BAR ===== */}
          <div className="top-content">
            <div className="drill-summary-grid mb-5">
          <div className="drill-summary">
             <div className="summary-item">
              <p className="small">Total Container</p>
              <h2>{metrics.totalContainers}</h2>
            </div>
             <div className="summary-item">
              <p className="small">Average WC Pieces</p>
              <h2>{formatMoneyNGN(avgPieces)}</h2>
            </div>
            <div className="summary-item">
              <p className="small">Average Expected Revenue</p>
              <h2>{formatMoneyNGN(avgExpectedRevenue)}</h2>
            </div>
          <div className="summary-item">
  <p className="small">Average Price Per Piece </p>
  <h2>{formatMoneyNGN(avgPricePerPiece)}</h2>
</div>

<div className="summary-item">
  <p className="small">Average Price per KG </p>
  <h2>{formatMoneyNGN(avgPricePerKg)}</h2>
</div>
          </div>
        </div>
            <div className="top-content-wrapper">
              <div className="left-wrapper" />

              <div className="right-wrapper">
                <div className="right-wrapper-input">
                  <Search className="input-icon" />
    <input
  placeholder={`Search by ${searchField === 'all' ? 'All Fields' : searchField}...`}
  value={search}
  onChange={(e) => {
    const value = e.target.value;
    setSearch(value);
    setFilters((prev) => {
      const updated = { ...prev };
      if (activeTab === "table") {
        updated.pre_sale_unique_id = (searchField === "all" || searchField === "pre_sale_unique_id") ? value : "";
      } else {
        // LOG MAPPING
        updated.entity_id = (searchField === "all" || searchField === "Pre-sale ID") ? value : "";
        updated.user_name = (searchField === "all" || searchField === "Performed By") ? value : "";
      }
      return updated;
    });
  }}
/>
                </div>

                <div className="select-input">
                  <div className="filter"onClick={() => setShowFilters(!showFilters)}>
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
            : searchField.replace("_", " ")}
        </span>
      </div>

      <ChevronDown className={openFieldSelect ? "up" : "down"} />
    </div>

   {openFieldSelect && (
  <div className="custom-select-dropdown">
    {activeFields.map((field) => (
      <div key={field} className="option-item" onClick={() => { setSearchField(field); setOpenFieldSelect(false); }}>
        {field === "all" ? "All Fields" : field.replace("_", " ").toUpperCase()}
      </div>
    ))}
  </div>
)}

  </div>
</div>

                <button onClick={() => setView("create")}>
                  Create Pre-Sale
                </button>
              </div>
            </div>

            {/* ===== TABS ===== */}
            {showFilters && (
  <div className="filters-panel">

{activeTab !== "logs" && (
  <>
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

    {/* SALE OPTION */}
    <div className="filter-item">
      <div
        className="custom-select-drop"
        onClick={() => setOpenSaleOptionSelect(!openSaleOptionSelect)}
      >
        <div className="select-box">
          <span>
            {filters.sale_option || "All Sale Options"}
          </span>
        </div>

        <ChevronDown
          className={openSaleOptionSelect ? "up" : "down"}
        />
      </div>

      {openSaleOptionSelect && (
        <div className="custom-select-dropdown">

          {["", " BOX SALE", "SPLIT SALE","MIXED SALE"].map((opt) => (
            <div
              key={opt}
              className="option-item"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  sale_option: opt
                }));
                setOpenSaleOptionSelect(false);
              }}
            >
              {opt === "" ? "All Sale Options" : opt}
            </div>
          ))}

        </div>
      )}
    </div>
    </>
)}
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
            <div className="log-tab-section">
              <div className="tab-content">
                <ul>
                  <li
                    className={activeTab === "table" ? "active" : ""}
                    onClick={() => setActiveTab("table")}
                  >
                    Pre-Sale Table
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
                 {datas.length === 0 && view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Pre-sale Created Yet</p>
                  <span>A Pre-sale created would be saved here automatically</span>
                </div>
              </div>
            )}
            {activeTab === "table" && (
<PreSaleTable
  preSales={datas}
  page={pagination.currentPage}
  lastPage={pagination.lastPage}
  setPage={setPage}
  loading={loadingTable}
  onEdit={(sale) => {
    setEditingSale(sale);
    setView("edit");
  }}
/>
            )}

            {activeTab === "logs" && (
  <PresaleLog filters={filters} search={search} />
)}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PreSaleController;