import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import CreateTrip from "./CreateTrip";
import TripTable from "./TripTable"; 
import "../../../../assets/Styles/dashboard/controller.scss";
import TripDetails from "./TripDetails";
import { TripServices } from "../../../../services/Trip/trip";
import TripLogs from "./TripLogs";

const STORAGE_KEY = "trip_data";

const TripController = () => {
  // Load trips from storage
  const [view, setView] = useState("table");
   const [trip, setTrip] = useState([])
    const [search , setSearch ] = useState('')
    const [page,setPage] = useState(1)
    const [pagination,setPagination] = useState({})
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(false);
 const [activeTab, setActiveTab] = useState("table");

  /* ================= FETCH TRIPS ================= */
  const feacthTrip = async(pageNum = page) => {

   try {
    setLoading(true);
       const res = await TripServices.list({
      title: search,
      location:search,
      // search_fullname:search,
      // date_created:search,
      page : pageNum,
    });
    
    setTrip(res.data?.record.data || [])
    setPagination(res.data?.record || [])
   } catch(err) {
     console.error(err);
   }finally {
    setLoading(false);
   }
  }
useEffect(() => {
  feacthTrip(page)
},[page])

useEffect(() => {
  const timer = setTimeout(() => {
    setPage(1);
    feacthTrip(1);
  }, 400);

  return () => clearTimeout(timer);
}, [search]);
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
                   <input  placeholder="Search" value={search}
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
                  onRowClick={(trip) => {
                  setSelectedTrip(trip);
                  setView("details");
                }}/>
      )}

            {(view === "table" || view === "empty") && activeTab === "logs" && (
              <TripLogs />
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
