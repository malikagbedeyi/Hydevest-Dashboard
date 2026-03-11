import React, { useEffect, useState } from 'react'
import { Plus, X, Edit, Trash2, ChevronDown, ChevronUp, Paperclip } from "lucide-react";
import { ContainerServices } from '../../../../../services/Trip/container';

const TripContainerData = ({ containerData, setContainerData, handleContainerRowClick, handleDeleteContainer, avgContainerRate, tripUuid, reloadKey}) => {

   
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

const formatMoney = (value) =>
  new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 10,
  }).format(Number(value || 0));

const formatMoneyUSd = (value) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 10,
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
          const res = await ContainerServices.list({
            trip_uuid: tripUuid,
            status: '', 
            title: search,
            container_unique_id: '', 
             date_created: '',
            from_date: '',
            to_date: '', 
            page: pageNum,
          });
          setContainerData(res.data?.record?.data || []);
          setPagination(res.data?.record || {});
        } catch (err) {
          console.error("Error fetching expenses:", err);
        } finally {
          setLoading(false);
        }
      };
      
useEffect(() => {
  fetchData(page);
}, [page, reloadKey]);

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

  const surcharge =
    item.funding?.toLowerCase() === "partner"
      ? Number(item.surcharge_ngn || 0)
      : 0;

  return usd * (Number(rate) || 0) + surcharge;
};

const calculateQuotedContainerUSD = (item) => {
  return (
    (Number(item.quoted_price_usd) || 0) +
    (Number(item.shipping_amount_usd) || 0)
  );
};

const calculateQuotedContainerNGN = (item, rate) => {
  const usd = calculateQuotedContainerUSD(item);

  const surcharge =
    item.funding?.toLowerCase() === "partner"
      ? Number(item.surcharge_ngn || 0)
      : 0;

  return usd * (Number(rate) || 0) + surcharge;
};
  return (
    <div>
      <div className="userTable">
      <div className="table-wrap">
        <table className="table" style={{width:"150%"}}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Title</th>
              <th>Description</th>
               <th>Container Number</th>
               <th>Pieces</th>
               <th>Unit Price (USD)</th>
               <th>Shipping Amount (USD)</th>
               <th>Surcharge NGN</th>
               <th>Amount (USD)</th>
               <th>Amount (NGN)</th>
               <th>Quoted Amount (USD)</th>
               <th>Quoted Amount (NGN)</th>
               <th>Created By</th>
              <th>Status</th>
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
                  <td>{item.title}</td>
                  <td>{item.desc || "-"}</td>
                  <td>TRN {item.tracking_number || "-"}</td>
                  <td>{formatMoney(item.pieces || 0)}</td>
                  <td>{formatMoneyUSd(item.unit_price_usd || 0)}</td>
                  <td>{formatMoneyUSd(Number(item.shipping_amount_usd) || 0)}</td>
                  <td>{formatMoney(Number(item.surcharge_ngn || 0))}</td>
                  <td>{formatMoneyUSd(calculateContainerUSD(item))}</td>
                  <td>{formatMoney(calculateContainerNGN(item, avgContainerRate))}</td>
                  <td>{formatMoneyUSd(calculateQuotedContainerUSD(item))}</td>
                   <td>{formatMoney(calculateQuotedContainerNGN(item, avgContainerRate))}</td>
                  <td>{item?.creator_info?.firstname} {item?.creator_info?.lastname}</td>
                  <td>{item.status === 1 ? <span style={{color:"green"}}>Approved</span> : <span style={{color:"orange"}}>Pending</span>}</td>
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
