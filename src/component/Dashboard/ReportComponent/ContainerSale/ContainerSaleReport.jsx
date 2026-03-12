import React, { useMemo, useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import "../../../../assets/Styles/dashboard/table.scss";
import ContainerSaleTable from "./ContainerSaleTable";
import DrilldownContainerSale from "./DrilldownContainerSale";
import { SaleServices } from "../../../../services/Sale/sale";
import { RecoveryServices } from "../../../../services/Sale/recovery";
import { PresaleServices } from "../../../../services/Sale/presale";



const ContainerSaleReport = ({ goBack }) => {

  const [sales, setSales] = useState([]);
  const [recoveries, setRecoveries] = useState([]);
  const [presales, setPresales] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);
const [page, setPage] = useState(1);
const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1 });
  /* ================= FETCH DATA ================= */

const fetchSales = async (pageNum = 1) => {
  try {
    const res = await SaleServices.list({ page: pageNum });
    const record = res?.data?.record;
    
    setSales(record?.data || []); 
    setPagination({
      currentPage: record?.current_page || 1,
      lastPage: record?.last_page || 1
    });
  } catch (err) {
    console.error("Error fetching sales", err);
  }
};

  const fetchRecoveries = async () => {
    try {
      const res = await RecoveryServices.list();

      setRecoveries(res?.data?.record?.data || []);
      setPagination({
      currentPage: res?.data?.record?.current_page || 1,
      lastPage: res?.data?.record?.last_page || 1
    });
    } catch (err) {
      console.error("Error fetching recoveries", err);
    }
  };
const fetchPresales = async () => {
  try {
    const res = await PresaleServices.list();
    setPresales(res?.data?.record?.data || []);
    setPagination({
      currentPage: res?.data?.record?.current_page || 1,
      lastPage: res?.data?.record?.last_page || 1
    });
  } catch (err) {
    console.error("Error fetching presales", err);
  }
};
  useEffect(() => {
    fetchSales(page);
    fetchRecoveries(page);
    fetchPresales(page);
  }, [page]);

  /* ================= REPORT LOGIC ================= */

const containerReportData = useMemo(() => {
  const salesArray = Array.isArray(sales) ? sales : [];
  const recoveriesArray = Array.isArray(recoveries) ? recoveries : [];
  const presalesArray = Array.isArray(presales) ? presales : []; // Added this

  const map = {};

  // 1. Group Sales by Container
  salesArray.forEach((sale) => {
    const containerId = sale.container?.id;
    if (!containerId) return;

    if (!map[containerId]) {
      map[containerId] = {
        containerId,
        containerName: sale.container?.title || "Unknown",
        trackingNumber: sale.container?.tracking_number || "N/A",
        PaymentStatus: sale.payment_status || "Part Payment",
        totalSaleAmount: 0,
        amountPaid: 0,
        expectedPresaleAmount: 0 
      };
    }
    map[containerId].totalSaleAmount += Number(sale.total_sale_amount || 0);
  });

  recoveriesArray.forEach((recovery) => {
    const containerId = recovery.container_id;
    if (map[containerId]) {
      map[containerId].amountPaid += Number(recovery.amount || 0);
    }
  });

  presalesArray.forEach((presale) => {

    const c1 = presale.container_one_id;
    const c2 = presale.container_two_id;

    if (map[c1]) map[c1].expectedPresaleAmount += Number(presale.expected_sales_revenue || 0);
    if (c2 && map[c2]) map[c2].expectedPresaleAmount += Number(presale.expected_sales_revenue || 0);
  });

  return Object.values(map).map((c) => ({
    ...c,
    balance: Math.max(c.totalSaleAmount - c.amountPaid, 0),
  }));
}, [sales, recoveries, presales]);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  };

  return (
    <div className="drilldown">

      {/* HEADER */}

      <div className="section-report-head">
        <h3>
          {selectedContainer
            ? `ContainerName: ${selectedContainer.containerName}`
            : "Container Sale Report"}
        </h3>
      </div>

      {/* TABLE VIEW */}

      {!selectedContainer && (
        <ContainerSaleTable
          containerReportData={containerReportData}
          presales={presales}
          onRowClick={setSelectedContainer}
          goBack={goBack}
          formatDate={formatDate}
          currentPage={pagination.currentPage} 
          lastPage={pagination.lastPage}     
          setPage={setPage}
        />
      )}

      {/* DRILLDOWN VIEW */}

      {selectedContainer && (
        <DrilldownContainerSale
          data={selectedContainer}
          goBack={() => setSelectedContainer(null)}
          sales={sales}
          presales={presales}
          recoveries={recoveries}
          formatDate={formatDate}
        />
      )}

    </div>
  );
};

export default ContainerSaleReport;