import React, { useState, useEffect } from "react";
import '../../../../assets/Styles/dashboard/Sale/presaleTable.scss';
import { Trash2 } from "lucide-react";
import DrilldownSale from "./DrildownSale";

const SaleTable = ({ sales, page, lastPage, setPage, onDelete, handleRowClick }) => {

const currentData = sales;

  const [selectedSale, setSelectedSale] = useState(null); // Track clicked sale

  // 🔴 delete popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  useEffect(() => {
    // setTableData(sales || []);
  }, [sales]);


  const openDeletePopup = (e, sale) => {
    e.stopPropagation();
    setSaleToDelete(sale);
    setShowDeletePopup(true);
  };

const confirmDelete = () => {
  if (!saleToDelete) return;
  console.log("Deleting sale with UUID:", saleToDelete.sale_uuid);
  onDelete(saleToDelete.sale_uuid);
  setShowDeletePopup(false);
  setSaleToDelete(null);
};

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setSaleToDelete(null);
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
  
 
const totalSale = currentData.length;

const totalContainer = new Set(
  currentData.map((rec) => rec.container?.title)
).size;

const totalRecoveryAmount = currentData.reduce(
  (sum, rec) => sum + Number(rec.amount_paid || 0),
  0
);
const totalSaleAmount= currentData.reduce(
  (sum, rec) => sum + Number(rec.total_sale_amount || 0),
  0
);
const totalBalance= currentData.reduce(
  (sum, rec) => sum + Number(rec.total_sale_amount - rec.amount_paid || 0),
  0
);
  return (
    <>
      <div className="userTable mt-4">
         <div className="drill-summary-grid">
          <div className="drill-summary">
            <div className="summary-item">
              <p className="small">Total Recovery</p>
              <h2>{totalSale}</h2>
            </div>

            <div className="summary-item">
              <p className="small">Total Container</p>
              <h2>{totalContainer}</h2>
            </div>
            <div className="summary-item">
              <p className="small">Total Sale Amount (NGN)</p>
              <h2>{formatCurrency(totalSaleAmount)}</h2>
            </div>

            <div className="summary-item">
              <p className="small">Total Recovery Amount (NGN)</p>
              <h2>{formatCurrency(totalRecoveryAmount)}</h2>
            </div>
            <div className="summary-item">
              <p className="small">Total Balance (NGN)</p>
              <h2>{formatCurrency(totalBalance)}</h2>
            </div>

          </div>
        </div>
        <div className="table-wrap">
          <table className="table" style={{width:"150%",minWidth:"150%",maxWidth:"150%"}}>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Container</th>
                <th>Container Tracking Number</th>
                <th>Sale Option</th>
                {/* <th>Purchase Price Per Price </th> */}
                <th>Customer Name</th>
                <th>Customer Phone</th> 
                <th>Discount</th>
                <th>Total Sale Amount</th>
                <th>Total Amount Paid</th>
                 <th>Balance</th>
                 <th>Payment Status</th>
                <th>Date Created</th>
                <th>Status</th>
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
                    <td>{idx + 1}</td>
                    <td>{typeof sale.container?.title === "string"? sale.container.title: "—"}</td>
                    <td>TN {sale.container.tracking_number}</td>
                    <td> <span style={{padding: "4px 10px",borderRadius: "12px",fontSize: "12px", background:sale.presale.sale_option === "BOX SALE" ? "#f3e8ff" : "#e0f2fe",background:sale.presale.sale_option === "SPLIT SALE" ? "#8b51db" : "#e0f2fe",
                      color:sale.presale.sale_option === "BOX SALE" ? "#581aae" : "#0369a1",color:sale.presale.sale_option === "SPLIT SALE" ? "#fff" : "#0369a1",}}>{sale.presale.sale_option || "—"}</span></td>
                    <td>{sale.customer.firstname || "—"} {sale.customer.lastname}</td>
                    <td>{sale.customer.phone_no || "—"}</td>
                    <td>{formatCurrency(sale.discount)}</td>
                    <td>{formatCurrency(sale.total_sale_amount || 0)}</td>
                    <td>{formatCurrency(sale.amount_paid || 0)}</td>
                    <td>
  {sale.total_sale_amount - sale.amount_paid <= 0 ? (
    <span style={{ color: "green" }}>Fully Paid</span>
    ) : (formatCurrency(sale.total_sale_amount - sale.amount_paid))}</td>
                    <td style={{color:sale?.payment_status === "Full Payment" ? "green":"orange"}}>{sale?.sale_payments?.[0]?.payment_status}</td>
                    <td>{formatDate(sale.created_at)}</td>
                    <td><span className={`status ${sale.status === 1 ? "Approve" : "pending"}`}
                   style={{color:sale.status === 1 ? "green":"red"}}>
                    {sale.status === 1 ? "Approve" : "Pending"}</span></td>
                    <td onClick={(e) => e.stopPropagation()}>   
                      <button  className="delete-btn" onClick={(e) => openDeletePopup(e, sale)} disabled={!sale.sale_uuid}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {lastPage > 1 && (
  <div className="pagination">
    <button
      onClick={() => setPage(page - 1)}
      disabled={page === 1}
    >
      Previous
    </button>

    <span>{page} / {lastPage}</span>

    <button
      onClick={() => setPage(page + 1)}
      disabled={page === lastPage}
    >
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
