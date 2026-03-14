import React, { useState, useMemo } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import '../../../../assets/Styles/dashboard/table.scss'

const ContainerSaleTable = ({ presales = [],formatDate, containerReportData = [], onRowClick, goBack,currentPage, lastPage,   setPage }) => {
  // --- STATES FOR SEARCH & FILTERING ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [openFieldSelect, setOpenFieldSelect] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // all, paid, outstanding
const [filters, setFilters] = useState({
  payment_status: "",
  from_date: "",
  to_date: ""
});

const [openPaymentStatusSelect, setOpenPaymentStatusSelect] = useState(false);
  // --- FILTERING LOGIC ---
const filteredData = useMemo(() => {
  return containerReportData.filter((item) => {

    const s = searchTerm.toLowerCase();

    const matchesSearch =
      searchField === "all"
        ? (item.containerName?.toLowerCase().includes(s) ||
           item.trackingNumber?.toLowerCase().includes(s))
        : searchField === "container"
          ? item.containerName?.toLowerCase().includes(s)
          : item.trackingNumber?.toLowerCase().includes(s);

    const matchesStatus =
      !filters.payment_status
        ? true
        : filters.payment_status === "Full Payment"
        ? item.balance <= 0
        : item.balance > 0;

    const itemDate = new Date(item.createdAt);

    const matchesFrom =
      filters.from_date
        ? itemDate >= new Date(filters.from_date)
        : true;

    const matchesTo =
      filters.to_date
        ? itemDate <= new Date(filters.to_date)
        : true;

    return matchesSearch && matchesStatus && matchesFrom && matchesTo;

  });
}, [containerReportData, searchTerm, searchField, filters]);


  const totalContainers = filteredData.length;
  const totalSaleAmount = filteredData.reduce((sum, item) => sum + (Number(item.totalSaleAmount) || 0), 0);
  const totalRecoveryAmount = filteredData.reduce((sum, item) => sum + (Number(item.SamountPaid) || 0), 0);
  const totalOutstandingBalance = filteredData.reduce((sum, item) => sum + (Number(item.balance) || 0), 0);
  
const totalPresaleAmount = filteredData.reduce((sum, item) => sum + (Number(item.expectedPresaleAmount) || 0), 0);

  return (
    <div>
      {/* SUMMARY CARDS */}
      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item">
            <p className="small">Total Containers</p>
            <h2>{totalContainers}</h2>
          </div>
           <div className="summary-item">
            <p className="small">Total Expected Revenue</p>
            <h2>₦{totalPresaleAmount.toLocaleString()}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Total Sales to Date</p>
            <h2>₦{totalSaleAmount.toLocaleString()}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Total Recovery to Date</p>
            <h2>₦{totalRecoveryAmount.toLocaleString()}</h2>
          </div>
          <div className="summary-item">
            <p className="small">Total Amount Receivable</p>
            <h2>₦{totalOutstandingBalance.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      {/* TOP CONTROLS */}
      <div className="top-content">
        <div className="top-content-wrapper">
          <div className="left-wrapper" />
          <div className="right-wrapper">

            <div className="right-wrapper-input">
              <Search className="input-icon" />
              <input 
                type="text" 
                placeholder={`Search ${searchField === 'all' ? 'Containers...' : searchField + '...'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="select-input" style={{ position: 'relative' }}>
              <div className="filter" onClick={() => setShowFilters(!showFilters)}>
                <span style={{fontSize:".9vw"}}>{statusFilter === 'all' ? 'Add Filter' : statusFilter.toUpperCase()}</span>
                <Filter />
              </div>

            </div>

            {/* FIELD SELECT */}
            <div className="select-input">
              <div className="select-input-field">
                <div className="custom-select-drop" onClick={() => setOpenFieldSelect(!openFieldSelect)}>
                  <div className="select-box">
                    <span style={{fontSize:".9vw"}}>{searchField === "all" ? "All Fields" : searchField === "container" ? "Container Name" : "Tracking No"}</span>
                  </div>
                  <ChevronDown className={openFieldSelect ? "up" : "down"} />
                </div>
                {openFieldSelect && (
                  <div className="custom-select-dropdown">
                    <div className="option-item" onClick={() => { setSearchField("all"); setOpenFieldSelect(false); }}>All Fields</div>
                    <div className="option-item" onClick={() => { setSearchField("container"); setOpenFieldSelect(false); }}>Container Name</div>
                    <div className="option-item" onClick={() => { setSearchField("tracking"); setOpenFieldSelect(false); }}>Tracking Number</div>
                  </div>
                )}
              </div>
            </div>

            <div className="import-input"><p>Export</p></div>
          </div>
        </div>
        {showFilters && (
  <div className="filters-panel" >
    <div className="filter-item">
      <div
        className="custom-select-drop"
        onClick={() =>
          setOpenPaymentStatusSelect(!openPaymentStatusSelect)
        }
      >
        <div className="select-box">
          <span>
            {filters.payment_status || "All Payment Status"}
          </span>
        </div>

        <ChevronDown
          className={
            openPaymentStatusSelect ? "up" : "down"
          }
        />
      </div>

      {openPaymentStatusSelect && (
        <div className="custom-select-dropdown">

          {["", "Part Payment", "Full Payment"].map(
            (status) => (
              <div
                key={status}
                className="option-item"
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    payment_status: status
                  }));

                  setOpenPaymentStatusSelect(false);
                }}
              >
                {status === ""
                  ? "All Payment Status"
                  : status}
              </div>
            )
          )}

        </div>
      )}
    </div>
    <div className="filter-item">
      <input
        type="date"
        value={filters.from_date}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            from_date: e.target.value
          }))
        }
      />
    </div>
    <div className="filter-item">
      <input
        type="date"
        value={filters.to_date}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            to_date: e.target.value
          }))
        }
      />
    </div>
    <div className="filter-item">
      <button style={{margin:"0", display:"flex",width:"100%", color:"#581aae",background:"#fff" ,border:"1px solid #581aae",padding:".8vw 1vw",borderRadius:".8vw",alignItems:"center",justifyContent:"center"}}
        onClick={() =>{
          setFilters({
            payment_status: "",
            from_date: "",
            to_date: "",
          })
          setShowFilters(false)}
        }
      >
        Clear Filter
      </button>
    </div>

  </div>
)}
      </div>
   
      {/* TABLE */}
      <div className="userTable">
        <div className="table-wrap">
          <table className="table" style={{ maxWidth: "100%", width:"100%",minWidth:"100%" }}>
            <thead>
              <tr>
                <th>S/N</th>
                {/* <th>Container</th> */}
                <th> Tracking Number</th>
                <th>Expected Revenue</th>
                <th>Sales to Date</th>
                <th>Recovery to Date</th>
                <th>Amount Receivable</th>
                <th>UnSold Stock</th>
                <th>Sales Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: '20px' }}>
                    No Report Records Found for your search
                  </td>
                </tr>
              ) : (
                filteredData.map((row, idx) => (
                  <tr key={row.containerId} onClick={() => onRowClick(row)} style={{ cursor: "pointer" }}>
                    <td>{idx + 1}</td>
                    {/* <td>{row.containerName}</td> */}
                    <td>TRN-{row.trackingNumber}</td> 
                    <td>₦{row.expectedPresaleAmount?.toLocaleString()}</td>
                    <td>₦{row.totalSaleAmount.toLocaleString()}</td>
                    <td>₦{row.SamountPaid.toLocaleString()}</td>
                    <td style={{ color: row.balance > 0 ? '#d9534f' : '#5cb85c' }}>
                        ₦{row.balance.toLocaleString()}
                    </td>
                    <td>₦{0}</td>
                    <td> <span  style={{ color: row?.balance  <= 0 ? "green" : "orange" }}>
                      {row?.balance <= 0 ? "Full Payment":"Part Payment" }
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {lastPage > 1 && (
            <div className="pagination">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>Page {currentPage} of {lastPage}</span>
              <button 
                disabled={currentPage === lastPage} 
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="btn-row">
        <button className="cancel" onClick={goBack}>Previous</button>
      </div>
    </div>
  );
};

export default ContainerSaleTable;