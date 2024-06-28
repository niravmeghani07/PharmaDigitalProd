// src/components/FlowDiagram.js

import React, { useState, useEffect, useRef, useCallback} from 'react';
import ReactFlow, { Controls, Background,BackgroundVariant , ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  applyEdgeChanges
} from 'react-flow-renderer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import TextField from "@mui/material/TextField";
import { Button } from '@mui/material';
import './index.css';

let id = 3;
//const getId = () => `dndnode_${id++}`;

const FlowDiagram = () => {
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
    setIsEditMode(false);
  };


  const onConnect = (params) => {
    setEdges(prevEdges => addEdge(params, prevEdges));
  };


  
  const getId = () => {

    const selectedFlow=processMaps.find(processMaps =>processMaps._id === selectedFlowId);
    const nodeIdName=selectedFlow?selectedFlow.name:'unknown';
    const nodeId=nodeIdName+'_'+nodes.length
    return nodeId;
  }

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'ove';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' ||!type) {
        return;
      }

      const position = project({
        x: event.clientX,
        y: event.clientY
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };
      setNodes(prevNodes => [...prevNodes, newNode]);

    },
   [project, nodes],
  );

  
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

 
  const handleExit = () => {
    navigate('/selectProduct');
  }

  

  const handleSave = () => {
    console.log('Flow data to be saved:', { nodes, edges });
    axios.put(`http://localhost:5000/api/process-map/${selectedFlowId}`, { nodes, edges })

      .then(response => {
        console.log('Flow data saved successfully:', response.data);
        setIsEditMode(false);
      })
      .catch(error => {
        console.error('Error saving flow data:', error);
      });
  };



  const handleSubmit = () => {
    handleSave();
    setIspopUpOpen(false);
   
  }


  const handleEdit = () => {
    setIsEditMode(!isEditMode);
    setIspopUpOpen(false);
   
  }


  return (
    
    <div>
      <select onChange={handleSelectChange} value={selectedMapName} style={{width:'300px',height:'40px', fontsize:'16px'}}>
        <option value="">Select a process map</option>
        {processMaps.map(map => (
          <option key={map._id} value={map._id}>{map.name}</option> // Ensure map._id or another unique identifier is used as key

        ))}
      </select>
      {selectedMapName && (
        <div className="process-map-name">
          <h2>{selectedMapName}</h2>
      
      {nodes.length>0 && (
        
          <div className={`dndflow ${ispopUpOpen? 'blurred' : ''}`}>
          <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow 
              nodes={nodes}
              edges={edges}
              onNodesChange={isEditMode ?onNodesChange : undefined}
              onEdgesChange={isEditMode ? onEdgesChange:undefined} 
              onConnect={isEditMode ? onConnect:undefined}
              onDrop={isEditMode ? onDrop:undefined}
              onDragOver={onDragOver}>
            <Background color="#ccc" variant={BackgroundVariant.Dots} size={1} />
            <Controls />
            </ReactFlow>
          </div>
          
            <Sidebar />
            <div class="button-container">
            {!isEditMode ? ( <button className='edit-button' onClick={handleEdit}>Edit</button>):
            (
              <button className='save-button' onClick={handleSubmit}>
              Save
            </button>

            )
            }
          <button className='exit-button' onClick={handleExit}>
            Exit
          </button>
         
          </div>
          </ReactFlowProvider>
          </div> 
      )}
      </div>
)}
    </div>
  );
};

export default FlowDiagram;

