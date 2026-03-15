import React from 'react';
import logo from '../../../../assets/Images/Logo/LogoMain.png'
import { Printer, X } from "lucide-react";

const SaleInvoice = ({ data, customer, items, close }) => {
    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (v) =>
        new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }).format(v || 0);

    const invoiceStyles = {
        container: { padding: '40px', background: '#fff', borderRadius: '12px' },
        actionBar: { 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px', 
            borderBottom: '2px solid #f0f0f0', 
            paddingBottom: '20px' 
        },
        printBtn: { 
            background: '#22c55e', 
            color: '#fff', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontWeight: '600'
        },
        paper: {
            padding: '40px',
            border: '1px solid #e0e0e0',
            backgroundColor: '#fff',
            position: 'relative',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        },
        header: { display: 'flex', justifyContent: 'space-between', marginBottom: '40px' },
        brand: { fontSize: '28px', fontWeight: '800', color: '#581aae', margin: 0, letterSpacing: '-1px' },
        subText: { margin: '2px 0', color: '#666', fontSize: '14px' },
        invoiceLabel: { fontSize: '32px', fontWeight: '300', color: '#333', margin: 0 },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '30px' },
        th: { textAlign: 'left', padding: '15px', background: '#581aae', color: '#fff', fontSize: '13px', textTransform: 'uppercase' },
        td: { padding: '15px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#444' },
        summarySection: { display: 'flex', justifyContent: 'flex-end', marginTop: '30px' },
        summaryBox: { width: '320px' },
        summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px' },
        totalRow: { 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '15px 0', 
            borderTop: '2px solid #581aae', 
            marginTop: '10px', 
            fontWeight: 'bold', 
            fontSize: '18px' 
        },
        stamp: {
            position: 'absolute',
            top: '150px',
            right: '50px',
            border: '5px double',
            padding: '10px 20px',
            borderRadius: '10px',
            transform: 'rotate(-15deg)',
            fontSize: '24px',
            fontWeight: 'bold',
            opacity: 0.2,
            pointerEvents: 'none'
        }
    };

    const isPaid = (data.balance || 0) <= 0;

    return (
        <div style={invoiceStyles.container}>
            {/* Top Action Bar - Hidden during print via media query */}
            <div className="no-print" style={invoiceStyles.actionBar}>
                {/* <h3 style={{ margin: 0, color: '#333' }}>Invoice Management</h3> */}
                <h3></h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handlePrint} style={invoiceStyles.printBtn}>
                        <Printer size={18} /> Print Invoice
                    </button>
                </div>
            </div>

            {/* Printable Paper Area */}
            <div id="printable-invoice" style={invoiceStyles.paper}>
                
                {/* Status Stamp */}
                <div style={{ 
                    ...invoiceStyles.stamp, 
                    color: isPaid ? '#22c55e' : '#ff4d4f', 
                    borderColor: isPaid ? '#22c55e' : '#ff4d4f' 
                }}>
                    {isPaid ? 'FULLY PAID' : 'OUTSTANDING'}
                </div>

                {/* Header Section */}
                <div style={invoiceStyles.header}>
                    <div>
                        {/* <h1 style={invoiceStyles.brand}>HYDEVEST</h1> */}
                        <img style={{width:"40%",marginBottom:"1vw"}} src={logo} alt="" />
                        <p style={invoiceStyles.subText}>Premium Container Services</p>
                        <p style={invoiceStyles.subText}>Lagos, Nigeria</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={invoiceStyles.invoiceLabel}>INVOICE</h2>
                        <p style={invoiceStyles.subText}><strong>No:</strong> {data?.invoice_no || `INV-${data?.id || '001'}`}</p>
                        <p style={invoiceStyles.subText}><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Client Info Section */}
                <div style={{ marginBottom: '40px' }}>
                    <h5 style={{ color: '#888', textTransform: 'uppercase', marginBottom: '8px', fontSize: '12px' }}>Billed To:</h5>
                    <h4 style={{ margin: '0', fontSize: '18px', color: '#333' }}>{customer?.name || "Walking Customer"}</h4>
                    <p style={invoiceStyles.subText}>{customer?.phone || "N/A"}</p>
                    <p style={invoiceStyles.subText}>{customer?.location || "N/A"}</p>
                </div>

                {/* Items Table */}
                <table style={invoiceStyles.table}>
                    <thead>
                        <tr>
                            <th style={{ ...invoiceStyles.th, borderRadius: '8px 0 0 0' }}>Container</th>
                            <th style={invoiceStyles.th}>Qty (Pallets)</th>
                            <th style={invoiceStyles.th}>Purchase Price</th>
                            <th style={invoiceStyles.th}>Pallets Distribution</th>
                            <th style={{ ...invoiceStyles.th, textAlign: 'right', borderRadius: '0 8px 0 0' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx}>
                                <td style={invoiceStyles.td}>
                                    <strong>{item.containerName}</strong><br/>
                                    <span style={{ fontSize: '11px', color: '#888' }}>Presale ID: {item.PresaleID}</span>
                                </td>
                                <td style={invoiceStyles.td}>{item.noOfPallets}</td>
                                <td style={invoiceStyles.td}>{formatCurrency(item.purchasePrice)}</td>
                                <td style={invoiceStyles.td}>{formatCurrency(item.palletOption)}</td>
                                <td style={{ ...invoiceStyles.td, textAlign: 'right', fontWeight: '600' }}>
                                    {formatCurrency(item.total)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Summary Section */}
                <div style={invoiceStyles.summarySection}>
                    <div style={invoiceStyles.summaryBox}>
                        <div style={invoiceStyles.summaryRow}>
                            <span style={{ color: '#666' }}>Subtotal</span>
                            <span>{formatCurrency(data.totalSaleAmount + (data.discount || 0))}</span>
                        </div>
                        <div style={{ ...invoiceStyles.summaryRow, color: '#ff4d4f' }}>
                            <span>Discount</span>
                            <span>- {formatCurrency(data.discount)}</span>
                        </div>
                        <div style={invoiceStyles.totalRow}>
                            <span>Total Sale Amount</span>
                            <span style={{ color: '#581aae' }}>{formatCurrency(data.totalSaleAmount)}</span>
                        </div>
                        <div style={invoiceStyles.summaryRow}>
                            <span style={{ color: '#666' }}>Amount Paid</span>
                            <span style={{ color: '#22c55e', fontWeight: '600' }}>{formatCurrency(data.amountPaid)}</span>
                        </div>
                        <div style={{ 
                            ...invoiceStyles.summaryRow, 
                            fontWeight: 'bold', 
                            marginTop: '10px', 
                            padding: '12px 10px', 
                            background: isPaid ? '#f0fdf4' : '#fff7ed',
                            borderRadius: '8px'
                        }}>
                            <span>Balance Due</span>
                            <span style={{ color: isPaid ? '#22c55e' : '#f97316' }}>
                                {isPaid ? 'PAID IN FULL' : formatCurrency(data.balance)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div style={{ marginTop: '80px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#999', margin: '5px 0' }}>
                        Please make all payments to Hydevest Official Accounts.
                    </p>
                    <p style={{ fontSize: '12px', color: '#999', margin: '0', fontWeight: 'bold' }}>
                        Thank you for choosing Hydevest!
                    </p>
                </div>
            </div>

            {/* Print Logic */}
            <style>
                {`
                   @media print {

  body * {
    visibility: hidden;
    background: #fff !important;
  }

  #printable-invoice,
  #printable-invoice * {
    visibility: visible;
  }

  #printable-invoice {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none;
    padding: 10px;
  }

  .no-print {
    display: none !important;
  }

  table, tr, td, th {
    page-break-inside: avoid;
  }

  #printable-invoice {
    page-break-after: avoid;
  }
@page {
  size: A4;
  margin: 10mm;
}
}
                `}
            </style>
        </div>
    );
};

export default SaleInvoice;