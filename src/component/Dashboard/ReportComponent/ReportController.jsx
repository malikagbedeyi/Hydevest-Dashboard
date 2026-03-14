import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "../../../assets/Styles/dashboard/account/emptyAccount.scss";
import { Tag, Users, CreditCard, BarChart2, PackageCheck, Wallet, HandCoins, DollarSign, ArrowUpCircle } from "lucide-react";
import ContainerSaleReport from "./ContainerSale/ContainerSaleReport";
import PayableController from "./SupplierPayables/PayableController";
import DebtController from "./CustomerDebt/DebtController";
import ContainerProfitController from "./ContainerProfit/ContainerProfitController";

const reportTypes = [
  { icon: Tag, label: "Container Sales", submenu: "container-sale" },
  { icon: Wallet, label: "Supp. Payables", submenu: "supp-payable" },
  { icon:HandCoins , label: "Customer Debt", submenu: "customer-dept" },
  { icon: DollarSign, label: "Container Profit", submenu: "container-profit" },
  { icon: ArrowUpCircle, label: "Financial ", submenu: "report-financial" },
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
            {activeReport === "supp-payable" && <PayableController goBack={resetReportView} />}
            {activeReport === "customer-dept" && <DebtController goBack={resetReportView} />}
            {activeReport === "container-profit" &&  <ContainerProfitController goBack={resetReportView} />}
            {activeReport === "report-expensify" && <div>Expensify Report</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportController;