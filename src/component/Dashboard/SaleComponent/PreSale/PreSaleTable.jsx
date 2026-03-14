import React, { useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/table.scss";
import DrilldownPresale from "./DrilldownPresale";
import CreateSale from "../Sale/CreateSale";
import { Trash2 } from "lucide-react";
import { PresaleServices } from "../../../../services/Sale/presale";

const PreSaleTable = ({ preSales, page, lastPage, setPage, onEdit }) => {
  const tableData = preSales;
  // const [tableData, setTableData] = useState([]);

  const [showDataDetails, setShowDataDetails] = useState(false);
  const [showDataPresale, setShowDataPresale] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // 🔴 delete popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  /* ---------------------------------
     FETCH PRE-SALES FROM API
  ---------------------------------- */
// useEffect(() => {
//   const fetchPreSales = async () => {
//     try {
//       const response = await PresaleServices.list({});
//       const preSalesData = Array.isArray(response.data?.record?.data)
//         ? response.data.record.data
//         : [];
//       setTableData(preSalesData);
//     } catch (error) {
//       console.error("Failed to fetch pre-sales:", error);
//       setTableData([]);
//     }
//   };
//   fetchPreSales();
// }, []);

const currentData = preSales;


  const openDataDetails = (sale) => {
    setSelectedData(sale);
    setShowDataDetails(true);
  };

  // 🔴 open delete popup
  const openDeletePopup = (e, sale) => {
    e.stopPropagation();
    setSaleToDelete(sale);
    setShowDeletePopup(true);
  };

  // ✅ confirm delete
  const confirmDelete = () => {
    if (!saleToDelete) return;
    // onDelete(saleToDelete.createdAt);
    setShowDeletePopup(false);
    setSaleToDelete(null);
  };

  // ❌ cancel delete
  const cancelDelete = () => {
    setShowDeletePopup(false);
    setSaleToDelete(null);
  };
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


  // ------------------------------------
  // DRILL SUMMARY METRICS (WITH AVERAGES)
  // ------------------------------------

  const formatMoneyNGN = (value) =>
    value === "" ? "" : "₦" + Number(value).toLocaleString("en-NG");

  const formatNumber = (value) =>
    value === "" ? "" : Number(value).toLocaleString("en-NG");

  
  return (
    <>
      <div className="userTable">
        

        <div className="table-wrap">
          <table
            className="table"
            style={{ width: "150%", minWidth: "150%", maxWidth: "135%" }}
          >
            <thead>
              <tr>
                <th>S/N</th>
                <th>Sale Option</th>
                {/* <th>Container</th> */}
                <th>Tracking Number</th>
                <th>WC Avg WT (kg)</th>
                <th>WC Pieces</th>
                <th>Price per Pic (₦)</th>
                 <th>Expected Revenue (₦)</th>
                 <th>Status</th>
                <th> No. of Pallets</th>
                 {/* <th>Pallet Pieces</th> */}
                
                <th>Price per KG (₦)</th>
                <th>Created By</th>
                <th>Date Created</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>

            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    No pre-sales yet
                  </td>
                </tr>
              ) : (
                currentData.map((sale, idx) => (
                  <tr key={sale.pre_sale_uuid} onClick={() => onEdit(sale)}>
                    <td>{  idx + 1}</td>
                    <td>{sale.sale_option}</td>
                    {/* <td>{Array.isArray(sale.container?.title)? sale.container.title.join(", "): sale.container?.title || "—"}</td> */}
                    <td>TRN-{sale.container.tracking_number}</td>
                    <td>{formatNumber(sale.wc_average_weight)}</td>
                    <td>{formatNumber(sale.wc_pieces)}</td>
                    <td>{formatMoneyNGN(sale.price_per_piece)}</td>
                      
                    <td>{formatMoneyNGN(sale.expected_sales_revenue)}</td>
                     <td><span className={`status ${sale.status === 1 ? "active" : "pending"}`}
                   style={{color:sale.status === 1 ? "green":"red"}}>
                    {sale.status === 1 ? "Approved" : "Pending"}</span></td>
                   <td>{formatNumber(sale.total_no_of_pallets)}</td>
                    <td>{formatMoneyNGN(sale.price_per_kg)}</td>
                 
                    <td>{sale?.creator_info?.firstname} {sale?.creator_info?.lastname}</td>
                    <td>{formatDate(sale.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* {totalPages > 1 && ( */}
<div className="pagination">
  <button onClick={() => setPage(page - 1)} disabled={page === 1}>
    Previous
  </button>

  <span>
    {page} / {lastPage}
  </span>

  <button onClick={() => setPage(page + 1)} disabled={page === lastPage}>
    Next
  </button>
</div>
          {/* )} */}
        </div>
      </div>

      {/* 🔥 DELETE CONFIRM POPUP */}
      {showDeletePopup && (
        <div className="trip-card-popup">
          <div className="trip-card-popup-container">
            <div className="popup-content">
              <div className="popup-proceeed-wrapper">
                <p>Are you sure you want to delete this Pre-sale?</p>
                <div className="btn-row-delete">
                  <button className="cancel" onClick={cancelDelete}>
                    Cancel
                  </button>
                  <button className="create" onClick={confirmDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreSaleTable;
