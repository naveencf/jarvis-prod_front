import { Avatar, Badge, Button, Stack } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SuperTrackerCreator from "./SuperTrackerCreator";
import * as XLSX from "xlsx";
import LogoLoader from "../InstaApi.jsx/LogoLoader";

function CustomToolbar({ setFilterButtonEl }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <GridToolbarFilterButton ref={setFilterButtonEl} />
    </GridToolbarContainer>
  );
}

function SuperTrackerHome() {
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [rows, setRows] = useState([]);
  const [pages, setPages] = useState([]);
  const [operation, setOperation] = useState(null);
  const [filterModel, setFilterModel] = useState({
    items: [
      {
        id: 1,
        field: "page_name",
      },
    ],
  });

  useEffect(() => {
    axios.get("https://insights.ist:8080/api/getallprojectx").then((res) => {
      if (res.status === 200) {
        setRows(res.data.data);
        setPages(res.data.data);
         console.log(res.data.data);
      } else {
        alert("There is some error while fetching data.");
      }
    });
  }, []);

  const columns = [
    {
      field: "sno",
      headerName: "Avatar",
      width: 70,
      editable: false,
      renderCell: (params) => {
        const instagramProfileUrl = `https://www.instagram.com/${params.row.page_name}/`;

        return (
          <Link
            to={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Avatar
              src={`https://storage.googleapis.com/insights_backend_bucket/cr/${params.row.page_name.toLowerCase()}.jpg`}
            />
          </Link>
        );
      },
    },
    {
      field: "page_name",
      headerName: "Page name",
      width: 220,
    },
    {
      field: "tracking",
      headerName: "Status",
      width: 100,
      sortable: true,
      valueGetter: (params) => {
        return params.row.tracking ? 1 : 0;
      },
      renderCell: (params) => {
        return params.row.tracking ? (
          <Badge color="success" variant="dot" />
        ) : (
          <Badge color="error" variant="dot" />
        );
      },
    },
    {
      field: "page_category_id",
      headerName: "Category",
      width: 200,
    },
    {
      field: "tracking_cron",
      headerName: "Cron",
      width: 200,
    },
  ];

  const handleCheckBox = () => {
    console.log("work", rowSelectionModel);
  };

  const handleFileUpload = (event) => {
    setRowSelectionModel([]);
    const file = event.target.files[0];
    const reader = new FileReader();
    // console.log("first");

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const pageNames = XLSX.utils
        .sheet_to_json(sheet, { header: 1 })
        .flat()
        .map((name) => name.toLowerCase().trim()); // Convert all page names to lowercase and trim spaces

      const rowPageNames = rows.map((row) =>
        row.page_name.toLowerCase().trim()
      ); // Trim spaces for row page names

      const selectedRowIds = rows
        .filter((row) => pageNames.includes(row.page_name.toLowerCase().trim())) // Trim spaces for matching
        .map((row) => row._id);

      const unmatchedPageNames = pageNames.filter(
        (pageName) => !rowPageNames.includes(pageName)
      );

      setRowSelectionModel(selectedRowIds);
      if (unmatchedPageNames.length > 0) {
        alert(
          `Please check we are not getting given pages details in our record ${unmatchedPageNames}`
        );
      }
      // console.log(selectedRowIds, "selectedRowIds");
      // console.log(unmatchedPageNames, "unmatchedPageNames");
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["page_name"]]);
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template.xlsx");
  };

  // const isRowSelectable = (params) => {
  //   const pageExistsInPages = pages.some(page => page.creatorName === params.row.creatorName);
  //   console.log(pageExistsInPages,"pageExistsInPages")
  //   if (operation === "Add") {
  //     return !pageExistsInPages;
  //   }
  //   if (operation === "Remove") {
  //     return pageExistsInPages;
  //   }
  //   return true;
  // };
  return (
    <div className="workWrapper">
      <div className="card">
        <div className="card-header flex_center_between">
          <SuperTrackerCreator
            rowSelectionModel={rowSelectionModel}
            rows={rows}
            setRows={setRows}
            pages={pages}
            setPages={setPages}
            operation={operation}
            setOperation={setOperation}
            setRowSelectionModel={setRowSelectionModel}
          />
          <input
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            id="upload-excel"
            type="file"
            onChange={handleFileUpload}
            // label='upload only in single column without header'
          />
          <label htmlFor="upload-excel">
            <Button variant="contained" color="primary" component="span">
              Upload Excel
            </Button>
          </label>
          {/* <Button
            variant="contained"
            color="secondary"
            onClick={downloadTemplate}
          >
            Download Template
          </Button> */}
        </div>
        <div className="card-header flex_center_between">
          {rows.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.page_name}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              slots={{ toolbar: CustomToolbar }}
              slotProps={{
                panel: {
                  anchorEl: filterButtonEl,
                },
                toolbar: {
                  setFilterButtonEl,
                },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              checkboxSelection
              filterModel={filterModel}
              onFilterModelChange={(model) => setFilterModel(model)}
              onRowClick={handleCheckBox}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
              }}
              rowSelectionModel={rowSelectionModel}
              // isRowSelectable={(params)=> params.row?.supertracker_page ?false:true}
            />
          ) : (
            <LogoLoader />
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperTrackerHome;
