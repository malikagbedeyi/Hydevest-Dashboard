import React, { useState } from "react";
import { Search } from "lucide-react";

const ContainerProfitTable = ({ data, onRowClick, goBack }) => {
  const [search, setSearch] = useState("");

  const filtered = data.filter(c => 
    c.tracking_number?.toLowerCase().includes(search.toLowerCase()) || 
    c.container_unique_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="userTable">
      <div className="top-content">
        <div className="right-wrapper">
          <div className="right-wrapper-input">
            <Search className="input-icon" />
            <input placeholder="Search Tracking Number..." onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="table-wrap">
        <table className="table" style={{ width: "100%",maxWidth:"100%", }}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Trip ID</th>
              {/* <th>Container ID</th> */}
              <th>Tracking No</th>
              <th>Landing Cost</th>
              <th>Expected Revenue</th>
              <th>Expected Profit</th>
              <th>Actual Revenue</th>
              <th>Actual Profit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={row.id} onClick={() => onRowClick(row)} style={{ cursor: "pointer" }}>
                <td>{idx + 1}</td>
                <td>{row.trip?.trip_unique_id}</td>
                {/* <td>{row.container_unique_id}</td> */}
                <td>TRN-{row.tracking_number}</td>
                <td>₦{row.landingCost.toLocaleString()}</td>
                <td>₦{row.expectedRevenue.toLocaleString()}</td>
                <td style={{color: row.expectedProfit >= 0 ? 'green' : 'red'}}>₦{row.expectedProfit.toLocaleString()}</td>
                <td>₦{row.actualRevenue.toLocaleString()}</td>
                <td style={{color: row.actualProfit >= 0 ? 'green' : 'red'}}>₦{row.actualProfit.toLocaleString()}</td>
                <td style={{color:"orange"}}>{"Not Complete"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="btn-row" style={{marginTop: '20px'}}><button className="cancel" onClick={goBack}>Previous</button></div>
    </div>
  );
};

export default ContainerProfitTable;