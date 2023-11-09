import React, { Children, useEffect } from "react";
import "./ProcessOperation.css";
import ProcessActionContainer from "../ProcessAction/ProcessAction.jsx";
import { dropdownData } from "../../constants/processData.js";
import { useAppContext } from "../../context/appContext";
import Dropdown from "../../common-components/Dropdown/DropDown.jsx";
import ProcessOperationTabs from "../ProcessOperationTabs/ProcessOperationTabs.jsx";

export default function ProcessOperationContainer(props) {
  const { selectedProcessStageID } = props;
  const { mainTreeData, setMainTreeData } = useAppContext();
  const [processStageTabs, setProcessStageTabs] = React.useState([]);
  const processOperationDropdownData = dropdownData.processOperationData;
  const [
    selectedProcessOperationDropdown,
    setSelectedProcessOperationDropdown,
  ] = React.useState(["Select"]);
  // const [treeProcessData, setTreeProcessData] = React.useState(explorerData);

  const addNewOperation = (data) => {
    let newObj = {};
    newObj.id = `${selectedProcessStageID}-${data}`;
    newObj.level = "second";
    newObj.isParent = true;
    newObj.children = [];
    // setTreeProcessData(current => [...current, newObj]);
  };

  useEffect(() => {
    const result = mainTreeData.filter((item) => {
      return item.id === selectedProcessStageID;
    });
    if (selectedProcessStageID && result.length > 0) {
      setProcessStageTabs(result[0].children);
    }
  }, [selectedProcessStageID]);

  return (
    <>
      {selectedProcessStageID && (
        <div className="process-operation-container">
          <ProcessOperationTabs selectedProcessStageID={selectedProcessStageID} />
          {/* <ProcessActionContainer /> */}
          {/* <Dropdown
    useEffect(() => {
        console.log("selectedProcessStage", selectedProcessStage)
        const result = mainTreeData.filter((item) => {
            return item.id === selectedProcessStage
        });
        if (selectedProcessStage && result.length > 0) {
            setProcessStageTabs(result[0].children)
        }
    }, [selectedProcessStage]);

    return (
        <> 
            {selectedProcessStage && (
                <div className='process-operation-container'>
                    <ProcessOperationTabs selectedProcessStage={selectedProcessStage} />
                    <ProcessActionContainer />

                    {/* <Dropdown
                        options={processOperationDropdownData}
                        dropdownselectedValue={selectedProcessOperationDropdown}
                        setDropdownSelectedValue={(e) => {
                            setSelectedProcessOperationDropdown(
                                e.currentTarget.getAttribute("data-value")
                            )
                            addNewOperation(e.currentTarget.getAttribute("data-value"))
                        }
                        } /> */}
          {/* <div className='process-operation-tabs-container'>
                        {processStageTabs.map((child) => {
                            return (
                                <div className='process-operation-tab'>
                                    {child.id}
                                    <img src={closeImg} alt='x' className='close-img' />
                                </div>
                            )
                        })}
                    </div> */}
        </div>
      )}
    </>
  );
}
