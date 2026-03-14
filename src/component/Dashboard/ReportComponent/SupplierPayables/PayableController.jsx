import React, { useMemo, useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import "../../../../assets/Styles/dashboard/table.scss";
import PayableTable from "./PayableTable";
import PayableDrilldown from "./PayableDrilldown";
import { TripServices } from "../../../../services/Trip/trip";
import { ContainerServices } from "../../../../services/Trip/container";
import { ExpenseServices } from "../../../../services/Trip/expense";

const PayableController = ({ goBack }) => {
  const [trips, setTrips] = useState([]);
  const [containers, setContainers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(false);

  
/* ================= FETCH DATA ================= */
const fetchData = async () => {
  setLoading(true);
  try {
    // 1. Fetch Trips and Containers first
    const [tripRes, contRes] = await Promise.all([
      TripServices.list({ page: 1 }),
      ContainerServices.list({ page: 1 }),
    ]);

    const tripData = tripRes?.data?.record?.data || [];
    const contData = contRes?.data?.record?.data || [];

    setTrips(tripData);
    setContainers(contData);

    // 2. Extract unique Trip UUIDs from the trips found
    const tripUuids = tripData.map(t => t.trip_uuid).filter(Boolean);
    
    // 3. Fetch Expenses for each trip individually to avoid the 400 error
    const expensePromises = tripUuids.map(uuid => 
      ExpenseServices.list({ trip_uuid: uuid })
        .then(res => res?.data?.record?.data || [])
        .catch(() => []) // If one fails, return empty array for that trip
    );

    const allExpensesArrays = await Promise.all(expensePromises);
    const combinedExpenses = allExpensesArrays.flat(); // Merge all into one list

    setExpenses(combinedExpenses);

    console.log("Payable Debug -> Combined Expenses Total:", combinedExpenses.length);
  } catch (err) {
    console.error("Critical error fetching payable data", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);
/* ================= AGGREGATION LOGIC (FIXED) ================= */
const payableReportData = useMemo(() => {
  return trips.map((trip) => {
    const tripContainers = containers.filter(c => 
      Number(c.trip_id) === Number(trip.id) || 
      Number(c.trip?.id) === Number(trip.id)
    );
    
    const totalShipping = tripContainers.reduce((sum, c) => sum + Number(c.shipping_amount_usd || 0), 0);
    const totalAmountUsd = tripContainers.reduce((sum, c) => {
      const base = Number(c.unit_price_usd || 0) * Number(c.pieces || 0);
      return sum + base;
    }, 0);
    
    const supplierAmount = totalAmountUsd + totalShipping;

    const amountPaidSupplier = expenses
      .filter(e => 
        (Number(e.trip_id) === Number(trip.id) || e.trip_uuid === trip.trip_uuid) 
        && Number(e.is_container_payment) === 1
      )
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    let status = "Settled";
    let statusColor = "green";

    // ✅ FIX: Check payment balance FIRST. 
    // This ensures if Containers = 0 but Payment > 0, it shows "Over Paid"
    if (amountPaidSupplier > supplierAmount) {
      status = "Over Paid";
      statusColor = "blue"; 
    } else if (supplierAmount > amountPaidSupplier) {
      status = "Outstanding";
      statusColor = "orange";
    } else if (supplierAmount === amountPaidSupplier && supplierAmount > 0) {
      status = "Settled";
      statusColor = "green";
    } else if (tripContainers.length === 0 && amountPaidSupplier === 0) {
      // Only default to Settled if there are no containers AND no payments
      status = "Settled";
      statusColor = "green";
    }

    return {
      ...trip,
      totalShipping,
      totalAmountUsd,
      supplierAmount,
      amountPaidSupplier,
      displayStatus: status,
      displayStatusColor: statusColor,
    };
  });
}, [trips, containers, expenses]);

  const masterMetrics = useMemo(() => {
    return payableReportData.reduce((acc, curr) => ({
      shipping: acc.shipping + curr.totalShipping,
      amountUsd: acc.amountUsd + curr.totalAmountUsd,
      supplierTotal: acc.supplierTotal + curr.supplierAmount,
      paid: acc.paid + curr.amountPaidSupplier
    }), { shipping: 0, amountUsd: 0, supplierTotal: 0, paid: 0 });
  }, [payableReportData]);

  const formatUSD = (val) => `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="drilldown">
      {!selectedTrip ? (
        <>
          <div className="section-report-head">
            <h3>Supplier Payable Report</h3>
          </div>

          <div className="drill-summary-grid">
            <div className="drill-summary">
              <div className="summary-item">
                <p className="small">Total Shipping Amount</p>
                <h2>{formatUSD(masterMetrics.shipping)}</h2>
              </div>
              <div className="summary-item">
                <p className="small">Total Amount USD</p>
                <h2>{formatUSD(masterMetrics.amountUsd)}</h2>
              </div>
              <div className="summary-item">
                <p className="small">Total Supplier Amount</p>
                <h2>{formatUSD(masterMetrics.supplierTotal)}</h2>
              </div>
              <div className="summary-item">
                <p className="small">Total Amount Paid Supplier</p>
                <h2>{formatUSD(masterMetrics.paid)}</h2>
              </div>
            </div>
          </div>

          <PayableTable 
            data={payableReportData} 
            onRowClick={setSelectedTrip} 
            goBack={goBack} 
          />
        </>
      ) : (
        <PayableDrilldown 
          tripData={selectedTrip} 
          allContainers={containers} 
          allExpenses={expenses} 
          goBack={() => setSelectedTrip(null)} 
        />
      )}
    </div>
  );
};

export default PayableController;