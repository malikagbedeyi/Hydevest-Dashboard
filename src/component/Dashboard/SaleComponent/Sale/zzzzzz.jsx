import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";
import CreateSale from "./CreateSale";
import SaleTable from "./SaleTable";
import DrilldownSale from "./DrildownSale";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "sales_data";
const PRESALE_KEY = "presales_data";

const SaleController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  const [selectedSale, setSelectedSale] = useState(null);
  const location = useLocation();
  // Initialize sales from localStorage
  const [sales, setSales] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  });
  const TRIP_KEY = "trip_data";
  const [trips, setTrips] = useState(() => {
    return JSON.parse(localStorage.getItem(TRIP_KEY)) || [];
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Set view based on existing sales
  const [view, setView] = useState(() => {
    const savedSales = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return savedSales.length ? "table" : "empty" ;
  });

  const [presales, setPresales] = useState([]);
  // Load presales and add serial number (S/N)
  useEffect(() => {
    const savedPresales = JSON.parse(localStorage.getItem(PRESALE_KEY)) || [];
    const presalesWithSN = savedPresales.map((p, index) => ({ ...p, sn: index + 1 }));
    setPresales(presalesWithSN);
  }, []);

  // Persist sales whenever it updates
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  }, [sales]);

  // Auto-open create modal if requested
  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate, setAutoOpenCreate]);
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
  useEffect(() => {
    setSales(prev =>
      prev.map(sale => ({
        ...sale,
        totalSaleAmount: Number(sale.totalSaleAmount) || 0,
        noOfPallets: Number(sale.noOfPallets) || 0,
        purchasePricePerPiece: Number(sale.purchasePricePerPiece) || 0,
      }))
    );
  }, []);


  const filteredContainers = containers.filter((c) => {
    const title = c.title ?? "";
    const modelName = c.modelName ?? "";
  
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modelName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const migrateSalesTrackingNumbers = (sales, containers) => {
    let changed = false;
  
    const containerMap = {};
    containers.forEach(c => {
      containerMap[c.id] = c.trackingNumber;
    });
  
    const updatedSales = sales.map(sale => {
      const updatedContainers = sale.containers.map(c => {
        if (!c.trackingNumber || c.trackingNumber === "TN-UNKNOWN") {
          const realTracking = containerMap[c.containerId];
          if (realTracking) {
            changed = true;
            return {
              ...c,
              trackingNumber: realTracking,
            };
          }
        }
        return c;
      });
  
      return {
        ...sale,
        containers: updatedContainers,
      };
    });
  
    return { updatedSales, changed };
  };
  const normalizedContainers = containers.map(c => ({
    ...c,
    name: c.name || c.title || "Unnamed Container",
    trackingNumber:c.trackingNumber ||  "TN-UNKNOWN",
  }));
  useEffect(() => {
    if (!sales.length || !normalizedContainers.length) return;
  
    const { updatedSales, changed } =
      migrateSalesTrackingNumbers(sales, normalizedContainers);
  
    if (changed) {
      setSales(updatedSales);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSales));
      console.log("✅ Old sales migrated with tracking numbers");
    }
  }, [normalizedContainers]);
  


  
  // Add a new sale

  const handleAddSale = (newSale) => {
    const saleId = newSale.id; // 🔥 single source of truth
  
    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSales));
    setView("table");
  
    if (Number(newSale.amountPaid) > 0) {
      const recoveryData =
        JSON.parse(localStorage.getItem("recovery_storage")) || [];
  
      const balanceAfter = Math.max(
        Number(newSale.totalSaleAmount || 0) - Number(newSale.amountPaid),
        0
      );
  
      const firstRecovery = {
        id: Date.now(),               // recovery id
        saleId: saleId,               // ✅ LINK TO SALE
        customerName: newSale.customer?.name || "Unknown",
        customerPhone: newSale.customer?.phone || "N/A",
        amountPaid: Number(newSale.amountPaid),
        balanceAfter,
        createdAt: new Date().toISOString(),
        status: balanceAfter === 0 ? "Approved" : "Pending",
        isInitial: true,
      };
  
      localStorage.setItem(
        "recovery_storage",
        JSON.stringify([...recoveryData, firstRecovery])
      );
    }
  };
  
  const handleDeleteSale = (saleId) => {
    // 1️⃣ Delete sale
    const updatedSales = sales.filter((s) => s.id !== saleId);
    setSales(updatedSales);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSales));
  
    // 2️⃣ Delete linked recoveries
    const recoveries =
      JSON.parse(localStorage.getItem("recovery_storage")) || [];
  
    const filteredRecoveries = recoveries.filter(
      (r) => r.saleId !== saleId
    );
  
    localStorage.setItem(
      "recovery_storage",
      JSON.stringify(filteredRecoveries)
    );
  };
  const handleRowClick = (sale) => {
    setSelectedSale(sale);
    setView("drilldown"); // 🔥 switch view to drilldown page
  };
  
  // const handleUpdate = (updatedSale) => {
  //   if (onUpdate) onUpdate(updatedSale);
  //   setSelectedSale(null);
  // };
  
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

                  <button onClick={() => setView("create")}>Record Sale</button>
                </div>
              </div>
            </div>
          )}

          <div className="main-content">
            {sales.length === 0 && view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No sale Created Yet</p>
                  <span>A sale created would be saved here automatically</span>
                </div>
              </div>
            )}

            {sales.length > 0 && view === "table" && 
            <SaleTable 
            sales={sales}
            onDelete={handleDeleteSale} 
            handleRowClick={handleRowClick} />
              }

            {view === "create" && (
             <CreateSale
             preSales={presales}
             sales={sales}
             containersData={normalizedContainers}
             setView={setView}
             openSubmenu={openSubmenu}
             onCreate={handleAddSale}
           />           
            )}
           {view === "drilldown" && selectedSale && (
  <DrilldownSale 
    data={selectedSale} 
    goBack={() => setView("table")} 
    onUpdate={(updatedSale) => {
      // Update the sales array
      setSales((prevSales) =>
        prevSales.map((s) => (s.id === updatedSale.id ? updatedSale : s))
      );
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

export default SaleController;
