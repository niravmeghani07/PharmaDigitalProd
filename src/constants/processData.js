export const dropdownData = {
  processStageDropdownData: ["ps1", "ps2", "ps3", "ps4", "ps5", "ps6"],
  processOperationData: ["po1", "po2", "po3", "po4"],
};

export const explorerData = [
  {
    mainTreeData: [
      {
        id: "6",
        level: "first",
        isParent: true,
        label: "Synthesis",
        children: [
          {
            id: "1",
            label: "Setup synthesis route",
            level: "second",
            children: [
              {
                id: "1",
                label: "Validate Material Section",
                level: "third",
                children1: [
                  {
                    id: "1",
                    label1: "Equipment Information",
                    fields: [
                      {
                        label: "Equipment No",
                        id: "equipment_number4",
                        value: "1651",
                      },
                      {
                        label: "Name",
                        id: "name4",
                        value: "Reactor",
                      },
                      {
                        label: "Type",
                        id: "type4",
                        value: "Batch",
                      },
                    ],
                    label2: "Process Parameter",
                    arr: [
                      {
                        name: "Temperature",
                        fields: [
                          {
                            label: "Target",
                            id: "1_target4",
                            value: "900",
                          },
                          {
                            label: "UoM",
                            id: "1_uom4",
                            value: "°C",
                          },
                          {
                            label: "Min",
                            id: "1_min4",
                            value: "800",
                          },
                          {
                            label: "Max",
                            id: "1_max4",
                            value: "1100",
                          },
                        ],
                      },
                      {
                        name: "Volume",
                        fields: [
                          {
                            label: "Target",
                            id: "2_target4",
                            value: "94",
                          },
                          {
                            label: "UoM",
                            id: "2_uom4",
                            value: "L",
                          },
                          {
                            label: "Min",
                            id: "2_min4",
                            value: "93",
                          },
                          {
                            label: "Max",
                            id: "2_max4",
                            value: "300",
                          },
                        ],
                      },
                      {
                        name: "pH",
                        fields: [
                          {
                            label: "Target",
                            id: "3_target4",
                            value: "6.5",
                          },
                          {
                            label: "UoM",
                            id: "3_uom4",
                            value: "",
                          },
                          {
                            label: "Min",
                            id: "3_min4",
                            value: "4",
                          },
                          {
                            label: "Max",
                            id: "3_max4",
                            value: "12",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "2",
            label: "Reaction Configuration",
            level: "second",
            children: [],
          },
        ],
      },
      {
        id: "7",
        level: "first",
        isParent: true,
        label: "Mixing",
        children: [],
      },
      {
        id: "8",
        level: "first",
        isParent: true,
        label: "Formulation",
        children: [],
      },
      {
        id: "9",
        level: "first",
        isParent: true,
        label: "Compression",
        children: [],
      },
      {
        id: "10",
        level: "first",
        isParent: true,
        label: "Sterilization",
        children: [],
      },
      {
        id: "11",
        level: "first",
        isParent: true,
        label: "Pacakaging & Labeling",
        children: [],
      },
    ],
  },
  {
    FlowChartData: [
      {
        id: "1",
        template: "Humalog Mix50",
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
      },
    ],
  },
];
