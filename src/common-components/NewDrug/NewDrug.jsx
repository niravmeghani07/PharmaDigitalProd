import React, { useCallback } from 'react';
import Header from '../Header/Header';
import Sidebar from '../SideBar/SideBar';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
 
import 'reactflow/dist/style.css';
 
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
 
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
  <Header />
  <div style={{ flex: 1, display: 'flex' }}>
    <Sidebar />
    <div style={{ flex: 1, position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  </div>
</div>

  );
}

// import React, { useState, useRef, useCallback } from 'react';
// import ReactFlow, {
//   ReactFlowProvider,
//   addEdge,
//   useNodesState,
//   useEdgesState,
//   Controls,
// } from 'reactflow';
// import 'reactflow/dist/style.css';

// import Sidebar from '../SideBar/SideBar';

// const initialNodes = [
//   {
//     id: '1',
//     type: 'input',
//     data: { label: 'input node' },
//     position: { x: 250, y: 5 },
//   },
// ];

// let id = 0;
// const getId = () => `dndnode_${id++}`;

// const DnDFlow = () => {
//   const reactFlowWrapper = useRef(null);
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [reactFlowInstance, setReactFlowInstance] = useState(null);

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [],
//   );

//   const onDragOver = useCallback((event) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'move';
//   }, []);

//   const onDrop = useCallback(
//     (event) => {
//       event.preventDefault();

//       const type = event.dataTransfer.getData('application/reactflow');

//       // check if the dropped element is valid
//       if (typeof type === 'undefined' || !type) {
//         return;
//       }

//       // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
//       // and you don't need to subtract the reactFlowBounds.left/top anymore
//       // details: https://reactflow.dev/whats-new/2023-11-10
//       const position = reactFlowInstance.screenToFlowPosition({
//         x: event.clientX,
//         y: event.clientY,
//       });
//       const newNode = {
//         id: getId(),
//         type,
//         position,
//         data: { label: `${type} node` },
//       };

//       setNodes((nds) => nds.concat(newNode));
//     },
//     [reactFlowInstance],
//   );

//   return (
//     <div className="dndflow">
//       <ReactFlowProvider>
//         <div className="reactflow-wrapper" ref={reactFlowWrapper}>
//           <ReactFlow
//             nodes={nodes}
//             edges={edges}
//             onNodesChange={onNodesChange}
//             onEdgesChange={onEdgesChange}
//             onConnect={onConnect}
//             onInit={setReactFlowInstance}
//             onDrop={onDrop}
//             onDragOver={onDragOver}
//             fitView
//           >
//             <Controls />
//           </ReactFlow>
//         </div>
//         <Sidebar />
//       </ReactFlowProvider>
//     </div>
//   );
// };

// export default DnDFlow;
