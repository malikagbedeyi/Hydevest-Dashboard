import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";
import CreateAllocation from "./CreateAllocation";
import AllocationTable from "./AllocationTable";
import DrillDownAllocation from "./DrillDownAllocation";


const STORAGE_KEY = "allocation_data"; 


const AllocationController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  const PROFIT_KEY = "profit_storage";
    const TRIP_KEY = "trip_data";
    const [selectedAllocation, setSelectedAllocation] = useState(null);

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
  
  const handleRowClick = (row) => {
    setSelectedAllocation(row);
    setView("drilldown");
  };
  const saveToStorage = (updated) => {
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };
  
  
  const handleAddData = (newAllocation) => {
    const updated = [...data, newAllocation];
    saveToStorage(updated);

  
    setView("table");
  };
  
  
  const handleDeleteData = (id) => {
    const updated = data.filter(d => d.id !== id);
    saveToStorage(updated);
    setView(updated.length ? "table" : "empty");
  };
  
  const handleUpdateAllocation = (updatedAllocation) => {
    const updated = data.map(a =>
      a.id === updatedAllocation.id ? updatedAllocation : a
    );
  
    saveToStorage(updated);
    setView("table");
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
                  <div className="right-wrapper-input">
                    <Search className="input-icon" />
                    <input type="text" placeholder="Search" 
                    value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
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
             onRowClick={handleRowClick}
             onDelete={handleDeleteData}
           />
            )}
          {view === "drilldown" && selectedAllocation && (
  <DrillDownAllocation
    allocation={selectedAllocation}
    containers={containers}
    onBack={() => setView("table")}
    onUpdate={handleUpdateAllocation}
  />
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
