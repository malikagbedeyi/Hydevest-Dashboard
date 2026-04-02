import React, { useMemo, useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import "../../../../assets/Styles/dashboard/table.scss";
import ContainerProfitTable from "./ContainerProfitTable";
import ContainerProfitDrilldown from "./ContainerProfitDrilldown";
import { ContainerServices } from "../../../../services/Trip/container";
import { ExpenseServices } from "../../../../services/Trip/expense";
import { PresaleServices } from "../../../../services/Sale/presale";
import { SaleServices } from "../../../../services/Sale/sale";
import { calculateWeightedRate, calculateOverheadShare } from "../../../../utils/financeMath"; 

const ContainerProfitController = ({ goBack }) => {
  const [containers, setContainers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [presales, setPresales] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  /* ================= 1. RECURSIVE FETCH ================= */
  const fetchAllData = async (service, params = {}) => {
    let allRecords = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const res = await service.list({ ...params, page, per_page: 100 });
        const records = res?.data?.record?.data || res?.data?.data || [];
        allRecords = [...allRecords, ...records];
        const lastPage = res?.data?.record?.last_page || 1;
        if (page >= lastPage || records.length === 0) hasMore = false;
        else page++;
      } catch (err) {
        console.error("Fetch Loop Error:", err);
        hasMore = false;
      }
    }
    return allRecords;
  };

  const fetchData = async () => {
    if (containers.length > 0) return; 
    
    setLoading(true);
    try {
      const [contData, preData, saleData] = await Promise.all([
        fetchAllData(ContainerServices),
        fetchAllData(PresaleServices),
        fetchAllData(SaleServices)
      ]);

      setContainers(contData);
      setPresales(preData);
      setSales(saleData);

      const tripUuids = [...new Set(contData.map(c => c.trip?.trip_uuid).filter(Boolean))];
      const expResults = await Promise.all(
        tripUuids.map(uuid => fetchAllData(ExpenseServices, { trip_uuid: uuid }))
      );
      setExpenses(expResults.flat());
    } catch (err) {
      console.error("Critical error in Profit Report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     fetchData(); 
  }, []);

  /* ================= 2. CALCULATION LOGIC ================= */
  const profitReportData = useMemo(() => {
    if (!containers.length) return [];

    // First, filter based on criteria (Date and Presale existence)
    return containers
      .filter((container) => {
        if (dateRange.from || dateRange.to) {
          const tripEndDateStr = container.trip?.end_date;
          if (!tripEndDateStr) return false;
          const tripEndDate = new Date(tripEndDateStr);
          if (dateRange.from && tripEndDate < new Date(dateRange.from)) return false;
          if (dateRange.to && tripEndDate > new Date(dateRange.to)) return false;
        }
        return presales.some(p => p.container_one_id === container.id || p.container_two_id === container.id);
      })
      .map((container) => {
        const presale = presales.find(p => p.container_one_id === container.id || p.container_two_id === container.id);
        const tripUuid = container.trip?.trip_uuid;
        const tripId = container.trip_id;


        const tripExps = expenses.filter(e => 
          (tripUuid && e.trip_uuid === tripUuid) || (tripId && Number(e.trip_id) === Number(tripId))
        );
        
        const tripContainersCount = containers.filter(c => Number(c.trip_id) === Number(tripId)).length;

        const fxRate = calculateWeightedRate(tripExps);
        const overheadShare = calculateOverheadShare(tripExps, tripContainersCount);

        const pieces = Number(container.pieces || 0);
        const unitPrice = Number(container.unit_price_usd || 0);
        const shipping = Number(container.shipping_amount_usd || 0);
const surcharge =
  container.funding?.toLowerCase() === "partner"
    ? Number(container.surcharge_ngn || 0)
    : 0;
        
        // Exact Math formula used in TripDetails
        const amountUSD = (unitPrice * pieces) + shipping;
        const landingCost = (amountUSD * fxRate) + surcharge + overheadShare;

        const expectedRevenue = Number(presale?.expected_sales_revenue || 0);
        const actualSalesForContainer = sales.filter(s => Number(s.container_id) === Number(container.id));
        const actualRevenue = actualSalesForContainer.reduce((sum, s) => sum + Number(s.total_sale_amount || 0), 0);

        return {
          ...container,
          landingCost: landingCost || 0,
          expectedRevenue,
          actualRevenue,
          expectedProfit: expectedRevenue - landingCost,
          actualProfit: actualRevenue - landingCost,
          presaleRecord: presale,
          saleRecords: actualSalesForContainer
        };
      });
  }, [containers, expenses, presales, sales, dateRange]);

  const masterMetrics = useMemo(() => {
    return profitReportData.reduce((acc, curr) => ({
      landing: acc.landing + (curr.landingCost || 0),
      expRev: acc.expRev + (curr.expectedRevenue || 0),
      expProf: acc.expProf + (curr.expectedProfit || 0),
      actRev: acc.actRev + (curr.actualRevenue || 0),
      actProf: acc.actProf + (curr.actualProfit || 0),
    }), { landing: 0, expRev: 0, expProf: 0, actRev: 0, actProf: 0 });
  }, [profitReportData]);

  const formatMoney = (val) => "₦" + Number(val || 0).toLocaleString("en-NG", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });

  /* ================= 3. RENDER LOGIC ================= */
  // Move selectedItem check above loading to prevent UI resets
  if (selectedItem) {
    return (
      <div className="drilldown">
        <ContainerProfitDrilldown 
          data={selectedItem} 
          goBack={() => setSelectedItem(null)} 
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="drilldown" style={{ textAlign: 'center', padding: '10vw' }}>
        <h2 style={{ color: '#581aae' }}>Aggregating Live Data...</h2>
      </div>
    );
  }

  return (
    <div className="drilldown">
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
        onRowClick={(row) => setSelectedItem(row)} 
        goBack={goBack} 
        dateRange={dateRange}
        setDateRange={setDateRange} 
      />
    </div>
  );
};

export default ContainerProfitController;