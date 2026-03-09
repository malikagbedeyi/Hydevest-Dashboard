import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";
import CreateRecovery from "./CreateRecovery";
import RecoveryTable from "./RecoveryTable";
import { RecoveryServices } from "../../../../services/Sale/recovery";
import DrillDownRecovery from "./DrillDownRecovery";
import RecoveryLog from "./RecoveryLog";

const API_URL = "/api/recoveries";

const RecoveryController = ({}) => {

  const [data, setData] = useState([]);
  const [sales, setSales] = useState([]);
  const [view, setView] = useState("empty");
    const [selectedRecovery, setSelectedRecovery] = useState(null);
    const [activeTab, setActiveTab] = useState("table");
const [page, setPage] = useState(1);
const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  totalPages: 1,
  total: 0
});

 

const fetchRecoveries = async (pageNum = page) => {
  try {
    const result = await RecoveryServices.list({
      page: pageNum
    });

    const records = Array.isArray(result.data?.record?.data) 
      ? result.data.record.data 
      : [];

    setData(records);
    setPagination({
  page: result.data.record?.current_page || 1,
  limit: result.data.record?.per_page || 10,
  totalPages: result.data.record?.last_page || 1,
  total: result.data.record?.total || 0
});

    setView(records.length === 0 ? "empty" : "table");
  } catch (err) {
    console.error("Failed to fetch recoveries", err);
    setData([]);
    setView("empty");
  }
};

  useEffect(() => {
    fetchRecoveries(1);
  }, []);
  const handlePageChange = (page) => {
    fetchRecoveries(page);
  };

const handleAddData = () => {
  setView("table");
  fetchRecoveries(1);
};

  const handleDeleteData = async (id) => {
  try {
    await RecoveryServices.delete(id); // use your service method
    fetchRecoveries(pagination.page);
  } catch (err) {
    console.error("Delete failed", err);
  }
};

  const handleUpdateRecovery = (updatedRecovery) => {
    setData((prev) =>
      prev.map((rec) =>
        rec.id === updatedRecovery.id ? updatedRecovery : rec
      )
    );
  };

const enrichedRecoveries = Array.isArray(data)
  ? data.map((rec, idx) => ({
      ...rec,
      sn: (pagination.page - 1) * pagination.limit + idx + 1,

      saleId: rec.sale_id,
      saleUniqueId: rec?.sale?.sale_unique_id,

      customerName: `${rec.customer?.firstname || ""} ${rec.customer?.lastname || ""}`,
      customerPhone: rec.customer?.phone_no || "",

      comment: rec?.comment || "",
      attachment: rec?.attachment || "",

      amountPaid: Number(rec.amount) || 0,
      paymentStatus: rec?.sale?.payment_status,
      paymentDate: rec?.payment_date,

      totalSaleAmount: Number(rec?.sale?.total_sale_amount) || 0,

      balance:
        (Number(rec?.sale?.total_sale_amount) || 0) -
        (Number(rec?.amount) || 0),

      createdAt: rec.created_at,
      status: Number(rec.status),
    }))
  : [];

   const handleRowClick = (rec) => {
  setSelectedRecovery(rec);
  setView("drilldown");
};

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
                    <input type="text" placeholder="Search" />
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

                  <div className="import-input">
                    <p>Export</p>
                  </div>

                  <button onClick={() => setView("create")}>
                    Create Record
                  </button>

                </div>
              </div>
              <div className="log-tab-section">
  <div className="tab-content">
    <ul>
      <li
        className={activeTab === "table" ? "active" : ""}
        onClick={() => setActiveTab("table")}
      >
        Recovery Table
      </li>

      <li
        className={activeTab === "logs" ? "active" : ""}
        onClick={() => setActiveTab("logs")}
      >
        Activity Log
      </li>
    </ul>
  </div>
</div>
            </div>
          )}

          <div className="main-content">

            {data.length === 0 && view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Recoveries Yet</p>
                  <span>
                    A recovery record will appear here automatically after a
                    sale payment.
                  </span>
                </div>
              </div>
            )}

{view === "table" && activeTab === "table" && (
  <RecoveryTable
    data={enrichedRecoveries}
    pagination={pagination}
    onPageChange={handlePageChange}
    onDelete={handleDeleteData}
    onUpdate={handleUpdateRecovery}
    handleRowClick={handleRowClick}
  />
)}
{(view === "table" || view === "empty") && activeTab === "logs" && (
  <RecoveryLog
  />
)}
            {view === "create" && (
              <CreateRecovery
                SalesData={sales}
                data={data}
                setData={setData}
                setView={setView}
                onCreate={handleAddData}
              />
            )}
            {view === "drilldown" && (
              <DrillDownRecovery
                 data={selectedRecovery}
                 goBack={() => setView("table")}
                onUpdate={handleUpdateRecovery}
               />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryController;