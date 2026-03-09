import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/table.scss";
import { SaleServices } from "../../../../services/Sale/sale";

const SaleLog = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (pageValue = page) => {
    try {
      setLoading(true);
      const res = await SaleServices.logs({ page: pageValue });
      const record = res.data?.record;

      setLogs(record?.data || []);
      setTotalPages(record?.last_page || 1);
    } catch (err) {
      console.error("Failed to fetch recovery logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{ width: "100%", maxWidth:"100%", minWidth:"100%" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Field</th>
              <th>What Change</th>
              <th>From</th>
              <th>To</th>
              <th>Performed By</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="8">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="8">No logs found</td></tr>
            ) : (
              logs.map((log, i) => {
                // For each log, explicitly check before/after.sale fields
                const fieldsToShow = [
                  { label: "Total Sale Amount", before: log.before?.sale?.total_sale_amount, after: log.after?.sale?.total_sale_amount },
                  { label: "Total Amount Paid", before: log.before?.sale?.amount_paid, after: log.after?.sale?.amount_paid },
                  { label: "Recovery Amount", before: log.before?.recovery?.amount, after: log.after?.recovery?.amount }
                ];

                return fieldsToShow.map((f, index) => (
                  <tr key={`${log.log_uuid}-${index}`}>
                    <td>{index === 0 ? (page - 1) * 10 + i + 1 : ""}</td>
                    <td className={`log-action ${log.action}`}>{index === 0 ? log.action : ""}</td>
                    <td>{index === 0 ? log.entity : ""}</td>
                    <td>{log.what_changed}</td>
                    <td><strong>{f.label}</strong></td>
                    <td>{formatMoney(f.before)}</td>
                    <td>{formatMoney(f.after)}</td>
                    <td>{index === 0 ? (log.creator ? `${log.creator.firstname} ${log.creator.lastname}` : "System") : ""}</td>
                    <td>{index === 0 ? new Date(log.created_at).toLocaleString() : ""}</td>
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

export default SaleLog
