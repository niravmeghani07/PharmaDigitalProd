import React from "react";
import FlowChart from "../../common-components/FlowChart/FlowChart.jsx";
import "./DashboardRightPanel.css";
import { useLocation } from "react-router-dom";

const DashboardRightPanel = (props) => {
  const location=useLocation();
  const loc= location.pathname.split('dashboard/')[1];
  console.log("loc",loc);
  const { productItemStructureData, restoredNode, restoredEdge } = props;
  return (
    <div className="dashboard-right-panel">
     
      <FlowChart
        productItemStructureData={productItemStructureData}
        title="Process Development Platform"
        restoredNode={restoredNode}
        restoredEdge={restoredEdge}
        drugId={loc}
      />
    </div>
  );
};

export default DashboardRightPanel;
