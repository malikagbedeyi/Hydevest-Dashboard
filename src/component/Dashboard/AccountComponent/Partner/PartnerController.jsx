import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import CreatePartner from "./CreatePartner";
import PartnerTable from "./PartnerTable";
import "../../../../assets/Styles/dashboard/account/emptyAccount.scss";

const PARTNER_KEY = "partner_data";

const PartnerController = ({ openSubmenu ,autoOpenCreate, setAutoOpenCreate }) => {
  const [view, setView] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(PARTNER_KEY)) || [];
    return saved.length ? "table" : "empty";
  });
  
  const [data, setData] = useState(() => {
    return JSON.parse(localStorage.getItem(PARTNER_KEY)) || [];
  });
  useEffect(() => {
    localStorage.setItem(PARTNER_KEY, JSON.stringify(data));
  
    if (data.length === 0) {
      setView("empty");
    } else if (view === "empty") {
      setView("table");
    }
  }, [data]);
  

  useEffect(() => {
  if (autoOpenCreate) {
    setView("create");
    setAutoOpenCreate(false); 
  }
}, [autoOpenCreate]);

  return (
    <div className="emptyAccount">
      <div className="emptyAccount-container">
        <div className="emptyAccount-content">
          {/* TOP BAR */}
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

                  <div onClick={() => setView("export")} className="import-input">
                    <p>Export</p>
                  </div>

                  <button onClick={() => setView("create")}>
                    Create Partner
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          <div className="main-content">
            {/* Empty State */}
            {data.length === 0 && view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Partner Created Yet</p>
                  <span>A Partner created would be saved here automatically</span>
                </div>
              </div>
            )}

            {/* Table */}
            {data.length > 0 && (view === "table" || view === "empty") && (
              <PartnerTable  data={data} />
            )}

            {/* Create User Form */}
            {view === "create" && (
              <CreatePartner
                data={data}
                setData={setData}
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

export default PartnerController;
