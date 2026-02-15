import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
// import "../../../../assets/Styles/dashboard/Sale/presaleController.scss";
import ExpensifyTable from "./ExpensifyTable";
import CreateExpensify from "./CreateExpensify";

const STORAGE_KEY = "sales_data";
const PRESALE_KEY = "presales_data";

const ExpensifyController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  const [sales, setSales] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  });

  // Set view based on existing sales
  const [view, setView] = useState(() => {
    const savedSales = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return savedSales.length ? "table" : "empty";
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

  // Add a new sale
  const handleAddSale = (newSale) => {
    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSales)); // save immediately
    setView("table");
  };
const handleDeleteSale = (id) => {
  const updatedSales = sales.filter(s => s.id !== id);
  setSales(updatedSales);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSales));
};

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
            <ExpensifyTable sales={sales}
            onDelete={handleDeleteSale} />
              }

            {view === "create" && (
              <CreateExpensify
                // preSales={presales}
                // sales={sales}
                // setSales={setSales}
                // setView={setView}
                // openSubmenu={openSubmenu}
                // onCreate={handleAddSale}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensifyController
