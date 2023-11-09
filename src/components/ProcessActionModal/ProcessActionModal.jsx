import * as React from "react";
import Box from "@mui/material/Box";
import { Typography, input, Grid, Button, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
import { useAppContext } from "../../context/appContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "px solid #000",
  boxShadow: 24,
  borderRadius: "0.5rem",
  display: "flex",
  flexdirection: "start",
  justifyContent: "space-between",
  fontSize: "2rem",
};
export default function ProcessActionModal(props) {
  const {
    open,
    handleClose,
    modal_data,
    selectedProcessOperationID,
    selectedProcessStageID,
  } = props;
  const { mainTreeData, updateMainTreeData } = useAppContext();
  const [newProcessActionValue, setNewProcessActionValue] = React.useState("");
  const handleOperationChange = (event) => {
    setNewProcessActionValue(event.target.value);
  };
  const handleSubmit = () => {
    const updatedMainTreeData = [...mainTreeData];
    const filteredArrayBasedOnProcessStageID = updatedMainTreeData.filter((obj) => obj.id === selectedProcessStageID);
    const filteredArrayBasedOnProcessOperationID = filteredArrayBasedOnProcessStageID[0].children.filter((obj) => obj.id === selectedProcessOperationID); 
    const newProcessActionObj = {
      "id": (filteredArrayBasedOnProcessOperationID[0].children.length + 1).toString(),
      "label": newProcessActionValue.toString(),
      "level": "third",
      "children": [
        {
          "id": "1",
          "label": "Equipment Information",
          "fields": [
            {
              "label": "Equipment No",
              "id": "equipment_number"
            },
            {
              "label": "Name",
              "id": "name"
            },
            {
              "label": "Type",
              "id": "type"
            }
          ]
        }
      ]
    }
    const processStageIDValueArrayIndex = updatedMainTreeData.findIndex((item) => item.id === selectedProcessStageID);
    const ProcessOperationIDValueArrayIndex = updatedMainTreeData[processStageIDValueArrayIndex].children.findIndex((item) => item.id === selectedProcessOperationID);
    updatedMainTreeData[processStageIDValueArrayIndex].children[ProcessOperationIDValueArrayIndex].children.push(newProcessActionObj)
    updateMainTreeData([...updatedMainTreeData]);
    handleClose();
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "inline",
              justifyContent: "space-between",
              margin: "2rem",
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              sx={{ marginBottom: "1rem" }}
            >
              {modal_data.title}
            </Typography>
            <TextField
              id="new_operation"
              label="Enter Action"
              variant="outlined"
              style={{ width: "10rem", height: "2rem", fontSize: "1rem" }}
              value={newProcessActionValue}
              onChange={handleOperationChange}
            />
          </Box>
          <Box
            sx={{
              alignItem: "center",
              height: "400",
              margin: "1rem",
              marginTop: "6rem",
            }}
          >
            <Button
              variant="contained"
              sx={{
                width: "1rem",
                height: "2rem",
                backgroundColor: "black",
                cursor: "pointer",
              }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
