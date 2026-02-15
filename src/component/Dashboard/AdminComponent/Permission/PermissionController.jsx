import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";
import PermissionTable from "./PermissionTable";
import CreatePermission from "./CreatePermission";
import PermissionService from "../../../../services/Admin/PermissionService";
import PermissionLogs from "../Logs/ PermissionLogs";

const PermissionController = ({ autoOpenCreate, setAutoOpenCreate }) => {
  const [view, setView] = useState("table");
  const [permissions, setPermissions] = useState([]);
  const [editPermission, setEditPermission] = useState(null);
  const [activeTab, setActiveTab] = useState("table");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPermissions = async (searchValue = search, pageValue = page) => {
    try {
      setLoading(true);
      const res = await PermissionService.listPermissions({
        search: searchValue,
        page: pageValue,
      });

      setPermissions(res.data);
      setTotalPages(res.meta.last_page || 1);
      setView(res.data.length ? "table" : "empty");
    } catch (e) {
      console.error("Failed to fetch permissions", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [page]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchPermissions(search, 1);
    }, 400);
    return () => clearTimeout(t);
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

          {(view === "table" || view === "empty") && (
            <>
              <div className="top-content">
                <div className="top-content-wrapper">
                  <div className="left-wrapper" />
                  <div className="right-wrapper">
                    <div className="right-wrapper-input">
                      <Search className="input-icon" />
                      <input
                        placeholder="Search permission"
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
                      Create Permission
                    </button>
                  </div>
                </div>
                <div className="log-tab-section">
                <div className="tab-content">
                  <ul>
                    <li  className={activeTab === "table" ? "active" : ""}
                      onClick={() => setActiveTab("table")}> Permission Table
                    </li>
                    <li className={activeTab === "logs" ? "active" : ""}
                      onClick={() => setActiveTab("logs")} >Activity Log
                    </li>
                  </ul>
                </div>
              </div>
              </div>
              
            </>
          )}

          <div className="main-content">
            {(view === "table" || view === "empty") && activeTab === "table" && (
              <PermissionTable
                data={permissions}
                loading={loading}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                setView={setView}
                setEditPermission={setEditPermission}
              />
            )}

            {(view === "table" || view === "empty") && activeTab === "logs" && (
              <PermissionLogs />
            )}

            {view === "create" && (
              <CreatePermission
                fetchPermissions={fetchPermissions}
                setView={setView}
                mode="create"
              />
            )}

            {view === "edit" && editPermission && (
              <CreatePermission
                fetchPermissions={fetchPermissions}
                setView={setView}
                mode="edit"
                editData={editPermission}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionController;
