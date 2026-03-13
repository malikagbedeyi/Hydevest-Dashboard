  import React, { useState,useRef, useEffect } from "react";
  import "../../../../assets/Styles/dashboard/Purchase/drildowncontainer.scss";
  import {ChevronLeft,ChevronDown, ChevronUp, Paperclip, Download,  Edit,  Trash2,  X,  Eye,  File,  Plus, Calendar, SendHorizontal, Check} from "lucide-react";
  import { ContainerServices } from "../../../../services/Trip/container";
  import Attachment from "./Attachment";
  import Comment from "./Comment";
  import ContainerLog from "./ContainerLog";

  const fundingOption = ["PARTNER", "ENTITY"];

  const DrildownContainer = ({container = {},previous= () => {} ,goBack = () => {},onUpdate,avgContainerRate = 0,formatNumber,reloadTable, totalGeneralNGN = 0,totalContainerCount = 0,}) => {

    const safeFormatNumber =
    typeof formatNumber === "function"
      ? formatNumber
      
      : (num = 0) =>
          Number(num || 0).toLocaleString("en-US", {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          });

  const [form, setForm] = useState({
    title: container?.title || "", description: container?.desc || "",trackingNumber: container?.tracking_number || "",averageWeight: container?.average_weight || "",maxWeight: container?.max_weight || "",
  entity: container?.entity_uuid || null,invoiceNumber: container?.invoice_number || "",sourceNation: container?.source_nation || "",sourcePort: container?.source_port || "",
    destinationPort: container?.destination_port || "",supplyCode: container?.supplier_code || "",
    unitpieces: container?.pieces || "",unitPrice: container?.unit_price_usd || "",warehouseChargeNGN: container?.warehouse_charge_ngn || "",
    offloadAndSorting: container?.offload_and_sorting || "", shipping_amount_usd: container?.shipping_amount_usd || "",quotedPriceUsd:container?.quoted_price_usd || "",
    funding: (container?.funding || "").toUpperCase(), surcharge:container?.surcharge_ngn || "",extimated: container?.total_estimated_price_ngn || "",
  });


    /* EDIT STATES */
    const [edit, setEdit] = useState({
      description: false, destination: false,title: false, 
      trackingNumber: false, sourceNation: false, unitpieces:false, sourcePart: false, supplyCode: false,
      destinationCountry: false, destinationPort: false, funding: false,  piece: false,
      unitPrice: false, warehouseChargeNGN: false,  offloadAndSorting:false ,shipping_amount_usd:false,surcharge:false
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


  
const rawAmountUsd = (Number(form.unitPrice) || 0) * (Number(form.unitpieces) || 0) + (Number(form.shipping_amount_usd) || 0);
  const rawTotalNgnValue = rawAmountUsd * avgContainerRate + (form.funding === "PARTNER" ? Number(form.surcharge || 0) : 0);

  const generalShare = totalContainerCount > 0 ? (totalGeneralNGN / totalContainerCount) : 0;

  const landingCost = generalShare + rawTotalNgnValue;
const quotedUsd =
  (Number(form.quotedPriceUsd) || 0) +
  (Number(form.shipping_amount_usd) || 0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

    const toggleEdit = (field) => {
      setEdit((s) => ({ ...s, [field]: !s[field] }));
    };


  useEffect(() => {
    if (!container || !container.container_uuid) return;

    const entityFromList = entities.find(
      (e) => String(e.id) === String(container.entity_id)
    );

    setForm((prev) => ({
      ...prev,
      title: container.title || "",
      description: container.desc || "",
      entity: entityFromList ? entityFromList.uuid : null,
      funding: (container.funding || "").toUpperCase(),
    }));
  }, [container, entities]);
  const handleUpdate = async () => {
    try {
      if (!container?.container_uuid) return;

      const fundingValue = (form.funding || "").trim().toUpperCase();
      if (!["PARTNER", "ENTITY"].includes(fundingValue)) {
        alert("Funding must be either PARTNER or ENTITY");
        return;
      }
  const entityValue = form.entity || null;
      if (fundingValue === "ENTITY" && !entityValue) {
        alert("You must select a valid Entity for ENTITY funding");
        return;
      }

  const payload = {
    container_uuid: container.container_uuid,

    title: form.title || "",
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
    surcharge_ngn: Number(form.surcharge || 0),
    total_estimated_price_ngn: Number(form.extimated || 0),
    quoted_price_usd: Number(form.quotedPriceUsd || 0),
  };
      

  const res = await ContainerServices.edit(payload);

      const updated = {
        ...container,
        ...payload,
        entity_uuid: payload.entity_uuid,
      };

      onUpdate(updated);
      // reloadTable();
      handleApprovalChange()
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

      const newStatus = approved ? 1: 0;

      const payload = {
        container_id: container.id, 
        container_uuid: container.container_uuid,
        status: newStatus,
      };

      await ContainerServices.change_approval(payload);

      setApproved(newStatus);

  onUpdate({
    ...container,
    status: newStatus, // 👈 THIS is what table reads
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

const handleNumberChange = (e) => {
  const { name, value } = e.target;

  // Allow only numbers and optional decimal
  if (/^\d*\.?\d*$/.test(value)) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

    return (
    <div className="drill-container" ref={scrollRef}>
        {/* HEADER */}
        <div className="drill-top">
          <div className="drill-title">

    {/* TITLE */}
    <div className="editable-title">
      <label className="small-muted">Title:</label>

      {edit.title ? (
        <input
          type="text"
          name="title"
          value={form.title}
          autoFocus
          onChange={handleChange}
          onBlur={() => toggleEdit("title")}
          className="title-input"
        />
      ) : (
        <h4 className="small-muted">{form.title || "—"}</h4>
      )}
          <Edit
        size={16}
        className={edit.title ? "d-none" : "edit-btn"}
        onClick={() => toggleEdit("title")}
      />
      <Check size={16}
        className={edit.title ? "edit-btn" : "d-none"}
        onClick={() => toggleEdit("title")} />
    </div>

    {/* CONTAINER ID (READ-ONLY) */}
    <div className="container-id">
      <span className="label">Container ID : </span>
      <span className="value" style={{color:"#581aae"}}> # {container.container_unique_id}</span>
    </div>

  </div>
          <div className="right-title">
              <div className="actions">
              {!approved && (
  <button
    className="primary"
    onClick={()=> setApproved(true)}
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
    <p className="small"> Landing Cost</p>
    <h2>₦{safeFormatNumber(landingCost)}</h2>
  </div>
  <div className="summary-item">
    <p className="small">Amount (USD)</p>
    <h2>{safeFormatNumber(rawAmountUsd)}</h2>
  </div>
  <div className="summary-item">
    <p className="small">Pieces</p>
    <h2>{safeFormatNumber(form.unitpieces)}</h2>
  </div>

  <div className="summary-item">
  <p className="small">Total Quoted Amount NGN</p>
  <h2>
    ₦{form.funding === "PARTNER" 
      ? safeFormatNumber(
          quotedUsd * (Number(avgContainerRate) || 0) + (Number(form.surcharge) || 0)
        )
      : "0"}
  </h2>
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
                  <Edit   className={edit.description ? "d-none" : "edit-btn"} onClick={() => toggleEdit("description")} size={16} />
                    <Check size={16} className={edit.description ? "edit-btn" : "d-none"}onClick={() => toggleEdit("description")} />
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
              <input type="text"  value={form.averageWeight} name="averageWeight"   placeholder="Enter Average Weight "
              onChange={(e) =>  setForm({ ...form, averageWeight: e.target.value })}/>
              </div>
            <div className="form-group">
              <label htmlFor="">Max Weight</label>
              <input type="text" value={form.maxWeight}name="maxWeight"   placeholder="Enter Max Weight"
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

  {form.entity && entities.length ? (
    <span >
      {(() => {
        const selected = entities.find(
          (e) => String(e.user_uuid || e.uuid) === String(form.entity)
        );
        return selected ? `${selected.firstname || ""} ${selected.lastname || ""}`.trim(): "—";
      })()}
    </span>
  ) : (
    <span >  Select Entity</span>
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
              onClick={() => {setForm((prev) => ({
    ...prev,
    entity: entity.user_uuid || entity.uuid
  }));
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
              <input type="text" value={form.invoiceNumber} name="invoiceNumber"  placeholder="Enter Invoice Number"
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
              <input type="text" value={form.supplyCode} name="supplyCode" 
               placeholder="Enter Supply Code"
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
              type="text"
              name="unitpieces"
              value={form.unitpieces || ""}
              onChange={handleNumberChange}/>

          </div>
                <div className="form-group">
            <label>Unit Price USD</label>
            <input
              type="text"
              name="unitPrice"
              value={form.unitPrice || ""}
              onChange={handleNumberChange}
            />
          </div>
                
                {form.funding === "PARTNER" && (
    <div className="form-group">
      <label>Quoted Price USD</label>
      <input
        type="text"
        placeholder="Enter Quoted Price USD"
        value={form.quotedPriceUsd}
        name="quotedPriceUsd"
        onChange={handleNumberChange}
      />
    </div>
    )}         
    {form.funding === "PARTNER" && (
            <div className="form-group">
                  <label>Surcharge NGN</label>
                <input type="text" value={form.surcharge}
                placeholder="Enter Surcharge "
                name="surcharge"
                onChange={handleNumberChange} />
                </div>
                )}    
                    {form.funding === "PARTNER" && (
            <div className="form-group">
                  <label>Total Extimated Price NGN</label>
                <input type="text" value={form.extimated}
                placeholder="Enter Extimated Price " name="extimated"
                 onChange={handleNumberChange} />
                </div>
                )}    
              <div className="form-group">
                <label htmlFor="">Warehouse Charge NGN</label>
                <input type="text"  
                value={form.warehouseChargeNGN} name="warehouseChargeNGN" placeholder="Enter Warehouse Charge NGN"
                onChange={handleNumberChange} />
                </div>
              <div className="form-group">
                <label htmlFor="">Offload And Sorting</label>
                <input type="text" 
                name="offloadAndSorting"
                value={form.offloadAndSorting} placeholder="Enter Offload And Sorting"
                onChange={handleNumberChange} />
                </div>
                    <div className="form-group">
                <label htmlFor="">Shipping Amount USD</label>
                <input type="text" 
                name="shipping_amount_usd"
                value={form.shipping_amount_usd} placeholder="Enter Shipping Amount"
                onChange={handleNumberChange} />
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











///////////////////////////// trip expense\\\\\\\\\\\\\\\\\\\






  import React, { useState } from "react";
  import { ChevronDown, Paperclip, Trash2 } from "lucide-react";
  import { ExpenseServices } from "../../../../../services/Trip/expense";
  
  const typeOptions = ["Expense"];
  
  const CURRENCIES = [
    { country: "United States", code: "USD", symbol: "$", rate: 1550 },
    { country: "United Kingdom", code: "GBP", symbol: "£", rate: 1950 },
    { country: "European Union", code: "EUR", symbol: "€", rate: 1700 },
    { country: "China", code: "CNY", symbol: "¥", rate: 215 },
    { country: "Japan", code: "JPY", symbol: "¥", rate: 10.5 },
    { country: "Canada", code: "CAD", symbol: "$", rate: 1150 },
    { country: "South Africa", code: "ZAR", symbol: "R", rate: 85 },
    { country: "Ghana", code: "GHS", symbol: "₵", rate: 130 },
    { country: "Nigeria", code: "NGN", symbol: "₦", rate: 1 },
  ];
  
    const PAYMENT_TYPES = [
    { label: "Container Payment", value: 1 },
    { label: "General Payment", value: 0 },
  ];
  
  const TripExpense = ({ onCreate, setShowItemData, setShowModal, tripUuid }) => {
    const [openTypeSelect, setOpenTypeSelect] = useState(false);
    const [typeSearch, setTypeSearch] = useState(false);
    const [openCurrencySelect, setOpenCurrencySelect] = useState(false);
  const [openPaymentSelect, setOpenPaymentSelect] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    date: "",
    amount: "",
    currency: CURRENCIES[0],
    rate: CURRENCIES[0].rate,
    amountNGN: 0,
    attachments: [],
    comment: "",
    is_container_payment: 0, // default General Payment
  });
  
    /** ---------- handlers ---------- */
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => {
        const updated = { ...prev, [name]: value };
        if (name === "amount") updated.amountNGN = Number(value || 0) * prev.rate;
        return updated;
      });
    };
  
  const handlePaymentSelect = (option) => {
    setForm((prev) => ({
      ...prev,
      is_container_payment: option.value,
    }));
  
    setOpenPaymentSelect(false);
  };
  
    const handleCurrencySelect = (currency) => {
      setForm((prev) => ({
        ...prev,
        currency,
        rate: currency.rate,
        amountNGN: Number(prev.amount || 0) * currency.rate,
      }));
      setOpenCurrencySelect(false);
    };
  
    const handleCreate = async () => {
    try {
      if (!form.title || !form.amount || !form.date) {
        alert("Title, amount and date are required");
        return;
      }
  
      const payload = new FormData();
      payload.append("trip_uuid", tripUuid);
      payload.append("title", form.title);
      payload.append("date", form.date);
      payload.append("amount", Number(form.amount));
      payload.append("currency", form.currency.code);
      payload.append("rate", Number(form.rate));
      payload.append("is_container_payment", form.is_container_payment);
      payload.append("desc", form.description || "");
      payload.append("comment", form.comment || "");
  
      // ✅ correct attachment key
      form.attachments.forEach((f) => {
        payload.append("attachment", f.file);
      });
  
      const res = await ExpenseServices.create(payload);
  
      // UI update (mirror backend fields)
      onCreate({
        expense_uuid: res.data.record?.expense_uuid,
        title: form.title,
        amount: Number(form.amount),
        currency: form.currency.code,
        rate: Number(form.rate),
        is_container_payment: form.is_container_payment,
        status: 0,
        date: form.date,
        created_at: res.data.record?.created_at,
      });
   
      setShowItemData(true);
      setShowModal(false);
    } catch (err) {
      console.error("Error creating expense:", err.response?.data || err);
    }
  };
  
  
    /** ---------- render ---------- */
    return (
      <div className="trip-modal">
        <div className="create-expense-modal">
          <div className="create-expense-card">
            <h2 style={{ fontSize: "1.4vw", color: "#581aae" }}>Create Trip Expense</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "1vw" }}>Enter Trip Expense details</p>
              {/* <div style={{ display: "flex", gap: "0.7vw", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={form.checkbox}
                  onChange={(e) => setForm((prev) => ({ ...prev, checkbox: e.target.checked }))}
                />
                <span style={{ fontSize: "1vw" }}>Container Payment</span>
              </div> */}
            </div> 
  
            {/* Title & Description */}
            <div className="grid-2">
              <div className="form-group">
                <label>Title</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Enter item name" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} />
              </div>
              <div className="form-group-select">
    <label>Payment Type</label>
  
    <div className="custom-select">
      <div
        className="custom-select-drop"
        onClick={() => setOpenPaymentSelect((prev) => !prev)}
      >
        <div className="select-box">
          {form.is_container_payment === 1
            ? "Container Payment"
            : "General Payment"}
        </div>
  
        <ChevronDown />
      </div>
  
      {openPaymentSelect && (
        <div className="select-dropdown">
          {PAYMENT_TYPES.map((option) => (
            <div
              key={option.value}
              className="option-item"
              onClick={() => handlePaymentSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
            <div className="form-group mb-4">
                <label>Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} />
              </div>
              </div>
            <div className="grid-4">
              <div className="form-group">
                <label>Amount</label>
                <input type="number" name="amount" value={form.amount} onChange={handleChange} />
              </div>
              <div className="form-group-select">
                <label>Currency</label>
                <div className="custom-select">
                  <div className="custom-select-drop" onClick={() => setOpenCurrencySelect((prev) => !prev)}>
                    <div className="select-box">
                      {form.currency ? `${form.currency.symbol} ${form.currency.code}` : "Select Currency"}
                    </div>
                    <ChevronDown />
                  </div>
                  {openCurrencySelect && (
                    <div className="select-dropdown">
                      {CURRENCIES.map((cur) => (
                        <div key={cur.code} className="option-item" onClick={() => handleCurrencySelect(cur)}>
                          {cur.country} ({cur.symbol} {cur.code})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Rate</label>
                <input type="text" name="rate"  value={form.rate} onChange={handleChange}  />
              </div>
            </div>
  
            <div className="grid-2">
              <div className="form-group">
                <label>Comment</label>
                <textarea name="comment" value={form.comment} onChange={handleChange} />
              </div>
              <section className="attachments">
                <div className="grid-3">
                  <div className="form-group upload-box">
                    <label>Upload</label>
                    <input
                      type="file"
                      hidden
                      id="finance-attachment"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setForm((prev) => ({
                          ...prev,
                          attachments: [
                            ...prev.attachments,
                            ...files.map((f) => ({
                              id: crypto.randomUUID(),
                              name: f.name,
                              size: f.size,
                              file: f,
                            })),
                          ],
                        }));
                      }}
                    />
                    <button type="button" className="attach-link" onClick={() => document.getElementById("finance-attachment").click()}>
                      <Paperclip size={14} /> Attach File
                    </button>
                    <div className="recent-files">
                      {form.attachments.length === 0 && (
                        <small style={{ color: "#999", marginLeft: "-10px", fontSize: "0.9vw" }}>No attachments added</small>
                      )}
                      {form.attachments.map((f) => (
                        <div key={f.id} className="file-row">
                          <div>
                            <div className="small-muted">{f.name}</div>
                            <small>{(f.size / 1024).toFixed(1)} KB</small>
                          </div>
                          <Trash2
                            size={16}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setForm((prev) => ({ ...prev, attachments: prev.attachments.filter((a) => a.id !== f.id) }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
  
            {/* Actions */}
            <div className="btn-row">
              <button className="cancel" onClick={() => { setShowItemData(true); setShowModal(false); }}>
                Cancel
              </button>
              <button className="create" onClick={handleCreate}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default TripExpense;
  
  
    // {showDeletePopup && (
    //             <div className="trip-card-popup">
    //               <div className="trip-card-popup-container">
    //                 <div className="popup-content">
    //                   <div className="popup-proceeed-wrapper">
    //                     <p>Are you sure you want to delete this Expense record?</p>
    //                     <div className="btn-row-delete">
    //                       <button className="cancel" onClick={cancelDelete}>
    //                         Cancel
    //                       </button>
    //                       <button className="create" onClick={confirmDelete}>
    //                         Delete
    //                       </button>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           )}