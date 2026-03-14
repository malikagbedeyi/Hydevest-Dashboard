import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import CreateTrip from "./CreateTrip";
import TripTable from "./TripTable"; 
import "../../../../assets/Styles/dashboard/controller.scss";
import TripDetails from "./TripDetails";
import { TripServices } from "../../../../services/Trip/trip";
import TripLogs from "./TripLogs";
import { SystemUserService } from '../../../../services/Account/systemUser.service';
import { useOutletContext } from "react-router-dom";

const TripController = ({ breadcrumb, navigate, goBackTo }) => {
  const [systemUsers, setSystemUsers] = useState([]);
  const [openUserSelect, setOpenUserSelect] = useState(false)
  const [view, setView] = useState("table");
   const [trip, setTrip] = useState([])
    const [search , setSearch ] = useState('')
    const [page,setPage] = useState(1)
    const [pagination,setPagination] = useState({})
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(false);
 const [activeTab, setActiveTab] = useState("table");
const [searchField, setSearchField] = useState("all");
const [openFieldSelect, setOpenFieldSelect] = useState(false);
const [showFilters, setShowFilters] = useState(false);
const [openStatusSelect, setOpenStatusSelect] = useState(false);
const [openProgressSelect, setOpenProgressSelect] = useState(false);

// Inside TripController.jsx
const { autoOpenCreate, setAutoOpenCreate } = useOutletContext();

useEffect(() => {
  if (autoOpenCreate === "create") { 
    setAutoOpenCreate(null); 
  }
}, [autoOpenCreate]);


  const logFields = ["all", "All Field", "Performed By"];
const tripFields = ["all", "title", "location", "progress"];
const activeFields = activeTab === "table" ? tripFields : logFields;
  const [filters, setFilters] = useState({
    progress: "",
    title: "",
    location: "", 
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
    setSelectedTrip(last.trip);
  }
}, [breadcrumb]);

useEffect(() => {
    const fetchSystemUsers = async () => {
      try {
        const res = await SystemUserService.list({ is_system_user: 1 });
        setSystemUsers(res.data?.record?.data || []);
      } catch (err) {
        console.error("Failed to fetch users for filter", err);
      }
    };
    if (activeTab === "logs") fetchSystemUsers();
  }, [activeTab]);

  /* ================= FETCH TRIPS ================= */
 const feacthTrip = async (pageNum = page) => {
  try {
    setLoading(true);
    
    const res = await TripServices.list({
      ...filters,
      page: pageNum
    });

    setTrip(res.data?.record?.data || []);
    setPagination(res.data?.record || {});
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const timer = setTimeout(() => {
    feacthTrip(page);
  }, 400);

  return () => clearTimeout(timer);
}, [page, filters]);
  /* ===================== UI ===================== */

  return (
    <div className="controller">
      <div className="controller-container">
        <div className="controller-content">

          {(view === "empty" || view === "table") && (
            <div className="top-content">
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
                            updated.title = (searchField === "all" || searchField === "title") ? value : "";
                            updated.location = (searchField === "all" || searchField === "location") ? value : "";
                          } else {
                            // Map logs logic
                            updated.entity_id = (searchField === "all" || searchField === "Trip ID") ? value : "";
                            updated.field_name = (searchField === "all" || searchField === "Field") ? value : "";
                            updated.user_name = (searchField === "all" || searchField === "Performed By") ? value : "";
                          }
                          return updated;
                        });
                      }}
                    />
                  </div>

<div className="select-input">
  <div className="filter" onClick={() => setShowFilters(!showFilters)}>
    <span>Add Filter</span>
    <Filter />
  </div>
</div>
      <div className="select-input">
  <div className="select-input-field">
    <div   className="custom-select-drop"
      onClick={() => setOpenFieldSelect(!openFieldSelect)}
    >
      <div className="select-box">
        <span>{searchField === "all" ? "Select Field" : searchField.charAt(0).toUpperCase() + searchField.slice(1)}</span>
        </div>
     
      <div className="custom-select">
      <ChevronDown className={openFieldSelect ? "up" : "down"} />
      </div>
    </div>

  {openFieldSelect && (
                        <div className="custom-select-dropdown">
                          {activeFields.map((field) => (
                            <div
                              key={field}
                              className="option-item"
                              onClick={() => {
                                setSearchField(field);
                                setOpenFieldSelect(false);
                              }}
                            >
                              {field === "all"
                                ? ""
                                : field.charAt(0).toUpperCase() + field.slice(1)}
                            </div>
                          ))}
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

                  <button onClick={() => setView("create")}>
                    Create Trip
                  </button>
                </div>
              </div>
                {showFilters && (
                <div className="filters-panel">
{activeTab !== "logs" && (
  <>
                  <div className="filter-item">
                    <input 
                      type="text" 
                      placeholder="Filter by Location"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
                    />
                  </div>
    <div className="filter-item">
      <div
        className="custom-select-drop"
        onClick={() => setOpenProgressSelect(!openProgressSelect)}
      >
        <div className="select-box">
          <span>{filters.progress || "All Progress"}</span>
        </div>

        <ChevronDown className={openProgressSelect ? "up" : "down"} />
      </div>

      {openProgressSelect && (
        <div className="custom-select-dropdown">
          {["", "NOT STARTED", "INTRANSIT", "COMPLETED"].map((p) => (
            <div
              key={p}
              className="option-item"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  progress: p
                }));
                setOpenProgressSelect(false);
              }}
            >
              {p === "" ? "All Progress" : p}
            </div>
          ))}
        </div>
      )}
    </div>
    </>)}
{activeTab === "logs" && (
            <div className="filter-item">
              <div className="custom-select-drop" onClick={() => setOpenUserSelect(!openUserSelect)}>
                <div className="select-box">
                  <span>
                    {filters.user_uuid 
                      ? systemUsers.find(u => u.user_uuid === filters.user_uuid)?.firstname + " " + systemUsers.find(u => u.user_uuid === filters.user_uuid)?.lastname
                      : "All Personnel"}
                  </span>
                </div>
                <ChevronDown className={openUserSelect ? "up" : "down"} />
              </div>

              {openUserSelect && (
                <div className="custom-select-dropdown">
                  <div className="option-item" onClick={() => { setFilters(prev => ({...prev, user_uuid: ""})); setOpenUserSelect(false); }}>
                    All Personnel
                  </div>
                  {systemUsers.map((user) => (
                    <div
                      key={user.user_uuid}
                      className="option-item"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, user_uuid: user.user_uuid }));
                        setOpenUserSelect(false);
                      }}
                    >
                      {user.firstname} {user.lastname}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
{/* {activeTab !== "logs" && ( */}
  <>
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
    </>
{/* )} */}
  </div>
)}
                <div className="log-tab-section">
                <div className="tab-content">
                  <ul>
                    <li  className={activeTab === "table" ? "active" : ""}
                      onClick={() => setActiveTab("table")}> Trip Table
                    </li>
                    <li className={activeTab === "logs" ? "active" : ""}
                      onClick={() => setActiveTab("logs")} >Activity Log
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="main-content">
            {view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Trip Created Yet</p>
                  <span>A trip created would be saved here automatically</span>
                </div>
              </div>
            )}

{(view === "table" || view === "empty") && activeTab === "table" && (
        <TripTable
         data={trip}
              loading={loading}
                page={page}
                setPage={setPage}
                pagination={pagination} 
                  onRowClick={(trip) => { setSelectedTrip(trip);navigate("Trip Details", "details", { trip });setView("details");}}/>
      )}

            {(view === "table" || view === "empty") && activeTab === "logs" && (
              <TripLogs filters={filters} search={search} />
            )}
  {view === "create" && (
        <CreateTrip
         data={trip}
                setLoading={setLoading}
                setData={setTrip}
                setView={setView}
                onSuccess={() => feacthTrip(page)}
        />
      )}

{view === "details" && selectedTrip && (
 <TripDetails
  trip={selectedTrip}
  navigate={navigate}
  breadcrumb={breadcrumb}
  goBackTo={goBackTo}
  goBack={() => {
    feacthTrip(page);
    setView("table");
  }}
/>
)}




          </div>

        </div>
      </div>
    </div>
  );
};

export default TripController;
