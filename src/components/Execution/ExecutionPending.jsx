import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from "@mui/material";
import Confirmation from "./Confirmation";
import jwtDecode from "jwt-decode";
import { GridToolbar } from "@mui/x-data-grid";
import ExecutionUpdate from "./ExecutionUpdate";
import PaymentDetailDailog from "./PaymentDetailDailog";
import PointOfSaleTwoToneIcon from "@mui/icons-material/PointOfSaleTwoTone";
import { baseUrl } from "../../utils/config";
import FormContainer from "../AdminPanel/FormContainer";
import { styled } from "@mui/material/styles";
import { useGlobalContext } from "../../Context/Context";
import { useGetAllBrandQuery } from "../Store/API/Sales/BrandApi";
import { ButtonGroup } from "react-bootstrap";
import formatString from "../AdminPanel/Operation/CampaignMaster/WordCapital";
import CaseStudyOpenUpdate from "./CaseStudyOpenUpdate";

function ExecutionPending() {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const { data: allBrandData } = useGetAllBrandQuery();
  const navigate = useNavigate();
  const { toastAlert, toastError } = useGlobalContext();
  const [snackbar, setSnackbar] = useState(null);
  const [confirmation, setConfirmation] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState([]);
  const [reload, setReload] = useState(false);
  const [contextData, setContextData] = useState(false);
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const [executionStatus, setExecutionStatus] = useState();
  const [saimyualCamp, setSaimyualCamp] = useState([]);
  const [caseStudyOpenRowData, setCaseStudyOpenRowData] = useState("");
  const userID = decodedToken.id;
  const [openPaymentDetailDialog, setOpenPaymentDetaliDialog] = useState(false);
  const [paymentDialogDetails, setPaymentDialogDetails] = useState([{}]);
  const [multipleToken, setMultipleToken] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [holdDialog, setShowHoldDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [caseStudyDialog, setCaseStudyDialog] = useState(false);
  const [apiStatus, setApiStatus] = useState("sent_for_execution");
  const [totalExecutionCounts, setTotalExecutionCounts] = useState("");
  const [readOnlyAccountsData, setReadOnlyAccountsData] = useState("");

  const handleHoldSubmit = () => {
    let payload = {
      // execution_token: token,
      execution_status: "execution_paused",
      sale_booking_id: rowData.sale_booking_id,
    };
    console.log(rowData.sale_booking_id, "data");
    axios
      .put(`${baseUrl}sales/execution_status/${rowData._id}`, payload, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setReload((preVal) => !preVal);
        handleClose();
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = () => {
    setShowHoldDialog(false);
  };

  const handleReleaseRow = (row) => {
    return () => {
      let payload = {
        execution_status: "sent_for_execution",
        sale_booking_id: row.sale_booking_id,
      };
      console.log(row, "data");
      axios
        .put(`${baseUrl}sales/execution_status/${row._id}`, payload, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setReload((preVal) => !preVal);
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  const handleClickOpenPaymentDetailDialog = (data) => {
    setPaymentDialogDetails(data);
    setOpenPaymentDetaliDialog(true);
  };
  const handleClosePaymentDetailDialog = () => {
    setOpenPaymentDetaliDialog(false);
  };

  const handleRowHold = (row, hold_execution_status) => {
    return () => {
      setRowData(row);
      setShowHoldDialog(true);
      setExecutionStatus(hold_execution_status);
    };
  };
  const handleMultipleVerification = (e) => {
    e.preventDefault();
    let filteredRow = saimyualCamp?.find(
      (e) => e?.execution_token == multipleToken
    );
    if (filteredRow) {
      let payload = {
        execution_status: "execution_accepted",
        sale_booking_id: filteredRow.sale_booking_id,
      };
      axios
        .put(`${baseUrl}sales/execution_status/${filteredRow._id}`, payload, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(res);
          setReload((preVal) => !preVal);
          executionAPI();
          toastAlert("Execution Accepted");
          multipleToken("");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toastError("Invalid Token");
    }
  };

  const handleAccept = (row) => {
    setRowData(row);
    setConfirmation(true);
    setExecutionStatus(2);
  };

  const handleDone = (row) => {
    setRowData(row);
    setExecutionStatus(3);
    setReload(true);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      executionAPI();
    }, 1000);
  }, [reload]);

  const fetchData = async () => {
    try {
      if (userID && contextData == false) {
        axios
          .get(`${baseUrl}` + `get_single_user_auth_detail/${userID}`)
          .then((res) => {
            if (res.data[26].view_value == 1) {
              setContextData(true);
              setAlert(res.data);
            }
          });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    axios.get(baseUrl + `sales/sales_booking_execution?status=${apiStatus}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  let executionAPI = async (status = "sent_for_execution") => {
    await axios
      .get(`${baseUrl}sales/sales_booking_execution?status=${status}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        console.log(res, "response--->>>-->>>");
        setSaimyualCamp(res?.data?.data);
        setData(res?.data?.data);
        setFilterData(res?.data?.data.reverse());
      });
  };

  const ExecutionTotalCounts = async () => {
    await axios
      .get(`${baseUrl}sales/count_data_status_wise`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res, "total--->>>-->>>");
        setTotalExecutionCounts(res?.data);
      });
  };

  useEffect(() => {
    executionAPI();
    ExecutionTotalCounts();
  }, []);

  const handleViewClick = (id) => {
    const selected = data.find((ele) => ele.sale_booking_id == id);
  };

  const handleStartExecutions = (params) => {
    navigate("/admin/op-register-campaign", {
      state: { sale_id: params?.row?.sale_booking_id },
    });
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(13, 110, 253)",
      },
    },
  });
  const addSerialNumber = (rows) => {
    return rows?.map((row, index) => ({
      ...row,
      S_No: index + 1,
    }));
  };
  const handleOpenCaseStudyDialog = async (e, row) => {
    console.log(row, "row--->>");
    e.preventDefault();
    setCaseStudyDialog(true);
    setCaseStudyOpenRowData(row);
    try {
      const response = await axios.get(
        `${baseUrl}accounts/get_all_account?account_id=${row?.account_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const accountData = response?.data?.data;
      console.log(accountData, " rd total--->>>-->>>");
      setReadOnlyAccountsData(accountData);
    } catch (error) {
      console.error("Error fetching account data:", error);
      toastError(error, "Failed to fetch account data");
    }
  };

  const columns = [
    {
      field: "S_No",
      headerName: "S No",
      width: 90,
    },
    {
      field: "brand_id",
      headerName: "Brand Name",
      width: 150,
      renderCell: (params) => {
        const brName = allBrandData?.find(
          (item) => item?._id === params?.row?.brand_id
        )?.brand_name;
        return brName || "";
      },
    },
    {
      field: "campaign_name",
      headerName: "Campaign Name",
      width: 150,
      renderCell: (params) => {
        return formatString(params?.row?.campaign_name || "N/A");
      },
    },
    {
      field: "cust_name",
      headerName: "Client Name",
      width: 150,
    },

    {
      field: "sales_executive_name",
      headerName: "Sales Executive",
      width: 150,
    },
    {
      field: "execution_status",
      headerName: "Status",
      width: 250,
      renderCell: (params) => {
        if (params.row.execution_status == "sent_for_execution") {
          return (
            <>
              <Button
                size="small"
                color="error"
                className="btn btn_sm cmnbtn"
                variant="outlined"
                fontSize="inherit"
              >
                Pending
              </Button>
            </>
          );
        } else if (params.row.execution_status == "execution_accepted") {
          return (
            <>
              <Button
                size="small"
                color="success"
                variant="outlined"
                className="btn btn_sm cmnbtn"
                fontSize="inherit"
                sx={{ mr: 0.5 }}
                onClick={() => console.log(params.row)}
              >
                In Progress
              </Button>
              {/* {params?.row?.execution_excel &&
                params.row?.execution_status == "execution_accepted" && (
                  <Button
                    size="small"
                    color="success"
                    variant="outlined"
                    className="btn btn_sm cmnbtn"
                    fontSize="inherit"
                    onClick={() => handleStartExecutions(params)}
                  >
                    Start Execution
                  </Button>
                )} */}
            </>
          );
        } else if (params.row.execution_status == "execution_completed") {
          return (
            <Button
              size="small"
              color="success"
              variant="outlined"
              className="btn btn_sm cmnbtn"
              fontSize="inherit"
            >
              Completed
            </Button>
          );
        } else if (params.row.execution_status == "execution_rejected") {
          return (
            <Button
              size="small"
              color="error"
              variant="outlined"
              className="btn btn_sm cmnbtn"
              fontSize="inherit"
            >
              Rejected
            </Button>
          );
        } else if (params.row.execution_status == "execution_paused") {
          return (
            <Button
              size="small"
              color="warning"
              variant="outlined"
              className="btn btn_sm cmnbtn"
              fontSize="inherit"
            >
              Hold
            </Button>
          );
        } else if (params.row.case_study_status == false) {
          return (
            <Button
              size="small"
              color="success"
              variant="outlined"
              className="btn btn_sm cmnbtn"
              fontSize="inherit"
            >
              Case Study Close
            </Button>
          );
        }
      },
    },

    {
      field: "sale_booking_date",
      headerName: "Booking Date",
      type: "number",
      width: 110,
      renderCell: (params) => {
        return new Date(params?.row.sale_booking_date).toLocaleDateString(
          "en-GB"
        );
      },
    },
    {
      field: "start_date",
      headerName: "Start Date",
      width: 200,
      renderCell: (params) => {
        if (
          !params.row.start_date ||
          params.row.start_date === "0000-00-00 00:00:00" ||
          params.row.start_date === null ||
          params.row.start_date === undefined
        ) {
          return " ";
        }

        const startDate = new Date(params.row.start_date);
        const dateOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        };
        const timeOptions = {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        };

        const formattedDate = startDate.toLocaleDateString(
          "en-GB",
          dateOptions
        );
        const formattedTime = startDate
          .toISOString()
          .split("T")[1]
          .substring(0, 8);

        return (
          <div>
            <span>{formattedDate}</span> &nbsp;
            <span>{formattedTime}</span>
          </div>
        );
      },
    },

    {
      field: "end_date",
      headerName: "End Date",
      width: 150,
      renderCell: (params) => {
        const startDate = params.row.end_date
          ? new Date(params.row.end_date)
          : new Date();
        const dateOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        };

        const formattedDate = startDate?.toLocaleDateString(
          "en-GB",
          dateOptions
        );
        const formattedTime =
          startDate != "Invalid Date"
            ? startDate?.toISOString()?.split("T")[1]?.substring(0, 8)
            : "";

        return (
          <div>
            <span>{formattedDate}</span> &nbsp;
            <span>{formattedTime}</span>
          </div>
        );
      },
    },
    contextData && {
      field: "campaign_amount",
      headerName: "Amount",
      width: 120,
    },
    {
      field: "execution_excel",
      headerName: "Excel",
      width: 150,
      renderCell: (params) => {
        return (
          params.row.execution_excel && (
            <Button
              size="small"
              color="success"
              className="btn btn_sm cmnbtn"
              variant="outlined"
              fontSize="inherit"
              href={params.row.execution_excel}
            >
              Download
            </Button>
          )
        );
      },
    },
    {
      field: "page_ids",
      headerName: "Page Counts",
      width: 100,
      renderCell: (params) => {
        return params?.row?.page_ids
          ? params.row?.page_ids.split(",").length
          : 0;
      },
    },
    contextData && {
      field: "payment_type",
      headerName: "Payment Status",
      width: 150,
    },
    contextData && {
      field: "payment_status_show",
      headerName: "Credit Status",
      width: 150,
    },
    contextData
      ? {
          field: "actions",
          type: "actions",
          headerName: "Actions",
          width: 500,
          cellClassName: "actions",
          getActions: (params) => {
            const { id, row } = params;
            const executionStatus = row?.execution_status;

            if (executionStatus == "sent_for_execution") {
              return [
                <div className="icon-1">
                  <GridActionsCellItem
                    key={id}
                    icon={<PointOfSaleTwoToneIcon />}
                    onClick={() =>
                      handleClickOpenPaymentDetailDialog(params.row)
                    }
                    color="inherit"
                    title="Payment Detail"
                  />
                </div>,
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      onClick={handleViewClick(id)}
                      color="inherit"
                      title="Record Service Detail"
                    />
                  </div>
                </Link>,

                <GridActionsCellItem
                  key={id}
                  icon={
                    <Button className="btn btn_sm cmnbtn" variant="outlined">
                      Accept
                    </Button>
                  }
                  onClick={() => handleAccept(row)}
                  color="inherit"
                />,

                <GridActionsCellItem
                  key={id}
                  icon={
                    <ExecutionUpdate
                      setReload={setReload}
                      id={id}
                      rowData={row}
                      status={3}
                    />
                  }
                  color="inherit"
                />,
                <Button
                  variant="outlined"
                  onClick={handleRowHold(row, 5)}
                  className="btn btn_sm cmnbtn"
                  color="warning"
                >
                  Hold
                </Button>,
              ];
            } else if (executionStatus == "execution_accepted") {
              return [
                <div className="icon-1">
                  <GridActionsCellItem
                    key={id}
                    icon={<PointOfSaleTwoToneIcon />}
                    onClick={() =>
                      handleClickOpenPaymentDetailDialog(params.row)
                    }
                    color="inherit"
                    title="Payment Detail"
                  />
                </div>,
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      onClick={handleViewClick(id)}
                      color="inherit"
                      title="Record Service Detail"
                    />
                  </div>
                </Link>,
                <GridActionsCellItem
                  key={id}
                  icon={
                    <ExecutionUpdate
                      setReload={setReload}
                      id={id}
                      rowData={row}
                      status={1}
                    />
                  }
                  label="Delete"
                  onClick={() => handleDone(row)}
                  color="inherit"
                />,
                <Button
                  variant="outlined"
                  onClick={handleRowHold(row, 6)}
                  className="btn btn_sm cmnbtn"
                  color="warning"
                >
                  Hold
                </Button>,
              ];
            } else if (executionStatus == "execution_paused") {
              return [
                <div className="icon-1">
                  <GridActionsCellItem
                    key={id}
                    icon={<PointOfSaleTwoToneIcon />}
                    onClick={handleClickOpenPaymentDetailDialog}
                    color="inherit"
                  />
                </div>,
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      onClick={handleViewClick(id)}
                      color="inherit"
                    />
                  </div>
                </Link>,
                <Button
                  variant="outlined"
                  onClick={handleReleaseRow(row)}
                  className="btn btn_sm cmnbtn"
                  color="success"
                >
                  Release
                </Button>,
              ];
            } else if (executionStatus == "execution_completed") {
              return [
                <div className="icon-1">
                  <GridActionsCellItem
                    key={id}
                    icon={<PointOfSaleTwoToneIcon />}
                    onClick={handleClickOpenPaymentDetailDialog}
                    color="inherit"
                  />
                </div>,
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      onClick={handleViewClick(id)}
                      color="inherit"
                    />
                  </div>
                </Link>,
                <Button
                  key={`${id}-update`}
                  variant="outlined"
                  onClick={(e) => handleOpenCaseStudyDialog(e, row)}
                  className="btn btn_sm cmnbtn"
                  color="success"
                >
                  Update
                </Button>,
              ];
            } else {
              return [
                <div className="icon-1">
                  <GridActionsCellItem
                    key={id}
                    icon={<PointOfSaleTwoToneIcon />}
                    onClick={handleClickOpenPaymentDetailDialog}
                    color="inherit"
                  />
                </div>,
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      onClick={handleViewClick(id)}
                      color="inherit"
                    />
                  </div>
                </Link>,
              ];
            }
          },
        }
      : {
          field: "actions",
          type: "actions",
          headerName: "Actions",
          width: 300,
          cellClassName: "actions",
          getActions: (params) => {
            const { id, row } = params;
            const executionStatus = row.execution_status;

            if (executionStatus == "sent_for_execution") {
              return [
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      onClick={handleViewClick(id)}
                      color="inherit"
                    />
                  </div>
                </Link>,
                <GridActionsCellItem
                  key={id}
                  icon={
                    <ExecutionUpdate
                      setReload={setReload}
                      id={id}
                      rowData={row}
                      status={4}
                    />
                  }
                  color="inherit"
                />,
                <GridActionsCellItem
                  key={id}
                  icon={
                    <Button variant="outlined" className="btn btn_sm cmnbtn">
                      Accept
                    </Button>
                  }
                  onClick={() => handleAccept(row)}
                  color="inherit"
                />,
              ];
            } else if (executionStatus == "execution_accepted") {
              return [
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      label="Delete"
                      onClick={handleViewClick(id)}
                      color="inherit"
                    />
                  </div>
                </Link>,
                <GridActionsCellItem
                  key={id}
                  icon={
                    <ExecutionUpdate
                      setReload={setReload}
                      id={id}
                      rowData={row}
                      status={1}
                    />
                  }
                  label="Delete"
                  onClick={() => handleDone(row)}
                  color="inherit"
                />,
              ];
            } else {
              return [
                <Link key={id} to={`/admin/exeexecution/${id}`}>
                  <div className="icon-1">
                    <GridActionsCellItem
                      icon={<ListAltOutlinedIcon />}
                      onClick={handleViewClick(id)}
                      color="inherit"
                    />
                  </div>
                </Link>,
              ];
            }
          },
        },
  ];
  return (
    <>
      {confirmation && (
        <Confirmation
          rowData={rowData}
          value={new Date()}
          status={executionStatus ? (executionStatus == 2 ? 2 : 3) : 3}
          setReload={setReload}
          confirmation={confirmation}
          setSnackbar={setSnackbar}
          setConfirmation={setConfirmation}
          type={
            executionStatus
              ? executionStatus == 2
                ? "Accept"
                : "Reject"
              : "Reject"
          }
        />
      )}
      <ThemeProvider theme={theme}>
        <div>
          <FormContainer mainTitle={"Execution Pending Summary"} link={true} />
          <ButtonGroup aria-label="Basic button group">
            <Button
              variant="outlined"
              sx={{ m: 1 }}
              onClick={() => navigate("/admin/exeexecution/pending")}
              disabled
            >
              Pending
            </Button>
            <Button
              variant="outlined"
              sx={{ m: 1 }}
              onClick={() => navigate("/admin/exeexecution/done")}
            >
              Executed
            </Button>
            <Button
              variant="outlined"
              sx={{ m: 1 }}
              onClick={() => navigate("/admin/exeexecution/rejected")}
            >
              Rejected
            </Button>
          </ButtonGroup>

          <div className="thm_table card body-padding fx-head thm_row">
            <form
              onSubmit={(e) => handleMultipleVerification(e)}
              className="d-flex"
            >
              <input
                type="text"
                placeholder="Enter Token"
                className="w-25 form-control"
                value={multipleToken}
                onChange={(e) => setMultipleToken(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="btn btn_sm cmnbtn ml-2 mt-1"
                size="large"
              >
                Add
              </Button>
            </form>

            <div className="d-flex">
              <Button
                className={(isActive) => {
                  return isActive ? "disabled" : "";
                }}
                onClick={() => {
                  executionAPI("sent_for_execution");
                }}
              >
                Pending {totalExecutionCounts?.sent_for_execution}
              </Button>
              <Button
                onClick={() => {
                  executionAPI("execution_accepted");
                }}
              >
                In Progress {totalExecutionCounts?.execution_accepted}
              </Button>
              <Button
                onClick={() => {
                  executionAPI("execution_completed");
                }}
              >
                Completed {totalExecutionCounts?.execution_completed}
              </Button>
              <Button
                onClick={() => {
                  executionAPI("execution_rejected");
                }}
              >
                Rejected {totalExecutionCounts?.execution_rejected}
              </Button>
              <Button
                onClick={() => {
                  executionAPI("execution_paused");
                }}
              >
                Hold {totalExecutionCounts?.execution_paused}
              </Button>
              <Button
                onClick={() => {
                  executionAPI(false);
                }}
              >
                Case Study Close{" "}
              </Button>
            </div>

            <DataGrid
              rows={addSerialNumber(saimyualCamp)}
              columns={columns}
              getRowId={(row) => row?._id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            ></DataGrid>
          </div>
        </div>
      </ThemeProvider>
      <PaymentDetailDailog
        handleClickOpenPaymentDetailDialog={handleClickOpenPaymentDetailDialog}
        handleClosePaymentDetailDialog={handleClosePaymentDetailDialog}
        openPaymentDetailDialog={openPaymentDetailDialog}
        paymentDialogDetails={paymentDialogDetails}
      />
      <CaseStudyOpenUpdate
        setCaseStudyDialog={setCaseStudyDialog}
        caseStudyDialog={caseStudyDialog}
        caseStudyOpenRowData={caseStudyOpenRowData}
        readOnlyAccountsData={readOnlyAccountsData}
      />

      <Dialog
        fullWidth={"sm"}
        maxWidth={"sm"}
        open={holdDialog}
        onClose={handleClose}
      >
        <DialogTitle>PLEASE ENTER THE REASON FOR HOLD</DialogTitle>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <TextField
                multiline
                rows={2}
                columns={5}
                variant="outlined"
                placeholder="Enter Reason"
                onChange={(e) => setReason(e.target.value)}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHoldSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ExecutionPending;
