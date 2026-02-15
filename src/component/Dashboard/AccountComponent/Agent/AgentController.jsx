import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/account/emptyAccount.scss";
import CreateAgent from "./CreateAgent";
import AgentTable from "./AgentTable";
import { ClearingAgentService } from "../../../../services/Account/ClearingAgentService";

const AgentController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  const [view, setView] = useState("table");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);

  const [searchEmail, setSearchEmail] = useState("");
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAgents = async (page = 1) => {
    try {
      setLoading(true);
      const res = await ClearingAgentService.list({
        search_email: searchEmail,
        search_fullname: searchName,
        page,
      });
      setData(res.data.record?.data || []);

      setCurrentPage(res.data.record?.current_page || 1);
      setTotalPages(res.data.record?.last_page || 1);
    } catch (err) {
      console.error("Fetch clearing agents failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate]);

  const handleEdit = (agent) => {
    setEditData(agent);
    setView("create");
  };

  const handleSearch = () => fetchAgents(1);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) fetchAgents(page);
  };

  return (
    <div className="emptyAccount">
      <div className="emptyAccount-container">
        <div className="emptyAccount-content">

          {/* TOP BAR */}
          {view === "table" && (
            <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper" />

                <div className="right-wrapper">
                  <div className="right-wrapper-input">
                    <Search className="input-icon" />
                    <input
                      placeholder="Search Email or Name"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>

                  <div className="select-input">
                    <div className="filter">
                      <span>Add Filter</span>
                      <Filter />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditData(null);
                      setView("create");
                    }}
                  >
                    Create Clearing Agent
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          <div className="main-content">
            { view === "table" && (
              <AgentTable
                data={data}
                currentPage={currentPage}
                totalPages={totalPages}
                loading={loading}
                onPageChange={handlePageChange}
                onEdit={handleEdit}
              />
            )}

            {view === "create" && (
              <CreateAgent
                editData={editData}
                openSubmenu={openSubmenu}
                mode="submenu"
                setView={setView}
                onClose={() => {
                  setView("table");
                  fetchAgents();
                }}
                // refresh={fetchAgents}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentController;
