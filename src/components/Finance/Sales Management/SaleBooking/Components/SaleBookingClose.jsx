import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../../../Context/Context";
import { baseUrl } from "../../../../../utils/config";
import ImageView from "../../../ImageView";
import {
  Autocomplete,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import {
  saleBookingCloseColumns,
  uniqueSaleBookingAccountColumn,
  uniqueSaleBookingSalesExecutiveColumn,
} from "../../../CommonColumn/Columns";
import View from "../../../../AdminPanel/Sales/Account/View/View";
import CommonDialogBox from "../../../CommonDialog/CommonDialogBox";

const SaleBookingClose = ({
  onHandleOpenUniqueSalesExecutiveChange,
  onHandleOpenUniqueCustomerClickChange,
  setButtonaccess,
  setUniquecustomerCount,
  setUniquesalesexecutiveCount,
}) => {
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [salesExecutive, setSalesExecutive] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setcampaignAmountField] = useState("");
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [verifyDialog, setVerifyDialog] = useState(false);
  const [balAmount, setBalAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [row, setRow] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [viewImgDialog, setViewImgDialog] = useState(false);

  const token = sessionStorage.getItem("token");

  const getData = async () => {
    setIsLoading(true);
    await axios
      .get(baseUrl + "sales/sale_booking_tds_status_wise_data?status=close", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const transformedData = res?.data?.data?.reduce((acc, object) => {
          if (object?.salesInvoiceRequestData?.length > 0) {
            const invoices = object?.salesInvoiceRequestData?.map(
              (invoice) => ({
                ...invoice,
                account_id: object.account_id,
                sale_booking_date: object.sale_booking_date,
                campaign_amount: object.campaign_amount,
                base_amount: object.base_amount,
                gst_amount: object.gst_amount,
                tds_status: object.tds_status,
                tds_percentage: object.tds_percentage,
                tds_amount: object.tds_amount,
                tds_verified_amount: object.tds_verified_amount,
                created_by: object.created_by,
                createdAt: object.createdAt,
                updatedAt: object.updatedAt,
                sale_booking_id: object.sale_booking_id,
                account_name: object.account_name,
                created_by_name: object.created_by_name,
                paid_amount: object.paid_amount,
                booking_created_date: object.booking_created_date,
                invoice_file_url: object.invoice_file_url,
              })
            );
            acc?.push(...invoices);
          } else {
            acc?.push({
              ...object,
            });
          }
          return acc;
        }, []);
        const reversedData = transformedData?.reverse();
        console.log(transformedData, "Transformed Data --->>");
        setIsLoading(false);
        setData(reversedData);
        setFilterData(reversedData);
        calculateUniqueData(reversedData);

        const dateFilterData = filterDataBasedOnSelection(reversedData);
        setFilterData(dateFilterData);
      })
      .catch((error) =>
        console.log(error, "Error while getting sale booking data")
      );
  };
  console.log(filterData, "filterData---->>>>", "Transformed Data --->>");

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
            paid_amount: 0,
            tds_amount: 0,
            tds_verified_amount: 0,
            tds_percentage: 0,
          };
        }
        acc[key].campaign_amount += curr.campaign_amount;
        acc[key].base_amount += curr.base_amount;
        acc[key].gst_amount += curr.gst_amount;
        acc[key].paid_amount += curr.paid_amount;
        acc[key].tds_amount += curr.tds_amount;
        acc[key].tds_verified_amount += curr.tds_verified_amount;
        acc[key].tds_percentage =
          (acc[key].tds_verified_amount / acc[key].campaign_amount) * 100;

        return acc;
      }, {});
    };

    // Aggregate data by account name:-
    const aggregatedAccountData = aggregateData(sortedData, "account_name");
    const uniqueAccData = Object.values(aggregatedAccountData);
    setUniqueCustomerData(uniqueAccData);
    setUniquecustomerCount(uniqueAccData?.length);

    // Aggregate data by sales executive name :-
    const aggregatedSalesExData = aggregateData(sortedData, "created_by_name");
    const uniqueSalesExData = Object.values(aggregatedSalesExData);
    setUniqueSalesExecutiveData(uniqueSalesExData);
    setUniquesalesexecutiveCount(uniqueSalesExData?.length);
  };

  useEffect(() => {
    getData();
    setButtonaccess(
      contextData &&
        contextData[2] &&
        contextData[2].insert_value === 1 &&
        false
    );
  }, [dateFilter]);

  // const open = (e) => {
  //   e.preventDefault();
  //   const filteredData = datas.filter((item) => item.tds_status === "open");
  //   setFilterData(filteredData);
  // };

  const close = (e) => {
    e.preventDefault();
    const filteredData = datas?.filter((item) => item);
    setFilterData(filteredData);
  };

  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    setFilterData(datas);
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas?.filter((d) => {
      return d.account_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  // Filters Logic :-
  const handleAllFilters = () => {
    const filterData = datas?.filter((item) => {
      const date = new Date(item.sale_booking_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      // Date Range Filter:-
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Customer Name Filter:-
      const customerNameFilterPassed =
        !customerName ||
        item.account_name.toLowerCase().includes(customerName.toLowerCase());

      // Requested By Filter
      const salesExecutiveFilterPassed =
        !salesExecutive ||
        item.created_by_name
          ?.toLowerCase()
          ?.includes(salesExecutive?.toLowerCase());
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
        customerNameFilterPassed &&
        salesExecutiveFilterPassed &&
        campaignAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);

    const uniqueCustomers = new Set(
      filterData.map((item) => item.account_name)
    );
    setUniqueCustomerCount(uniqueCustomers?.size);
    setUniquecustomerCount(uniqueCustomers?.size);
    const uniqueCustomerData = Array.from(uniqueCustomers)?.map(
      (customerName) => {
        return filterData?.find((item) => item.account_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);
    // For Unique Sales Executive
    const uniqueSalesEx = new Set(
      filterData?.map((item) => item.created_by_name)
    );
    setUniqueSalesExecutiveCount(uniqueSalesEx.size);
    setUniquesalesexecutiveCount(uniqueSalesEx.size);
    const uniqueSEData = Array.from(uniqueSalesEx)?.map((salesEName) => {
      return filterData?.find((item) => item.created_by_name === salesEName);
    });
    setUniqueSalesExecutiveData(uniqueSEData);
  };

  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setCustomerName("");
    setcampaignAmountField("");
    setCampaignAmountFilter("");
    setSalesExecutive("");
    const uniqueCustomers = new Set(datas.map((item) => item.account_name));
    setUniqueCustomerCount(uniqueCustomers?.size);
    setUniquecustomerCount(uniqueCustomers?.size);
    const uniqueCustomerData = Array.from(uniqueCustomers)?.map(
      (customerName) => {
        return datas?.find((item) => item.account_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);
    // For Unique Sales Executive
    const uniqueSalesEx = new Set(datas?.map((item) => item.created_by_name));
    setUniqueSalesExecutiveCount(uniqueSalesEx.size);
    setUniquesalesexecutiveCount(uniqueSalesEx.size);
    const uniqueSEData = Array.from(uniqueSalesEx)?.map((salesEName) => {
      return datas?.find((item) => item.created_by_name === salesEName);
    });
    setUniqueSalesExecutiveData(uniqueSEData);
  };
  // For Customers
  const handleOpenUniqueCustomerClick = () => {
    setUniqueCustomerDialog(true);
  };

  const handleCloseUniqueCustomer = () => {
    setUniqueCustomerDialog(false);
  };

  // For Sales Executive
  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const handleCloseUniquesalesExecutive = () => {
    setUniqueSalesExecutiveDialog(false);
  };

  const handleOpenSameSalesExecutive = (salesEName) => {
    const sameNameSalesExecutive = datas?.filter(
      (item) => item.created_by_name === salesEName
    );
    setFilterData(sameNameSalesExecutive);
    handleCloseUniquesalesExecutive();
  };
  const handleOpenSameAccount = (accountName) => {
    const sameNameAccount = datas?.filter(
      (item) => item.account_name === accountName
    );
    setFilterData(sameNameAccount);
    handleCloseUniqueCustomer();
  };

  useEffect(() => {
    onHandleOpenUniqueSalesExecutiveChange(
      () => handleOpenUniqueSalesExecutive
    );
    onHandleOpenUniqueCustomerClickChange(() => handleOpenUniqueCustomerClick);
  }, []);

  // For Verify :-
  const handleOpenVerifyDialog = (e, row) => {
    e.preventDefault();
    setVerifyDialog(true);
    setRow(row);
  };

  const handleCloseVerifyDialog = () => {
    setVerifyDialog(false);
    setBalAmount("");
    setRemark("");
  };
  const handleVerifySubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("tds_verified_amount", balAmount);
    formData.append("tds_verified_remark", remark);

    await axios
      .put(
        baseUrl + `/sales/update_tds_verification/${row.sale_booking_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res?.status === 200) {
          toastAlert("TDS Verification Successfully Completed");
          handleCloseVerifyDialog();
          getData();
        }
      });
    setIsFormSubmitted(true);
  };

  // ========================================================

  const filterDataBasedOnSelection = (apiData) => {
    const now = moment();
    switch (dateFilter) {
      case "last7Days":
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            now.clone().subtract(7, "days"),
            now,
            "day",
            "[]"
          )
        );
      case "last30Days":
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
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
          moment(item.sale_booking_date).isBetween(
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
          moment(item.sale_booking_date).isBetween(
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
          moment(item.sale_booking_date).isBetween(
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
          moment(item.sale_booking_date).isBetween(
            quarterStart,
            quarterEnd,
            "day",
            "[]"
          )
        );
      case "today":
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isSame(now, "day")
        );
      default:
        return apiData;
    }
  };

  return (
    <>
      {/* verify dialog box */}
      <Dialog
        open={verifyDialog}
        onClose={handleCloseVerifyDialog}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Same Sales Executive</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseVerifyDialog}
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
          <div className="row">
            <div className="col-md-12 ">
              <form onSubmit={handleVerifySubmit}>
                <div className="form-group col-12"></div>

                <div className="form-group">
                  <label htmlFor="images">Amount:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="images"
                    name="images"
                    value={balAmount}
                    onChange={(e) => {
                      // if (e.target.value > row.net_balance_amount_to_pay) {
                      //   toastError(
                      //     "Amount is greater than balance amount to pay"
                      //   );
                      //   return;
                      // }
                      setBalAmount(e.target.value);
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="images">Remark:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="images"
                    name="images"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleVerifySubmit}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Unique Sales Executive Dialog Box */}
      <CommonDialogBox
        data={uniqueSalesExecutiveData}
        columns={uniqueSaleBookingSalesExecutiveColumn({
          uniqueSalesExecutiveData,
          handleOpenVerifyDialog,
          handleOpenSameSalesExecutive,
        })}
        setDialog={setUniqueSalesExecutiveDialog}
        dialog={uniqueSalesExecutiveDialog}
        title="Unique Sales Executive"
      />
      {/* Unique Accounts Dialog Box */}
      <CommonDialogBox
        data={uniqueCustomerData}
        columns={uniqueSaleBookingAccountColumn({
          uniqueCustomerData,
          handleOpenVerifyDialog,
          handleOpenSameAccount,
        })}
        setDialog={setUniqueCustomerDialog}
        dialog={uniqueCustomerDialog}
        title="Unique Accounts"
      />
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
                  value={customerName}
                  onChange={(event, newValue) => setCustomerName(newValue)}
                  options={Array?.from(
                    new Set(datas?.map((option) => option.account_name || []))
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Account Name"
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
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="form-group">
                <label>Sales Executive Name</label>
                <Autocomplete
                  value={salesExecutive}
                  onChange={(event, newValue) => setSalesExecutive(newValue)}
                  options={Array?.from(
                    new Set(
                      datas?.map((option) => option.created_by_name || [])
                    )
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sales Executive Name"
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
                  placeholder="Request Amount"
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
      <div>
        <View
          columns={saleBookingCloseColumns({
            filterData,
            handleOpenVerifyDialog,
            setViewImgSrc,
            setViewImgDialog,
          })}
          data={filterData}
          isLoading={isLoading}
          title={"Sale Booking"}
          rowSelectable={true}
          pagination={[100, 200]}
          tableName={"sale_booking_tds_status_wise_data"}
          selectedData={setSelectedData}
          addHtml={
            <>
              <button
                className="btn cmnbtn btn_sm btn-secondary"
                onClick={(e) => handleClearSameRecordFilter(e)}
              >
                Clear
              </button>
            </>
          }
        />
        {viewImgDialog && (
          <ImageView
            viewImgSrc={viewImgSrc}
            setViewImgDialog={setViewImgDialog}
          />
        )}
      </div>
    </>
  );
};

export default SaleBookingClose;
