// SIDEBAR

// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import logo from "../../assets/Images/Logo/LogoMain.png";
// import "../../assets/Styles/dashboard/sidebar.scss";
// import {
//   ChevronDown, Activity, CreditCard, BarChart2,
//   Users, Tag, TrendingUp, FileText, UserCheck, Shield,
//   Settings, ChevronRight, ChevronLeft,
// } from "lucide-react";

// const Sidebar = ({ collapsed, onToggle, openSidebarMenu, navigate }) => {
//   const location = useLocation(); // get current route
//   const [submenu, setSubmenu] = useState(null);

//   const sidemenu = [
//     { path: "/dashboard/overview", icons: Activity, label: "OverView" },
//     {
//       path: "/dashboard/purchase",
//       icons: CreditCard,
//       label: "Purchase",
//       submenu: [
//         { path: "/dashboard/trip", label: "Trip" },
//         { path: "/dashboard/container", label: "Container" },
//       ],
//     },
//     {
//       path: "/dashboard/sales",
//       icons: Tag,
//       label: "Sales",
//       submenu: [
//         { path: "/dashboard/pre-sale", label: "Pre Sale" },
//         { path: "/dashboard/sales", label: "Sales" },
//         { path: "/dashboard/recovery", label: "Recovery" },
//       ],
//     },
//     {
//       path: "/dashboard/expensify",
//       icons: BarChart2,
//       label: "Expensify",
//       submenu: [
//         { path: "/dashboard/finance", label: "Finance" },
//         { path: "/dashboard/payroll", label: "PayRoll" },
//       ],
//     },
//     {
//       path: "/dashboard/reports",
//       icons: FileText,
//       label: "Reports",
//       // submenu: [
//       //   { path: "/dashboard/reports/vat", label: "VAT" },
//       //   { path: "/dashboard/reports/cit", label: "CIT" },
//       // ],
//     },
//     {
//       path: "/dashboard/partnership",
//       icons: Users,
//       label: "Partnership",
//       submenu: [
//         { path: "/dashboard/partnership/partner", label: "Allocation" },
//         { path: "/dashboard/partnership/profit", label: "Profit" },
//       ],
//     },
//     {
//       path: "/dashboard/hynvest",
//       icons: TrendingUp,
//       label: "Hynvest",
//       submenu: [
//         { path: "/dashboard/hynvest/hynvestor", label: "Hynvestor" },
//         { path: "/dashboard/hynvest/hynvest-profit", label: "Hynvest Profit" },
//       ],
//     },
//     {
//       path: "/dashboard/accounts",
//       icons: UserCheck,
//       label: "Accounts",
//       submenu: [
//         { path: "/dashboard/accounts/system-user", label: "System User" },
//         { path: "/dashboard/accounts/partner", label: "Partner" },
//         { path: "/dashboard/accounts/invest", label: "Hynvest" },
//         { path: "/dashboard/accounts/retailer", label: "Customer" },
//         { path: "/dashboard/accounts/supplier", label: "Supplier" },
//         { path: "/dashboard/accounts/clearing-agent", label: "Clearing Agent" },
//         { path: "/dashboard/accounts/bdc-operator", label: "Bdc Operator" },
//       ],
//     },
//     {
//       path: "/dashboard/admin",
//       icons: Shield,
//       label: "Admin",
//       submenu: [
//         { path: "/dashboard/admin/role-setup", label: "Role Setup" },
//         { path: "/dashboard/admin/entity", label: "Entity" },
//         { path: "/dashboard/admin/bank-account", label: "Bank Account" },
//       ],
//     },
//     {
//       path: "/dashboard/settings",
//       icons: Settings,
//       label: "Settings",
//     },
//   ];
  
//   const handleParentClick = (item) => {
//     if (item.submenu && item.submenu.length > 0) {
//       setSubmenu(submenu === item.id ? null : item.id); // toggle dropdown
//     } else if (item.path) {
//       navigate(item.path);
//     }
//   };

//   const handleSubClick = (subItem) => {
//     if (subItem.path) navigate(subItem.path);
//   };

//   const isParentActive = (item) => {
//     if (item.submenu?.some(sub => sub.path === location.pathname)) return true;
//     if (item.path === location.pathname) return true;
//     return false;
//   };

//   useEffect(() => {
//     if (openSidebarMenu) setSubmenu(openSidebarMenu);
//   }, [openSidebarMenu]);

//   return (
//     <div className={`${collapsed ? "collapsed" : ""} sidebar`}>
//       <div className="sidelogo">
//         <div className="logo">
//           <img src={logo} alt="HydeVest Logo" />
//         </div>
//       </div>

//       <div className="toggle" onClick={onToggle}>
//         {collapsed ? <ChevronRight className="toggle-icon" /> : <ChevronLeft className="toggle-icon" />}
//       </div>

//       <nav>
//         <ul>
//           {sidemenu.map(item => (
//             <li key={item.id}>
//               <div
//                 className={`sidemenu-li ${isParentActive(item) ? "active" : ""}`}
//                 onClick={() => handleParentClick(item)}
//               >
//                 <div className="expande-munu">
//                   <item.icons />
//                   <span>{item.label}</span>
//                 </div>
//                 {!collapsed && item.submenu && (
//                   <ChevronDown
//                     className={`chevron-icon ${submenu === item.id ? "rotate" : ""}`}
//                   />
//                 )}
//               </div>

//               {/* SUBMENU */}
//               {!collapsed && item.submenu && (
//                 <ul className={submenu === item.id ? "submenu" : "d-none"}>
//                   {item.submenu.map(subItem => (
//                     <li
//                       key={subItem.id}
//                       className={`submenu-item ${location.pathname === subItem.path ? "active" : ""}`}
//                       onClick={(e) => { e.stopPropagation(); handleSubClick(subItem); }}
//                     >
//                       <span>{subItem.label}</span>
//                       <div className="subActive"></div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;


// SIDEBAR END

// Dashboard Page 

// import React, { useState } from 'react'
// import '../../assets/Styles/dashboard/dashboard.scss'
// import '../../assets/Styles/dashboard/header.scss'
// import Trip from './Pages/Purchase/Trip'
// import Sidebar from './Sidebar'
// import Container from './Pages/Purchase/Container'
// import Account from './Pages/Account/Account'
// import AccPartner from './Pages/Account/AccPartner'
// import AccUser from './Pages/Account/AccUser'
// import AccRetailer from './Pages/Account/AccRetailer'
// import AccSupplier from './Pages/Account/AccSupplier'
// import AccAgent from './Pages/Account/AccAgent'
// import AccOperator from './Pages/Account/AccOperator'
// import PreSale from './Pages/Sale/PreSale'
// import Sale from './Pages/Sale/Sale'
// import Recovery from './Pages/Sale/Recovery'
// import Finance from './Pages/Expensify/Finance/Finance'
// import PayRoll from './Pages/Expensify/PayRoll/PayRoll'
// import AccInvest from './Pages/Account/AccInvest'
// import Report from './Pages/Report/Report'
// import Allocation from './Pages/PartnerShip/Allocation'
// import Profit from './Pages/PartnerShip/Profit'
// import Entity from './Pages/Admin/Entity'
// import PartnerLot from './Pages/PartnerShip/PartnerLot'
// import RoleSetup from './Pages/Admin/RoleSetup'
// import BankAccount from './Pages/Admin/BankAccount'
// import Bonus from './Pages/Admin/Bonus'

// const DashboardPage = () => {
//     const [sidebarCollapsed , setSidebarCollapsed] = useState(false)
//     const [currentPage,setCurrentPage ]= useState('trip')
//      const [openSidebarMenu, setOpenSidebarMenu] = useState(null);
//      const [autoOpenCreate, setAutoOpenCreate] = useState(false);


//  const openSubmenuFromChild = (parentId, subId, action = null) => {
//   setOpenSidebarMenu(parentId);  
//   setCurrentPage(subId);        

//   if (action === "create") {
//     setAutoOpenCreate(true);
//   }
// };

//      const renderPage = () => {
//     switch (currentPage) {
//       case "trip":
//         return <Trip />;
//       case "container":
//         return <Container />;
//          case "accounts":
//         return <Account  openSubmenu={openSubmenuFromChild}/>;
//          case "acc-system-user":
//        return <AccUser autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate} />;
//         case "acc-partner":
//         return <AccPartner  autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate}  />
//         case "acc-invest":
//         return <AccInvest  autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate}  />
//          case "acc-retailer":
//         return <AccRetailer  autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate}  />
//          case "acc-supplier":
//         return <AccSupplier  autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate}  />
//          case "acc-clearing-agent":
//         return <AccAgent  autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate}  />
//          case "acc-bdc-operator":
//         return <AccOperator  autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate}  />
//          case "pre-sale":
//         return <PreSale />
//            case "sales":
//         return <Sale />
//         case "recovery":
//           return < Recovery/>;
//       case "finance":
//         return <Finance />;
//         case "payroll":
//         return <PayRoll />;
//         case "report":
//         return <Report />;
//         case "allocation":
//         return <Allocation />;
//         case "profit":
//         return <Profit />;
//         case "partnerlot":
//         return <PartnerLot />;
//         case "entity":
//         return <Entity />;
//         case "role-setup":
//         return <RoleSetup />;
//         case "bonus":
//           return <Bonus />;
//         case "bank-account":
//         return <BankAccount />;
//       default:
//         return <h2>Page Not Found</h2>;
//     }
//   };
//   return (
//     <>

//    <div className="dashboard">
//     <Sidebar
//         collapsed={sidebarCollapsed}
//         onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
//         currentPage={currentPage}
//         onPageChange={setCurrentPage}
//           openSidebarMenu={openSidebarMenu}
//             />
//        <div className="rightbar">
//         <div key={currentPage} className="page-fade">
//             {renderPage()}
//          </div>
//        </div>
//    </div>
//    </>
//   )
// }

//  export default DashboardPage



// Dashpoard Page End 

// App Js 

// import { HashRouter, Routes, Route, useLocation,useNavigate } from 'react-router-dom';
// import SignUp from './component/Authentication/SignUp';
// import DashboardPage from './component/Dashboard/DashboardPage';


// function AppContent() {
//   return (
//     <>
//       {/* {loading ? (
//         <LoadingSpinner /> // Show only the spinner until loading is complete
//       ) : ( */}
//       <Routes>
//         <Route path='/' element={<SignUp />} />
//           <Route path='/dashboard' element={<DashboardPage />} />
//       </Routes>
//       {/* )} */}
//     </>
      
//   );
// }

// function App() {

//   return (
//     <div className="App">
//        <HashRouter>
//         <AppContent />
//       </HashRouter>
//     </div>
//   );
// }
// export default App;
// // git add .
// // git commit -m "Your commit message"
// // git push


// App Js End 