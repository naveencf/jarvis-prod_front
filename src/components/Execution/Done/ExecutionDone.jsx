import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { createTheme } from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import { Button } from "@mui/material";
import PaymentDetailDailog from "../PaymentDetailDailog";
import PointOfSaleTwoToneIcon from "@mui/icons-material/PointOfSaleTwoTone";
import { baseUrl } from "../../../utils/config";
import Confirmation from "../Confirmation";
import FormContainer from "../../AdminPanel/FormContainer";
import { ButtonGroup } from "react-bootstrap";

export default function ExecutionDone() {
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [contextData, setContextData] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [openPaymentDetailDialog, setOpenPaymentDetaliDialog] = useState(false);
  const [paymentDialogDetails, setPaymentDialogDetails] = useState([{}]);
  const [rowData, setRowData] = useState([]);
  const [confirmation, setConfirmation] = useState(false);
  const [executionStatus, setExecutionStatus] = useState();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [reload]);

  const handleClickOpenPaymentDetailDialog = (data) => {
    setPaymentDialogDetails(data);
    setOpenPaymentDetaliDialog(true);
  };
  const handleClosePaymentDetailDialog = () => {
    setOpenPaymentDetaliDialog(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (userID && contextData == false) {
        axios
          .get(`${baseUrl}` + `get_single_user_auth_detail/${userID}`)
          .then((res) => {
            if (res.data[26].view_value == 1) {
              setContextData(true);
            }
          });
      }
      const formData = new URLSearchParams();
      formData.append("loggedin_user_id", 36);
      const response = axios
        .get(baseUrl + "get_exe_sum", {
          loggedin_user_id: 52,
        })
        .then((res) => {
          setData(
            res.data.filter((ele) => ele.execution_status == "3").reverse()
          );
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(13, 110, 253)",
      },
    },
  });

  const handleSetPending = (row) => {
    setRowData(row);
    setConfirmation(true);
    setExecutionStatus(4);
  };

  const addSerialNumber = (rows) => {
    return rows.map((row, index) => ({
      ...row,
      S_No: index + 1,
    }));
  };
  const columns = [
    {
      field: "S_No",
      headerName: "S No",
      width: 90,
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
      width: 150,
      renderCell: (params) => {
        if (params.row.execution_status == "3") {
          return (
            <Button
              className="btn btn_sm cmnbtn"
              size="small"
              color="success"
              variant="outlined"
            >
              executed
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
        const startDate = new Date(params.row.start_date);
        const dateOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        };
        const formattedDate = startDate.toLocaleDateString(
          "en-GB",
          dateOptions
        );
        const formattedTime = startDate
          .toISOString()
          .split("T")[1]
          .substring(0, 8);

        if (
          params.row.start_date == "0000-00-00 00:00:00" ||
          params.row.start_date == null ||
          params.row.start_date == undefined
        ) {
          return " ";
        } else {
          return (
            <div>
              <span>{formattedDate}</span> &nbsp;
              <span>{formattedTime}</span>
            </div>
          );
        }
      },
    },

    {
      field: "end_date",
      headerName: "End Date",
      width: 150,
      renderCell: (params) => {
        const startDate = new Date(params.row.end_date);
        const dateOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
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
              className="btn btn_sm cmnbtn"
              size="small"
              color="success"
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
    {
      field: "summary",
      headerName: "Summary",
      type: "number",
      width: 110,
    },

    {
      field: "Time passed",
      headerName: "Time Taken",
      type: "number",
      width: 110,
      renderCell: (params) => {
        let time = Math.abs(
          (new Date(params.row.start_date) - new Date(params.row.end_date)) /
            36e5
        ).toFixed(1);
        return (
          <div>{time.includes(".0") ? time.split(".")[0] : time} hours</div>
        );
      },
    },
    contextData
      ? {
          field: "actions",
          type: "actions",
          headerName: "Actions",
          width: 300,
          cellClassName: "actions",
          getActions: (params) => {
            const id = params.row._id;
            return [
              <div className="icon-1">
                <GridActionsCellItem
                  key={id}
                  icon={<PointOfSaleTwoToneIcon />}
                  onClick={() => handleClickOpenPaymentDetailDialog(params.row)}
                  color="inherit"
                  title="Payment Details"
                />
              </div>,
              <Link key={id} to={`/admin/exeexecution/${id}`}>
                <div className="icon-1">
                  <GridActionsCellItem
                    icon={<ListAltOutlinedIcon />}
                    color="inherit"
                    title="Record Service Detail"
                  />
                </div>
              </Link>,
              <GridActionsCellItem
                key={id}
                icon={
                  <Button className="btn btn_sm cmnbtn" variant="outlined">
                    Set To Pending
                  </Button>
                }
                onClick={() => handleSetPending(params.row)}
                color="inherit"
              />,
            ];
          },
        }
      : {
          field: "actions",
          type: "actions",
          headerName: "Actions",
          width: 300,
          cellClassName: "actions",
          getActions: (params) => {
            const id = params.row._id;
            return [
              <Link key={id} to={`/admin/exeexecution/${id}`}>
                <div className="icon-1">
                  <GridActionsCellItem
                    icon={<ListAltOutlinedIcon />}
                    label="Delete"
                    color="inherit"
                    title="Record Service Detail"
                  />
                </div>
              </Link>,
            ];
          },
        },
  ];

  return (
    <div>
      <FormContainer mainTitle={"Execution Executed Summary"} link={true} />
      <ButtonGroup aria-label="Basic button group">
        <Button
          variant="outlined"
          sx={{ m: 1 }}
          onClick={() => navigate("/admin/exeexecution/pending")}
        >
          Pending
        </Button>
        <Button
          variant="outlined"
          sx={{ m: 1 }}
          onClick={() => navigate("/admin/exeexecution/done")}
          disabled
        >
          {" "}
          Executed
        </Button>
        <Button
          variant="outlined"
          sx={{ m: 1 }}
          onClick={() => navigate("/admin/exeexecution/rejected ")}
        >
          Rejected
        </Button>
      </ButtonGroup>

      <>
        <ThemeProvider theme={theme}>
          <div className="card body-padding thm_table fx-head">
            <DataGrid
              rows={addSerialNumber(data)}
              touchrippleref={false}
              columns={columns}
              getRowId={(row) => row.sale_booking_execution_id}
            />
          </div>
        </ThemeProvider>
        <PaymentDetailDailog
          handleClickOpenPaymentDetailDialog={
            handleClickOpenPaymentDetailDialog
          }
          handleClosePaymentDetailDialog={handleClosePaymentDetailDialog}
          openPaymentDetailDialog={openPaymentDetailDialog}
          paymentDialogDetails={paymentDialogDetails}
        />
      </>
      {confirmation && (
        <Confirmation
          rowData={rowData}
          value={new Date()}
          status={executionStatus}
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
    </div>
  );
}
