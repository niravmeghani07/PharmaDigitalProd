const FlowChartData = {
  id: "1",
  template: "temprary Template",
  nodes: [
    {
      id: "6",
      position: {
        x: 72,
        y: 133,
      },
      data: {
        label: "Synthesis",
      },
    },
    {
      id: "7",
      position: {
        x: 259,
        y: 59.25,
      },
      data: {
        label: "Mixing",
      },
    },
    {
      id: "8",
      position: {
        x: 431,
        y: 144.45,
      },
      data: {
        label: "Formulation",
      },
    },
    {
      id: "9",
      position: {
        x: 600,
        y: 54,
      },
      data: {
        label: "Compression",
      },
    },
    {
      id: "10",
      position: {
        x: 779,
        y: 145.60000000000002,
      },
      data: {
        label: "Sterilization",
      },
    },
    {
      id: "11",
      position: {
        x: 872.72001953125,
        y: 50,
      },
      data: {
        label: "Pacakaging & Labeling",
      },
    },
  ],
  edges: [
    {
      id: "reactflow__edge-7-6",
      source: "7",
      target: "6",
    },
    {
      id: "reactflow__edge-7-8",
      source: "7",
      target: "8",
    },
    {
      id: "reactflow__edge-9-8",
      source: "9",
      target: "8",
    },
    {
      id: "reactflow__edge-9-10",
      source: "9",
      target: "10",
    },
    {
      id: "reactflow__edge-11-10",
      source: "11",
      target: "10",
    },
    {
      id: "reactflow__edge-9-7",
      source: "9",
      target: "7",
    },
  ],
};

export default FlowChartData;
