import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import CloseIcon from "@mui/icons-material/Close";
import EquipmentInfoIcon from "@mui/icons-material/Assignment";
import ProcessParametersIcon from "@mui/icons-material/CandlestickChart";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { Typography, Grid, Button } from "@mui/material";
import closeIcon from "../../assets/close.png";
import { useAppContext } from "../../context/appContext";
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

export default function CustomizedAccordions(props) {
  const {
    process_action_fields,
    selectedProcessOperationID,
    selectedProcessStageID,
  } = props;
  const [expanded, setExpanded] = React.useState("");
  const { mainTreeData, updateMainTreeData, flowChartData } = useAppContext();
  const [inputValues, setInputValues] = React.useState([]);
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleSubmitAccordianDetails = () => {
    const newObjParameters = [];
    const newObjParameters1 = [];

    process_action_fields?.children.map((child) => {
      child.children1.map((data) => {
        data.arr.forEach((item) => {
          item.fields.forEach((field) => {
            const inputValue = inputValues[field.id] || "";
            field.value = inputValue;
          });
        });
      });
      newObjParameters1.push({ ...child });
    });
    process_action_fields?.children.map((child) => {
      child.children1.map((data) => {
        data.fields.map((field) => {
          const inputValue = inputValues[field.id] || "";
          field.value = inputValue;
        });
      });
      // newObjParameters1.push({ ...child });
    });

    sessionStorage.setItem("mainTreeData", JSON.stringify(mainTreeData));
    // }
  };

  const removeProcessActionSelectedData = (
    data,
    firstLevelID,
    secondLevelID,
    selectedData
  ) => {
    for (let i = 0; i < data.length; i++) {
      const firstLevel = data[i];
      if (firstLevel.id === firstLevelID && firstLevel.children) {
        for (let j = 0; j < firstLevel.children.length; j++) {
          const secondLevel = firstLevel.children[j];
          if (secondLevel.id === secondLevelID) {
            for (let k = 0; k < secondLevel.children.length; k++) {
              const thirdLevel = secondLevel.children[k];
              if (thirdLevel.id === selectedData.id) {
                secondLevel.children.splice(k, 1);
              }
            }
            return true;
          }
        }
      }
    }
    return false;
  };
  React.useEffect(() => {
    // Fetch mainTreeData from session storage on component mount
    const savedMainTreeData = JSON.parse(
      sessionStorage.getItem("mainTreeData")
    );

    if (savedMainTreeData) {
      const savedInputValues = {};
      savedMainTreeData?.forEach((data) => {
        data?.children.forEach((data1) => {
          data1.children?.forEach((data2) => {
            data2.children1?.forEach((childrenData) => {
              childrenData.fields?.forEach((field) => {
                savedInputValues[field.id] = field.value;
              });
              childrenData.arr?.forEach((item) => {
                item.fields?.forEach((field) => {
                  savedInputValues[field.id] = field.value;
                });
              });
            });
          });
        });
      });
      setInputValues(savedInputValues);
    } else {
      const savedInputValues = {};
      mainTreeData?.forEach((data) => {
        data?.children.forEach((data1) => {
          data1.children?.forEach((data2) => {
            data2.children1?.forEach((childrenData) => {
              childrenData.fields?.forEach((field) => {
                savedInputValues[field.id] = field.value;
              });
              childrenData.arr?.forEach((item) => {
                item.fields?.forEach((field) => {
                  savedInputValues[field.id] = field.value;
                });
              });
            });
          });
        });
      });
      setInputValues(savedInputValues);
    }
  }, []);

  return (
    <>
      {process_action_fields &&
        process_action_fields.id === selectedProcessOperationID &&
        process_action_fields.children.map((data) => {
          return (
            <Accordion
              key={data.id}
              expanded={expanded === data.id}
              onChange={handleChange(data.id)}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Grid
                  container
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Grid item>
                    <Typography>{data.label}</Typography>
                  </Grid>
                  <Grid item>
                    <CloseIcon
                      src={closeIcon}
                      alt="closeIcon"
                      style={{ width: "1.25rem" }}
                      onClick={() =>
                        removeProcessActionSelectedData(
                          mainTreeData,
                          selectedProcessStageID,
                          selectedProcessOperationID,
                          data
                        )
                      }
                    />
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {data.children1.map((children_data) => {
                  return (
                    <>
                      <div style={{ textAlign: "left", marginBottom: "1em" }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <div
                            style={{
                              color: "#4e9f3d",
                              display: "flex",
                              marginRight: "5px",
                            }}
                          >
                            <EquipmentInfoIcon />
                          </div>

                          <b>{children_data.label1}</b>
                        </Typography>
                        <div
                          style={{
                            textAlign: "left",
                            display: "flex",
                            justifyContent: "flex-start",
                            margin: "1.5rem",
                          }}
                        >
                          {children_data.fields.map((field_data) => {
                            return (
                              <label
                                style={{
                                  marginRight: "1rem",
                                  fontWeight: "500",
                                }}
                              >
                                {field_data.label}{" "}
                                <input
                                  style={{ width: "10rem", height: "1.5rem" }}
                                  value={inputValues[field_data.id]}
                                  id={field_data.id}
                                  onChange={(e) =>
                                    setInputValues((prevValues) => ({
                                      ...prevValues,
                                      [field_data.id]: e.target.value,
                                    }))
                                  }
                                  required
                                />
                              </label>
                            );
                          })}
                        </div>
                        <div>
                          <br />
                          <Typography
                            sx={{ display: "flex", alignItems: "center" }}
                            variant="h6"
                            gutterBottom
                          >
                            <ProcessParametersIcon
                              style={{
                                color: "#4e9f3d",
                                display: "flex",
                                marginRight: "5px",
                              }}
                            />
                            <b>{children_data.label2}</b>
                          </Typography>
                          {children_data.arr.map((item) => {
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  margin: "1.5rem",
                                }}
                              >
                                <div
                                  style={{
                                    width: "4rem",
                                    marginRight: "5rem",
                                  }}
                                >
                                  <Typography gutterBottom>
                                    <b>{item.name}:</b>
                                  </Typography>
                                </div>
                                <div
                                  style={{
                                    textAlign: "right",
                                    display: "flex",
                                  }}
                                >
                                  {item.fields.map((field) => {
                                    return (
                                      <div
                                        style={{
                                          marginRight: "2rem",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <label
                                          style={{
                                            marginRight: "0.5rem",
                                            fontWeight: "500",
                                          }}
                                        >
                                          {field.label}
                                        </label>
                                        <input
                                          style={{
                                            width: "4rem",
                                            height: "1.5rem",
                                          }}
                                          value={inputValues[field.id]}
                                          id={field.id}
                                          onChange={(e) =>
                                            setInputValues((prevValues) => ({
                                              ...prevValues,
                                              [field.id]: e.target.value,
                                            }))
                                          }
                                          required
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                })}
                <Button
                  sx={{ backgroundColor: "black", color: "white" }}
                  onClick={handleSubmitAccordianDetails}
                >
                  save
                </Button>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </>
  );
}
