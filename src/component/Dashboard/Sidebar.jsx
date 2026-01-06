import React, { useState, useEffect } from 'react';
import logo from '../../assets/Images/Logo/LogoMain.png';
import '../../assets/Styles/dashboard/sidebar.scss';
import {
  ChevronDown, Activity, CreditCard, BarChart2,
  Users, Tag, TrendingUp, FileText, UserCheck, Shield,
  Settings, ChevronRight, ChevronLeft,
} from 'lucide-react';

const Sidebar = ({ collapsed, onToggle, currentPage, openSidebarMenu, onPageChange }) => {

  const sidemenu = [
    { id: "overView", icons: Activity, label: "OverView" },
    {
      id: "purchase",
      icons: CreditCard,
      label: "Purchase",
      submenu: [
        { id: "trip", label: "Trip" },
        { id: "container", label: "Container" },
      ],
    },
    {
      id: "sales",
      icons: Tag,
      label: "Sales",
      submenu: [
        { id: "pre-sale", label: "Pre Sale" },
        { id: "sales", label: "Sales" },
        { id: "recovery", label: "Recovery" },
      ],
    },
    {
      id: "expensify",
      icons: BarChart2,
      label: "Expensify",
      submenu: [
        { id: "finance", label: "Finance" },
        { id: "payroll", label: "PayRoll" },
      ],
    },
    {
      id: "report",
      icons: FileText,
      label: "Reports",
      // submenu: [
      //   { id: "saleReport", label: "Sale Report" },
      // ],
    },
    {
      id: "partnership",
      icons: Users,
      label: "Partnership",
      submenu: [
        { id: "allocation", label: "Allocation" },
        { id: "profit", label: "Profit" },
      ],
    },

    {
      id: "hynvest",
      icons: TrendingUp,
      label: "Hynvest",
      submenu: [
        { id: "hynvestor", label: "Hynvestor" },
        { id: "hynvest-profit", label: "Hynvest Profit" },
      ],
    },
   
    {
      id: "accounts",
      icons: UserCheck,
      label: "Accounts",
      submenu: [
          { id: "acc-system-user", label: "System User" },
        { id: "acc-partner", label: "Partner" },
        { id: "acc-invest", label: "Hynvest" },
        { id: "acc-retailer", label: "Customer" },
        { id: "acc-supplier", label: "Supplier" },
        { id: "acc-clearing-agent", label: "Clearing Agent" },
         { id: "acc-bdc-operator", label: "Bdc Operator" },
      ],
    },
    {
      id: "admin",
      icons: Shield,
      label: "Admin",
      submenu: [
        { id: "role-setup", label: "Role Setup" },
        { id: "acc-entity", label: "entity" },
        { id: "acc-bank-account", label: "Bank Account" },
      ],
    },
    {
      id: "settings",
      icons: Settings,
      label: "Settings",
    },
  ];

  const [submenu, setSubmenu] = useState(null);

  const handleParentClick = (item) => {
    if (item.id === "accounts") {
      // Accounts acts as a page itself
      onPageChange("accounts");
      setSubmenu(submenu === item.id ? null : item.id); // toggle dropdown
      return;
    }

    if (item.submenu && item.submenu.length > 0) {
      // Toggle other parent dropdowns
      setSubmenu(submenu === item.id ? null : item.id);
    } else {
      onPageChange(item.id);
      setSubmenu(null);
    }
  };

  const isParentActive = (item) => {
    if (item.submenu?.some(sub => sub.id === currentPage)) return true;
    if (currentPage === item.id) return true;
    return false;
  };

  useEffect(() => {
    const activeParent = sidemenu.find(item =>
      item.submenu?.some(sub => sub.id === currentPage)
    );

    if (activeParent) {
      setSubmenu(activeParent.id);
    }
  }, [currentPage]);

  useEffect(() => {
    if (openSidebarMenu) {
      setSubmenu(openSidebarMenu);
    }
  }, [openSidebarMenu]);

  return (
    <div className={`${collapsed ? "collapsed" : ""} sidebar`}>

      <div className="sidelogo">
        <div className="logo">
          <img src={logo} alt='HydeVest Logo' />
        </div>
      </div>
      <div className="toggle" onClick={onToggle}>
        {collapsed ? <ChevronRight className='toggle-icon' /> :
          <ChevronLeft className='toggle-icon' />}
      </div>

      <nav>
        <ul>
          {sidemenu.map(item => (
            <li key={item.id}>

              <div
                className={`sidemenu-li ${isParentActive(item) ? "active" : ""}`} onClick={() => handleParentClick(item)}>
                <div className="expande-munu">
                  <item.icons className='expande-icon' />
                  <span>{item.label}</span>
                </div>
                <div className="collapse-menu">
                  <item.icons />
                </div>
                {!collapsed && item.submenu && (
                  <ChevronDown
                    className={`chevron-icon ${submenu === item.id ? "rotate" : ""}`}
                  />
                )}
              </div>

              {/* SUBMENU */}
              {!collapsed && item.submenu && (
                <ul className={submenu === item.id ? "submenu" : "d-none"}>
                  {item.submenu.map(subItem => (
                    <li
                      key={subItem.id}
                      className={`submenu-item ${currentPage === subItem.id ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPageChange(subItem.id);
                      }}
                    >
                      <span>{subItem.label}</span>
                      <div className="subActive"></div>
                    </li>
                  ))}
                </ul>
              )}

            </li>
          ))}
        </ul>
      </nav>

    </div>
  );
};

export default Sidebar;

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
