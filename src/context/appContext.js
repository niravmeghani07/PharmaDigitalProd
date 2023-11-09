import React, { useState, createContext, useContext } from "react";
import { explorerData } from "../constants/processData";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

function Appcontext({ children }) {
  const [mainTreeData, setMainTreeData] = useState(
    explorerData[0].mainTreeData
  );
  const [flowChartData, setFlowChartData] = useState(
    explorerData[1].FlowChartData
  );
  const [currentProduct, setCurrentProduct] = useState(null);

  const updateMainTreeData = (newData) => {
    setMainTreeData(newData);
  };

  const updateFlowChartData = (newData) => {
    setFlowChartData(newData);
  };

  const updateCurrentProduct = (newData) => {
    setCurrentProduct(newData);
  };

  return (
    <AppContext.Provider
      value={{
        mainTreeData,
        updateMainTreeData,
        currentProduct,
        updateCurrentProduct,
        updateFlowChartData,
        flowChartData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default Appcontext;
