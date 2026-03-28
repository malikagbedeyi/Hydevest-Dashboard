import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";

import CreatePreSale from "./CreatePreSale";
import PreSaleTable from "./PreSaleTable";
import DrilldownPresale from "./DrilldownPresale";
import PresaleLog from "./PresaleLog";

import { PresaleServices } from "../../../../services/Sale/presale";
import { SaleServices } from "../../../../services/Sale/sale";
import { useOutletContext } from "react-router-dom";

const PreSaleController = ({ openSubmenu }) => {

  const { autoOpenCreate, setAutoOpenCreate } = useOutletContext();

  useEffect(() => {
      if (autoOpenCreate) {
        setView("create");
        setAutoOpenCreate(false); 
      }
    }, [autoOpenCreate])
  

  const [searchTerm, setSearchTerm] = useState("");
  const [datas, setDatas] = useState([]);
  const [containers, setContainers] = useState([]);
 const [matrix,setMatrix]= useState([]);
  const [view, setView] = useState("table"); 
  const [activeTab, setActiveTab] = useState("table");

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

const preSaleFields = ["all", "Pre-sale ID",];
const activeFields = activeTab === "table" ? preSaleFields : logFields;

useEffect(() => {
  setSearchField("all");
  setSearch("");
}, [activeTab]);

 /* ================= FETCH SALE CONTAINERS ================= */
useEffect(() => {
  const fetchContainers = async () => {
    try {
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
      const recordRec = res?.data;
      setMatrix(recordRec)
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
const filteredData = datas.filter(sale => {
  if (!search) return true;

  if (searchField === "all") {
    return (
      sale.pre_sale_unique_id?.toLowerCase().includes(search.toLowerCase()) ||
      sale.sale_option?.toLowerCase().includes(search.toLowerCase()) ||
      sale.tracking_number?.toLowerCase().includes(search.toLowerCase())
    );
  } else {
    const fieldValue = sale[searchField];
    return fieldValue?.toLowerCase().includes(search.toLowerCase());
  }
});
  /* ================= CREATE VIEW ================= */
  if (view === "create") {
    return (
      <CreatePreSale
        containersData={containers}
        setView={setView}
        datas={datas} 
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
              <h2>{matrix.container_count}</h2>
            </div>
             <div className="summary-item">
              <p className="small">Average WC Pieces</p>
              <h2>{formatMoneyNGN(matrix.average_wc_pieces)}</h2>
            </div>
            <div className="summary-item">
              <p className="small">Average Expected Revenue</p>
              <h2>₦{(matrix.average_expected_revenue)}</h2>
            </div>
          <div className="summary-item">
  <p className="small">Average Price Per Piece </p>
  <h2>₦{(matrix.average_price_per_piece)}</h2>
</div>

<div className="summary-item">
  <p className="small">Average Price per KG </p>
  <h2>₦{(matrix.average_price_per_kg)}</h2>
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
      const updated = { 
        ...prev, 
        pre_sale_unique_id: "", 
        sale_option: "", 
        tracking_number: "", 
        status: "" 
      };

      if (activeTab === "table") {
        if (searchField === "all") {
          updated.pre_sale_unique_id = value;
          updated.sale_option = value;
          updated.tracking_number = value;
        } else {
          const fieldMap = {
            "Pre-sale ID": "pre_sale_unique_id",
            "Tracking Number": "tracking_number",
            "Sale Option": "sale_option",
            "Status": "status",
            "Date Created": "date_created"
          };
          const apiKey = fieldMap[searchField];
          if (apiKey) updated[apiKey] = value;
        }
      } else {

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