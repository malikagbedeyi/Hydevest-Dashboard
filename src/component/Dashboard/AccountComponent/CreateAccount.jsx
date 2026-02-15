import React, { useState } from "react";
import "../../../assets/Styles/dashboard/account/createAccount.scss";
import { X, ChevronDown } from "lucide-react";
import {SystemUserType,Partner,Retailer,Supplier,ClearingAgent,BdcOperator,Invest,} from "./CreateAccountType";


const accountTypes = [
  { id: "type-user", submenu: "/dashboard/accounts/system-user", label: "System User" },
  { id: "type-partner", submenu: "/dashboard/accounts/partner", label: "Partner" },
  { id: "type-invest", submenu: "/dashboard/accounts/invest", label: "Investor" },
  { id: "type-retailer", submenu: "/dashboard/accounts/retailer", label: "Customer" },
  { id: "type-supplier", submenu: "/dashboard/accounts/supplier", label: "Supplier" },
  { id: "type-clearing-agent", submenu: "/dashboard/accounts/clearing-agent", label: "Clearing Agent" },
  { id: "type-bdc-operator", submenu: "/dashboard/accounts/bdc-operator", label: "Bdc Operator" },
];


const CreateAccount = ({view,accounts = [], setAccounts,onCreateClick,onClose,onExport,openSubmenu}) => {

  const [activeTab, setActiveTab] = useState(null);
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null); // NEW STATE

  const handleSelect = (option) => {
    setActiveTab(option.id);
    setOpen(false);
  };

  const handleCreate = (formData) => {
    if (!setAccounts) return;

    const newAccount = {
      ...formData,
      type: activeTab,
      createdAt: new Date().toISOString(),
    };

    setAccounts((prev) => [newAccount, ...prev]);

    // Show popup instead of immediately closing
    const accountLabel = accountTypes.find(a => a.id === activeTab)?.label || "Account";
    setSuccessMessage(`${accountLabel} Successfully Created`);
  };

  const handleClosePopup = () => {
    if (openSubmenu && activeTab) {
      const submenu = accountTypes.find(a => a.id === activeTab)?.submenu;
      openSubmenu("accounts", submenu);
    }
    setSuccessMessage(null);
    onClose(); // <-- use the passed prop to tell parent to go back to table/empty
  };
  
  const renderTab = () => {
    const props = { onCreate: handleCreate, onCancel: onClose, openSubmenu };
    switch (activeTab) {
      case "type-user":
        return <SystemUserType {...props} />;
      case "type-partner":
        return <Partner {...props} />;
        case "type-invest":
        return <Invest {...props} />;
      case "type-retailer":
        return <Retailer {...props} />;
      case "type-supplier":
        return <Supplier {...props} />;
      case "type-clearing-agent":
        return <ClearingAgent {...props} />;
      case "type-bdc-operator":
        return <BdcOperator {...props} />;
      default:
        return <h4></h4>;
    }
  };

  const currentLabel =
    accountTypes.find((item) => item.id === activeTab)?.label ||
    "Select Account Type";

 
  // ================= SUCCESS POPUP
  if (successMessage) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={handleClosePopup} className="delete-box">
              ✕
            </div>
            <div className="popup-proceeed-wrapper">
              <span>{successMessage}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= FORM VIEW
  return (
    <div className="trip-modal">
      <div className="create-container-modal">
        <div className="create-container-card">
          <div className="header">
            <h2>Create Account</h2>
            <X size={18} className="close" onClick={onClose} />
          </div>

          <div className="account-type">
            <div className="account-wrapper">
              <div className="custom-dropdown">
                <h5>
                  {activeTab ? "Account Type" : "Please Select Account Type"}
                </h5>

                <div className="dropdown-header" onClick={() => setOpen(!open)}>
                  <span>{currentLabel}</span>
                  <ChevronDown size={18} className={`arrow ${open ? "rotate" : ""}`} />
                </div>

                {open && (
                  <div className="dropdown-options">
                    {accountTypes.map((item) => (
                      <div
                        key={item.id}
                        className={`dropdown-option ${activeTab === item.id ? "active" : ""}`}
                        onClick={() => handleSelect(item)}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="tab-content">{renderTab()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
