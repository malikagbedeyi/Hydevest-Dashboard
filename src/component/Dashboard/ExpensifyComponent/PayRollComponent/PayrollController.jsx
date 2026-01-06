import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/Expensify/controller.scss";
import CreatePayroll from "./CreatePayroll";
import PayrollTable from "./PayrollTable";

const STORAGE_KEY = "data_storage"; 
const SALE_KEY = "sales_data";

const PayrollController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  const [payrolldrop,setPayrolldrop] = useState(false)
  // Initialize data from localStorage
  const [data, setData] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  });
  // Set view based on existing data
  const [view, setView] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return savedData.length ? "table" : "empty";
  });

  const [sales, setsales] = useState([]);

  // Load presales and add serial number (S/N)
  useEffect(() => {
    const savedsales = JSON.parse(localStorage.getItem(SALE_KEY)) || [];
    const salesWithSN = savedsales.map((p, index) => ({ ...p, sn: index + 1 }));
    setsales(salesWithSN);
  }, []);

  // Keep view in sync with data
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

  // Add a new data entry
  const handleAddData = (newData) => {
    const updatedData = [...data, newData];
    setData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData)); // save immediately
    setView("table");
  };

  // Delete a data entry
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

                  <button onClick={() => setView("create")} >Generate Payroll</button>
                </div>
              </div>
            </div>
          )}
          <div className="main-content">
            {data.length === 0 && view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Data Created Yet</p>
                  <span>A data entry created would be saved here automatically</span>
                </div>
              </div>
            )}

            {data.length > 0 && view === "table" && (
              <PayrollTable data={data} 
              onDelete={handleDeleteData}
              onUpdate={handleUpdateRecovery} />
            )}

            {view === "create" && (
              <CreatePayroll
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

export default PayrollController
