import React from 'react';
import logo from '../../../../assets/Images/Logo/LogoMain.png';
import { Printer } from "lucide-react";

const RecoveryInvoice = ({ data }) => {
    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (v) =>
        new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 2
        }).format(v || 0);

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).replace(/ /g, "-");
    };

    const styles = {
        container: {height:"80vh", overflowY:"auto", scrollbarWidth:"none", padding: '20px', background: '#fff' },
        actionBar: { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee' },
        printBtn: { background: '#22c55e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' },
        paper: {
            padding: '40px',
            border: '1px solid #eee',
            minHeight: '500px',
            position: 'relative',
            fontFamily: 'Arial, sans-serif',
            color: '#333'
        },
        header: { display: 'flex', justifyContent: 'space-between', marginBottom: '40px' },
        logo: { width: '150px', marginBottom: '10px' },
        receiptTitle: { fontSize: '24px', fontWeight: 'bold', color: '#581aae', margin: 0 },
        infoText: { margin: '2px 0', fontSize: '14px', color: '#666' },
        section: { marginBottom: '30px' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
        th: { textAlign: 'left', padding: '12px', background: '#f8f9fa', borderBottom: '2px solid #581aae', fontSize: '13px' },
        td: { padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' },
        summary: { marginTop: '30px', textAlign: 'right' },
        totalBox: { display: 'inline-block', padding: '15px 30px', background: '#f0f7ff', borderRadius: '8px', borderLeft: '4px solid #581aae' },
        stamp: {
            position: 'absolute',
            top: '20%',
            right: '10%',
            border: '4px solid #22c55e',
            color: '#22c55e',
            padding: '10px 20px',
            borderRadius: '8px',
            transform: 'rotate(-20deg)',
            opacity: 0.3,
            fontSize: '28px',
            fontWeight: 'bold',
            pointerEvents: 'none'
        }
    };

    return (
        <div style={styles.container}>
            <div className="no-print" style={styles.actionBar}>
                <button onClick={handlePrint} style={styles.printBtn}>
                    <Printer size={18} /> Print Receipt
                </button>
            </div>

            <div id="printable-recovery" style={styles.paper}>
                <div style={styles.stamp}>PAYMENT RECEIVED</div>

                <div style={styles.header}>
                    <div>
                        <img src={logo} alt="Hydevest" style={styles.logo} />
                        <p style={styles.infoText}>Lagos, Nigeria</p>
                        <p style={styles.infoText}>Support@hydevest.com</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={styles.receiptTitle}>OFFICIAL RECEIPT</h2>
                        <p style={styles.infoText}><strong>Date:</strong> {formatDate(data.createdAt)}</p>
                        <p style={styles.infoText}><strong>Ref:</strong> REC-{data.id || '000'}</p>
                    </div>
                </div>

                <div style={styles.section}>
                    <h5 style={{ color: '#888', textTransform: 'uppercase', marginBottom: '10px' }}>Received From:</h5>
                    <h3 style={{ margin: 0 }}>{data.customerName}</h3>
                    <p style={styles.infoText}>{data.customerPhone}</p>
                </div>

                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Payment Description</th>
                            <th style={styles.th}>Sale ID</th>
                            <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={styles.td}>Debt Recovery Payment</td>
                            <td style={styles.td}>{data.saleUniqueId}</td>
                            <td style={{ ...styles.td, textAlign: 'right', fontWeight: 'bold' }}>
                                {formatCurrency(data.amountPaid)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={styles.summary}>
                    <div style={styles.totalBox}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Total Amount Paid:</span>
                        <h2 style={{ margin: '5px 0', color: '#581aae' }}>{formatCurrency(data.amountPaid)}</h2>
                    </div>
                </div>

                <div style={{ marginTop: '50px' }}>
                    <p style={styles.infoText}><strong>Payment Status:</strong> {data.paymentStatus}</p>
                    <p style={styles.infoText}><strong>Comment:</strong> {data.comment || "N/A"}</p>
                </div>

                <div style={{ marginTop: '80px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <p style={{ fontSize: '12px', color: '#aaa' }}>This is a computer-generated receipt and requires no signature.</p>
                </div>
            </div>

            <style>
                {`
                    @media print {
                        body * { visibility: hidden; }
                        #printable-recovery, #printable-recovery * { visibility: visible; }
                        #printable-recovery { 
                            position: absolute; 
                            left: 0; 
                            top: 0; 
                            width: 100%;
                            border: none !important;
                        }
                        .no-print { display: none !important; }
                    }
                `}
            </style>
        </div>
    );
};

export default RecoveryInvoice;