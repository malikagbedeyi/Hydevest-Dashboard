import React, { useState } from 'react'
import '../../assets/Styles/dashboard/dashboard.scss'
import '../../assets/Styles/dashboard/header.scss'
import Trip from './Pages/Purchase/Trip'
import Sidebar from './Sidebar'
import Container from './Pages/Purchase/Container'
import Account from './Pages/Account/Account'
import AccPartner from './Pages/Account/AccPartner'
import AccUser from './Pages/Account/AccUser'
import AccRetailer from './Pages/Account/AccRetailer'
import AccSupplier from './Pages/Account/AccSupplier'
import AccAgent from './Pages/Account/AccAgent'
import AccOperator from './Pages/Account/AccOperator'
import PreSale from './Pages/Sale/PreSale'
import Sale from './Pages/Sale/Sale'
import Recovery from './Pages/Sale/Recovery'
import Finance from './Pages/Expensify/Finance/Finance'
import PayRoll from './Pages/Expensify/PayRoll/PayRoll'
import AccInvest from './Pages/Account/AccInvest'
import Report from './Pages/Report/Report'
import Allocation from './Pages/PartnerShip/Allocation'
import Profit from './Pages/PartnerShip/Profit'

const DashboardPage = () => {
    const [sidebarCollapsed , setSidebarCollapsed] = useState(false)
    const [currentPage,setCurrentPage ]= useState('trip')
     const [openSidebarMenu, setOpenSidebarMenu] = useState(null);
     const [autoOpenCreate, setAutoOpenCreate] = useState(false);


 const openSubmenuFromChild = (parentId, subId, action = null) => {
  setOpenSidebarMenu(parentId);  
  setCurrentPage(subId);        

  if (action === "create") {
    setAutoOpenCreate(true);
  }
};

     const renderPage = () => {
    switch (currentPage) {
      case "trip":
        return <Trip />;
      case "container":
        return <Container />;
        //   case "account":
        // return <AccountFinance />;
         case "accounts":
        return <Account  openSubmenu={openSubmenuFromChild}/>;
         case "acc-system-user":
       return <AccUser autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate} />;
        case "acc-partner":
        return <AccPartner  autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate}  />
        case "acc-invest":
        return <AccInvest  autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate}  />
         case "acc-retailer":
        return <AccRetailer  autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate}  />
         case "acc-supplier":
        return <AccSupplier  autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate}  />
         case "acc-clearing-agent":
        return <AccAgent  autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate}  />
         case "acc-bdc-operator":
        return <AccOperator  autoOpenCreate={autoOpenCreate} setAutoOpenCreate={setAutoOpenCreate}  />
         case "pre-sale":
        return <PreSale />
           case "sales":
        return <Sale />
        case "recovery":
          return < Recovery/>;
      case "finance":
        return <Finance />;
        case "payroll":
        return <PayRoll />;
        case "report":
        return <Report />;
        case "allocation":
        return <Allocation />;
        case "profit":
        return <Profit />;
      default:
        return <h2>Page Not Found</h2>;
    }
  };
  return (
    <>

   <div className="dashboard">
    <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
          openSidebarMenu={openSidebarMenu}
            />
       <div className="rightbar">
        <div key={currentPage} className="page-fade">
            {renderPage()}
         </div>
       </div>
   </div>
   </>
  )
}

 export default DashboardPage

// import React, { useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import "../../assets/Styles/dashboard/dashboard.scss";
// import "../../assets/Styles/dashboard/header.scss";
// import Sidebar from "./Sidebar";

// const DashboardPage = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [openSidebarMenu, setOpenSidebarMenu] = useState(null);
//   const [autoOpenCreate, setAutoOpenCreate] = useState(false);

//   const navigate = useNavigate();

//   // Replaces currentPage logic
//   const openSubmenuFromChild = (parentId, path, action = null) => {
//     setOpenSidebarMenu(parentId);
//     navigate(path);

//     if (action === "create") {
//       setAutoOpenCreate(true);
//     }
//   };

//   return (
//     <div className="dashboard">
//       <Sidebar
//         collapsed={sidebarCollapsed}
//         onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
//         openSidebarMenu={openSidebarMenu}
//         navigate={navigate} // pass navigate to Sidebar
//       />

//       <div className="rightbar">
//         <div className="page-fade">
//           {/* Outlet will render route-based page components */}
//           <Outlet
//             context={{
//               autoOpenCreate,
//               setAutoOpenCreate,
//               openSubmenuFromChild,
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
