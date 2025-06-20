import { Avatar, Badge, Button, Skeleton, Stack } from "@mui/material";
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
import * as XLSX from "xlsx";
import jwtDecode from "jwt-decode";
// import BrandTableSkeleton from "../../InstaApi.jsx/Analytics/Brand/Skeleton/BrandTableSkeleton";
import formatString from "../../../utils/formatString";
import ManagerRecord from "./Manager/ManagerRecord";

function CommunityManagerPage() {
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [pageNames, setPageNames] = useState([]);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  useEffect(() => {
    // Fetch data from the second API to get the page names
    axios
      .get(
        `https://insights.ist:8080/api/v1/community/community_user_records_by_id/${873}`
      )
      .then((res) => {
        if (res.status === 200) {
          const names = res.data.data.map((record) => record.page_name);
          setPageNames(names);
        }
      })
      .catch((error) => {
        console.error("Error fetching page names: ", error);
      });
  }, [userID]);

  useEffect(() => {
    if (pageNames.length > 0) {
      // Fetch data from the first API only after getting the page names
      axios
        .post(
          "https://insights.ist:8080/api/v1/community/super_tracker_post_analytics"
        )
        .then((res) => {
          if (res && res.status === 200) {
            const filteredData = res.data.data.filter((row) =>
              pageNames.includes(row._id)
            );
            // // console.log("Filtered Data:", filteredData);
            setRows(filteredData);
          }
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }
  }, [pageNames]);

  const columns = [
    {
      field: "sno",
      headerName: "Avatar",
      width: 70,
      editable: false,
      renderCell: (params) => {
        const instagramProfileUrl = `https://www.instagram.com/${params.row.creatorName}/`;

        return (
          <Link
            to={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Avatar
              src={`https://storage.googleapis.com/insights_backend_bucket/cr/${params.row.creatorName.toLowerCase()}.jpg`}
            />
          </Link>
        );
      },
    },
    {
      field: "creatorName",
      headerName: "Page name",
      width: 220,
      renderCell: (params) => {
        const instagramProfileUrl = `/admin/community/manager/${params.row.creatorName}`;

        return (
          <Link to={instagramProfileUrl} rel="noopener noreferrer">
            {formatString(params.row.creatorName)}
          </Link>
        );
      },
    },
    {
      field: "postcount",
      headerName: "Posts",
      width: 100,
    },
    {
      field: "followersCount",
      headerName: "Follower",
      width: 100,
      valueGetter: (params) => params.row.creatorInfo?.followersCount || 0,
    },
    {
      field: "followingCount",
      headerName: "Following",
      width: 100,
      valueGetter: (params) => params.row.creatorInfo?.followingCount || 0,
    },
    {
      field: "mediaCount",
      headerName: "Media",
      width: 100,
      valueGetter: (params) => params.row.creatorInfo?.postCount || 0,
    },
    {
      field: "nonPaidPosts.allLikes",
      headerName: "Np-Likes",
      width: 100,
      valueGetter: (params) => params.row.nonPaidPosts?.allLikes || 0,
    },
    {
      field: "allViews",
      headerName: "Np-Views",
      width: 100,
      valueGetter: (params) => params.row.nonPaidPosts?.allViews || 0,
    },
    {
      field: "allComments",
      headerName: "Np-Comments",
      width: 100,
      valueGetter: (params) => params.row.nonPaidPosts?.allComments || 0,
    },
    {
      field: "yesterdaypost",
      headerName: "YesterDay-Post-Count",
      width: 150,
      valueGetter: (params) =>
        params.row.previousDayReportStatus?.todayPostCount || 0,
    },
    {
      field: "yesterdayFollowerGrowth",
      headerName: "YesterDay-Follower-Growth",
      width: 150,
      valueGetter: (params) =>
        params.row.previousDayReportStatus
          ?.todayVsYesterdayFollowersCountDiff || 0,
    },
  ];

  return (
    <div>
      <ManagerRecord />
      {rows.length > 0 ? (
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      ) :
        <Skeleton />
      }
    </div>
  );
}

export default CommunityManagerPage;
