import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import EntityTable from "./EntityTable";
import "../../../../assets/Styles/dashboard/controller.scss";
import CreateEntity from "./CreateEntity";
import { EntityServices } from "../../../../services/Admin/EntityServices";
import EntityLog from "./EntityLog";

// const Entity_KEY = "entity_data";

const EntityController = ({ openSubmenu ,autoOpenCreate, setAutoOpenCreate }) => {
  const [view, setView] = useState("table")
  const [entity, setEntity] = useState([])
  const [search , setSearch ] = useState('')
  const [page,setPage] = useState(1)
  const [activeTab, setActiveTab] = useState("table");
  const [loading,setLoading] = useState(false)
  const [pagination,setPagination] = useState({})
  const [selectedEntity, setSelectedEntity] = useState(null);
  
  const feacthEntity = async(pageNum = page) => {
   try {
    setLoading(true);
       const res = await EntityServices.list({
      search_email: search,
      // search_fullname:search,
      // date_created:search,
      page : pageNum,
    });
    setEntity(res.data?.record.data || [])
    setPagination(res.data?.record || [])
   } catch(err) {
     console.error(err);
   }finally {
    setLoading(false);
   }
  }
useEffect(() => {
  feacthEntity(page)
},[page])

useEffect(() => {
  const timer = setTimeout(() => {
    setPage(1);
    feacthEntity(1);
  }, 400);

  return () => clearTimeout(timer);
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
          {/* TOP BAR */}
          {(view === "empty" || view === "table") && (
            <div className="top-content">
             <div className="top-content-wrapper">
                  <div className="left-wrapper" />
                  <div className="right-wrapper">
                    <div className="right-wrapper-input">
                      <Search className="input-icon" />
                      <input
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

                    <button onClick={() => setView("create")}>
                      Create Entity
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
          )}

          {/* MAIN CONTENT */}
          <div className="main-content">
            {view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Entity Created Yet</p>
                  <span>A Entity created would be saved here automatically</span>
                </div>
              </div>
            )}

{(view === "table" || view === "empty") && activeTab === "table" && (
              <EntityTable  data={entity}
              loading={loading}
                page={page}
                setPage={setPage}
                pagination={pagination} 
                  onEdit={(entity) => {
                  setSelectedEntity(entity);
                  setView("edit");
                }}/>
            )}
            {(view === "table" || view === "empty") && activeTab === "logs" && (
              <EntityLog />
            )}
            {view === "create" || view === "edit" ? (
              <CreateEntity
              mode={view === "edit" ? "edit" : "create"}
              data={view === "edit" ? selectedEntity : null}
                setLoading={setLoading}
                setData={setEntity}
                setView={setView}
                onSuccess={() => feacthEntity(page)}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityController;
