import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/account/emptyAccount.scss";
import { InvestorService } from "../../../../services/Account/InvestorService";
import CreateInvest from "./CreateInvest";
import InvestTable from "./InvestTable";

const InvestController = ({openSubmenu}) => {
  const [view, setView] = useState("table");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);

  const [searchEmail, setSearchEmail] = useState("");
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInvestors = async (page = 1) => {
    try {
      setLoading(true);
      const res = await InvestorService.list({
        search_email: searchEmail,
        search_fullname: searchName,
        page,
      });
  
     
      setData(res.data.record?.data || []);
      setCurrentPage(res.data.record?.current_page || 1);
      setTotalPages(res.data.record?.last_page || 1);
    } catch (err) {
      console.error("Fetch investors failed", err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchInvestors();
  }, []);

  const handleEdit = (investor) => {
    setEditData(investor);
    setView("create");
  };
  const handleSearch = () => {
    fetchInvestors(1); // reset to page 1 whenever searching
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchInvestors(page);
    }
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

                  <button onClick={() => { setEditData(null); setView("create"); }}>
                    Create Investor
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          <div className="main-content">
            {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

            {!loading && view === "table" && (
              <InvestTable
                data={data}
                refresh={fetchInvestors}
                onEdit={handleEdit}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {view === "create" && (
              <CreateInvest
                editData={editData}
                openSubmenu={openSubmenu}
                mode="submenu"
                onClose={() => { setView("table"); fetchInvestors(); }}
                refresh={fetchInvestors}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestController;
