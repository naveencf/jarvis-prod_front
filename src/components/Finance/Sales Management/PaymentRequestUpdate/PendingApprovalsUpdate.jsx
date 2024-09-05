import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../../../AdminPanel/FormContainer";
import { useGlobalContext } from "../../../../Context/Context";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import DataTable from "react-data-table-component";
import {
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { get } from "jquery";
import ImageView from "../../ImageView";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { baseUrl } from "../../../../utils/config";
import pdfImg from "../../pdf-file.png";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { set } from "date-fns";
import moment from "moment";
import { useGetPaymentModeQuery } from "../../../Store/API/Finance/FinancePaymentModeApi";
import PendingApprovalStatusDialog from "./Components/PendingApprovalStatusDialog";
import {
  pendingApprovalColumn,
  uniquePendingApprovalCustomerColumn,
  uniquePendingApprovalSalesExecutiveColumn,
} from "../../CommonColumn/Columns";

const PendingApprovalUpdate = () => {
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [status, setStatus] = useState("");
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [viewImgDialog, setViewImgDialog] = useState(false);
  const [AccountName, setAccountName] = useState("");
  const [paymentAmountFilter, setPaymentAmountFilter] = useState("");
  const [paymentAmountField, setPaymentAmountField] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [bankName, setBankName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setcampaignAmountField] = useState("");
  const [paymentMode, setPaymetMode] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [sameCustomerData, setSameCustomerData] = useState([]);
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [nonInvoiceCount, setNonInvoiceCount] = useState(0);
  const [nonGstCount, setNonGstCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [reason, setReason] = useState("");
  const [statusDialog, setStatusDialog] = useState(false);
  const [reasonField, setReasonField] = useState(false);
  const [paymentModeArray, setPaymentModeArray] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const { data: paymentModeData, error: paymentModeError } =
    useGetPaymentModeQuery(datas[0]?.payment_mode, {
      skip: !datas[0]?.payment_mode,
    });

  const handleCopyDetail = (detail) => {
    navigator.clipboard.writeText(detail);
    toastAlert("Detail copied");
  };

  const handleStatusChange = async (row, selectedStatus) => {
    setSelectedRow(row);
    if (selectedStatus) {
      if (selectedStatus === "reject") {
        setStatusDialog(true);
        return;
      }
      const userConfirmed = confirm(
        "Are you sure you want to approve this Payment?"
      );
      if (!userConfirmed) {
        return; // Exit the function if the user cancels the confirmation
      }
      // confirm("Are you sure you want to submit this data?");
      {
        const payload = {
          payment_approval_status: selectedStatus,
          action_reason: reasonField,
          payment_amount: row?.payment_amount,
        };

        await axios
          .put(
            baseUrl + `sales/finance_approval_payment_update/${row?._id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.status === 200) {
              toastAlert("Status Approved Successfully");
            }
          })
          .catch((err) => {
            toastAlert("Status Approval Failed");
          })
          .finally(() => {
            getData();
            setStatus("");
          });
        setStatus(selectedStatus);
        setIsFormSubmitted(true);
      }
    } else {
      setStatus(null);
    }
  };

  const handlePaymentModeData = () => {
    axios
      .get(baseUrl + "sales/payment_mode", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setPaymentModeArray(res?.data?.data);
      })
      .catch((error) =>
        console.log(error, "Error While getting payment mode data")
      );
  };
  const getData = () => {
    setLoading(true);
    axios
      .get(baseUrl + `sales/payment_update?status=pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const resData = res?.data?.data;
        const accData = resData?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setData(accData);
        setFilterData(accData);
        setLoading(false);
        calculateUniqueData(accData);

        const nonGstCount = accData.filter((gst) => gst.gst_status === "false");
        setNonGstCount(nonGstCount.length);

        const withInvoiceImage = accData.filter(
          (item) =>
            item.payment_screenshot && item.payment_screenshot.length > 0
        );
        const withoutInvoiceImage = accData.filter(
          (item) =>
            !item.payment_screenshot || item.payment_screenshot.length === 0
        );
        setInvoiceCount(withInvoiceImage.length);
        setNonInvoiceCount(withoutInvoiceImage.length);

        const dateFilterData = filterDataBasedOnSelection(accData);
        setFilterData(dateFilterData);
      });
  };
  const calculateUniqueData = (sortedData) => {
    const aggregateData = (data, keyName) => {
      return data?.reduce((acc, curr) => {
        const key = curr[keyName];
        if (!acc[key]) {
          acc[key] = {
            ...curr,
            campaign_amount: 0,
            base_amount: 0,
            gst_amount: 0,
            payment_amount: 0,
          };
        }
        acc[key].campaign_amount += curr.campaign_amount;
        acc[key].base_amount += curr.base_amount;
        acc[key].gst_amount += curr.gst_amount;
        acc[key].payment_amount += curr.payment_amount;
        const balanceAmount = curr.campaign_amount - curr.payment_amount;
        acc[key].balance_amount += balanceAmount;
        // params.row.campaign_amount - params.row.payment_amount

        return acc;
      }, {});
    };

    // Aggregate data by account name:-
    const aggregatedAccountData = aggregateData(sortedData, "account_name");
    const uniqueAccData = Object.values(aggregatedAccountData);
    setUniqueCustomerData(uniqueAccData);
    setUniqueCustomerCount(uniqueAccData?.length);

    // Aggregate data by sales executive name :-
    const aggregatedSalesExData = aggregateData(sortedData, "created_by_name");
    const uniqueSalesExData = Object.values(aggregatedSalesExData);
    setUniqueSalesExecutiveData(uniqueSalesExData);
    setUniqueSalesExecutiveCount(uniqueSalesExData?.length);
  };

  useEffect(() => {
    getData();
    handlePaymentModeData();
  }, [dateFilter]);

  useEffect(() => {
    const result = datas?.filter((d) => {
      return d.sales_executive_name?.toLowerCase().match(search?.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  // Filters Logic :-
  const handleAllFilters = () => {
    const filterData = datas?.filter((item) => {
      const date = new Date(item.payment_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      // Date Range Filter:-
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Customer Name Filter:-
      const AccountNameFilterPassed =
        !AccountName ||
        item?.account_name?.toLowerCase().includes(AccountName?.toLowerCase());

      // Requested By Filter
      const requestedByFilterPassed =
        !requestedBy ||
        item?.created_by_name
          ?.toLowerCase()
          .includes(requestedBy?.toLowerCase());
      // Bank Name Filter
      // const bankNameFilterPassed =
      //   !bankName || item.detail.toLowerCase().includes(bankName.toLowerCase());
      // Payment Status
      // const paymentStatusFilterPassed =
      //   !paymentStatus ||
      //   (item.payment_approval_status === 0 &&
      //     paymentStatus.toLowerCase() === "pending") ||
      //   (item.payment_approval_status === 1 &&
      //     paymentStatus.toLowerCase() === "approved") ||
      //   (item.payment_approval_status === 2 &&
      //     paymentStatus.toLowerCase() === "rejected");
      //  Payment Mode
      const pmData =
        paymentModeArray.find((mode) => mode._id === item.payment_mode)
          ?.payment_mode_name || "";

      const paymentModeFilterPassed =
        !paymentMode ||
        pmData?.toLowerCase()?.includes(paymentMode?.toLowerCase());
      //  Payment Amount Filter
      const paymentAmountFilterPassed = () => {
        const paymentAmount = parseFloat(paymentAmountField);
        switch (paymentAmountFilter) {
          case "greaterThan":
            return +item.payment_amount > paymentAmount;
          case "lessThan":
            return +item.payment_amount < paymentAmount;
          case "equalTo":
            return +item.payment_amount === paymentAmount;
          default:
            return true;
        }
      };
      // Campaign Amount filter
      const campaignAmountFilterPassed = () => {
        const campaignAmount = parseFloat(campaignAmountField);
        switch (campaignAmountFilter) {
          case "greaterThan":
            return +item.campaign_amount > campaignAmount;
          case "lessThan":
            return +item.campaign_amount < campaignAmount;
          case "equalTo":
            return +item.campaign_amount === campaignAmount;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        dateFilterPassed &&
        AccountNameFilterPassed &&
        requestedByFilterPassed &&
        // bankNameFilterPassed &&
        // paymentStatusFilterPassed &&
        paymentModeFilterPassed &&
        paymentAmountFilterPassed() &&
        campaignAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);

    const uniqueAccounts = new Set(filterData.map((item) => item.account_name));
    setUniqueCustomerCount(uniqueAccounts.size);
    const uniqueAccountData = Array.from(uniqueAccounts).map((AccName) => {
      return filterData.find((item) => item?.account_name === AccName);
    });
    setUniqueCustomerData(uniqueAccountData);
  };

  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setAccountName("");
    setRequestedBy("");
    setBankName("");
    setPaymentAmountFilter("");
    setPaymentAmountField("");
    setcampaignAmountField("");
    setCampaignAmountFilter("");
    setPaymentStatus("");
    setPaymetMode("");

    const uniqueAccounts = new Set(datas?.map((item) => item.account_name));
    setUniqueCustomerCount(uniqueAccounts.size);
    const uniqueAccountData = Array.from(uniqueAccounts).map((accName) => {
      return datas?.find((item) => item?.account_name === accName);
    });
    setUniqueCustomerData(uniqueAccountData);
  };
  const handleOpenUniqueAccountClick = () => {
    setUniqueCustomerDialog(true);
  };

  const handleCloseUniqueAccountClick = () => {
    setUniqueCustomerDialog(false);
  };
  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const handleCloseUniquesalesExecutive = () => {
    setUniqueSalesExecutiveDialog(false);
  };
  const handleOpenSameAccounts = (accName) => {
    setSameCustomerDialog(true);

    const sameNameCustomers = datas.filter(
      (item) => item?.account_name === accName
    );
    filterData(sameNameCustomers);
    handleCloseUniqueAccountClick();
  };
  const handleOpenSameSalesExecutive = (salesEName) => {
    const sameNameSalesExecutive = datas?.filter(
      (item) => item.created_by_name === salesEName
    );
    setFilterData(sameNameSalesExecutive);
    handleCloseUniquesalesExecutive();
  };
  // Clear Button Action For Table
  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    setFilterData(datas);
  };

  // Call the function to get the total sum of requested amount
  const requestedAmountTotal = filterData?.reduce(
    (total, item) => total + parseFloat(item.payment_amount) || 0,
    0
  );
  // All Counts:-
  const pendingCount = filterData?.filter(
    (item) => item.payment_approval_status === "pending"
  )?.length;

  // monthwise / datewise filter
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
      // case "nextMonth":
      //   const startOfNextMonth = now.clone().add(1, "months").startOf("month");
      //   const endOfNextMonth = now.clone().add(1, "months").endOf("month");
      //   return apiData.filter((item) =>
      //     moment(item.request_date).isBetween(
      //       startOfNextMonth,
      //       endOfNextMonth,
      //       "day",
      //       "[]"
      //     )
      //   );
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
      case "today":
        return apiData.filter((item) =>
          moment(item.creation_date).isSame(now, "day")
        );
      default:
        return apiData;
    }
  };

  const handleCloseStatusDialog = () => {
    setStatusDialog(false);
  };

  return (
    <div>
      <FormContainer
        mainTitle="Pending Approval "
        link="/admin/finance-alltransaction"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
        uniqueCustomerCount={uniqueCustomerCount}
        uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
        totalRequestAmount={requestedAmountTotal}
        pendingCount={pendingCount}
        nonGstCount={nonGstCount}
        invoiceCount={invoiceCount}
        nonInvoiceCount={nonInvoiceCount}
        handleOpenUniqueCustomerClick={handleOpenUniqueAccountClick}
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        pendingApprovalAdditionalTitles={true}
      />

      <PendingApprovalStatusDialog
        statusDialog={statusDialog}
        handleCloseStatusDialog={handleCloseStatusDialog}
        setReasonField={setReasonField}
        reasonField={reasonField}
        rowData={selectedRow}
        getData={getData}
        status={status}
        setStatus={setStatus}
      />

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
                    <option value="today">Today</option>
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
                    <label>Account Name</label>
                    <Autocomplete
                      value={AccountName}
                      onChange={(event, newValue) => setAccountName(newValue)}
                      options={Array.from(
                        new Set(
                          datas?.map((option) => option?.account_name || [])
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Account Name"
                          type="text"
                          style={{ color: "var(--gray-600)" }}
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control", // Apply Bootstrap's form-control class
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Requested By</label>
                    <Autocomplete
                      value={requestedBy}
                      onChange={(event, newValue) => setRequestedBy(newValue)}
                      options={Array.from(
                        new Set(
                          datas.map((option) => option?.created_by_name || [])
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Requested By"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control", // Apply Bootstrap's form-control class
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                {/* <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Bank Name</label>
                    <Autocomplete
                      value={bankName}
                      onChange={(event, newValue) => setBankName(newValue)}
                      options={Array.from(
                        new Set(datas.map((option) => option.detail))
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Bank Name"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control",
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
                </div> */}
                {/* <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Payment Status</label>
                    <Autocomplete
                      value={paymentStatus}
                      onChange={(event, newValue) => setPaymentStatus(newValue)}
                      options={Array.from(
                        new Set(
                          datas.map((option) =>
                            option.payment_approval_status === "pending"
                              ? "Pending"
                              : ""
                          )
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Payment Status"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control", // Apply Bootstrap's form-control class
                          }}
                        />
                      )}
                    />
                  </div>
                </div> */}
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Payment Mode</label>
                    <Autocomplete
                      value={paymentMode}
                      onChange={(event, newValue) => setPaymetMode(newValue)}
                      options={Array?.from(
                        new Set(
                          datas?.map((option) =>
                            option?.payment_mode == paymentModeData?._id
                              ? paymentModeData?.payment_mode_name
                              : "" || []
                          )
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Payment Mode"
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
                    <label>From Date</label>
                    <input
                      value={fromDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
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
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Pay Amount Filter</label>
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
                    <label>Campaign Amount Filter</label>
                    <select
                      value={campaignAmountFilter}
                      className="form-control"
                      onChange={(e) => setCampaignAmountFilter(e.target.value)}
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
                    <label>Campaign Amount</label>
                    <input
                      value={campaignAmountField}
                      type="number"
                      placeholder="Campaign Amount"
                      className="form-control"
                      onChange={(e) => {
                        setcampaignAmountField(e.target.value);
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
                  onClick={handleAllFilters}
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
      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title">Pending Approval</h5>
          <div className="flexCenter colGap12">
            <button
              className="btn cmnbtn btn_sm btn-secondary"
              onClick={(e) => handleClearSameRecordFilter(e)}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="card-body thm_table fx-head data_tbl table-responsive">
          {/* {!loading ? ( */}
          <DataGrid
            rows={filterData}
            columns={pendingApprovalColumn({
              filterData,
              paymentModeArray,
              handleOpenSameAccounts,
              handleCopyDetail,
              statusDialog,
              handleCloseStatusDialog,
              setReasonField,
              reasonField,
              getData,
              status,
              setStatus,
              handleStatusChange,
              setViewImgSrc,
              setViewImgDialog,
            })}
            disableSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => filterData?.indexOf(row)}
          />
          {/* ) : ( */}
          {/* <Skeleton
                  sx={{ bgcolor: "grey.900", borderRadius: "0.25rem" }}
                  variant="rectangular"
                  width="100%"
                  height={200}
                />
              )} */}
          {viewImgDialog && (
            <ImageView
              viewImgSrc={viewImgSrc}
              setViewImgDialog={setViewImgDialog}
            />
          )}
        </div>
      </div>
      {/* Unique Accounts Dialog Box */}
      <Dialog
        open={uniqueCustomerDialog}
        onClose={handleCloseUniqueAccountClick}
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
          onClick={handleCloseUniqueAccountClick}
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
            columns={uniquePendingApprovalCustomerColumn({
              uniqueCustomerData,
              paymentModeArray,
              handleOpenSameAccounts,
              handleCopyDetail,
              statusDialog,
              handleCloseStatusDialog,
              setReasonField,
              reasonField,
              getData,
              status,
              setStatus,
              handleStatusChange,
              handleOpenSameAccounts,
              setViewImgSrc,
              setViewImgDialog,
            })}
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
            getRowId={(row) => row?._id}
          />
        </DialogContent>
      </Dialog>
      {/* Unique Sales Executive Dialog Box */}
      <Dialog
        open={uniqueSalesExecutiveDialog}
        onClose={handleCloseUniquesalesExecutive}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Unique Sales Executive</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUniquesalesExecutive}
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
            rows={uniqueSalesExecutiveData}
            columns={uniquePendingApprovalSalesExecutiveColumn({
              uniqueCustomerData,
              handleOpenSameSalesExecutive,
            })}
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
            getRowId={(row) => row?._id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingApprovalUpdate;
