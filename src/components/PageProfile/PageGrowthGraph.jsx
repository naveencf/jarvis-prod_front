import { Autocomplete, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router-dom";

function PageGrowthGraph({ creatorProgress }) {
  const { creatorName } = useParams();
  const [viewOption, setViewOption] = useState("Followers");
  const [state, setState] = useState({
    series: [
      {
        name: "Followers",
        data: [],
      },
    ],
    options: {
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "left",
      },
      chart: {
        height: "auto",
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        curve: "smooth",
        lineCap: "butt",
        colors: undefined,
        width: 2,
        dashArray: 0,
      },
      xaxis: {
        type: "datetime",
        categories: [],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy",
        },
      },
    },
  });

  const createSeriesData = (option) => {
    const categoriesdata = [],
      tempfollower = [],
      tempfollowing = [],
      tempmedia = [],
      tempposting = [];

    if (creatorProgress && creatorProgress.length > 0) {
      creatorProgress.slice(0, 10).forEach((dayData) => {
        if (dayData.followersCount && dayData.createdAt) {
          categoriesdata.push(dayData.createdAt);

          tempfollower.push(dayData.followersCount);
          tempfollowing.push(dayData.followingCount);
          tempmedia.push(dayData.mediaCount);
          tempposting.push(dayData.todayPostCount);
        }
      });

      let selectedData;
      if (option === "Followers") {
        selectedData = tempfollower;
      } else if (option === "Following") {
        selectedData = tempfollowing;
      } else if (option === "Media") {
        selectedData = tempmedia;
      } else if (option === "Posting") {
        selectedData = tempposting;
      }

      const apexobj = {
        series: [
          {
            name: option,
            data: selectedData,
          },
        ],
        options: {
          legend: {
            show: true,
            position: "top",
            horizontalAlign: "left",
          },
          chart: {
            height: "auto",
            type: "area",
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            curve: "smooth",
            lineCap: "butt",
            colors: undefined,
            width: 2,
            dashArray: 0,
          },
          xaxis: {
            type: "datetime",
            categories: categoriesdata,
          },
          tooltip: {
            x: {
              format: "dd/MM/yy",
            },
          },
        },
      };
      return apexobj;
    }
  };

  const handleViewChange = (event, option) => {
    if (option) {
      setViewOption(option);
    }
  };

  useEffect(() => {
    const apexobject = createSeriesData(viewOption);
    setState(apexobject);
  }, [creatorProgress, viewOption]);

  return (
    <div className="row">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="card">
          <div className="card-body pb0">
           {state && creatorProgress.length > 0 &&  <div className="allSelChart thmChart">
              <Stack direction="row">
                <Autocomplete
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
                />
              </Stack>
              <ReactApexChart
                options={state.options}
                series={state.series}
                type="area"
                height={250}
              />
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageGrowthGraph;
