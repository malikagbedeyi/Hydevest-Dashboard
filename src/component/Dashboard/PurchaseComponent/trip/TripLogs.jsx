import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/table.scss";
import { TripServices } from "../../../../services/Trip/trip";

const TripLogs = ({ filters, search })  => {
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
    
    const params = {
      page: pageValue,
      from_date: filters.from_date,
      to_date: filters.to_date,
      // Pass trip_uuid if searching specifically for a trip ID
      trip_uuid: filters.entity_id || "", 
      user_uuid: filters.user_uuid || "", 
    };

    const res = await TripServices.log(params);
    let rawData = res.data?.record.data || [];

    // IMPROVED CLIENT-SIDE FILTERING
    if (search) {
      const s = search.toLowerCase();
      
      rawData = rawData.filter(log => {
        // 1. Check Trip ID (Handles "6", "06", and "Trip 06")
        const idAsString = String(log.entity_id);
        const tripLabel = `trip 0${log.entity_id}`.toLowerCase();
        const tripShortLabel = `trip ${log.entity_id}`.toLowerCase();
        
        // 2. Check Personnel
        const fullName = `${log.creator?.firstname || ""} ${log.creator?.lastname || ""}`.toLowerCase();
        
        // 3. Check Field Names (what_changed)
        const fieldsChanged = Object.keys(log.what_changed || {}).join(" ").toLowerCase();

        // RETURN TRUE IF ANY MATCH
        return (
          idAsString.includes(s) || 
          tripLabel.includes(s) || 
          tripShortLabel.includes(s) ||
          fullName.includes(s) || 
          fieldsChanged.includes(s)
        );
      });
    }

    setLogs(rawData);
    setTotalPages(res.data?.record.meta?.last_page || 1);
  } catch (err) {
    console.error("Failed to fetch logs", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchLogs(page);
    }, 400); 
    return () => clearTimeout(timer);
  }, [page, filters, search]);

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{ width: "100%",maxWidth:"100%",minWidth:"100%" }}>
 <thead>
  <tr>
    <th>#</th>
    <th>Trip ID</th>
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
    <tr><td colSpan="9">Loading...</td></tr>
  ) : logs.length === 0 ? (
    <tr>
      <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
        {search ? `No logs found matching "${search}"` : "No logs found"}
      </td>
    </tr>
  ) : (
    logs.map((l, i) => {
      const changes = normalizeWhatChanged(l.what_changed);

      return changes.length > 0 ? (
        changes.map((c, index) => (
          <tr key={`${l.log_uuid}-${index}`}>
            <td>{index === 0 ? (page - 1) * 10 + i + 1 : ""}</td>
            <td>{index === 0 ? `Trip 0${l.entity_id}` : ""}</td>
            <td className={`log-action ${l.action}`}>
              {index === 0 ? l.action : ""}
            </td>
            <td>{index === 0 ? l.entity : ""}</td>
            <td><strong>{c.field}</strong></td>
            <td>{String(c.from)}</td>
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
          <td>{ "Trip" + l.entity_id}</td>
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
