import { useEffect, useState, useMemo } from "react";
import { ExpenseServices } from "../../../../../services/Trip/expense";
import { calculateWeightedRate } from "../../../../../utils/financeMath";


export const useTripFinance = (tripUuid) => {
  const [financeData, setFinanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tripUuid) {
      setFinanceData([]);
      return;
    }

    const fetchAllFinancePages = async () => {
      setLoading(true);
      try {
        let allRecords = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const res = await ExpenseServices.list({ trip_uuid: tripUuid, page, per_page: 100 });
          const records = res.data?.record?.data || res.data?.data || [];
          
          allRecords = [...allRecords, ...records];

          const lastPage = res.data?.record?.last_page || 1;
          if (page >= lastPage || records.length === 0) {
            hasMore = false;
          } else {
            page++;
          }
        }
        
        setFinanceData(allRecords);
      } catch (err) {
        console.error("Failed to fetch finance for trip:", tripUuid, err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllFinancePages();
  }, [tripUuid]);

  const avgContainerRate = useMemo(() => {
    return calculateWeightedRate(financeData);
  }, [financeData]);

  return {
    financeData,
    setFinanceData,
    avgContainerRate,
    loading,
  };
};