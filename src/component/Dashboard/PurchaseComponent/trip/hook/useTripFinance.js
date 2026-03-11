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
    // 1. Filter for Container Payments in USD that have a valid rate
    const containerPayments = financeData.filter(
      (item) =>
        Number(item.is_container_payment) === 1 &&
        item.currency === "USD" &&
        Number(item.rate) > 0
    );

    if (!containerPayments.length) return 0;

    // 2. Calculate Total USD spent and Total NGN equivalent spent
    let totalUsdAmount = 0;
    let totalNgnEquivalent = 0;

    containerPayments.forEach((item) => {
      const usd = Number(item.amount) || 0;
      const rate = Number(item.rate) || 0;
      
      totalUsdAmount += usd;
      totalNgnEquivalent += (usd * rate);
    });

    // 3. Avoid division by zero and calculate: Total NGN / Total USD
    if (totalUsdAmount === 0) return 0;

    return totalNgnEquivalent / totalUsdAmount;
  }, [financeData]);
  
  return {
    financeData,
    setFinanceData,
    avgContainerRate,
    loading,
  };
};