
import React, { useState, useEffect } from 'react';
import logo from '../../assets/Images/Logo/LogoMain.png';
import '../../assets/Styles/dashboard/sidebar.scss';
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ChevronDown, Activity, CreditCard, BarChart2, Users, Tag, TrendingUp, FileText, UserCheck, Shield, ChevronRight, ChevronLeft, Mail,} from 'lucide-react';
import useAutoLogout from '../../hooks/useAutoLogout';

const Sidebar = ({ collapsed, onToggle, openSidebarMenu }) => {
  const [submenu, setSubmenu] = useState(null);



  const location = useLocation();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post("/auth/logout", null, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    } catch (err) {
      console.warn("Logout API failed:", err.response);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  useAutoLogout(logout, 600000); 
 
 
 



  const sidemenu = [
    {
      path: "/dashboard/overview",
      icons: Activity,
      label: "Overview",
    },
  
    {
      path: "/dashboard/purchase",
      icons: CreditCard,
      label: "Purchase",
      submenu: [
        { path: "/dashboard/trip", label: "Trip" },
        { path: "/dashboard/container", label: "Container" },
      ],
    },
  
    {
      path: "/dashboard/sales",
      icons: Tag,
      label: "Sales",
      submenu: [
        { path: "/dashboard/pre-sale", label: "Pre Sale" },
        { path: "/dashboard/sales", label: "Sales" },
        { path: "/dashboard/recovery", label: "Recovery" },
      ],
    },
  
    {
      path: "/dashboard/expensify",
      icons: BarChart2,
      label: "Expensify",
      submenu: [
        { path: "/dashboard/finance", label: "Finance" },
        { path: "/dashboard/payroll", label: "PayRoll" },
        { path: "/dashboard/partner_payment", label: "Partner Pay " },
       { path: "/dashboard/bank_record", label: "Bank Recon" },
      ],
    },
  
    {
      path: "/dashboard/report",
      icons: FileText,
      label: "Reports",
      isModulePage: true,
    },
    {
      path: "/dashboard/requestbox",
      icons: Mail,
      label: " Requestbox",
      isModulePage: true,
    },
    {
      path: "/dashboard/partnership",
      icons: Users,
      label: "Partnership",
      submenu: [
        { path: "/dashboard/allocation", label: "Allocation" },
        { path: "/dashboard/profit", label: "Profit" },
        { path: "/dashboard/partnerlot", label: "Partner Lot" },
      ],
    },
  
    {
      path: "/dashboard/hynvest",
      icons: TrendingUp,
      label: "Hynvest",
      submenu: [
        { path: "/dashboard/hynvest/hynvestor", label: "Hynvestor" },
        { path: "/dashboard/hynvest/hynvest-profit", label: "Hynvest Profit" },
      ],
    },
  
    {
      path: "/dashboard/accounts",
      icons: UserCheck,
      label: "Accounts",
      isModulePage: true, // <-- new
      submenu: [
        { path: "/dashboard/accounts/system-user", label: "System User" },
        { path: "/dashboard/accounts/partner", label: "Partner" },
        { path: "/dashboard/accounts/invest", label: "Investor" },
        { path: "/dashboard/accounts/retailer", label: "Customer" },
        { path: "/dashboard/accounts/supplier", label: "Supplier" },
        { path: "/dashboard/accounts/clearing-agent", label: "Clearing Agent" },
        { path: "/dashboard/accounts/bdc-operator", label: "Bdc Operator" },
      ],
    },
  
    {
      path: "/dashboard/admin",
      icons: Shield,
      label: "Admin",
      submenu: [
        { path: "/dashboard/admin/role", label: "Role " },
        { path: "/dashboard/admin/permission", label: "Permission" },
        { path: "/dashboard/admin/bonus", label: "Bonus" },
        { path: "/dashboard/admin/entity", label: "Entity" },
        { path: "/dashboard/admin/bank-account", label: "Bank Account" },
      ],
    },
  ];
  
  const isParentActive = (item) => {
    if (item.submenu) {
      return item.submenu.some(
        sub => location.pathname === sub.path
      );
    }
    return location.pathname === item.path;
  };
  
  const handleParentClick = (item) => {
    if (item.submenu) {
      
      setSubmenu(prev => prev === item.path ? null : item.path);
  
        
      if (!item.isModulePage && item.submenu.length > 0) {
        navigate(item.submenu[0].path, { state: { reset: Date.now() } });
        return;
      }
    }
  
  
    navigate(item.path, { state: { reset: Date.now() } });
  };
   
  const handleSubmenuClick = (subItem) => {
    navigate(subItem.path, { state: { reset: Date.now() } });
  };
  
  useEffect(() => {
    if (openSidebarMenu) {
      setSubmenu(openSidebarMenu);
    }
  }, [openSidebarMenu]);

  useEffect(() => {
    const parent = sidemenu.find(item =>
      item.submenu?.some(sub => location.pathname === sub.path)
    );
    if (parent) setSubmenu(parent.path);
  }, [location.pathname]);
  

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
            <li key={item.path}>
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
                 className={`chevron-icon ${submenu === item.path ? "rotate" : ""}`}
               />               
                )}
              </div>

              {/* SUBMENU */}
             {/* SUBMENU */}
{!collapsed && item.submenu && (
  <ul className={submenu === item.path ? "submenu" : "d-none"}>
    {item.submenu.map(subItem => (
      <li
        key={subItem.path}
        className={`submenu-item ${location.pathname === subItem.path ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          handleSubmenuClick(subItem); // ✅ use reset state
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
          <button className='Logout' onClick={logout} >Logout</button>
        </ul>
      </nav>

    </div>
  );
};

export default Sidebar;
