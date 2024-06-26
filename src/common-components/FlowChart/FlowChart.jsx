import "./FlowChart.css";
import { HashRouter, HashLink } from 'react-router-dom';
import React, { useRef } from "react";
import { useState, useCallback } from "react";
import ProcessOperation from "../../components/ProcessOperation/ProcessOperation.jsx";
import { useAppContext } from "../../context/appContext";
import UndoIcon from "@mui/icons-material/Undo";
import SaveScreenShot from "@mui/icons-material/AddAPhoto";
import RestoreInitialGraph from "@mui/icons-material/RestartAlt";
import SaveIcon from "@mui/icons-material/Save";
import Transfer from "../../assets/transfer.png";
import Export from "../../assets/export.png";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import RequestApproval from "@mui/icons-material/MarkEmailRead";
import ReportingIcon from "@mui/icons-material/Feed";
import Tooltip from "@mui/material/Tooltip";
import PendingIcon from '@mui/icons-material/Pending';
import html2canvas from "html2canvas";
import { toPng } from "html-to-image";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import Dropdown from "../Dropdown/TechTransferDropdown";
import { useReactFlow } from "react-flow-renderer";
import Badge from '@mui/material/Badge';
import ReactFlow, {
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
// import axios from "axios";

import { saveAs } from "file-saver";
import LinearTreeView from "../LinearTreeView/LinearTreeView.jsx";
import GenericModal from "../GenericModal/GenericModal.jsx";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import emailjs from "@emailjs/browser";
import AsiaFlowChartData from "../../constants/AsiaData/TempraryAsiaFlowChart";
//import AsiaMainTreeData from "../../constants/AsiaData/TempraryAsiaMainTreeData";
import Autocomplete from '@mui/material/Autocomplete';
import { instance as axios } from "../../services/root-service";
import cheerio from "cheerio";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const initialNodes = [
  // { id: "1", position: { x: 100, y: 100 }, data: { label: "Mixing" } },
  // { id: "2", position: { x: 300, y: 100 }, data: { label: "Milling" } },
  // { id: "3", position: { x: 500, y: 100 }, data: { label: "Formulation" } },
  // { id: "4", position: { x: 700, y: 100 }, data: { label: "Labeling" } },
  // { id: "5", position: { x: 900, y: 100 }, data: { label: "Compression" } },
  // { id: "6", position: { x: 1100, y: 100 }, data: { label: "Distribution" } },
];

const initialEdges = [
  // { id: "n1", source: "1", target: "2" }, //Mixing to Milling
  // { id: "n2", source: "2", target: "3" }, //Milling to Formulation
  // { id: "n3", source: "3", target: "1" }, //Formulation to Mixing
  // { id: "n4", source: "1", target: "4" }, //Mixing to Labeling
  // { id: "n5", source: "4", target: "1" }, //Labeling to Mixing
  // { id: "n6", source: "1", target: "3" }, //Mixing to Formulation
  // { id: "n7", source: "3", target: "4" }, //Formulation to Labeling
  // { id: "n8", source: "4", target: "5" }, //Labeling to Compression
  // { id: "n9", source: "5", target: "6" }, //Compression to Distribution
];

const array = [
  {
    id: 1,
    name: "Humalog Mix50",
    children: [
      { 
        id: 1,
        name: "Phenol",
        children: null,
      },
      {
        id: 2,
        name: "Protamine Sulfate",
        children: null,
      },
      {
        id: 3,
        name: "Glycerin",
        children: null,
      },
      {
        id: 4,
        name: "Dibasic Sodium Phosphate",
        children: null,
      },
      {
        id: 5,
        name: "Metacresol",
        children: null,
      },
      {
        id: 6,
        name: "Zinc",
        children: null,
      },
      {
        id: 7,
        name: "Oxide",
        children: null,
      },
      {
        id: 8,
        name: "Zinc Ion",
        children: null,
      },
    ],
  },
];

function FlowChart(props) {
  const { title, productItemStructureData, restoredNode, restoredEdge } = props;
  const {
    mainTreeData,
    updateMainTreeData,
    flowChartData,
    updateFlowChartData,
  } = useAppContext();
  const [selectedTechValue, setSelectedTechValue] = useState("Global");
  const [selectedTechSite, setSelectedTechSite] = useState("");
  const [treeProcessData, setTreeProcessData] = useState(mainTreeData);
  const [selectedProcessStageID, setSelectedProcessStageID] =
    React.useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [ID, setID] = useState(5);
  const [nodeHistory, setNodeHistory] = useState([]); // Array to store previous node states
  const reactFlowWrapper = useRef(null);
  const { reactFlowInstance } = useReactFlow();
  const flowRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [urlContent, setUrlContent] = useState({});
  const [templateName, setTemplateName] = useState("");
  const[recipient,setRecipient]= useState("");
  const[requestBody,setRequestBody] = useState("");
  const[synthesisTreeData,setsynthesisTreeData] = useState([]);
  const[requestStatus,setRequestStatus] = useState()
  const userDesignation = sessionStorage.designation;
  const[comments,setComments] = useState("");
  const[isNavigated,setisNavigated] = useState(false);
  const[drug,setDrug] = useState("");
  

  console.log(userDesignation);

  const [coOrds, setCoords] = useState({
    xPos: 580,
    yPos: 100,
  });

  const [isOpen, setIsOpen] = useState(false);

  const [undoClicked, setUndoClicked] = useState(0);
  const [isApprovalModalOpen, setApprovalModalOpen] = useState(false);
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);
  const [isPendigModalOpen, setPendingModalOpen] = useState(false);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const [isTechTransferModalOpen, setTechTransferModalOpen] = useState(false);
  const [isTemplateModalOpen_1, setTemplateModalOpen_1] = useState(false);
  const [isSaveDataopen,setSaveDataModalOpen] = useState(false)
  const [managerPendingRequestCount, setmanagerPendingRequestCount] = useState(0);
  const [managerPendingRequest,setmanagerPendingRequest] = useState([]);
  const [userPendingRequests,setuserPendingRequests] = useState([]);
  const [userPendingRequestCount,setuserPendingRequestCount] = useState(0);
  const [isApprovalRequestApproved, setIsApprovalRequestApproved] =
    useState(false);
  const [isApprovalRequestDeclined, setIsApprovalRequestDeclined] =
    useState(false);

  const username = sessionStorage.userName;
  const password = sessionStorage.password;
  const [isReportingRequestSend, setReportingIsRequestSend] = useState(false);
  const [email, setEmail] = useState([]);

  const handleRestoreClick = (restoredNodes, restoredEdges) => {
    setNodes(restoredNodes);
    setEdges(restoredEdges);
  };
  React.useEffect(() => {
    handleRestoreClick(restoredNode, restoredEdge);
  }, [restoredNode, restoredEdge]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const onNodeClick = (node) => {
    setSelectedProcessStageID(node.target.dataset.id);
  };

  const handleDrop = (e) => {
    const customDataString = e.dataTransfer.getData("flowChartDragEvent");
    if (customDataString) {
      console.log(customDataString);
      try {
        const customData = JSON.parse(customDataString);
        if (customData.type === "ch-1") {
          addNewProcess(customData.name);
        }
      } catch (error) {
        console.error("Error parsing custom data:", error);
      }
    } else {
      console.log("Wrong Value Dropped");
    }
  };
//{console.log(username)}
  const handleNodeChange = (newNodes) => {
    setNodeHistory((prevHistory) => [...prevHistory, nodes]); // Save previous node state to history
    setNodes(newNodes); // Update current node state
  };
  const addNewProcess = (data) => {
    let newObj = {};
    // newObj.id = data;
    newObj.id = (ID + 1).toString();
    // newObj.id = (mainTreeData.length + 1).toString();
    newObj.level = "first";
    newObj.isParent = true;
    newObj.label = data;
    newObj.children = [];
    updateMainTreeData([...mainTreeData, newObj]);
    handleNodeChange(nodes);
    // setPreviousEdges(edges);
    setNodes([
      ...nodes,
      {
        id: (ID + 1).toString(),
        position: { x: coOrds.xPos, y: coOrds.yPos },
        data: { label: data },
      },
    ]);
    setID(ID + 1);
    setCoords({
      xPos: coOrds.xPos + 100,
      yPOS: coOrds.yPos + 1,
    });
    setUndoClicked(undoClicked + 1);
  };
  const handleUndo = () => {
    nodes.pop();
    const updatedMainTreeData = [...mainTreeData];
    updatedMainTreeData.pop();
    setNodes([...nodes]);
    setUndoClicked(undoClicked - 1);
    updateMainTreeData([...updatedMainTreeData]);
  };

  const handleDownload = () => {
    html2canvas(reactFlowWrapper.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "graph_screenshot.png";
      link.click();
    });
  };
  const removeProcess = (key) => {
    key = key.target.getAttribute("processid");
    let treeProcessDataCopy = treeProcessData;
    let res = treeProcessDataCopy.filter((item, index) => {
      return item.id === key ? treeProcessDataCopy.splice(index, 1) : item;
    });
    setTreeProcessData((current) => [...treeProcessDataCopy]);
  };

  const onAdd = useCallback(() => {
    const newNode = {
      id: "4",
      data: { label: "Added node" },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

 const handleTemplateName = (event) => {
    console.log("event coming  = ", event.target.value);
    setTemplateName(event.target.value);
  }

  const handleGenericOpenModal = (modalName) => {
    switch (modalName) {
      case "approval-modal":
        setApprovalModalOpen(true);
        break;
      case "request-modal":
        setRequestModalOpen(true);
        break;
      case "PendingRequest-modal":
        setPendingModalOpen(true);
        break;
      case "saveTemplate-modal":
        setTemplateModalOpen(true);
        break;
      case "saveData-modal":
        setSaveDataModalOpen(true);
        break;   
      case "techTransfer-modal":
        setTechTransferModalOpen(true);
        break;
      default:
        console.log("no modal found");
    }
  };

  const handleGenericCloseModal = (modalName) => {
    switch (modalName) {
      case "approval-modal":
        setApprovalModalOpen(false);
        setIsApprovalRequestApproved(false);
        setIsApprovalRequestDeclined(false);
        break;
      case "request-modal":
        setRequestModalOpen(false);
        setReportingIsRequestSend(false);
        break;
      case "PendingRequest-modal":
        setPendingModalOpen(false);
        break;
      case "saveTemplate-modal":
        setTemplateModalOpen(false);
        break;
      case "techTransfer-modal":
        setTechTransferModalOpen(false);
        break;
      case "saveData-modal":
          setSaveDataModalOpen(false);
          break;
      default:
        console.log("no modal found");
    }
  };


  const handleApproveRequest = async (request) => {
    console.log("data.==>"+request.data);
    const userData = {
      data: request.data,
      comment: comments,
      statusModifiedData: new Date
    };
    console.log(userData);
    try{
      const res = await axios.post('http://localhost:5000/api/approvestatusupdate', userData);
      console.log('User registered successfully:', res.data);
    }
    
    catch (error) {
      console.error('Error approve status:', error.message);
    }
    setTimeout(() => {  window.location.reload();     }, 5000);
    //window.location.reload();
    setIsApprovalRequestApproved(true);
    setIsApprovalRequestDeclined(false);
  };

  const handleDeclineRequest = async (request) => {
   console.log("data.==>"+request.data);
    const userData = {
      data: request.data,
      comment: comments,
      statusModifiedData: new Date
    };
    console.log(userData);
    try{
      const res = await axios.post('http://localhost:5000/api/declinestatusupdate', userData);
      console.log('User registered successfully:', res.data);
    }
    
    catch (error) {
      console.error('Error approve status:', error.message);
      // Handle errors or show an error message to the user
    }
    setTimeout(() => {  window.location.reload();     }, 5000);
   // window.location.reload();
    setIsApprovalRequestDeclined(true);
    setIsApprovalRequestApproved(false);
  };

  const handlesubmitRequest = () => {
    setReportingIsRequestSend(true);
  };

  const handleSubmit= async(e)=>{
    e.preventDefault();
    setReportingIsRequestSend(true);
    const requestData = {
      from: sessionStorage.userName,
      to: recipient,
      data: requestBody,
      status: "Pending",
      drug: drug,
      comment: "",
      statusModifiedData: new Date()
    }
    
    try{
      const res = await axios.post('http://localhost:5000/api/sendRequest', requestData);
      console.log('Request sent successfully:', res.data);
     // const [isLoading, setIsLoading] = useState(false);
     // setIsLoading(true)
     // window.location.reload();
      setTimeout(() => {  window.location.reload();     }, 5000);
    }
    
    catch (error) {
      console.error('Error in sending Request:', error.message);
      // Handle errors or show an error message to the user
    }
    
}

  React.useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/register");
        const extractedEmails = response.data.filter(item => item.designation === "Manager").map(item => item.firstName);
        console.log("extractedEmails===>"+extractedEmails);
        setEmail(extractedEmails); // Assuming the response.data is an array of options
        console.log("email===>"+email);
      } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleInputChange = (event, newInputValue) => {
    setRecipient(newInputValue);
  };


  const handleSaveTemplate = () => {
    //alert(`Template "${templateName}" saved successfully`);
    setTemplateModalOpen_1(true);
    handleGenericCloseModal("saveTemplate-modal")
    const data = {
      id: (flowChartData.length + 1).toString(),
      template: templateName,
      nodes: nodes.map((node) => ({
        id: node.id,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        data: edge.data,
      })),
    };
    updateFlowChartData([...flowChartData, data]);
    const jsonData = JSON.stringify(data, null, 2);
    sessionStorage.setItem(templateName, jsonData);
    sessionStorage.setItem("TreeData", mainTreeData);
    const flow = JSON.stringify(flowChartData, null, 2);
    sessionStorage.setItem("flowchart", flow);
    console.log(templateName);
    setTemplateName("");
  };
  async function convertDocUrlToBase64(docUrl) {
    try {
      // Fetch the document
      const response = await fetch(docUrl);
      const blob = await response.blob();

      // Read the Blob as base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result;
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting document URL to base64:", error);
      throw error;
    }
  }
  async function fetchDocumentContent(url) {
    const response = await fetch(url);
    const content = await response.json();
    return content;
  }
  const fetchDataFromUrl = async (docUrl) => {
    try {
      const response = await axios.get(docUrl, {
        auth: {
          username: username,
          password: password,
        },
      });
      setUrlContent(response.data);
    } catch (error) {
      console.error("Error retrieving document content:", error);
    }
  };
  function base64ToJSON(base64String) {
    const jsonString = atob(base64String);
    // const jsonObject = JSON.parse(jsonString);
    return jsonString;
  }
  const handleRestoreData = () => {
    // const savedMainTreeData = JSON.parse(
    //   sessionStorage.getItem("mainTreeData")
    // );
    // if (savedMainTreeData) {
    //   updateMainTreeData(savedMainTreeData); // Optionally update the mainTreeData in the app context
    // }
    // const savedFlowChartData = JSON.parse(
    //   sessionStorage.getItem("TempraryFlow")
    // );

    // if (savedFlowChartData) {
    //   const jsonData = JSON.stringify(savedFlowChartData, null, 2);
    //   const parsedData = JSON.parse(jsonData);
    //   const { nodes: restoredNodes, edges: restoredEdges } = parsedData;

    const baseURL1 = "itemsV2?q=ItemNumber=Nicotine 4mg";

    axios
      .get(baseURL1)
      .then((response) => {
        const ItemRevisionUrl = response.data.items[0].links[105].href;
        let baseURL2 = ItemRevisionUrl;
        baseURL2 = baseURL2.replace(
          "https://eiiv-dev46.fa.us6.oraclecloud.com:443/fscmRestApi/resources/11.13.18.05",
          ""
        );

        axios
          .get(baseURL2)
          .then((response) => {
            console.log("3rd API Responses", response);

            let AttachmentUrl = response.data.items[0].links[7].href;

            AttachmentUrl = AttachmentUrl.replace(
              "https://eiiv-dev46.fa.us6.oraclecloud.com:443/fscmRestApi/resources/11.13.18.05",
              ""
            );
            const baseURL3 = AttachmentUrl;
            axios
              .get(baseURL3)
              .then((response) => {
                console.log("Attachment api Respose", response);

                const docUrl =
                  response.data.items[0].DocumentURL + "/TemplateData.json";

                const fetchData = async () => {
                  try {
                    const response = await fetch(docUrl);
                    const textData = await response;
                    const data = textData;
                  } catch (error) {
                    console.error("Error fetching JSON:", error);
                  }
                };

                console.log("data = ", urlContent);
              })
              .catch((error) => {
                console.error("Attachment API Error:", error);
              });
          })
          .catch((error) => {
            console.error("ItemRevision API Error:", error);
          });
      })
      .catch((error) => {
        console.error("API 2nd Error:", error);
      });
  };
  const handleConvertToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      console.log("base 64 = ", base64String);
      callback(base64String);
    };
    reader.readAsDataURL(file);
  };

  function convertJsonToJSONFile(jsonData, fileName) {
    const jsonContent = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    saveAs(blob, `${fileName}.json`);

    handleConvertToBase64(blob, (base64String) => {
      const baseURL = "erpintegrations";

      let FileName = "";
      let DocumentId = "";

      const data = {
        OperationName: "uploadFileToUCM",
        DocumentContent: base64String,
        DocumentAccount: "scm$/item$/import$",
        ContentType: "file",
        FileName: `${fileName}.json`,
        DocumentId: null,
      };

      axios
        .post(baseURL, data)
        .then((response) => {
          console.log("API Response:", response.data);
          DocumentId = response.data.DocumentId;
          FileName = response.data.FileName;

          let baseURL1 = "itemsV2?q=ItemNumber=Nicotine 4mg";

          axios
            .get(baseURL1)
            .then((response) => {
              console.log("Resposes 2nd API", response);

              const ItemRevisionUrl = response.data.items[0].links[105].href;
              const baseURL2 = ItemRevisionUrl.replace(
                "https://eiiv-dev46.fa.us6.oraclecloud.com:443/fscmRestApi/resources/11.13.18.05",
                ""
              );

              axios
                .get(baseURL2)
                .then((response) => {
                  console.log("3rd API Responses", response);

                  const AttachmentUrl = response.data.items[0].links[7].href;
                  const baseURL3 = AttachmentUrl.replace(
                    "https://eiiv-dev46.fa.us6.oraclecloud.com:443/fscmRestApi/resources/11.13.18.05",
                    ""
                  );

                  const data = {
                    FileName: FileName,
                    Title: FileName,
                    Description: "test the data",
                    DmVersionNumber: DocumentId,
                    CategoryName: "MISC",
                  };
                  axios
                    .post(baseURL3, data)
                    .then((response) => {
                      console.log("Attachment api Respose", response);
                    })
                    .catch((error) => {
                      console.error("Attachment API Error:", error);
                    });
                })
                .catch((error) => {
                  console.error("ItemRevision API Error:", error);
                });
            })
            .catch((error) => {
              console.error("API 2nd Error:", error);
            });
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    });
  }

  const handleSaveData = () => {
    const data = {
      id: "1",
      template: "temprary Template",
      nodes: nodes.map((node) => ({
        id: node.id,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        data: edge.data,
      })),
    };

    const jsonData = JSON.stringify(data, null, 2);
    sessionStorage.setItem("TempraryFlow", jsonData);
    const Data = [
      { mainTreeData: mainTreeData },
      { FlowChartData: [{ data }] },
    ];
    convertJsonToJSONFile(Data, "DrugProcessData");
  };

  React.useEffect(() => {
    //updateMainTreeData(mainTreeData);
    //call axios to fetch the data from the server
    const fetchData = async()=>{
      try {
        const response = await axios.get("http://localhost:5000/api/synthesisTreeData");
        setsynthesisTreeData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error fetching the sidebardata: ",error);
      }

    }

    const fetchPendingRequest = async()=>{
      try {
        console.log(username);
        const response = await axios.get("http://localhost:5000/api/pendingRequests");
        const requests = response.data;
        const pendingRequestCount = requests.length;
        const userRequest = requests.filter(request => request.from === username);
        const managerRequest = requests.filter(request => request.to === username);
        const userRequestCount = userRequest.filter(request => request.status === 'Pending').length;
        const managerRequestCount = managerRequest.filter(request => request.status === 'Pending').length;
        setmanagerPendingRequestCount(managerRequestCount);
        setmanagerPendingRequest(managerRequest);
        setuserPendingRequests(userRequest);
        setuserPendingRequestCount(userRequestCount);
      } catch (error) {
        console.log("Error fetching the pending requests : ",error);
      }
    }
    // Set the retrieved array in the component state
    fetchData();
    fetchPendingRequest();

    setNodes([]);
    setEdges([]);

    if (selectedTechValue === "Europe") {
      updateMainTreeData(synthesisTreeData);
      const jsonData = JSON.stringify(AsiaFlowChartData, null, 2);
      const parsedData = JSON.parse(jsonData);
      const { nodes: restoredNodes, edges: restoredEdges } = parsedData;

      handleRestoreClick(restoredNodes, restoredEdges);
    } else if (selectedTechValue === "Global") {
      console.log("daivik chauhan = ", flowChartData[0]);
      updateMainTreeData(synthesisTreeData);
      const jsonData = JSON.stringify(flowChartData[0], null, 2);
      const parsedData = JSON.parse(jsonData);
      const { nodes: restoredNodes, edges: restoredEdges } = parsedData;

      handleRestoreClick(restoredNodes, restoredEdges);
    }
  }, [selectedTechValue]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleRequestDataClick = (e) =>{
    e.preventDefault();
    setisNavigated(true);
    // Navigate to a new page
    window.open(`/${drug}`, '_blank');
  }

  const handleChange = (event) => {
    setDrug(event.target.value);
  };
  const handleSelect = (name) => {
    setSelectedTechSite(name);
    toggleDropdown();
  };
  const handleSelectCreate = () => {
    setSelectedTechValue(selectedTechSite);
    handleGenericCloseModal("techTransfer-modal");
  };
  const openExcelInNewTab = () => {
    const excelURL =
      "https://amedeloitte-my.sharepoint.com/:x:/g/personal/dachauhan_deloitte_com/EXfwcjaRWqBFpRYBa79bvjQByUOmUjcyR1Rv_N3yOAU5cw?e=pWq2aK";
    window.open(excelURL, "_blank");
  };
  return (
    <>
      <div className="main-container">
        <div className="process-stage">
          <div className="process-stage-item-container">
            <div style={{ display: "flex" }}>
              <LinearTreeView
                parent={sessionStorage.productName}
                data={array}
              />
              <Dropdown
                selectedTechValue={selectedTechValue}
                setSelectedTechValue={setSelectedTechValue}
                setSelectedTechSite={setSelectedTechSite}
                selectedTechSite={selectedTechSite}
              />
            </div>
            <div className="process-stage-save-container">
              <Tooltip title={"Tech-Transfer"} arrow>
                <div
                  onClick={() => handleGenericOpenModal("techTransfer-modal")}
                  style={{ marginRight: "0.625rem", cursor: "pointer" }}
                >
                  <img src={Transfer} width={"32px"} height={"29px"} />
                </div>
              </Tooltip>
              <Tooltip title={"Undo"} arrow>
                <div style={{ marginRight: "0.625rem" }}>
                  <UndoIcon
                    fontSize="large"
                    style={{
                      color: undoClicked === 0 ? "grey" : "#4e9f3d",
                      pointerEvents: undoClicked === 0 ? "none" : "",
                      marginRight: "0.5rem",
                      cursor: "pointer",
                    }}
                    onClick={handleUndo}
                  />
                </div>
              </Tooltip>
              {/* <Tooltip title={"Restore"} arrow>
                <div style={{ marginRight: "0.625rem" }}>
                  <RestoreInitialGraph
                    fontSize="large"
                    style={{ cursor: "pointer" }}
                    onClick={handleRestoreData}
                  />
                </div>
              </Tooltip> */}
              <Tooltip title={"Take a Snapshot"} arrow>
                <div style={{ marginRight: "0.625rem" }}>
                  <SaveScreenShot
                    fontSize="large"
                    style={{ cursor: "pointer" }}
                    onClick={handleDownload}
                  />
                </div>
              </Tooltip>

              {userDesignation === 'Manager' &&(
                <Badge badgeContent={managerPendingRequestCount} color="error">
               <Tooltip title={"Approve"} arrow>
                <div
                  onClick={() => handleGenericOpenModal("approval-modal")}
                  style={{ marginRight: "0.625rem" }}
                >
                  <RequestApproval
                    fontSize="large"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Tooltip>
              </Badge>)}
             
            {userDesignation === 'Analyst' &&(
             <Tooltip title={"Reporting"} arrow>
                <div
                  onClick={() => handleGenericOpenModal("request-modal")}
                  style={{ marginRight: "0.625rem" }}
                >
                  <ReportingIcon
                    fontSize="large"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Tooltip>)}

              {userDesignation === 'Analyst' &&(
                <Badge badgeContent={userPendingRequestCount} color="error">
                <Tooltip title={"Pending"} arrow>
                  <div 
                    onClick={()=>handleGenericOpenModal("PendingRequest-modal")}
                    style={{ marginRight: "0.625rem" }}
                  >
                    <PendingIcon 
                    fontSize="large"
                    style={{ cursor: "pointer" }}
                  />
                </div>
                </Tooltip>
                </Badge>
              )
              }

              {userDesignation === 'Analyst' &&(
              <Tooltip title={"Save"} arrow>
                <div 
                onClick={()=>handleGenericOpenModal("saveData-modal")}
                style={{ marginRight: "0.625rem" }}
                >
                  <SaveIcon
                    fontSize="large"
                    // onClick={() => {
                    //   alert("Data is Successfully Saved");
                    // }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Tooltip>)}

              <Tooltip title={"Save as Template"} arrow>
                <div
                  onClick={() => handleGenericOpenModal("saveTemplate-modal")}
                  style={{ marginRight: "0.625rem", cursor: "pointer" }}
                >
                  <SaveAltIcon fontSize="large" />
                </div>
              </Tooltip>
              <Tooltip title={"Export Data"} arrow>
                <div
                  onClick={openExcelInNewTab}
                  style={{ marginRight: "0.625rem", cursor: "pointer" }}
                >
                  <img src={Export} width={"32px"} height={"29px"} />
                </div>
              </Tooltip>
            </div>
          </div>
          <div>
          {/* {(userDesignation !== 'Manager' || isNavigated) && ( */}
          {/* {(!((window.location.href.includes("/PharmaDigitalProd")) && (userDesignation === 'Manager')))&& ( */}
          <div
            className="process-stage-item"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div
              ref={reactFlowWrapper}
              style={{ height: "40vh", width: "100%" }}
            >
            <ReactFlow
               nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
              > 
              {isReportingRequestSend ? (
                <Controls showInteractive='false' />
                 ) : (
                    <Controls />
                      )}
              </ReactFlow>
            </div>
          </div>
          {/* )} */}
          <ProcessOperation
            selectedProcessStageID={selectedProcessStageID}
            className="process-stage-item"
          />
        </div>
        </div>
      </div>
      {isApprovalModalOpen && (
        <GenericModal
          open={isApprovalModalOpen}
          handleClose={() => handleGenericCloseModal("approval-modal")}
          body={
            <div>
              {isApprovalRequestApproved && (
                <div className="modal-response-msg success">
                  Request Approved !
                </div>
              )}
              {isApprovalRequestDeclined && (
                <div className="modal-response-msg reject">
                  Request Declined !
                </div>
              )}
              {!isApprovalRequestApproved && !isApprovalRequestDeclined ? (
                <div className="modal-body">
                  <div className="modal-title">Approve Request</div>
                  {/* <div className="modal-input">
                    <TextField
                      id="outlined-multiline-static"
                      label="Description"
                      multiline
                      rows={4}
                      sx={{ width: "100% !important" }}
                    />
                  </div> */}
                  {managerPendingRequest.length>0 ? (
                  
                    <table className="approval-table">
                      <thead>
                        <tr>
                          <th>Sender</th>
                          <th>Request</th>
                          <th>Drug</th>
                          <th>Action</th>
                          <th>Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {managerPendingRequest.map((request)=>(
                          <tr key={request._id}>
                           <td className="sender">{request.from}</td>
                            <td className="request-data">
                              {request.data}
                            </td>
                            <td className="drug">
                            <a href={"#"} onClick={(e) => handleRequestDataClick(e)}>
                                {request.drug}
                               </a>
                            </td>
                            <td className="action-buttons">
                            {request.status === 'Pending' ?(
                              <div className="modal-button">
                                  <Button
                                  variant="outlined"
                                  color="success"
                                  onClick={()=>handleApproveRequest(request)}
                                >
                                  APPROVE
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={()=>handleDeclineRequest(request)}
                                >
                                  DECLINE
                                </Button>
                              </div>
                            ):(
                              <p style={{ color: request.status === 'Approved' ? 'green' : 'red' }}>
                                {request.status}
                              </p>
                            )} 
                            </td>
                            <td className="comment-textBox">
                            {request.status === 'Pending' ?(
                              <div className="modal-button">
                                 <TextField
                                      id="comments-multiline-static"
                                      value={comments}
                                      onChange={(e)=>setComments(e.target.value)}
                                      multiline
                                      rows={4}
                                      sx={{ width: "100% !important" }}
                                />
                               
                              </div>
                            ):(
                              <p>
                                {request.comment}
                              </p>
                            )} 
                            </td>
                          </tr>
                    ))}
                      </tbody>
                    </table>
                
                  ):(
                  <div>No pending requests</div>
                  )}
                  
                </div>
              ) : (
                <></>
              )}
            </div>
          }
        />
      )}
      {isRequestModalOpen && (
        <GenericModal
          open={isRequestModalOpen}
          handleClose={() => handleGenericCloseModal("request-modal")}
          body={
            <div>
              {isReportingRequestSend && (
                <div className="modal-response-msg success">Request Send !</div>
              )}
              {!isReportingRequestSend ? (
                <div className="modal-bodynew" >
                  <form onSubmit={handleSubmit}>
                  <div className="modal-title">Request Approval</div>
                  <div className="modal-input">
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={email}
                      sx={{ width: "120% !important", marginBottom: "10px" }}
                      renderInput={(params) => <TextField
                        {...params}
                        id="outlined-multiline-static"
                        label="To"
                       // value={recipient}
                        onChange={(e)=>handleInputChange(e,e.target.value)}
                      />}
                      value={recipient}
                      onChange={(event, newValue) => setRecipient(newValue)}
                    />
                    
                    <FormControl sx={{ width: "120% !important", marginBottom: "10px" }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Drug</InputLabel>
                      <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={drug}
                      onChange={handleChange}
                      autoWidth
                      label="drug"
                      >
                      <MenuItem value={'Pembrolizumab'}>Pembrolizumab</MenuItem>
                      </Select>
                      </FormControl>
                      </div>
                        
                    <TextField
                      id="outlined-multiline-static"
                      label="Description"
                      value={requestBody}
                      onChange={(e)=>setRequestBody(e.target.value)}
                      multiline
                      rows={4}
                      sx={{ width: "120% !important" }}
                    />
                 
                  <div className="modal-button">
                    <Button
                      variant="outlined"
                      color="success"
                      type = "submit"
                    >
                      SEND
                    </Button>
                  </div>
                  </form>
                </div>
              ) : (
                <></>
              )}
            </div>
          }
        />
      )}
     {isPendigModalOpen && (
  <GenericModal
    open={isPendigModalOpen}
    handleClose={() => handleGenericCloseModal("PendingRequest-modal")}
    body={
      <div>
        {userPendingRequests.length > 0 ? (
          <table className="approval-table">
            <thead>
              <tr>
                <th>To</th>
                <th>Request</th>
                <th>Drug</th>
                <th>Status</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {userPendingRequests.map((request) => (
                <tr key={request._id}>
                  <td className="sender">{request.to}</td>
                  <td className="request-data">{request.data}</td>
                  <td className="drug">
                            <a href={"#"} onClick={(e) => handleRequestDataClick(e)}>
                                {request.drug}
                               </a>
                            </td>
                  <td className="status">
                    <div className="modal-button">
                      {request.status === 'Approved' && (
                        <p style={{ color: 'green' }}>
                          Approved
                        </p>
                      )}
                      {request.status === 'Pending' && (
                        <p style={{ color: 'orange' }}>
                          Pending
                        </p>
                      )}
                      {request.status === 'Declined' && (
                        <p style={{ color: 'red' }}>
                          Declined
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="request-comments">{request.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Handle the case where requiredUserData is empty
          <p>No data available</p>
        )}
      </div>
    }
  ></GenericModal>
)}


      {isTemplateModalOpen && (
        <GenericModal
          open={isTemplateModalOpen}
          handleClose={() => handleGenericCloseModal("saveTemplate-modal")}
          body={
            <div>
              {!isReportingRequestSend ? (
                <div className="modal-body">
                  <div className="modal-title">Template Name</div>
                  <div className="modal-input">
                    <TextField
                      id="outlined-multiline-static"
                      label="Enter Template Name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      sx={{
                        justifyContent: "center",
                        width: "100% !important",
                        marginBottom: "10px",
                      }}
                    />
                  </div>
                  <div className="modal-button">
                    <Button
                      onClick={handleSaveTemplate}
                      variant="outlined"
                      color="success"
                    >
                       Save
                    </Button>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          }
        />
      )}
      {isSaveDataopen && (
        <GenericModal
          open={isSaveDataopen}
          handleClose={()=> handleGenericCloseModal("saveData-modal")}
          body={
            <div>{
              <div className="modal-response-msg success">Data Saved!</div>
             }
            </div>
          }
        />
      )
      }
     {isTemplateModalOpen_1 && (
      <GenericModal
        open={isTemplateModalOpen_1}
        handleClose={()=>setTemplateModalOpen_1(false)}
        body={
          <div>
            <div className="modal-response-msg success">Template saved successfully</div>
          </div>
        }
        />
     )
     }
      {isTechTransferModalOpen && (
        <GenericModal
          open={isTechTransferModalOpen}
          handleClose={() => handleGenericCloseModal("techTransfer-modal")}
          body={
            <div>
              {/* {isReportingRequestSend && (
                <div className="modal-response-msg success">Request Send !</div>
              )} */}
              {
                <div className="modal-body">
                  <div className="modal-title">Tech-Transfer</div>
                  <div className="modal-input" style={{ marginBottom: "3rem" }}>
                    <div
                      className={`dropdown-container-f ${isOpen ? "open" : ""}`}
                    >
                      <TextField
                        className="dropdown-button-f"
                        value={selectedTechSite}
                        onClick={toggleDropdown}
                        placeholder="Enter Tech Site"
                        // onChange={handleSelect}
                      />

                      {isOpen && (
                        <div className="dropdown-content-f">
                          <ul className="dropdown-list">
                            <li
                              className="dropdown-item"
                              onClick={() => handleSelect("Europe")}
                            >
                              Europe
                            </li>
                            <li
                              className="dropdown-item"
                              onClick={() => handleSelect("US")}
                            >
                              US
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="modal-button">
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={handleSelectCreate}
                    >
                      Create
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        handleGenericCloseModal("techTransfer-modal")
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              }
            </div>
          }
        />
      )}
    </>
  );
}

export default FlowChart;
