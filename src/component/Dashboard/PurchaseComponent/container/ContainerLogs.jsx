import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { ContainerServices } from "../../../../services/Trip/container";

const ContainerLogs = ({ containerUuid }) => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  /* ================= FETCH LOGS ================= */
  useEffect(() => {
    if (!containerUuid) return;

    const fetchLogs = async () => {
      try {
        const res = await ContainerServices.log({
          container_uuid: containerUuid, // ✅ CORRECT
        });

        setLogs(res.data?.record || []);
      } catch (err) {
        console.error("Error fetching container logs:", err);
      }
    };

    fetchLogs();
  }, [containerUuid]);


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
                  <tr key={idx}>
                    <td>{startIndex + idx + 1}</td>
                    <td>{log.module}</td>
                    <td>
                      <span
                        style={{
                          color:
                            log.action === "Created"
                              ? "green"
                              : log.action === "Deleted"
                              ? "red"
                              : "orange",
                          fontWeight: 600,
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td>{log.title}</td>
                    <td>
                      {log.created_at}
                    </td>
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

export default ContainerLogs;
