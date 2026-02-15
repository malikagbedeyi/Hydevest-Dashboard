import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../../assets/Styles/dashboard/dashboard.scss";
import "../../assets/Styles/dashboard/header.scss";

const DashboardPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openSidebarMenu, setOpenSidebarMenu] = useState(null);
  const [autoOpenCreate, setAutoOpenCreate] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const openSubmenuFromChild = (parentId, path, action = null) => {
    setOpenSidebarMenu(parentId);
    navigate(path, { replace: false });
    if (action === "create") setAutoOpenCreate(true);
  };

  return (
    <div className="dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        openSidebarMenu={openSidebarMenu}
      />

      <div className="rightbar">
        <div className="page-fade">
  <Outlet key={location.state?.reset || location.pathname}
    context={{
      autoOpenCreate,
      setAutoOpenCreate,
      openSubmenuFromChild,
    }}
  />
        </div>
      </div>
    </div>
  );
};


export default DashboardPage;
