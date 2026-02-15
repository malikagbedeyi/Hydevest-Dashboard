import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";
import CreatePreSale from "./CreatePreSale";
import PreSaleTable from "./PreSaleTable";

const STORAGE_KEY = "presales_data";

const PreSaleController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  const TRIP_KEY = "trip_data";
  const [trips, setTrips] = useState(() => {
    return JSON.parse(localStorage.getItem(TRIP_KEY)) || [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [containers, setContainers] = useState(() => {
    let allContainers = [];
    trips.forEach((trip) => {
      const tripContainers =
        JSON.parse(localStorage.getItem(`trip-${trip.id}-container`)) || [];
  
      // Get the FX rate for this trip
      const avgRate = Number(
        localStorage.getItem(`trip-${trip.id}-avg_container_rate`) || 0
      );
  
      tripContainers.forEach((c) => {
        c.modelName = trip.title || "Unknown";
        c.avgRate = avgRate; // attach the correct FX rate per container
      });
  
      allContainers = [...allContainers, ...tripContainers];
    });
    return allContainers;
  });
  
  useEffect(() => {
    let allContainers = [];
    trips.forEach((trip) => {
      const tripContainers =
        JSON.parse(localStorage.getItem(`trip-${trip.id}-container`)) || [];
const avgRate =
  Number(localStorage.getItem(`trip-${trip.id}-avg_container_rate`)) || 0;

tripContainers.forEach((c) => {
  c.modelName = trip.title || "Unknown";
  c.avgRate = avgRate; // 🔑 attach FX rate
});

      allContainers = [...allContainers, ...tripContainers];
    });
    setContainers(allContainers);
    setView(allContainers.length ? "table" : "empty");
  }, [trips]);
  
  const filteredContainers = containers.filter((c) => {
    const title = c.title ?? "";
    const modelName = c.modelName ?? "";
  
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modelName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const [datas, setdatas] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [view, setView] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) && parsed.length > 0 ? "table" : "empty";
    } catch {
      return "empty";
    }
  });

  const [hydrated, setHydrated] = useState(false);

  /* ---------------------------------
     HYDRATION GUARD
  ---------------------------------- */
  useEffect(() => {
    setHydrated(true);
  }, []);

  /* ---------------------------------
     PERSIST TO LOCAL STORAGE
  ---------------------------------- */
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datas));
  }, [datas, hydrated]);

  /* ---------------------------------
     AUTO OPEN CREATE (DASHBOARD)
  ---------------------------------- */
  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate, setAutoOpenCreate]);

const handleDeletePreSale = (createdAt) => {
  setdatas(prev => prev.filter(item => item.createdAt !== createdAt));
};

  return (
    <div className="controller">
      <div className="controller-container">
        <div className="controller-content">

          {/* TOP BAR */}
          {(view === "empty" || view === "table") && (
            <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper" />

                <div className="right-wrapper">
                <div className="right-wrapper-input">
                    <Search className="input-icon" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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

                  <div className="import-input">
                    <p>Export</p>
                  </div>

                  <button onClick={() => setView("create")}>
                    Create Pre-Sale
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* MAIN CONTENT */}
          <div className="main-content">
            {/* EMPTY STATE */}
            {datas.length === 0 && view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Pre-sale Created Yet</p>
                  <span>A Pre-sale created would be saved here automatically</span>
                </div>
              </div>
            )}

            {/* TABLE */}
            {datas.length > 0 && (view === "table" || view === "empty") && (
              <PreSaleTable
               preSales={datas}
              onDelete={handleDeletePreSale}
              />

            )}

            {/* CREATE */}
            {view === "create" && (
             <CreatePreSale
             containersData={filteredContainers}
             users={datas}
             setUsers={setdatas}
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

export default PreSaleController;
