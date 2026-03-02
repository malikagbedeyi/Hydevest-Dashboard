import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { PresaleServices } from "../../../../services/Sale/presale";


const PresaleLog = ({ preSaleUuid }) => {

  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
const safeLogs = Array.isArray(logs) ? logs : [];
  const itemsPerPage = 10;

  /* ================= FETCH LOGS ================= */

  


 useEffect(() => {
  if (!preSaleUuid) return;

  const fetchLogs = async () => {
    try {
      const res = await PresaleServices.log({
        pre_sale_uuid: preSaleUuid,
      });

      const record = res.data?.record;
      const logArray = Array.isArray(record)
        ? record
        : Array.isArray(record?.data)
        ? record.data
        : [];

      setLogs(logArray);
    } catch (err) {
      console.error(err);
      setLogs([]);
    }
  };

  fetchLogs();
}, [preSaleUuid]);
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentLogs = logs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="finance-section">
      <div className="userTable">
        <div className="table-wrap">
          <table className="table"style={{width:"100%" , maxWidth:"100%",minWidth:"100%"}}>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Module</th>
                <th>Action</th>
                <th>Title</th>
                <th>Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Activity Recorded
                  </td>
                </tr>
              ) : (
               currentLogs.map((log, idx) => (
  <tr key={log.log_uuid}>
    <td>{startIndex + idx + 1}</td>

    {/* MODULE */}
    <td>{log.entity}</td>

    {/* ACTION */}
    <td>
      <span
        style={{
          color: log.action.includes("create")
            ? "green"
            : log.action.includes("delete")
            ? "red"
            : "orange",
          fontWeight: 600,
        }}
      >
        {log.action.replaceAll("_", " ")}
      </span>
    </td>

    {/* TITLE (derived) */}
    <td>
      {log.after?.pre_sale_unique_id ??
        log.before?.pre_sale_unique_id ??
        "-"}
    </td>

    {/* DATE */}
    <td>{new Date(log.created_at).toLocaleString()}</td>

    <td>
      <Trash2 size={16} color="red" />
    </td>
  </tr>
))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </button>
              <span>{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default PresaleLog
