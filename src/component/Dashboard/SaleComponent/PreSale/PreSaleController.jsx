import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";

import CreatePreSale from "./CreatePreSale";
import PreSaleTable from "./PreSaleTable";
import DrilldownPresale from "./DrilldownPresale";
import PresaleLog from "./PresaleLog";

import { PresaleServices } from "../../../../services/Sale/presale";
import { SaleServices } from "../../../../services/Sale/sale";

const PreSaleController = ({ openSubmenu }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [datas, setDatas] = useState([]);
  const [containers, setContainers] = useState([]);

  const [view, setView] = useState("table"); // table | create | edit
  const [activeTab, setActiveTab] = useState("table"); // table | logs

  const [editingSale, setEditingSale] = useState(null);
  const [page, setPage] = useState(1);
const [loadingTable, setLoadingTable] = useState(false);
 /* ================= FETCH SALE CONTAINERS ================= */
useEffect(() => {
  const fetchContainers = async () => {
    try {
      // Use Sale container list endpoint instead of presale
      const res = await PresaleServices.containerList({});
      setContainers(res.data?.record ?? []);
    } catch (err) {
      console.error("Failed to fetch sale containers:", err);
      setContainers([]);
    }
  };

  fetchContainers();
}, []);

  /* ================= FETCH PRESALES ================= */
  const fetchPreSales = async (pageNum = page) => {
  setLoadingTable(true);
  try {
    const res = await PresaleServices.list({
      page: pageNum,
      search: searchTerm || undefined,
    });
    setDatas(res.data?.record?.data ?? []);
  } catch (err) {
    console.error(err);
    setDatas([]);
  } finally {
    setLoadingTable(false);
  }
};

  useEffect(() => {
    fetchPreSales(page);
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPreSales(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* ================= EDIT VIEW ================= */
  if (view === "edit" && editingSale) {
    return (
<DrilldownPresale
  data={editingSale}
  goBack={() => {
    setView("table");
    fetchPreSales(page); // <-- REFRESH THE TABLE DATA
  }}
  onUpdate={(updatedRecord, navigate = true) => {
    setDatas(prev =>
      prev.map(d =>
        d.pre_sale_uuid === updatedRecord.pre_sale_uuid
          ? updatedRecord
          : d
      )
    );
  }}
/>
    );
  }

  /* ================= CREATE VIEW ================= */
  if (view === "create") {
    return (
      <CreatePreSale
        containersData={containers}
        users={datas}
        setUsers={setDatas}
        setView={setView}
        openSubmenu={openSubmenu}
      />
    );
  }

  /* ================= MAIN CONTROLLER ================= */
  return (
    <div className="controller">
      <div className="controller-container">
        <div className="controller-content">

          {/* ===== TOP BAR ===== */}
          <div className="top-content">
            <div className="top-content-wrapper">
              <div className="left-wrapper" />

              <div className="right-wrapper">
                <div className="right-wrapper-input">
                  <Search className="input-icon" />
                  <input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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

                <button onClick={() => setView("create")}>
                  Create Pre-Sale
                </button>
              </div>
            </div>

            {/* ===== TABS ===== */}
            <div className="log-tab-section">
              <div className="tab-content">
                <ul>
                  <li
                    className={activeTab === "table" ? "active" : ""}
                    onClick={() => setActiveTab("table")}
                  >
                    Pre-Sale Table
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

          {/* ===== MAIN CONTENT ===== */}
          <div className="main-content">
                 {datas.length === 0 && view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Pre-sale Created Yet</p>
                  <span>A Pre-sale created would be saved here automatically</span>
                </div>
              </div>
            )}
            {activeTab === "table" && (
              <PreSaleTable
                preSales={datas}
                page={page}
                setPage={setPage}
                onEdit={(sale) => {
                  setEditingSale(sale);
                  setView("edit");
                }}
              />
            )}

            {activeTab === "logs" && (
              <PresaleLog  preSaleUuid={editingSale?.pre_sale_uuid}/>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PreSaleController;