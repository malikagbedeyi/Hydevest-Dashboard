import React, { useState, useEffect } from "react";
import '../../../../assets/Styles/dashboard/Sale/presaleTable.scss';
import { Trash2 } from "lucide-react";
import DrilldownSale from "./DrildownSale";

const SaleTable = ({ sales, onDelete, onUpdate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [tableData, setTableData] = useState([]);

  const [selectedSale, setSelectedSale] = useState(null); // Track clicked sale

  // 🔴 delete popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  useEffect(() => {
    setTableData(sales || []);
  }, [sales]);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = tableData.slice(startIndex, startIndex + itemsPerPage);
  const nextPage = () => currentPage < totalPages && setCurrentPage(p => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(p => p - 1);

  const openDeletePopup = (e, sale) => {
    e.stopPropagation();
    setSaleToDelete(sale);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (!saleToDelete) return;
    onDelete(saleToDelete.id); // pass the id to parent
    setShowDeletePopup(false);
    setSaleToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setSaleToDelete(null);
  };

  const handleRowClick = (sale) => {
    setSelectedSale(sale);
  };

  const handleUpdate = (updatedSale) => {
    if (onUpdate) onUpdate(updatedSale);
    setSelectedSale(null);
  };
  const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(value || 0);
  const formatDate = (date) => {
    if (!date) return "";
  
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replace(/ /g, "-");
  };
  
  if (selectedSale) {
    return <DrilldownSale data={selectedSale} goBack={() => setSelectedSale(null)} onUpdate={handleUpdate} />;
  }

  return (
    <>
      <div className="userTable">
        
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>S/N</th>
                {/* <th>Sale Option</th> */}
                <th>Container</th>
                <th>No. of Pallets</th>
                <th>Purchase Price Per Price </th>
                <th>Customer Name</th>
                <th>Customer Phone</th> 
                <th>Total Sale Amount</th>
                <th>Amount Paid</th>
                 <th>Balance</th>
                <th>Date Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>No sales yet</td>
                </tr>
              ) : (
                currentData.map((sale, idx) => (
                  <tr key={sale.id} onClick={() => handleRowClick(sale)}>
                    <td>{startIndex + idx + 1}</td>
                    {/* <td>{sale.saleOption}</td> */}
                    <td>{sale.containers?.map(c => c.name).join(", ")}</td>
                    <td>{sale.noOfPallets}</td>
                    <td>{sale.purchasePricePerPiece}</td>
                    <td>{sale.customer?.name}</td>
                    <td>{sale.customer?.phone}</td>
                    <td>{formatCurrency(sale.totalSaleAmount)}</td>
                    <td>{formatCurrency(sale.amountPaid)}</td>
                    <td>{sale.balance === 0 ? <span style={{ color: "green" }}>Fully Paid</span>
                     : formatCurrency(sale.balance)
                    }</td>
                    <td>{formatDate(sale.createdAt)}</td>
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
                <p>Are you sure you want to delete this sale?</p>
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

export default SaleTable;
