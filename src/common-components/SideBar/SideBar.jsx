import React, { useState,useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useAppContext } from "../../context/appContext";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import CustomTreeView from "../CustomTreeView/CustomTreeView.jsx";
import "./SideBar.css";
import axios from 'axios';

const drawerWidth = 300;

const Sidebar = (props) => {
  const { handleRestore } = props;
  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = useState(1);
  const [sidebarData, setsidebarData] = useState([]);
  const {
    mainTreeData,
    updateMainTreeData,
    flowChartData,
    updateFlowChartData,
  } = useAppContext();

  const [flowDataArray, setFlowDataArray] = React.useState([]);

  const handleSelectedTabChange = (event) => {
    setSelectedTab(Number(event.target.value));
  };

  useEffect(() => {
    // Retrieve the array from session storage
    const arrayString = sessionStorage.getItem("flowchart");
    const parsedArray = JSON.parse(arrayString);

    //call axios to fetch the data from the server
    const fetchData = async()=>{
        try {
          const response = await axios.get("http://localhost:5000/api/sidebardata");
          setsidebarData(response.data);        
        } catch (error) {
          console.log("Error fetching the sidebardata: ",error);
        }
    }

    // const parsedTreeData = JSON.parse(TreeData);
    // Set the retrieved array in the component state
    fetchData();
    setFlowDataArray(parsedArray);
       
  }, []);



  const handleDrag = (e, innerItem, id) => {
    const customData = {
      name: innerItem,
      type: id,
    };
    switch (id) {
      case "ch-1":
        // Handle the drop action for type 1
        e.dataTransfer.setData(
          "flowChartDragEvent",
          JSON.stringify(customData)
        );
        break;
      case "ch-2":
        // Handle the drop action for type 2
        e.dataTransfer.setData(
          "processOperationDragEvent",
          JSON.stringify(customData)
        );
        break;
      case "ch-3":
        // Handle the drop action for type 3
        e.dataTransfer.setData(
          "processActionsDragEvent",
          JSON.stringify(customData)
        );
        break;
      default:
        // Handle the drop action for other types or no type
        console.log("Dropped type:", id);
        break;
    }
  };
  const handleTemplateClick = (selectedTemplateName) => {
    const TreeData = sessionStorage.getItem("mainTreeData");
    const parsedTreeData = JSON.parse(TreeData);
    console.log(
      "🚀 ~ file: SideBar.jsx:39 ~ React.useEffect ~ TreeData:",
      TreeData
    );
    console.log("selected template data", flowDataArray);
    updateMainTreeData(parsedTreeData);
    for (let i = 0; i < flowDataArray.length; i++) {
      if (flowDataArray[i].template === selectedTemplateName) {
        const storedTemplateData = flowDataArray[i];
        console.log("stored", storedTemplateData);

        if (storedTemplateData) {
          const jsonData = JSON.stringify(storedTemplateData, null, 2);
          const parsedData = JSON.parse(jsonData);
          const { nodes: restoredNodes, edges: restoredEdges } = parsedData;

          handleRestore(restoredNodes, restoredEdges);
        }
      }
    }
  };
  return (
    <div className="sidebar-container">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />

          <Box backgroundColor="#FEFFFF" sx={{ overflow: "auto" }}>
            <div className="sidebar-tab-selection">
              <FormControl>
                {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={selectedTab}
                  onChange={handleSelectedTabChange}
                >
                  <FormControlLabel
                    value="1"
                    control={
                      <Radio
                        sx={{
                          color: "#4E9F3D",
                          "&.Mui-checked": {
                            color: "#4E9F3D",
                          },
                        }}
                      />
                    }
                    label="Catalogue"
                  />
                  <FormControlLabel
                    value="2"
                    control={
                      <Radio
                        sx={{
                          color: "#4E9F3D",
                          "&.Mui-checked": {
                            color: "#4E9F3D",
                          },
                        }}
                      />
                    }
                    label="Template"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            {/* <Divider /> */}
            {selectedTab === 1 ? (
              <div>
                <div className="sidebar-search">
                  <TextField
                    sx={{ width: "95%" }}
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    id="outlined-basic"
                    label="Search"
                    variant="outlined"
                  />
                </div>
                <CustomTreeView
                  treeData={sidebarData}
                  searchValue={searchText}
                  handleDrag={handleDrag}
                />
              </div>
            ) : (
              <div>
                {flowDataArray?.map((ele) => {
                  return (
                    <div
                      className="template"
                      key={ele.id}
                      onClick={() => handleTemplateClick(ele.template)}
                    >
                      <p className="dot"></p>
                      {ele.template}
                    </div>
                  );
                })}
              </div>
            )}
          </Box>
        </Drawer>
      </Box>
    </div>
  );
};
export default Sidebar;
