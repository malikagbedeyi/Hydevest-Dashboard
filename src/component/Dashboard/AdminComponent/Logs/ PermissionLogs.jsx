import React, { useEffect, useState } from "react";
import PermissionService from "../../../../services/Admin/PermissionService";
import "../../../../assets/Styles/dashboard/table.scss";

const PermissionLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (pageValue = page) => {
    try {
      setLoading(true);
      const res = await PermissionService.getPermissionLogs({
        page: pageValue,
        date_created: "",
      });
      setLogs(res.data);
      setTotalPages(res.meta.last_page || 1);
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
              <th>S/N</th>
              <th>Permission</th>
              <th>Action</th>
              <th>Before</th>
              <th>After</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="5">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="5">No logs found</td></tr>
            ) : (
              logs.map((l, i) => (
                <tr key={l.log_uuid || i}>
                  <td>{(page - 1) * 10 + i + 1}</td>
                  <td>{l.name}</td>
                  <td>{l.action}</td>
                   <td>{l.before?.name || "-"}</td>
                    <td>{l.after?.name || "-"}</td>
                  <td>{new Date(l.created_at).toLocaleString()}</td>
                </tr>
              ))
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

export default PermissionLogs;
