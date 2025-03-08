import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { CircularProgress, Box, Typography } from "@mui/material";

const LoginHistoryChart = ({ loginChartData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loginChartData) {
      setLoading(false);
    }
  }, [loginChartData]);

  // Show loader if data is pending
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={250}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show error message if no data is available after loading
  if (!loginChartData || loginChartData.length === 0) {
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="h6" color="textSecondary">
          No login data available
        </Typography>
      </Box>
    );
  }

  // Group login count by date, ensuring each user is counted only once per date
  const groupedData = loginChartData.reduce((acc, user) => {
    const date = user.login_time.split(" ")[0]; // Extract date part
    if (!acc[date]) {
      acc[date] = new Set(); // Use a Set to store unique user IDs
    }
    acc[date].add(user.user_id); // Add user ID (duplicates are ignored)
    return acc;
  }, {});

  // Convert groupedData to an array with date-wise unique login counts
  const categories = Object.keys(groupedData).sort(); // Sorted dates
  const seriesData = categories.map((date) => groupedData[date].size); // Unique user count per date

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
    grid: { borderColor: "#F1F1F1" },
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
