import React, { useEffect, useState } from "react";
import "../../../assets/Styles/dashboard/account/emptyAccount.scss";
import { ChevronDown, Filter, Search,User, Users, Truck, CreditCard, Shield ,Building2,Banknote, Container } from "lucide-react";
import ContainerSaleReport from "./ContainerSale/ContainerSaleReport";


const reportTypes = [
  { icon: Container, label: "Container Sales", submenu: "container-sale" },
  { icon: Users, label: "Partner", submenu: "report-partner" },
  { icon: Banknote, label: "Hynvest", submenu: "report-invest" },
  
];
const ReportController = ({openSubmenu}) => {
  const [view, setView] = useState("empty"); 
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);

  const handleReportClick = (submenu) => {
    setActiveReport(submenu);
  };

  const resetReportView = () => {
    setActiveReport(null);
  };
  
  return (
    <div className="emptyAccount">
      <div className="emptyAccount-container">
        <div className="emptyAccount-content">

          {/* TOP BAR */}
          {!activeReport && (
            <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper" />
                <div className="right-wrapper">
                  {/* <button onClick={() => setView("create")}>
                    Create Report
                  </button> */}
                </div>
              </div>
              <div className="top-content-account">
                <div className="top-content-account-wrappper">
                    {reportTypes.map(({ icon: Icon, label, submenu }) => (
                      <div
                        key={label}
                        className="account-grid"
                        onClick={() => handleReportClick(submenu)} // entire box clickable
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
  {activeReport === "container-sale" &&
   <ContainerSaleReport goBack={resetReportView}  />}
  {activeReport === "report-partner" && <div>Partner Report</div>}
  {activeReport === "report-invest" && <div>Hynvest Report</div>}
</div>

        </div>
      </div>
    </div>
  );
};

export default ReportController
