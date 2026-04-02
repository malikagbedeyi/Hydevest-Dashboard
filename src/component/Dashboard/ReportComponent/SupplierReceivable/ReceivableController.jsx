import React, { useMemo, useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import "../../../../assets/Styles/dashboard/table.scss";
import ReceivableTable from "./ReceivableTable";
import ReceivableDrilldowm from "./ReceivableDrilldowm";
import { PresaleServices } from "../../../../services/Sale/presale";

const ReceivableController = ({ goBack }) => {
  const [presales, setPresales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  /* ================= FETCH DATA (AGGRESSIVE BYPASS) ================= */
  const fetchAggressively = async () => {
    setLoading(true);
    let allData = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        const res = await PresaleServices.list({ page, per_page: 100 });
        const records = res?.data?.record?.data || [];
        allData = [...allData, ...records];

        if (page >= (res?.data?.record?.last_page || 1) || records.length === 0) {
          hasMore = false;
        } else {
          page++;
        }
      }
      setPresales(allData);
    } catch (err) {
      console.error("Error fetching receivable data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAggressively(); }, []);

  /* ================= AGGREGATION LOGIC ================= */
  const reportData = useMemo(() => {
    return presales.map((item) => {
      const unitPrice = Number(item.container?.unit_price_usd || 0);
      const contractPieces = Number(item.container?.pieces || 0);
      const loadedPieces = Number(item.container_loaded_pieces || 0);

      const contractAmount = unitPrice * contractPieces;
      const actualLoadedValue = unitPrice * loadedPieces;
      const receivable = contractAmount - actualLoadedValue;

      return {
        ...item,
        contractAmount,
        actualLoadedValue,
        receivable,
        status: receivable <= 0 ? "Settled" : "Not Settled",
        statusColor: receivable <= 0 ? "green" : "red"
      };
    });
  }, [presales]);

  /* ================= MASTER METRICS (UPDATED) ================= */
  const masterMetrics = useMemo(() => {
    const totals = reportData.reduce((acc, curr) => ({
      totalContract: acc.totalContract + curr.contractAmount,
      totalActual: acc.totalActual + curr.actualLoadedValue,
      totalReceivable: acc.totalReceivable + curr.receivable
    }), { totalContract: 0, totalActual: 0, totalReceivable: 0 });

    return {
      ...totals,
      // Global status logic
      paymentStatus: totals.totalReceivable <= 0 ? "Settled" : "Outstanding",
      statusColor: totals.totalReceivable <= 0 ? "green" : "orange"
    };
  }, [reportData]);

  const formatUSD = (val) => `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  if (loading) return <div className="drilldown"><p>Loading aggressive data sync...</p></div>;

  return (
    <div className="drilldown">
      {!selectedRecord ? (
        <>
          <div className="section-report-head"><h3>Supplier Receivable Report</h3></div>

          <div className="drill-summary-grid">
            <div className="drill-summary">
              <div className="summary-item">
                <p className="small">Total Amount</p>
                <h2>{formatUSD(masterMetrics.totalContract)}</h2>
              </div>
              <div className="summary-item">
                <p className="small">Total Actual Loaded</p>
                <h2>{formatUSD(masterMetrics.totalActual)}</h2>
              </div>
              <div className="summary-item">
                <p className="small">Total Supplier Receivable</p>
                <h2 style={{ color: "#581aae" }}>{formatUSD(masterMetrics.totalReceivable)}</h2>
              </div>
              {/* Added Payment Status Metric */}
              <div className="summary-item">
                <p className="small">Payment Status</p>
                <h2 style={{ color: masterMetrics.statusColor }}>{masterMetrics.paymentStatus}</h2>
              </div>
            </div>
          </div>

          <ReceivableTable
            data={reportData} 
            onRowClick={setSelectedRecord} 
            goBack={goBack} 
          />
        </>
      ) : (
        <ReceivableDrilldowm 
          data={selectedRecord} 
          goBack={() => setSelectedRecord(null)} 
        />
      )}
    </div>
  );
};

export default ReceivableController;