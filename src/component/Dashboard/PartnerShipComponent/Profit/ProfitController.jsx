import React, { useEffect, useState, useMemo } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../../assets/Styles/dashboard/controller.scss";
import ProfitTable from "./ProfitTable";

const ALLOCATION_KEY = "allocation_data";
const TRIP_KEY = "trip_data";

/* ================= HELPERS ================= */

const getAvgContainerRateByTrip = (tripId) => {
  const finance =
    JSON.parse(localStorage.getItem(`trip-${tripId}-finance`)) || [];

  const containerPayments = finance.filter(
    (f) => f.check === "Container Payment"
  );

  if (containerPayments.length === 0) return 0;

  return (
    containerPayments.reduce(
      (sum, f) => sum + Number(f.rate || 0),
      0
    ) / containerPayments.length
  );
};

const ProfitController = () => {
  /* ================= STATE ================= */
  const [containers, setContainers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [tripRates, setTripRates] = useState({});
  const normalizeTN = (tn) =>
  String(tn).startsWith("TN") ? tn : `TN${tn}`;

  /* ================= LOAD CONTAINERS ================= */
  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem(TRIP_KEY)) || [];
    let allContainers = [];
  
    trips.forEach(trip => {
      const tripContainers =
        JSON.parse(localStorage.getItem(`trip-${trip.id}-container`)) || [];
  
      tripContainers.forEach(c => {
        allContainers.push({
          ...c,
          tripId: trip.id, // 🔑 REQUIRED FOR RATE LOOKUP
        });
      });
    });
  
    setContainers(allContainers);
  }, []);

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem(TRIP_KEY)) || {};
    const rates = {};
  
    trips.forEach(trip => {
      const finance =
        JSON.parse(localStorage.getItem(`trip-${trip.id}-finance`)) || [];
  
      const payments = finance.filter(f => f.check === "Container Payment");
  
      rates[trip.id] =
        payments.length === 0
          ? 0
          : payments.reduce((s, f) => s + Number(f.rate || 0), 0) / payments.length;
    });
  
    setTripRates(rates);
  }, []);
  
  /* ================= LOAD ALLOCATIONS ================= */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(ALLOCATION_KEY)) || [];
    setAllocations(saved);
  }, []);

  /* ================= DERIVED PROFIT DATA ================= */
  const profitRows = useMemo(() => {
    const map = {};
  
    allocations.forEach(allocation => {
      const container = containers.find(
        c =>
          normalizeTN(c.trackingNumber) ===
          normalizeTN(allocation.containerTrackingNumber)
      );
  
      if (!container) return;
  
      const rate = tripRates[container.tripId] || 0;
  
      const deliveryNGN =
        Number(container.amountUsd ?? container.amountUSD ?? 0) * rate;
  
      const quotedNGN =
        Number(container.quotedAmountUsd ?? container.quotedUSD ?? 0) * rate;
  
      const diff = deliveryNGN - quotedNGN;
  
      const key = normalizeTN(container.trackingNumber);
  
      if (!map[key]) {
        map[key] = {
          id: key,
          containerTrackingNumber: key,
          containerDeliveryAmount: deliveryNGN,
          quotedAmount: quotedNGN,
          difference: diff,
          status:
            diff === 0 ? "Balanced" : diff > 0 ? "Profit" : "Loss",
        };
      }
    });
  
    return Object.values(map);
  }, [allocations, containers, tripRates]);
    
  
  /* ================= UI ================= */
  return (
    <div className="controller">
      <div className="controller-container">
        <div className="controller-content">

          {/* TOP BAR */}
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
                    <span>All Fields</span>
                    <ChevronDown />
                  </div>
                </div>

                <div className="import-input">
                  <p>Export</p>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="main-content">
            <ProfitTable data={profitRows} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitController;
