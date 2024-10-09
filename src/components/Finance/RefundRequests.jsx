import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import { useGlobalContext } from "../../Context/Context";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import ImageView from "./ImageView";
import { baseUrl } from "../../utils/config";
import {
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import moment from "moment";

const RefundRequests = () => {
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  // const [refundImage, setRefundImage] = useState(null);
  // const [singleRow, setSingleRow] = useState({})
  const [refundImage, setRefundImage] = useState([]);
  const [singleRow, setSingleRow] = useState({});
  const [imageChanged, setImageChanged] = useState(false);
  const [custName, setCustName] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundRequestFromDate, setRefundRequestFromDate] = useState("");
  const [refundRequestToDate, setRefundRequestToDate] = useState("");
  const [refundUpdateFromDate, setRefundUpdateFromDate] = useState("");
  const [refundUpdateToDate, setRefundUpdateToDate] = useState("");
  const [status, setStatus] = useState("");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [sameCustomerData, setSameCustomerData] = useState([]);
  const [dateFilter, setDateFilter] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const uploadImage = async (e, row, index) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_refund_id", row.sale_booking_refund_id);
    formData.append("sale_booking_id", row.sale_booking_id);
    formData.append("refund_files", refundImage[index]);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=refund_payment_upload_file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        res.status === 200 && refundImage.splice(index, 1); // Remove the image from the array
      });

    toastAlert("Data updated");
    setIsFormSubmitted(true);
  };

  const handleFileChange = (e, index) => {
    const newRefundImage = [...refundImage]; // Creating a new array
    newRefundImage[index] = e.target.files[0]; // Updating the specific index
    setRefundImage(newRefundImage); // Setting the new array as the state
    setImageChanged(!imageChanged); // Toggle the state to trigger re-render
  };

  const handleStatusChange = async (row, selectedStatus) => {
    setStatus(selectedStatus);

    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_refund_id", row.sale_booking_refund_id);
    formData.append("sale_booking_id", row.sale_booking_id);
    formData.append("refund_approval_status", selectedStatus);
    formData.append("refund_reason", "");
    formData.append("refund_finance_approval", 1);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=refund_finance_approval",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        getData();
      });

    toastAlert("Data updated");
    setIsFormSubmitted(true);
  };

  const handleClear = () => {
    setCustName("");
    setRefundAmount("");
    setRefundRequestFromDate("");
    setRefundRequestToDate("");
    setRefundUpdateFromDate("");
    setRefundUpdateToDate("");
    setFilterData(datas);
  };

  const handleFilter = async () => {
    const result = datas
      .map((d, index) => ({
        ...d,
        key: index,
      }))
      .filter((d) => {
        const matchesCust =
          !custName ||
          (d.cust_name &&
            d.cust_name.toLowerCase().includes(custName.toLowerCase()));
        const matchesAmount =
          refundAmount === "" ||
          (d.refund_amount && Number(d.refund_amount) === Number(refundAmount));

        // const matchesStatus = status
        //   ? d.payment_approval_status === status.value
        //   : true;
        const refundRequestDate = (date, fromDate, toDate) => {
          const dateToCheck = new Date(date);
          const startDate = new Date(refundRequestFromDate);
          const endDate = new Date(refundRequestToDate);
          return (
            (dateToCheck.getTime() >= startDate.getTime() &&
              dateToCheck.getTime() <= endDate.getTime()) ||
            !fromDate ||
            !toDate
          );
        };
        const refundUpdateDate = (date, fromDate, toDate) => {
          const dateToCheck = new Date(date);
          const startDate = new Date(fromDate);
          const endDate = new Date(refundUpdateToDate);
          return (
            (dateToCheck.getTime() >= startDate.getTime() &&
              dateToCheck.getTime() <= endDate.getTime()) ||
            !fromDate ||
            !toDate
          );
        };

        return (
          matchesCust &&
          matchesAmount &&
          refundRequestDate(
            d.creation_date,
            refundRequestFromDate,
            refundRequestToDate
          ) &&
          refundUpdateDate(
            d.last_updated_date,
            refundUpdateFromDate,
            refundUpdateToDate
          )
        );
      });
    setFilterData(result);
  };

  function getData() {
    axios
      .post(baseUrl + "add_php_payment_refund_data_in_node")
      .then((res) => {});
    setTimeout(() => {
      axios.get(baseUrl + "get_all_php_payment_refund_data").then((res) => {
        setData(res.data.data);
        setFilterData(res.data.data);
        const custData = res.data.data;
        const uniqueCustomers = new Set(custData.map((item) => item.cust_name));
        setUniqueCustomerCount(uniqueCustomers.size);
        const uniqueCustomerData = Array.from(uniqueCustomers).map(
          (customerName) => {
            return custData.find((item) => item.cust_name === customerName);
          }
        );
        setUniqueCustomerData(uniqueCustomerData);

        const dateFilterData = filterDataBasedOnSelection(res.data.data);
        setFilterData(dateFilterData);
      });
    }, 1500);
  }

  function convertDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    getData();
  }, [dateFilter]);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.cust_name?.toLowerCase().match(search.toLowerCase());
    });

    setFilterData(result);
  }, [search]);

  const handleOpenUniqueCustomerClick = () => {
    setUniqueCustomerDialog(true);
  };

  const handleCloseUniqueCustomer = () => {
    setUniqueCustomerDialog(false);
  };

  const handleOpenSameCustomer = (custName) => {
    setSameCustomerDialog(true);

    const sameNameCustomers = datas.filter(
      (item) => item.cust_name === custName
    );
    // Calculate the total amount for vendors with the same name
    // const totalAmount = sameNameVendors.reduce(
    //   (total, item) => total + item.request_amount,
    //   0
    // );

    // Set the selected vendor data including the vendor name, data, and total amount
    setSameCustomerData(sameNameCustomers);
  };

  const handleCloseSameCustomer = () => {
    setSameCustomerDialog(false);
  };

  const calculateRequestedAmountTotal = () => {
    let totalAmount = 0;
    filterData.forEach((customer) => {
      totalAmount += parseFloat(customer.refund_amount);
    });
    return totalAmount;
  };

  // Call the function to get the total sum of requested amount
  const refundAmountTotal = calculateRequestedAmountTotal();

  // All counts :-
  const approvedCount = datas.filter(
    (item) => item.finance_refund_status === 1
  ).length;
  const rejectedCount = datas.filter(
    (item) => item.finance_refund_status === 2
  ).length;

  const handleApprovedFilter = () => {
    const filtered = datas.filter((item) => item.finance_refund_status === 1);
    setFilterData(filtered);
  };

  const handleRejectedFilter = () => {
    const filtered = datas.filter((item) => item.finance_refund_status === 2);
    setFilterData(filtered);
  };

  const sameCustomercolumn = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...sameCustomerData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
      sortable: true,
      renderCell: (params) => <div>{params.row.cust_name} </div>,
    },
    {
      field: "refund_amount",
      headerName: "Refund Amount",
      renderCell: (params) => <div>{params.row.refund_amount} </div>,
    },
    {
      field: "finance_refund_reason",
      headerName: "Refund Request Reason",
      renderCell: (params) => <div>{params.row.finance_refund_reason} </div>,
    },
    {
      field: "creation_date",
      headerName: "Refund Request Date",
      renderCell: (params) => (
        <div>{convertDateToDDMMYYYY(params.row.creation_date)}</div>
      ),
    },
    {
      field: "last_updated_date",
      headerName: "Refund Updated Date",
      renderCell: (params) => (
        <div>{convertDateToDDMMYYYY(params.row.last_updated_date)} </div>
      ),
    },
  ];

  const uniqueCustomercolumn = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...uniqueCustomerData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
      sortable: true,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenSameCustomer(params.row.cust_name)}
        >
          {params.row.cust_name}{" "}
        </div>
      ),
    },
    {
      field: "refund_amount",
      headerName: "Refund Amount",
      renderCell: (params) => <div>{params.row.refund_amount} </div>,
    },
    {
      field: "finance_refund_reason",
      headerName: "Refund Request Reason",
      renderCell: (params) => <div>{params.row.finance_refund_reason} </div>,
    },
    {
      field: "creation_date",
      headerName: "Refund Request Date",
      renderCell: (params) => (
        <div>{convertDateToDDMMYYYY(params.row.creation_date)}</div>
      ),
    },
    {
      field: "last_updated_date",
      headerName: "Refund Updated Date",
      renderCell: (params) => (
        <div>{convertDateToDDMMYYYY(params.row.last_updated_date)} </div>
      ),
    },
    {
      headerName: "Refund Payment Image",
      renderCell: (params, index) => (
        <>
          {params.row.finance_refund_status === 0 && (
            <form method="POST" encType="multipart/form-data" action="">
              <input
                type="file"
                name="refund_image"
                onChange={(e) => {
                  //   refundImage.splice(index, 1, e.target.files[0]);
                  //   setImageChanged(!imageChanged); // Toggle the state to trigger re-render
                  handleFileChange(e, index);
                }}
              />
              <br />
              <input
                type="submit"
                value="upload"
                key={index}
                disabled={!refundImage[index] ? true : false}
                onClick={(e) => {
                  setSingleRow(params.row);
                  uploadImage(e, params.row, index);
                }}
              />
            </form>
          )}
        </>
      ),
    },
    {
      fieldName: "Refund Payment Image",
      renderCell: (params, index) => (
        <>
          {params.row.refund_files && (
            <button
              className="btn cmnbtn btn_sm btn-outline-primary"
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(
                  `https://sales.creativefuel.io/${params.row.refund_files}`
                );
              }}
            >
              View
            </button>
          )}
        </>
      ),
    },
    {
      field: "Action",
      renderCell: (params) => (
        <div>
          {" "}
          {params.row.finance_refund_status == 0 && (
            <>
              <select
                className="form-control"
                value={params.row.statusDropdown}
                onChange={(e) => handleStatusChange(params.row, e.target.value)}
              >
                <option value="">Select</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
              </select>
            </>
          )}
          {params.row.finance_refund_status == 1 && (
            <div className="text-success btn">Approved</div>
          )}
          {params.row.finance_refund_status == 2 && (
            <div className="text-danger btn">Rejected</div>
          )}
        </div>
      ),
    },
  ];
  const columns = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...filterData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
      sortable: true,
      width: 150,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenSameCustomer(params.row.cust_name)}
        >
          {params.row.cust_name}{" "}
        </div>
      ),
    },
    {
      field: "refund_amount",
      headerName: "Refund Amount",
      width: 150,
      renderCell: (params) => <div>{params.row.refund_amount} </div>,
    },
    {
      field: "finance_refund_reason",
      headerName: "Refund Request Reason",
      width: 190,
      renderCell: (params) => <div>{params.row.finance_refund_reason} </div>,
    },
    {
      field: "creation_date",
      headerName: "Refund Request Date",
      width: 190,
      renderCell: (params) => (
        <div>{convertDateToDDMMYYYY(params.row.creation_date)}</div>
      ),
    },
    {
      field: "last_updated_date",
      headerName: "Refund Updated Date",
      width: 190,
      renderCell: (params) => (
        <div>{convertDateToDDMMYYYY(params.row.last_updated_date)} </div>
      ),
    },
    {
      field: "Refund Payment Image",
      headerName: "Refund Payment Image",
      renderCell: (params, index) => (
        <>
          {params.row.finance_refund_status === 0 && (
            <form method="POST" encType="multipart/form-data" action="">
              <input
                type="file"
                name="refund_image"
                onChange={(e) => {
                  //   refundImage.splice(index, 1, e.target.files[0]);
                  //   setImageChanged(!imageChanged); // Toggle the state to trigger re-render
                  handleFileChange(e, index);
                }}
              />
              <br />
              <input
                type="submit"
                value="upload"
                key={index}
                disabled={!refundImage[index] ? true : false}
                onClick={(e) => {
                  setSingleRow(params.row);
                  uploadImage(e, params.row, index);
                }}
              />
            </form>
          )}
        </>
      ),
    },
    {
      field: "refund_payment_image",
      headerName: "View Refund Payment Image",
      renderCell: (params, index) => (
        <>
          {params.row.refund_files && (
            <button
              className="btn cmnbtn btn_sm btn-outline-primary"
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(
                  `https://sales.creativefuel.io/${params.row.refund_files}`
                );
              }}
            >
              View
            </button>
          )}
        </>
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      renderCell: (params) => (
        <div>
          {" "}
          {params.row.finance_refund_status == 0 && (
            <>
              <select
                className="form-control"
                value={params.row.statusDropdown}
                onChange={(e) => handleStatusChange(params.row, e.target.value)}
              >
                <option value="">Select</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
              </select>
            </>
          )}
          {params.row.finance_refund_status == 1 && (
            <div className="text-success">Approved</div>
          )}
          {params.row.finance_refund_status == 2 && (
            <div className="text-danger">Rejected</div>
          )}
        </div>
      ),
    },
  ];

  const filterDataBasedOnSelection = (apiData) => {
    const now = moment();
    switch (dateFilter) {
      case "last7Days":
        return apiData.filter((item) =>
          moment(item.creation_date).isBetween(
            now.clone().subtract(7, "days"),
            now,
            "day",
            "[]"
          )
        );
      case "last30Days":
        return apiData.filter((item) =>
          moment(item.creation_date).isBetween(
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
          moment(item.creation_date).isBetween(
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
          moment(item.creation_date).isBetween(
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
          moment(item.creation_date).isBetween(
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
          moment(item.creation_date).isBetween(
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
          moment(item.creation_date).isBetween(
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
        mainTitle="Payment Refund List"
        link="/admin/finance-refundrequests"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
        uniqueCustomerCount={uniqueCustomerCount}
        refundAmountTotal={refundAmountTotal}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        refundReqAdditionalTitles={true}
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
        <DialogTitle>Same Vendors</DialogTitle>
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
            columns={sameCustomercolumn}
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
        <DialogTitle>Unique Customers</DialogTitle>
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
            columns={uniqueCustomercolumn}
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
        {/* <div className="col-md-6 col-sm-12 col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title w-100 flexCenterBetween">
                Pending
                <span className="iconLink">
                  <i className="bi bi-arrow-up-right"></i>
                </span>
              </h5>
            </div>
            <div className="card-body">
              <h5 className="mediumText">Total Pending Amount</h5>
              <h4 className="font-weight-bold mt8">
                ₹
                {datas.length > 0
                  ? datas
                      .filter((item) => item.finance_refund_status == 0)
                      .reduce((total, currentItem) => {
                        return total + currentItem.refund_amount * 1;
                      }, 0)
                  : ""}
              </h4>
            </div>
          </div>
        </div> */}
        <div className="col-md-6 col-sm-12 col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title w-100 flexCenterBetween">
                Approved
                <Link className="link-primary" onClick={handleApprovedFilter}>
                  <span className="iconLink">
                    <i className="bi bi-arrow-up-right"></i>
                  </span>
                </Link>
              </h5>
            </div>
            <div className="card-body">
              <h5 className="mediumText">Total Approved Amount</h5>
              <h4 className="font-weight-bold mt8">
                ₹
                {datas.length > 0
                  ? datas
                      .filter((item) => item.finance_refund_status == 1)
                      .reduce((total, currentItem) => {
                        return total + currentItem.refund_amount * 1;
                      }, 0)
                  : ""}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-12 col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title w-100 flexCenterBetween">
                Rejected
                <Link className="link-primary" onClick={handleRejectedFilter}>
                  <span className="iconLink">
                    <i className="bi bi-arrow-up-right"></i>
                  </span>
                </Link>
              </h5>
            </div>
            <div className="card-body">
              <h5 className="mediumText">Total Rejected Amount</h5>
              <h4 className="font-weight-bold mt8">
                ₹
                {datas.length > 0
                  ? datas
                      .filter((item) => item.finance_refund_status == 2)
                      .reduce((total, currentItem) => {
                        return total + currentItem.refund_amount * 1;
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
                    <label>Customer Name</label>
                    <Autocomplete
                      value={custName}
                      onChange={(event, newValue) => setCustName(newValue)}
                      // options={datas.map((option) => option.cust_name)}
                      options={Array.from(
                        new Set(datas.map((option) => option.cust_name))
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="customer Name"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control", // Apply Bootstrap's form-control class
                          }}
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
                    <label>Refund Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      value={refundAmount}
                      // disabled
                      onChange={(e) => {
                        setRefundAmount(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Refund Request From Date </label>
                    <input
                      type="date"
                      className="form-control"
                      value={refundRequestFromDate}
                      onChange={(e) => {
                        setRefundRequestFromDate(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Refund Request To Date </label>
                    <input
                      type="date"
                      className="form-control"
                      value={refundRequestToDate}
                      onChange={(e) => {
                        setRefundRequestToDate(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Refund Update From Date </label>
                    <input
                      type="date"
                      className="form-control"
                      value={refundUpdateFromDate}
                      onChange={(e) => {
                        setRefundUpdateFromDate(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Refund Update To Date </label>
                    <input
                      type="date"
                      className="form-control"
                      value={refundUpdateToDate}
                      onChange={(e) => {
                        setRefundUpdateToDate(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="flexCenter colGap16">
                <Button
                  variant="contained"
                  onClick={handleFilter}
                  className="btn cmnbtn btn-primary "
                >
                  Search
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClear}
                  className="btn cmnbtn btn-secondary"
                >
                  clear
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
                rows={filterData}
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
                getRowId={(row) => filterData.indexOf(row)}
              />
              {openImageDialog && (
                <ImageView
                  viewImgSrc={viewImgSrc}
                  setViewImgDialog={setOpenImageDialog}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundRequests;
