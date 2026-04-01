import React, { useState, useEffect } from 'react';
import logo from '../../assets/Images/Logo/LogoMain.png';
import '../../assets/Styles/dashboard/sidebar.scss';
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ChevronDown, Activity, CreditCard, BarChart2, Users, Tag, TrendingUp, FileText, UserCheck, Shield, ChevronRight, ChevronLeft, Mail, } from 'lucide-react';
import useAutoLogout from '../../hooks/useAutoLogout';

const Sidebar = ({ collapsed, onToggle, openSidebarMenu }) => {
  const [submenu, setSubmenu] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperuser, setIsSuperuser] = useState(false);

useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      const perms = userData.permissions?.map(p => p.name) || [];
      console.log("EXACT PERMISSIONS FROM API:", perms); // <--- ADD THIS
      setUserPermissions(perms);
      setIsSuperuser(userData.is_superuser === 1);
    }
  }, []);

  const location = useLocation();
  const navigate = useNavigate();


  const hasPermission = (perm) => {
    if (isSuperuser) return true; 
    if (!perm) return true; 
    return userPermissions.includes(perm);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", null, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
      permission: "Fontend_can_view_overview",
    },
    {
      path: "/dashboard/purchase",
      icons: CreditCard,
      label: "Purchase",
      // isModulePage: true,
      permission: "Fontend_can_view_purchase",
      submenu: [
        { path: "/dashboard/trip", label: "Trip", permission: "Fontend_can.view.trips" },
        { path: "/dashboard/container", label: "Container", permission: "Fontend_can.view.containers" },
      ],
    },
    {
      path: "/dashboard/sales",
      icons: Tag,
      label: "Sales",
      permission: "Fontend_can_view_sales",
      submenu: [
        { path: "/dashboard/pre-sale", label: "Pre Sale", permission: "Fontend_can.view.presales" },
        { path: "/dashboard/sales", label: "Sales", permission: "Fontend_can.view.sales" },
        { path: "/dashboard/recovery", label: "Recovery", permission: "Fontend_can.view.recoveries" },
      ],
    },
    {
      path: "/dashboard/expensify",
      icons: BarChart2,
      label: "Expensify",
      isModulePage: true,
      permission: "Fontend_can_view_expensify",
      submenu: [
        { path: "/dashboard/finance", label: "Finance", permission: "Fontend_can.view.finance" },
        { path: "/dashboard/payroll", label: "PayRoll", permission: "Fontend_can.view.payroll" },
        { path: "/dashboard/partner_payment", label: "Partner Pay ", permission: "Fontend_can.view.partner_payments" },
        { path: "/dashboard/bank_record", label: "Bank Recon", permission: "Fontend_can.view.bank_records" },
      ],
    },
    {
      path: "/dashboard/report",
      icons: FileText,
      label: "Reports",
      isModulePage: true,
      permission: "Fontend_can_view_reports",
    },
    {
      path: "/dashboard/requestbox",
      icons: Mail,
      label: " Requestbox",
      isModulePage: true,
      permission: "Fontend_can_view_inbox",
    },
    {
      path: "/dashboard/partnership",
      icons: Users,
      label: "Partnership",
      permission: "Fontend_can_view_partnership",
      submenu: [
        { path: "/dashboard/allocation", label: "Allocation", permission: "Fontend_can.view.allocations" },
        { path: "/dashboard/profit", label: "Profit", permission: "Fontend_can.view.profits" },
        { path: "/dashboard/partnerlot", label: "Partner Lot", permission: "Fontend_can.view.partnerlots" },
      ],
    },
    {
      path: "/dashboard/accounts",
      icons: UserCheck,
      label: "Accounts",
      isModulePage: true,
      // permission: "Fontend_can_view_accounts",
      submenu: [
        { path: "/dashboard/accounts/system-user", label: "System User",  },
        { path: "/dashboard/accounts/partner", label: "Partner", permission: "Fontend_Fontend_can.view.partners" },
        { path: "/dashboard/accounts/invest", label: "Investor", permission: "Fontend_Fontend_can.view.investors" },
        { path: "/dashboard/accounts/retailer", label: "Customer", permission: "Fontend_Fontend_can.view.retailers" },
        { path: "/dashboard/accounts/supplier", label: "Supplier", permission: "Fontend_Fontend_can.view.suppliers" },
        { path: "/dashboard/accounts/clearing-agent", label: "Clearing Agent", permission: "Fontend_Fontend_can.view.agents" },
        { path: "/dashboard/accounts/bdc-operator", label: "Bdc Operator", permission: "Fontend_Fontend_can.view.operators" },
      ],
    },
    {
      path: "/dashboard/admin",
      icons: Shield,
      label: "Admin",
      // permission: "Fontend_can_view_admin",
      submenu: [
        { path: "/dashboard/admin/role", label: "Role ",  },
        { path: "/dashboard/admin/permission", label: "Permission",  },
        { path: "/dashboard/admin/bonus", label: "Bonus", permission: "Fontend_can.view.bonuses" },
        { path: "/dashboard/admin/entity", label: "Entity", permission: "Fontend_can.view.entities" },
        { path: "/dashboard/admin/bank-account", label: "Bank Account", permission: "Fontend_can.view.bank_accounts" },
      ],
    },
  ];


  const filteredMenu = sidemenu
    .filter(item => hasPermission(item.permission))
    .map(item => {
      if (item.submenu) {
        return {
          ...item,
          submenu: item.submenu.filter(sub => hasPermission(sub.permission))
        };
      }
      return item;
    })
    .filter(item => !item.submenu || item.submenu.length > 0 || item.isModulePage);

  const isParentActive = (item) => {
    if (item.submenu) {
      return item.submenu.some(sub => location.pathname === sub.path);
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
    const parent = filteredMenu.find(item =>
      item.submenu?.some(sub => location.pathname === sub.path)
    );
    if (parent) setSubmenu(parent.path);
  }, [location.pathname, filteredMenu]);

  return (
    <div className={`${collapsed ? "collapsed" : ""} sidebar`}>
      <div className="sidelogo">
        <div className="logo">
          <img src={logo} alt='HydeVest Logo' />
        </div>
      </div>
      <div className="toggle" onClick={onToggle}>
        {collapsed ? <ChevronRight className='toggle-icon' /> : <ChevronLeft className='toggle-icon' />}
      </div>

      <nav>
        <ul>
          {filteredMenu.map(item => (
            <li key={item.path}>
              <div className={`sidemenu-li ${isParentActive(item) ? "active" : ""}`} onClick={() => handleParentClick(item)}>
                <div className="expande-munu">
                  <item.icons className='expande-icon' />
                  <span>{item.label}</span>
                </div>
                <div className="collapse-menu">
                  <item.icons />
                </div>
                {!collapsed && item.submenu && (
                  <ChevronDown className={`chevron-icon ${submenu === item.path ? "rotate" : ""}`} />
                )}
              </div>

              {!collapsed && item.submenu && (
                <ul className={submenu === item.path ? "submenu" : "d-none"}>
                  {item.submenu.map(subItem => (
                    <li
                      key={subItem.path}
                      className={`submenu-item ${location.pathname === subItem.path ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubmenuClick(subItem);
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
          <button className='Logout' onClick={logout}>Logout</button>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;