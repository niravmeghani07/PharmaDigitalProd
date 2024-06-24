import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  const [processStage, setProcessStage ] = useState([]);

  useEffect(() => {
    //call axios to fetch the data from the server
    const fetchData = async()=>{
        try {
          const response = await axios.get("http://localhost:5000/api/sidebardata");
          let stageDate = response.data[2];
          setProcessStage(stageDate["children"]);
        } catch (error) {
          console.log("Error fetching the sidebardata: ",error);
        }
    } 
    fetchData();    
  }, []);

  const nodeElements = processStage.map((nodeType, index) => (
    <div
      key={index}
      className="dndnode"
      onDragStart={(event) => onDragStart(event, nodeType)}
      draggable
    >
      {nodeType}
    </div>
  ));

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      {nodeElements}
    </aside>
  );
};
