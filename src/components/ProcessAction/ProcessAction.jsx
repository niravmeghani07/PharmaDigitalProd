import React from "react";
import "./ProcessAction.css";
import AddButton from "../../common-components/AddButton/AddButton.jsx";
import CustomizedAccordions from "../../common-components/Accordion/Accordion.jsx";
import { useAppContext } from "../../context/appContext";
import { sideBarData } from "../../constants/sidebarStageData.js";
import ProcessActionModal from "../ProcessActionModal/ProcessActionModal.jsx";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { Typography, Grid } from "@mui/material";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));
export default function ProcessActionContainer(props) {
  const { selectedProcessOperationID, selectedProcessStageID } = props;
  const { mainTreeData, updateMainTreeData } = useAppContext();
  const [expanded, setExpanded] = React.useState("");
  const [isModalOpen, setIsOpenModal] = React.useState(false);
  // const process_action_fields = [
  //   {
  //     id: "validate_material_selection",
  //     label: "Validate Material Selection",
  //     children: [
  //       {
  //         id: "equipment_information",
  //         label: "Equipment Information",
  //         fields: [
  //           { label: "Equipment No", id: "equipment_number", value: "" },
  //           { label: "Name", id: "name", value: "" },
  //           { label: "Type", id: "type", value: "" },
  //         ],
  //       },
  //     ],
  //   },
  // ];
  const modal_data =
    sideBarData[sideBarData.findIndex((el) => el.title === "Process Actions")];

  const handleModalChange = () => {
    setIsOpenModal(!isModalOpen);
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleDrop = (e) => {
    const customDataString = e.dataTransfer.getData("processActionsDragEvent");
    if (customDataString) {
      try {
        const customData = JSON.parse(customDataString);
        if (customData.type === "ch-3") {
          handleProcessActionDataAddition(customData.name);
        }
      } catch (error) {
        console.error("Error parsing custom data:", error);
      }
    } else {
      console.log("Wrong Value Dropped");
    }
  };
  const handleProcessActionDataAddition = (val) => {
    const updatedMainTreeData = [...mainTreeData];
    const filteredArrayBasedOnProcessStageID = updatedMainTreeData.filter(
      (obj) => obj.id === selectedProcessStageID
    );
    const filteredArrayBasedOnProcessOperationID =
      filteredArrayBasedOnProcessStageID[0].children.filter(
        (obj) => obj.id === selectedProcessOperationID
      );
    const idf = (
      filteredArrayBasedOnProcessStageID[0].children.length +
      1 +
      (filteredArrayBasedOnProcessOperationID[0].children.length + 1)
    ).toString();
    const newProcessActionObj = {
      id: (
        filteredArrayBasedOnProcessOperationID[0].children.length + 1
      ).toString(),
      label: val.toString(),
      level: "third",
      children1: [
        {
          id: (
            filteredArrayBasedOnProcessOperationID[0].children.length + 1
          ).toString(),
          label1: "Equipment Information",
          fields: [
            {
              label: "Equipment No",
              id: "equipment_number" + idf,
              value: "",
            },
            {
              label: "Name",
              id: "name" + idf,
              value: "",
            },
            {
              label: "Type",
              id: "type" + idf,
              value: "",
            },
          ],
          label2: "Process Parameter",
          arr: [
            {
              name: "Temperature",
              fields: [
                { label: "Target", id: "1_target" + idf, value: "" },
                { label: "UoM", id: "1_uom" + idf, value: "" },
                { label: "Min", id: "1_min" + idf, value: "" },
                { label: "Max", id: "1_max" + idf, value: "" },
              ],
            },
            {
              name: "Volume",
              fields: [
                { label: "Target", id: "2_target" + idf, value: "" },
                { label: "UoM", id: "2_uom" + idf, value: "" },
                { label: "Min", id: "2_min" + idf, value: "" },
                { label: "Max", id: "2_max" + idf, value: "" },
              ],
            },
            {
              name: "pH",
              fields: [
                { label: "Target", id: "3_target" + idf, value: "" },
                { label: "UoM", id: "3_uom" + idf, value: "" },
                { label: "Min", id: "3_min" + idf, value: "" },
                { label: "Max", id: "3_max" + idf, value: "" },
              ],
            },
          ],
        },
      ],
    };
    const processStageIDValueArrayIndex = updatedMainTreeData.findIndex(
      (item) => item.id === selectedProcessStageID
    );
    const ProcessOperationIDValueArrayIndex = updatedMainTreeData[
      processStageIDValueArrayIndex
    ].children.findIndex((item) => item.id === selectedProcessOperationID);
    const isNamePresent = updatedMainTreeData[
      processStageIDValueArrayIndex
    ].children[ProcessOperationIDValueArrayIndex].children.some(
      (obj) => obj.label === val.toString()
    );
    if (!isNamePresent) {
      updatedMainTreeData[processStageIDValueArrayIndex].children[
        ProcessOperationIDValueArrayIndex
      ].children.push(newProcessActionObj);
      updateMainTreeData([...updatedMainTreeData]);
    }
    console.log("mainTree Data = ", mainTreeData);
  };

  return (
    <Grid
      sx={{ display: "flex" }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <ProcessActionModal
        open={isModalOpen}
        handleClose={handleModalChange}
        modal_data={modal_data}
        selectedProcessOperationID={selectedProcessOperationID}
        selectedProcessStageID={selectedProcessStageID}
      />
      <Grid
        container
        direction={"row"}
        sx={{
          display: "flex",
          // margin: "1rem",
          width: "100%",
          justifyContent: "end",
          padding: "1rem 1rem",
        }}
      >
        {mainTreeData &&
          mainTreeData[
            mainTreeData?.findIndex(
              (item) => item?.id === selectedProcessStageID
            )
          ]?.children.map((ele) => {
            return (
              <>
                {ele.id === selectedProcessOperationID ? (
                  <Grid
                    item
                    sx={{ margin: "1rem", width: "100%" }}
                    key={ele.id}
                  >
                    <CustomizedAccordions
                      process_action_fields={ele}
                      selectedProcessOperationID={selectedProcessOperationID}
                      selectedProcessStageID={selectedProcessStageID}
                    />
                  </Grid>
                ) : (
                  ""
                )}{" "}
              </>
            );
          })}
      </Grid>
      <Grid item sx={{ padding: "1rem 0 1rem 0" }}>
        <div className="add-process-action">
          <AddButton handleModalChange={handleModalChange} />
        </div>
      </Grid>
    </Grid>
  );
}
