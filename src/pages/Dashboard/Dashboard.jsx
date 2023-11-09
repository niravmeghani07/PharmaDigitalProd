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

const Dashboard = () => {
  const [productData, setProductData] = useState(null);
  const [productItemData, setProductItemData] = useState(null);
  const { currentProduct } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [restoredNode, setrestoredNode] = React.useState([]);
  const [restoredEdge, setrestoredEdge] = React.useState([]);

  React.useEffect(() => {
    sessionStorage.productName =
      <process className="env NODE_ENV"></process> === "production"
        ? sessionStorage.productName
        : "Nicotine 4mg";
    const fetchProductData = async () => {
      try {
        const productName = sessionStorage.productName;
        const productQuery = `ItemNumber=${productName}`;
        const data = await getProductDetails(productQuery);
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    const fetchProductItemStructure = async () => {
      setIsLoading(true);
      try {
        // const productName = sessionStorage.productName;
        const productName =
          currentProduct === null ? sessionStorage.productName : currentProduct;
        const productQuery = `ItemNumber=${productName}`;
        let payload = {
          q: productQuery,
          expand: "Component",
        };
        const data = await getProductItemStructure(payload);
        if (data) {
          setProductItemData(data?.items);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    // fetchProductData();
    fetchProductItemStructure();
  }, [currentProduct]);
  const handleRestore = (restoredNodes, restoredEdges) => {
    setrestoredNode(restoredNodes);
    setrestoredEdge(restoredEdges);
  };
  useEffect(() => {}, [restoredNode, restoredEdge]);

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
