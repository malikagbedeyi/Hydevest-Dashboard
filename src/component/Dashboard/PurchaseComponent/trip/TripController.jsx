import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import CreateTrip from "./CreateTrip";
import TripTable from "./TripTable"; 
import "../../../../assets/Styles/dashboard/Purchase/trip.scss";
import TripDetails from "./TripDetails";

const STORAGE_KEY = "trip_data";

const TripController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  // Load trips from storage
  const [data, setData] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  });

  // View controller
  const [view, setView] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return saved.length ? "table" : "empty";
  });
  const [selectedTrip, setSelectedTrip] = useState(null);
  

  /* ===================== EFFECTS ===================== */

  // Keep view in sync with data
  useEffect(() => {
    if (data.length === 0) setView("empty");
    else if (view === "empty") setView("table");
  }, [data]);

  // Auto open create
  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate, setAutoOpenCreate]);

  const totalTrip = data.length;
  /* ===================== ACTIONS ===================== */

  const handleAddTrip = (newTrip) => {
    const updated = [...data, newTrip];
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setView("table");
  };

  const handleDeleteTrip = (id) => {
    const updated = data.filter((t) => t.id !== id);
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleUpdateTrip = (updatedTrip) => {
    const updated = data.map((t) =>
      t.id === updatedTrip.id ? updatedTrip : t
    );
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  /* ===================== UI ===================== */

  return (
    <div className="emptyTrip">
      <div className="emptyTrip-container">
        <div className="emptyTrip-content">

          {(view === "empty" || view === "table") && (
            <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper" />

                <div className="right-wrapper">
                  <div className="right-wrapper-input">
                    <Search className="input-icon" />
                    <input type="text" placeholder="Search" />
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

{view === "table" && (
  <TripTable
    data={data}
    onDelete={handleDeleteTrip}
    onRowClick={(trip) => {
      setSelectedTrip(trip);
      setView("details");
    }}
  />
)}
{view === "details" && selectedTrip && (
  <TripDetails
    trip={selectedTrip}
    goBack={() => {
      setSelectedTrip(null);
      setView("table");
    }}
  />
)}

            {view === "create" && (
              <CreateTrip
                onCreate={handleAddTrip}
                setView={setView}
                openSubmenu={openSubmenu}
              />
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default TripController;
