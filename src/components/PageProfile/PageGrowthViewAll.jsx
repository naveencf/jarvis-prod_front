import * as React from "react";
import axios from "axios";
import { alpha, styled } from "@mui/material/styles";
// import CountUp from "react-countup";
import {
  DataGrid,
  gridClasses,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
// import TopCampaignSkeleton from "./Skeleton/TopCampaignSkeleton";
import { useState } from "react";
import { useRef } from "react";
import { Button, Skeleton } from "@mui/material";
import TableSkeleton from "../CommonTool/TableSkeleton";
import { formatDate } from "../../utils/formatDate";
// import PaidPostUpdateandAlert from "./AlertandUpdate/PaidPostUpdateandAlert";

const ODD_OPACITY = 0.2;

function PageGrowthViewAll({
  startDate,
  endDate,
  creatorDetail,
  creatorProgress,
  setCreatorProgress,
}) {
  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: theme.palette.grey[200],
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
        "@media (hover: none)": {
          backgroundColor: "transparent",
        },
      },
      "&.Mui-selected": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity
        ),
        "&:hover, &.Mui-hovered": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY +
              theme.palette.action.selectedOpacity +
              theme.palette.action.hoverOpacity
          ),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: alpha(
              theme.palette.primary.main,
              ODD_OPACITY + theme.palette.action.selectedOpacity
            ),
          },
        },
      },
    },
  }));
  //   const filterprefrenceRef = useRef(null);

  const [filterprefrence, setFilterprefrence] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [updatepost, setUpdatePost] = useState(false);
  const postcolumns = [
    {
      field: "Sno",
      headernewname: "Sno",
      width: 50,
      editable: false,
      valueGetter: (params) => creatorProgress.indexOf(params.row) + 1,
    },
    {
      field: "createdAt",
      headerName: "Date",
      type: "number",
      width: 150,
      valueFormatter: ({ value }) => value,
      valueGetter: (params) => {return formatDate(params.row.createdAt)}
      // valueGetter: (params) => {
      //   const oldDate = params.row.createdAt.split("T");
      //   const arr = oldDate[0].toString().split("-");
      //   return arr[2] + "-" + arr[1] + "-" + arr[0];
      // },
    },

    {
      field: "followersCount",
      headerName: "Follower",
      width: 150,
      // valueGetter: (params) => {
      //   const string = formatString(params.row.creatorName);
      //   return string;
      // },
    },

    {
      field: "todayVsYesterdayFollowersCountDiff",
      headerName: "Growth",
      width: 150,
    },

    // {
    //   field: "todayVsYesterdayMediaCountDiff",
    //   headerName: "Media",
    //   width: 150,
    // },
    {
      field: "todayPostCount",
      headerName: "Posted",
      width: 150,
    },
    
  ];

  const formatString = (s) => {
    // Remove leading underscores
    let formattedString = s.replace(/^_+/, "");

    // Capitalize the first letter and make the rest lowercase
    if (formattedString) {
      formattedString =
        formattedString.charAt(0).toUpperCase() +
        formattedString.slice(1).toLowerCase();
    }

    return formattedString;
  };
  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    dateObject.setDate(dateObject.getDate() - 1);
    return dateObject.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  const handleCheckBox = (e) => {};
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />

        <GridToolbarExport />
        <GridToolbarFilterButton />
      </GridToolbarContainer>
    );
  }

  return (
    <div className="card">
      {/* <div style={{ height: 1000 }} className="thmTable"> */}
        {creatorProgress.length > 0 ? (
          <StripedDataGrid
            rows={creatorProgress}
            // rowHeight={150}
            // initialState={{
            //   sorting: {
            //     sortModel: [{ field: "postcount", sort: "desc" }],
            //   },
            // }}
            getRowId={(row) => row._id}
              slots={{ toolbar: GridToolbar }}
            // onRowClick={(e) => handleCheckBox(e)}
            // slots={{
            //   toolbar: () => <CustomToolbar />,
            // }}
            // onRowSelectionModelChange={(newRowSelectionModel) => {
            //   setRowSelectionModel(newRowSelectionModel);
            // }}
            // rowSelectionModel={rowSelectionModel}
            // checkboxSelection
            columns={postcolumns}
            // visibleFields={VISIBLE_FIELDS}
            // disableRowSelectionOnClick
            // getRowClassName={(params) =>
            //   params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            // }
          />
        ) : (
          <TableSkeleton />
        )}
      {/* </div> */}
    </div>
  );
}

export default PageGrowthViewAll;
