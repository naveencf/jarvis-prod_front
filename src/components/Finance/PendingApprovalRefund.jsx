import React, { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import { useGlobalContext } from "../../Context/Context";
import DataTable from "react-data-table-component";
import { baseUrl } from "../../utils/config";
import { Button, DialogContent } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Autocomplete, TextField, Dialog, DialogTitle } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";

const PendingApprovalRefund = () => {
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [status, setStatus] = useState("");
  const [refundImage, setRefundImage] = useState([]);
  const [singleRow, setSingleRow] = useState({});
  const [imageChanged, setImageChanged] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [salesExecutiveName, setSalesExecutiveName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [refundAmountFilter, setRefundAmountFilter] = useState("");
  const [refundAmountField, setRefundAmountField] = useState("");
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [sameCustomerData, setSameCustomerData] = useState([]);
  const [dateFilter, setDateFilter] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleFileChange = (e, index) => {
    const newRefundImage = [...refundImage]; // Creating a new array
    newRefundImage[index] = e.target.files[0]; // Updating the specific index
    setRefundImage(newRefundImage); // Setting the new array as the state
    setImageChanged(!imageChanged); // Toggle the state to trigger re-render
  };

  const convertDateToDDMMYYYY = (date) => {
    const d = new Date(date);
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    return `${da}-${mo}-${ye}`;
  };

  function getData() {
    axios.post(baseUrl + "add_php_payment_refund_data_in_node").then((res) => {
      axios
        .get(baseUrl + "get_all_php_payment_refund_data_pending")
        .then((res) => {
          setData(res.data.data);
          setFilterData(res.data.data);
          const custData = res.data.data;
          const uniqueCustomers = new Set(
            custData.map((item) => item.cust_name)
          );
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
    });
  }
  useEffect(() => {
    getData();
  }, [dateFilter]);

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
        setTimeout(() => {
          getData();
        }, 1000);
      });

    toastAlert("Data updated");
    setIsFormSubmitted(true);
  };

  const uploadImage = async (e, row, index) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_refund_id", row.sale_booking_refund_id);
    formData.append("sale_booking_id", row.sale_booking_id);
    formData.append("refund_files", e.target.files[0]);

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

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.cust_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleAllFilter = () => {
    const filterData = datas.filter((item) => {
      const date = new Date(item.creation_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);

      // Refund Date Filter:-
      const refundDateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);

      // Vender Name Filter
      const customerNameFilterPassed =
        !customerName ||
        item.cust_name.toLowerCase().includes(customerName.toLowerCase());
      // Search Query Filter
      const searchFilterPassed =
        !search ||
        Object.values(item).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(search.toLowerCase())
        );

      // Refund Amount Filter
      const refundAmountFilterPassed = () => {
        const numericRefundAmount = parseFloat(refundAmountField);
        switch (refundAmountFilter) {
          case "greaterThan":
            return +item.refund_amount > numericRefundAmount;
          case "lessThan":
            return +item.refund_amount < numericRefundAmount;
          case "equalTo":
            return +item.refund_amount === numericRefundAmount;
          default:
            return true;
        }
      };

      const allFiltersPassed =
        refundDateFilterPassed &&
        customerNameFilterPassed &&
        searchFilterPassed &&
        refundAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);
  };

  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setCustomerName("");
    setRefundAmountFilter("");
    setRefundAmountField("");
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
    uniqueCustomerData.forEach((customer) => {
      totalAmount += parseFloat(customer.refund_amount);
    });
    return totalAmount;
  };
  const refundAmountTotal = filterData.reduce(
    (total, item) => total + parseFloat(item.refund_amount),
    0
  );

  const sameCustomerColumn = [
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
      renderCell: (params) => <div>{params.row.refund_amount} </div>,
    },
    {
      field: "creation_date",
      headerName: "Refund Request Date",
      renderCell: (params) => (
        <div>
          {params.row.creation_date
            ? convertDateToDDMMYYYY(params.row.creation_date)
            : ""}
        </div>
      ),
    },
    {
      headerName: "Refund Payment Image",
      renderCell: (params) => (
        <form method="POST" encType="multipart/form-data" action="">
          <input
            key={index}
            type="file"
            name="refund_image"
            onChange={(e) => {
              // refundImage.splice(index, 1, e.target.files[0]);
              // setRefundImage(refundImage);
              // setImageChanged(!imageChanged); // Toggle the state to trigger re-render
              handleFileChange(e, index);
              uploadImage(e, params.row, index);
            }}
          />
          <br />
          {/* <input
          key={index}
          type="submit"
          value="upload"
          disabled={!refundImage[index] ? true : false}
          onClick={(e) => {
            setSingleRow(row);
            uploadImage(e, row, index);
          }}
        /> */}
        </form>
      ),
    },
    {
      headerName: "Action",
      renderCell: (params, index) => (
        <select
          key={index}
          className="form-control"
          value={params.row.statusDropdown}
          onChange={(e) => handleStatusChange(params.row, e.target.value)}
        >
          <option value="">Select</option>
          <option value="1">Approved</option>
          <option value="2">Rejected</option>
        </select>
      ),
    },
  ];
  const uniqueCustomersColumn = [
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
      renderCell: (params) => <div>{params.row.refund_amount} </div>,
    },
    {
      field: "creation_date",
      headerName: "Refund Request Date",
      renderCell: (params) => (
        <div>
          {params.row.creation_date
            ? convertDateToDDMMYYYY(params.row.creation_date)
            : ""}
        </div>
      ),
    },
    {
      headerName: "Refund Payment Image",
      renderCell: (params) => (
        <form method="POST" encType="multipart/form-data" action="">
          <input
            key={index}
            type="file"
            name="refund_image"
            onChange={(e) => {
              // refundImage.splice(index, 1, e.target.files[0]);
              // setRefundImage(refundImage);
              // setImageChanged(!imageChanged); // Toggle the state to trigger re-render
              handleFileChange(e, index);
              uploadImage(e, params.row, index);
            }}
          />
          <br />
          {/* <input
          key={index}
          type="submit"
          value="upload"
          disabled={!refundImage[index] ? true : false}
          onClick={(e) => {
            setSingleRow(row);
            uploadImage(e, row, index);
          }}
        /> */}
        </form>
      ),
    },
    {
      headerName: "Action",
      renderCell: (params, index) => (
        <select
          key={index}
          className="form-control"
          value={params.row.statusDropdown}
          onChange={(e) => handleStatusChange(params.row, e.target.value)}
        >
          <option value="">Select</option>
          <option value="1">Approved</option>
          <option value="2">Rejected</option>
        </select>
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
      renderCell: (params) => <div>{params.row.refund_amount} </div>,
    },
    {
      field: "creation_date",
      headerName: "Refund Request Date",
      renderCell: (params) => (
        <div>
          {params.row.creation_date
            ? convertDateToDDMMYYYY(params.row.creation_date)
            : ""}
        </div>
      ),
    },
    {
      field: "refund_payment_image",
      headerName: "Refund Payment Image",
      renderCell: (params, index) => (
        <form method="POST" encType="multipart/form-data" action="">
          <input
            key={index}
            type="file"
            name="refund_image"
            onChange={(e) => {
              // refundImage.splice(index, 1, e.target.files[0]);
              // setRefundImage(refundImage);
              // setImageChanged(!imageChanged); // Toggle the state to trigger re-render
              handleFileChange(e, index);
              uploadImage(e, params.row, index);
            }}
          />
          <br />
          {/* <input
          key={index}
          type="submit"
          value="upload"
          disabled={!refundImage[index] ? true : false}
          onClick={(e) => {
            setSingleRow(row);
            uploadImage(e, row, index);
          }}
        /> */}
        </form>
      ),
    },
    {
      field: "refund_approval_status",
      headerName: "Action",
      renderCell: (params, index) => (
        <select
          key={index}
          className="form-control"
          value={params.row.statusDropdown}
          onChange={(e) => handleStatusChange(params.row, e.target.value)}
        >
          <option value="">Select</option>
          <option value="1">Approved</option>
          <option value="2">Rejected</option>
        </select>
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
        link="/admin/finance-pedingapprovalrefund"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
        uniqueCustomerCount={uniqueCustomerCount}
        refundAmountTotal={refundAmountTotal}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        pendingApprovalRefundAdditionalTitles={true}
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
        <DialogTitle>Same Customers</DialogTitle>
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
            columns={uniqueCustomersColumn}
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Customer Name</label>
                    <Autocomplete
                      value={customerName}
                      onChange={(event, newValue) => setCustomerName(newValue)}
                      options={Array.from(
                        new Set(datas.map((option) => option.cust_name))
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Vendor Name"
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
                {/* <div className="col-md-4">
                  <div className="form-group">
                    <label>Sales Executive Name</label>
                    <Autocomplete
                      value={salesExecutiveName}
                      onChange={(event, newValue) => setSalesExecutiveName(newValue)}
                      options={datas.map((option) => option.sale)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Vendor Name"
                          type="text"
                          variant="outlined"
                        />
                      )}
                    />
                  </div>
                </div> */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label>From Date</label>
                    <input
                      value={fromDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        setFromDate(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>To Date</label>
                    <input
                      value={toDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        setToDate(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Request Amount Filter</label>
                    <select
                      value={refundAmountFilter}
                      className="form-control"
                      onChange={(e) => setRefundAmountFilter(e.target.value)}
                    >
                      <option value="">Select Amount</option>
                      <option value="greaterThan">Greater Than</option>
                      <option value="lessThan">Less Than</option>
                      <option value="equalTo">Equal To</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Requested Amount</label>
                    <input
                      value={refundAmountField}
                      type="number"
                      placeholder="Refund Amount"
                      className="form-control"
                      onChange={(e) => {
                        setRefundAmountField(e.target.value);
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
                  onClick={handleAllFilter}
                  className="btn cmnbtn btn-primary"
                >
                  <i className="fas fa-search"></i> Search
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClearAllFilter}
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
          <div className="card">
            <div className="card-body thm_table">
              <DataGrid
                rows={filterData}
                columns={columns}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalRefund;
