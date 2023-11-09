import React, { useState } from 'react';
import './CustomTreeView.css'; // Import your custom CSS file for styling

function TreeNode({ label, children, searchValue, handleDrag, type }) {
    const [expanded, setExpanded] = useState(true);

    const toggleNode = () => {
        setExpanded(!expanded);
    };

    const filteredChildren = children?.filter((child) =>
        child.toLowerCase().includes((searchValue || '').toLowerCase())
    );

    const handleDragStart = (event) => {
        handleDrag(event, label, type); // Call the handleDrag function with the event and label as arguments
    };

    return (
        <li>
            <div
                className={`tree-node ${expanded ? 'expanded' : ''}`}
                onClick={toggleNode}
                draggable
                onDragStart={handleDragStart}
            >
                {filteredChildren && (
                    <span className="arrow-icon">{expanded ? '▼' : '▶'}</span>
                )}
                <div className="tree-node-content">{label}</div>
            </div>
           
            {filteredChildren && expanded && (
               
                <ul className="sub-tree">
                    {filteredChildren.map((child, index) => {
                        return (
                            <>
                                <TreeNode
                                    key={index}
                                    label={child}
                                    children={null} // Set children to null since there are no sub-children for leaf nodes
                                    searchValue={searchValue}
                                    handleDrag={handleDrag}
                                    type={`ch-${type}`} // Pass the handleDrag function down to the TreeNode component
                                />
                            </>
                        )
                    })}
                </ul>
            )}
            
        </li>
    );
}

function CustomTreeView(props) {
    const { treeData, searchValue, handleDrag } = props;

    return (
        <ul className="tree-view">
            {treeData.map((node) => {
                return (
                    <TreeNode
                        key={node.id}
                        label={node.title}
                        children={node.children}
                        searchValue={searchValue}
                        handleDrag={handleDrag}
                        type={node.id} // Pass the handleDrag function down to the TreeNode component
                    />
                )
            })}
        </ul>
    );
}

export default CustomTreeView;
