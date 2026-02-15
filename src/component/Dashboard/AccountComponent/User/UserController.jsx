import React, { useEffect, useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import api from "../../../../services/api";
import UserTable from "./UserTable";
import CreateUser from "./CreateUser";
import { SystemUserService } from '../../../../services/Account/systemUser.service';

const UserController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  const [view, setView] = useState("table");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [pagination, setPagination] = useState({});

  const fetchUsers = async (pageNum = page) => {
    try {
      setLoading(true);
      const res = await api.get("/systemuser/account/systemuser/list", {
        params: {
          search_email: search,
          is_system_user: 1,
          page: pageNum,
        },
      });
      console.log(res.data)
      setUsers(res.data?.record?.data || []);
      setPagination(res.data?.record || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const confirmDelete = async () => {
    try {
      await SystemUserService.changeStatus(deleteTarget.user_uuid, 0);
  
      // ✅ Optimistic UI update
      setUsers(prev =>
        prev.map(u =>
          u.user_uuid === deleteTarget.user_uuid
            ? { ...u, status: 0 }
            : u
        )
      );
  
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("Failed to disable user");
    }
  };
  
  // Fetch on search change
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(1);
      setPage(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  // Fetch on page change
  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  // Auto-open create form
  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate]);

  return (
    <div className="emptyAccount">
      <div className="emptyAccount-container">
        <div className="emptyAccount-content">
          {/* TOP BAR */}
          {(view === "empty" || view === "table") && (
            <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper" />
                <div className="right-wrapper">
                  <div className="right-wrapper-input">
                    <Search className="input-icon" />
                    <input
                      type="text"
                      placeholder="Search"
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

                  <div className="select-input">
                    <div className="select-input-field">
                      <span>All Field</span>
                      <ChevronDown />
                    </div>
                  </div>

                  <div className="import-input">
                    <p>Import</p>
                  </div>

                  <div onClick={() => setView("export")} className="import-input">
                    <p>Export</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setView("create");
                    }}
                  >
                    Create System User
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          <div className="main-content">
            {/* Table */}
            {view === "table" && (
              <UserTable
                data={users}
                page={page}
                setPage={setPage}
                loading={loading}
                onRowClick={(user) => {
                  setSelectedUser({
                    ...user,
                    user_uuid: user.user_uuid || user.system_user_uuid || user.id // ensure correct ID
                  });
                  setView("create");
                }}                
                onDelete={(user) => setDeleteTarget(user)}
              />
            )}
{deleteTarget && (
  <div className="trip-card-popup">
    <div className="trip-card-popup-container">
      <div className="popup-content">
      <p>Are you sure you want to disable this user?</p>

        <div className="btn-row">
          <button onClick={() => setDeleteTarget(null)}>Cancel</button>
          <button className="create">Disable</button>
        </div>
      </div>
    </div>
  </div>
)}

            {/* Create / Edit User Form */}
            {view === "create" && (
              <CreateUser
                setView={setView}
                setData={setUsers}
                openSubmenu={openSubmenu}
                mode={selectedUser ? "edit" : "submenu"}
                user={selectedUser}
                onSuccess={() => {
                  setView("table");
                  fetchUsers();
                  setSelectedUser(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserController;
