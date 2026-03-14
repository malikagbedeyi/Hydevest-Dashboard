import React, { useMemo, useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import "../../../../assets/Styles/dashboard/table.scss";
import DebtTable from "./DebtTable";
import DebtDrilldown from "./DebtDrilldown";
import { SaleServices } from "../../../../services/Sale/sale";
import { RecoveryServices } from "../../../../services/Sale/recovery";

const DebtController = ({ goBack }) => {
  const [sales, setSales] = useState([]);
  const [recoveries, setRecoveries] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesRes, recoveryRes] = await Promise.all([
        SaleServices.list({ page: 1 }),
        RecoveryServices.list()
      ]);
      setSales(salesRes?.data?.record?.data || []);
      setRecoveries(recoveryRes?.data?.record?.data || []);
    } catch (err) {
      console.error("Error fetching debt data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* ================= GROUPING LOGIC ================= */
  const customerDebtData = useMemo(() => {
    const map = {};

    sales.forEach((sale) => {
      const custId = sale.customer?.user_uuid || sale.customer?.id;
      if (!custId) return;

      if (!map[custId]) {
        map[custId] = {
          customerId: custId,
          numericId: sale.customer?.id,
          customerUniqueId: sale.customer?.customer_unique_id || `CUST-${custId.toString().slice(0,4)}`,
          customerName: `${sale.customer?.firstname || ""} ${sale.customer?.lastname || ""}`,
          customerPhone: sale.customer?.phone_no || "N/A",
          totalSaleAmount: 0,
          totalAmountPaid: 0,
          createdAt: sale.created_at
        };
      }
      map[custId].totalSaleAmount += Number(sale.total_sale_amount || 0);
      map[custId].totalAmountPaid += Number(sale.amount_paid || 0);
    });

    return Object.values(map).map(c => ({
      ...c,
      outstanding: Math.max(c.totalSaleAmount - c.totalAmountPaid, 0),
      paymentStatus: (c.totalSaleAmount - c.totalAmountPaid) <= 0 ? "Full Payment" : "Part Payment"
    }));
  }, [sales]);

  const metrics = useMemo(() => {
    const totals = customerDebtData.reduce((acc, curr) => ({
      sale: acc.sale + curr.totalSaleAmount,
      paid: acc.paid + curr.totalAmountPaid,
      debt: acc.debt + curr.outstanding
    }), { sale: 0, paid: 0, debt: 0 });

    return {
      ...totals,
      status: totals.debt <= 0 ? "Settled" : "Outstanding"
    };
  }, [customerDebtData]);

  const formatMoney = (val) => "₦" + Number(val).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  return (
    <div className="drilldown">
      {!selectedCustomer ? (
        <>
          <div className="section-report-head"><h3>Customer Debt Report</h3></div>

          <div className="drill-summary-grid">
            <div className="drill-summary">
              <div className="summary-item">
                <p className="small">Total Sale Amount</p>
                <h2>{formatMoney(metrics.sale)}</h2>
              </div>
              <div className="summary-item">
                <p className="small">Total Amount Paid</p>
                <h2>{formatMoney(metrics.paid)}</h2>
              </div>
              <div className="summary-item">
                <p className="small">Total Outstanding</p>
                <h2 style={{ color: "red" }}>{formatMoney(metrics.debt)}</h2>
              </div>
              <div className="summary-item">
                <p className="small">Payment Status</p>
                <h2 style={{ color: metrics.debt <= 0 ? "green" : "orange" }}>{metrics.status}</h2>
              </div>
            </div>
          </div>

          <DebtTable data={customerDebtData} onRowClick={setSelectedCustomer} goBack={goBack} />
        </>
      ) : (
        <DebtDrilldown 
          customer={selectedCustomer} 
          sales={sales} 
          recoveries={recoveries} 
          goBack={() => setSelectedCustomer(null)} 
        />
      )}
    </div>
  );
};

export default DebtController;