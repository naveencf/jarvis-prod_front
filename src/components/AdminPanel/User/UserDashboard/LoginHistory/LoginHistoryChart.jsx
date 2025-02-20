import React from "react";
import ReactApexChart from "react-apexcharts";

const LoginHistoryChart = ({ loginChartData }) => {
  if (!loginChartData || loginChartData.length === 0) {
    return <p>No login data available</p>;
  }

  // Group login count by date
  const groupedData = loginChartData.reduce((acc, user) => {
    const date = user.login_time.split(" ")[0]; // Extract date part
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Prepare chart data
  const categories = Object.keys(groupedData).sort(); // Sorted dates
  const seriesData = categories.map((date) => groupedData[date]); // Login counts per date

  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
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
      categories, // Dates
      title: { text: "Date" },
      labels: {
        rotate: -45,
        format: "yyyy-MM-dd",
      },
    },
    yaxis: {
      title: { text: "Login Count" },
      min: 0,
    },
    markers: { size: 5 },
    tooltip: {
      x: { format: "yyyy-MM-dd" },
      y: { formatter: (val) => `${val} logins` },
    },
    grid: { borderColor: "#f1f1f1" },
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
