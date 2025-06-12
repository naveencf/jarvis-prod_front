import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import FormContainer from "../AdminPanel/FormContainer";
import { useGlobalContext } from "../../Context/Context";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DataTable from "react-data-table-component";
import {
  Autocomplete,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { baseUrl } from "../../utils/config";
import ImageView from "./ImageView";
import pdfImg from "./pdf-file.png";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import jwtDecode from "jwt-decode";

const ApprovedList = () => {
  const { toastAlert } = useGlobalContext();
  const [displaySeq, setDisplaySeq] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [requestedBy, setRequestedBy] = useState("");
  const [custName, setCustName] = useState("");
  const [paymentAmountFilter, setPaymentAmountFilter] = useState();
  const [paymentAmountField, setPaymentAmountField] = useState();
  const [paymentMode, setPaymetMode] = useState("");
  const [status, setStatus] = useState();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymetMethod, setPaymetMethod] = useState([]);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [viewImgDialog, setViewImgDialog] = useState(false);
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [sameCustomerData, setSameCustomerData] = useState([]);
  const [dateFilter, setDateFilter] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  function getData() {
    axios
      .get(baseUrl + "sales/payment_update?status=approval", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const sortedApprovedStatus = res?.data?.data?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setData(sortedApprovedStatus);
        setFilterData(sortedApprovedStatus);

        const uniqueCustomers = new Set(
          sortedApprovedStatus.map((item) => item.account_name)
        );
        setUniqueCustomerCount(uniqueCustomers.size);
        const uniqueCustomerData = Array.from(uniqueCustomers).map(
          (customerName) => {
            return sortedApprovedStatus.find(
              (item) => item.account_name === customerName
            );
          }
        );
        setUniqueCustomerData(uniqueCustomerData);

        const dateFilterData = filterDataBasedOnSelection(sortedApprovedStatus);
        setFilterData(dateFilterData);
      });

    axios
      .get(baseUrl + "sales/payment_mode", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPaymetMethod(res.data.data);
      });
  }

  function convertDateToDDMMYYYY(dateString) {
    if (String(dateString).startsWith("0000-00-00")) {
      return " ";
    }
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    if (day == "NaN" || month == "NaN" || year == "NaN") {
      return " ";
    } else {
      return `${day}/${month}/${year}`;
    }
  }

  const handleCopyDetail = (detail) => {
    navigator.clipboard.writeText(detail);
  };

  useEffect(() => {
    getData();
  }, [dateFilter]);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.assetsName?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleFilter = () => {
    const result = datas
      .map((d, index) => ({
        ...d,
        key: index,
      }))
      .filter((d) => {
        const matchesUser =
          !requestedBy ||
          (d.sales_executive_name &&
            d.sales_executive_name
              .toLowerCase()
              ?.includes(requestedBy?.toLowerCase()));

        const matchesCust =
          !custName ||
          (d.account_name &&
            d.account_name.toLowerCase()?.includes(custName.toLowerCase()));

        const paymentAmountFilterPassed = () => {
          const paymentAmount = parseFloat(paymentAmountField);
          switch (paymentAmountFilter) {
            case "greaterThan":
              return +d.payment_amount > paymentAmount;
            case "lessThan":
              return +d.payment_amount < paymentAmount;
            case "equalTo":
              return +d.payment_amount === paymentAmount;
            default:
              return true;
          }
        };
        const matchesMode =
          !paymentMode ||
          paymetMethod
            ?.filter((modeData) => modeData._id === d.payment_mode)
            .some((modeData) =>
              modeData.payment_mode_name
                .toLowerCase()
                .includes(paymentMode.toLowerCase())
            );
        const matchesStatus = status
          ? d.payment_approval_status === status.title
          : true;

        const dateMatch = (date, fromDate, toDate) => {
          const dateToCheck = new Date(date);
          const startDate = new Date(fromDate);
          const endDate = new Date(toDate);
          return (
            (dateToCheck.getTime() >= startDate.getTime() &&
              dateToCheck.getTime() <= endDate.getTime()) ||
            !fromDate ||
            !toDate
          );
        };

        return (
          matchesUser &&
          matchesCust &&
          matchesMode &&
          matchesStatus &&
          dateMatch(d.payment_date, fromDate, toDate) &&
          paymentAmountFilterPassed()
        );
      });

    setFilterData(result);

    const uniqueCustomers = new Set(result?.map((item) => item.account_name));
    setUniqueCustomerCount(uniqueCustomers.size);
    const uniqueCustomerData = Array.from(uniqueCustomers).map(
      (customerName) => {
        return result.find((item) => item.account_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);
  };

  const handleClear = () => {
    setRequestedBy("");
    setCustName("");
    setPaymentAmountFilter("");
    setPaymentAmountField("");
    setPaymetMode("");
    setStatus("");
    setFromDate("");
    setToDate("");
    setFilterData(datas);

    const uniqueCustomers = new Set(datas.map((item) => item.account_name));
    setUniqueCustomerCount(uniqueCustomers.size);
    const uniqueCustomerData = Array.from(uniqueCustomers).map(
      (customerName) => {
        return datas.find((item) => item.account_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);
  };

  const handleOpenUniqueCustomerClick = () => {
    setUniqueCustomerDialog(true);
  };

  const handleCloseUniqueCustomer = () => {
    setUniqueCustomerDialog(false);
  };

  const handleOpenSameCustomer = (custName) => {
    setSameCustomerDialog(true);

    const sameNameCustomers = datas.filter(
      (item) => item?.account_name === custName
    );

    // Set the selected vendor data including the vendor name, data, and total amount
    setSameCustomerData(sameNameCustomers);
  };

  const handleCloseSameCustomer = () => {
    setSameCustomerDialog(false);
  };

  const requestedAmountTotal = filterData?.reduce(
    (total, item) => total + parseFloat(item.payment_amount) || 0,
    0
  );

  // Counts According to status:-
  const approvedCount = filterData.filter(
    (item) => item.payment_approval_status === "approval"
  )?.length;

  const sameCustomerColumn = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: ({ row }) => <div>{filterData?.indexOf(row) + 1}</div>,
      width: 70,
    },
    {
      headerName: "Requested By",
      field: "created_by_name",
      renderCell: (params) => <div>{params.row.created_by_name} </div>,
      width: 160,
    },
    {
      headerName: " Account Name",
      field: "account_name",
      renderCell: (params) => <div>{params.row.account_name}</div>,
      width: 160,
    },
    {
      headerName: "Campaign Amount",
      field: "campaign_amount",
      renderCell: (params) => <div>{params.row.campaign_amount} </div>,
      width: 80,
    },
    {
      field: "base_amount",
      headerName: "Campaign Amount Without Gst",
      renderCell: (params) => params.row.base_amount,
      // width: 160,
    },
    {
      field: "balance_payment_ondate",
      headerName: "Payment On Date",
      width: 180,
      renderCell: (params) => (
        <div>
          {moment(params.row.balance_payment_ondate).format("DD/MM/YYYY HH:MM")}
        </div>
      ),
    },
    {
      headerName: "Payment Amount",
      field: "payment_amount",
      renderCell: (params) => params.row.payment_amount,
      // width: 160,
    },
    {
      headerName: " Payment Mode",
      field: "payment_mode_name",
      width: 160,
      renderCell: (params) => {
        const ModeData = paymetMethod.find(
          (data) => data._id === params.row.payment_mode
        );
        return <div>{ModeData?.payment_mode_name}</div>;
      },
    },
    {
      field: "Screenshot",
      headerName: "Screenshot",
      renderCell: (params) =>
        params.row.payment_screenshot ? (
          <div
            onClick={() => {
              setViewImgSrc(
                params.row.payment_screenshot
                  ? params.row.payment_screenshot
                  : ""
              ),
                setViewImgDialog(true);
            }}
            style={{ whiteSpace: "normal" }}
          >
            <img
              src={
                params.row.payment_screenshot
                  ? pdfImg
                  : params.row.payment_screenshot
              }
            //   row.payment_screenshot
            //     ? `https://sales.creativefuel.io/${row.payment_screenshot}`
            //     : ""
            // }
            />
          </div>
        ) : (
          "No Screenshot Available"
        ),
    },
    {
      headerName: "Balance Amount",
      field: "Balance Amount",
      width: 180,
      renderCell: (params) => (
        <div>{params.row.campaign_amount - params.row.payment_amount} </div>
      ),
    },
    {
      headerName: "Bank Name ",
      field: "title",
      width: 180,
      renderCell: (params) => <div>{params.row.payment_detail.title} </div>,
    },
    {
      headerName: "Bank Detail ",
      field: "detail",
      width: 490,
      renderCell: (params) => (
        <div className="flexCenter colGap8">
          <button
            className="btn tableIconBtn btn_sm "
            onClick={() => handleCopyDetail(params.row.payment_detail.details)}
          >
            <ContentCopyIcon />
            {/* or any other icon */}
          </button>
          {params.row.payment_detail.details}
        </div>
      ),
      // width: 150,
    },
    {
      headerName: "Reference No",
      field: "payment_ref_no",
      renderCell: (params) => params.row.payment_ref_no,
      width: 160,
    },
    {
      headerName: "Remarks",
      field: "remarks",
      renderCell: (params) => params.row.remarks,
      width: 160,
    },
    {
      headerName: "Status",
      field: "payment_approval_status",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {params.row.payment_approval_status === "approval"
            ? "Approved"
            : params.row.payment_approval_status === "reject"
              ? "Rejected"
              : ""}
        </div>
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      renderCell: (params) => (
        <>
          <Link to={`/admin/payment-summary/${params.row.cust_id}`}>
            <button
              title="Summary"
              className="btn tableIconBtn btn_sm btn-outline-primary user-button"
            >
              <i className="bi bi-journal-text"></i>
            </button>
          </Link>
        </>
      ),
    },
  ];
  const uniqueCustomerColumn = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...uniqueCustomerData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "account_name",
      headerName: "Acocunt Name",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenSameCustomer(params.row.account_name)}
        >
          {params.row.account_name}{" "}
        </div>
      ),
    },
    {
      headerName: "Requested By",
      field: "created_by_name",
      renderCell: (params) => <div>{params.row.created_by_name} </div>,
      width: 160,
    },
    {
      headerName: "Campaign Amount",
      field: "campaign_amount",
      renderCell: (params) => <div>{params.row.campaign_amount} </div>,
      width: 80,
    },
    {
      field: "campaign_base_amountamount_without_gst",
      headerName: "Campaign Amount Without Gst",
      renderCell: (params) => params.row.base_amount,
      // width: 160,
    },
    {
      field: "balance_payment_ondate",
      headerName: "Payment On Date",
      width: 180,
      renderCell: (params) => (
        <div>
          {moment(params.row.balance_payment_ondate).format("DD/MM/YYYY HH:MM")}
        </div>
      ),
    },
    {
      headerName: "Payment Amount",
      field: "payment_amount",
      renderCell: (params) => params.row.payment_amount,
      // width: 160,
    },
    {
      headerName: " Payment Mode",
      field: "payment_mode_name",
      width: 160,
      renderCell: (params) => {
        const ModeData = paymetMethod.find(
          (data) => data._id === params.row.payment_mode
        );
        return <div>{ModeData?.payment_mode_name}</div>;
      },
    },
    {
      field: "Screenshot",
      headerName: "Screenshot",
      renderCell: (params) =>
        params.row.payment_screenshot ? (
          <div
            onClick={() => {
              setViewImgSrc(
                params.row.payment_screenshot
                  ? params.row.payment_screenshot
                  : ""
              ),
                setViewImgDialog(true);
            }}
            style={{ whiteSpace: "normal" }}
          >
            <img
              src={
                params.row.payment_screenshot
                  ? pdfImg
                  : params.row.payment_screenshot
              }
            //   row.payment_screenshot
            //     ? `https://sales.creativefuel.io/${row.payment_screenshot}`
            //     : ""
            // }
            />
          </div>
        ) : (
          "No Screenshot Available"
        ),
    },
    {
      headerName: "Balance Amount",
      field: "Balance Amount",
      width: 180,
      renderCell: (params) => (
        <div>{params.row.campaign_amount - params.row.payment_amount} </div>
      ),
    },
    {
      headerName: "Bank Name ",
      field: "title",
      width: 180,
      renderCell: (params) => <div>{params.row.payment_detail.title} </div>,
    },
    {
      headerName: "Bank Detail ",
      field: "detail",
      width: 490,
      renderCell: (params) => (
        <div className="flexCenter colGap8">
          <button
            className="btn tableIconBtn btn_sm "
            onClick={() => handleCopyDetail(params.row.payment_detail.details)}
          >
            <ContentCopyIcon />
            {/* or any other icon */}
          </button>
          {params.row.payment_detail.details}
        </div>
      ),
      // width: 150,
    },
    {
      headerName: "Reference No",
      field: "payment_ref_no",
      renderCell: (params) => params.row.payment_ref_no,
      width: 160,
    },
    {
      headerName: "Remarks",
      field: "remarks",
      renderCell: (params) => params.row.remarks,
      width: 160,
    },
    {
      headerName: "Status",
      field: "payment_approval_status",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {params.row.payment_approval_status === "approval"
            ? "Approved"
            : params.row.payment_approval_status === "reject"
              ? "Rejected"
              : ""}
        </div>
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      renderCell: (params) => (
        <>
          <Link to={`/admin/payment-summary/${params.row.cust_id}`}>
            <button
              title="Summary"
              className="btn tableIconBtn btn_sm btn-outline-primary user-button"
            >
              <i className="bi bi-journal-text"></i>
            </button>
          </Link>
        </>
      ),
    },
  ];
  const columns = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: ({ row }) => <div>{filterData?.indexOf(row) + 1}</div>,
      width: 70,
    },
    {
      headerName: "Requested By",
      field: "created_by_name",
      renderCell: (params) => <div>{params.row.created_by_name} </div>,
      width: 160,
    },
    {
      headerName: " Account Name",
      field: "account_name",
      renderCell: (params) => <div>{params.row.account_name}</div>,
      width: 160,
    },
    {
      headerName: "Campaign Amount",
      field: "campaign_amount",
      renderCell: (params) => <div>{params.row.campaign_amount} </div>,
      width: 80,
    },
    {
      field: "base_amount",
      headerName: "Campaign Amount Without Gst",
      renderCell: (params) => params.row.base_amount,
      // width: 160,
    },
    {
      field: "balance_payment_ondate",
      headerName: "Payment On Date",
      width: 180,
      renderCell: (params) => (
        <div>
          {moment(params.row.balance_payment_ondate).format("DD/MM/YYYY HH:MM")}
        </div>
      ),
      width: 120,
    },
    {
      headerName: "Payment Amount",
      field: "payment_amount",
      renderCell: (params) => params.row.payment_amount,
      // width: 160,
    },
    {
      headerName: " Payment Mode",
      field: "payment_mode_name",
      width: 160,
      renderCell: (params) => {
        const ModeData = paymetMethod.find(
          (data) => data._id === params.row.payment_mode
        );
        return <div>{ModeData?.payment_mode_name}</div>;
      },
    },
    {
      field: "Screenshot",
      headerName: "Screenshot",
      renderCell: (params) =>
        params.row.payment_screenshot ? (
          <div
            onClick={() => {
              setViewImgSrc(
                params.row.payment_screenshot
                  ? params.row.payment_screenshot
                  : ""
              ),
                setViewImgDialog(true);
            }}
            style={{ whiteSpace: "normal" }}
          >
            <img
              src={
                params.row.payment_screenshot
                  ? pdfImg
                  : params.row.payment_screenshot
              }
            //   row.payment_screenshot
            //     ? `https://sales.creativefuel.io/${row.payment_screenshot}`
            //     : ""
            // }
            />
          </div>
        ) : (
          "No Screenshot Available"
        ),
    },
    {
      headerName: "Balance Amount",
      field: "Balance Amount",
      width: 180,
      renderCell: (params) => (
        <div>{params.row.campaign_amount - params.row.payment_amount} </div>
      ),
    },
    {
      headerName: "Bank Name ",
      field: "title",
      width: 180,
      renderCell: (params) => <div>{params.row.payment_detail.title} </div>,
    },
    {
      headerName: "Bank Detail ",
      field: "detail",
      width: 490,
      renderCell: (params) => (
        <div className="flexCenter colGap8">
          <button
            className="btn tableIconBtn btn_sm "
            onClick={() => handleCopyDetail(params.row.payment_detail.details)}
          >
            <ContentCopyIcon />
            {/* or any other icon */}
          </button>
          {params.row.payment_detail.details}
        </div>
      ),
      // width: 150,
    },
    {
      headerName: "Reference No",
      field: "payment_ref_no",
      renderCell: (params) => params.row.payment_ref_no,
      width: 160,
    },
    {
      headerName: "Remarks",
      field: "remarks",
      renderCell: (params) => params.row.remarks,
      width: 160,
    },
    {
      headerName: "Status",
      field: "payment_approval_status",
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {params.row.payment_approval_status === "approval"
            ? "Approved"
            : params.row.payment_approval_status === "reject"
              ? "Rejected"
              : ""}
        </div>
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      renderCell: (params) => (
        <>
          <Link to={`/admin/payment-summary/${params.row.cust_id}`}>
            <button
              title="Summary"
              className="btn tableIconBtn btn_sm btn-outline-primary user-button"
            >
              <i className="bi bi-journal-text"></i>
            </button>
          </Link>
        </>
      ),
    },
  ];

  const handleApprovedClick = () => {
    const filtered = datas?.filter(
      (item) => item.payment_approval_status === "approval"
    );
    setFilterData(filtered);
  };

  const filterDataBasedOnSelection = (apiData) => {
    const now = moment();
    switch (dateFilter) {
      case "last7Days":
        return apiData.filter((item) =>
          moment(item.payment_date).isBetween(
            now.clone().subtract(7, "days"),
            now,
            "day",
            "[]"
          )
        );
      case "last30Days":
        return apiData.filter((item) =>
          moment(item.payment_date).isBetween(
            now.clone().subtract(30, "days"),
            now,
            "day",
            "[]"
          )
        );
      case "thisWeek":
        const startOfWeek = now.clone().startOf("week");
        const endOfWeek = now.clone().endOf("week");
        return apiData.filter((item) =>
          moment(item.payment_date).isBetween(
            startOfWeek,
            endOfWeek,
            "day",
            "[]"
          )
        );
      case "lastWeek":
        const startOfLastWeek = now
          .clone()
          .subtract(1, "weeks")
          .startOf("week");
        const endOfLastWeek = now.clone().subtract(1, "weeks").endOf("week");
        return apiData.filter((item) =>
          moment(item.payment_date).isBetween(
            startOfLastWeek,
            endOfLastWeek,
            "day",
            "[]"
          )
        );
      case "currentMonth":
        const startOfMonth = now.clone().startOf("month");
        const endOfMonth = now.clone().endOf("month");
        return apiData.filter((item) =>
          moment(item.payment_date).isBetween(
            startOfMonth,
            endOfMonth,
            "day",
            "[]"
          )
        );
      case "nextMonth":
        const startOfNextMonth = now.clone().add(1, "months").startOf("month");
        const endOfNextMonth = now.clone().add(1, "months").endOf("month");
        return apiData.filter((item) =>
          moment(item.payment_date).isBetween(
            startOfNextMonth,
            endOfNextMonth,
            "day",
            "[]"
          )
        );
      case "currentQuarter":
        const quarterStart = moment().startOf("quarter");
        const quarterEnd = moment().endOf("quarter");
        return apiData.filter((item) =>
          moment(item.payment_date).isBetween(
            quarterStart,
            quarterEnd,
            "day",
            "[]"
          )
        );
      default:
        return apiData; // No filter applied
    }
  };

  return (
    <div>
      <FormContainer
        mainTitle="Dashboard"
        link="/admin/finance/finance-alltransaction"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
        uniqueCustomerCount={uniqueCustomerCount}
        totalRequestAmount={requestedAmountTotal}
        // pendingCount={pendingCount}
        approvedCount={approvedCount}
        // rejectedCount={rejectedCount}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        dashboardAdditionalTitles={true}
      />
      {/* Same Customer Dialog */}
      <Dialog
        open={sameCustomerDialog}
        onClose={handleCloseSameCustomer}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Same Accounts</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSameCustomer}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <DataGrid
            rows={sameCustomerData}
            columns={sameCustomerColumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => sameCustomerData.indexOf(row)}
          />
        </DialogContent>
      </Dialog>
      {/* Unique Customer Dialog Box */}
      <Dialog
        open={uniqueCustomerDialog}
        onClose={handleCloseUniqueCustomer}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Unique Accounts</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUniqueCustomer}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <DataGrid
            rows={uniqueCustomerData}
            columns={uniqueCustomerColumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row._id}
          />
        </DialogContent>
      </Dialog>
      <div className="row">
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title w-100 flexCenterBetween">
                Approved
                <Link className="link-primary" onClick={handleApprovedClick}>
                  <span className="iconLink">
                    <i className="bi bi-arrow-up-right"></i>
                  </span>
                </Link>
              </h5>
            </div>
            <div className="card-body">
              <h5 className="mediumText">Total Approval Amount</h5>
              <h4 className="font-weight-bold mt8">
                ₹
                {datas.length > 0
                  ? datas
                    .filter(
                      (item) => item.payment_approval_status == "approval"
                    )
                    .reduce((total, currentItem) => {
                      return total + currentItem.payment_amount * 1;
                    }, 0)
                  : ""}
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Search by filter</h5>
              <div className="flexCenter colGap12">
                <div className="form-group flexCenter colGap8">
                  <label className="w-100 m0">Select Date Range:</label>
                  <select
                    className="form-control form_sm"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="last7Days">Last 7 Days</option>
                    <option value="last30Days">Last 30 Days</option>
                    <option value="thisWeek">This Week</option>
                    <option value="lastWeek">Last Week</option>
                    <option value="currentMonth">Current Month</option>
                    <option value="nextMonth">Next Month</option>
                    <option value="currentQuarter">This Quarter</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body pb4">
              <div className="row thm_form">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Requested By</label>
                    <Autocomplete
                      value={requestedBy}
                      onChange={(event, newValue) => {
                        setRequestedBy(newValue);
                      }}
                      options={Array?.from(
                        new Set(
                          datas?.map((option) => option?.created_by_name || [])
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Payment Mode"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control", // Apply Bootstrap's form-control class
                          }}
                          // Applying inline styles to match Bootstrap's form-control as closely as possible
                          style={{
                            borderRadius: "0.25rem",
                            transition:
                              "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                            "&:focus": {
                              borderColor: "#80bdff",
                              boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Customer Name</label>
                    <Autocomplete
                      value={custName}
                      onChange={(event, newValue) => {
                        setCustName(newValue);
                      }}
                      options={Array.from(
                        new Set(
                          datas?.map((option) => option?.account_name || [])
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Payment Mode"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control", // Apply Bootstrap's form-control class
                          }}
                          // Applying inline styles to match Bootstrap's form-control as closely as possible
                          style={{
                            borderRadius: "0.25rem",
                            transition:
                              "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                            "&:focus": {
                              borderColor: "#80bdff",
                              boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Payment Amount Filter</label>
                    <select
                      value={paymentAmountFilter}
                      className="form-control"
                      onChange={(e) => setPaymentAmountFilter(e.target.value)}
                    >
                      <option value="">Select Amount</option>
                      <option value="greaterThan">Greater Than</option>
                      <option value="lessThan">Less Than</option>
                      <option value="equalTo">Equal To</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Payment Amount</label>
                    <input
                      value={paymentAmountField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setPaymentAmountField(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Payment Mode</label>
                    <Autocomplete
                      value={paymentMode}
                      onChange={(event, newValue) => {
                        setPaymetMode(newValue);
                      }}
                      options={Array?.from(
                        new Set(
                          paymetMethod?.map(
                            (option) => option?.payment_mode_name
                          )
                        )
                      )}
                      getOptionLabel={(option) => (option ? option : "")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Payment Mode"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control", // Apply Bootstrap's form-control class
                          }}
                          // Applying inline styles to match Bootstrap's form-control as closely as possible
                          style={{
                            borderRadius: "0.25rem",
                            transition:
                              "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                            "&:focus": {
                              borderColor: "#80bdff",
                              boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Status</label>
                    <Autocomplete
                      value={status?.title}
                      onChange={(event, newValue) => {
                        setStatus(newValue);
                      }}
                      options={[
                        // { title: "Pending", value: 0 },
                        { title: "approval", value: 1 },
                        { title: "reject", value: 2 },
                      ]}
                      getOptionLabel={(option) =>
                        option?.title === "approval"
                          ? "Approved"
                          : option?.title === "reject"
                            ? "Rejected"
                            : ""
                      }
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            type="text"
                            {...params.inputProps}
                            className="form-control"
                            placeholder="Select Status"
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>From Date</label>
                    <input
                      value={fromDate}
                      className="form-control"
                      type="date"
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>To Date</label>
                    <input
                      value={toDate}
                      className="form-control"
                      type="date"
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="flexCenter colGap16">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFilter}
                  className="btn cmnbtn btn-primary"
                >
                  Search
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClear}
                  className="btn cmnbtn btn-secondary"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card" style={{ height: "600px" }}>
            <div className="card-body thm_table">
              <DataGrid
                rows={filterData?.filter(
                  (data) =>
                    data.payment_approval_status === "approval" ||
                    data.payment_approval_status === "reject"
                )}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                getRowId={(row) => filterData?.indexOf(row)}
              />
            </div>
          </div>
        </div>
      </div>
      {viewImgDialog && (
        <ImageView
          viewImgSrc={viewImgSrc}
          setViewImgDialog={setViewImgDialog}
        />
      )}
    </div>
  );
};

export default ApprovedList;
