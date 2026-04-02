import React, { useState } from "react";
import { Outlet, useLocation, useNavigate, useResolvedPath } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../../assets/Styles/dashboard/dashboard.scss";
import "../../assets/Styles/dashboard/header.scss";
import ProfilePopup from "../ProfilePopup";

const DashboardPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openSidebarMenu, setOpenSidebarMenu] = useState(null);
  const [autoOpenCreate, setAutoOpenCreate] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();


  
  const userData = JSON.parse(localStorage.getItem("user"));
  const userPermissions = userData?.permissions?.map(p => p.name) || [];
  const isSuperuser = userData?.is_superuser === 1;

  const isPathAuthorized = () => {

    if (location.pathname.includes("overview")) return true;

    const pathPermissionMap = {
      "/dashboard/trip": "Fontend_can.view.trips",
      "/dashboard/container": "Fontend_can.view.containers",
      "/dashboard/sales": "Fontend_can.view.sales",
      "/dashboard/pre-sale": "Fontend_can.view.presales",
      "/dashboard/recovery": "Fontend_can.view.recoveries",
      "/dashboard/finance": "Fontend_can.view.finance",
      "/dashboard/payroll": "Fontend_can.view.payroll",
      "/dashboard/report": "Fontend_can_view_reports",
      "/dashboard/requestbox": "Fontend_can_view_inbox",
      "/dashboard/admin": "Fontend_can_view_admin",
      "/dashboard/accounts": "Fontend_can_view_accounts",
    };

    const requiredPerm = Object.keys(pathPermissionMap).find(path => 
      location.pathname.startsWith(path)
    );

    if (!requiredPerm) return false; 
    if (isSuperuser) return true;
    return userPermissions.includes(pathPermissionMap[requiredPerm]);
  };

  const showSidebar = isPathAuthorized();

  const openSubmenuFromChild = (parentId, path, action = null) => {
    setOpenSidebarMenu(parentId);
    navigate(path, { replace: false });
    if (action) setAutoOpenCreate(action);
  };

  const handleLogout = () => {
     localStorage.removeItem("token");
     localStorage.removeItem("user");
     navigate("/login", { replace: true });
  };

  return (
    <div className={`dashboard ${!showSidebar ? "no-sidebar" : ""}`}>
      {showSidebar && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          openSidebarMenu={openSidebarMenu}
        />
      )}

      <div className="rightbar" style={{ width: !showSidebar ? "100%" : "" }}>
        <div className="page-fade">
          <Outlet key={location.state?.reset || location.pathname}
            context={{
              autoOpenCreate,
              setAutoOpenCreate,
              openSubmenuFromChild,
              setShowProfile,
            }}
          />
        </div>
        {showProfile && (
          <ProfilePopup
            onClose={() => setShowProfile(false)} 
            logout={handleLogout} 
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;