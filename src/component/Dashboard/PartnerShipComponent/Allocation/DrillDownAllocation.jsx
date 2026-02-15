import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import CreateAllocation from "./CreateAllocation";

const DrillDownAllocation = ({ allocation, containers, onBack, onUpdate }) => {
  const [editable, setEditable] = useState(null);

  useEffect(() => {
    setEditable(JSON.parse(JSON.stringify(allocation)));
  }, [allocation]);

  if (!editable) return null;

  return (
    <div className="drilldown-wrapper">
      <X onClick={onBack} />

      <CreateAllocation
        drilldownMode
        containersData={containers}
        data={[editable]}
        setData={(updated) => {
          // ✅ updated allocation now comes from CreateAllocation
          setEditable(updated[0]);
          onUpdate(updated[0]);
          onBack(); // go back to table after update
        }}
      />
      
    </div>
  );
};

export default DrillDownAllocation;
