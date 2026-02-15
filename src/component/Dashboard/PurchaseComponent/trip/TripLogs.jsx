import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/table.scss";
import { TripServices } from "../../../../services/Trip/trip";

const TripLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const normalizeWhatChanged = (whatChanged) => {
  if (!whatChanged || typeof whatChanged !== "object") return [];

  return Object.entries(whatChanged).map(([field, value]) => ({
    field,
    from: value?.from ?? "-",
    to: value?.to ?? "-",
  }));
};


  const fetchLogs = async (pageValue = page) => {
    try {
      setLoading(true);
      const res = await TripServices.log({
        page: pageValue,
        date_created: "",
      });
      console.log(res.data)
      setLogs(res.data?.record.data);
      setTotalPages(res.data?.record.meta.last_page || 1);
    } catch (err) {
        console.error("Failed to fetch role logs", err);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{ width: "100%",maxWidth:"100%",minWidth:"100%" }}>
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
    logs.map((l, i) => {
      const changes = normalizeWhatChanged(l.what_changed);

      return changes.length > 0 ? (
        changes.map((c, index) => (
          <tr key={`${l.log_uuid}-${index}`}>
            {/* Show index only once per log */}
            <td>{index === 0 ? (page - 1) * 10 + i + 1 : ""}</td>

            <td className={`log-action ${l.action}`}>
              {index === 0 ? l.action : ""}
            </td>

            <td>{index === 0 ? l.entity : ""}</td>

            {/* FIELD */}
            <td><strong>{c.field}</strong></td>

            {/* FROM */}
            <td>{String(c.from)}</td>

            {/* TO */}
            <td>{String(c.to)}</td>

            <td>
              {index === 0
                ? l.creator
                  ? `${l.creator.firstname} ${l.creator.lastname}`
                  : "System"
                : ""}
            </td>

            <td>
              {index === 0
                ? new Date(l.created_at).toLocaleString()
                : ""}
            </td>
          </tr>
        ))
      ) : (
        <tr key={l.log_uuid}>
          <td>{(page - 1) * 10 + i + 1}</td>
          <td>{l.action}</td>
          <td>{l.entity}</td>
          <td colSpan="3">No field changes</td>
          <td>
            {l.creator
              ? `${l.creator.firstname} ${l.creator.lastname}`
              : "System"}
          </td>
          <td>{new Date(l.created_at).toLocaleString()}</td>
        </tr>
      );
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


export default TripLogs
