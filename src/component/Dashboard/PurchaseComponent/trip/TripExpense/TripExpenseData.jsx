import React, { useEffect, useState } from 'react'
import { Plus, X, Edit, Trash2, ChevronDown, ChevronUp, Paperclip } from "lucide-react";
import { ExpenseServices } from '../../../../../services/Trip/expense';

const TripExpenseData = ({handleRowClick ,reloadKey,tripUuid, openDeletePopup , financeData ,setFinanceData}) => {
   
    const [search , setSearch ] = useState('')
    const [page,setPage] = useState(1)
    const [pagination,setPagination] = useState({})
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(false);

const currentPage = pagination.current_page || 1;
const totalPages = pagination.last_page || 1;

const nextPage = () => {
  if (currentPage < totalPages) {
    setPage(currentPage + 1);
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    setPage(currentPage - 1);
  }
};

    const formatCurrency = (value, currencyCode) => {
        const SAFE_CURRENCY_CODES = ["USD", "GBP", "EUR", "CAD", "AUD", "JPY", "CNY", "ZAR", "GHS", "NGN",];
      
        const safeCode = SAFE_CURRENCY_CODES.includes(currencyCode)
          ? currencyCode
          : "USD"; // fallback
      
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: safeCode,
          minimumFractionDigits: 2,
        }).format(Number(value || 0));
      };
      
  
  const formatNGN = (value) =>
  new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "NGN",
  }).format(Number(value || 0));

  const formatDate = (date) =>
    date
      ? new Date(date)
          .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          .replace(/ /g, "-")
      : "-";

const fetchData = async (pageNum = page) => {
  if (!tripUuid) return; 

  try {
    setLoading(true);
    const res = await ExpenseServices.list({
      trip_uuid: tripUuid,
      status: '', 
      is_container_payment: '',
      title: search, 
      expense_unique_id: '', 
      from_date: '',
      to_date: '',
      page: pageNum,
    });
    setFinanceData(res.data?.record?.data || []);
    setPagination(res.data?.record || {});
  } catch (err) {
    console.error("Error fetching expenses:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData(page);
}, [page, reloadKey, tripUuid]);

useEffect(() => {
  const timer = setTimeout(() => {
    if (page !== 1) setPage(1);
    fetchData(1);
  }, 400);

  return () => clearTimeout(timer);
}, [search]);
const currentData = financeData


  return (
    <div>
     <div className="userTable">
              <div className="table-wrap">
                <table className="table" style={{ width: "150%",maxWidth:"150%",minWidth:"150%" }}>
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Title</th>
                      {/* <th>Description</th> */}
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Currency</th>
                      <th>Rate</th>
                      <th>Amount (₦)</th>
                      <th>Category</th>
                      <th>Created By</th>
                      <th>Created Date</th>
                      {/* <th>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan="11" style={{ textAlign: "center" }}>
                          No Trip Expense Data Found
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id} onClick={() => handleRowClick(item)}>
                          <td>{(pagination.from || 0) + idx}</td>
                          <td>{item.title}</td>
                          {/* <td>{item.desc}</td>  */}
                                                    <td>
  {item.status === 1 ? (
    <span style={{color:"green"}}>Approved</span>
  ) : (
    <span style={{color:"orange"}}>Pending</span>
  )}
</td>
                          <td>{formatCurrency(item.amount, item.currency)}</td>
                          <td>{item.currency} </td> 
                           <td>{item.rate}</td>
                           <td>{formatNGN(item.total_amount)}</td>
                            <td>{item.is_container_payment === 1? "Container Payment": "General"}</td>
                           <td>{item.creator_info.firstname} {item.creator_info.lastname}</td>
  
<td>{formatDate(item.created_at)}</td>

                          {/* <td onClick={(e) => e.stopPropagation()}>
                            <button
                              className="delete-btn"
                              onClick={() => openDeletePopup(item)}
                              style={{ background: "transparent", border: "none", cursor: "pointer" }}
                            >
                              <Trash2 color="red" size={16} />
                            </button>
                          </td> */}
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

    <span>
      Page {currentPage} of {totalPages}
    </span>

    <button onClick={nextPage} disabled={currentPage === totalPages}>
      Next
    </button>
  </div>
)}
              </div>
            </div>
    </div>
  )
}

export default TripExpenseData
