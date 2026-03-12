import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/table.scss";
import { RecoveryServices } from "../../../../services/Sale/recovery";

const RecoveryLog = ({ filters, search }) => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

const fetchLogs = async (pageValue = page) => {
  try {
    setLoading(true);
    // Send ALL filters to the log API
    const res = await RecoveryServices.logs({ 
      page: pageValue,
      from_date: filters.from_date,
      to_date: filters.to_date,
      // If your backend supports user filtering in logs:
      user_uuid: filters.user_uuid || "" 
    });
    
    const record = res.data?.record;
    let rawData = record?.data || [];

    // CLIENT SIDE SEARCH (Performed By, ID, or Field)
    if (search) {
      const s = search.toLowerCase();
      rawData = rawData.filter(log => {
        const fullName = `${log.creator?.firstname || ""} ${log.creator?.lastname || ""}`.toLowerCase();
        const recoveryId = (log.before?.recovery?.recovery_unique_id || log.after?.recovery?.recovery_unique_id || "").toLowerCase();
        const saleId = (log.before?.sale?.sale_unique_id || log.after?.sale?.sale_unique_id || "").toLowerCase();
        const whatChanged = (typeof log.what_changed === 'string' ? log.what_changed : "").toLowerCase();

        return fullName.includes(s) || recoveryId.includes(s) || saleId.includes(s) || whatChanged.includes(s);
      });
    }

    setLogs(rawData);
    setTotalPages(record?.last_page || 1);
  } catch (err) {
    console.error("Failed to fetch recovery logs", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const timer = setTimeout(() => fetchLogs(page), 400);
    return () => clearTimeout(timer);
  }, [page, filters, search]);

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{ width: "135%", maxWidth: "150%" }}>
          <thead>
            <tr>
              <th>#</th>
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
              <tr><td colSpan="9">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: "center" }}>No logs found</td></tr>
            ) : (
              logs.map((log, i) => {
                // Multi-row mapping for Recovery logs
                const fieldsToShow = [
                  { label: "Recovery Amount", before: log.before?.recovery?.amount, after: log.after?.recovery?.amount },
                  { label: "Sale Amount Paid", before: log.before?.sale?.amount_paid, after: log.after?.sale?.amount_paid },
                  { label: "Status", before: log.before?.recovery?.status, after: log.after?.recovery?.status }
                ];

                const changedFields = fieldsToShow.filter(f => f.before !== f.after);
                const displayRows = changedFields.length > 0 ? changedFields : [fieldsToShow[0]];

                return displayRows.map((f, index) => (
                  <tr key={`${log.log_uuid}-${index}`}>
                    <td>{index === 0 ? (page - 1) * 10 + i + 1 : ""}</td>
                    <td className={`log-action ${log.action}`}>{index === 0 ? log.action : ""}</td>
                    <td>{index === 0 ? log.entity : ""}</td>
                    <td>{index === 0 ? (log.what_changed || "System Update") : ""}</td>
                    <td><strong>{f.label}</strong></td>
                    <td>{f.label === "Status" ? (f.before === 1 ? "Active" : "Deleted") : `₦${formatMoney(f.before)}`}</td>
                    <td>{f.label === "Status" ? (f.after === 1 ? "Active" : "Deleted") : `₦${formatMoney(f.after)}`}</td>
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

export default RecoveryLog;