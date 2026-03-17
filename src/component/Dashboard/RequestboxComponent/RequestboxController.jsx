import React, { useEffect, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import "../../../assets/Styles/dashboard/account/emptyAccount.scss";
import CreateRequestbox from "./CreateRequestbox";
import RequestboxTable from "./RequestboxTable";

const REQUESTBOX_KEY = "requestbox_data";

const RequestboxController = ({ autoOpenCreate, setAutoOpenCreate }) => {
  const [data, setData] = useState(() => {
    return JSON.parse(localStorage.getItem(REQUESTBOX_KEY)) || [];
  });

  const [view, setView] = useState("table");

  useEffect(() => {
    localStorage.setItem(REQUESTBOX_KEY, JSON.stringify(data));
    if (data.length === 0 && view !== "create") {
      setView("empty");
    }
  }, [data]);

  useEffect(() => {
    if (autoOpenCreate) {
      setView("create");
      setAutoOpenCreate(false);
    }
  }, [autoOpenCreate]);

  const handleCreate = (newItem) => {
    setData((prev) => [newItem, ...prev]);
    setView("table");
  };

  return (
    <div className="emptyAccount">
      <div className="emptyAccount-container">
        <div className="emptyAccount-content">
          {(view === "empty" || view === "table") && (
            <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper">
                </div>
                <div className="right-wrapper">
                  <div className="right-wrapper-input">
                    <Search className="input-icon" />
                    <input type="text" placeholder="Search requests..." />
                  </div>
                  {/* <button onClick={() => setView("create")}>New Request</button> */}
                </div>
              </div>
            </div>
          )}

          <div className="main-content">
            {data.length === 0 && view === "empty" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>Your request box is empty</p>
                  <span>Create a request to get started</span>
                </div>
              </div>
            )}

            {data.length > 0 && view === "table" && (
              <RequestboxTable data={data} />
            )}

            {view === "create" && (
              <CreateRequestbox 
                onCreate={handleCreate} 
                setView={setView} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestboxController;