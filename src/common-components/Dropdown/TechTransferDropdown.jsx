import React, { useState } from "react";

const Dropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedTechValue, setSelectedTechValue, setSelectedTechSite } =
    props;

  const handleSelect = (name) => {
    setSelectedTechValue(name);
    toggleDropdown();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={`dropdown-container ${isOpen ? "open" : ""}`}>
      <button className="dropdown-button" onClick={toggleDropdown}>
        {selectedTechValue || "Select an Option"}
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}></span>
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <ul className="dropdown-list">
            <li
              className="dropdown-item"
              onClick={() => handleSelect("Global")}
            >
              Global
            </li>
            <li
              className="dropdown-item"
              onClick={() => handleSelect("Europe")}
            >
              Europe
            </li>
            {/* <li className="dropdown-item" onClick={() => handleSelect("US")}>
              US
            </li> */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
