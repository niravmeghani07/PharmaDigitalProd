import React, { useEffect, useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import Header from "../../common-components/Header/Header.jsx";
import Sidebar from "../../common-components/SideBar/SideBar.jsx";
import DashboardRightPanel from "../../components/DashboardRightPanel/DashboardRightPanel.jsx";
import MainAppWrapper from "../../common-components/MainAppWrapper/MainAppWrapper.jsx";
import { getProductDetails } from "../../services/modules/dashboard/dashboard.js";
import { getProductItemStructure } from "../../services/modules/dashboard/dashboard.js";
import LoginPage from "../../components/LoginPage/LoginPage.jsx";
import { useAppContext } from "../../context/appContext.js";
import Loader from "../../common-components/Loader/Loader.jsx";
import { useLocation, useParams } from "react-router-dom";

import axios from 'axios';

const Dashboard = () => {
  const {processId} =useParams();
  
  const [productData, setProductData] = useState(null);
  const [productItemData, setProductItemData] = useState(null);
  const { currentProduct } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [restoredNode, setrestoredNode] = React.useState([]);
  const [restoredEdge, setrestoredEdge] = React.useState([]);




  React.useEffect(() => {
console.log("process Id",processId);
    if (processId) {
      setIsLoading(true);
      // Fetch the selected flow data from the server using the ID
      axios.get(`http://localhost:5000/api/process-map/${processId}`)
        .then(response => {
          const fetchedFlowData = response.data;
          setrestoredNode(response.data.nodes);
          setrestoredEdge(response.data.edges);
          setIsLoading(false);
          
          
        })
        .catch(error => {
          console.error('Error fetching flow data:', error);
        });
    }
  }, [processId]);


  const handleRestore = (restoredNodes, restoredEdges) => {
    
    setrestoredNode(restoredNodes);
    setrestoredEdge(restoredEdges);
    
  };
  

  return (
    <>
      {sessionStorage.isUserLoggedIn === "true" ? (
        <div className="dashboard">
         
          {/* {isLoading && (
            <div className="overlay">
              <div className="loader">
                <Loader />
              </div>
            </div>
          )} */}
          <Header name={"pharma"} />
          <MainAppWrapper>
            <Sidebar handleRestore={handleRestore} />
            <DashboardRightPanel
              productItemStructureData={productItemData}
              restoredNode={restoredNode}
              restoredEdge={restoredEdge}
            />
          </MainAppWrapper>
        </div>
      ) : (
        <LoginPage />
      )}
    </>
  );
};

export default Dashboard;
