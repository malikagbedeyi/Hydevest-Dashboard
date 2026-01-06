import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import ContainerTable from "./ContainerTable";
import "../../../../assets/Styles/dashboard/Purchase/container.scss";
import DrildownContainer from "./DrildownContainer";

const ContainerController = () => {
  const TRIP_KEY = "trip_data";
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

  const [view, setView] = useState(containers.length ? "table" : "empty");
  const [searchTerm, setSearchTerm] = useState("");
  const [showContainerDetails, setShowContainerDetails] = useState(false);
  const [selectedContainerDrill, setSelectedContainerDrill] = useState(null);

  // Keep containers in sync
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

  const handleDeleteContainer = (containerId) => {
    const tripContaining = trips.find((trip) => {
      const tripContainers =
        JSON.parse(localStorage.getItem(`trip-${trip.id}-container`)) || [];
      return tripContainers.some((c) => c.id === containerId);
    });

    if (tripContaining) {
      const tripContainers =
        JSON.parse(localStorage.getItem(`trip-${tripContaining.id}-container`)) || [];
      const updated = tripContainers.filter((c) => c.id !== containerId);
      localStorage.setItem(
        `trip-${tripContaining.id}-container`,
        JSON.stringify(updated)
      );

      setContainers(containers.filter((c) => c.id !== containerId));
    }
  };

  const filteredContainers = containers.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.modelName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [financeData, setFinanceData] = useState(() => {
    const storedTrips = JSON.parse(localStorage.getItem(TRIP_KEY)) || [];
    let allFinance = [];
  
    storedTrips.forEach((trip) => {
      const tripFinance =
        JSON.parse(localStorage.getItem(`trip-${trip.id}-finance`)) || [];
      allFinance = [...allFinance, ...tripFinance];
    });
  
    return allFinance;
  });
  
/* ================== EXPENSE CATEGORIES ================== */
const containerExpenses = financeData.filter(
    (item) => item.check === "Container Payment"
  );
  
  const generalExpenses = financeData.filter(
    (item) => item.check === "General"
  );
  
  const avgContainerRate =
    containerExpenses.length > 0
      ? containerExpenses.reduce(
          (sum, item) => sum + Number(item.rate || 0),
          0
        ) / containerExpenses.length
      : 0;
  
  const totalContainerExpenseAmount = containerExpenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );
  
  const totalGeneralExpenseNGN = generalExpenses.reduce(
    (sum, item) => sum + Number(item.amountNGN || 0),
    0
  );
  
  const totalContainers = containers.length;
  
  const totalAmountNGN =
    totalContainers > 0
      ? totalContainerExpenseAmount * avgContainerRate +
        totalGeneralExpenseNGN / totalContainers
      : totalContainerExpenseAmount * avgContainerRate;
  
  const totalAmountUSD = containers.reduce(
    (sum, item) => sum + Number(item.amountUsd || 0),
    0
  );
  
  const totalUnitPriceUSD = containers.reduce(
    (sum, item) => sum + Number(item.unitpieces || 0),
    0
  );
  


  // ✅ Drilldown handlers
 
  const handleRowClick = (container) => {
    console.log("Container clicked:", container); // debug
    setSelectedContainerDrill(container);
    setShowContainerDetails(true);
  };
  
  if (showContainerDetails) {
    return (
      <DrildownContainer
        container={selectedContainerDrill}
        goBack={() => setShowContainerDetails(false)}
        onUpdate={(updated) =>
          setContainers((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          )
        }
        avgContainerRate={avgContainerRate}
        totalAmountUSD={totalAmountUSD}
        totalAmountNGN={totalAmountNGN}
        totalContainers={totalContainers}
        totalUnitPriceUSD={totalUnitPriceUSD}
      />
    );
  }
  

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

                  <div className="import-input" onClick={() => setView("export")}>
                    <p>Export</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="main-content">
            {view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Containers Found</p>
                  <span>Containers from all trips will appear here automatically</span>
                </div>
              </div>
            )}

            {view === "table" && (
              <ContainerTable
                containers={filteredContainers}
                onDelete={handleDeleteContainer}
                onRowClick={handleRowClick} 
                avgContainerRate={avgContainerRate}
                totalAmountUSD={totalAmountUSD}
                totalAmountNGN={totalAmountNGN}
                totalContainers={totalContainers}
                totalUnitPriceUSD={totalUnitPriceUSD} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerController;
