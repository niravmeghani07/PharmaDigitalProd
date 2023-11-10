import React from "react";
import { Route, Routes, Navigate, useParams, useLocation } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import LoginPage from "../components/LoginPage/LoginPage.jsx";
import EditUserPage from '../common-components/EditUserProfile/EditUserPage.jsx';

function Router() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/edit-user" element={<EditUserPage />} />
      <Route path="/:product*" element={<VariableRoute />} />
    </Routes>
  );
}

function VariableRoute() {
  const { product } = useParams();
  const location = useLocation();

  // Log the variable name
  console.log("Variable name:", product);
  // sessionStorage.test=product

  // Remove the leading hash from the hash value
  const cleanedHash = window.location.hash.replace(/^#/, "");

  // Redirect to the root URL ("/") if the cleaned hash is not empty
  React.useEffect(() => {
    if (cleanedHash !== "") {
      window.location.href = "/PharmaDigitalProd";
    }
  }, [cleanedHash]);

  return null;
}

export default Router;
