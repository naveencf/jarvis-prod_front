// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import ReactApexChart from "react-apexcharts";
// import { baseUrl } from "../../../../utils/config";

// function AgeGraf() {
//   const [graphData, setGraphData] = useState([]);
//   const [state, setState] = useState({
//     series: [],
//     options: {
//       chart: {
//         type: "radialBar",
//         height: 300,
//       },
//       plotOptions: {
//         radialBar: {
//           dataLabels: {
//             name: {
//               fontSize: "22px",
//             },
//             value: {
//               fontSize: "16px",
//               show: true,
//               formatter: function (val) {
//                 return val + " users";
//               },
//             },
//             total: {
//               show: true,
//               label: "Total",
//               formatter: function (w) {
//                 return (
//                   w.globals.seriesTotals.reduce((a, b) => a + b, 0) + " users"
//                 );
//               },
//             },
//           },
//         },
//       },
//       labels: [],
//       colors: [],
//       tooltip: {
//         y: {
//           formatter: function (val) {
//             return val + " users";
//           },
//         },
//       },
//     },
//   });

//   useEffect(() => {
//     axios
//       .post(baseUrl + "get_user_graph_data_of_wfhd", {
//         caseType: "age",
//       })
//       .then((res) => {
//         setGraphData(res.data);
//       });
//   }, []);

//   const createSeriesData = (data) => {
//     const seriesData = [];
//     const labels = [];
//     const colors = [
//       "#FF5733",
//       "#33FF57",
//       "#3357FF",
//       "#FF33A1",
//       "#A133FF",
//       "#33FFF4",
//       "#FFC133",
//       "#8D33FF",
//       "#FF338D",
//       "#33FF8D",
//     ];

//     data.forEach((item, index) => {
//       seriesData.push(item.userCount);
//       labels.push(item.age);
//     });

//     const apexobj = {
//       series: seriesData,
//       options: {
//         chart: {
//           type: "radialBar",
//           height: 300,
//         },
//         plotOptions: {
//           radialBar: {
//             dataLabels: {
//               name: {
//                 fontSize: "22px",
//               },
//               value: {
//                 fontSize: "16px",
//                 show: true,
//                 formatter: function (val) {
//                   return val + " users";
//                 },
//               },
//               total: {
//                 show: true,
//                 label: "Total",
//                 formatter: function (w) {
//                   return (
//                     w.globals.seriesTotals.reduce((a, b) => a + b, 0) + " users"
//                   );
//                 },
//               },
//             },
//           },
//         },
//         labels: labels,
//         colors: colors.slice(0, seriesData.length),
//         tooltip: {
//           y: {
//             formatter: function (val) {
//               return val + " users";
//             },
//           },
//         },
//       },
//     };
//     return apexobj;
//   };

//   useEffect(() => {
//     if (graphData.length > 0) {
//       const apexobject = createSeriesData(graphData);
//       setState(apexobject);
//     }
//   }, [graphData]);

//   return (
//     <div className="card">
//       <div className="card-header">
//         <h5 className="card-title">Age Wise Users Graph</h5>
//       </div>
//       <div className="card-body p0">
//         {state.series.length > 0 && (
//           <div className="allSelChart thmChart">
//             <ReactApexChart
//               options={state.options}
//               series={state.series}
//               type="radialBar"
//               height={335}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AgeGraf;

import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { baseUrl } from "../../../../utils/config";

function AgeGraf() {
  const [graphData, setGraphData] = useState([]);
  const [viewOption, setViewOption] = useState("male");
  const [state, setState] = useState({
    series: [
      {
        name: "Count",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      colors: ["#C9DF7F"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "last",
          dataLabels: {
            total: {
              enabled: false,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
          columnWidth: "60px",
        },
      },
      dataLabels: {
        enabled: false, // Disable all data labels
      },
      xaxis: {
        type: "category",
        categories: [],
      },
      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
      grid: {
        show: false, // Remove horizontal lines
      },
    },
  });

  useEffect(() => {
    axios
      .post(baseUrl + "get_user_graph_data_of_wfhd", {
        caseType: "age",
      })
      .then((res) => {
        setGraphData(res.data);
      });
  }, []);

  const createSeriesData = (data) => {
    const categories = [];
    const seriesData = [];

    data.forEach((item) => {
      const range = item.age;
      const count = item.userCount;
      categories.push(range);
      seriesData.push(count);
    });

    const apexobj = {
      series: [
        {
          name: "Count",
          data: seriesData,
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                },
              },
            },
          },
        },
        xaxis: {
          type: "category",
          categories: categories,
        },
        legend: {
          position: "right",
          offsetY: 40,
        },
        fill: {
          opacity: 1,
        },
      },
    };
    return apexobj;
  };

  useEffect(() => {
    if (graphData.length > 0) {
      const apexobject = createSeriesData(graphData);
      setState(apexobject);
    }
  }, [graphData]);

  return (
    
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Age Wise Users Graph</h5>
          </div>
          <div className="card-body p0"></div>
          <div className="card-body pb0">
            {state && graphData.length > 0 && (
              <div className="allSelChart thmChart">
                <ReactApexChart
                  options={state.options}
                  series={state.series}
                  type="bar"
                  height={300}
                />
              </div>
            )}
          </div>
        </div>
  );
}

export default AgeGraf;
