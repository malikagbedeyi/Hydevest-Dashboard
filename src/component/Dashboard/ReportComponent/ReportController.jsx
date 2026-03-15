import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "../../../assets/Styles/dashboard/account/emptyAccount.scss";
import { Tag, Users, CreditCard, BarChart2, PackageCheck, Wallet, HandCoins, DollarSign, ArrowUpCircle } from "lucide-react";
import ContainerSaleReport from "./ContainerSale/ContainerSaleReport";
import PayableController from "./SupplierPayables/PayableController";
import DebtController from "./CustomerDebt/DebtController";
import ContainerProfitController from "./ContainerProfit/ContainerProfitController";

const reportTypes = [
  { icon: Tag, label: "Container Sales", submenu: "container-sale", ready: true },
  { icon: Wallet, label: "Supp. Payables", submenu: "supp-payable", ready: true },
  { icon: HandCoins, label: "Customer Debt", submenu: "customer-dept", ready: true },
  { icon: DollarSign, label: "Container Profit", submenu: "container-profit", ready: true },
  { icon: ArrowUpCircle, label: "Financial", submenu: "report-financial", ready: false },
  { icon: Users, label: "Partner", submenu: "report-partner", ready: false },
  { icon: CreditCard, label: "Purchase", submenu: "report-purchase", ready: false },
  { icon: BarChart2, label: "Expensify", submenu: "report-expensify", ready: false },
];

const ReportController = () => {
   const { autoOpenCreate, setAutoOpenCreate } = useOutletContext();
   const [activeReport, setActiveReport] = useState(autoOpenCreate || null);
  const [isTransitioning, setIsTransitioning] = useState(true);



  const handleReportClick = (submenu) => {
    setActiveReport(submenu);
  };

  const resetReportView = () => {
    setActiveReport(null);
  };

useEffect(() => {
    if (autoOpenCreate) {
      setActiveReport(autoOpenCreate);
      setAutoOpenCreate(false);
    }

    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [autoOpenCreate, setAutoOpenCreate]);

  return (
    <div className={`emptyAccount ${isTransitioning ? 'page-loading' : 'page-ready'}`}>
      <div className="emptyAccount-container">
        <div className="emptyAccount-content">
          {!activeReport && (
            <div className="top-content slide-up">
              <div className="top-content-account">
                <div className="top-content-account-wrappper" style={{ gridTemplateColumns: "repeat(3,1fr)",gap:"3vw" }}>
              {reportTypes.map(({ icon: Icon, label, submenu, ready }) => (
  <div
    key={label}
    className="account-grid"
    onClick={() => ready && handleReportClick(submenu)}
    style={{
      cursor: ready ? "pointer" : "not-allowed",
      opacity: ready ? 1 : 0.4
    }}
  >
    <Icon color={ready ? "#581aae" : "gray"} />
    <span
      style={{
        fontSize: "1.5vw",
        color: ready ? "#581aae" : "gray"
      }}
    >
      {label}
    </span>
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
            {activeReport === "container-profit" && <ContainerProfitController goBack={resetReportView} />}
            {activeReport === "report-expensify" && <div>Expensify Report</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportController;