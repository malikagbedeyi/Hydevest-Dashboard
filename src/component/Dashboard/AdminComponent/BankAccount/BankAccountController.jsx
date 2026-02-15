import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/account/emptyAccount.scss";
import CreateBankAccount from "./CreateBankAccount";
import BankAccountTable from "./BankAccountTable";

const BANKACCOUNT_KEY = "bankAccount_data";

const BankAccountController = ({ openSubmenu ,autoOpenCreate, setAutoOpenCreate }) => {
  const [view, setView] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(BANKACCOUNT_KEY)) || [];
    return saved.length ? "table" : "empty";
  });
  
  const [data, setData] = useState(() => {
    return JSON.parse(localStorage.getItem(BANKACCOUNT_KEY)) || [];
  });
  useEffect(() => {
    localStorage.setItem(BANKACCOUNT_KEY, JSON.stringify(data));
  
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
                    Create Bank Account
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
                  <p>No Data Created Yet</p>
                  <span>A Data created would be saved here automatically</span>
                </div>
              </div>
            )}

            {/* Table */}
            {data.length > 0 && (view === "table" || view === "empty") && (
              <BankAccountTable  data={data} />
            )}

            {/* Create User Form */}
            {view === "create" && (
              <CreateBankAccount
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

export default BankAccountController;
