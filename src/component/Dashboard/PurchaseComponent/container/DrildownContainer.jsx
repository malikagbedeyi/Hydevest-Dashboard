import React, { useState,useRef, useEffect } from "react";
import "../../../../assets/Styles/dashboard/Purchase/drildowncontainer.scss";
import {ChevronLeft,ChevronDown, ChevronUp, Paperclip, Download,  Edit,  Trash2,  X,  Eye,  File,  Plus, Calendar, SendHorizontal} from "lucide-react";
import { ContainerServices } from "../../../../services/Trip/container";
import Attachment from "./Attachment";
import Comment from "./Comment";
import ContainerLog from "./ContainerLog";

const fundingOption = ["PARTNER", "ENTITY"];

const DrildownContainer = ({container = {},goBack = () => {},onUpdate,avgContainerRate = 0,formatNumber,}) => {

  const safeFormatNumber =
  typeof formatNumber === "function"
    ? formatNumber
    
    : (num = 0) =>
        Number(num || 0).toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });

const [form, setForm] = useState({
  description: container?.desc || "",trackingNumber: container?.tracking_number || "",averageWeight: container?.average_weight || "",maxWeight: container?.max_weight || "",
entity: container?.entity_uuid || null,invoiceNumber: container?.invoice_number || "",sourceNation: container?.source_nation || "",sourcePort: container?.source_port || "",
  destinationPort: container?.destination_port || "",supplyCode: container?.supplier_code || "",
  unitpieces: container?.pieces || "",unitPrice: container?.unit_price_usd || "",warehouseChargeNGN: container?.warehouse_charge_ngn || "",offloadAndSorting: container?.offload_and_sorting || "",
  shipping_amount_usd: container?.shipping_amount_usd || "",funding: (container?.funding || "").toUpperCase(),
});


  /* EDIT STATES */
  const [edit, setEdit] = useState({
    description: false, destination: false,
    trackingNumber: false, sourceNation: false, unitpieces:false, sourcePart: false, supplyCode: false,
    destinationCountry: false, destinationPort: false, funding: false,  piece: false,
    unitPrice: false, warehouseChargeNGN: false,  offloadAndSorting:false ,shipping_amount_usd:false,
  });

const scrollRef = useRef(null);
     const [activeTab, setActiveTab] = useState("comments");
    const [fundingdrop, setFundingdrop] = useState("");
    const [openFundingdrop, setOpenFundingdrop] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [showUnitFee, setShowUnitFee] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
 const [approved, setApproved] = useState(false);
 const [showPartnerSection, setShowPartnerSection] = useState(false);
const [entities, setEntities] = useState([]);
const [entitySearch, setEntitySearch] = useState("");
const [openEntityDrop, setOpenEntityDrop] = useState(false);

const [loading, setLoading] = useState(false);

const filteredFundingdrop = fundingOption.filter((opt) =>
  opt.toUpperCase().includes(fundingdrop.toUpperCase())
);


useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
}, []);

const amountUsd =
  (Number(form.unitPrice) || 0) * (Number(form.unitpieces) || 0) +
  Number(form.shipping_amount_usd || 0);


const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
  const [attachments] = useState([
    { id: 1, name: "File A", size: "120KB" },
    { id: 2, name: "File B", size: "80KB" },
  ]);
 
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};

  const toggleEdit = (field) => {
    setEdit((s) => ({ ...s, [field]: !s[field] }));
  };
const handleUpdate = async () => {
  try {
    if (!container?.container_uuid) return;

    const fundingValue = (form.funding || "").trim().toUpperCase();
    if (!["PARTNER", "ENTITY"].includes(fundingValue)) {
      alert("Funding must be either PARTNER or ENTITY");
      return;
    }
    const entityValue = fundingValue === "ENTITY" ? form.entity : null;
    if (fundingValue === "ENTITY" && !entityValue) {
      alert("You must select a valid Entity for ENTITY funding");
      return;
    }

    const payload = {
      container_uuid: container.container_uuid,
      title: container.title || "",
      desc: form.description || "",
      tracking_number: form.trackingNumber || "",
      average_weight: Number(form.averageWeight || 0),
      max_weight: Number(form.maxWeight || 0),
      entity_uuid: entityValue, 
      invoice_number: form.invoiceNumber || "",
      source_nation: form.sourceNation || "",
      source_port: form.sourcePort || "",
      destination_port: form.destinationPort || "",
      funding: fundingValue,
      supplier_code: form.supplyCode || "",
      pieces: Number(form.unitpieces || 0),
      unit_price_usd: Number(form.unitPrice || 0),
      warehouse_charge_ngn: Number(form.warehouseChargeNGN || 0),
      offload_and_sorting: Number(form.offloadAndSorting || 0),
      shipping_amount_usd: Number(form.shipping_amount_usd || 0),
    };

    console.log("UPDATE PAYLOAD", payload);

    const res = await ContainerServices.edit(payload);

    const updated = {
      ...container,
      ...payload,
    };
    console.log("FINAL PAYLOAD", payload);

    onUpdate(updated);
    goBack();
  } catch (err) {
    console.error("Container update failed:", err.response?.data || err);
    alert(
      "Update failed. Check the console for details or verify the data you're sending."
    );
  }
};

  /** ---------- APPROVE / CHANGE APPROVAL HANDLER ---------- */
const handleApprovalChange = async () => {
  try {
    if (!container?.container_uuid) return;

    setLoading(true);

    const newStatus = approved ? 0 : 1;

    const payload = {
      container_uuid: container.container_uuid,
      status: newStatus,
    };

    await ContainerServices.change_approval(payload);

    setApproved(newStatus === 1);

    onUpdate({
      ...container,
      approved: newStatus === 1,
    });
  } catch (err) {
    console.error("Error changing approval:", err);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const fetchEntities = async () => {
    try {
      const res = await ContainerServices.entityList();
      const record = res?.data?.record;
      const entityArray = Array.isArray(record) ? record : record ? [record] : [];

      // Normalize all entities to have a `uuid` property
      const normalized = entityArray.map((e) => ({
        ...e,
        uuid: e.uuid || e.user_uuid, 
      }));

      setEntities(normalized);
    } catch (err) {
      console.error("Failed to fetch entities:", err);
    }
  };
  fetchEntities();
}, []);

  return (
  <div className="drill-container" ref={scrollRef}>
      {/* HEADER */}
      <div className="drill-top">
        <div className="drill-title">
        <h4 className="small-muted">Title: {container.title || "—"}</h4>
        <p>Container ID : {container.id}</p>
        </div>
        <div className="right-title">
             <div className="actions">
            {!approved && (
<button
  className="primary"
  onClick={handleApprovalChange}
  disabled={loading}
>
  {loading ? "Approving..." : "Approve"}
</button>

            )}
                 <div className="status">
                    <span>{approved ? "Approved" : "Not Approved"}</span>
                </div>

        </div>
        </div>
      </div>  
      <div className="drill-summary-grid">
      <div className="drill-summary">
      <div className="summary-item">
  <p className="small"> Amount (NGN)</p>
  <h2>
  ₦{safeFormatNumber(
    amountUsd * (Number(avgContainerRate) || 0) +
    (form.funding === "PARTNER" ? Number(form.surcharge || 0) : 0)
  )}
</h2>

</div>
<div className="summary-item">
  <p className="small">Unit Price (USD)</p>
  <h2>{form.unitPrice}</h2>
</div>
<div className="summary-item">
  <p className="small">Average  Weight(KG)</p>
  <h2>{form.averageWeight}</h2>
</div>

<div className="summary-item">
  <p className="small">Total Pieces</p>
  <h2>{form.unitpieces}</h2>
</div>
<div className="summary-item">
  <p className="small">Average Fx Rate</p>
  <h2>{safeFormatNumber(avgContainerRate)}</h2>
</div>

    </div>
    </div>
    <div className="section-grid">
      <div className="section-grid-container">
        <div className="section-grid-content">
      {/* ================= DETAILS ================= */}
      <section className="section details">
        <header className="section-head">
          <h3>Details</h3>
          <button className="section-head-icon" 
          onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? <ChevronUp /> : <ChevronDown />}
          </button>
        </header>
        {showDetails && (
            <div className="">
        <div className="Description-wrapper">
            <div className="label-content">
                <label>Description <span>*</span></label>
                 <Edit className="edit-btn" onClick={() => toggleEdit("description")} size={16} />
            </div>
            <div className="field">
              {edit.description ? (
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  autoFocus
                  onBlur={() => toggleEdit("description")}
                />
              ) : (
                <p>{form.description}</p>
              )}
            </div>
          </div>
         <div className="grid-2">
          <div className="form-group">
            <label htmlFor="">Average Weight</label>
            <input type="text"  value={form.averageWeight}   placeholder="Enter Average Weight "
            onChange={(e) =>  setForm({ ...form, averageWeight: e.target.value })}/>
            </div>
          <div className="form-group">
            <label htmlFor="">Max Weight</label>
            <input type="text" value={form.maxWeight}   placeholder="Enter Max Weight"
            onChange={(e) =>  setForm({ ...form, maxWeight: e.target.value })}/>
            </div>
<div className="form-group-select">
  <label>Entity</label>

  <div className="custom-select">
    <div
      className="custom-select-drop"
      onClick={() => setOpenEntityDrop(!openEntityDrop)}
    >
      <div className="select-box">
{form.entity ? (
  <span>
    {(() => {
      const selected = entities.find((e) => e.uuid === form.entity);
      return selected
        ? `${selected.firstname || ""} ${selected.lastname || ""}`.trim()
        : "—";
    })()}
  </span>
) : (
  <span className="placeholder">Select Entity</span>
)}

      </div>

      <ChevronDown className={openEntityDrop ? "up" : "down"} />
    </div>

    {openEntityDrop && (
      <div className="select-dropdown" style={{ zIndex: 99 }}>
        {entities.length === 0 ? (
          <div className="option-item">No entities found</div>
        ) : (
          entities.map((entity) => (
            <div
              key={entity.uuid || entity.id}
              className="option-item"
             onClick={() => {setForm((prev) => ({ ...prev, entity: entity.uuid })); 
              setOpenEntityDrop(false);}}>
              {`${entity.firstname || ""} ${entity.lastname || ""}`.trim() || "—"}
            </div>
          ))
        )}
      </div>
    )}
  </div>
</div>


            <div className="form-group">
            <label htmlFor="">Invoice Number</label>
            <input type="text" value={form.invoiceNumber}  placeholder="Enter Invoice Number"
            onChange={(e) =>  setForm({ ...form, invoiceNumber: e.target.value })}/>
            </div>
            <div className="form-group">
          <label>Tracking Number</label>
            <input  name="trackingNumber"   value={form.trackingNumber}
            onChange={(e) =>  setForm({ ...form, trackingNumber: e.target.value })}/>

        </div>
            <div className="form-group">
            <label htmlFor="">Source Nation</label>
            <input type="text" value={form.sourceNation}  placeholder="Enter Source Nation"
            onChange={(e) =>  setForm({ ...form, sourceNation: e.target.value })}/>
            </div>
            <div className="form-group">
            <label htmlFor="">Source Port</label>
            <input type="text" value={form.sourcePort}  placeholder="Enter Source Port"
            onChange={(e) =>  setForm({ ...form, sourcePort: e.target.value })}/>
            </div>
            <div className="form-group">
            <label htmlFor="">Destination Port</label>
            <input type="text" value={form.destinationPort}  placeholder="Enter Destination Port"
            onChange={(e) =>  setForm({ ...form, destinationPort: e.target.value })}/>
            </div>
            <div className="form-group-select">
              <label>Funding</label>
              <div className="custom-select">
              <div className="custom-select-drop" onClick={() => setOpenFundingdrop(!openFundingdrop)}>
  <div className="select-box">
    {form.funding ? <span>{form.funding}</span> : <span className="placeholder">Select Funding</span>}
  </div>
  <ChevronDown className={openFundingdrop ? "up" : "down"} />
</div>

{openFundingdrop && (
  <div className="select-dropdown" style={{ zIndex: "99" }}>
    {filteredFundingdrop.map((opt) => (
      <div
        key={opt}
        className="option-item"
        onClick={() => {
          setForm((prev) => ({ ...prev, funding: opt.toUpperCase() }));
          setOpenFundingdrop(false); 
        }}
      >
        {opt.toUpperCase()} 
      </div>
    ))}
  </div>
)}
 

              </div>
            </div>
            <div className="form-group">
            <label htmlFor="">Supplier Code</label>
            <input type="text" value={form.supplyCode}  placeholder="Enter Supply Code"
            onChange={(e) =>  setForm({ ...form, supplyCode: e.target.value })}/>
            </div>

            </div>
              </div>
              )}
      </section>
      <section className="section unit-fee">
        <header className="section-head">
          <h3>Unit & Fees</h3>
          <button onClick={() => setShowUnitFee(!showUnitFee)}>
            {showUnitFee ? <ChevronUp /> : <ChevronDown />}
          </button>
        </header>
        {showUnitFee && (
          <div className="grid-2">
           <div className="form-group">
          <label>Pieces</label>
          <input
            type="number"
            name="unitpieces"
            value={form.unitpieces || 0}
            onChange={handleChange}
          />
        </div>
              <div className="form-group">
          <label>Unit Price USD</label>
          <input
            type="number"
            name="unitPrice"
            value={form.unitPrice || 0}
            onChange={handleChange}
          />
        </div>
              
              {form.funding === "PARTNER" && (
  <div className="form-group">
    <label>Quoted Price USD</label>
    <input
      type="number"
      placeholder="Enter Quoted Price USD"
      value={form.quotedPriceUsd}
      onChange={(e) =>
        setForm({ ...form, quotedPriceUsd: e.target.value })
      }
    />
  </div>
  )}         
   {form.funding === "PARTNER" && (
          <div className="form-group">
                <label>Surcharge NGN</label>
              <input type="text" value={form.surcharge}
              placeholder="Enter Surcharge "
               onChange={(e) =>  setForm({ ...form, surcharge: e.target.value })} />
              </div>
               )}    
                  {form.funding === "PARTNER" && (
          <div className="form-group">
                <label>Total Extimated Price NGN</label>
              <input type="text" value={form.extimated}
              placeholder="Enter Extimated Price "
               onChange={(e) =>  setForm({ ...form, extimated: e.target.value })} />
              </div>
               )}    
            <div className="form-group">
              <label htmlFor="">Warehouse Charge NGN</label>
              <input type="text"  
              value={form.warehouseChargeNGN} placeholder="Enter Warehouse Charge NGN"
               onChange={(e) =>  setForm({ ...form, warehouseChargeNGN: e.target.value })} />
              </div>
            <div className="form-group">
              <label htmlFor="">Offload And Sorting</label>
              <input type="text" 
              value={form.offloadAndSorting} placeholder="Enter Offload And Sorting"
               onChange={(e) =>  setForm({ ...form, offloadAndSorting: e.target.value })} />
              </div>
                   <div className="form-group">
              <label htmlFor="">Shipping Amount USD</label>
              <input type="text" 
              value={form.shipping_amount_usd} placeholder="Enter Shipping Amount"
               onChange={(e) =>  setForm({ ...form, shipping_amount_usd: e.target.value })} />
              </div>
          </div>
        )}
      </section>


      {/* ================= ATTACHMENTS ================= */}
      <section className="section attachments">
       <Attachment container_uuid={container.container_uuid} />
      </section>
         {/* Activity / Comments */}
                <div className="activity">
                  <div className="tabs">
                     <span
                        className={activeTab === "comments" ? "active" : ""}
                        onClick={() => setActiveTab("comments")}
                      >
                        Comments
                      </span>
                      <span
                        className={activeTab === "activity" ? "active" : ""}
                        onClick={() => setActiveTab("activity")}
                      >
                        Activity Log
                      </span>
                  </div>
                  {activeTab === "comments" &&  (
                    <Comment container_uuid={container.container_uuid} />
                  )}
                   {activeTab === "activity" &&  (
                    <ContainerLog container_uuid={container.container_uuid} />
                   )}
                </div>
      {/* FOOTER */}
      <div className="footer-btns">
        <button className="preview" onClick={goBack}>Previous</button>
  <button className="create" onClick={handleUpdate}>Update</button>


      </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default DrildownContainer;
