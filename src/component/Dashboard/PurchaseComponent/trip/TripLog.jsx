import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

const TripLog = ({ trip, formatDate }) => {
  const LOG_KEY = `trip-${trip.id}-log-history`;

  const [logHistory, setLogHistory] = useState(() => {
    return JSON.parse(localStorage.getItem(LOG_KEY)) || [];
  });

  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(logHistory));
  }, [logHistory, LOG_KEY]);

  const handleDeleteLog = (id) => {
    setLogHistory((prev) => prev.filter((log) => log.id !== id));
  };

  /* ================= PAGINATION ================= */
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(logHistory.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;

  const currentLogs = logHistory.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="finance-section">
      <div className="userTable">
        <div className="table-wrap">
          <table className="table" style={{width:"100%",maxWidth:"100%",minWidth:"100%"}}> 
            <thead>
              <tr>
                <th>S/N</th>
                <th>Module</th>
                <th>Action</th>
                <th>Title</th>
                <th>Date & Time</th>
                {/* <th>Actions</th> */}
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
                  <tr key={log.id}>
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
                      {formatDate(log.date)}{" "}
                      {new Date(log.date).toLocaleTimeString()}
                    </td>
                    {/* <td>
                      <Trash2
                        size={16}
                        color="red"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteLog(log.id)}
                      />
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                Previous
              </button>
              <span>{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripLog;
