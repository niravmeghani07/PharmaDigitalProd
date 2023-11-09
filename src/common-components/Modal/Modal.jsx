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
export default function BasicModal(props) {
  const { open, handleClose, modal_data, selectedProcessStageID } = props;
  const { mainTreeData, updateMainTreeData } = useAppContext();
  const [newOperation, setNewOperation] = React.useState("");
  const handleOperationChange = (event) => {
    setNewOperation(event.target.value);
    const Operation = event.target.value;
  };
  const handleSubmit = () => {
    // console.log("New Operation", newOperation);
    const updatedMainTreeData = [...mainTreeData];
    const selectedStageIndex = updatedMainTreeData.findIndex(
      (item) => item.id === selectedProcessStageID
    );
    const newChild = {
      id: (updatedMainTreeData[selectedStageIndex].children.length + 1).toString(),
      label: newOperation,
      level: "second",
      children: [],
    };
    updatedMainTreeData[selectedStageIndex].children.push(newChild);

    updateMainTreeData([...updatedMainTreeData]);
    // console.log("Added children", mainTreeData);
    handleClose();
    setNewOperation();
  };
  return (
    <Grid
      container
      direction={"column"}
      sx={{ justifyContent: "Center", height: "4rem" }}
    >
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
              label="Enter new Operation"
              variant="outlined"
              style={{ width: "10rem", height: "2rem", fontSize: "1rem" }}
              value={newOperation}
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
                cursor: "pionter",
              }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
}
