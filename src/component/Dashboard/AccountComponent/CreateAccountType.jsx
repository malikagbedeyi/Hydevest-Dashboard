import React, { useState } from "react";
import CreateUser from "./User/CreateUser";
import CreatePartner from "./Partner/CreatePartner";
import CreateRetailer from "./Retailer/CreateRetailer";
import CreateSupplier from "./Supplier/CreateSupplier";
import CreateAgent from "./Agent/CreateAgent";
import CreateOperator from "./Operator/CreateOperator";
import CreateInvest from "./Invest/CreateInvest";

/* ================= SYSTEM USER ================= */
export const SystemUserType = ({ onCreate,openSubmenu ,setView }) => {
  return (
    <div className="tab-section">
      <CreateUser  openSubmenu={openSubmenu} mode="account" setView={setView} />
    </div>
  );
};

/* ================= PARTNER ================= */
export const Partner = ({ onCreate,openSubmenu,setView }) => {
 
  return (
    <div className="tab-section">
  <CreatePartner  openSubmenu={openSubmenu} setView={setView}  mode="account"/>
    </div>
  );
};
/* ================= Invest ================= */
export const Invest = ({ onCreate,openSubmenu }) => {
 
  return (
    <div className="tab-section">
      <CreateInvest  openSubmenu={openSubmenu}    mode="account" />
    </div>
  );
};
/* ================= RETAILER ================= */
export const Retailer = ({ onCreate,openSubmenu }) => {
 
  return (
    <div className="tab-section">
      <CreateRetailer  openSubmenu={openSubmenu}    mode="account" />
    </div>
  );
};

/* ================= SUPPLIER ================= */
export const Supplier = ({ onCreate,openSubmenu }) => {

  return (
    <div className="tab-section">

    <CreateSupplier  openSubmenu={openSubmenu}    mode="account" />
    </div>
  );
};
/* ================= CLEARING AGENT ================= */
export const ClearingAgent = ({ onCreate,openSubmenu }) => {

  return (
    <div className="tab-section">
    <CreateAgent  openSubmenu={openSubmenu}    mode="account" />
    </div>
  );
};



/* ================= BDC OPERATOR ================= */
export const BdcOperator = ({ onCreate,openSubmenu }) => {

  return (
    <div className="tab-section">
      <CreateOperator  openSubmenu={openSubmenu}    mode="account" />
    </div>
  );
};

