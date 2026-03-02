import { useEffect, useState, useMemo } from "react";
import { TripServices } from "../../../../../services/Trip/trip";

export const useTripFinance = (tripUuid) => {
  const [financeData, setFinanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tripUuid) return;

    const fetchFinance = async () => {
      try {
        setLoading(true);
        const res = await TripServices.getExpenses(tripUuid);
        setFinanceData(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch finance", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinance();
  }, [tripUuid]);

  const avgContainerRate = useMemo(() => {
    const valid = financeData.filter(
      (item) =>
        Number(item.is_container_payment) === 1 &&
        Number(item.rate) > 0
    );

    if (!valid.length) return 0;

    return (
      valid.reduce((sum, i) => sum + Number(i.rate), 0) / valid.length
    );
  }, [financeData]);
  
console.log("avgContainerRate:", avgContainerRate);
  return {
    financeData,
    setFinanceData,
    avgContainerRate,
    loading,
  };
};