import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/table.scss";
import { SaleServices } from "../../../../services/Sale/sale";

const SaleLog = ({ filters, search }) => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (pageValue = page) => {
    try {
      setLoading(true);
      const res = await SaleServices.logs({ 
        page: pageValue,
        from_date: filters.from_date,
        to_date: filters.to_date
      });
      
      const record = res.data?.record;
      let rawData = record?.data || [];

      // Improved Client-Side Filtering for Logs
      if (search) {
        const s = search.toLowerCase();
        rawData = rawData.filter(log => {
          const fullName = `${log.creator?.firstname || ""} ${log.creator?.lastname || ""}`.toLowerCase();
          const saleId = (log.before?.sale?.sale_unique_id || log.after?.sale?.sale_unique_id || "").toLowerCase();
          const whatChanged = (log.what_changed || "").toLowerCase();
          const entity = (log.entity || "").toLowerCase();

          return fullName.includes(s) || saleId.includes(s) || whatChanged.includes(s) || entity.includes(s);
        });
      }

      setLogs(rawData);
      setTotalPages(record?.last_page || 1);
    } catch (err) {
      console.error("Failed to fetch sale logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchLogs(page), 400);
    return () => clearTimeout(timer);
  }, [page, filters, search]);

const formatMoney = (value) => {
    let numericValue = 0;
    if (value && typeof value === 'object') {
      numericValue = value.total_sale_amount || value.amount || value.amount_paid || 0;
    } else {
      numericValue = value || 0;
    }
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(numericValue));
  };

  const renderWhatChanged = (val) => {
    if (!val) return "System Update";
    if (typeof val === "string") return val;
    
    if (typeof val === "object") {
      return Object.keys(val).map(key => key.replace(/_/g, ' ')).join(", ");
    }
    return "Update";
  };

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{ width: "135%", maxWidth: "150%", minWidth: "100%" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Sale ID</th>
              <th>Action</th>
              <th>Entity</th>
              <th>What Changed</th>
              <th>Field</th>
              <th>From</th>
              <th>To</th>
              <th>Performed By</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="10" style={{ textAlign: "center" }}>Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="10" style={{ textAlign: "center" }}>No logs found</td></tr>
            ) : (
              logs.map((log, i) => {
                const saleInfo = log.before?.sale || log.after?.sale || log.before || {};

                const fieldsToShow = [
                  { 
                    label: "Total Sale Amount", 
                    before: log.before?.sale?.total_sale_amount ?? log.before?.total_sale_amount, 
                    after: log.after?.sale?.total_sale_amount ?? log.after?.total_sale_amount
                  },
                  { 
                    label: "Total Amount Paid", 
                    before: log.before?.sale?.amount_paid ?? log.before?.amount_paid, 
                    after: log.after?.sale?.amount_paid ?? log.after?.amount_paid
                  },
                  { 
                    label: "Discount", 
                    before: log.before?.sale?.discount ?? log.before?.discount, 
                    after: log.after?.sale?.discount ?? log.after?.discount
                  }
                ];

                const changedFields = log.action === "delete" || log.action === "create" 
                  ? [fieldsToShow[0]] 
                  : fieldsToShow.filter(f => f.before !== f.after);

                const displayRows = changedFields.length > 0 ? changedFields : [{label: "N/A", before: 0, after: 0}];

                return displayRows.map((f, index) => (
                  <tr key={`${log.log_uuid}-${index}`}>
                    <td>{index === 0 ? (page - 1) * 10 + i + 1 : ""}</td>
                    <td>{index === 0 ? (saleInfo.sale_unique_id || "N/A") : ""} </td>
                    <td className={`log-action ${log.action}`}>{index === 0 ? log.action.replace(/_/g, ' ') : ""}</td>
                    <td>{index === 0 ? log.entity : ""}</td>
                    
                    <td>{index === 0 ? renderWhatChanged(log.what_changed) : ""}</td>
                    
                    <td><strong>{f.label}</strong></td>
                    <td>₦{formatMoney(f.before)}</td>
                    <td>
                      {log.action === "delete" ? <span style={{color: 'red'}}>REMOVED</span> : `₦${formatMoney(f.after)}`}
                    </td>
                    <td>{index === 0 ? (log.creator ? `${log.creator.firstname} ${log.creator.lastname}` : "System") : ""}</td>
                    <td>{index === 0 ? (log.created_at ? new Date(log.created_at).toLocaleString() : "") : ""}</td>
                  </tr>
                ));
              })
            )}
          </tbody>
        </table>
      </div>
       {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default SaleLog;