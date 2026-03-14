import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/account/emptyAccount.scss";
import CreateRetailer from "./CreateRetailer";
import RetailerTable from "./RetailerTable";
import { CustomerService } from "../../../../services/Account/CustomerService";

const RetailerController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {

  const [view, setView] = useState("table");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editData, setEditData] = useState(null);

  const [searchEmail, setSearchEmail] = useState("");
  const [searchName, setSearchName] = useState("");

  const fetchCustomers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await CustomerService.list({
        search_email: searchEmail,
        search_fullname: searchName,
        page
      });
    

      setData(res.data.record?.data || []);
      console.log("customer data",res.data)
      setCurrentPage(res.data.record?.current_page || 1);
      setTotalPages(res.data.record?.last_page || 1);
    } catch (err) {
      console.error("Fetch customers failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate]);

  const handleEdit = (customer) => {
    setEditData(customer);
    setView("create");
  };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchCustomers(page);
    }
  };

  return (
    <div className="emptyAccount">
      <div className="emptyAccount-container">
        <div className="emptyAccount-content">
          {/* TOP BAR */}
          {(view === "table") && (
            <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper" />
                <div className="right-wrapper">
                  <div className="right-wrapper-input">
                    <Search className="input-icon" />
                    <input placeholder="Search Email or Name"value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchCustomers(1)}/>
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
                  <button onClick={() => { setEditData(null); setView("create"); }}>
                    Create Customer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          <div className="main-content">
            {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

            
              {!loading && view === "table" && (
              <RetailerTable  data={data}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onEdit={handleEdit} />
            )}

            {view === "create" && (
              <CreateRetailer
                data={data}
                setData={setData}
                setView={setView}
                openSubmenu={openSubmenu}
                mode="submenu"
                fetchData={fetchCustomers} // pass fetch for refresh after create/edit
                editData={editData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default RetailerController;
