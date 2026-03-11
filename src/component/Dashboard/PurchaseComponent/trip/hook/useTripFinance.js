import { useEffect, useState, useMemo } from "react";
import { ExpenseServices } from "../../../../../services/Trip/expense";

export const useTripFinance = (tripUuid) => {
  const [financeData, setFinanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tripUuid) return;

    const fetchFinance = async () => {
      try {
        setLoading(true);
        const res = await ExpenseServices.list({ trip_uuid: tripUuid });
        setFinanceData(res.data?.record?.data || res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch finance", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinance();
  }, [tripUuid]);

/* ================== WEIGHTED AVERAGE CALCULATION ================== */
const avgContainerRate = useMemo(() => {
  const containerPayments = financeData.filter(
    (item) =>
      Number(item.is_container_payment) === 1 &&
      item.currency === "USD" &&
      Number(item.rate) > 0
  );

  if (!containerPayments.length) return 0;

  // Use reduce for cleaner, more precise accumulation
  const totals = containerPayments.reduce((acc, item) => {
    const usd = Number(item.amount) || 0;
    const rate = Number(item.rate) || 0;
    
    return {
      usd: acc.usd + usd,
      ngn: acc.ngn + (usd * rate)
    };
  }, { usd: 0, ngn: 0 });

  if (totals.usd === 0) return 0;


  return totals.ngn / totals.usd; 
}, [financeData]);
  return {
    financeData,
    setFinanceData,
    avgContainerRate,
    loading,
  };
};