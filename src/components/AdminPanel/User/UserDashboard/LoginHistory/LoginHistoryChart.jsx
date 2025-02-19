import React from "react";
import ReactApexChart from "react-apexcharts";

const LoginHistoryChart = ({ loginChartData }) => {
  const groupedData = loginChartData?.reduce((acc, curr) => {
    const date = curr.login_time.split(" ")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(groupedData).sort(); // Sort dates for correct order
  const seriesData = Object.values(groupedData); // Login counts per date

  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false }, // Hide toolbar for a cleaner look
    },
    stroke: {
      curve: "smooth", // Smooth curve for better visualization
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories, // X-axis labels (dates)
      title: {
        text: "Date", // X-axis label
      },
      labels: {
        rotate: -45, // Rotate labels for better readability
      },
    },
    yaxis: {
      title: {
        text: "Login Count", // Y-axis label
      },
      min: 0, // Ensure Y-axis starts at 0
    },
    markers: {
      size: 5, // Show dots on data points
    },
    tooltip: {
      x: { format: "yyyy-MM-dd" },
      y: { formatter: (val) => `${val} logins` },
    },
    grid: {
      borderColor: "#f1f1f1", // Light grid lines
    },
  };

  return (
    <div>
      <h3>Login History</h3>
      <div className="card-body p0">
        <div className="allSelChart thmChart">
          <ReactApexChart
            options={chartOptions}
            series={[{ name: "Logins", data: seriesData }]}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginHistoryChart;
