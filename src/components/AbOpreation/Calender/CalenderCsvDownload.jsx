import React from "react";
import { Button } from "@mui/material";

const DownloadCSV = ({
  steps,
  dates,
  postCounts,
  dailyTotals,
  selectedStep,
}) => {
  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add table headers
    let headerRow = ["Username", ...dates, "Total Posts"];
    csvContent += headerRow.join(",") + "\n";

    // Add table rows
    steps[selectedStep]?.pages.forEach((page, pageIndex) => {
      let row = [
        page.username,
        ...(postCounts[selectedStep]?.[pageIndex] || []).map(String),
        page.postCount,
      ];
      csvContent += row.join(",") + "\n";
    });

    // Add daily totals row
    let totalsRow = [
      "Daily Totals",
      ...dailyTotals.map(String),
      dailyTotals.reduce((a, b) => a + b, 0),
    ];
    csvContent += totalsRow.join(",") + "\n";

    // Create a download link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "calendar_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="contained" color="success" onClick={downloadCSV}>
      Download CSV
    </Button>
  );
};

export default DownloadCSV;
