import React, { useMemo, useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import "../../../../assets/Styles/dashboard/table.scss";
import ReceivableTable from "./ReceivableTable";
import ReceivableDrilldowm from "./ReceivableDrilldowm";
import { PresaleServices } from "../../../../services/Sale/presale";
import { TripServices } from "../../../../services/Trip/trip";

const ReceivableController = ({ goBack }) => {
  const [trips, setTrips] = useState([]);
  const [presales, setPresales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  /* ================= FETCH DATA (AGGRESSIVE BYPASS) ================= */
  const fetchAggressively = async (service, params = {}) => {
    let allRecords = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      try {
        const res = await service.list({ ...params, page, per_page: 100 });
        const records = res?.data?.record?.data || [];
        allRecords = [...allRecords, ...records];
        
        if (page >= (res?.data?.record?.last_page || 1) || records.length === 0) {
          hasMore = false;
        } else {
          page++;
        }
      } catch (err) {
        console.error("Loop fetch error:", err);
        hasMore = false;
      }
    }
    return allRecords;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allTrips, allPresales] = await Promise.all([
        fetchAggressively(TripServices),
        fetchAggressively(PresaleServices)
      ]);
      setTrips(allTrips);
      setPresales(allPresales);
    } catch (err) {
      console.error("Error fetching receivable data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= AGGREGATION LOGIC (FIXED) ================= */
  const reportData = useMemo(() => {
    return trips.map((trip) => {

      const tripPresales = presales.filter(p => Number(p.container?.trip_id) === Number(trip.id));
      
      const totalContract = tripPresales.reduce((sum, p) => 
        sum + (Number(p.container?.unit_price_usd || 0) * Number(p.container?.pieces || 0)), 0);

      const totalPieces = tripPresales.reduce((sum, p) => 
        sum + Number(p.container?.pieces || 0), 0);
      
      const totalLoaderPieces = tripPresales.reduce((sum, p) => 
        sum + Number(p.container_loaded_pieces || 0), 0);
      

      const totalActualLoaded = tripPresales.reduce((sum, p) => 
        sum + (Number(p.container?.unit_price_usd || 0) * Number(p.container_loaded_pieces || 0)), 0);

      const receivable = totalContract - totalActualLoaded;

      return {
        ...trip,
        totalContract,
        totalActualLoaded,
        receivable,
        totalLoaderPieces,
        totalPieces,
        tripPresales,
        status: receivable <= 0 ? "Settled" : "Outstanding",
        statusColor: receivable <= 0 ? "green" : "orange"
      };
    });
  }, [trips, presales]);

  
  /* ================= MASTER METRICS ================= */
  const masterMetrics = useMemo(() => {
    return reportData.reduce((acc, curr) => ({
      contract: acc.contract + curr.totalContract,
      actual: acc.actual + curr.totalActualLoaded,
      receivable: acc.receivable + curr.receivable
    }), { contract: 0, actual: 0, receivable: 0 });
  }, [reportData]);

  const formatUSD = (val) => `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <div className="drilldown" style={{ textAlign: 'center', padding: '10vw' }}>
        <h2 style={{ color: '#581aae' }}>Syncing Global Records...</h2>
      </div>
    );
  }

  return (
    <div className="drilldown">
      {!selectedTrip ? (
        <>
          <div className="section-report-head"><h3>Supplier Receivable Report</h3></div>
          
          <div className="drill-summary-grid">
            <div className="drill-summary">
              <div className="summary-item">
                <p className="small">Total Amount</p>
                <h2>{formatUSD(masterMetrics.contract)}</h2>
              </div>
              <div className="summary-item">
                <p className="small">Total Actual Loaded</p>
                <h2>{formatUSD(masterMetrics.actual)}</h2>
              </div>
              <div className="summary-item">
                <p className="small">Global Receivable</p>
                <h2 style={{ color: "#581aae" }}>{formatUSD(masterMetrics.receivable)}</h2>
              </div>
              <div className="summary-item">
                <p className="small">Global Status</p>
                <h2 style={{ color: masterMetrics.receivable <= 0 ? 'green' : 'orange' }}>
                  {masterMetrics.receivable <= 0 ? 'Settled' : 'Outstanding'}
                </h2>
              </div>
            </div>
          </div>

          <ReceivableTable 
            data={reportData} 
            onRowClick={setSelectedTrip} 
            goBack={goBack} 
          />
        </>
      ) : (
        <ReceivableDrilldowm 
          trip={selectedTrip} 
          goBack={() => setSelectedTrip(null)} 
        />
      )}
    </div>
  );
};

export default ReceivableController;