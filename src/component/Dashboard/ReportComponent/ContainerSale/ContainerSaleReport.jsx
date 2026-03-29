import React, { useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import "../../../../assets/Styles/dashboard/table.scss";
import ContainerSaleTable from "./ContainerSaleTable";
import DrilldownContainerSale from "./DrilldownContainerSale";
import { SaleServices } from "../../../../services/Sale/sale";
import { RecoveryServices } from "../../../../services/Sale/recovery";
import { PresaleServices } from "../../../../services/Sale/presale";

const ContainerSaleReport = ({ goBack }) => {
  const [containerReportData, setContainerReportData] = useState([]);
  const [presales, setPresales] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [page, setPage] = useState(1);

  /* ================= FETCH PRESALES ================= */
  const fetchPresales = async () => {
    try {
      const res = await PresaleServices.list();
      setPresales(res?.data?.record?.data || []);
    } catch (err) {
      console.error("Error fetching presales", err);
    }
  };

  /* ================= FETCH CONTAINER REPORT ================= */
  const fetchContainerReport = async (pageNum = 1) => {
    try {
      const res = await SaleServices.list({ page: pageNum, per_page: 10 });
      const record = res?.data?.record;
      const salesArray = record?.data || [];
      const map = {};

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
            SamountPaid: 0,
            expectedPresaleAmount: 0,
            createdAt: sale.created_at,
          };
        }

        map[containerId].totalSaleAmount += Number(sale.total_sale_amount || 0);
        map[containerId].SamountPaid += Number(sale.amount_paid || 0);
      });

      presales.forEach((presale) => {
        const c1 = presale.container_one_id;
        const c2 = presale.container_two_id;
        if (map[c1]) map[c1].expectedPresaleAmount += Number(presale.expected_sales_revenue || 0);
        if (c2 && map[c2]) map[c2].expectedPresaleAmount += Number(presale.expected_sales_revenue || 0);
      });

      setContainerReportData({
        data: Object.values(map).map((c) => ({
          ...c,
          balance: Math.max(c.totalSaleAmount - c.SamountPaid, 0),
        })),
        currentPage: record?.current_page || 1,
        lastPage: record?.last_page || 1,
      });
    } catch (err) {
      console.error("Error fetching container report", err);
    }
  };

  useEffect(() => {
    fetchPresales();
    fetchContainerReport(page);
  }, [page]);

  /* ================= FETCH ALL DRILLDOWN DATA ================= */
  const handleRowClick = async (container) => {
    try {
      let allSales = [];
      let currentPage = 1;
      let lastPage = 1;

      do {
        const res = await SaleServices.list({ container_id: container.containerId, page: currentPage });
        const record = res?.data?.record;
        allSales = [...allSales, ...(record?.data || [])];
        lastPage = record?.last_page || 1;
        currentPage++;
      } while (currentPage <= lastPage);


      const recoveryRes = await RecoveryServices.list({ container_id: container.containerId });
      const allRecoveries = recoveryRes?.data?.record?.data || [];

      setSelectedContainer({
        ...container,
        sales: allSales,
        recoveries: allRecoveries,
      });
    } catch (err) {
      console.error("Error fetching drilldown data", err);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date)
      .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      .replace(/ /g, "-");
  };

  return (
    <div className="drilldown">
      {/* HEADER */}
      <div className="section-report-head">
        <h3>
          {selectedContainer
            ? `Tracking Number:TRN-${selectedContainer.trackingNumber}`
            : "Container Sale Report"}
        </h3>
      </div>

      {/* TABLE VIEW */}
      {!selectedContainer && (
        <ContainerSaleTable
          containerReportData={containerReportData.data || []}
          presales={presales}
          onRowClick={handleRowClick}
          goBack={goBack}
          formatDate={formatDate}
          currentPage={containerReportData.currentPage || 1}
          lastPage={containerReportData.lastPage || 1}
          setPage={setPage}
        />
      )}

      {/* DRILLDOWN VIEW */}
      {selectedContainer && (
        <DrilldownContainerSale
          data={selectedContainer}
          goBack={() => setSelectedContainer(null)}
          sales={selectedContainer.sales || []}
          presales={presales}
          recoveries={selectedContainer.recoveries || []}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default ContainerSaleReport;