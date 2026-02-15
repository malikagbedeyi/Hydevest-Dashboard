import React, { useEffect, useState } from "react";
import "../../../../assets/Styles/dashboard/table.scss";
import { EntityServices } from "../../../../services/Admin/EntityServices";

const EntityLog = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

const flattenWhatChanged = (whatChanged = {}) => {
  const rows = [];

  Object.entries(whatChanged).forEach(([section, fields]) => {
    Object.entries(fields).forEach(([field, value]) => {
      rows.push({
        field: `${section}.${field}`,
        from: value.from ?? "-",
        to: value.to ?? "-",
      });
    });
  });

  return rows;
};

  const fetchLogs = async (pageValue = page) => {
    try {
      setLoading(true);
      const res = await EntityServices.log({
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
    <th>Date</th>
  </tr>
</thead>


          <tbody>
  {loading ? (
    <tr>
      <td colSpan="7">Loading...</td>
    </tr>
  ) : logs.length === 0 ? (
    <tr>
      <td colSpan="7">No logs found</td>
    </tr>
  ) : (
    logs.map((l, i) => {
      const changes = flattenWhatChanged(l.what_changed);

      return changes.length > 0 ? (
        changes.map((c, index) => (
          <tr key={`${l.log_uuid}-${index}`}>
            <td>{index === 0 ? (page - 1) * 10 + i + 1 : ""}</td>
            <td>{index === 0 ? l.action : ""}</td>
            <td>{index === 0? `${l.entity?.firstname ?? ""} ${l.entity?.lastname ?? ""}`: ""}</td>
            <td><strong>{c.field}</strong></td>
            <td>{String(c.from)}</td>
            <td>{String(c.to)}</td>
            <td>{index === 0 ? new Date(l.created_at).toLocaleString()  : ""} </td>
          </tr>
        ))
      ) : (
<tr key={l.log_uuid}>
  <td>{(page - 1) * 10 + i + 1}</td>
  <td>{l.action}</td>
  <td>{`${l.entity?.firstname ?? ""} ${l.entity?.lastname ?? ""}`}</td>
  <td colSpan="3">No field changes</td>
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

export default EntityLog
