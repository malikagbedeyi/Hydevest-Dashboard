import React, { useMemo, useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import "../../../../assets/Styles/dashboard/table.scss";
import ContainerProfitTable from "./ContainerProfitTable";
import ContainerProfitDrilldown from "./ContainerProfitDrilldown";
import { ContainerServices } from "../../../../services/Trip/container";
import { ExpenseServices } from "../../../../services/Trip/expense";
import { PresaleServices } from "../../../../services/Sale/presale";
import { SaleServices } from "../../../../services/Sale/sale";

const ContainerProfitController = ({ goBack }) => {
  const [containers, setContainers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [presales, setPresales] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // ✅ 1. Added Date Filter State
  const [dateRange, setDateRange] = useState({
    from: "",
    to: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contRes, preRes, saleRes] = await Promise.all([
        ContainerServices.list({ page: 1 }),
        PresaleServices.list({ page: 1 }),
        SaleServices.list({ page: 1 })
      ]);

      const contData = contRes?.data?.record?.data || [];
      setPresales(preRes?.data?.record?.data || []);
      setSales(saleRes?.data?.record?.data || []);

      const tripUuids = [...new Set(contData.map(c => c.trip?.trip_uuid).filter(Boolean))];
      const expPromises = tripUuids.map(uuid => 
        ExpenseServices.list({ trip_uuid: uuid }).then(res => res.data?.record?.data || [])
      );
      const allExps = await Promise.all(expPromises);
      setExpenses(allExps.flat());
      setContainers(contData);
    } catch (err) {
      console.error("Error fetching profit data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* ================= PROFIT AGGREGATION LOGIC ================= */
  const profitReportData = useMemo(() => {
    let data = containers;

    if (dateRange.from || dateRange.to) {
      data = containers.filter(container => {
        const tripEndDate = new Date(container.trip?.end_date);
        const fromDate = dateRange.from ? new Date(dateRange.from) : null;
        const toDate = dateRange.to ? new Date(dateRange.to) : null;

        if (fromDate && tripEndDate < fromDate) return false;
        if (toDate && tripEndDate > toDate) return false;
        return true;
      });
    }

    return data.map((container) => {
      const tripUuid = container.trip?.trip_uuid;
      
      const tripExps = expenses.filter(e => e.trip_uuid === tripUuid || Number(e.trip_id) === Number(container.trip_id));
      const tripContainersCount = containers.filter(c => c.trip_id === container.trip_id).length;

      const finance = tripExps.reduce((acc, item) => {
        if (Number(item.is_container_payment) === 1) {
          acc.purchaseNgn += Number(item.total_amount || 0);
          acc.purchaseUsd += Number(item.amount || 0);
        } else {
          acc.generalOverhead += Number(item.total_amount || 0);
        }
        return acc;
      }, { purchaseNgn: 0, purchaseUsd: 0, generalOverhead: 0 });

      const fxRate = finance.purchaseUsd > 0 ? finance.purchaseNgn / finance.purchaseUsd : 0;
      const overheadShare = tripContainersCount > 0 ? finance.generalOverhead / tripContainersCount : 0;

      const amountUSD = (Number(container.unit_price_usd || 0) * Number(container.pieces || 0)) + Number(container.shipping_amount_usd || 0);
      const surcharge = container.funding?.toLowerCase() === "partner" ? Number(container.surcharge_ngn || 0) : 0;
      const landingCost = (amountUSD * fxRate) + surcharge + overheadShare;

      const presale = presales.find(p => p.container_one_id === container.id || p.container_two_id === container.id);
      const expectedRevenue = Number(presale?.expected_sales_revenue || 0);

      const actualSales = sales.filter(s => s.container_id === container.id);
      const actualRevenue = actualSales.reduce((sum, s) => sum + Number(s.total_sale_amount || 0), 0);

      return {
        ...container,
        landingCost,
        expectedRevenue,
        expectedProfit: landingCost -  expectedRevenue ,
        actualRevenue,
        actualProfit: landingCost -  actualRevenue ,
        presaleRecord: presale,
        saleRecords: actualSales
      };
    });
  }, [containers, expenses, presales, sales, dateRange]); 


  const masterMetrics = useMemo(() => {
    return profitReportData.reduce((acc, curr) => ({
      landing: acc.landing + curr.landingCost,
      expRev: acc.expRev + curr.expectedRevenue,
      expProf: acc.expProf + curr.expectedProfit,
      actRev: acc.actRev + curr.actualRevenue,
      actProf: acc.actProf + curr.actualProfit,
    }), { landing: 0, expRev: 0, expProf: 0, actRev: 0, actProf: 0 });
  }, [profitReportData]);

  const formatMoney = (val) => "₦" + Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 });
  
  if(profitReportData?.sales_status === null ) {
    masterMetrics.actProf = 0
  }


  return (
    <div className="drilldown">
      {!selectedItem ? (
        <>
          <div className="section-report-head"><h3>Container Profit Report</h3></div>
          <div className="drill-summary-grid">
            <div className="drill-summary">
              <div className="summary-item"><p className="small">Total Landing Cost</p><h2>{formatMoney(masterMetrics.landing)}</h2></div>
              <div className="summary-item"><p className="small">Total Expected Revenue</p><h2>{formatMoney(masterMetrics.expRev)}</h2></div>
              <div className="summary-item"><p className="small">Total Expected Profit</p><h2 style={{color: masterMetrics.expProf >= 0 ? 'green' : 'red'}}>{formatMoney(masterMetrics.expProf)}</h2></div>
              <div className="summary-item"><p className="small">Actual Revenue</p><h2>{formatMoney(masterMetrics.actRev)}</h2></div>
              <div className="summary-item"><p className="small">Actual Profit</p><h2 style={{color: masterMetrics.actProf >= 0 ? 'green' : 'red'}}>{formatMoney(masterMetrics.actProf)}</h2></div>
            </div>
          </div>
          
          <ContainerProfitTable 
            data={profitReportData} 
            onRowClick={setSelectedItem} 
            goBack={goBack} 
            dateRange={dateRange}
            setDateRange={setDateRange} 
          />
        </>
      ) : (
        <ContainerProfitDrilldown data={selectedItem} goBack={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default ContainerProfitController;