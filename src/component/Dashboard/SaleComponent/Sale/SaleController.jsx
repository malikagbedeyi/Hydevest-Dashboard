import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";
import CreateSale from "./CreateSale";
import SaleTable from "./SaleTable";
import DrilldownSale from "./DrildownSale";
import { SaleServices } from "../../../../services/Sale/sale";

const SaleController = ({ openSubmenu, autoOpenCreate, setAutoOpenCreate }) => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [view, setView] = useState("empty");
  const [loading, setLoading] = useState(false);
 const [containerPreSales, setContainerPreSales] = useState([]);
  /* ===================== FETCH SALES ===================== */
 const fetchSales = async () => {
  setLoading(true);
  try {
    const res = await SaleServices.list({});
    
    const records = res?.data?.record?.data || [];

    setSales(records);
    console.log("sale data", records);

    setView(records.length ? "table" : "empty");
  } catch (err) {
    console.error("Failed to load sales", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchSales();
  }, []);

  /* ===================== AUTO OPEN CREATE ===================== */
  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate, setAutoOpenCreate]);

  /* ===================== CREATE SALE ===================== */
const handleAddSale = async (payload) => {
  try {
    await SaleServices.create(payload);
    await fetchSales();
    setView("table");
  } catch (err) {
    console.error("Create sale failed");

    if (err.response) {
      console.error("Backend message:", err.response.data);
      console.error("Status:", err.response.status);
    } else {
      console.error(err.message);
    }
  }
};

  /* ===================== DELETE SALE ===================== */
  const handleDeleteSale = async (sale) => {
    try {
      await SaleServices.delete(sale.sale_uuid);
      await fetchSales();
    } catch (err) {
      console.error("Delete sale failed", err);
    }
  };
const fetchContainerPreSales = async () => {
  try {
    const res = await SaleServices.containerPreSales({});
    // The response you shared already has container + presale
    const data = res?.data?.record || [];
    console.log(" container + presale",res?.data?.record)
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
const fetchSaleDetails = async (sale_uuid) => {
  setLoading(true);
  try {
    const res = await SaleServices.details({ sale_uuid });
    const saleRecords = res?.data?.record || [];

    if (!saleRecords.length) {
      setSelectedSale(null);
      setView("table");
      return;
    }


    const saleInfo = saleRecords[0];


    const containersMap = {};
    saleRecords.forEach((rec) => {
      const containerId = rec.container_id;

      if (!containersMap[containerId]) {
        containersMap[containerId] = {
          containerId,
          name: rec.container?.name || rec.container?.title || `Container ${containerId}`,
          trackingNumber: rec.container?.tracking_number || "",
          pallets: [],
        };
      }

      if (rec.pallet) {
        containersMap[containerId].pallets.push({
          id: rec.pallet.id,
          palletId: rec.pallet.id,
          pieces: rec.pallet.pallet_pieces || rec.pallet_purchased || 0,
          saleAmount: rec.sale_amount || 0,
          palletOption: rec.price_diff ? 1 : 0,
          total:
            (rec.pallet.pallet_pieces || rec.pallet_purchased || 0) *
            (rec.sale_amount || 0),
        });
      }
    });

    const normalizedContainers = Object.values(containersMap);

    // Correct customer info
  const customer = saleInfo.customer
  ? {
      name: `${saleInfo.customer.first_name || saleInfo.customer.firstname || ""} ${saleInfo.customer.last_name || saleInfo.customer.lastname || ""}`,
      phone: saleInfo.customer.phone || saleInfo.customer.phone_no || "",
      location: saleInfo.customer.location || saleInfo.customer.address || "",
    }
  : { name: "N/A", phone: "N/A", location: "N/A" };
    // Correct amounts
    const amountPaid = saleInfo.amount_paid ?? saleInfo.amountPaid ?? 0;
    const totalSaleAmount = saleInfo.total_sale_amount || 0;
    const balance = Math.max(totalSaleAmount - amountPaid, 0);

    setSelectedSale({
      containers: normalizedContainers,
      customer,
      amountPaid,
      totalSaleAmount,
      balance,
      noOfPallets: normalizedContainers.reduce(
        (sum, c) => sum + c.pallets.reduce((s, p) => s + (p.pieces || 0), 0),
        0
      ),
    });

    setView("drilldown");
  } catch (err) {
    console.error("Failed to load sale details", err);
  } finally {
    setLoading(false);
  }
};
  /* ===================== DRILLDOWN ===================== */
const handleRowClick = (sale) => {
  if (!sale?.sale_uuid) return;
  fetchSaleDetails(sale.sale_uuid);
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

                  <div className="import-input"><p>Import</p></div>
                  <div className="import-input"><p>Export</p></div>

                  <button onClick={() => setView("create")}>
                    Record Sale
                  </button>
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

            {view === "table" && !loading && (
              <SaleTable
              sales={sales}
             onDelete={handleDeleteSale}
             handleRowClick={handleRowClick}
              />
            )}


            {view === "create" && (
             <CreateSale
             setView={setView}
             onCreate={handleAddSale}
             sales={sales}
             preSales={normalizedPreSales}
             containersData={normalizedContainers}/>          
            )}
           {view === "drilldown" && selectedSale && (
  <DrilldownSale 
    data={selectedSale} 
    goBack={() => setView("table")} 
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
