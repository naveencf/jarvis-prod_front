import { useEffect, useRef, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Paper, Button, Box, Typography } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import {baseUrl} from '../../../utils/config' 
import FormContainer from "../FormContainer";

export default function CheckPageFollowers() {
  const [gridRows, setGridRows] = useState([]);
  const [followerData, setFollowerData] = useState([]);
  console.log(followerData, "---->followerData");

  // Interagation of followerData api ----- ** start ** ------------------
  useEffect(() => {
    axios
      .get(`${baseUrl}`+`getallprojectx`)
      .then((response) => {
        const data = response.data;
        console.log(data, "<--------");
        if (gridRows.length > 0) {
          const filteredData = [];
          for (const item of data) {
            for (const gridRow of gridRows) {
              if (gridRow.page_name === item.page_name) {
                filteredData.push(item);
                break;
              }
            }
          }
          console.log(filteredData, "filteredData meeee");
          setFollowerData(filteredData);
        }
      });
  }, [gridRows]);
  // Interagation of followerData api ----- ** End ** ------------------
  const addSerialNumber = (rows) => {
    return rows.map((row, index) => ({
      ...row,
      S_No: index + 1,
    }));
  };
  //  ------------------

  const columns = [
    {
      field: "S_No",
      headerName: "S_No",
      width: 80,
    },
    {
      field: "page_name",
      headerName: "page_name",
      width: 150,
    },
    {
      field: "followers_count",
      headerName: "Followers Count",
      width: 150,
    },
  ];

  // upload file --********* start *******************---
  const fileInputRef = useRef(null);
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      console.log(reader, "<-----reader");

      reader.onload = (event) => {
        const fileData = event.target.result;
        const workbook = XLSX.read(fileData, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setGridRows(parsedData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };
  // upload file --* End*--------------

  // Template file --*************** start*---
  const createExcelTemplate = () => {
    const headers = ["S_No", "page_name"];
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
    <div className="master-card-css">
        <FormContainer
      
        mainTitle={"Check Page Followers"}
        handleSubmit={false}
        link={true}
        />
      <div className="card">
        <div className="card-header sb">
        
        <div className="pack gap4">
        <button
          className="btn btn-outline-primary cmnbtn btn_sm"
         
          onClick={handleUploadClick}
          >
          Upload
        </button>
          <input
            type="file"
            accept=".xlsx"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
            />
        <button
          
          onClick={createExcelTemplate}
          className="btn btn-outline-primary cmnbtn btn_sm"
          >
          Template
        </button>
        </div>
        </div>
        <div className="card-body thm_table fx-head body-padding">
        <DataGrid
        rows={addSerialNumber(followerData)}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row.S_No}
        slots={{
          toolbar: GridToolbar,
        }}
        checkboxSelection
        />
        </div>
      </div>
    
</div>
  );
}

//     const handleAddRecordClick = async () => {
  //      try {
    //        const newRecordData = {
      //          content_type: "add Content Type",
      
      //        };
      
      //        const response = await axios.post(baseUrl+"content",
      //        newRecordData);
      //        const newRecord = response.data;
      
      //        setRows((prevRows) => [...prevRows, newRecord]);
      //      } catch (error) {
        //        console.error("Error adding record:", error);
        //      }
        //    };
        