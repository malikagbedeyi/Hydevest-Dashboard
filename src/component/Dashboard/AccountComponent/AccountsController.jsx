import React, { useEffect, useState } from "react";
import "../../../assets/Styles/dashboard/account/emptyAccount.scss";
import { ChevronDown, Filter, Search,User, Users, Briefcase, Truck, CreditCard, Shield ,Building2,Banknote } from "lucide-react";

import CreateAccount from "./CreateAccount"

import { useOutletContext } from "react-router-dom";

const AccountsController = ({ autoOpenView, setAutoOpenView, openSubmenu }) => {
  const [view, setView] = useState("empty");
  
  const handleAccountClick = (submenu) => {
    if (!openSubmenu) return;
    openSubmenu("/dashboard/accounts", `/dashboard/accounts/${submenu}`);
    setAutoOpenView("create"); // now guaranteed to exist
  }

  useEffect(() => {
    if (autoOpenView === "create") {
      setView("create");
      setAutoOpenView(null); // reset
    }
  }, [autoOpenView, setAutoOpenView]);
  const [accounts, setAccounts] = useState([]);

  const accountTypes = [
    { icon: User, label: "System User", submenu: "system-user" },
    { icon: Users, label: "Partner", submenu: "partner" },
    { icon: User, label: "Hynvest", submenu: "invest" },
    { icon: Briefcase, label: "Customer", submenu: "retailer" },
    { icon: Truck, label: "Supplier", submenu: "supplier" },
    { icon: Shield, label: "Clearing Agent", submenu: "clearing-agent" },
    { icon: CreditCard, label: "BDC Operator", submenu: "bdc-operator" },
  ];


  
  return (
    <div className="emptyAccount">
      <div className="emptyAccount-container">
        <div className="emptyAccount-content">

          {/* TOP BAR */}
          {(view === "empty") && (
            <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper" />
                <div className="right-wrapper">
                  {/* <div onClick={() => setView("export")} className="import-input">
                    <p>Export</p>
                  </div> */}
                  <button onClick={() => setView("create")}>
                    Create Account
                  </button>
                </div>
              </div>
              <div className="top-content-account">
                <div className="top-content-account-wrappper">
                    {accountTypes.map(({ icon: Icon, label, submenu }) => (
                      <div
                        key={label}
                        className="account-grid"
                        onClick={() => handleAccountClick(submenu)} // entire box clickable
                        style={{ cursor: "pointer" }}
                      >
                        <Icon/>
                        <span>{label}</span>
                      </div>
                    ))}
                    </div>

              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          <div className="main-content">
            {/* {view === "empty" && accounts.length === 0 && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Account Created Yet</p>
                  <span>
                    An account created would be saved here automatically
                  </span>
                </div>
              </div>
            )} */}
            {view === "table" && (
              <CreateAccount
                view="table"
                accounts={accounts}
                onCreateClick={() => setView("create")}
                onExport={() => setView("export")}
              />
            )}
           {view === "create" && (
              <CreateAccount
                view="create"
                accounts={accounts}
                setAccounts={setAccounts}
                openSubmenu={openSubmenu} 
                onClose={() => setView("empty")}
              />
            )}

           {view === "success" && (
              <CreateAccount
               view="success"
               onClose={() => setView("table")}
             />
        )}
            {/* {view === "export" && (
              <ExportAccount onCancel={() => setView("table")} />
            )} */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsController;
