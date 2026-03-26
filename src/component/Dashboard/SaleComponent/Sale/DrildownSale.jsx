import React, { useEffect, useMemo, useState } from "react";
import { Printer, Download } from "lucide-react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import "../../../../assets/Styles/dashboard/Sale/addSale.scss";
import EditableField from "./EditableField";
import SaleItemsTable from "./SaleItemsTable";
import { X } from "lucide-react";
import AddSaleItem from "./AddSaleItem";
import { usePresaleHelpers } from "./hooks/usePresaleHelpers";
import { SaleServices } from "../../../../services/Sale/sale";
import SaleInvoice from "./SaleInvoice";

const DrilldownSale = ({ data, goBack, onUpdate, sales,preSales,selectedSale }) => {

  const [editableData, setEditableData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [salePop, setSalePop] = useState(false);
  const [form, setForm] = useState({ pallets: [] });
  const [showInvoice, setShowInvoice] = useState(false)
  const [activeContainerId, setActiveContainerId] = useState(null);
  const [openPalletDropdowns, setOpenPalletDropdowns] = useState({});
const [palletOptionsByContainer, setPalletOptionsByContainer] = useState({});
const { presaleByContainerId, isPurchasePriceLowerThanPresale } = usePresaleHelpers(preSales);
 const [successMessage, setSuccessMessage] = useState(null);
  const formatNumber = (value) =>
    value === "" ? "" : Number(value).toLocaleString("en-NG");

  const formatCurrency = (v) =>
    v !== undefined ? new Intl.NumberFormat("en-NG").format(v) : "";

useEffect(() => {
  if (data) {
    setEditableData({
      ...data,
      discount: 0,
      excess: 0,
      desc: data.desc || "Enter Description",         
      excess_comment: data.excess_comment || "Enter Comment" 
    });
  }
}, [data]);

  /* =========================================
      FLATTEN SALE ITEMS
  ========================================= */

const saleItems = useMemo(() => {
  if (!editableData?.containers) return [];

return editableData.containers.flatMap((c) =>
    c.pallets.map((p) => {
      const presaleInfo = presaleByContainerId[c.containerId];
      return {
        palletId: p.id,
        containerId: c.containerId,
        containerName: c.name,
        PresaleID: presaleInfo?.pre_sale_unique_id || "N/A", 
        purchasePrice: p.purchase_price,
        noOfPallets: p.pallet_purchased,
        palletOption: p.pallet_pieces,
        total: p.sale_amount,
        createdAt: p.created_at,
      };
    })
  );
}, [editableData, presaleByContainerId]);
  /* =========================================
      CHANGE HANDLER
  ========================================= */

  const handleChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  /* =========================================
      RECALCULATE SALE
  ========================================= */




//     const baseDiscount = Number(data.discount) || 0;
// const extraDiscount = Number(editableData.discount) || 0;
// const totalDiscount = baseDiscount + extraDiscount;


const totalDiscount = useMemo(() => {
const baseDiscount = Number(data.discount) || 0;
const extraDiscount = Number(editableData.discount) || 0;
  return baseDiscount + extraDiscount;
}, [data.discount, editableData.discount]);




const totalExcess = useMemo(() => {
  const baseExcess = Number(data.excess) || 0;
  const extraExcess = Number(editableData.excess) || 0;
  return baseExcess + extraExcess;
}, [data.excess, editableData.excess]);


 const recalculateSale = (sale) => {

  const allPallets = sale.containers.flatMap((c) => c.pallets);

  const palletsTotal = allPallets.reduce(
    (sum, p) => sum + (Number(p.sale_amount) || 0),
    0
  );

  const totalSaleAmount = palletsTotal;

  const discount = Number(sale.discount) || 0 ;

  const amountPaid = Number(sale.amountPaid) || 0;

  const netTotal = Math.max(totalSaleAmount - discount, 0);

  const balance = Math.max(netTotal - amountPaid, 0);

  return {
    ...sale,
    totalSaleAmount,
    noOfPallets: allPallets.length,
    balance,
    paymentStatus: balance === 0 ? "Fully Paid" : "Outstanding",
  };
};


  /* ========================================
      PALLET CHANGE
  ========================================= */

const handlePalletChange = (index, field, value) => {

  setForm((prev) => {

    const pallets = [...prev.pallets];

    pallets[index] = {
      ...pallets[index],
      [field]: value,
    };

    const price = Number(pallets[index].purchasePrice) || 0;
    const qty = Number(pallets[index].noOfPallets) || 0;
    const pieces = Number(pallets[index].palletOption) || 0;

    pallets[index].saleAmount = price * qty * pieces;

    return { ...prev, pallets };
  });
};
  /* =========================================
      SAVE SALE ITEMS
  ========================================= */

const handleSaveSaleItems = () => {
  if (!form.pallets.length) return;

  const containerId = activeContainerId;
  if (!containerId) return;

  setEditableData(prev => {

    const updated = { ...prev };

    const container = updated.containers.find(
      c => c.containerId === containerId
    );

    if (!container) return prev;

    form.pallets.forEach(p => {

      const price = Number(p.purchasePrice) || 0;
      const qty = Math.min(
        Number(p.noOfPallets) || 0,
        Number(p.remaining_no_of_pallets) || 0
      );
      const pieces = Number(p.palletOption) || 0;

      if (!price || !qty) return;

      const palletData = {
        id: p.id,
        pallet_uuid: p.pallet_uuid,
        pallet_pieces: pieces,
        pallet_purchased: qty,
        purchase_price: price,
        sale_amount: price * qty * pieces,
        created_at: p.createdAt || new Date().toISOString(),
      };

      const index = container.pallets.findIndex(x => x.id === p.id);

      if (index === -1) {
        container.pallets.push(palletData);
      } else {
        container.pallets[index] = palletData;
      }

    });

    return recalculateSale(updated);

  });

  setForm({ pallets: [] });
  setSalePop(false);
};

  /* =========================================
      DELETE SALE ITEM
  ========================================= */

const handleDeleteSaleItem = (palletId, containerId) => {

  setEditableData((prev) => {

    const updated = { ...prev };

    const container = updated.containers.find(
      (c) => c.containerId === containerId
    );

    if (!container) return updated;

    container.pallets = container.pallets.filter(
      (p) => p.id !== palletId
    );

    return updated;
  });
};
 const addPallet = (containerId) => {
  const resolvedContainerId = containerId || activeContainerId;
  if (!resolvedContainerId) return;

  const palletList = palletOptionsByContainer[resolvedContainerId] || [];

  if (!palletList.length) {
    setSuccessMessage("No pallets available for this container");
    return;
  }

  const usedUUIDs = form.pallets.map(p => p.pallet_uuid);

  const available = palletList.find(
    p => !usedUUIDs.includes(p.pallet_uuid)
  );

  if (!available) {
    setSuccessMessage("All pallets for this container have been added");
    return;
  }

  setForm(prev => ({
    ...prev,
    pallets: [
      ...prev.pallets,
      {
        id: crypto.randomUUID(),
        containerId: resolvedContainerId,
        pallet_uuid: available.pallet_uuid,
        palletOption: available.pallet_pieces,
        purchasePrice: 0,
        noOfPallets: 0,
        remaining_no_of_pallets: available.remaining_no_of_pallets || 0,
        createdAt: new Date().toISOString(),
      },
    ],
  }));

  setSalePop(true);
};

  const removeAddSale = (index) => {
    const updated = form.pallets.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, pallets: updated }));
    if (!updated.length) setSalePop(false);
  };
  /* =========================================
      SAVE SALE
  ========================================= */

const ExtendDiscount = async () => {
  const updated = recalculateSale({
    ...editableData,
    discount: editableData.discount,
    desc: editableData.desc
  });

  const payload = {
    sale_uuid: selectedSale.sale_uuid,
    discount: updated.discount,
    desc: updated.desc || ""
  };

  const res = await SaleServices.ExtendDiscount(payload);

  return (
    res?.data?.message ||
    res?.message ||
    "Discount updated successfully"
  );
};
const extendExcess = async () => {
  const payload = {
    sale_uuid: selectedSale.sale_uuid,
    excess: editableData.excess,
    excess_comment: editableData.excess_comment
  };

  const res = await SaleServices.extendExcess(payload);

  return (
    res?.data?.message ||
    res?.message ||
    "Excess updated successfully"
  );
};

const handleSave = async () => {
  try {
    const discountMsg = await ExtendDiscount();
    const excessMsg = await extendExcess();

    const finalMessage = `${discountMsg} & ${excessMsg}`;

    setSuccessMessage(finalMessage);

    const updated = recalculateSale(editableData);
    onUpdate?.(updated);

  } catch (err) {
    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Update failed";

    setSuccessMessage(errorMessage);
  }
};

  /* =========================================
      RENDER
  ========================================= */

  if (successMessage) {
    return (
      <div className="trip-card-popup">
        <div className="trip-card-popup-container">
          <div className="popup-content">
            <div onClick={() => {setSuccessMessage(null)}}className="delete-box">✕</div>
            <div className="popup-proceeed-wrapper">
              <span>{successMessage}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="drilldown">
<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button 
          className="create" 
          onClick={() => setShowInvoice(true)}
        >
          <Printer size={18} /> Generate Invoice
        </button>
      </div>
      
      {/* ===== SUMMARY ===== */}

      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item">
            <p className="small"> Total Sale Amount</p>
            <h2>{formatCurrency(editableData.totalSaleAmount + data.discount) }</h2>
          </div>
               <div className="summary-item">
            <p className="small"> Discount</p>
            <h2>{formatCurrency(totalDiscount)}</h2>
          </div>
          <div className="summary-item">
            <p  className="small">Amount Paid</p>
            <h2>{formatCurrency(editableData.amountPaid)}</h2>
          </div>

          <div className="summary-item">
            <p  className="small">OutStanding Balance</p>
            <h2>{editableData.balance === 0 ? (  <span style={{ color: "green", fontWeight: "600" }}>
               Fully Paid</span>) : (formatCurrency(editableData.balance - editableData.discount))}</h2>
          </div>
          <div className="summary-item">
            <p  className="small">Total Pallets</p>
            <h2>{editableData.noOfPallets}</h2>
          </div>

        </div>
      </div>

      {/* ===== CUSTOMER ===== */}

      <div className="readOnly-details">
        <div className="sale-readOnly-content">
          <div><strong>Customer Name:</strong> {sales.customer?.name}</div>
          <div><strong>Phone:</strong> {sales.customer?.phone}</div>
          <div><strong>Location:</strong> {sales.customer?.location}</div>
        </div>
      </div>

      {/* ===== SALE INFORMATION ===== */}

      <div className="section-grid">

        <section>

          <div className="section-head">
            <h3>Sale Information</h3>
          </div>

          <div className="grid-2">
            <EditableField
              label="Total Sale Amount"
              value={editableData.totalSaleAmount  + data.discount} 
              field="totalSaleAmount"
              editingField={editingField}
              setEditingField={setEditingField}
              onChange={handleChange}
              type="number"
              format={formatCurrency}
              readOnly={true}
            />
            <EditableField
              label="Balance"
              value={editableData.balance }
              field="balance"
              editingField={editingField}
              setEditingField={setEditingField}
              onChange={handleChange}
              type="number"
              format={formatCurrency}
              readOnly={true}
            />
            <EditableField
              label="Amount Paid"
              field="amountPaid"
              value={editableData.amountPaid}
              editingField={editingField}
              setEditingField={setEditingField}
              onChange={handleChange}
              type="number"
              format={formatCurrency}
              readOnly={true}
            />
            <EditableField
  label={editableData.saleOption === "BOX SALE" ? "WC Pieces" : "No. of Pallets"}
  field="noOfPallets"
  value={formatNumber(editableData.saleOption === "BOX SALE" ? editableData.wcPieces : editableData.noOfPallets)}
  editingField={editingField}
  setEditingField={setEditingField}
  onChange={handleChange}
  type="number"
  readOnly={true}
/>
<EditableField
label={`Discount (${formatNumber(totalDiscount)})`}
  field="discount"
  value={editableData.discount}
  placeholder="0"
  editingField={editingField}
  setEditingField={setEditingField}
  onChange={handleChange}
  type="number"
  format={formatCurrency}
/>
<EditableField
label='Discount Description'
  field="desc"
value={editableData.desc || ""}
  placeholder="Enter Discount Description"
  editingField={editingField}
  setEditingField={setEditingField}
  onChange={handleChange}
  type="text"
/>
<EditableField
  label={`Excess (${formatNumber(totalExcess)})`}
  field="excess"
  value={editableData.excess}
  placeholder="Enter Excess"
  editingField={editingField}
  setEditingField={setEditingField}
  onChange={handleChange}
  type="number"
  format={formatCurrency}
/>
<EditableField
label='Excess Comment'
  field="excess_comment"
value={editableData.excess_comment || ""}
  placeholder="Enter Excess Comment"
  editingField={editingField}
  setEditingField={setEditingField}
  onChange={handleChange}
  type="text"
  // format={formatCurrency}
/>
          </div>

          {/* ===== SALE ITEMS ===== */}

          <div className="section-head">
            <h3>Sale Items</h3>
          </div>

          <SaleItemsTable
            items={saleItems}
            formatNumber={formatNumber}
            readOnly={true}

          />

        </section>

      </div>

      {/* ===== SALE ITEM POPUP ===== */}
    {salePop && (
  <AddSaleItem
    formatNumber={formatNumber}
    form={form}
    setForm={setForm}
    salePop={salePop}
    setSalePop={setSalePop}
    activeContainerId={activeContainerId}
    dynamicContainerOptions={editableData?.containers || []}
    openPalletDropdowns={openPalletDropdowns}
    setOpenPalletDropdowns={setOpenPalletDropdowns}
    palletOptionsByContainer={palletOptionsByContainer}
    addPallet={addPallet}
    removeAddSale={removeAddSale}
    handlePalletChange={handlePalletChange}
    handleSaveSaleItems={handleSaveSaleItems}
    isPurchasePriceLowerThanPresale={isPurchasePriceLowerThanPresale}
  />
)}

{showInvoice && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content invoice-modal" style={{ width: '850px', maxWidth: '95%', padding: '0', background: '#f9f9f9', overflowY: 'auto', maxHeight: '90vh' }}>
             <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                <X className="close-icon" onClick={() => setShowInvoice(false)} style={{ cursor: 'pointer' }} />
             </div>
             <SaleInvoice
                data={editableData} 
                realData={data}
                customer={sales.customer} 
                items={saleItems} 
                close={() => setShowInvoice(false)}
             />
          </div>
        </div>
      )}
      
      {/* ===== FOOTER ===== */}

      <div className="btn-row">
        <button className="cancel" onClick={goBack}>
          Previous
        </button>

        <button className="create" onClick={handleSave}>
          Update Changes
        </button>
      </div>

    </div>
  );
};

export default DrilldownSale;