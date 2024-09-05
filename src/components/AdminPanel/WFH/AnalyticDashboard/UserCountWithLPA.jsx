import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { baseUrl } from "../../../../utils/config";

function UserCountWithLPA() {
  const [graphData, setGraphData] = useState([]);
  const [state, setState] = useState({
    series: [], // Donut chart series is an array of values
    options: {
      chart: {
        type: "donut",
        height: 350,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      labels: [], // Labels for the donut chart
      legend: {
        position: "right",
        offsetY: 40,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
          },
        },
      },
    },
  });

  const getData = async () => {
    try {
      const res = await axios.get(baseUrl + "get_salary_by_LPA");
      setGraphData(res.data.data);
      console.log(res.data.data, "lpa");
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const createSeriesData = (data) => {
    const labels = [];
    const seriesData = [];

    data.forEach((item) => {
      const range = Object.keys(item)[0];
      const count = Object.values(item)[0];
      labels.push(range);
      seriesData.push(count);
    });

    const apexobj = {
      series: seriesData, // Update the series data
      options: {
        chart: {
          type: "donut",
          height: 350,
        },
        labels: labels, // Update the labels
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        legend: {
          position: "right",
          offsetY: 40,
        },
        plotOptions: {
          pie: {
            donut: {
              size: "68%",
            },
          },
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
        <h5 className="card-title"> Users Count With LPA</h5>
      </div>
      <div className="card-body p0">
        {state && graphData.length > 0 && (
          <div className="allSelChart thmChart">
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="donut"
              height={260}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCountWithLPA;
