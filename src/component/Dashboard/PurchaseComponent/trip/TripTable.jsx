import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import TripDetails from "./TripDetails";
import "../../../../assets/Styles/dashboard/Purchase/table.scss";

  // if (selectedTrip) {
  //   return (
  //   <>
  //     {view === "details" && selectedTrip && (
  //       <TripDetails
  //         trip={selectedTrip}
  //         goBack={() => {
  //           setSelectedTrip(null);
  //           setView("table");
  //         }}
  //       />
  //     )}   
  //   </>   
  //   );
  // }
  const TripTable = ({ data, onDelete, onRowClick }) => {
    return (
      <div className="userTable">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Title</th>
                <th>Location</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
  
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="7">No Trips Found</td>
                </tr>
              ) : (
                data.map((trip, idx) => (
                  <tr key={trip.id} onClick={() =>onRowClick({...trip,sn: idx + 1,})}>
                    <td>{idx + 1}</td>
                    <td>{trip.title}</td>
                    <td>{trip.location}</td>
                    <td>{trip.startDate}</td>
                    <td>{trip.endDate}</td>
                    <td>{trip.status}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <Trash2
                        size={16}
                        color="red"
                        onClick={() => onDelete(trip.id)}
                      />
                    </td>
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