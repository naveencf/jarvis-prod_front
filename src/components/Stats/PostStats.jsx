import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Paper,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import BulkPostsUpload from "./BulkPostsUpload";
import PostStatsTemplate from "./PostStatsTemplate";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import LoopIcon from "@mui/icons-material/Loop";
import DownloadingIcon from '@mui/icons-material/Downloading';
import Loader from "../Finance/Loader/Loader";
import { AppContext } from "../../Context/Context";
import jwtDecode from "jwt-decode";

function PostStats() {
  const {  usersDataContext } = useContext(AppContext);
    const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const [upload, setUpload] = useState(false);
  const [rows, setRows] = useState([]);
  const [rowsloading, setRowsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  // const handleRequestedExcel =(value)=>{
  // console.log(usersDataContext);
  // }

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8";

  
  const handleRequestedExcel = (value) => {
    if (value) {
      axios
        .post(
          "https://insights.ist:8080/api/v1/getAllPostDetailsOnTheBasisOfReqId",
          {
            requestId: value._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            // console.log(res.data.data,"res.data.data",value)
            // Extracting only the required fields from the response data
            const extractedData = res.data.data.map((item, index) => ({
              sno: index + 1,
              pagename: item?.owner_info?.username,
              link:
                item?.postType == "REEL"
                  ? `https://www.instagram.com/reel/${item.shortCode}`
                  : `https://www.instagram.com/p/${item.shortCode}`,
              postType: item?.postType,
              likes: item?.like_count,
              Views: item?.play_count,
              comments: item?.comment_count,
              Time: item?.postedOn,
            }));

            // Rearranging the extractedData array based on the sequence of shortCodes
            const rearrangedData = [];
            value.shortCodes.forEach((shortCode) => {
              const post = extractedData.find((item) =>
                item.link.includes(shortCode)
              );
              if (post) {
                rearrangedData.push(post);
              }else {
                rearrangedData.push({
                  sno: rearrangedData.length + 1,
                  pagename: "",
                  link: "",
                  postType: "",
                  likes: "",
                  Views: "",
                  comments: "",
                  Time: "",
                });
              }
            });

            // Add serial number to rearrangedData
            rearrangedData.forEach((item, index) => {
              item.sno = index + 1;
            });

            // Creating worksheet with the rearranged data
            const worksheet = XLSX.utils.json_to_sheet(rearrangedData);

            // Create workbook and add the worksheet
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            // Save the workbook as an Excel file
            XLSX.writeFile(workbook, "post_stats.xlsx");
          }
        })
        .catch((error) => {
          console.error("Error fetching post details:", error);
        });
    }
  };

  const handlePartialRequest = (value) => {
    // console.log(value);
    let emailto = "naveen@creativefuel.io";
    const tempemailIdobject = usersDataContext.find((ele) => ele.user_id == userID);
    if (tempemailIdobject?.user_email_id) {
      emailto = tempemailIdobject?.user_email_id;
    }
    if (value) {
      setRowsLoading(false);
      axios
        .post(
          "https://insights.ist:8080/api/v1/getPartialPostDetailsOnTheBasisOfReqId",
          {
            requestId: value._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            axios
              .post(
                "https://insights.ist:8080/api/v1/getpostDetailFromInstaForMultiplePost",
                {
                  shortCodes: res.data.data[0].shortCodes,
                  department: "65c1cf4129f505657c16da47",
                  userId: userID,
                  requestId: value._id,
                  email: emailto,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                // console.log(response);
                setReload(!reload)
               
              });
          }
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
    // setUpload(false);
  };

  useEffect(() => {
    axios
      .get("https://insights.ist:8080/api/v1/getAllRequestIdDetails", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data.data);
        setRows(res.data.data?.reverse());
        setRowsLoading(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [reload]);

  function separateDateAndTime(createdAt) {
    const dateObject = new Date(createdAt);

    // Get UTC time in milliseconds
    const utcTime = dateObject.getTime();

    // Get time zone offset in milliseconds for GMT (inverting sign to convert from UTC to GMT)
    const timeZoneOffset = dateObject.getTimezoneOffset() * 60000 * -1;

    // Convert UTC time to GMT by adding time zone offset
    const gmtTime = utcTime + timeZoneOffset;

    // Create new date object with GMT time
    const gmtDateObject = new Date(gmtTime);

    // Extract date
    const date = gmtDateObject.toISOString().split("T")[0];

    // Extract hour, minute, and second
    let hour = gmtDateObject.getUTCHours();
    const minute = gmtDateObject.getUTCMinutes();
    const second = gmtDateObject.getUTCSeconds();

    // Determine AM/PM indicator
    const ampm = hour >= 12 ? "PM" : "AM";

    // Convert hour to 12-hour format
    hour = hour % 12;
    hour = hour ? hour : 12; // "0" should be displayed as "12"
    // :${second < 10 ? '0' + second : second}
    // Format time
    const time = `${hour}:${minute < 10 ? "0" + minute : minute} ${ampm}`;

    return { date, time };
  }

  const columns = [
    {
      field: "s_no",
      headerName: "S No",
      width: 90,
      renderCell: (params) => {
        const rowIndex = rows.indexOf(params.row);
        return (
          <div style={{ textAlign: "center", marginLeft: 10 }}>
            {rowIndex + 1}
          </div>
        );
      },
    },
    {
      field: "_id",
      headerName: "Request Id",
      width: 330,
      type: "text",
      // editable: true,
    },
   
    {
      field: "createdAt",
      headerName: "Date",
      width: 200,
      type: "text",
      renderCell: (params) => {
        const { date, time } = separateDateAndTime(params.row.createdAt);
        // const rowIndex = rows.indexOf(params.row);
        return (
          <div style={{ textAlign: "center", marginLeft: 10 }}>{date}</div>
        );
      },
      // editable: true,
    },
    {
      field: "time",
      headerName: "Time",
      width: 200,
      type: "text",
      renderCell: (params) => {
        const { date, time } = separateDateAndTime(params.row.createdAt);
        const rowIndex = rows.indexOf(params.row);
        return (
          <div style={{ textAlign: "center", marginLeft: 10 }}>{time}</div>
        );
      },
      // editable: true,
    },
    {
      field: "userId",
      headerName: "User-Name",
      width: 250,
      // type: "text",
      renderCell: (params) => {
        try {
          const username = usersDataContext.find(
            (ele) => ele.user_id == params.row.userId
          );
          // console.log(username);
          return username ? username.user_name : "";
        } catch (error) {
          console.error("Error fetching username:", error);
          return "Error fetching username";
        }
      },
    },
    {
      field: "shortCodesLength",
      headerName: "Requested-Post",
      width: 90,
      // type: "text",
      // editable: true,
    },
    {
      field: "resolvedCodesLength",
      headerName: "Resolved-Post",
      width: 90,
      // type: "text",
      renderCell: (params) => {
        const tempstatus = params.row?.requestIdResolvedStatus;
        // console.log(tempstatus);
        if (tempstatus == 1) {
          return params.row?.shortCodesLength;
        } 
      },
    },
    {
      field: "actions",
      // type: "actions",
      headerName: "Download",
      width: 100,
      cellClassName: "actions",
      renderCell: (params) => {
        const tempstatus = params.row?.requestIdResolvedStatus;
        // console.log(tempstatus);
        if (tempstatus == 1) {
          return [
            <GridActionsCellItem
              icon={<DownloadIcon />}
              onClick={() => handleRequestedExcel(params.row)}
              label="view"
              color="inherit"
            />,
          ];
        } else if (tempstatus == 2) {
          return [
            <GridActionsCellItem
              icon={<LoopIcon />}
              onClick={() => handlePartialRequest(params.row)}
              label="view"
              color="inherit"
            />,
          ];
        }
      },
    },
    {
      field: "tempDownload",
      // type: "actions",
      headerName: "Partial-Download",
      width: 100,
      cellClassName: "actions",
      renderCell: (params) => {
        const tempstatus = params.row?.requestIdResolvedStatus;
        // console.log(tempstatus);
        if (tempstatus == 2) {
          return [
            <GridActionsCellItem
              icon={<DownloadingIcon />}
              onClick={() => handleRequestedExcel(params.row)}
              label="view"
              color="inherit"
            />,
          ];
        } 
      },
    },
  ];

  return (
    <div className="workWrapper">
      <div className="card">
        <div className="card-header flex_center_between">
          <div>
            <Button
              className="btn cmnBtnSmall btn-outline-primary"
              onClick={() => {
                setUpload(!upload);
              }}
            >
              Upload..
            </Button>


            {upload && (
              <BulkPostsUpload
                userID={userID}
                usersDataContext={usersDataContext}
                setUpload={setUpload}
                setOpen={setOpen}
                reload={reload}
                setReload={setReload}
              />
            )}
          </div>
          <div>
            <PostStatsTemplate />
          </div>
        </div>
        <div className="card-body thmTable p0">
          {rowsloading ? (
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row._id}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 25,
                  },
                },
              }}
              pageSizeOptions={[5, 25, 100]}
            />
          ) : (
            <Loader />
          )}
        </div>
        {/* <InstagramEmbed/> */}
      </div>

      <Dialog maxWidth="xs" open={open}>
        <DialogTitle>
          <div className="stationModalContent">
            <>
              <span className="actionIcon yes">
                <i className="bi bi-check"></i>
              </span>
              <h2 className="yes">Successfully Saved</h2>
            </>

            <h4>We have received your request.Please wait for few min.</h4>
          </div>
        </DialogTitle>

        <DialogActions className="stationModalFooter">
          <Button className="cmnBtn btn-success" onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PostStats;
