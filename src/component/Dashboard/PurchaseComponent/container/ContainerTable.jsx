import React from "react";
import { Trash2 } from "lucide-react";
import "../../../../assets/Styles/dashboard/table.scss";

const ContainerTable = ({data,loading,page,setPage,pagination,onRowClick,}) => {

  const formatDate = (date) =>
    date
      ? new Date(date)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-")
      : "-";

  const formatMoneyUSD = (value) =>
    "$" +
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(Math.round(Number(value || 0)));

  const formatMoneyNGN = (value) =>
    value === null || value === undefined
      ? "—"
      : "₦" +
        new Intl.NumberFormat("en-NG", {
          maximumFractionDigits: 0,
        }).format(Math.round(Number(value)));

  return (
    <div className="userTable">
      <div className="table-wrap">
        <table
          className="table"
          style={{ width: "130%", minWidth: "130%" ,maxWidth:"130%"}}
        >
          <thead>
            <tr>
              <th>S/N</th>
              <th>Title</th>
              <th>Description</th>
              <th>Container Number</th>
              <th>Pieces</th>
              <th>Unit Price (USD)</th>
              <th>Amount (USD)</th>
              {/* <th>Amount (NGN)</th> */}
              <th>Quoted Amount (USD)</th>
              {/* <th>Quoted Amount (NGN)</th> */}
              <th>Created Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="13" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="13" style={{ textAlign: "center" }}>
                  No Containers Found
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={item.container_uuid}
                  onClick={() => onRowClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{String(idx + 1).padStart(2, "0")}</td>
                  <td>{item.title}</td>
                  <td>{item.desc || "-"}</td>
                  <td>TRN {item.tracking_number || "-"}</td>
                  <td>{Number(item.pieces || 0).toLocaleString()}</td>
                  <td>{formatMoneyUSD(item.unit_price_usd)}</td>
                  <td>{formatMoneyUSD(item.amountUSD)}</td>
                  {/* <td>{formatMoneyNGN(item.amountNGN)}</td> */}
                  <td>{formatMoneyUSD(item.quotedUSD)}</td>
                  {/* <td>{formatMoneyNGN(item.quotedNGN)}</td> */}
                  <td>{formatDate(item.created_at)}</td>
                  <td>
                    {item.status === 1 ? (
                      <span style={{ color: "green" }}>
                        Approved
                      </span>
                    ) : (
                      <span style={{ color: "orange" }}>
                        Pending
                      </span>
                    )}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <Trash2
                      size={16}
                      color="red"
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {pagination?.last_page > 1 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>
              {page} / {pagination.last_page}
            </span>
            <button
              disabled={page === pagination.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContainerTable;