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
// import PaidPostUpdateandAlert from "./AlertandUpdate/PaidPostUpdateandAlert";

const ODD_OPACITY = 0.2;

function PaidPostsPageView({
  postrows,
  postdataloaded,
  selectedcampaign,
  // formatString,
  postupdated,
  setPostupdated,filteredBrands,filteredCampaigns
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
      valueGetter: (params) => postrows.indexOf(params.row) + 1,
    },
    {
      field: "postedOn",
      headerName: "Date",
      type: "number",
      width: 100,
      valueFormatter: ({ value }) => value,
      valueGetter: (params) => {
        const oldDate = params.row.postedOn.split(" ");
        const arr = oldDate[0].toString().split("-");
        return arr[2] + "-" + arr[1] + "-" + arr[0];
      },
    },
    {
      field: "time",
      headerName: "Time",
      type: "number",
      width: 100,
      valueGetter: (params) => {
        const oldDate = params.row.postedOn.split(" ");
        const arr = oldDate[1].toString().split(":");
        arr[0] = Number(arr[0]) + 5;
        arr[1] = Number(arr[1]) + 30;
        let newTime = "";
        if (arr[1] > 59) {
          arr[0]++;
          arr[1] = arr[1] - 60;
          if (arr[1] < 10) {
            arr[1] = "0" + arr[1];
          }
        }
        if (arr[0] > 11) {
          arr[0] = arr[0] - 12;
          newTime = arr[0] + ":" + arr[1] + " PM";
        } else {
          newTime = arr[0] + ":" + arr[1] + " AM";
        }
        return newTime;
      },
    },

    {
      field: "creatorName",
      headerName: "Name",
      width: 150,
      valueGetter: (params) => {
        const string = formatString(params.row.creatorName);
        return string;
      },
    },
    {
      field: "postUrl",
      headerName: "Post Image",
      width: 150,
      renderCell: (params) => {
        if (params.row.crone_trak === -1) {
          return (
            <img
              src={params.row.postImage}
              alt={params.row.postImage}
              style={{ width: "100%", height: "100%" }}
            />
          );
        } else {
          return (
            <a href={params.row.postUrl} target="_blank">
              <img
                src={params.row.postImage}
                alt={params.row.postImage}
                style={{ width: "100%", height: "100%" }}
              />
            </a>
          );
        }
      },
    },

    {
      field: "allLike",
      headerName: "Likes",
      width: 80,
    },
    {
      field: "allView",
      headerName: "Views",
      width: 80,
    },
    {
      field: "allComments",
      headerName: "Comments",
      width: 80,
    },
    {
      field: "title",
      headerName: "Caption",
      width: 380,
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

  const handleCheckBox = (e) => {
   
  };
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        {/* <GridToolbarDensitySelector /> */}
        <GridToolbarExport />
        <GridToolbarFilterButton />
        <Button onClick={() => setUpdatePost(true)}>Update Decision</Button>
      </GridToolbarContainer>
    );
  }

  return (
    <div className="card">
      <div style={{ height: 1000 }} className="thmTable">
        {/* {updatepost && (
          <PaidPostUpdateandAlert
            postrows={postrows}
            rowSelectionModel={rowSelectionModel}
            setRowSelectionModel={setRowSelectionModel}
            setUpdatePost={setUpdatePost}
            updatepost={updatepost}
            postupdated={postupdated}
            setPostupdated={setPostupdated}
          />
        )} */}
        {postdataloaded ? (
          <StripedDataGrid
            rows={postrows}
            rowHeight={150}
            initialState={{
              sorting: {
                sortModel: [{ field: "postcount", sort: "desc" }],
              },
            }}
            getRowId={(row) => row._id}
            //   slots={{ toolbar: GridToolbar }}
            onRowClick={(e) => handleCheckBox(e)}
            // slots={{
            //   toolbar: () => <CustomToolbar setUpdatePost={setUpdatePost} />,
            // }}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            checkboxSelection
            columns={postcolumns}
            // visibleFields={VISIBLE_FIELDS}
            disableRowSelectionOnClick
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
          />
        ) : (
          <TableSkeleton />
        )}
      </div>
    </div>
  );
}

export default PaidPostsPageView;
