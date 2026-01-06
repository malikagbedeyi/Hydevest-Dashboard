import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";
import CreateAllocation from "./CreateAllocation";
import AllocationTable from "./AllocationTable";


const STORAGE_KEY = "allocation_data"; 

const AllocationController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
    const TRIP_KEY = "trip_data";
  const [data, setData] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  });
  const [view, setView] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return savedData.length ? "table" : "empty";
  });
  useEffect(() => {
    if (data.length === 0) {
      setView("empty");
    } else if (view === "empty") {
      setView("table");
    }
  }, [data]);
  // Auto-open create modal if requested
  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate, setAutoOpenCreate]);

  const handleAddData = (newData) => {
    const updatedData = [...data, newData];
    setData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    setView("table");
  };
  
  const handleDeleteData = (id) => {
    const updatedData = data.filter(d => d.id !== id);
    setData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    // Update view if no data left
    if (updatedData.length === 0) {
      setView("empty");
    }
  };
  const handleUpdateRecovery = (updatedRecovery) => {
    const updatedData = data.map((rec) =>
      rec.id === updatedRecovery.id ? updatedRecovery : rec
    );
  
    setData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [trips, setTrips] = useState(() => {
    return JSON.parse(localStorage.getItem(TRIP_KEY)) || [];
  });
  const [containers, setContainers] = useState(() => {
    let allContainers = [];
    trips.forEach((trip) => {
      const tripContainers =
        JSON.parse(localStorage.getItem(`trip-${trip.id}-container`)) || [];
      tripContainers.forEach((c) => (c.modelName = trip.title || "Unknown"));
      allContainers = [...allContainers, ...tripContainers];
    });
    return allContainers;
  });
  useEffect(() => {
    let allContainers = [];
    trips.forEach((trip) => {
      const tripContainers =
        JSON.parse(localStorage.getItem(`trip-${trip.id}-container`)) || [];
      tripContainers.forEach((c) => (c.modelName = trip.title || "Unknown"));
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

                  <div className="import-input"><p>Import</p></div>
                  <div className="import-input"><p>Export</p></div>
                  <button onClick={() => setView("create")}>Create Allocation</button>
                </div>
              </div>
            </div>
          )}
          <div className="main-content">
            {data.length === 0 && view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Data Created Yet</p>
                  <span>A data created would be saved here automatically</span>
                </div>
              </div>
            )}

            {data.length > 0 && view === "table" && (
              <AllocationTable
               data={data} 
              onDelete={handleDeleteData}
              onUpdate={handleUpdateRecovery} />
            )}

            {view === "create" && (
              <CreateAllocation
                containersData={filteredContainers}
                data={data}
                setData={setData}
                setView={setView}
                openSubmenu={openSubmenu}
                onCreate={handleAddData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationController
