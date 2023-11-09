import React, { useState } from 'react';
import './DropDown.css'

function Dropdown (props){
    const [showDropdown, setDropdownStatus] = useState('');

    const toggleDropdown = () => {
        if(showDropdown === ''){
            setDropdownStatus('show');
        }else{
            setDropdownStatus('');
        }
    }

    return (
        <div  onClick={toggleDropdown} className={`tkey-dropdown ${showDropdown === 'show' ? 'tkey-dropdown-onshow' : ''}`}> {props.dropdownselectedValue ? <div style={{display:"inline"}}><img style={{marginRight:"0.8rem"}} src={props.placeHolderImage} />{props.dropdownselectedValue}</div> : ""} <i onClick={toggleDropdown} className="arrow down"></i>
            <div className={"dropdown-options-container "+ showDropdown } value-index={props.dropdownIndex == undefined ? "" : props.dropdownIndex} onClick={toggleDropdown} > 
                {props.options.map((item,index) => (<div className="dropdown-options" key={index} data-value={item} onClick={(e)=> props.setDropdownSelectedValue(e)}> 
                    {item.toUpperCase()} 
                </div>))}
            </div>
        </div>
    )
}
export default Dropdown;
