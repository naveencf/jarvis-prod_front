import React from "react";
import { saveAs } from "file-saver";
// import XLSX from "xlsx";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";

const DwndTemplate = () => {
  const createExcelTemplate = () => {
    const headers = [
      "lead_name",
      "mobile_no",
      "alternate_mobile_no",
      "city",
      "country",
      "dept",
      "email",
      "assign_to",
      "addr",
      "leadsource",
      "leadtype",
      "loc",
      "remark",
      "state",
      "status",
      "Created_by",
      "Creation_date",
      "Last_updated_by",
      "Last_updated_date",
    ];
    const data = [];

    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const blob = new Blob(
      [s2ab(XLSX.write(wb, { bookType: "xlsx", type: "binary" }))],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(blob, "template.xlsx");
  };
  // Convert string to ArrayBuffer
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
      variant="outlined"
      color="primary"
      size="small"
      type="file"
      onClick={createExcelTemplate}
    >
      Template
    </Button>
  );
};

export default DwndTemplate;
