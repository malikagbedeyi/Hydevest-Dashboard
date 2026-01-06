import React, { useState,useRef, useEffect } from "react";
import "../../../../assets/Styles/dashboard/Purchase/drildowncontainer.scss";
import {ChevronLeft,ChevronDown, ChevronUp, Paperclip, Download,  Edit,  Trash2,  X,  Eye,  File,  Plus, Calendar, SendHorizontal} from "lucide-react";
import { tableDataContainer } from "./ContainerData";
import ContainerFinance from "./ContainerFinance";

const fundingOption = ["partner" ," entity "]

const DrildownContainer = ({
  container = {},
  goBack = () => {},
  onUpdate,
  avgContainerRate = 0,
  formatNumber,
  totalAmountUSD = 0,
  totalAmountNGN = 0,
  totalContainers = 0,
  totalUnitPriceUSD = 0,
}) => {

  const safeFormatNumber =
  typeof formatNumber === "function"
    ? formatNumber
    : (num = 0) =>
        Number(num || 0).toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });

  const [form, setForm] = useState({
    description:container?.description, averageWeight:container?.averageWeight , maxWeight:container?.maxWeight,
    entity:container?.entity , invoiceNumber:container?.invoiceNumber ,trackingNumber: container?.trackingNumber ,
    piece: container.piece, pricePerPieces: container.pricePerPieces,sourceNation: container.sourceNation,
    sourceLocation : container.sourceLocation ,sourcePort: container.sourcePort,destinationPort: container.destinationPort ,supplyCode: container.supplyCode,unitpieces: container?.unitpieces,
    unitPrice: container?.unitPrice,amountUsd: container?.amountUsd ,
    warehouseChargeNGN: container.warehouseChargeNGN,offloadAndSorting: container.offloadAndSorting,
    quotedPriceUsd: container?.quotedPriceUsd , quotedAmountUsd: container?.quotedAmountUsd , 
    surcharge: container?.surcharge,extimated:container?.extimated,
     funding: container.funding || "",
     partners: [
      { id: Date.now(), name: "", amount: "", Percentage: "" },
    ],
    
  });
  /* EDIT STATES */
  const [edit, setEdit] = useState({
    description: false, destination: false,
    trackingNumber: false, sourceNation: false, unitpieces:false, sourcePart: false, supplyCode: false,
    destinationCountry: false, destinationPort: false, funding: false,  piece: false,
    unitPrice: false, warehouseChargeNGN: false,  offloadAndSorting:false ,
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

    const filteredFundingdrop = fundingOption.filter((opt) =>
    opt.toLowerCase());

useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
}, []);
useEffect(() => {
  const pieces = Number(form.unitpieces);
  const unitPrice = Number(form.unitPrice);

  if (!isNaN(pieces) && !isNaN(unitPrice)) {
    setForm((prev) => ({
      ...prev,
      amountUsd: pieces * unitPrice,
    }));
  } else {
    setForm((prev) => ({ ...prev, amountUsd: "" }));
  }
}, [form.unitpieces, form.unitPrice]);
useEffect(() => {
  const pieces = Number(form.unitpieces);
  const quotedPrice = Number(form.quotedPriceUsd);

  if (!isNaN(pieces) && !isNaN(quotedPrice)) {
    setForm((prev) => ({
      ...prev,
      quotedAmountUsd: pieces * quotedPrice,
    }));
  } else {
    setForm((prev) => ({ ...prev, quotedAmountUsd: "" }));
  }
}, [form.unitpieces, form.quotedPriceUsd]);


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
    if (onUpdate) onUpdate({ ...form, [name]: value });
  };

  const toggleEdit = (field) => {
    setEdit((s) => ({ ...s, [field]: !s[field] }));
  };
  const renderEditable = (field, type = "text") => {
    return edit[field] ? (
      <input
        type={type}
        name={field}
        value={form[field]}
        autoFocus
        onChange={handleChange}
        onBlur={() => toggleEdit(field)}
      />
    ) : (
      <span>{form[field]}</span>
    );
  };
  const addPartner = () => {
    setForm((prev) => ({
      ...prev,
      partners: [
        ...prev.partners,
        { id: Date.now(), name: "", amount: "", Percentage: "" },
      ],
    }));
  };
  
  const removePartner = (id) => {
    setForm((prev) => ({
      ...prev,
      partners: prev.partners.filter((p) => p.id !== id),
    }));
  };

  
  return (
  <div className="drill-container" ref={scrollRef}>
      {/* HEADER */}
      <div className="drill-top">
        <div className="drill-title">
        <h4 className="small-muted">Title: {container.title || "—"}</h4>
          <p>Container ID : {container.sn || "Container ID"}</p>
        </div>
        <div className="right-title">
             <div className="actions">
            {!approved && (
            <button className="primary" onClick={() => setApproved(!approved)}>
                Approve  </button>
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
  <p className="small">Total Amount (NGN)</p>
  <h2>
    {new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(totalAmountNGN)}
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
            <div className="form-group">
            <label htmlFor="">Entity</label>
            <input type="text" value={form.entity}   placeholder="Enter Entity"
            onChange={(e) =>  setForm({ ...form, entity: e.target.value })}/>
            </div>
            <div className="form-group">
            <label htmlFor="">Invoice Number</label>
            <input type="text" value={form.invoiceNumber}  placeholder="Enter Invoice Number"
            onChange={(e) =>  setForm({ ...form, invoiceNumber: e.target.value })}/>
            </div>
            <div className="form-group">
          <label>Tracking Number</label>
          {edit.trackingNumber ? (
            <input
              name="trackingNumber"
              value={form.trackingNumber}
              onChange={handleChange}
              onBlur={() => toggleEdit("trackingNumber")}
              autoFocus
            />
          ) : (
            <p onClick={() => toggleEdit("trackingNumber")}>{form.trackingNumber}</p>
          )}
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
          setForm((prev) => ({ ...prev, funding: opt }));
          setOpenFundingdrop(false); 
        }}
      >
        {opt}
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
              
              {form.funding === "partner" && (
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
   {form.funding === "partner" && (
          <div className="form-group">
                <label>Surcharge NGN</label>
              <input type="text" value={form.surcharge}
              placeholder="Enter Surcharge "
               onChange={(e) =>  setForm({ ...form, surcharge: e.target.value })} />
              </div>
               )}    
                  {form.funding === "partner" && (
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
          </div>
        )}
      </section>


      {/* ================= ATTACHMENTS ================= */}
      <section className="section attachments">
        <header className="section-head">
          <h3>Attachments</h3>
          <button onClick={() => setShowAttachments(!showAttachments)}>
            {showAttachments ? <ChevronUp /> : <ChevronDown />}
          </button>
        </header>

        {showAttachments && (
          <>
            <button className="attach-link">
              <Paperclip size={14} /> Attach File
            </button>

            <div className="recent-files">
              {attachments.map((f) => (
                <div key={f.id} className="file-row">
                  <div>
                    <div className="small-muted">{f.name}</div>
                  </div>

                  <div className="file-actions">
                    <Eye size={16} />
                    <File size={16} />
                    <Trash2 size={16} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
                     <div className="">
                  <div className="comment-box">
                    <textarea placeholder="Add your comment"></textarea>
                    <button><SendHorizontal size={16}/></button>
                  </div>
                  <div className="recent">
                    <p className="recent-title">Recent</p>
                    <div className="user">
                      <strong>Joel Kay</strong>
                      <span>02:30 pm</span>
                    </div>
                    <p className="text">Review the list of users with access to privileged functions</p>
                  </div>
                  <div className="recent">
                    <div className="user">
                      <strong>Joel Kay</strong>
                    </div>
                    <p className="text">Review the list of users with access to privileged functions</p>
                  </div>
            </div>
                  )}
                   {activeTab === "activity" &&  (
                    <div className="">
        
                    </div>
                   )}
                </div>
      {/* FOOTER */}
      <div className="drill-footer">
        <button className="btn outline" onClick={goBack}>Previous</button>
        <button
  className="btn primary"
  onClick={() => {
    const updatedContainer = {
      ...container,   // original container
      ...form,   // edited fields overwrite only what changed
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updatedContainer); goBack();                  
  }}
>
  Update
</button>

      </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default DrildownContainer;
