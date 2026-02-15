import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/account/emptyAccount.scss";
import CreateOperator from "./CreateOperator";
import OperatorTable from "./OperatorTable";
import { BdcOperatorService } from "../../../../services/Account/BdcOperatorService";

const OperatorController = ({ autoOpenCreate, setAutoOpenCreate }) => {
  const [view, setView] = useState("table");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchEmail, setSearchEmail] = useState("");
  const [searchName, setSearchName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editData, setEditData] = useState(null);

  const fetchOperators = async (page = 1) => {
    try {
      setLoading(true);
      const res = await BdcOperatorService.list({
        search_email: searchEmail,
        search_fullname: searchName,
        page,
      });

      setData(res.data.record?.data || []);
      setCurrentPage(res.data.record?.current_page || 1);
      setTotalPages(res.data.record?.last_page || 1);
    } catch (err) {
      console.error("Failed to fetch BDC operators", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate]);

  const handleSearch = () => fetchOperators(1);

  const handleEdit = (operator) => {
    setEditData(operator);
    setView("create");
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
                      placeholder="Search email"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>

                  <div className="right-wrapper-input">
                    <input
                      placeholder="Search name"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>

                  <button onClick={() => {
                    setEditData(null);
                    setView("create");
                  }}>
                    Create BDC Operator
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          <div className="main-content">
            {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

            {!loading && view === "table" && (
              <OperatorTable
                data={data}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={fetchOperators}
                onEdit={handleEdit}
              />
            )}

            {view === "create" && (
              <CreateOperator
                editData={editData}
                setView={setView}
                refresh={fetchOperators}
                mode="submenu"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorController;
