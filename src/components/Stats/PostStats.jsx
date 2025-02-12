import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Paper,
} from "@mui/material";
import React, { useCallback, useRef } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Text,
  Circle,
  Path,
} from "react-konva";
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
import DownloadingIcon from "@mui/icons-material/Downloading";
import Loader from "../Finance/Loader/Loader";
import { AppContext } from "../../Context/Context";
import jwtDecode from "jwt-decode";
import sarcasmLogo from "../../assets/imgs/screenshot/sarcasm.jpg";
import naughtyworldLogo from "../../assets/imgs/screenshot/naughtyworld.jpg";
import shotOne from "../../assets/imgs/screenshot/shot2.jpg";
import postOne from "../../assets/imgs/screenshot/post2.jpeg";
import reelOne from "../../assets/imgs/screenshot/reel1.jpg";
// import blueTick from "../../assets/imgs/screenshot/icon/blue-tick.svg";
import likeIcon from "../../assets/imgs/screenshot/icon/like1.png";
import commentIcon from "../../assets/imgs/screenshot/icon/comment1.png";
import shareIcon from "../../assets/imgs/screenshot/icon/share1.png";
import saveIcon from "../../assets/imgs/screenshot/icon/save1.png";
import muteIcon from "../../assets/imgs/screenshot/icon/mute.png";
import userIcon from "../../assets/imgs/screenshot/icon/user.png";
import {
  DotsThreeOutlineVertical,
  DotsThreeVertical,
  MusicNotes,
  SealCheck,
} from "@phosphor-icons/react";

import PostGenerator from "../InstaPostGenerator/PostGenerator";

function PostStats() {
  const screenshotRef = useRef(null);
  const accNameRef = useRef(null);
  const likesRef = useRef(null);
  const commentRef = useRef(null);
  const { usersDataContext } = useContext(AppContext);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const [upload, setUpload] = useState(false);
  const [rows, setRows] = useState([]);
  const [rowsloading, setRowsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [image, setImage] = React.useState(null);
  const [postImage, setPostImage] = useState(null);
  const stageRef = useRef(null); // Ref for the Konva stage
  const [postText, setPostText] = useState("Your Caption Here");
  useEffect(() => {
    const img = new window.Image();
    img.src = sarcasmLogo; // Replace with your image URL
    img.onload = () => {
      setImage(img); // Set the image once loaded
    };
    const img1 = new window.Image();

    img1.src = postOne;
    img1.onload = () => {
      setPostImage(img1);
    };
  }, []);

  // Function to download canvas as an image
  const downloadImage = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "instagram_post.png";
    link.href = uri;
    link.click();
  };

  // const handleRequestedExcel =(value)=>{
  // console.log(usersDataContext);
  // }

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8";

  function addTimeToPostedOn(postedOn) {
    if (!postedOn || typeof postedOn !== "string") {
      return "Invalid Date"; // Handle undefined or incorrect input gracefully
    }

    // Parse the input string (expected format: "YYYY-MM-DD HH:MM:SS")
    const parts = postedOn.split(" ");
    if (parts.length !== 2) return "Invalid Date"; // Handle incorrect format

    const [datePart, timePart] = parts;
    const dateParts = datePart.split("-").map(Number);
    const timeParts = timePart.split(":").map(Number);

    if (dateParts.length !== 3 || timeParts.length !== 3) return "Invalid Date";

    const [year, month, day] = dateParts;
    const [hour, minute, second] = timeParts;

    // Create a Date object (month is 0-indexed in JS)
    let date = new Date(year, month - 1, day, hour, minute, second);

    // Add 5 hours and 30 minutes
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    // Format the updated date back to "YYYY-MM-DD HH:MM:SS"
    const updatedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const updatedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

    return `${updatedDate} ${updatedTime}`;
  }

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
              Time: addTimeToPostedOn(item?.postedOn),
            }));
            console.log(extractedData, "extract data");
            // Rearranging the extractedData array based on the sequence of shortCodes
            const rearrangedData = [];
            value.shortCodes.forEach((shortCode) => {
              const post = extractedData.find((item) =>
                item.link.includes(shortCode)
              );
              if (post) {
                rearrangedData.push(post);
              } else {
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
    const tempemailIdobject = usersDataContext.find(
      (ele) => ele.user_id == userID
    );
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
                setReload(!reload);
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

    // Format time with seconds
    const time = `${hour}:${minute < 10 ? "0" + minute : minute}:${second < 10 ? "0" + second : second
      } ${ampm}`;

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
      headerName: "Upload Date",
      width: 200,
      // type: "text",
      renderCell: (params) => {
        const { date, time } = separateDateAndTime(params?.row?.createdAt);

        return (
          <div style={{ textAlign: "center", marginLeft: 10 }}>{date}</div>
        );
      },
      // editable: true,
    },
    {
      field: "updatedAt",
      headerName: "Resolved-Date",
      width: 200,
      // type: "text",
      renderCell: (params) => {
        const { date, time } = separateDateAndTime(params?.row?.updatedAt);

        return (
          <div style={{ textAlign: "center", marginLeft: 10 }}>{date}</div>
        );
      },
      // editable: true,
    },
    {
      field: "upload_time",
      headerName: "Upload-Time",
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
      headerName: "Req-Post",
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
    {
      field: "time",
      headerName: "Resolved-Time",
      width: 200,
      type: "text",
      renderCell: (params) => {
        const { time } = separateDateAndTime(params.row?.updatedAt);
        const requestIdResolvedStatus = params.row?.requestIdResolvedStatus; // Assuming this is part of the row data

        // Directly return the condition
        return requestIdResolvedStatus === 1 ? time : "";
      },
      // editable: true,
    },

    {
      field: "resolved_time",
      headerName: "Time-Taken",
      width: 200,
      type: "text",
      valueGetter: (params) => {
        // Extract upload_time and resolved_time (updatedAt)
        const uploadDateTime = new Date(params.row?.createdAt);
        const resolvedDateTime = new Date(params.row?.updatedAt);

        // Calculate the difference in milliseconds
        const timeDifference = resolvedDateTime - uploadDateTime;

        // Convert the difference to seconds
        const timeDifferenceInSeconds = Math.floor(timeDifference / 1000);

        // Calculate minutes and remaining seconds
        const minutes = Math.floor(timeDifferenceInSeconds / 60);
        const seconds = timeDifferenceInSeconds % 60;

        // Format the time as "X min Y sec" or just "Y sec"
        const formattedTime =
          minutes > 0 ? `${minutes} min ${seconds} sec` : `${seconds} sec`;

        // Return the formatted time difference
        return formattedTime;
      },
      // editable: true,
    },
  ];



  return (
    <>
      <PostGenerator />

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
    </>
  );
}

export default PostStats;
