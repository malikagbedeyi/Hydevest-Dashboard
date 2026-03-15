import React from 'react'

const table = () => {
  return (

     <div className="mt-4" style={{ background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <Clock size={20} color="#581aae" />
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600" }}>Recent Sales Activity</h3>
        </div>
      
      </div>
      
      <div className="userTable">
          <div className="table-wrap">
            <table className="table" style={{ width: "100%", minWidth: "100%", maxWidth: "100%" }}>
              <thead>
                <tr>
                  <th>Sale ID</th>
                  <th>Customer</th>
                  <th>Container</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td style={{ fontWeight: "600", color: "#581aae" }}>{sale.sale_unique_id}</td>
                    <td>{sale.customer?.firstname} {sale.customer?.lastname}</td>
                    <td>{sale.container?.title}</td>
                    <td>{formatCurrency(sale.total_sale_amount)}</td>
                    <td>
                      <span className={`status ${sale.payment_status === "Full Payment" ? "Approve" : "pending"}`}
                        style={{ color: sale.payment_status === "Full Payment" ? "green" : "orange" }}>
                        {sale.payment_status}
                      </span>
                    </td>
                    <td>{new Date(sale.created_at).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  )
}

export default table
