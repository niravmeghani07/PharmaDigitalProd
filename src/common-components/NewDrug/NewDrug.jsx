import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant
} from 'reactflow';
import TextField from "@mui/material/TextField";
import { Button } from '@mui/material';
import 'reactflow/dist/style.css';
import Sidebar from './Sidebar';
import axios from 'axios';

import './index.css';
import { useNavigate } from 'react-router-dom';

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [ispopUpOpen, setIspopUpOpen] = useState(false);
  const [flowmapName, setFlowmapName] = useState("");
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const navigate = useNavigate();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

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

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const handleSave = () => {
    setIspopUpOpen(true);
  }

  const saveFlow = async() => {
    const flowName = flowmapName;
    if (flowName) {
      const flowData = {
        name: flowName,
        nodes: nodes,
        edges: edges,
      };
      const flowDataJson = JSON.stringify(flowData, null, 2);
      console.log(flowDataJson);
      try {
        const response = await axios.post('http://localhost:5000/api/flowchartData', flowDataJson, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        console.log(response.data);
      } catch (error) {
        console.log('Error in sending flowchart',error)
      }
    } else {
      alert("Flow name is required to save it");
    }
  }

  const handleSubmit = () => {
    saveFlow();
    setIspopUpOpen(false);
  }

  const handleExit = () => {
    navigate('/selectProduct');
  }

  const handlePopupClick = (event) => {
    if (event.target.className === 'popup-overlay') {
      setIspopUpOpen(false);
      setFlowmapName("");
    }
  }
  return (
    <>
      <div className={`dndflow ${ispopUpOpen? 'blurred' : ''}`}>
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <Background color="#ccc" variant={BackgroundVariant.Dots} size={1.75} />
              <Controls />
            </ReactFlow>
          </div>
          <Sidebar />
          <button className='save-button' onClick={handleSave}>
            Save
          </button>
          <button className='exit-button' onClick={handleExit}>
            Exit
          </button>
        </ReactFlowProvider>
      </div>
      {ispopUpOpen && (
        <div className="popup-overlay" onClick={handlePopupClick}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              backgroundColor: '#fff',
              borderRadius: '5px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
              padding: '15px',
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="modal-title">Drug Name</div>
              <TextField
                id="outlined-multiline-static"
                label="Enter Name"
                value={flowmapName}
                onChange={(e) => setFlowmapName(e.target.value)}
                rows={1}
                sx={{ width: "100%!important" }}
              />
                <div className="modal-button" />
                  <Button
                    variant="outlined"
                    color="success"
                    type="submit"
                    sx={{
                      width: "40%",
                      display: "block",
                      margin: "5px auto" }}
                  >
                    SAVE
                  </Button>
              </form>
            </div>
          </div>
      )}
    </>
  );
};

export default DnDFlow;