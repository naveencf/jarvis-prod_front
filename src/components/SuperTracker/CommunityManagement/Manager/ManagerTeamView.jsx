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
import formatString from "../../../../utils/formatString";
import { ApiContextData } from "../../../AdminPanel/APIContext/APIContext";
import { useContext } from "react";

function ManagerTeamView() {
  const { userContextData } = useContext(ApiContextData);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [pageNames, setPageNames] = useState([]);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  useEffect(() => {
    if (userID) {
      // Fetch data from the first API only after getting the page names
      axios
        .get(
          `https://insights.ist:8080/api/v1/community/community_user_records_by_manager/${userID}`
        )
        .then((res) => {
          if (res && res.status === 200) {
            setRows(res.data.data);
          }
        //   console.log(res.data.data, "res.data.data");
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }
  }, [userID]);

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
      field: "user_id",
      headerName: "User",
      width: 220,
      valueGetter: (params) =>
        userContextData?.find((user) => user.user_id === params.row.user_id)
          ?.user_name || "N/A",
      renderCell: (params) =>
        userContextData?.find((user) => user.user_id === params.row.user_id)
          ?.user_name || "N/A",
    },
    // {
    //   field: "role",
    //   headerName: "Role",
    //   width: 220,
    //   valueGetter: (params) => params.row.role || 0,
    //   renderCell: (params) => {
    //     const tempRole = params.row.role;
    //     if (tempRole == 3) {
    //       return "Editor";
    //     }
    //     return "No-Role";
    //   },
    // },
    {
      field: "page_name",
      headerName: "Page name",
      width: 220,
      renderCell: (params) => {
        const instagramProfileUrl = `/admin/instaapi/community/manager/${params.row.page_name}`;

        return (
          <Link to={instagramProfileUrl} rel="noopener noreferrer">
            {formatString(params.row.page_name)}
          </Link>
        );
      },
    },
    // {
    //   field: "postcount",
    //   headerName: "Posts",
    //   width: 100,
    // },

    // {
    //   field: "nonPaidPosts.allLikes",
    //   headerName: "Np-Likes",
    //   width: 100,
    //   valueGetter: (params) => params.row.nonPaidPosts?.allLikes || 0,
    // },
  ];

  return (
    <div>
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
      ) : (
        <Skeleton />
      )}
    </div>
  );
}

export default ManagerTeamView;
