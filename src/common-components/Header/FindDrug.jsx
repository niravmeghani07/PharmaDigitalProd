// src/components/FlowDiagram.js

import React, { useState, useEffect, useRef, useCallback} from 'react';
import html2canvas from "html2canvas";
import Badge from '@mui/material/Badge';
import RequestApproval from "@mui/icons-material/MarkEmailRead";
import ReportingIcon from "@mui/icons-material/Feed";
import PendingIcon from '@mui/icons-material/Pending';
import Tooltip from "@mui/material/Tooltip";
import ReactFlow, { Controls, Background,BackgroundVariant , ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  applyEdgeChanges
} from 'react-flow-renderer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from "@mui/material/TextField";
import { Autocomplete, Button } from '@mui/material';
import "./Header.css";
import { green } from '@mui/material/colors';

let id = 3;
//const getId = () => `dndnode_${id++}`;

const FindDrug = () => {
  const reactFlowWrapper = useRef(null);
  const [processMaps, setProcessMaps] = useState([]);
  const [selectedMapName, setSelectedMapName] = useState('');
  const [flowData, setFlowData] = useState({nodes:[],edges:[]});
  const [initialFlowData, setInitialFlowData] = useState({ nodes: [], edges: [] });
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlowData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlowData.edges);
  const [ispopUpOpen, setIspopUpOpen] = useState(false);
  const [selectedFlowId, setSelectedFlowId] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  //const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const {project, setViewport} = useReactFlow();
  

  const navigate = useNavigate();

  useEffect(() => {
    fetchProcessMaps();
  }, []);

  
  useEffect(() => {
    if (selectedFlowId) {
      // Fetch the selected flow data from the server using the ID
      axios.get(`http://localhost:5000/api/process-map/${selectedFlowId}`)
        .then(response => {
          const fetchedFlowData = response.data;
          setInitialFlowData(fetchedFlowData);
          setNodes(response.data.nodes);
          setEdges(response.data.edges);
          setFlowData(response.data);
          const selectedFlow =processMaps.find(map =>map._id ===selectedFlowId);
          setSelectedMapName(selectedFlow ? selectedFlow.name:'');

        })
        .catch(error => {
          console.error('Error fetching flow data:', error);
        });
    }
  } , [selectedFlowId, setNodes, setEdges]);

  const handleSelectChange = (event) => {
    setSelectedFlowId(event.target.value);
    const flowId=event.target.value;
    setIsEditMode(false);
    navigate(`/dashboard/${event.target.value}`);
    //navigate(`/dashboard/667bc7b3627b46e43b5cc9b2`);
    //navigate('/dashboard',{state:{flowId}});
  };


  const onConnect = (params) => {
    setEdges(prevEdges => addEdge(params, prevEdges));
  };


  const handleEdit = () => {
    setIsEditMode(!isEditMode);
    setIspopUpOpen(false);
   
  }


  const fetchProcessMaps = () => {
    axios.get('http://localhost:5000/api/process-maps')
      .then(response => {
        console.log('Process maps response:', response.data);
        setProcessMaps(response.data);
      })
      .catch(error => {
        console.error('Error fetching process maps:', error);
       
      });
  };

  const handleSnapshot = () => {
    html2canvas(reactFlowWrapper.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "drug_process_flow.png";
      link.click();
    });
  };

  const handleExport = () =>{
    const currentnodes=nodes;
    const currentedges=edges;
  }

  const handleNavigate=()=>{
    if(selectedFlowId){

      navigate('/dashboard/${selectedFlowId}');
    
    }
    else{
      alert("please select a valid process map");
    }
  }
  


  return (
    
    <div style={{width:'100%'}}>
      <div>
      <select className="FindDrugDropdown" onChange={handleSelectChange} value={selectedFlowId}>
        <option value="">Select a Drug</option>
        {processMaps.map(map => (
          <option key={map._id} value={map._id}>{map.name}</option> // Ensure map._id or another unique identifier is used as key

        ))}
      

      </select>
      </div>
    
    </div>

  );
};


export default FindDrug;

