  import React, { useState,useRef, useEffect } from "react";
  import "../../../../assets/Styles/dashboard/Purchase/drildowncontainer.scss";
  import {ChevronLeft,ChevronDown, ChevronUp, Paperclip, Download,  Edit,  Trash2,  X,  Eye,  File,  Plus, Calendar, SendHorizontal, Check} from "lucide-react";
  import { ContainerServices } from "../../../../services/Trip/container";
  import Attachment from "./Attachment";
  import Comment from "./Comment";
  import ContainerLog from "./ContainerLog";
import { usePopup } from "../../../../context/PopupContext";
import { SupplierService } from "../../../../services/Account/SupplierService";

  const fundingOption = ["PARTNER", "ENTITY"];
const sourceNationOptions = ["WET SALTED", "AIR DRIED"];
  const DrildownContainer = ({container = {},previous= () => {} ,goBack ,onUpdate,avgContainerRate,formatNumber,reloadTable, totalGeneralNGN = 0,totalContainerCount = 0,}) => {

    const { showMessage } = usePopup();

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
    offloadAndSorting: container?.offload_and_sorting || "", shipping_amount_usd: container?.shipping_amount_usd || "",quotedPriceUsd: container.quoted_price_usd ?? 0,
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
const [openSourceNationDrop, setOpenSourceNationDrop] = useState(false);
  const [loading, setLoading] = useState(false);
// ... existing states
const [suppliers, setSuppliers] = useState([]);
const [openSupplierDrop, setOpenSupplierDrop] = useState(false);
  const filteredFundingdrop = fundingOption.filter((opt) =>
    opt.toUpperCase().includes(fundingdrop.toUpperCase())
  );


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


  useEffect(() => {
  const fetchSuppliers = async () => {
    try {
      const res = await SupplierService.list();
      const records = res?.data?.record?.data || [];

      setSuppliers(records);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    }
  };
  fetchSuppliers();
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

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
  if (approved) {
    setApproved(false);
  }
};
const updateField = (name, value) => {
  setForm((prev) => {
    const updated = {
      ...prev,
      [name]: value,
    };

    if (name === "funding" && value === "ENTITY") {
  updated.quotedPriceUsd =  null;
}

    return updated;
  });

  if (approved) {
    setApproved(false);
  }
};

const handleNumberChange = (e) => {
  const { name, value } = e.target;

  if (/^\d*\.?\d*$/.test(value)) {
    updateField(name, value);
  }
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


// Inside DrildownContainer.jsx

const handleUpdate = async () => {
  try {
    if (!container?.container_uuid) return;

    const fundingValue = (form.funding || "").trim().toUpperCase();
    if (!["PARTNER", "ENTITY"].includes(fundingValue)) {
      showMessage("Funding must be either PARTNER or ENTITY");
      return;
    }

    const entityValue = form.entity || null;
    if (fundingValue === "ENTITY" && !entityValue) {
      showMessage("You must select a valid Entity for ENTITY funding");
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
      quoted_price_usd: fundingValue === "ENTITY" ? 0 : (form.quotedPriceUsd === "" ? 0 : Number(form.quotedPriceUsd)),
    };

    setLoading(true);

    await ContainerServices.edit(payload);

    const finalStatus = approved ? 1 : 0;
    const approvalPayload = {
      container_id: container.id,
      container_uuid: container.container_uuid,
      status: finalStatus,
    };
    
    await ContainerServices.change_approval(approvalPayload);

    const updatedDataForTable = {
      ...container,
      ...payload,
      status: finalStatus, 
    };

    onUpdate(updatedDataForTable);
    
    showMessage("Container updated and approved successfully", "success");
    
    // 5. Navigate back
    goBack(true);
  } catch (err) {
    console.error("Update failed:", err);
    showMessage("Update failed. Please check your connection.");
  } finally {
    setLoading(false);
  }
};

    /** ---------- APPROVE / CHANGE APPROVAL HANDLER ---------- */
  const handleApprovalChange = async () => {
    try {
      if (!container?.container_uuid) return;

      setLoading(true);

      const newStatus = approved ? 1: 0;
      // const newStatus = approved ? 0 : 1;

      const payload = {
        container_id: container.id, 
        container_uuid: container.container_uuid,
        status: newStatus,
      };

      await ContainerServices.change_approval(payload);

      setApproved(newStatus);

  onUpdate({
    ...container,
    status: newStatus, 
  });

    } catch (err) {
      console.error("Error changing approval:", err);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  setApproved(Number(container?.status) === 1);
}, [container]);

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
    <p className="small">Amount (NGN)</p>
    <h2>{safeFormatNumber(rawTotalNgnValue)}</h2>
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
              onChange={(e) => updateField("averageWeight", e.target.value)}/>
              </div>
            <div className="form-group">
              <label htmlFor="">Max Weight</label>
              <input type="text" value={form.maxWeight}name="maxWeight"   placeholder="Enter Max Weight"
              onChange={(e) => updateField("maxWeight", e.target.value)}/>
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
              onClick={() => {updateField("entity", entity.user_uuid || entity.uuid);
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
onChange={(e) => updateField("invoiceNumber", e.target.value)}/>
              </div>
              <div className="form-group">
            <label>Tracking Number</label>
              <input  name="trackingNumber"   value={form.trackingNumber}
              onChange={(e) => updateField("trackingNumber", e.target.value)}/>

          </div>
             {/* ================= SOURCE NATION DROPDOWN ================= */}
<div className="form-group-select">
  <label>Source Nation</label>
  <div className="custom-select">
    <div 
      className="custom-select-drop" 
      onClick={() => setOpenSourceNationDrop(!openSourceNationDrop)}
    >
      <div className="select-box">
        {form.sourceNation ? (
          <span>{form.sourceNation}</span>
        ) : (
          <span className="placeholder">Select Source Nation</span>
        )}
      </div>
      <ChevronDown className={openSourceNationDrop ? "up" : "down"} />
    </div>

    {openSourceNationDrop && (
      <div className="select-dropdown" style={{ zIndex: "99" }}>
        {sourceNationOptions.map((opt) => (
          <div
            key={opt}
            className="option-item"
            onClick={() => {
              updateField("sourceNation", opt);
              setOpenSourceNationDrop(false);
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
              <label htmlFor="">Source Port</label>
              <input type="text" value={form.sourcePort}  placeholder="Enter Source Port"
              onChange={(e) =>  updateField( "sourcePort", e.target.value )}/>
              </div>
              <div className="form-group">
              <label htmlFor="">Destination Port</label>
              <input type="text" value={form.destinationPort}  placeholder="Enter Destination Port"
              onChange={(e) =>  updateField( "destinationPort", e.target.value )}/>
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
            updateField("funding", opt.toUpperCase());
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
            {/* ================= SUPPLIER CODE DROPDOWN ================= */}
<div className="form-group-select">
  <label>Supplier Code</label>
  <div className="custom-select">
    <div
      className="custom-select-drop"
      onClick={() => setOpenSupplierDrop(!openSupplierDrop)}
    >
      <div className="select-box">
        {form.supplyCode ? (
          <span>{form.supplyCode}</span>
        ) : (
          <span className="placeholder">Select Supplier Code</span>
        )}
      </div>
      <ChevronDown className={openSupplierDrop ? "up" : "down"} />
    </div>

    {openSupplierDrop && (
      <div className="select-dropdown" style={{ zIndex: 99 }}>
        {suppliers.length === 0 ? (
          <div className="option-item">No suppliers found</div>
        ) : (
          suppliers.map((sup) => (
            <div
              key={sup.user_uuid || sup.id}
              className="option-item"
              onClick={() => {
                updateField("supplyCode", sup.supplier_data?.code_name || "—");
                setOpenSupplierDrop(false);
              }}
            >
              {sup.supplier_data?.code_name}
            </div>
          ))
        )}
      </div>
    )}
  </div>
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
        value={form.quotedPriceUsd === null || form.quotedPriceUsd === undefined ? "" : form.quotedPriceUsd}
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
          <button className="preview" onClick={() => goBack(true)}>Previous</button>
    <button className="create" onClick={handleUpdate}>Update</button>


        </div>
        </div>
        </div>
      </div>
      </div>
    );
  };

  export default DrildownContainer;
