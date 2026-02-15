import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/account/emptyAccount.scss";
import CreateSupplier from "./CreateSupplier";
import SupplierTable from "./SupplierTable";
import { SupplierService } from "../../../../services/Account/SupplierService";

const SupplierController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  const [view, setView] = useState("table");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchEmail, setSearchEmail] = useState("");
  const [searchName, setSearchName] = useState("");

  const fetchSuppliers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await SupplierService.list({
        search_email: searchEmail,
        search_fullname: searchName,
        page,
      });

      setData(res.data.record?.data || []);
      setCurrentPage(res.data.record?.current_page || 1);
      setTotalPages(res.data.record?.last_page || 1);
    } catch (err) {
      console.error("Fetch suppliers failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate]);

  const handleEdit = (supplier) => {
    setEditData(supplier);
    setView("create");
  };

  const handleSearch = () => {
    fetchSuppliers(1); // reset to page 1 whenever searching
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) fetchSuppliers(page);
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

                  <div className="select-input">
                    <div className="select-input-field">
                      <span>All Field</span>
                      <ChevronDown />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditData(null);
                      setView("create");
                    }}
                  >
                    Create Supplier
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          <div className="main-content">
            {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

            {!loading && view === "table" && (
              <SupplierTable
                data={data}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onEdit={handleEdit}
              />
            )}

            {view === "create" && (
              <CreateSupplier
                editData={editData}
                openSubmenu={openSubmenu}
                mode="submenu"
                setView={setView}
                onClose={() => {
                  setView("table");
                  fetchSuppliers();
                }}
                refresh={fetchSuppliers}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierController;
