import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";

const WFHDSheetTemplete = ({ filterData }) => {
  const createExcelTemplate = () => {
    // Define headers for the Excel file
    const headers = [
      "S.No",
      "user_name",
      "user_id",
      "total_days",
      "absent_days",
      "salary",
      "bonus",
      "arrear_from_last_month",
      "salary_deduction",
      "salary_status",
    ];

    // Map filterData to match the headers
    const data = filterData.map((item, index) => ({
      "S.No": index + 1,
      user_name: item.user_name || "",
      user_id: item.user_id || 0,
      total_days: 0,
      absent_days: 0,
      salary: item.salary || "",
      bonus: 0,
      arrear_from_last_month: 0,
      salary_deduction: 0,
      salary_status: "approved",
    }));

    // Convert JSON data into Excel sheet
    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Convert workbook to Blob for download
    const blob = new Blob(
      [s2ab(XLSX.write(wb, { bookType: "xlsx", type: "binary" }))],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(blob, "template.xlsx");
  };

  // Helper function to convert string to ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  return (
    <Button
      className="btn cmnBtnSmall btn-primary"
      type="file"
      onClick={createExcelTemplate}
    >
      Template
    </Button>
  );
};

export default WFHDSheetTemplete;
