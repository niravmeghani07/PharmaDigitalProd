import React, { useState } from "react";
import "./LinearTreeView.css"; // Import your custom CSS file for styling
import { useAppContext } from "../../context/appContext.js";

function TreeNode({ label, children, parent, selectedTechValue }) {
  const [expanded, setExpanded] = useState(false);
  const { updateCurrentProduct } = useAppContext();

  const toggleNode = () => {
    setExpanded(!expanded);
  };

  const navigateToSelectedProductDetails = () => {
    updateCurrentProduct(label);
  };

  const getDisplayedLabel = () => {
    if (parent === label) {
      return (
        // <div className="parent-tree-node-content">Drug Product - {label}</div>
        <div className="parent-tree-node-content">
          Drug Substance - Pembrolizumab
        </div>
      );
    } else {
      return (
        <div
          onClick={navigateToSelectedProductDetails}
          className="child-tree-node-content"
        >
          Drug Substance ({label})
        </div>
      );
    }
  };

  return (
    <li>
      <div
        className={`linear-tree-node ${expanded ? "expanded" : ""}`}
        onClick={toggleNode}
      >
        {/* {children && (
          <span className="linear-arrow-icon">{expanded ? "▼" : "▶"}</span>
        )} */}
        {getDisplayedLabel()}
      </div>

      {children && expanded && (
        <ul className="linear-sub-tree">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              label={child.name}
              children={child.children}
              parent={parent}
              selectedTechValue={selectedTechValue}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
function CustomTreeView(props) {
  const { data, parent, selectedTechValue } = props;
  const { currentProduct } = useAppContext();

  return (
    <ul className="linear-tree-view">
      {data && data.length === 0 ? (
        <div className="parent-tree-node-content">
          Drug Substance -{" "}
          {currentProduct === null
            ? sessionStorage.productName
            : currentProduct}
        </div>
      ) : null}
      {data &&
        data.map((node) => (
          <TreeNode
            key={node.id}
            label={node.name}
            children={node.children}
            parent={"Humalog Mix50"}
            selectedTechValue={selectedTechValue}
          />
        ))}
    </ul>
  );
}

export default CustomTreeView;
