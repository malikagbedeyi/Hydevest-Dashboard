import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";
import RoleSetupTable from "./RoleSetupTable";
import CreateRoleSetup from "./CreateRoleSetup";
import RoleService from "../../../../services/Admin/RoleService";
import RoleLogs from "../Logs/RoleLogs";
import AssignPermissions from "./AssignPermissions";

const RoleSetupController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  const [view, setView] = useState("table");
  const [data, setData] = useState([]);
  const [editRole, setEditRole] = useState(null);
  const [activeTab, setActiveTab] = useState("roles");
  const [permissionCounts, setPermissionCounts] = useState({});

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async (searchValue = search, pageValue = page) => {
    try {
      setLoading(true);
  
      const res = await RoleService.listRoles({
        search: searchValue,
        page: pageValue,
      });
      setData(res.data);
      setTotalPages(res.meta.last_page || 1);
  
      if (!res.data.length) setView("empty");
      else setView("table");
    } catch (err) {
      console.error("Failed to fetch roles", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRoles();
  }, [page]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchRoles(search, 1);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate]);

  return (
    <div className="controller">
      <div className="controller-container">
        <div className="controller-content">

          {(view === "empty" || view === "table") && (
            <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper" />
                <div className="right-wrapper">
                  <div className="right-wrapper-input">
                    <Search className="input-icon" />
                    <input
                      type="text"
                      placeholder="Search role"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <div className="select-input">
                    <div className="filter">
                      <span>Add Filter</span>
                      <Filter />
                    </div>
                  </div>

                  <button onClick={() => setView("create")}>
                    Create Roles
                  </button>
                </div>
              </div>
              <div className="log-tab-section">
                   <div className="tab-content">
                     <ul>
                       <li className={activeTab === "roles" ? "active" : ""}
                        onClick={() => setActiveTab("roles")} > Role Table
                      </li>
                        <li className={activeTab === "logs" ? "active" : ""} 
                        onClick={() => setActiveTab("logs")}> Activity Log
                         </li>
                         {/* <li
  className={activeTab === "assign" ? "active" : ""}
  onClick={() => {
    setActiveTab("assign");
    setView("assign");
  }}
>
  Assign Permissions
</li> */}

                    </ul>
  </div>
</div>
            </div>
          )}

          <div className="main-content">
            {data.length === 0 && view === "empty" && !loading && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Data Created Yet</p>
                  <span>A Data created would be saved here automatically</span>
                </div>
              </div>
            )}

{(view === "table" || view === "empty") && activeTab === "roles" && (
  <RoleSetupTable
    data={data}
    loading={loading}
    page={page}
    totalPages={totalPages}
    onPageChange={setPage}
    setView={setView}
    setEditRole={setEditRole}
    setData={setData}
  />
)}

{(view === "table" || view === "empty") && activeTab === "logs" && (
  <RoleLogs />
)}
{/* {view === "assign" && activeTab === "assign" && (
    <AssignPermissions role={editRole} />
 
)} */}




            {view === "create" && (
              <CreateRoleSetup
                data={data}
                setData={setData}
                setView={setView}
                fetchRoles={fetchRoles}
                mode="create"
              />
            )}

            {view === "edit" && editRole && (
              <CreateRoleSetup
                data={data}
                setData={setData}
                setView={setView}
                fetchRoles={fetchRoles}
                mode="edit"
                editData={editRole}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSetupController;
