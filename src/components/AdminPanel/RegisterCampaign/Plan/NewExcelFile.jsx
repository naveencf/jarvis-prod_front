import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState } from "react";
import * as XLSX from "xlsx";

const NewExcelFile = () => {
  const [excelData, setExcelData] = useState([]);

  // Excel downloader function start----------------------------
  const excelFile = () => {
    const groupedByDate = excelData.reduce((acc, data) => {
      const dateKey = new Date(data.posted_date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(data);
      return acc;
    }, {});

    const wb = XLSX.utils.book_new();

    Object.entries(groupedByDate).forEach(([date, groupData], index) => {
      const ws_data = groupData.map((data, index) => ({
        "S.NO": index + 1,
        "User Name": data?.page?.page_name,
        "Profile link": {
          t: "s",
          v: data?.page?.page_link,
          l: {
            Target: data?.page?.page_link,
            Tooltip: "Click to open link",
          },
        },
        "Follower Count": data?.page?.follower_count,
        Date: new Date(data?.posted_date).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
        "Post Link": {
          t: "s",
          v: data?.link,
          l: {
            Target: data?.link,
            Tooltip: "Click to open link",
          },
        },
      }));

      const ws = XLSX.utils.json_to_sheet(ws_data, { origin: "A2" });
      ws["!cols"] = [
        { wch: 6 },
        { wch: 20 },
        { wch: 40 },
        { wch: 20 },
        { wch: 15 },
        { wch: 55 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, date || `Sheet${index + 1}`);
    });

    XLSX.writeFile(wb, "ExcelData.xlsx");
  };

  // Excel downloader function end---------------------------------

  const excelTempData = async () => {
    try {
      const resData = await axios.post(
        "http://192.168.1.17:3000/api/tempexecution",
        {
          plan: "65d849e903764469b31284af",
        }
      );
      const filter = resData?.data?.result.filter(
        (item) => item.verification_status === "verified"
      );
      setExcelData(filter);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = excelData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page.page_name",
      headerName: "User Name",
      width: 150,
      valueGetter: (params) => params?.row?.page?.page_name,
    },
    {
      field: "link",
      headerName: "Post link",
      width: 250,
    },
    {
      field: "likes",
      headerName: "Likes",
      width: 250,
    },
    {
      field: "views",
      headerName: "Views",
      width: 180,
    },
    {
      field: "posted_date",
      headerName: "Date",
      width: 180,
      valueGetter: (params) => {
        const date = new Date(params.row.posted_date);
        const formattedDate = date.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        });
        return formattedDate;
      },
    },
    {
      field: "page.follower_count",
      headerName: "Follower Count",
      width: 150,
      valueGetter: (params) => params?.row?.page?.cat_name,
    },
    {
      field: "page.page_link",
      headerName: "Profile link",
      width: 150,
      valueGetter: (params) => params?.row?.page?.page_link,
    },
  ];
  return (
    <>
      <Button onClick={excelTempData} variant="outlined" sx={{ mt: 2, mb: 2 }}>
        Call Data
      </Button>
      {excelData?.length > 0 && (
        <Button variant="outlined" color="error" onClick={excelFile}>
          Excel
        </Button>
      )}
      <DataGrid
        rows={excelData}
        columns={columns}
        getRowId={(row) => row?._id}
      />
    </>
  );
};

export default NewExcelFile;
