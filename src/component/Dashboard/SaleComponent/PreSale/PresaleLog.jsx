import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/table.scss";
import { PresaleServices } from "../../../../services/Sale/presale";

const PresaleLog = ({ filters, search }) => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (pageValue = page) => {
    try {
      setLoading(true);
      const res = await PresaleServices.log({
        page: pageValue,
        from_date: filters?.from_date || "",
        to_date: filters?.to_date || "",
        user_uuid: filters?.user_uuid || "",
      });

      const record = res.data?.record;
      let rawData = record?.data || [];

      if (search) {
        const s = search.toLowerCase();
        rawData = rawData.filter((log) => {
          const id = (log.after?.pre_sale?.pre_sale_unique_id || log.before?.pre_sale?.pre_sale_unique_id || log.after?.pre_sale_unique_id || "").toLowerCase();
          const fullName = `${log.creator?.firstname || ""} ${log.creator?.lastname || ""}`.toLowerCase();
          return id.includes(s) || fullName.includes(s);
        });
      }

      setLogs(rawData);
      setTotalPages(record?.last_page || 1);
    } catch (err) {
      console.error("Failed to fetch presale logs", err);
      setLogs([]);
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

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-NG").format(Number(value || 0));

  const renderValue = (val, type, label) => {
    if (val === null || val === undefined || val === "") return "—";
    if (label.toLowerCase().includes("status")) {
      return (
        <span style={{ color: Number(val) === 1 ? "green" : "orange", fontWeight: 600 }}>
          {Number(val) === 1 ? "Approved" : "Pending"}
        </span>
      );
    }
    if (type === 'money') return `₦${formatMoney(val)}`;
    return formatNumber(val);
  };

  // ✅ NEW HELPER: Extracts value from nested structures (pre_sale or direct)
  const getVal = (obj, key) => {
    if (!obj) return undefined;
    if (obj[key] !== undefined) return obj[key];
    if (obj.pre_sale && obj.pre_sale[key] !== undefined) return obj.pre_sale[key];
    return undefined;
  };

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{ width: "130%", maxWidth: "130%" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Presale ID</th>
              <th>Action</th>
              <th>Entity</th>
              <th>What Change</th>
              <th>Field</th>
              <th>From</th>
              <th>To</th>
              <th>Performed By</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{ textAlign: "center", padding: "40px" }}>Loading logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: "center", padding: "40px" }}>No logs found.</td></tr>
            ) : (
              logs.map((log, i) => {
                const fieldsToShow = [
                  { label: "WC Pieces", before: getVal(log.before, "wc_pieces"), after: getVal(log.after, "wc_pieces"), type: 'num' },
                  { label: "WC Avg Weight", before: getVal(log.before, "wc_average_weight"), after: getVal(log.after, "wc_average_weight"), type: 'num' },
                  { label: "Price / Piece", before: getVal(log.before, "price_per_piece"), after: getVal(log.after, "price_per_piece"), type: 'money' },
                  { label: "Price / KG", before: getVal(log.before, "price_per_kg"), after: getVal(log.after, "price_per_kg"), type: 'money' },
                  { label: "Total Pallets", before: getVal(log.before, "total_no_of_pallets"), after: getVal(log.after, "total_no_of_pallets"), type: 'num' },
                  { label: "Revenue", before: getVal(log.before, "expected_sales_revenue"), after: getVal(log.after, "expected_sales_revenue"), type: 'money' },
                  { label: "Status", before: getVal(log.before, "status"), after: getVal(log.after, "status"), type: 'status' }
                ];

                const changedFields = fieldsToShow.filter(f => String(f.before) !== String(f.after) && (f.before !== undefined || f.after !== undefined));
                const displayRows = changedFields.length > 0 ? changedFields : [fieldsToShow[0]];

                let whatChangedDisplay = "System Update";
                if (typeof log.what_changed === "string") {
                  whatChangedDisplay = log.what_changed;
                } else if (log.what_changed && typeof log.what_changed === "object") {
                  const keys = [];
                  if (log.what_changed.pre_sale) keys.push(...Object.keys(log.what_changed.pre_sale));
                  if (log.what_changed.pallets) keys.push("pallets");
                  whatChangedDisplay = keys.length > 0 ? keys.join(", ") : Object.keys(log.what_changed).join(", ");
                }

                return displayRows.map((f, index) => (
                  <tr key={`${log.log_uuid}-${index}`}>
                    <td>{index === 0 ? (page - 1) * 10 + i + 1 : ""}</td>
                    <td>{index === 0 ? log?.before.pre_sale?.pre_sale_unique_id : ""}</td>
                    <td className={`log-action ${log.action}`}>{index === 0 ? log.action.replaceAll("_", " ") : ""}</td>
                    <td>{index === 0 ? log.entity : ""}</td>
                    <td style={{ fontSize: "12px", color: "#666" }}>{index === 0 ? whatChangedDisplay : ""}</td>
                    
                    <td><strong>{f.label}</strong></td>
                    <td style={{ color: "#d9534f" }}>{renderValue(f.before, f.type, f.label)}</td>
                    <td style={{ color: "#5cb85c" }}>{renderValue(f.after, f.type, f.label)}</td>
                    
                    <td>{index === 0 ? (log.creator ? `${log.creator.firstname} ${log.creator.lastname}` : "System") : ""}</td>
                    <td style={{ fontSize: "12px" }}>
                      {index === 0 ? new Date(log.created_at).toLocaleString('en-GB') : ""}
                    </td>
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
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default PresaleLog;