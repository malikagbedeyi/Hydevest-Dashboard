import React, { useEffect, useMemo, useState } from "react";
import "../../../../assets/Styles/dashboard/drilldown.scss";
import "../../../../assets/Styles/dashboard/Sale/addSale.scss";
import EditableField from "./EditableField";
import SaleItemsTable from "./SaleItemsTable";
import { X } from "lucide-react";

const DrilldownSale = ({ data, goBack, onUpdate }) => {
  const [editableData, setEditableData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [salePop, setSalePop] = useState(false);
  const [form, setForm] = useState({ pallets: [] });
  const [activeContainerId, setActiveContainerId] = useState(null);

  // Sync props
  useEffect(() => {
    if (data) setEditableData(data);
  }, [data]);
  // Flatten sale items
  const saleItems = useMemo(() => {
    if (!editableData?.containers) return [];
    return editableData.containers.flatMap((c) =>
      c.pallets.map((p) => ({
        palletId: p.id,
        containerId: c.containerId,
        containerName: c.name,
        ...p,
      }))
    );
  }, [editableData]);
  // Totals
  const totalSaleAmount = useMemo(
    () => saleItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0),
    [saleItems]
  );
  const balance = useMemo(
    () => Math.max(totalSaleAmount - (Number(editableData.amountPaid) || 0), 0),
    [totalSaleAmount, editableData.amountPaid]
  );
  const formatCurrency = (v) =>
    v !== undefined ? new Intl.NumberFormat("en-NG").format(v) : "";
  // Change handler
  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };
  
  // === Edit Sale Item Popup ===
  const handleEditSaleItem = (row) => {
    const container = editableData.containers.find(c => c.containerId === row.containerId);
    if (!container) return;

    const pallet = container.pallets.find(p => p.id === row.palletId);
    if (!pallet) return;

    setForm({ pallets: [{ ...pallet }] });
    setActiveContainerId(row.containerId);
    setSalePop(true);
  };
  const handlePalletChange = (field, value) => {
    setForm(prev => ({
      pallets: [{ ...prev.pallets[0], [field]: value }],
    }));
  };
  const handleSaveSaleItems = () => {
    if (!form.pallets.length) return;

    const pallet = form.pallets[0];

    setEditableData(prev => {
      const updated = { ...prev };
      const container = updated.containers.find(c => c.containerId === activeContainerId);
      if (!container) return updated;

      const idx = container.pallets.findIndex(p => p.id === pallet.id);
      const updatedPallet = {
        ...pallet,
        pieces: Number(pallet.pieces) || 0,
        saleAmount: Number(pallet.saleAmount) || 0,
        palletOption: Number(pallet.palletOption) || 0,
        total: (Number(pallet.pieces) || 0) *
               (Number(pallet.saleAmount) || 0) *
               (Number(pallet.palletOption) || 0),
      };

      if (idx === -1) container.pallets.push(updatedPallet);
      else container.pallets[idx] = updatedPallet;

      return updated;
    });

    setSalePop(false);
  };
  const handleDeleteSaleItem = (row) => {
    setEditableData(prev => {
      const updated = { ...prev };
      const container = updated.containers.find(c => c.containerId === row.containerId);
      if (!container) return updated;

      container.pallets = container.pallets.filter(p => p.id !== row.palletId);
      return updated;
    });
  };
  const recalculateSale = (sale) => {
    const allPallets = sale.containers.flatMap(c => c.pallets);
  
    const totalSaleAmount = allPallets.reduce(
      (sum, p) => sum + (Number(p.total) || 0),
      0
    );
  
    const noOfPallets = allPallets.reduce(
      (sum, p) => sum + (Number(p.saleAmount) || 0),
      0
    );
  
    const purchasePricePerPiece = allPallets.reduce(
      (sum, p) => sum + (Number(p.pieces) || 0),
      0
    );
  
    const balance = Math.max(
      totalSaleAmount - (Number(sale.amountPaid) || 0),
      0
    );
  
    return {
      ...sale,
      totalSaleAmount,
      noOfPallets,
      purchasePricePerPiece,
      balance,
    };
  };
  const handleSave = () => {
    const recalculatedSale = recalculateSale(editableData);
    onUpdate?.(recalculatedSale);
    goBack();
  };
  
  return (
    <div className="drilldown">
      {/* ===== SUMMARY ===== */}
      <div className="drill-summary-grid">
        <div className="drill-summary">
          <div className="summary-item">
            <p>Total Sale Amount</p>
            <h2>{formatCurrency(totalSaleAmount)}</h2>
          </div>
          <div className="summary-item">
            <p>Amount Paid</p>
            <h2>{formatCurrency(editableData.amountPaid)}</h2>
          </div>
          <div className="summary-item">
            <p>Balance</p>
            <h2>{formatCurrency(balance)}</h2>
          </div>
          <div className="summary-item">
            <p>Total Pallets</p>
            <h2>{editableData.noOfPallets}</h2>
          </div>
        </div>
      </div>

      {/* ===== CUSTOMER ===== */}
      <div className="readOnly-details">
        <div className="sale-readOnly-content">
          <div><strong>Customer Name:</strong> {editableData.customer?.name}</div>
          <div><strong>Phone:</strong> {editableData.customer?.phone}</div>
          <div><strong>Location:</strong> {editableData.customer?.location}</div>
        </div>
      </div>

      {/* ===== SALE ITEMS TABLE ===== */}
      <div className="section-grid">
        <section>
            <div className="section-head">
            <h3>Sale Information</h3>
          </div>

          <div className="grid-2">
            <EditableField
              label="Total Sale Amount"
              value={totalSaleAmount}
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
              value={balance}
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
            />
            <EditableField
              label="No. of Pallets"
              field="noOfPallets"
              value={editableData.noOfPallets}
              editingField={editingField}
              setEditingField={setEditingField}
              onChange={handleChange}
              type="number"
            />
          </div>

          <div className="section-head"><h3>Sale Items</h3></div>
          <SaleItemsTable
            items={saleItems}
            onEdit={handleEditSaleItem}
            onDelete={handleDeleteSaleItem}
          />
        </section>
      </div>

      {/* ===== SALE ITEM POPUP ===== */}
      {salePop && (
        <div className="add-sale-popup">
          <div className="popup-overlay"></div>
          <div className="add-sale-content">
            <X size={18} className="close mb-4" onClick={() => setSalePop(false)} />

            <div className="sale-pallet-section" style={{
              display:"flex",
              flexDirection:"column",

            }}>
              {form.pallets.map((pallet, idx) => (
                <div key={idx} className="grid-2">
                  <div className="form-group">
                    <label>Pieces</label>
                    <input
                      value={pallet.pieces}
                      onChange={(e) => handlePalletChange("pieces", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Sale Amount</label>
                    <input
                      value={pallet.saleAmount}
                      onChange={(e) => handlePalletChange("saleAmount", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pallet Option</label>
                    <input
                      value={pallet.palletOption}
                      onChange={(e) => handlePalletChange("palletOption", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Total</label>
                    <input
                      value={(Number(pallet.pieces) || 0) *
                             (Number(pallet.saleAmount) || 0) *
                             (Number(pallet.palletOption) || 0)}
                      readOnly
                    />
                  </div>
                </div>
              ))}
              <div className="btn-row">
                <button className="cancel" onClick={() => setSalePop(false)}>Cancel</button>
                <button className="create" onClick={handleSaveSaleItems}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <div className="btn-row">
        <button className="cancel" onClick={goBack}>Previous</button>
        <button className="create" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default DrilldownSale;
