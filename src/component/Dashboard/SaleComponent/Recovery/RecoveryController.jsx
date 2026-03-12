import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";
import CreateRecovery from "./CreateRecovery";
import RecoveryTable from "./RecoveryTable";
import { RecoveryServices } from "../../../../services/Sale/recovery";
import DrillDownRecovery from "./DrillDownRecovery";
import RecoveryLog from "./RecoveryLog";
import { useOutletContext } from "react-router-dom";

const API_URL = "/api/recoveries";

const RecoveryController = ({}) => {
  const [data, setData] = useState([]);
  const [sales, setSales] = useState([]);
  const [view, setView] = useState("empty");
  const [selectedRecovery, setSelectedRecovery] = useState(null);
  const [activeTab, setActiveTab] = useState("table");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); // Added loading state

  // --- SEARCH & FILTER STATES ---
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [openFieldSelect, setOpenFieldSelect] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [openPaymentStatusSelect, setOpenPaymentStatusSelect] = useState(false);


  const { autoOpenCreate, setAutoOpenCreate } = useOutletContext();

    useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false); // Reset
    }
  }, [autoOpenCreate]);
  
  const [filters, setFilters] = useState({
    sale_unique_id: "",
    customer_name: "",
    payment_status: "",
    from_date: "",
    to_date: "",
    // log specific
    recovery_unique_id: "",
    user_name: ""
  });

  const [pagination, setPagination] = useState({
    page: 1, limit: 10, totalPages: 1, total: 0
  });

  // Define Fields based on Tab
  const logFields = ["all", "Recovery ID", "Sale ID", "Performed By"];
  const tableFields = ["all", "sale iD", "customer", ];
  const activeFields = activeTab === "table" ? tableFields : logFields;

  // 1. Reset search on tab change
  useEffect(() => {
    setSearchField("all");
    setSearch("");
    setFilters(prev => ({ ...prev, sale_unique_id: "", customer_name: "", payment_status: "" }));
  }, [activeTab]);

 
const fetchRecoveries = async (pageNum = page) => {
    try {
      setLoading(true);
      const result = await RecoveryServices.list({
        page: pageNum,
        ...filters // ✅ THIS SENDS YOUR FILTERS TO THE BACKEND
      });

      const records = result.data?.record?.data || [];
      setData(records);
      setPagination({
        page: result.data.record?.current_page || 1,
        limit: result.data.record?.per_page || 10,
        totalPages: result.data.record?.last_page || 1,
        total: result.data.record?.total || 0
      });

setView((prevView) => {
      if (prevView === "create") return "create"; 
      return records.length ? "table" : "empty";
    });
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecoveries(page);
    }, 400);
    return () => clearTimeout(timer);
  }, [page, filters]);

  const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearch(value);

  setFilters((prev) => {
    const updated = { ...prev };

    updated.sale_unique_id = "";
    updated.customer_name = "";
    updated.recovery_unique_id = "";
    updated.user_name = "";

    if (activeTab === "table") {
      if (searchField === "all") {
        updated.sale_unique_id = value; 
      } else {
        updated[searchField] = value;
      }
    } else {
      // LOG MAPPING
      if (searchField === "all") {
        updated.recovery_unique_id = value;
      } else if (searchField === "Recovery ID") {
        updated.recovery_unique_id = value;
      } else if (searchField === "Sale ID") {
        updated.sale_unique_id = value;
      } else if (searchField === "Performed By") {
        updated.user_name = value;
      }
    }
    return updated;
  });
};
const enrichedRecoveries = Array.isArray(data)
  ? data
      .map((rec, idx) => ({
        ...rec,
        sn: (pagination.page - 1) * pagination.limit + idx + 1,
        saleUniqueId: rec?.sale?.sale_unique_id || "",
        customerName: `${rec.customer?.firstname || ""} ${rec.customer?.lastname || ""}`,
        customerPhone: rec.customer?.phone_no || "",
        amountPaid: Number(rec.amount) || 0,
        createdAt: rec.created_at,
        status: Number(rec.status),
      }))
      .filter((item) => {
        if (!search) return true;
        const s = search.toLowerCase();

        return (
          item.saleUniqueId.toLowerCase().includes(s) ||
          item.customerName.toLowerCase().includes(s) ||
          item.customerPhone.toLowerCase().includes(s) ||
          (item.recovery_unique_id && item.recovery_unique_id.toLowerCase().includes(s))
        );
      })
  : [];
  const handlePageChange = (page) => {
    fetchRecoveries(page);
  };

const handleAddData = () => {
  setView("table");
  fetchRecoveries(1);
};

  const handleDeleteData = async (id) => {
  try {
    await RecoveryServices.delete(id); // use your service method
    fetchRecoveries(pagination.page);
  } catch (err) {
    console.error("Delete failed", err);
  }
};

  const handleUpdateRecovery = (updatedRecovery) => {
    setData((prev) =>
      prev.map((rec) =>
        rec.id === updatedRecovery.id ? updatedRecovery : rec
      )
    );
  };


  
   const handleRowClick = (rec) => {
  setSelectedRecovery(rec);
  setView("drilldown");
};

  return (
    <div className="controller">
      <div className="controller-container">
        <div className="controller-content">

          {(view === "empty" || view === "table") && (
            <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper" />
                <div className="right-wrapper">
              {/* SEARCH INPUT */}
                  <div className="right-wrapper-input">
                    <Search className="input-icon" />
                    <input 
                      type="text" 
                      placeholder={`Search by ${searchField.replace("_", " ")}...`} 
                      value={search}
                      onChange={handleSearchChange} 
                    />
                  </div>

                  {/* ADD FILTER BUTTON */}
                  <div className="select-input">
                    <div className="filter" onClick={() => setShowFilters(!showFilters)}>
                      <span>Add Filter</span>
                      <Filter />
                    </div>
                  </div>

                  {/* FIELD SELECT */}
                  <div className="select-input">
                    <div className="select-input-field">
                      <div className="custom-select-drop" onClick={() => setOpenFieldSelect(!openFieldSelect)}>
                        <div className="select-box">
                          <span>{searchField === "all" ? "All Fields" : searchField.replace("_", " ").toUpperCase()}</span>
                        </div>
                        <ChevronDown className={openFieldSelect ? "up" : "down"} />
                      </div>. 
                      {openFieldSelect && (
                        <div className="custom-select-dropdown">
                          {activeFields.map(field => (
                            <div key={field} className="option-item" onClick={() => { setSearchField(field); setOpenFieldSelect(false); }}>
                              {field.replace("_", " ").toUpperCase()}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setView("create")}>
                    Create Record
                  </button>

                </div>
              </div>
           {showFilters && (
                <div className="filters-panel">
                 
{/* <div className="filter-item">
  <div className="custom-select-drop" onClick={() => setOpenPaymentStatusSelect(!openPaymentStatusSelect)}>
    <div className="select-box">
      <span>{filters.payment_status || "All Payment Status"}</span>
    </div>
    <ChevronDown className={openPaymentStatusSelect ? "up" : "down"} />
  </div>
  {openPaymentStatusSelect && (
    <div className="custom-select-dropdown">
      {["", "Part Payment", "Full Payment"].map(status => (
        <div 
          key={status} 
          className="option-item" 
          onClick={() => { 
             setFilters(prev => ({ ...prev, payment_status: status }));setPage(1);
            setOpenPaymentStatusSelect(false); 
          }}
        >
          {status === "" ? "All Payment Status" : status}
        </div>
      ))}
    </div>
  )}
</div> */}
                  <div className="filter-item">
                    <input type="date" value={filters.from_date} onChange={(e) => setFilters(prev => ({ ...prev, from_date: e.target.value }))} />
                  </div>
                  <div className="filter-item">
                    <input type="date" value={filters.to_date} onChange={(e) => setFilters(prev => ({ ...prev, to_date: e.target.value }))} />
                  </div>
                </div>
              )}

              {/* TABS */}
              <div className="log-tab-section">
                <div className="tab-content">
                  <ul>
                    <li className={activeTab === "table" ? "active" : ""} onClick={() => setActiveTab("table")}>Recovery Table</li>
                    <li className={activeTab === "logs" ? "active" : ""} onClick={() => setActiveTab("logs")}>Activity Log</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="main-content">

            {data.length === 0 && view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Recoveries Yet</p>
                  <span>
                    A recovery record will appear here automatically after a
                    sale payment.
                  </span>
                </div>
              </div>
            )}

{view === "table" && activeTab === "table" && (
  <RecoveryTable
    data={enrichedRecoveries}
    pagination={pagination}
    onPageChange={handlePageChange}
    onDelete={handleDeleteData}
    onUpdate={handleUpdateRecovery}
    handleRowClick={handleRowClick}
  />
)}
{(view === "table" || view === "empty") && activeTab === "logs" && (
        <RecoveryLog filters={filters} search={search} />
      )}
            {view === "create" && (
              <CreateRecovery
                SalesData={sales}
                data={data}
                setData={setData}
                setView={setView}
                onCreate={handleAddData}
              />
            )}
            {view === "drilldown" && (
              <DrillDownRecovery
                 data={selectedRecovery}
                 goBack={() => setView("table")}
                onUpdate={handleUpdateRecovery}
               />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryController;