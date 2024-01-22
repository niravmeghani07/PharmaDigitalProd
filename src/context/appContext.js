import React, { useState, createContext, useContext } from "react";
import { explorerData } from "../constants/processData";
import axios from 'axios';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

function Appcontext({ children }) {
  const[synthesisTreeData,setsynthesisTreeData] = useState([]);
  const [mainTreeData, setMainTreeData] = useState([]);
  const [flowChartData, setFlowChartData] = useState(
    explorerData[1].FlowChartData
  );
  const [currentProduct, setCurrentProduct] = useState(null);

  React.useEffect(() => {
    //updateMainTreeData(mainTreeData);
    //call axios to fetch the data from the server
    const fetchData = async()=>{
      try {
        const response = await axios.get("http://localhost:5000/api/synthesisTreeData");
        setsynthesisTreeData(response.data);
        //console.log(response.data);
      } catch (error) {
        console.log("Error fetching the sidebardata: ",error);
      }

    }
  // Set the retrieved array in the component state
  fetchData();
},[]);

  const updateMainTreeData = () => {
    setMainTreeData(synthesisTreeData);
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
