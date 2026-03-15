import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import TripDetails from "./TripDetails";
import "../../../../assets/Styles/dashboard/table.scss";


  const TripTable = ({ data, onDelete, onRowClick }) => {
    return (
      <div className="userTable">
        <div className="table-wrap">
          <table className="table" style={{width:"120%",minWidth:"120%",maxWidth:"120%"}}>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Title</th>
                <th>description</th>
                <th>Location</th>
                <th>Supplier</th>
                <th>Clearing Agent</th>
                <th>Start</th>
                <th>End</th>
                <th>Created by</th>
                <th>Status</th>

                {/* <th>Action</th> */}
              </tr>
            </thead>
  
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td style={{textAlign:"center"}} colSpan="7">No Trips Found</td>
                </tr>
              ) : (
                data.map((trip, idx) => (
                  <tr key={trip.id} onClick={() =>onRowClick({...trip,trip_uuid: trip.trip_uuid,})}>
                    <td>{String(idx + 1).padStart(2, "0")}</td>
                    <td>{trip.title}</td>
                    <td>{trip.desc}</td>
                    <td>{trip.location}</td>
                    <td>{trip.supplier}</td>
                    <td>{trip.clearing_agent}</td>
                    <td>{trip.start_date}</td>
                    <td>{trip.end_date}</td>
                    <td>{trip?.creator_info.firstname} {trip?.creator_info.lastname}</td>
                  <td> <span style={{ color:  trip.progress === "NOT STARTED"  ? "red"  : trip.progress === "COMPLETED" ? "green": "orange"}}>{trip.progress}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default TripTable