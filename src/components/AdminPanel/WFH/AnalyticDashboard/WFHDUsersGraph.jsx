import { Autocomplete, Stack, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";

function WFHDUsersGrapf() {
  const [graphData, setGraphData] = useState([]);
  const [viewOption, setViewOption] = useState("male");
  const [state, setState] = useState({
    series: [
      {
        name: "Followers",
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
          borderRadiusApplication: "end", // 'around', 'end'
          borderRadiusWhenStacked: "last", // 'all', 'last'
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
        type: "number",
        categories: [],
      },
      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
  });

  useEffect(() => {
    axios
      .post(baseUrl + "get_user_graph_data_of_wfhd", {
        caseType: "department_wise",
      })
      .then((res) => {
        setGraphData(res.data);
      });
  }, []);

  const createSeriesData = (option) => {
    const categoriesdata = [],
      male = [],
      female = [],
      tempmedia = [],
      tempposting = [];

    if (graphData && graphData.length > 0) {
      graphData.forEach((dayData) => {
        if (dayData.dept_name) {
          categoriesdata.push(dayData.dept_name);

          male.push(dayData.maleCount);
          female.push(dayData.femaleCount);
        }
      });
      console.log(categoriesdata, "categoriesdata");
      let selectedData = male;
      let selectedDatas = female;

      const apexobj = {
        series: [
          {
            name: "Male",
            data: selectedData,
          },
          {
            name: "Female",
            data: selectedDatas,
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
          colors: ["#845ADF", "#26BF94"], // Add your custom colors here
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
              borderRadius: 4,
              borderRadiusApplication: "end", // 'around', 'end'
              borderRadiusWhenStacked: "last", // 'all', 'last'
              dataLabels: {
                total: {
                  enabled: true,
                  style: {
                    fontSize: "12px",
                    fontWeight: 600,
                  },
                },
              },
              columnWidth: "60px",
            },
          },
          xaxis: {
            type: "number",
            categories: categoriesdata,
          },
          legend: {
            position: "right",
            offsetY: 20,
          },
          fill: {
            opacity: 1,
          },
        },
      };
      return apexobj;
    }
  };

  // const handleViewChange = (event, option) => {
  //   if (option) {
  //     setViewOption(option);
  //   }
  // };

  useEffect(() => {
    const apexobject = createSeriesData(viewOption);
    setState(apexobject);
  }, [graphData, viewOption]);

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title"> Department Wise Users Count</h5>
      </div>
      <div className="card-body p0">
        {state && graphData.length > 0 && (
          <div className="allSelChart thmChart">
            <Stack direction="row">
              {/* <Autocomplete
                  disablePortal
                  clearIcon={false}
                  sx={{ width: "20%" }}
                  value={viewOption}
                  onChange={handleViewChange}
                  options={["Followers", "Media", "Following", "Posting"]}
                  renderInput={(params) => (
                    <>
                      <TextField {...params} label="Options" />
                    </>
                  )}
                /> */}
            </Stack>
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="bar"
              height={250}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default WFHDUsersGrapf;
