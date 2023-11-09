import React from "react";
import FlowChart from "../../common-components/FlowChart/FlowChart.jsx";
import "./DashboardRightPanel.css";

const DashboardRightPanel = (props) => {
  const { productItemStructureData, restoredNode, restoredEdge } = props;
  return (
    <div className="dashboard-right-panel">
      <FlowChart
        productItemStructureData={productItemStructureData}
        title="Process Development Platform"
        restoredNode={restoredNode}
        restoredEdge={restoredEdge}
      />
    </div>
  );
};

export default DashboardRightPanel;
