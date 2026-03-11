import React, { useState, useEffect } from "react";
import { ContainerServices } from "../../../../services/Trip/container";

const ContainerLog = ({ container_uuid }) => {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const normalizeWhatChanged = (changes) => {
    if (!changes || typeof changes !== "object") return [];
    return Object.keys(changes).map((field) => ({
      field,
      from: changes[field]?.from,
      to: changes[field]?.to,
    }));
  };

  const fetchLogs = async () => {
    if (!container_uuid) return;

    try {
      setLoading(true);
      const res = await ContainerServices.log({ container_uuid, page });

      const logsArray = Array.isArray(res.data?.record?.data)
        ? res.data.record.data
        : [];

      setLogs(logsArray);
      console.log(res.data)
      setTotalPages(res.data?.record?.last_page || 1);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setLogs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [container_uuid, page]);

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{width:"130%" , maxWidth:"130%",minWidth:"130%"}}>
          <thead>
            <tr>
              <th>#</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Field</th>
              <th>From</th>
              <th>To</th>
              <th>Performed By</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">Loading...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="8">No logs found</td>
              </tr>
            ) : (
            logs.map((log, i) => {
  const changes = normalizeWhatChanged(log.what_changed);

  if (changes.length > 0) {
    return changes.map((c, index) => (
      <tr key={`${log.log_uuid}-${index}`}>
        <td>{index === 0 ? (page - 1) * 10 + i + 1 : ""}</td>
        <td>{index === 0 ? log.action : ""}</td>
        <td>{index === 0 ? log.entity : ""}</td>
        <td><strong>{c.field}</strong></td>

        {/* Convert status 0/1 to Unapproved/Approved */}
        <td>
          {c.field === "status"
            ? c.from === 1
              ? "Approved"
              : "Not approved"
            : String(c.from)}
        </td>
        <td>
          {c.field === "status"
            ? c.to === 1
              ? "Approved"
              : "Not approved"
            : String(c.to)}
        </td>

        <td>{index === 0 ? (log.creator ? `${log.creator.firstname} ${log.creator.lastname}` : "System") : ""}</td>
        <td>{index === 0 ? new Date(log.created_at).toLocaleString() : ""}</td>
      </tr>
    ));
  }

  // No field changes
  return (
    <tr key={log.log_uuid}>
      <td>{(page - 1) * 10 + i + 1}</td>
      <td>{log.action}</td>
      <td>{log.entity}</td>
      <td colSpan="3">No field changes</td>
      <td>{log.creator ? `${log.creator.firstname} ${log.creator.lastname}` : "System"}</td>
      <td>{new Date(log.created_at).toLocaleString()}</td>
    </tr>
  );
})

            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

export default ContainerLog
