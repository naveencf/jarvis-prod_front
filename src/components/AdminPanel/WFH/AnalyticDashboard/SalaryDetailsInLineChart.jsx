import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import ReactApexChart from "react-apexcharts";

function SalaryDetailsInLineChart() {
  const [graphData, setGraphData] = useState([]);
  const [viewOption, setViewOption] = useState("male");
  const [seriesArray, setSeriesArray] = useState([]);

  const [state, setState] = useState({
    series: [
      {
        name: "Community",
        data: [],
      },
      {
        name: "Meme",
        data: [],
      },
      {
        name: "WHFD",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 400,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "number",
        categories: [],
      },
    },
  });

  const groupByPageCategoryId = (rows) => {
    let grouped = {};

    rows.forEach((row) => {
      let departmentName = row.dept_name;

      if (!grouped[departmentName]) {
        grouped[departmentName] = {};
      }

      let month = row._id.month;
      grouped[departmentName][month] = row.toPay.toFixed(2);
    });

    return grouped;
  };

  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formatForSeries = (grouped) => {
    let series = Object.keys(grouped).map((departmentName) => {
      let data = monthOrder.map((month) => grouped[departmentName][month] || 0); // Default to 0 if no data for the month
      return {
        name: departmentName,
        data: data,
      };
    });

    return series;
  };

  const getData = async () => {
    try {
      const res = await axios.get(baseUrl + "get_salary_by_month_wise");
      const updatedData = groupByPageCategoryId(res.data);
      const tempSeries = formatForSeries(updatedData);
      setGraphData(res.data);
      setSeriesArray(tempSeries);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const createSeriesData = () => {
    const apexobj = {
      series: seriesArray,
      options: {
        chart: {
          height: 400,
          type: "area",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          type: "number",
          categories: monthOrder,
        },
      },
    };
    return apexobj;
  };

  const handleViewChange = (event, option) => {
    if (option) {
      setViewOption(option);
    }
  };

  useEffect(() => {
    if (graphData.length > 0) {
      const apexObject = createSeriesData();
      setState(apexObject);
    }
  }, [graphData, seriesArray]);

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title"> Department & Month Wise Salary</h5>
      </div>
      <div className="card-body p0">
        {state && graphData.length > 0 && (
          <div className="allSelChart thmChart">
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="area"
              height={300}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SalaryDetailsInLineChart;
