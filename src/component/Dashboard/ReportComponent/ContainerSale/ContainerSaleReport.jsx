import React, { useMemo, useState } from "react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import "../../../../assets/Styles/dashboard/table.scss";
import ContainerSaleTable from "./ContainerSaleTable";
import DrilldownContainerSale from "./DrilldownContainerSale";

const STORAGE_KEY = "sales_data";

const ContainerSaleReport = ({ goBack }) => {
  const [sales] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  });

  const [selectedContainer, setSelectedContainer] = useState(null);

  const containerReportData = useMemo(() => {
    const map = {};

    sales.forEach((sale) => {
      sale.containers?.forEach((container) => {
        const containerId = container.containerId;

        if (!map[containerId]) {
          map[containerId] = {
            containerId,
            containerName: container.name,
            trackingNumber: container.trackingNumber, // ✅ ADD THIS
            totalSaleAmount: 0,
            amountPaid: 0,
          };
        }
        
       
        const containerTotal = (container.pallets || []).reduce(
          (sum, p) => sum + (Number(p.total) || 0),
          0
        );
        

        map[containerId].totalSaleAmount += containerTotal;
      });

      const saleTotal = sale.totalSaleAmount || 1;

      sale.containers?.forEach((container) => {
        const containerTotal = container.pallets.reduce(
          (sum, p) => sum + (Number(p.total) || 0),
          0
        );

        const ratio = containerTotal / saleTotal;
        map[container.containerId].amountPaid +=
          ratio * (sale.amountPaid || 0);
      });
    });
   
    return Object.values(map).map((c) => ({
      ...c,
      balance: Math.max(c.totalSaleAmount - c.amountPaid, 0),
    }));
  }, [sales]);

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
      presales={JSON.parse(localStorage.getItem("presales_data")) || []}
      onRowClick={setSelectedContainer}
      goBack={goBack}
    />    
      )}

      {/* DRILLDOWN VIEW */}
      {selectedContainer && (
  <DrilldownContainerSale
    data={selectedContainer}
    goBack={() => setSelectedContainer(null)}
    sales={sales}   // ✅ ADD THIS
    presales={JSON.parse(localStorage.getItem("presales_data")) || []}
    recoveries={JSON.parse(localStorage.getItem("recovery_storage")) || []}
  />
)}

    </div>
  );
};

export default ContainerSaleReport;
