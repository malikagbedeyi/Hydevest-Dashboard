import React from "react";
import { Trash2 } from "lucide-react";
import "../../../../assets/Styles/dashboard/table.scss";

const ContainerTable = ({data,loading,page,setPage,pagination,onRowClick, avgContainerRate,totalGeneralNGN ,getRate }) => {

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

const formatMoney = (value) =>
  new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatMoneyUSD = (value) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

  const calculateContainerUSD = (item) => {
  return (
    (Number(item.unit_price_usd) || 0) *
    (Number(item.pieces) || 0) +
    (Number(item.shipping_amount_usd) || 0)
  );
};

const calculateContainerNGN = (item, rate) => {
  const usd = calculateContainerUSD(item);
  const surcharge = item.funding?.toLowerCase() === "partner" ? Number(item.surcharge_ngn || 0) : 0;
  
  // Math happens with full decimals
  return (usd * Number(rate)) + surcharge; 
};

const calculateQuotedContainerUSD = (item) => {
  const isPartner = item.funding?.toLowerCase() === "partner";
  const quotedPrice = Number(item.quoted_price_usd) || 0;
  if (!isPartner || quotedPrice === 0) return 0;
  return quotedPrice + (Number(item.shipping_amount_usd) || 0);
};

const calculateQuotedContainerNGN = (item, rate) => {
  const usd = calculateQuotedContainerUSD(item);
  if (usd === 0) return 0;

  const surcharge = Number(item.surcharge_ngn || 0);
  return usd * (Number(rate) || 0) + surcharge;
};


  return (
    
    <div className="userTable">
      <div className="table-wrap">
        <table
          className="table"
          style={{ width: "130%", minWidth: "170%" ,maxWidth:"170%"}}
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
              <th>Amount (NGN)</th>
              <th>Quoted Price (USD)</th>
               <th>Quoted Amount (USD)</th>
              <th>Quoted Amount (NGN)</th>
              <th>Created By</th>
              <th>Created Date</th>
              <th>Status</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>

<tbody>
  {loading ? (
    <tr><td colSpan="13" style={{ textAlign: "center" }}>Loading...</td></tr>
  ) : data.length === 0 ? (
    <tr><td colSpan="13" style={{ textAlign: "center" }}>No Containers Found</td></tr>
  ) : (
    data.map((item, idx) => {

      const itemRate = getRate(item.trip?.trip_uuid || item.trip_uuid) || 0;

      return (
        <tr key={item.container_uuid} onClick={() => onRowClick(item)} style={{ cursor: "pointer" }}>
          <td>{String(idx + 1).padStart(2, "0")}</td>
          <td>{item.title}</td>
          <td>{item.desc || "-"}</td>
          <td>TRN {item.tracking_number || "-"}</td>
          <td>{Number(item.pieces || 0).toLocaleString()}</td>
          <td>{formatMoneyUSD(item.unit_price_usd)}</td>
          <td>{formatMoneyUSD(calculateContainerUSD(item))}</td>
          <td>{itemRate > 0 ? formatMoney(calculateContainerNGN(item, itemRate)) : "₦0.00"}</td>
          <td>{item.quoted_price_usd}</td>
          <td>{formatMoneyUSD(calculateQuotedContainerUSD(item))}</td>
          <td>{itemRate > 0 ? formatMoney(calculateQuotedContainerNGN(item, itemRate)) : "₦0.00"}</td>
          <td>{item.creator_info.firstname} {item.creator_info.lastname}</td>
          <td>{formatDate(item.created_at)}</td>
          <td>
            {item.status === 1 ? (
              <span style={{ color: "green" }}>Approved</span>
            ) : (
              <span style={{ color: "orange" }}>Pending</span>
            )}
          </td>
        </tr>
      );
    })
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