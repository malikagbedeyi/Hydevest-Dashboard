import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";
import CreateSale from "./CreateSale";
import SaleTable from "./SaleTable";
import DrilldownSale from "./DrildownSale";
import { SaleServices } from "../../../../services/Sale/sale";
import SaleLog from "./SaleLog";
import { useOutletContext } from "react-router-dom";

const SaleController = () => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [view, setView] = useState("empty");
  const [loading, setLoading] = useState(false);
   const [activeTab, setActiveTab] = useState("table");
 const [containerPreSales, setContainerPreSales] = useState([]);
const [page, setPage] = useState(1);
const { autoOpenCreate, setAutoOpenCreate } = useOutletContext();

useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false); 
    }
  }, [autoOpenCreate])

const [pagination, setPagination] = useState({
  currentPage: 1,
  lastPage: 1,
  total: 0
});
const [search, setSearch] = useState("");
const [searchField, setSearchField] = useState("all");
const [openFieldSelect, setOpenFieldSelect] = useState(false);

const [showFilters, setShowFilters] = useState(false);
const [openPaymentStatusSelect, setOpenPaymentStatusSelect] = useState(false);

const [filters, setFilters] = useState({
  sale_unique_id: "",
  sale_uuid: "",
  container_uuid: "",
  pre_sale_uuid: "",
  customer_uuid: "",
  payment_status: "",
  date_created: "",
  from_date: "",
  to_date: ""
});
const logFields = ["all", "Sale ID", "Entity", "Performed By"];
const saleFields = ["all", "Sale ID", "Tracking Number", "Payment Status"];
const activeFields = activeTab === "table" ? saleFields : logFields;

// 2. Reset search when tab changes
useEffect(() => {
  setSearchField("all");
  setSearch("");
}, [activeTab]);

  /* ===================== FETCH SALES ===================== */
const fetchSales = async (pageNum = page) => {
  setLoading(true);

  try {
   const res = await SaleServices.list({
  ...filters,
  page: pageNum
});

    const record = res?.data?.record;

    const records = record?.data || [];

    setSales(records);

    setPagination({
      currentPage: record?.current_page ?? 1,
      lastPage: record?.last_page ?? 1,
      total: record?.total ?? 0
    });

setView((prevView) => {
      if (prevView === "create") return "create"; 
      return records.length ? "table" : "empty";
    });

  } catch (err) {
    console.error("Failed to load sales", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const timer = setTimeout(() => {
    fetchSales(page);
  }, 400);

  return () => clearTimeout(timer);
}, [page, filters]);

  /* ===================== CREATE SALE ===================== */
const handleAddSale = async (payload) => {
  try {
    const response = await SaleServices.create(payload);

    // Reload the sales silently
    await fetchSales();

    return response?.data?.message || "Sale created successfully!";
  } catch (err) {
    console.error("Create sale failed", err);
    throw err;
  }
};

  /* ===================== DELETE SALE ===================== */
 const handleDeleteSale = async (sale_uuid) => {
  try {
    const res = await SaleServices.delete(sale_uuid);
    await fetchSales();
  } catch (err) {
    if (err.response) {
      console.error("Delete sale failed:", err.response.data); // 🔹 backend message
    } else {
      console.error("Delete sale failed:", err.message);
    }
  }
};
const fetchContainerPreSales = async () => {
  try {
    const res = await SaleServices.containerPreSales({});
    // The response you shared already has container + presale
    const data = res?.data?.record || [];
    setContainerPreSales(data);
  } catch (err) {
    console.error("Failed to load container pre-sales", err);
  }
};

const normalizedContainers = containerPreSales.map(item => ({
  id: item.id, // use numeric ID
  container_uuid: item.container_uuid, // keep UUID separate
  name: item.title,
  trackingNumber: item.tracking_number,
}));

const normalizedPreSales = containerPreSales
  .filter(item => item.presale)
  .map(item => ({
    id: item.presale.id,
    container_id: item.id, // matches normalizedContainers.id
    pre_sale_unique_id: item.presale.pre_sale_unique_id,
    pre_sale_uuid: item.presale.pre_sale_uuid,
    sale_option: item.presale.sale_option,
    wc_pieces: item.presale.wc_pieces,
    total_no_of_pallets: item.presale.total_no_of_pallets,
    expected_sales_revenue: item.presale.expected_sales_revenue,
    status: item.presale.status,
    pricePerPic: item.presale.price_per_piece,
  }));

useEffect(() => {
  fetchContainerPreSales();
}, []);


/* ===================== FETCH SALE DETAILS ===================== */
const fetchSaleDetails = async (sale_uuid, saleMasterData) => {
  setLoading(true);

  try {
    const res = await SaleServices.details({ sale_uuid });
    const saleRecords = res?.data?.record || [];


    if (!saleRecords.length) {
      setSelectedSale(null);
      setView("table");
      return;
    }

    const saleMaster = saleMasterData;

    /* ================= GROUP CONTAINERS ================= */

    const containersMap = {};

   saleRecords.forEach((rec) => {
  const containerId = rec.container_id;

  // Initialize container only if it doesn't exist
  if (!containersMap[containerId]) {
    const containerMeta = containerPreSales.find(c => c.id === containerId);
    containersMap[containerId] = {
      containerId,
      name: containerMeta?.title || containerMeta?.name || "Unknown Container",
      trackingNumber: containerMeta?.tracking_number || "",
      pallets: [],
    };
  }

  // Push the pallet into the existing container
  containersMap[containerId].pallets.push({
    id: rec.sale_detail_uuid,
    palletId: rec.pallet_id,
    purchase_price: Number(rec.purchase_price) || 0,
    pallet_purchased: Number(rec.pallet_purchased) || 0,
    pallet_pieces: Number(rec.pallet?.pallet_pieces) || 0,
    sale_amount: Number(rec.sale_amount) || 0,
    created_at: rec.created_at,
  });
});

    /* ================= COUNT PALLETS ================= */

    const totalPalletsCount = saleRecords.reduce(
      (sum, rec) => sum + (Number(rec.pallet_purchased) || 0),
      0
    );

    /* ================= CUSTOMER ================= */

    const customer = saleMaster.customer
      ? {
          name: `${saleMaster.customer.firstname || saleMaster.customer.first_name || ""} ${saleMaster.customer.lastname || saleMaster.customer.last_name || ""}`,
          phone: saleMaster.customer.phone_no || "",
          location: saleMaster.customer.address || "N/A",
        }
      : {
          name: "N/A",
          phone: "N/A",
          location: "N/A",
        };

    /* ================= TOTALS ================= */

    const totalSaleAmount =
      saleMaster.total_sale_amount ??
      saleRecords.reduce(
        (sum, r) => sum + Number(r.sale_amount || 0),
        0
      );

    const amountPaid =
      Number(saleMaster.amount_paid) ||
      Number(saleMaster.sale_payments?.[0]?.amount) ||
      0;

    const balance = Math.max(totalSaleAmount - amountPaid, 0);

const paymentStatus =
  amountPaid >= totalSaleAmount ? "Fully Paid" : "Outstanding";

    const discount = Number(saleMaster.discount) || 0

const container = saleMaster.container?.title || "—"

    /* ================= FINAL DATA ================= */

    setSelectedSale({
      sale_uuid: saleMaster.sale_uuid,
      containers: Object.values(containersMap),
      customer,
      amountPaid,
      totalSaleAmount,
      discount,
      balance,
      paymentStatus,
      noOfPallets: totalPalletsCount,
    });

    setView("drilldown");

  } catch (err) {
    console.error("Failed to load sale details", err);
  } finally {
    setLoading(false);
  }
};

const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearch(value);

  setFilters((prev) => {
    const updated = { ...prev };

    if (activeTab === "table") {
      updated.sale_unique_id = "";
      updated.container_uuid = "";
      updated.payment_status = "";

      if (searchField === "all") {
        updated.sale_unique_id = value;
      } else if (searchField === "tracking_number") {
        const match = containerPreSales.find(c => 
          c.tracking_number?.toLowerCase().includes(value.toLowerCase())
        );
        updated.container_uuid = match ? match.container_uuid : value;
      } else {
        updated[searchField] = value;
      }
    } else {
      updated.entity_id = (searchField === "all" || searchField === "Sale ID") ? value : "";
      updated.user_name = (searchField === "all" || searchField === "Performed By") ? value : "";
    }
    return updated;
  });
};

  /* ===================== DRILLDOWN ===================== */
const handleRowClick = (sale) => {
  if (!sale?.sale_uuid) return;
  fetchSaleDetails(sale.sale_uuid, sale);
};

 
  const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(value || 0);

const totalSale = sales.length;

const totalContainer = new Set(
  sales.map((rec) => rec.container?.title)
).size;

const totalRecoveryAmount = sales.reduce(
  (sum, rec) => sum + Number(rec.amount_paid || 0),
  0
);
const totalSaleAmount= sales.reduce(
  (sum, rec) => sum + Number(rec.total_sale_amount || 0),
  0
);
const totalBalance= sales.reduce(
  (sum, rec) => sum + Number(rec.total_sale_amount - rec.amount_paid || 0),
  0
);

  return (
    <div className="controller">
      <div className="controller-container">
        <div className="controller-content">

          {(view === "empty" || view === "table") && (
            <div className="top-content">
                <div className="drill-summary-grid mb-5">
          <div className="drill-summary">
            <div className="summary-item">
              <p className="small"> sale Record</p>
              <h2>{totalSale}</h2>
            </div>
            <div className="summary-item">
              <p className="small">Total Sale Amount (₦)</p>
              <h2>{formatCurrency(totalSaleAmount)}</h2>
            </div>

            <div className="summary-item">
              <p className="small">Total Recovery Amount (₦)</p>
              <h2>{formatCurrency(totalRecoveryAmount)}</h2>
            </div>
            <div className="summary-item">
              <p className="small">Outstanding Balance (₦)</p>
              <h2>{formatCurrency(totalBalance)}</h2>
            </div>
<div className="summary-item">
              <p className="small">Total Container</p>
              <h2>{totalContainer}</h2>
            </div>
          </div>
        </div>
              <div className="top-content-wrapper">
                <div className="left-wrapper" />

                <div className="right-wrapper">
                  <div className="right-wrapper-input">
                    <Search className="input-icon" />
      <input
  placeholder={`Search by ${searchField === 'all' ? 'All Fields' : searchField.replace("_", " ")}...`}
  value={search}
  onChange={handleSearchChange}
/>
                  </div>

                  <div className="select-input">
                    <div className="filter"onClick={() => setShowFilters(!showFilters)}>
                      <span>Add Filter</span>
                      <Filter />
                    </div>
                  </div>

<div className="select-input">
  <div className="select-input-field">

    <div
      className="custom-select-drop"
      onClick={() => setOpenFieldSelect(!openFieldSelect)}
    >
      <div className="select-box">
        <span>
          {searchField === "all"
            ? "All Field"
            : searchField.replace("_", " ")}
        </span>
      </div>

      <ChevronDown className={openFieldSelect ? "up" : "down"} />
    </div>

   {openFieldSelect && (
  <div className="custom-select-dropdown">
    {activeFields.map((field) => (
      <div
        key={field}
        className="option-item"
        onClick={() => {
          setSearchField(field);
          setOpenFieldSelect(false);
        }}
      >
        {field === "all" ? "All Field" : field.replace("_", " ").toUpperCase()}
      </div>
    ))}
  </div>
)}

  </div>
</div>

                  {/* <div className="import-input"><p>Import</p></div> */}
                  {/* <div className="import-input"><p>Export</p></div> */}
                  <button onClick={() => setView("create")}>
                    Record Sale
                  </button>
                </div>
              </div>
              {showFilters && (
  <div className="filters-panel">
{activeTab !== "logs" && (
    <div className="filter-item">
      <div   className="custom-select-drop"
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
    )}

    {/* FROM DATE */}
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

    {/* TO DATE */}
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

  </div>
)}
                     <div className="log-tab-section">
  <div className="tab-content">
    <ul>
      <li
        className={activeTab === "table" ? "active" : ""}
        onClick={() => setActiveTab("table")}
      >
        Sale Table
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
            {view === "empty" && !loading && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No sale Created Yet</p>
                  <span>A sale created would be saved here automatically</span>
                </div>
              </div>
            )}

            {view === "table" && !loading && activeTab === "table" && (
<SaleTable
  sales={sales}
  page={pagination.currentPage}
  lastPage={pagination.lastPage}
  setPage={setPage}
  onDelete={handleDeleteSale}
  handleRowClick={handleRowClick}
/>
            )}
{activeTab === "logs" && (
  <SaleLog filters={filters} search={search} />
)}
            {view === "create" && (
             <CreateSale
             setView={setView}
             onCreate={handleAddSale}
             sales={sales}
             preSales={normalizedPreSales}
             containersData={normalizedContainers}/>          
            )}
           {view === "drilldown" && selectedSale && !loading &&  (
<DrilldownSale 
  data={selectedSale}
  sales={selectedSale}
  goBack={() => setView("table")}
   preSales={normalizedPreSales}
  onUpdate={async () => {
    await fetchSales();
    setView("table");
  }}
/>
)}

          </div>
        </div>
      </div>
    </div>
  );
};
//
export default SaleController;
