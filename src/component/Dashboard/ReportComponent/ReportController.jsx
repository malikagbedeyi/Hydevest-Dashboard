import React, { useEffect, useMemo, useState } from "react"; // Added useMemo
import { useOutletContext } from "react-router-dom";
import "../../../assets/Styles/dashboard/account/emptyAccount.scss";
import { Tag, Users, CreditCard, BarChart2, PackageCheck, Wallet, HandCoins, DollarSign, ArrowUpCircle } from "lucide-react";
import ContainerSaleReport from "./ContainerSale/ContainerSaleReport";
import PayableController from "./SupplierPayables/PayableController";
import DebtController from "./CustomerDebt/DebtController";
import ContainerProfitController from "./ContainerProfit/ContainerProfitController";

const reportTypes = [
  { icon: Tag, label: "Container Sales", submenu: "container-sale", ready: true ,permissions:"Fontend_can_view_contaner_sale_reports"},
  { icon: Wallet, label: "Supp. Payables", submenu: "supp-payable", ready: true,permissions:"Fontend_can_view_supplier_payable_reports" },
  { icon: HandCoins, label: "Customer Debt", submenu: "customer-dept", ready: true,permissions:"Fontend_can_view_customer_dept_reports" },
  { icon: DollarSign, label: "Container Profit", submenu: "container-profit", ready: true,permissions:"Fontend_can_view_contaner_profit_reports" },
  { icon: Wallet, label: "Supp. Receivable", submenu: "supp-receivable", ready: true,permissions:"Fontend_can_view_supplier_receivable_report" },
  { icon: ArrowUpCircle, label: "Financial", submenu: "report-financial", ready: false,permissions:"" },
  { icon: Users, label: "Partner", submenu: "report-partner", ready: false,permissions:"" },
  { icon: CreditCard, label: "Purchase", submenu: "report-purchase", ready: false,permissions:"" },
  { icon: BarChart2, label: "Expensify", submenu: "report-expensify", ready: false,permissions:"" },
];

const ReportController = () => {
  const { autoOpenCreate, setAutoOpenCreate } = useOutletContext();
  const [activeReport, setActiveReport] = useState(autoOpenCreate || null);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      const perms = userData.permissions?.map(p => p.name) || [];
      setUserPermissions(perms);
      setIsSuperuser(userData.is_superuser === 1);
    }
  }, []);

  /* ================== PERMISSION FILTERING LOGIC ================== */
  const filteredReports = useMemo(() => {

    return reportTypes.filter(report => {
      // if (!report.permissions) return isSuperuser; 

      // if (isSuperuser) return true;

      return userPermissions.includes(report.permissions);
    });
  }, [userPermissions, isSuperuser]);

  const handleReportClick = (submenu) => {
    setActiveReport(submenu);
  };

  const resetReportView = () => {
    setActiveReport(null);
  };

  useEffect(() => {
    if (autoOpenCreate) {
      setActiveReport(autoOpenCreate);
      setAutoOpenCreate(null);
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
                <div className="top-content-account-wrappper" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: "3vw" }}>

                  {filteredReports.map(({ icon: Icon, label, submenu, ready }) => (
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