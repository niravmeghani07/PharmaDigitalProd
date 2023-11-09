import "./App.css";
import React from "react";
import { HashRouter } from "react-router-dom";
import AppContext from "./context/appContext";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import { ReactFlowProvider } from "react-flow-renderer";
import Router from "./routes/index.js";

function App() {
  return (
    <div className="App">
      <ReactFlowProvider>
        <AppContext>
          {/* <Dashboard /> */}
          <HashRouter>
            <Router />
          </HashRouter>
        </AppContext>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
