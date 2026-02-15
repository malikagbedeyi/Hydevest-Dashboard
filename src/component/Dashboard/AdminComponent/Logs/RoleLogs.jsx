import React, { useEffect, useState } from "react";
import RoleService from "../../../../services/Admin/RoleService";
import "../../../../assets/Styles/dashboard/table.scss";

const RoleLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async (pageValue = page) => {
    try {
      setLoading(true);

      const res = await RoleService.getRoleLogs({
        page: pageValue,
      });

      setLogs(res.data);
     
      setTotalPages(res.meta.last_page || 1);
    } catch (err) {
      console.error("Failed to fetch role logs", err);
    } finally {
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
              <th>Role Name</th>
              <th>Action</th>
              <th>Before</th>
              <th>After</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Loading logs...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No role logs found
                </td>
              </tr>
            ) : (
              logs.map((log, idx) => (
                <tr key={log.log_uuid || idx}>
                  <td>{(page - 1) * 10 + idx + 1}</td>
                  <td>{log.role?.name || "-"}</td>
                  <td>{log.action || "-"}</td>
                  <td>{log.before?.name || "-"}</td>
                    <td>{log.after?.name || "-"}</td>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleLogs;
