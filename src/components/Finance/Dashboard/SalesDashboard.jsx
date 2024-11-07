import { useEffect, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import axios from "axios";
import { Link } from "react-router-dom";
import { Autocomplete, Button, TextField } from "@mui/material";
import classes from "./FinanceDashboard.module.css";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import InfoIcon from "@mui/icons-material/Info";
import { baseUrl } from "../../../utils/config";
import gifone from "../../../assets/img/finance/gifone.gif";
import giftwo from "../../../assets/img/finance/giftwo.gif";
import gifthree from "../../../assets/img/finance/gifthree.gif";
import { PieChart } from "@mui/x-charts";
import FormattedNumberWithTooltip from "../FormateNumWithTooltip/FormattedNumberWithTooltip";
import jwtDecode from "jwt-decode";

const filterOptions = [
  "Today",
  "Current Month",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last 1 Year",
  "Custom Date",
];

export default function SalesDashboard() {
  const [vendorCardData, setVendorCardData] = useState([]);
  const [pendingForApprovalData, setPendingForApprovalData] = useState([]);
  const [refundReqData, setRefundReqData] = useState([]);
  const [cstPaymentData, setCstPaymentData] = useState([]);
  const [invoicePending, setInvoicePending] = useState([]);
  const [salesBookingAboutToCloseData, setSalesBookingAboutToCloseData] =
    useState([]);
  const [salesBookingOpenData, setSalesBookingOpenData] = useState([]);
  const [salesBookingCloseData, setSalesBookingCloseData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs(new Date()));
  const [filterPendingForApprovalData, setFilterPendingForApprovalData] =
    useState([]);
  const [filterRefundReqData, setFilterRefundReqData] = useState([]);
  const [filterCstPaymentData, setFilterCstPaymentData] = useState([]);
  const [filterInvoicePending, setFilterInvoicePending] = useState([]);
  const [
    filterSalesBookingAboutToCloseData,
    setFilterSalesBookingAboutToCloseData,
  ] = useState([]);
  const [filterSalesBookingOpenData, setFilterSalesBookingOpenData] = useState(
    []
  );
  const [filterSalesBookingCloseData, setFilterSalesBookingCloseData] =
    useState([]);
  const [filterVendorCardData, setFilterVendorCardData] = useState([]);
  const [filterValue, setFilterValue] = useState();
  const [payoutData, setPayoutData] = useState([]);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [graph, setgraph] = useState(0);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleResetClick = () => {
    setFilterValue();
    setStartDate(dayjs());
    setEndDate(dayjs(new Date()));
  };
  const callApi = () => {
    axios
      .get(baseUrl + `sales/finance_dashboard_counts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res, "res of sales dashnoard-->");
        setData(res?.data?.data);
        setFilterData(res?.data?.data);
      })
      .catch((error) => error.message);
  };

  useEffect(() => {
    callApi();
  }, []);

  // const handleFilterChange = (e) => {
  //   setFilterValue(e);
  //   const filterValue = e;

  //   let startFilterDate;
  //   let endFilterDate = new Date(); // Use a new date object for the end date

  //   switch (filterValue) {
  //     case "Today":
  //       startFilterDate = new Date();
  //       startFilterDate.setHours(0, 0, 0, 0); // Set to the start of the day
  //       endFilterDate.setHours(23, 59, 59, 999); // Set to the end of the day
  //       break;
  //     case "Current Month":
  //       startFilterDate = new Date(
  //         endFilterDate.getFullYear(),
  //         endFilterDate.getMonth(),
  //         1
  //       );
  //       endFilterDate = new Date();
  //       break;
  //     case "Last Month":
  //       startFilterDate = new Date(
  //         endFilterDate.getFullYear(),
  //         endFilterDate.getMonth() - 1,
  //         1
  //       );
  //       endFilterDate = new Date(
  //         endFilterDate.getFullYear(),
  //         endFilterDate.getMonth(),
  //         0
  //       );
  //       break;
  //     case "Last 3 Months":
  //       startFilterDate = new Date(
  //         endFilterDate.getFullYear(),
  //         endFilterDate.getMonth() - 2,
  //         1
  //       );
  //       endFilterDate = new Date();
  //       break;
  //     case "Last 6 Months":
  //       startFilterDate = new Date(
  //         endFilterDate.getFullYear(),
  //         endFilterDate.getMonth() - 5,
  //         1
  //       );
  //       endFilterDate = new Date();
  //       break;
  //     case "Last 1 Year":
  //       startFilterDate = new Date(
  //         endFilterDate.getFullYear() - 1,
  //         endFilterDate.getMonth(),
  //         1
  //       );
  //       endFilterDate = new Date();
  //       break;
  //     case "search":
  //       startFilterDate = new Date(startDate);
  //       endFilterDate = new Date(endDate);
  //       break;
  //     default:
  //     case "Custom Date":
  //       return;
  //   }

  //   const filteredData = filterPendingForApprovalData.filter((item) => {
  //     const itemDate = new Date(item.creation_date);
  //     return itemDate >= startFilterDate && itemDate <= endFilterDate;
  //   });
  //   setPendingForApprovalData(filteredData);

  //   const filteredData1 = filterRefundReqData.filter((item) => {
  //     const itemDate = new Date(item.creation_date);
  //     return itemDate >= startFilterDate && itemDate <= endFilterDate;
  //   });
  //   setRefundReqData(filteredData1);

  //   const filteredData2 = filterCstPaymentData.filter((item) => {
  //     const itemDate = new Date(item.sale_booking_date);
  //     return itemDate >= startFilterDate && itemDate <= endFilterDate;
  //   });

  //   setCstPaymentData(filteredData2);

  //   const filteredData3 = filterInvoicePending.filter((item) => {
  //     const itemDate = new Date(item.creation_date);
  //     return itemDate >= startFilterDate && itemDate <= endFilterDate;
  //   });

  //   setInvoicePending(filteredData3);

  //   const filteredData4 = filterSalesBookingAboutToCloseData.filter((item) => {
  //     const itemDate = new Date(item.booking_created_date);
  //     return itemDate >= startFilterDate && itemDate <= endFilterDate;
  //   });

  //   setSalesBookingAboutToCloseData(filteredData4);

  //   const filteredData5 = filterSalesBookingOpenData.filter((item) => {
  //     const itemDate = new Date(item.booking_created_date);
  //     return itemDate >= startFilterDate && itemDate <= endFilterDate;
  //   });

  //   setSalesBookingOpenData(filteredData5);

  //   const filteredData6 = filterSalesBookingCloseData.filter((item) => {
  //     const itemDate = new Date(item.booking_created_date);
  //     return itemDate >= startFilterDate && itemDate <= endFilterDate;
  //   });

  //   setSalesBookingCloseData(filteredData6);

  //   const filteredData7 = filterVendorCardData.filter((item) => {
  //     const itemDate = new Date(item.request_date);
  //     return itemDate >= startFilterDate && itemDate <= endFilterDate;
  //   });

  //   setVendorCardData(filteredData7);
  //   const filterData8 = filterPayoutData.filter((item) => {
  //     const itemDate = new Date(item.date);
  //     return itemDate >= startFilterDate && itemDate <= endFilterDate;
  //   });
  //   setPayoutData(filterData8);

  //   const filterData9 = incentiveFilterData.filter((item) => {
  //     const itemDate = new Date(item.request_creation_date);
  //     return itemDate >= startFilterDate && itemDate <= endFilterDate;
  //   });
  //   setIncentiveData(filterData9);

  //   const filterData10 = filterPaymentModeData.filter((item) => {
  //     const itemDate = new Date(item.created_at);
  //     return itemDate >= startFilterDate && itemDate <= endFilterDate;
  //   });
  //   setPaymentModeData(filterData10);
  // };

  // const incentiveCount = incentiveData?.filter(
  //   (data) => data?.action === "Complete Release Button"
  // );

  return (
    <div>
      <div className="card">
        <div className="card-body flex-row gap4">
          <div className="row thm_form w-100">
            <div className="col-md-2_5">
              <Autocomplete
                disablePortal
                value={filterValue}
                id="combo-box-demo"
                options={filterOptions}
                onChange={(event, value) => {
                  handleFilterChange(value);
                }}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Filter" />
                )}
              />
            </div>

            {filterValue === "Custom Date" && (
              <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="col-md-2_5">
                    <DatePicker
                      label="Start Date"
                      format="DD/MM/YYYY"
                      disableFuture
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                      }}
                    />
                  </div>
                  <div className="col-md-2_5">
                    <DatePicker
                      label="End Date"
                      format="DD/MM/YYYY"
                      value={endDate}
                      shouldDisableDate={(day) =>
                        dayjs(day).isBefore(startDate)
                      }
                      onChange={(newValue) => {
                        setEndDate(newValue);
                      }}
                    />
                  </div>
                </LocalizationProvider>
                <div className="col-md-2_5">
                  <button
                    onClick={() => handleFilterChange("search")}
                    className="btn cmnbtn btn-outline-primary w-100 "
                  >
                    Filter
                  </button>
                </div>
              </>
            )}
            <div className="col-md-2_5">
              <button
                onClick={handleResetClick}
                className="btn cmnbtn btn-outline-primary w-100"
              >
                Reset
              </button>
            </div>
          </div>
          <div className=" flex-row d-flex" style={{ gap: "20px" }}>
            <i
              className="bi bi-list-ul"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setgraph(0);
              }}
            ></i>
            <i
              className="bi bi-bar-chart-fill"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setgraph(1);
              }}
            ></i>
          </div>
        </div>
      </div>
      {graph === 0 && (
        <div className="card">
          <div className="card-body pb0">
            {/* <div className="card-body cardGrdnt orangeGrdnt">
              <Link to="/admin/finance-incentivepayment">
                <div className="row align-items-center">
                  <div className="col-md-6 financeCardBox border-right ">
                    <div className="financeCardBoxIn p0">
                      <div className="financeCardBoxTitle">
                        <div className="financeCardBoxImg">
                          <img src={gifone} alt="" />
                        </div>
                        <h2>Pending Incentive Release </h2>
                      </div>
                      <div className="scroll-con pl40">
                        <h3>{data?.pendingIncentiveReqCounts}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 financeCardBox">
                    <div className="financeCardBoxIn p0">
                      <div className="financeCardBoxDetails">
                        <ul className="pl32">
                          <li>
                            Balance
                            <span>
                              <span>&#8377; </span>
                              <FormattedNumberWithTooltip
                                value={data?.pendingIncentiveReqAmount}
                              />
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div> */}
            <div className="row">
              <div className="col-md-6">
                <Link to="/admin/finance-incentivepayment">
                  <div className="cardGrdnt orangeGrdnt">
                    <div className="financeCardBox border-bottom">
                      <div className="financeCardBoxIn">
                        <div className="financeCardBoxTitle">
                          <div className="financeCardBoxImg">
                            <img src={gifone} alt="" />
                          </div>
                          <h2>Pending Incentive Release</h2>
                        </div>
                        <div className="scroll-con  pl40">
                          <h3>{data?.pendingIncentiveReqCounts}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="financeCardBox">
                      <div className="financeCardBoxIn">
                        <div className="financeCardBoxDetails">
                          <ul>
                            <li>
                              Balance
                              <span>{data?.saleBookingtdsCloseCounts}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-6">
                <Link to="/admin/finance-payment-release-report">
                  <div className="cardGrdnt orangeGrdnt">
                    <div className="financeCardBox border-bottom">
                      <div className="financeCardBoxIn">
                        <div className="financeCardBoxTitle">
                          <div className="financeCardBoxImg">
                            <img src={gifthree} alt="" />
                          </div>
                          <h2>Payment Release Report</h2>
                        </div>
                        <div className="scroll-con  pl40"></div>
                      </div>
                    </div>
                    <div className="financeCardBox">
                      <div className="financeCardBoxIn">
                        <div className="financeCardBoxDetails">
                          <ul>
                            <li>
                              Total Payment Release Report
                              <span>
                                <span>&#8377; </span>
                                <FormattedNumberWithTooltip
                                  // value={cstPaymentData
                                  //   .map(
                                  //     (item) =>
                                  //       item.campaign_amount -
                                  //       item.total_paid_amount
                                  //   )
                                  //   .reduce((prev, next) => prev + next, 0)
                                  //   .toLocaleString("en-IN")}
                                  value={0}
                                />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Link to="/admin/finance-salebooking">
                  <div className="cardGrdnt greenGrdnt">
                    <div className="financeCardBox border-bottom">
                      <div className="financeCardBoxIn">
                        <div className="financeCardBoxTitle">
                          <div className="financeCardBoxImg">
                            <img src={giftwo} alt="" />
                          </div>
                          <h2>TDS Verification Open</h2>
                        </div>
                        <div className="scroll-con  pl40">
                          {/* <div className="scroller"> */}
                          {/* <h3>0</h3> */}
                          <h3>{data?.saleBookingtdsOpenCounts}</h3>
                        </div>
                        {/* </div> */}
                      </div>
                    </div>
                    <div className="financeCardBox">
                      <div className="financeCardBoxIn">
                        <div className="financeCardBoxDetails">
                          <ul>
                            {/* <li>
                              TDS Verification About to Close
                              <span>{salesBookingAboutToCloseData.length}</span>
                            </li> */}
                            <li>
                              TDS Verification Closed
                              <span>{data?.saleBookingtdsCloseCounts}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-6">
                <Link to="/admin/finance-balancepayment">
                  <div className="cardGrdnt greenGrdnt">
                    <div className="financeCardBox border-bottom">
                      <div className="financeCardBoxIn">
                        <div className="financeCardBoxTitle">
                          <div className="financeCardBoxImg">
                            <img src={gifthree} alt="" />
                          </div>
                          <h2>Outstanding</h2>
                        </div>
                        <div className="scroll-con  pl40">
                          {/* <div className="scroller"> */}
                          {/* <h1 className="color-white">0</h1> */}
                          <h3>{data?.saleBookingOutstandingCounts}</h3>
                          {/* </div> */}
                        </div>
                      </div>
                    </div>
                    <div className="financeCardBox">
                      <div className="financeCardBoxIn">
                        <div className="financeCardBoxDetails">
                          <ul>
                            <li>
                              Total Refund Request Amount Pending
                              <span>
                                <span>&#8377; </span>
                                <FormattedNumberWithTooltip
                                  // value={cstPaymentData
                                  //   .map(
                                  //     (item) =>
                                  //       item.campaign_amount -
                                  //       item.total_paid_amount
                                  //   )
                                  //   .reduce((prev, next) => prev + next, 0)
                                  //   .toLocaleString("en-IN")}
                                  value={0}
                                />
                              </span>
                            </li>
                            {/* <li>
                              &nbsp;
                              <span>&nbsp;</span>
                            </li> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Link to="/admin/finance-pendingapproveupdate">
                  <div className="card-body cardGrdnt blueGrdnt financeCardSmall">
                    <h2>Pending Approval of Sales Payment</h2>
                    <h3>{data?.pendingPaymentReqCounts}</h3>
                  </div>
                </Link>
              </div>
              <div className="col">
                <Link to="/admin/finance-invoice">
                  <div className="card-body cardGrdnt blueGrdnt financeCardSmall">
                    <h2>Total Invoice Pending</h2>
                    <h3>{data?.pendingInvoiceReqCounts}</h3>
                  </div>
                </Link>
              </div>
              <div className="col">
                <Link to="/admin/finance-refundpayment">
                  <div className="card-body cardGrdnt blueGrdnt financeCardSmall">
                    <h2>Total Refund Request Amount Pending</h2>
                    <h3>
                      <span>&#8377;</span>
                      <FormattedNumberWithTooltip
                        // value={
                        //   refundReqData
                        //     .map((item) => item.refund_amount)
                        //     .reduce((prev, next) => prev + next, 0)
                        //   (0).toLocaleString("en-IN")
                        // }
                        value={0}
                      />
                    </h3>
                  </div>
                </Link>
              </div>
              {/* <div className="col">
                <Link to="/admin/finance-pruchasemanagement-paymentdone">
                  <div className="card-body cardGrdnt blueGrdnt financeCardSmall">
                    <h2>Pending for Vendor Payment</h2>
                    <h3>{vendorCardData.length}</h3>
                  </div>
                </Link>
              </div> */}
              <div className="col">
                <Link to="/admin/accounts-finance-dashboard">
                  <div className="card-body cardGrdnt blueGrdnt financeCardSmall">
                    <h2>Total Payout Pending</h2>
                    <h3>
                      <span>&#8377; </span>
                      <FormattedNumberWithTooltip
                        value={
                          payoutData
                            .map((e) => e.toPay)
                            .reduce((prev, next) => prev + next, 0)
                            ? payoutData
                                .map((e) => e.toPay)
                                .reduce((prev, next) => prev + next, 0)
                                .toLocaleString("en-IN")
                            : 0
                        }
                      />
                    </h3>
                  </div>
                </Link>
              </div>
              <div className="col">
                <Link to="/admin/finance-paymentmode">
                  <div className="card-body cardGrdnt blueGrdnt financeCardSmall">
                    <h2>Payment Mode</h2>
                    <h3>
                      {/* <span>&#8377; </span> */}
                      {0}
                    </h3>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {graph === 1 && (
        <div className="card body-padding" style={{ gap: "16px" }}>
          <div className="pack fin-up-card flex-row" style={{ gap: "16px" }}>
            <div className="fin-card w-50">
              <div
                className="pack flex-row w-100"
                style={{ gap: "32px", padding: "20px" }}
              >
                <div className="fd-circle">
                  <img src={gifone} alt="gif" />
                </div>
                <div
                  className="pack d-flex flex-column"
                  style={{ gap: "15px" }}
                >
                  <h4>Total Incentive Count</h4>
                  <div className="scroll-con">
                    <div className="scroller">
                      <h1>0</h1>
                      <FormattedNumberWithTooltip
                        value={incentiveData.map((item, index) => (
                          <h1>{index + 1}</h1>
                        ))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="pack d-flex flex-column w-100"
                style={{ gap: "10px", padding: "20px", color: "var(--white)" }}
              >
                <div
                  className="pack sb"
                  style={{
                    position: "relative",
                    borderRadius: "100px",
                    border: "1px solid rgba(109, 44, 0, 0.60) ",
                    padding: "3px 10px",
                  }}
                >
                  <div className="bg-pack h-100 w-75"></div>
                  <h6>Request Amount </h6>
                  <h6 style={{ color: "#672700" }}>
                    {" "}
                    ₹{" "}
                    <FormattedNumberWithTooltip
                      value={incentiveData
                        .map((item) => +item.request_amount)
                        .reduce((prev, next) => prev + next, 0)}
                    />
                  </h6>
                </div>
                <div
                  className="pack sb"
                  style={{
                    position: "relative",
                    borderRadius: "100px",
                    border: "1px solid rgba(109, 44, 0, 0.60) ",
                    padding: "3px 10px",
                  }}
                >
                  <div className="bg-pack h-100 w-50"></div>
                  <h6>Released Amount </h6>
                  <h6 style={{ color: "#672700" }}>
                    ₹
                    <FormattedNumberWithTooltip
                      value={incentiveData
                        .map((item) => +item.released_amount)
                        .reduce((prev, next) => prev + next, 0)}
                    />
                  </h6>
                </div>
                <div
                  className="pack sb"
                  style={{
                    position: "relative",
                    borderRadius: "100px",
                    border: "1px solid rgba(109, 44, 0, 0.60) ",
                    padding: "3px 10px",
                  }}
                >
                  <div className="bg-pack h-100" style={{ width: "40%" }}></div>
                  <h6>Balance Released</h6>
                  <h6 style={{ color: "#672700" }}>
                    ₹{" "}
                    <FormattedNumberWithTooltip
                      value={incentiveData
                        .map((item) => +item.balance_release_amount)
                        .reduce((prev, next) => prev + next, 0)}
                    />
                  </h6>
                </div>
              </div>
            </div>
            <div className="fin-card w-50">
              <PieChart
                series={[
                  {
                    data: [
                      {
                        label: " Pending Approval of Sales Payment",
                        value: pendingForApprovalData?.length,
                      },
                      {
                        label: " Total Invoice Pending",
                        value: invoicePending.length,
                      },
                      {
                        label: "Total Refund Request Amount Pending",
                        value: refundReqData
                          .map((item) => item.refund_amount)
                          .reduce((prev, next) => prev + next, 0),
                      },
                      {
                        value: vendorCardData.length,
                        label: "Pending for Vendor Payment",
                      },
                      {
                        value:
                          payoutData
                            .map((e) => e.toPay)
                            .reduce((prev, next) => prev + next, 0) === "Nan"
                            ? 0
                            : payoutData
                                .map((e) => e.toPay)
                                .reduce((prev, next) => prev + next, 0),
                        label: " Total Payout Pending",
                      },
                    ],
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    startAngle: -180,
                    endAngle: 180,
                    cx: 100,
                    cy: 140,
                  },
                ]}
              />
            </div>
          </div>
          <div className="pack flex-row" style={{ gap: "16px" }}>
            <div className="fin-card w-50">
              <div
                className="pack flex-row w-100"
                style={{ gap: "32px", padding: "20px" }}
              >
                <div className="fd-circle">
                  <img src={giftwo} alt="gif" />
                </div>
                <div
                  className="pack d-flex flex-column"
                  style={{ gap: "15px" }}
                >
                  <h4>TDS Verification Open</h4>
                  <div className="scroll-con">
                    <div className="scroller">
                      <h1>0</h1>
                      {salesBookingOpenData.map((item, index) => (
                        <h1>{index + 1}</h1>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="pack d-flex flex-column w-100"
                style={{ gap: "10px", padding: "20px" }}
              >
                <div className="pack sb">
                  <h6>TDS Verification About to Close</h6>{" "}
                  <h6>{salesBookingAboutToCloseData.length}</h6>
                </div>
                <div className="pack sb">
                  <h6>TDS Verification Closed</h6>
                  <h6> {salesBookingCloseData?.length}</h6>
                </div>
              </div>
            </div>
            <div className="fin-card w-50">
              <div
                className="pack flex-row w-100"
                style={{ gap: "32px", padding: "20px" }}
              >
                <div className="fd-circle">
                  <img src={gifthree} alt="gif" />
                </div>
                <div
                  className="pack d-flex flex-column"
                  style={{ gap: "15px" }}
                >
                  <h4>Outstanding</h4>
                  <div className="scroll-con">
                    <div className="scroller">
                      <h3>0</h3>
                      {cstPaymentData.map((item, index) => (
                        <h1>{index + 1}</h1>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="pack d-flex flex-column w-100"
                style={{ gap: "10px", padding: "20px" }}
              >
                <div className="pack sb">
                  <h6>Total Refund Request Amount Pending </h6>
                  <h6>
                    ₹{" "}
                    <FormattedNumberWithTooltip
                      value={cstPaymentData
                        .map(
                          (item) =>
                            item.campaign_amount - item.total_paid_amount
                        )
                        .reduce((prev, next) => prev + next, 0)
                        .toLocaleString("en-IN")}
                    />
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
