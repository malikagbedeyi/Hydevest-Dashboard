import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "../../../assets/Styles/dashboard/account/emptyAccount.scss";
import { Tag, Users, CreditCard, BarChart2 } from "lucide-react";
import ContainerSaleReport from "./ContainerSale/ContainerSaleReport";

const reportTypes = [
  { icon: Tag, label: "Container Sales", submenu: "container-sale" },
  { icon: Users, label: "Partner", submenu: "report-partner" },
  { icon: CreditCard, label: "Purchase", submenu: "report-purchase" },
  { icon: BarChart2, label: "Expensify", submenu: "report-expensify" },
];

const ReportController = () => {
  const [activeReport, setActiveReport] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const { autoOpenCreate, setAutoOpenCreate } = useOutletContext();

  useEffect(() => {
    if (autoOpenCreate === "container-sale") {
      setActiveReport("container-sale");
      setAutoOpenCreate(false);
    }

    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [autoOpenCreate, setAutoOpenCreate]);

  const handleReportClick = (submenu) => {
    setActiveReport(submenu);
  };

  const resetReportView = () => {
    setActiveReport(null);
  };

  return (
    <div className={`emptyAccount ${isTransitioning ? 'page-loading' : 'page-ready'}`}>
      <div className="emptyAccount-container">
        <div className="emptyAccount-content">
          {!activeReport && (
            <div className="top-content fade-in">
              <div className="top-content-account">
                <div className="top-content-account-wrappper" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
                  {reportTypes.map(({ icon: Icon, label, submenu }) => (
                    <div
                      key={label}
                      className="account-grid"
                      onClick={() => handleReportClick(submenu)}
                      style={{ cursor: "pointer" }}
                    >
                      <Icon />
                      <span style={{ fontSize: "1.5vw" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="main-content slide-up">
            {activeReport === "container-sale" && <ContainerSaleReport goBack={resetReportView} />}
            {activeReport === "report-partner" && <div>Partner Report</div>}
            {activeReport === "report-purchase" && <div>Purchase Report</div>}
            {activeReport === "report-expensify" && <div>Expensify Report</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportController;