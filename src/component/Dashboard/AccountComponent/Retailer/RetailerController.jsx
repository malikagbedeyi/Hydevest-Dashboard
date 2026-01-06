import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import CreateRetailer from "./CreateRetailer";
import RetailerTable from "./RetailerTable";
import "../../../../assets/Styles/dashboard/account/emptyAccount.scss";

const RetailerController = ({ openSubmenu ,autoOpenCreate, setAutoOpenCreate }) => {
  const [view, setView] = useState("empty");
  const [users, setUsers] = useState([]);

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
                    Create Customer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          <div className="main-content">
            {/* Empty State */}
            {users.length === 0 && view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Partner Created Yet</p>
                  <span>A Partner created would be saved here automatically</span>
                </div>
              </div>
            )}

            {/* Table */}
            {users.length > 0 && (view === "table" || view === "empty") && (
              <RetailerTable users={users} />
            )}

            {/* Create User Form */}
            {view === "create" && (
              <CreateRetailer
                users={users}
                setUsers={setUsers}
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

export default RetailerController;
