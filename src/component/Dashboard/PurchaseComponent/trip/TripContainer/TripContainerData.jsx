import React, { useEffect, useState } from 'react'
import { Plus, X, Edit, Trash2, ChevronDown, ChevronUp, Paperclip } from "lucide-react";
import { ContainerServices } from '../../../../../services/Trip/container';
import { ExpenseServices } from '../../../../../services/Trip/expense';

const TripContainerData = ({ containerData, setContainerData, handleContainerRowClick, handleDeleteContainer, avgContainerRate, tripUuid, reloadKey}) => {

   
   const [search , setSearch ] = useState('')
      const [page,setPage] = useState(1)
      const [pagination,setPagination] = useState({})
    const [selectedData, setSelectedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generalShare, setGeneralShare] = useState(0);

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

const formatMoney = (value) =>
  new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatMoneyUSd = (value) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
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
      
      const [res, expRes] = await Promise.all([
        ContainerServices.list({ trip_uuid: tripUuid, title: search, page: pageNum }),
        ExpenseServices.list({ trip_uuid: tripUuid })
      ]);

      const containers = res.data?.record?.data || [];
      const expenses = expRes.data?.record?.data || [];
      
      const totalGeneralNGN = expenses.reduce((sum, item) => {
        return Number(item.is_container_payment) === 0 ? sum + Number(item.total_amount || 0) : sum;
      }, 0);

      const totalCount = res.data?.record?.total || containers.length;
      const share = totalCount > 0 ? (totalGeneralNGN / totalCount) : 0;
      
      setGeneralShare(share);
      setContainerData(containers);
      setPagination(res.data?.record || {});
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page, reloadKey, search]);


useEffect(() => {
  const timer = setTimeout(() => {
    setPage(1);
  }, 400);

  return () => clearTimeout(timer);
}, [search]);
      
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

const calculateLandingCost = (item, rate) => {
    return calculateContainerNGN(item, rate) + generalShare;
  };

  return (
    <div>
      <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{width:"150%"}}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Status</th>
              {/* <th>Description</th> */}
               <th>Container Number</th>
               <th>Pieces</th>
               <th>Average Weight</th>
               <th>Max Weight</th>
               <th>Unit Price ($)</th>
               <th style={{ color: "#581aae", fontWeight: "bold" }}>Landing Cost (₦)</th>
                <th>Shipping Amount ($)</th>
                 <th>Surcharge (₦)</th>
               <th>Amount ($)</th>
               <th>Amount (₦)</th>
               <th>Quoted Amount ($)</th>
               <th>Quoted Amount (₦)</th>
               <th>Created By</th>
              <th>Created Date</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {containerData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Container Data Found
                </td>
              </tr>
            ) : (
              containerData.map((item, idx) => (
                <tr key={item.id} onClick={() => handleContainerRowClick(item)}
                style={{ cursor: "pointer" }}>
                  <td>{(pagination.from || 0) + idx}</td>
                  <td>{item.status === 1 ? <span style={{color:"green"}}>Approved</span> : <span style={{color:"orange"}}>Pending</span>}</td>
                  {/* <td>{item.desc || "-"}</td> */}
                  <td>TRN-{item.tracking_number || "-"}</td>
                  <td>{formatMoney(item.pieces || 0)}</td>
                  <td>{formatMoney(item.average_weight)}</td>
                  <td>{formatMoney(item.max_weight)}</td>
                  <td>${formatMoneyUSd(item.unit_price_usd || 0)}</td>
                  <td style={{ fontWeight: "600" }}>₦{formatMoney(calculateLandingCost(item, avgContainerRate))}</td>
                <td>${formatMoneyUSd(Number(item.shipping_amount_usd) || 0)}</td>
                  <td>₦{formatMoney(Number(item.surcharge_ngn || 0))}</td>
                  <td>${formatMoneyUSd(calculateContainerUSD(item))}</td>
                  <td>₦{formatMoney(calculateContainerNGN(item, avgContainerRate))}</td>
                  <td>${formatMoneyUSd(calculateQuotedContainerUSD(item))}</td>
                   <td>₦{formatMoney(calculateQuotedContainerNGN(item, avgContainerRate))}</td>
                  <td>{item?.creator_info?.firstname} {item?.creator_info?.lastname}</td>
                  <td>{formatDate(item.created_at)}</td>
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

export default TripContainerData
