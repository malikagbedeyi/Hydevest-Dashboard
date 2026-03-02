import React, { useEffect, useState } from 'react'
import { Plus, X, Edit, Trash2, ChevronDown, ChevronUp, Paperclip } from "lucide-react";
import { ContainerServices } from '../../../../../services/Trip/container';

const TripContainerData = ({ containerData, setContainerData, handleContainerRowClick, handleDeleteContainer, avgContainerRate, tripUuid, reloadKey}) => {

   
   const [search , setSearch ] = useState('')
      const [page,setPage] = useState(1)
      const [pagination,setPagination] = useState({})
    const [selectedData, setSelectedData] = useState(null);
    const [loading, setLoading] = useState(false);
    
  //  containerData = data
 const formatMoney = (value) =>
  new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(Math.round(Number(value || 0)));


const formatMoneyUSd = (value) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(Number(value || 0)));


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
        fetchData(page)
      },[page])
      
      useEffect(() => {
        const timer = setTimeout(() => {
          setPage(1);
          fetchData(1);
        }, 400);
      
        return () => clearTimeout(timer);
      }, [search,reloadKey]);
      
      const calculateContainerUSD = (item) => {
  const base =
    (Number(item.unit_price_usd) || 0) * (Number(item.pieces) || 0) +
    (Number(item.shipping_amount_usd) || 0);

  const surcharge =
    item.funding === "partner" ? Number(item.surcharge || 0) : 0;

  return base + surcharge;
};

const calculateContainerNGN = (item, rate) =>
  calculateContainerUSD(item) * (Number(rate) || 0);


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
               <th>Amount (USD)</th>
               <th>Amount (NGN)</th>
               <th>Quoted Amount (USD)</th>
               <th>Quoted Amount (NGN)</th>
              <th>Created Date</th>
              <th>Status</th>
              <th>Actions</th>
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
                  <td>{String(idx + 1).padStart(2, "0")}</td>
                  <td>{item.title}</td>
                  <td>{item.desc || "-"}</td>
                  <td>TRN {item.tracking_number || "-"}</td>
                  <td>{formatMoney(item.pieces || 0)}</td>
                  <td>{formatMoney(item.unit_price_usd || 0)}</td>
                  <td>{formatMoneyUSd(((item.unit_price_usd || 0) * (item.pieces || 0)) +Number(item.shipping_amount_usd || 0))}</td>
                  <td>{formatMoney(item.amountNGN)}</td>
                  <td>{formatMoneyUSd(item.quoted_price_usd || "0")} </td>
                  <td>{formatMoney(item.quotedNGN)}</td>
                  <td>{formatDate(item.created_at)}</td>
                  <td>{item.status === 1 ? <span style={{color:"green"}}>Approved</span> : <span style={{color:"orange"}}>Pending</span>}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <Trash2 size={16}
                    color="red" style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteContainer(item.id)}/></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}

export default TripContainerData
