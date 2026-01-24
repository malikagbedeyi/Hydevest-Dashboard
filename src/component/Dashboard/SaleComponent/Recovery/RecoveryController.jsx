import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/Sale/presaleController.scss";
import CreateRecovery from "./CreateRecovery";
import RecoveryTable from "./RecoveryTable";

const STORAGE_KEY = "data_storage"; // recoveries
const SALE_KEY = "sales_data"; // sales

const RecoveryController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  const [sales, setSales] = useState([]);

  const [view, setView] = useState(data.length ? "table" : "empty");

  // Load sales for dropdowns
  useEffect(() => {
    const savedSales = JSON.parse(localStorage.getItem(SALE_KEY)) || [];
    setSales(savedSales.map((p, index) => ({ ...p, sn: index + 1 })));
  }, []);

  // Sync view with data
  useEffect(() => {
    if (data.length === 0) setView("empty");
    else if (view === "empty") setView("table");
  }, [data]);

  // Auto-open create modal
  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate, setAutoOpenCreate]);

  const handleAddData = (newRecovery) => {
    const updatedData = [...data, newRecovery];
    setData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    // Update sale balance
    const updatedSales = sales.map((sale) => {
      if (sale.id === newRecovery.saleId) {
        const updatedPaid = Number(sale.amountPaid || 0) + Number(newRecovery.amountPaid);
        return {
          ...sale,
          amountPaid: updatedPaid,
          balance: Math.max(Number(sale.totalSaleAmount || 0) - updatedPaid, 0),
        };
      }
      return sale;
    });

    setSales(updatedSales);
    localStorage.setItem(SALE_KEY, JSON.stringify(updatedSales));
    setView("table");
  };

  const handleDeleteData = (id) => {
    const updatedData = data.filter((d) => d.id !== id);
    setData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    if (updatedData.length === 0) setView("empty");
  };

  const handleUpdateRecovery = (updatedRecovery) => {
    const updatedData = data.map((rec) =>
      rec.id === updatedRecovery.id ? updatedRecovery : rec
    );
    setData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  };
  const enrichedRecoveries = data.map((rec) => {
    const sale = sales.find((s) => s.id === rec.saleId);
  
    return {
      ...rec,
      saleSN: sale?.sn || sale?.id || "—",
    };
  });
  

  return (
    <div className="emptysale">
      <div className="emptysale-container">
        <div className="emptysale-content">
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

                  <button onClick={() => setView("create")}>Create Record</button>
                </div>
              </div>
            </div>
          )}

          <div className="main-content">
            {data.length === 0 && view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Recoveries Yet</p>
                  <span>A recovery record will appear here automatically after a sale payment.</span>
                </div>
              </div>
            )}

            {data.length > 0 && view === "table" && (
              <RecoveryTable
              data={enrichedRecoveries}
              onDelete={handleDeleteData}
              onUpdate={handleUpdateRecovery}
            />            
            )}

            {view === "create" && (
              <CreateRecovery
                SalesData={sales}
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

export default RecoveryController;
