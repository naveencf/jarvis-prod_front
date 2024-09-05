import { useEffect, useRef, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Paper, Button, Box } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Typography } from "antd";
import axios from "axios";
import {baseUrl} from '../../../utils/config'

export default function AddPage({ setXlxsData }) {
  const [gridRows, setGridRows] = useState([]);
  const [followerData, setFollowerData] = useState([]);
  // console.log(gridRows, "---->gridRows");
  // console.log(followerData, "---->followerData");

  //  ------> add addSerialNumber---
  const addSerialNumber = (rows) => {
    return rows.map((row, index) => ({
      ...row,
      s_no: index + 1,
    }));
  };

  const columns = [
    {
      field: "s_no",
      headerName: "s_no",
      width: 80,
    },
    {
      field: "page_name",
      headerName: "Page_name",
      width: 150,
    },
    {
      field: "followers_count",
      headerName: "Followers Count",
      width: 150,
    },
  ];

  //  Interagation of followerData api ----- ** start ** ------------------
  useEffect(() => {
    // console.log( "gridRows");
    axios
      .get(baseUrl+"getallprojectx")
      .then((response) => {
        const data = response.data;
        // console.log(data,"<--------");
        // if (gridRows.length > 0) {
        // const filteredData = [];
        // for (const item of data) {
        //   for (const gridRow of gridRows) {
        //     if (gridRow.page_name === item.page_name) {
        //       filteredData.push(item);
        //       break;
        //     }
        //   }
        // }
        const filteredData = data.filter((item) => {
          return gridRows
            .map((gridRow) => gridRow.Page_name)
            .includes(item.page_name);
        });
        // console.log(filteredData, "filteredData meeee");
        setFollowerData(filteredData);
      });
  }, [gridRows]);

  // Interagation of followerData api ----- ** End ** ------------------

  // upload file --********* start *******************---
  const fileInputRef = useRef(null);
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      // console.log(reader,"<-----reader");

      reader.onload = (event) => {
        const fileData = event.target.result;
        const workbook = XLSX.read(fileData, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        // console.log(parsedData,"<-----parsedData");
        setGridRows(parsedData);
        setXlxsData(parsedData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };
  // upload file --* End*--------------

  // Template file --*************** start*---
  const createExcelTemplate = () => {
    const headers = ["s_no", "Page_name", "followers_count"];
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
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };
  // Template file --* End*---

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "right",
          background: "#8680f2",
        }}
      >
        <Box style={{ flexGrow: 1 }}>
          <Typography
            style={{
              color: "#fff",
              fontSize: "20px",
              paddingTop: "10px",
              marginLeft: "20px",
            }}
          >
            Page Counts
          </Typography>
        </Box>
        <Button
          size="md"
          variant="contained"
          color="success"
          style={{ marginRight: "16px", margin: "8px", color: "#fff" }}
          onClick={handleUploadClick}
        >
          Upload
        </Button>
        <Button
          size="md"
          onClick={createExcelTemplate}
          variant="contained"
          color="success"
          style={{ marginRight: "16px", margin: "8px", color: "#fff" }}
        >
          Template
        </Button>
      </Paper>

      <input
        type="file"
        accept=".xlsx"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      <DataGrid
        rows={addSerialNumber(followerData)}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row.s_no}
        slots={{
          toolbar: GridToolbar,
        }}
        checkboxSelection
      />
    </Paper>
  );
}
