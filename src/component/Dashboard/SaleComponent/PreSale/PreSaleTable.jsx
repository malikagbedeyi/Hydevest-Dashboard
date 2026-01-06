import React, { useState, useEffect } from "react";
import "../../../../assets/Styles/dashboard/Sale/presaleTable.scss";
import DrilldownPresale from "./DrilldownPresale";
import CreateSale from "../Sale/CreateSale";
import { Trash2, X } from "lucide-react";

const PreSaleTable = ({ preSales, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [tableData, setTableData] = useState([]);

  const [showDataDetails, setShowDataDetails] = useState(false);
  const [showDataPresale, setShowDataPresale] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // 🔴 delete popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  useEffect(() => {
    setTableData(preSales || []);
  }, [preSales]);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = tableData.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage(p => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(p => p - 1);

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
    onDelete(saleToDelete.createdAt);
    setShowDeletePopup(false);
    setSaleToDelete(null);
  };

  // ❌ cancel delete
  const cancelDelete = () => {
    setShowDeletePopup(false);
    setSaleToDelete(null);
  };
// ------------------------------------
// DRILL SUMMARY METRICS (WITH AVERAGES)
// ------------------------------------
const metrics = tableData.reduce(
  (acc, sale) => {
    const wcPieces = Number(sale.wcPieces) || 0;
    const pricePerPic = Number(sale.pricePerPic);
    const pricePerKg = Number(sale.pricePerKg);

    const containersCount = Array.isArray(sale.containerNames)
      ? sale.containerNames.length
      : 0;

    acc.totalPreSales += 1;
    acc.totalWcPieces += wcPieces;
    acc.totalContainers += containersCount;

    // Only count valid prices
    if (!isNaN(pricePerPic) && pricePerPic > 0) {
      acc.sumPricePerPic += pricePerPic;
      acc.countPricePerPic += 1;
    }

    if (!isNaN(pricePerKg) && pricePerKg > 0) {
      acc.sumPricePerKg += pricePerKg;
      acc.countPricePerKg += 1;
    }

    return acc;
  },
  {
    totalPreSales: 0,
    totalWcPieces: 0,
    totalContainers: 0,

    sumPricePerPic: 0,
    sumPricePerKg: 0,

    countPricePerPic: 0,
    countPricePerKg: 0,
  }
);

// ✅ Final averages
const avgPricePerPic =
  metrics.countPricePerPic > 0
    ? metrics.sumPricePerPic / metrics.countPricePerPic
    : 0;

const avgPricePerKg =
  metrics.countPricePerKg > 0
    ? metrics.sumPricePerKg / metrics.countPricePerKg
    : 0;


  if (showDataDetails) {
    return (
      <DrilldownPresale
        data={selectedData}
        goBack={() => setShowDataDetails(false)}
      />
    );
  }

  if (showDataPresale) {
    return (
      <CreateSale
        preSales={preSales}
        setView={() => setShowDataPresale(false)}
      />
    );
  }

  return (
    <>
      <div className="userTable">
      <div className="drill-summary-grid">
  <div className="drill-summary">

    <div className="summary-item">
      <p className="small">Total Pre-Sale</p>
      <h2>{metrics.totalPreSales}</h2>
    </div>

    <div className="summary-item">
      <p className="small">Total WC Pieces</p>
      <h2>{metrics.totalWcPieces.toLocaleString()}</h2>
    </div>

    <div className="summary-item">
      <p className="small">Total Container</p>
      <h2>{metrics.totalContainers}</h2>
    </div>

    <div className="summary-item">
  <p className="small">Average Price Per Pic (NGN)</p>
  <h2>₦{avgPricePerPic.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h2>
</div>

<div className="summary-item">
  <p className="small">Average Price per KG (NGN)</p>
  <h2>₦{avgPricePerKg.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h2>
</div>


  </div>
</div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Sale Option</th>
                <th>Container</th>
                <th>WC Avg Weight (kg)</th>
                <th>WC Pieces</th>
                 <th>Price per Pic (NGN)</th>
                <th>Price per KG (NGN)</th>
                <th>No. of Pallets</th>
                <th>Expected Revenue (NGN)</th>
                <th>Status</th>
                <th>Date Created</th>
                <th>Action</th>
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
                  <tr
                    key={sale.createdAt}
                    onClick={() => openDataDetails(sale)}
                  >
                    <td>{startIndex + idx + 1}</td>
                    <td>{sale.saleOption}</td>
                    <td>{sale.containerNames?.join(", ")}</td>
                    <td>{sale.wcAverageWeight}</td>
                    <td>{sale.wcPieces}</td>
                    <td>{sale.pricePerPic}</td>
                    <td>{sale.pricePerKg}</td>
                    <td>{sale.noOfPallets || "-"}</td>
                    <td>{sale.expectedRevenue}</td>
                    <td>{sale.status}</td>
                    <td>{new Date(sale.createdAt).toLocaleDateString()}</td>

                    <td onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="delete-btn"
                        onClick={(e) => openDeletePopup(e, sale)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={prevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button onClick={nextPage} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          )}
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
