import {
  Box,
  Button,
  FormControl,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import ModeCommentTwoToneIcon from "@mui/icons-material/ModeCommentTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import { useState } from "react";
import CallToActionTwoToneIcon from "@mui/icons-material/CallToActionTwoTone";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { set } from "date-fns";
import { baseUrl } from "../../../utils/config";

export default function ExtendRequest({ ReloadMain }) {
  const [showDateError, setShowDateError] = useState(false);
  const [reload, setReload] = useState(false);
  const [showData, setShowData] = useState([]);
  const [brandName, setBrandName] = useState([]);
  const [contentTypeList, setContentTypeList] = useState([]);
  const [commits, setCommits] = useState([]);
  const [assignToList, setAssignToList] = useState([]);
  const [commitmentModalData, setCommitmentModalData] = useState([{}]);
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openTerminateRequestModal, setOpenTerminateRequestModal] =
    React.useState(false);
  const [reAssignModalData, setTerminateRequestModalData] = useState([]);
  const handleExtendRequestMdalOpen = (params) => {
    setTerminateRequestModalData(params.row);
    setOpenTerminateRequestModal(true);
  };
  const handleCloseExtendReqestModal = () =>
    setOpenTerminateRequestModal(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    borderRadius: "10px",
    transform: "translate(-40%, -50%)",
    width: "35vw",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };
  const handleOpen = (params) => {
    setCommitmentModalData(params.row.commitment);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleReassing = () => {
    if (selectedDate) {
      setShowDateError(false);
      axios
        .put(baseUrl + "contentSectionReg", {
          content_section_id: reAssignModalData.content_section_id,
          creator_dt: selectedDate,
          stage: 3,
          status: "21",
        })
        .then((response) => {
          if (response.data.success == true) {
            handleCloseExtendReqestModal();
            setReload(!reload);
            ReloadMain((prev) => !prev);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle the error as needed
        });
    } else {
      console.error("selectedDate is null");
      setShowDateError(true);
      // Handle the case where selectedDate is null, e.g., show an error message or take appropriate action
    }
  };

  useEffect(() => {
    axios.get(baseUrl + "contentSectionReg").then((response) => {
      const data = response.data.data.filter(
        (e) => e.status == "23" && e.stage == "3"
      );
      setShowData(data);
    });

    axios
      .get(baseUrl + "get_brands")
      .then((response) => {
        setBrandName(response.data.data);
        // setTable1Data2(true);
      })
      .catch((err) => {
        console.log(err);
      });

    axios.get(baseUrl + "content").then((response) => {
      setContentTypeList(response.data.data);
    });
    axios.get(baseUrl + "campaign").then((response) => {
      const data = response.data;

      setCommits(data);
    });
    axios.get(baseUrl + "get_all_users").then((response) => {
      const data = response.data.data.filter((e) => e.dept_id == 13);
      setAssignToList(data);
    });
  }, []);

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = showData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "brand_id",
      headerName: "Brand Name",
      width: 150,
      renderCell: (params) => {
        return brandName.filter((e) => {
          return e.brand_id == params.row.brand_id;
        })[0]?.brand_name;
        //  return params.row.brand_id.filter(e=>brandName.map(e=>e.brand_id).includes(e))[0].brand_name
      },
    },
    {
      field: "assign_to",
      headerName: "Assigned To",
      width: 150,
      renderCell: (params) => {
        return assignToList.filter((e) => {
          return e.user_id == params.row.assign_to;
        })[0]?.user_name;
      },
    },
    {
      field: "brnad_dt",
      headerName: "Expected Data & Time",
      width: 200,
      renderCell: (params) => {
        return new Date(params.row.brnad_dt)
          .toLocaleString("en-GB", { timeZone: "UTC" })
          .replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+).*/, "$3/$2/$1 $4");
      },
    },

    {
      field: "content_type_id",
      headerName: "Content Type",
      width: 150,
      renderCell: (params) => {
        const matchingContentType = contentTypeList.find((e) => {
          return params.row?.content_type_id === e?.content_type_id;
        });
        return matchingContentType?.content_type || "";
      },
    },
    {
      field: "campaign_brief",
      headerName: "Campaign Brief",
      width: 150,
    },
    {
      field: "content_brief",
      headerName: "Content Remark",
      width: 150,
    },
    {
      field: "creator_remark",
      headerName: "Creator Remark",
      width: 150,
    },
    {
      field: "commits",
      headerName: "Commits",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <Button onClick={() => handleOpen(params)} variant="text">
              <ModeCommentTwoToneIcon />
            </Button>
          </div>
        );
      },
    },
    // {
    //   field: "commits",
    //   headerName: "Commits",
    //   width: 150,
    //   renderCell: () => {
    //     return (
    //       <div>
    //         <Button onClick={handleOpen} variant="text">
    //           <ModeCommentTwoToneIcon />
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
    {
      field: "download_excel_file",
      headerName: "Excel Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <a href={params.row.download_excel_file}>
              <Button variant="text">
                <DownloadTwoToneIcon />
              </Button>
            </a>
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => {
        return (
          <div className="d-flex text-center align-item-center justify-content-center">
            <Button
              type="button"
              onClick={() => handleExtendRequestMdalOpen(params)}
            >
              <CallToActionTwoToneIcon />
            </Button>
          </div>
        );
      },
      width: 200,
    },
  ];

  const commitColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = commitmentModalData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "selectValue",
      headerName: "Commits",
      width: 200,
      renderCell: (params) => {
        return commits.filter((e) => {
          return e.campaign_id == params.row.selectValue;
        })[0]?.campaign_name;
      },
    },
    {
      field: "textValue",
      headerName: "Value",
      width: 150,
    },
  ];

  return (
    <div>
      <>
        <DataGrid
          rows={showData}
          columns={columns}
          pageSize={10}
          getRowId={(row) => row._id}
        />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ padding: "2px" }}
            >
              Commits
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2, mb: 3 }}>
              <Paper sx={{ padding: "10px" }}>
                <div className="d-flex justify-content-between">
                  <DataGrid
                    rows={commitmentModalData}
                    columns={commitColumns}
                    pageSize={10}
                    getRowId={(row) => row.selectValue}
                  />
                </div>
                <Button
                  sx={{ marginTop: "10px" }}
                  variant="contained"
                  onClick={handleClose}
                  color="primary"
                >
                  Cancle
                </Button>
              </Paper>
            </Typography>
          </Box>
        </Modal>
      </>

      <Modal
        open={openTerminateRequestModal}
        onClose={handleCloseExtendReqestModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            borderRadius: "10px",
            transform: "translate(-40%, -50%)",
            width: "30vw",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 1,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ padding: "2px" }}
          >
            Set Date & Time
            <div style={{ height: "20px" }}>
              {showDateError && (
                <p className="text-danger">selectedDate is null</p>
              )}
            </div>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <FormControl className="d-flex">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date Time"
                  value={selectedDate}
                  onChange={(newValue) => handleDateChange(newValue)}
                />
              </LocalizationProvider>
            </FormControl>

            <div className="d-flex justify-content-between">
              <Button
                sx={{ marginTop: "10px" }}
                variant="contained"
                onClick={handleCloseExtendReqestModal}
                color="error"
              >
                Cancle
              </Button>
              <Button
                sx={{ marginTop: "10px" }}
                variant="contained"
                onClick={handleReassing}
                color="primary"
              >
                Yes
              </Button>
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
