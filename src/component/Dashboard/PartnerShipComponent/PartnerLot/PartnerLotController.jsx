import React, { useMemo, useState } from "react";
import "../../../../assets/Styles/dashboard/controller.scss";
import PartnerLotTable from "./PartnerLotTable";
import { ChevronDown, Filter, Search } from "lucide-react";
import DrillDownPartnerLot from "./DrillDownPartnerLot";

const ALLOCATION_KEY = "allocation_data";

const PartnerLotController = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [view, setView] = useState("table");

  const allocations =
    JSON.parse(localStorage.getItem(ALLOCATION_KEY)) || [];
    /* =================container StatusMap ================= */
  const containerStatusMap = useMemo(() => {
    const map = {};
  
    allocations.forEach(allocation => {
      const invested = allocation.allocations.reduce(
        (s, a) => s + Number(a.amount || 0),
        0
      );
  
      const remaining = Math.max(
        allocation.estimatedAmount - invested,
        0
      );
  
      map[allocation.containerTrackingNumber] = {
        isCompleted: remaining === 0,
        remainingAmount: remaining,
        investedAmount: invested,
        estimatedAmount: allocation.estimatedAmount,
      };
    });
  
    return map;
  }, [allocations]);
    /* ================= DERIVED PARTNER LOT ================= */
    const partners =
    JSON.parse(localStorage.getItem("partner_data")) || [];
  
  const entities =
    JSON.parse(localStorage.getItem("entity_data")) || [];
  
  const partnerMap = useMemo(() => {
    const map = {};
    partners.forEach(p => {
      map[p.id] = p;
    });
    return map;
  }, [partners]);
  
  const entityMap = useMemo(() => {
    const map = {};
    entities.forEach(e => {
      map[e.id] = e;
    });
    return map;
  }, [entities]);
  
    const partnerLots = useMemo(() => {
      const map = {};
    
      allocations.forEach(allocation => {
        allocation.allocations.forEach(a => {
          const key = `${a.assigneeType}-${a.assigneeId}`;
          const status = containerStatusMap[allocation.containerTrackingNumber];
    
          if (!map[key]) {
            const profile =
              a.assigneeType === "partner"
                ? partnerMap[a.assigneeId]
                : entityMap[a.assigneeId];
          
            map[key] = {
                id: `${a.assigneeType}-${a.assigneeId}`,              
              assigneeId: a.assigneeId,
              assigneeType: a.assigneeType,
              name: a.assigneeName,
          
              // ✅ identity data
              email: profile?.email || "—",
              phone: profile?.phone || "—",
              createdAt: profile?.createdAt || null,
          
              // containers
              totalContainers: 0,
              completedContainers: 0,
              inTransitContainers: 0,
          
              // investment
              totalInvestment: 0,
              completedInvestment: 0,
              inTransitInvestment: 0,
          
              allocations: [],
            };
          }
          
          // total container involvement
          map[key].totalContainers += 1;
    
          // total investment
          const amount = Number(a.amount || 0);
          map[key].totalInvestment += amount;
    
          // container status split
          if (status?.isCompleted) {
            map[key].completedContainers += 1;
            map[key].completedInvestment += amount;
          } else {
            map[key].inTransitContainers += 1;
            map[key].inTransitInvestment += amount;
          }
    
          const rowKey = `${allocation.id}-${a.assigneeId}`;

          const exists = map[key].allocations.some(
            r => r.rowKey === rowKey
          );
          
          if (!exists) {
            map[key].allocations.push({
              rowKey,
              allocationId: allocation.id,
              containerTrackingNumber: allocation.containerTrackingNumber,
              amount,
              percentage: a.percentage,
              estimatedAmount: allocation.estimatedAmount,
              isCompleted: status?.isCompleted ?? false,
            });
          }
          
        });
      });
    
      return Object.values(map);
    }, [allocations, containerStatusMap]);
    
  /* ================= HANDLERS ================= */
  const handleRowClick = (row) => {
    setSelectedPartner(row);
    setView("drilldown");
  };

  const showEmpty = partnerLots.length === 0;

  return (
    <div className="controller">
      <div className="controller-container">
        <div className="controller-content">

          {(view === "table" || view === "empty") && (
            <div className="top-content">
              <div className="top-content-wrapper">
                <div className="left-wrapper" />

                <div className="right-wrapper">
                  <div className="right-wrapper-input">
                    <Search className="input-icon" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="select-input">
                    <div className="filter">
                      <span>Add Filter</span>
                      <Filter />
                    </div>
                  </div>

                  <div className="select-input">
                    <div className="select-input-field">
                      <span>All Field</span>
                      <ChevronDown />
                    </div>
                  </div>

                  <div className="import-input"><p>Import</p></div>
                  <div className="import-input"><p>Export</p></div>
                </div>
              </div>
            </div>
          )}

          <div className="main-content">
            {showEmpty && view === "table" && (
              <div className="main-content-image">
                <div className="main-content-image-text">
                  <p>No Data Created Yet</p>
                  <span>A data created would be saved here automatically</span>
                </div>
              </div>
            )}

            {!showEmpty && view === "table" && (
              <PartnerLotTable
                data={partnerLots}
                onRowClick={handleRowClick}
              />
            )}

            {view === "drilldown" && selectedPartner && (
              <DrillDownPartnerLot data={selectedPartner}
              onCancel={setView} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerLotController;
