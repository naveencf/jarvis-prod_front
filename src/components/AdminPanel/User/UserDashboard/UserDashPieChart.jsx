import React, { useMemo } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { lengthFuntion } from "../../../../utils/lengthFuntion";

const UserDashPieChart = ({ userData, wfhdCount, wFhCount, wFOCount }) => {
  return (
    <div className="chart_container body-padding">
      <h5 style={{ fontWeight: "600", color: "var(--gray-700)" }}>
        Total Users - {useMemo(() => lengthFuntion(userData), [userData])}
      </h5>
      <PieChart
        series={[
          {
            data: [
              {
                id: 0,
                value: wfhdCount.length,
                label: "WFHD",
                color: "rgb(184, 0, 216)",
              },
              {
                id: 1,
                value: wFhCount.length,
                label: "WFH",
              },
              {
                id: 2,
                value: wFOCount.length,
                label: "WFO",
                color: "green",
              },
            ],
            innerRadius: 30,
            outerRadius: 100,
            cornerRadius: 5,
            paddingAngle: 1,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: {
              innerRadius: 30,
              additionalRadius: -30,
              color: "gray",
            },
          },
        ]}
        height={200}
      />
    </div>
  );
};

export default UserDashPieChart;
