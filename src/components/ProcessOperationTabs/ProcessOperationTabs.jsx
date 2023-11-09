import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import "./ProcessOperationTabs.css";
import AddButton from "../../common-components/AddButton/AddButton.jsx";
import ProcessActionContainer from "../ProcessAction/ProcessAction.jsx";
import { useAppContext } from "../../context/appContext";
import BasicModal from "../../common-components/Modal/Modal.jsx";
import { sideBarData } from "../../constants/sidebarStageData.js";
// import closeIcon from "../../assets/close.png";
export default function ProcessOperationTabs(props) {
  const { selectedProcessStageID } = props;
  const [isModalOpen, setIsOpenModal] = React.useState(false);
  const [selectedProcessOperationID, setSelectedProcessOperationID] =
    React.useState("");
  const { mainTreeData, updateMainTreeData } = useAppContext();
  const handleModalChange = () => {
    setIsOpenModal(!isModalOpen);
  };

  const removeProcessOperationTab = (processOperationId) => {
    const filteredData =
      mainTreeData[
        mainTreeData.findIndex((e) => e.id === selectedProcessStageID)
      ].children;
    const index = filteredData.findIndex(
      (item) => item.id === processOperationId
    );
    if (index > -1) {
      // only splice array when item is found
      filteredData.splice(index, 1);
    }
    updateMainTreeData([...mainTreeData]);
  };

  const modal_data =
    sideBarData[
      sideBarData.findIndex((el) => el.title === "Process Operations")
    ];

  const handleAddNewOperation = (newOperation) => {
    const updatedMainTreeData = [...mainTreeData];
    const selectedStageIndex = updatedMainTreeData.findIndex(
      (item) => item.id === selectedProcessStageID
    );
    if (selectedStageIndex !== -1) {
      const isNamePresent = updatedMainTreeData[
        selectedStageIndex
      ].children.some((obj) => obj.label === newOperation);
      if (!isNamePresent) {
        const newChild = {
          id: (
            updatedMainTreeData[selectedStageIndex].children.length + 1
          ).toString(),
          label: newOperation,
          level: "second",
          children: [],
        };
        updatedMainTreeData[selectedStageIndex].children.push(newChild);

        updateMainTreeData([...updatedMainTreeData]);
      }
    }
    // console.log("Added Data", mainTreeData);
  };
  const handleDrop = (e) => {
    const customDataString = e.dataTransfer.getData(
      "processOperationDragEvent"
    );
    if (customDataString) {
      try {
        const customData = JSON.parse(customDataString);
        if (customData.type === "ch-2") {
          handleAddNewOperation(customData.name);
        }
      } catch (error) {
        console.error("Error parsing custom data:", error);
      }
    } else {
      console.log("Wrong Value Dropped");
    }
  };

  const openProcessAction = (processOperationID) => {
    setSelectedProcessOperationID(processOperationID);
  };
  return (
    <>
      <BasicModal
        open={isModalOpen}
        handleClose={handleModalChange}
        modal_data={modal_data}
        mainTreeData={mainTreeData}
        selectedProcessStageID={selectedProcessStageID}
      />
      <div
        className="process-operation-tabs-container"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="process-operation-tabs-wrapper">
          {mainTreeData &&
            mainTreeData[
              mainTreeData?.findIndex(
                (item) => item?.id === selectedProcessStageID
              )
            ]?.children.map((ele) => {
              return (
                <div
                  key={ele.id}
                  className={
                    selectedProcessOperationID === ele.id
                      ? "process-operation-tab--active"
                      : "process-operation-tab"
                  }
                >
                  <div
                    className="process-operation-tab-name"
                    onClick={() => openProcessAction(ele.id)}
                    data_id={ele.id}
                  >
                    <b>{ele.label}</b>
                  </div>
                  <div className="process-operation-tab-close">
                    {/* <img
                      src={closeIcon}
                      alt="noIcon"
                      style={{
                        width: "0.75rem",
                        heigth: "1rem",
                      }}
                      onClick={() => removeProcessOperationTab(ele.id)}
                    /> */}
                    <CloseIcon
                      style={{ width: "1rem" }}
                      onClick={() => removeProcessOperationTab(ele.id)}
                    />
                  </div>
                </div>
              );
            })}
        </div>
        <div style={{ visibility: "" }}>
          <AddButton handleModalChange={handleModalChange} />
        </div>
      </div>
      {selectedProcessOperationID ? (
        <ProcessActionContainer
          selectedProcessStageID={selectedProcessStageID}
          selectedProcessOperationID={selectedProcessOperationID}
        />
      ) : null}
    </>
  );
}
