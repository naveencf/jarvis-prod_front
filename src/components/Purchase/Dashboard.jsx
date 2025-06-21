import FormContainer from "../AdminPanel/FormContainer";
import {
  Bank,
  Browser,
  Browsers,
  CodaLogo,
  HandCoins,
  MagnifyingGlass,
  UsersFour,
  Wallet,
} from "@phosphor-icons/react";
import {
  useGetCountOfUnregisteredPagesQuery,
  useGetLedgerAmountByVendorQuery,
  useGetTotalDataQuery,
  useGetVendorAdvanceSummaryAndDetailsQuery,
  useGetVendorLedgerMonthWiseQuery,
  useGetVendorOutstandingQuery,
} from "../Store/API/Purchase/DirectPurchaseApi";
import { useState } from "react";
import UnregisteredPagesModal from "./UnregisteredPagesModal";
import { Link } from "react-router-dom";
import formatString from "../../utils/formatString";
import {
  useGetAllVendorTypeQuery,
  useGetPmsPayCycleQuery,
  useGetPmsPlatformQuery,
} from "../Store/reduxBaseURL";
import View from "../AdminPanel/Sales/Account/View/View";
import Calendar from "./Calender";
import { formatNumber } from "../../utils/formatNumber";
import { formatIndianNumber } from "../../utils/formatIndianNumber";
import { Spinner } from "react-bootstrap";
import { Box, Skeleton, Card, CardContent } from "@mui/material";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState("");
  const [advanceRange, setAdvanceRange] = useState("");
  const [showAdvance, setShowAdvance] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // console.log("range", range);
  const { data, error, isLoading } = useGetTotalDataQuery();
  const {
    data: vendorDetail,
    isLoading: isVendorDetailLoading,
    isFetching: isVendorDetailFetching,
  } = useGetVendorOutstandingQuery(range);
  const {
    data: ledgerAmountData,
    isLoading: isLedgerLoading,
    isFetching: isLedgerFetching,
  } = useGetLedgerAmountByVendorQuery("66827bcf8e6fbfb72f5c8b6d") //creative-fuel id
  const { data: unregisteredPages } = useGetCountOfUnregisteredPagesQuery();
  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data;
  const { data: cycle } = useGetPmsPayCycleQuery();
  const { data: vendor } = useGetAllVendorTypeQuery();
  const typeData = vendor?.data;
  const vendorData = vendorDetail?.vendorData;
  const cycleData = cycle?.data;
  const {
    data: vendorAdvancedDetail,
    isLoading: isVendorAdvancedDetailLoading,
    isFetching: isVendorAdvancedDetailFetching,
  } = useGetVendorAdvanceSummaryAndDetailsQuery(advanceRange);

  let queryParams = {};

  if (startDate && endDate) {
    queryParams.startDate = new Date(startDate).toISOString().split("T")[0];
    queryParams.endDate = new Date(endDate).toISOString().split("T")[0];
  }
  console.log("ledgerAmountData", ledgerAmountData);
  const {
    data: vendorLedgerMonthWise,
    isLoading: isVendorLedgerMonthWiseLoading,
    isFetching: isVendorLedgerMonthWiseFetching,
  } = useGetVendorLedgerMonthWiseQuery(queryParams);

  const handleClick = (newRange) => {
    setRange(newRange);
    setShowAdvance(true);
  };
  const handleRangeClick = (range) => {
    setAdvanceRange(range);
    setShowAdvance(false);
  };
  const dataGridcolumns = [
    {
      key: "sno",
      name: "S.NO",
      width: 80,
      renderRowCell: (row, index) => index + 1,
    },
    // {
    //   key: "vendorPercentage",
    //   name: "Vendor %",
    //   width: 150,
    //   renderRowCell: (row) => {
    //     const fields = [
    //       "vendor_name",
    //       "email",
    //       "mobile",
    //       "home_address",
    //       "payment_method",
    //       "Pincode",
    //     ];
    //     const totalFields = fields.length;
    //     let filledFields = 0;

    //     fields.forEach((field) => {
    //       if (row[field] && row[field] !== 0) {
    //         filledFields++;
    //       }
    //     });

    //     const percentage = (filledFields / totalFields) * 100;

    //     if (percentage === 100) {
    //       return "Full";
    //     } else if (percentage > 50) {
    //       return "More than Partial";
    //     } else {
    //       return "Less than Partial";
    //     }
    //   },
    // },
    {
      key: "vendor_name",
      name: "Vendor Name",
      width: 200,
      renderRowCell: (row) => formatString(row?.vendor_name),
    },
    {
      key: "vendor_outstandings",
      name: "Outstanding",
      width: 200,
      renderRowCell: (row) => Math.floor(row?.vendor_outstandings),
      // compare: true
    },
    {
      key: "vendor_total_remaining_advance_amount",
      name: "Advance",
      width: 200,
      renderRowCell: (row) =>
        Math.floor(row?.vendor_total_remaining_advance_amount),
      // compare: true
    },
    // {
    //   key: "Price_Update",
    //   name: "Price Update",
    //   width: 150,
    // },
    {
      key: "vendor_category",
      name: "Vendor Category.",
      width: 150,
    },
    {
      key: "primary_page",
      name: "Primary Page",
      width: 200,
      renderRowCell: (row) => formatString(row?.primary_page_name) || "NA",
    },
    // {
    //   key: "page_count",
    //   name: "Page Count",
    //   width: 200,
    //   renderRowCell: (row) => row.page_count,
    // },
    {
      key: "mobile",
      name: "Mobile",
      width: 200,
      editable: true,
    },
    // {
    //   key: "email",
    //   name: "Email",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   key: "Pincode",
    //   name: "Home Pincode",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   key: "home_city",
    //   name: "Home City",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   key: "home_state",
    //   name: "Home State",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   key: "home_address",
    //   name: "Home Address",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   key: "vendor_type",
    //   name: "Vendor Type",
    //   width: 200,
    //   editable: true,
    //   renderRowCell: (row) =>
    //     typeData?.find((item) => item?._id == row?.vendor_type)?.type_name,
    // },
    // {
    //   key: "vendor_platform",
    //   name: "Platform",
    //   width: 200,
    //   editable: true,
    //   renderRowCell: (row) =>
    //     formatString(
    //       platformData?.find((item) => item?._id == row?.vendor_platform)
    //         ?.platform_name
    //     ),
    // },
    // {
    //   key: "pay_cycle",
    //   name: "Cycle",
    //   width: 200,
    //   editable: true,
    //   renderRowCell: (row) =>
    //     cycleData?.find((item) => item?._id == row?.pay_cycle)?.cycle_name,
    // },
    // {
    //   key: "Bank Details",
    //   name: "Bank Details",
    //   width: 200,
    // },
    // {
    //   key: "whatsapp_link",
    //   name: "Whatsapp Link",
    //   width: 200,
    // },
    // {
    //   key: "action",
    //   name: "Action",
    //   width: 200,
    // },
  ];
  const monthWiseDataColumns = [
    {
      key: "sno",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "totalCredit",
      name: "Paid Amount",
      renderRowCell: (row) => formatIndianNumber(Math.floor(row.totalCredit)),
      getTotal: true,
    },
    {
      key: "totalDebit",
      name: "Purchase Amount",
      renderRowCell: (row) => formatIndianNumber(Math.floor(row.totalDebit)),
      getTotal: true,
    },
    {
      key: "outstanding",
      name: "Outstanding Amount",
      renderRowCell: (row) =>
        formatIndianNumber(
          Math.floor(row.totalCredit) - Math.floor(row.totalDebit)
        ),
      getTotal: true,
    },
    {
      key: "month",
      name: "Month",
      renderRowCell: (row) => row.month,
    },
  ];
  const formatString = (str) => {
    if (!str) return "";
    const firstChar = str.charAt(0);
    if (/[a-zA-Z]/.test(firstChar)) {
      return firstChar.toUpperCase() + str.slice(1);
    }
    return str;
  };
  // console.log("vendorAdvancedDetail", vendorAdvancedDetail?.vendorData);
  const vendorDetailData = showAdvance
    ? vendorData
    : vendorAdvancedDetail?.vendorData;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <FormContainer mainTitle={"Purchase Dashboard"} link={true} />
      <UnregisteredPagesModal
        open={open}
        handleClose={handleClose}
        unregisteredPages={unregisteredPages}
      />

      <div className="row">
        <div className="col-xl-9 col-lg-9 col-md-12 col-12">
          <div className="card">
            <div className="card-body pb20">
              <div className="row no-wrap">
                <div className="col-xl-2 col-lg-2 col-md-4 col-6 border-right mr-4">
                  <div className="flexCenter flex_col">
                    <div className="iconBadge small bgSuccessLight m-0">
                      <span>
                        <Bank />
                      </span>
                    </div>
                    {/* <Link to="/admin/purchase/vendor_outstanding"> */}
                    <Link to="/admin/purchase/vendor_outstanding?filter=outstandingGreaterThanZero">
                      <div className="mt12 text-center">
                        <h6 className="colorMedium">Total Outstanding</h6>
                        <h6 className="mt4 fs_16">
                          {/* ₹{formatIndianNumber(Math.floor(data?.total_outstanding))} */}
                          ₹{formatIndianNumber(Math.floor(data?.total_outstanding + data?.total_pending_link_amt + data?.total_audited_link_amt - ledgerAmountData?.balance))}
                        </h6>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="col-xl-2 col-lg-2 col-md-4 col-6 border-right mr-4">
                  <div className="flexCenter flex_col">
                    <div className="iconBadge small bgWarningLight m-0">
                      <span>
                        <HandCoins />
                      </span>
                    </div>
                    <Link to="/admin/purchase/vendor_outstanding">
                      {/* <Link to="/admin/purchase/vendor_outstanding?filter=outstandingGreaterThanZero"> */}
                      <div className="mt12 text-center">
                        <h6 className="colorMedium">Total Advanced</h6>
                        <h6 className="mt4 fs_16">
                          ₹
                          {formatIndianNumber(
                            Math.floor(data?.total_advanced_amount)
                          )}
                        </h6>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="col-xl-2 col-lg-2 col-md-4 col-6 border-right mr-4">
                  <div className="flexCenter flex_col">
                    <div className="iconBadge small bgInfoLight m-0">
                      <span>
                        <Wallet />
                      </span>
                    </div>
                    <Link to="/admin/purchase/vendor_outstanding?filter=outstandingGreaterThanZero">
                      <div className="mt12 text-center">
                        <h6 className="colorMedium">Outstandings</h6>
                        <h6 className="mt4 fs_16">
                          ₹{formatIndianNumber(Math.floor(data?.total_outstanding))}
                          {/* ₹{formatIndianNumber(Math.floor(data?.total_outstanding - data?.total_advanced_amount))} */}
                        </h6>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="col-xl-2 col-lg-2 col-md-4 col-6 border-right mr-4">
                  <div className="flexCenter flex_col">
                    <div className="iconBadge small bgWarningLight m-0">
                      <span>
                        <Wallet />
                      </span>
                    </div>
                    <Link to="/admin/purchase/pending-outstanding-total">
                      <div className="mt12 text-center">
                        <h6 className="colorMedium">Audit Pending</h6>
                        <h6 className="mt4 fs_16">
                          ₹
                          {formatIndianNumber(
                            Math.floor(data?.total_pending_link_amt)
                          )}
                        </h6>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="col-xl-2 col-lg-2 col-md-4 col-6 mr-4">
                  <div className="flexCenter flex_col">
                    <div className="iconBadge small bgTertiaryLight m-0">
                      <span>
                        <Browser />
                      </span>
                    </div>
                    <Link to="/admin/purchase/audited-outstanding-total">
                      <div className="mt12 text-center">
                        <h6 className="colorMedium">Purchase Pending</h6>
                        <h6 className="mt4 fs_16">
                          ₹
                          {formatIndianNumber(
                            Math.floor(data?.total_audited_link_amt)
                          )}
                        </h6>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-12 col-12">
              <div className="card overflow-hidden">
                <div className="card-header">
                  <h5 className="card-title">Vendor Outstanding</h5>
                </div>
                {isVendorDetailLoading ? (
                  <div>
                    <Card sx={{ width: 410 }}>
                      <Skeleton variant="rectangular" height={180} />
                      <Skeleton variant="text" height={30} sx={{ mt: 2 }} />
                    </Card>
                  </div>
                ) : (
                  <div className="card-body p0">
                    <div className="table-responsive">
                      <table className="table infoTable">
                        <thead>
                          <tr>
                            <th>Range</th>
                            <th>Count</th>
                            <th className="text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendorDetail?.data?.data?.map((item, index) => (
                            <tr key={index}>
                              <td
                                onClick={() => {
                                  if (item.range !== "total") {
                                    handleClick(item.range);
                                  }
                                }}
                                style={{
                                  cursor:
                                    item.range !== "total"
                                      ? "pointer"
                                      : "default",
                                }}
                              >
                                {formatString(item.range)}
                              </td>

                              <td>{item.vendorCount}</td>
                              <td className="text-right">
                                {Math.floor(
                                  item.totalOutstanding
                                ).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-12">
              <div className="card overflow-hidden">
                {/* <div className="card-header">
                  <h5 className="card-title">Previous Four Months Purchases</h5>
                </div>
                <div className="card-body p0">
                  <div className="table-responsive">
                    <table className="table infoTable">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th className="text-right">Purchase Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>February-2025</td>
                          <td className="text-right">14,104,675.00</td>
                        </tr>
                        <tr>
                          <td>January-2025</td>
                          <td className="text-right">17,201,482.00</td>
                        </tr>
                        <tr>
                          <td>December-2024</td>
                          <td className="text-right">12,253,572.00</td>
                        </tr>
                        <tr>
                          <td>November-2024</td>
                          <td className="text-right">3,268,171.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div> */}
                <div className="card-header">
                  <h5 className="card-title">Vendor Advanced Amount</h5>
                </div>
                {isVendorAdvancedDetailLoading ? (
                  <Card sx={{ width: 410 }}>
                    <Skeleton variant="rectangular" height={180} />
                    <Skeleton variant="text" height={30} sx={{ mt: 2 }} />
                  </Card>
                ) : (
                  <div className="card-body p0">
                    <div className="table-responsive">
                      <table className="table infoTable">
                        <thead>
                          <tr>
                            <th>Range</th>
                            <th>Count</th>
                            <th className="text-right">Amount</th>
                          </tr>
                        </thead>

                        <tbody>
                          {vendorAdvancedDetail?.summary?.map((item, index) => (
                            <tr key={index}>
                              <td
                                onClick={() => {
                                  if (item.range !== "total") {
                                    handleRangeClick(item.range);
                                  }
                                }}
                                style={{
                                  cursor:
                                    item.range !== "total"
                                      ? "pointer"
                                      : "default",
                                }}
                              >
                                {formatString(item.range)}
                              </td>

                              <td>{item.vendorCount}</td>
                              <td className="text-right">
                                {Math.floor(
                                  item?.totalAdvanceAmount
                                )?.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-12 col-12">
          <div className="card">
            <div className="card-body pl0 pr0">

              <div className="p12">
                <Link to="/admin/inventory/pms-page-overview">
                  <div className="flexCenter flex_col">
                    <div className="iconBadge small bgSecondaryLight m-0">
                      <span>
                        <Browsers />
                      </span>
                    </div>
                    <div className="mt12 text-center">
                      <h6 className="colorMedium">Creativefuel Outstanding</h6>
                      <h6 className="mt4 fs_16">₹{formatIndianNumber(Math.floor(ledgerAmountData?.balance))}</h6>
                    </div>
                  </div>
                </Link>
              </div>
              <hr />
              <div className="p12">
                <Link to="/admin/inventory/pms-vendor-overview">
                  <div className="flexCenter flex_col">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <span>
                        <UsersFour />
                      </span>
                    </div>
                    <div className="mt12 text-center">
                      <h6 className="colorMedium">Total Vendors</h6>
                      <h6 className="mt4 fs_16">{data?.total_vendor_count}</h6>
                    </div>
                  </div>
                </Link>
              </div>
              <hr />
              <div className="p12">
                <Link to="/admin/inventory/pms-page-overview">
                  <div className="flexCenter flex_col">
                    <div className="iconBadge small bgSecondaryLight m-0">
                      <span>
                        <Browsers />
                      </span>
                    </div>
                    <div className="mt12 text-center">
                      <h6 className="colorMedium">Total Pages</h6>
                      <h6 className="mt4 fs_16">{data?.total_page_count}</h6>
                    </div>
                  </div>
                </Link>
              </div>
              <hr />
              <div
                className="p12"
                onClick={handleOpen}
                style={{ cursor: "pointer" }}
              >
                <div className="flexCenter flex_col">
                  <div className="iconBadge small bgTertiaryLight m-0">
                    <span>
                      <CodaLogo />
                    </span>
                  </div>
                  <div className="mt12 text-center">
                    <h6 className="colorMedium">Unregistered Pages</h6>
                    <h6 className="mt4 fs_16">
                      {unregisteredPages?.unregistered_page_count}
                    </h6>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* <div className="row">
        <div className="col-xl-4 col-lg-4 col-md-12 col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Campaign</h5>
            </div>
            <div className="card-body pb20">
              <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-6 col-6">
                  <h6 className="colorMedium">Total Campaign</h6>
                  <h6 className="mt4 fs_16">1968</h6>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-6">
                  <h6 className="colorMedium">Amount not updated</h6>
                  <h6 className="mt4 fs_16">1965</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Page Price Not Updated</h5>
            </div>
            <div className="card-body pb20">
              <div className="row">
                <div className="col-xl-4 col-lg-4 col-md-4 col-4 ">
                  <h6 className="colorMedium">Story Price</h6>
                  <h6 className="mt4 fs_16">1716</h6>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-4 col-4">
                  <h6 className="colorMedium">Post Price</h6>
                  <h6 className="mt4 fs_16">911</h6>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-4 col-4">
                  <h6 className="colorMedium">Both Price</h6>
                  <h6 className="mt4 fs_16">2029</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="row">
        <div className="col-xl-4 col-lg-4 col-md-12 col-12">
          <div className="card overflow-hidden">
            <div className="card-header">
              <h5 className="card-title">Search by Date Range</h5>
            </div>
            <div className="card-body p0">
              <div className="p16">
                <div className="input-group selectGroup">
                  <select className="form-control">
                    <option selected>Today</option>
                    <option value="1">Yesterday</option>
                    <option value="2">This Week</option>
                    <option value="3">This Month</option>
                    <option value="3">This Year</option>
                    <option value="3">Custom Date Range</option>
                  </select>
                  <div className="input-group-append">
                    <button className="btn" type="button">
                      <MagnifyingGlass />
                    </button>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table infoTable">
                  <thead>
                    <tr>
                      <th>Purchase Type</th>
                      <th>Total Purchase</th>
                      <th className="text-right">Total Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Both</td>
                      <td>0</td>
                      <td className="text-right">0</td>
                    </tr>
                    <tr>
                      <td>Post</td>
                      <td>11909</td>
                      <td className="text-right">24125711</td>
                    </tr>
                    <tr>
                      <td>Story</td>
                      <td>57</td>
                      <td className="text-right">63132</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>Total</th>
                      <th>11966</th>
                      <th className="text-right">24188843</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-12 col-12">
          <div className="card overflow-hidden">
            <div className="card-header">
              <h5 className="card-title">Search by Date Range (Vendor)</h5>
            </div>
            <div className="card-body p0">
              <div className="p16">
                <div className="input-group selectGroup">
                  <select className="form-control">
                    <option selected>Today</option>
                    <option value="1">Yesterday</option>
                    <option value="2">This Week</option>
                    <option value="3">This Month</option>
                    <option value="3">This Year</option>
                    <option value="3">Custom Date Range</option>
                  </select>
                  <div class="input-group-append">
                    <button className="btn" type="button">
                      <MagnifyingGlass />
                    </button>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table infoTable">
                  <thead>
                    <tr>
                      <th>Purchase Type</th>
                      <th>Total Purchase</th>
                      <th className="text-right">Total Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Both</td>
                      <td>0</td>
                      <td className="text-right">0</td>
                    </tr>
                    <tr>
                      <td>Post</td>
                      <td>11909</td>
                      <td className="text-right">24125711</td>
                    </tr>
                    <tr>
                      <td>Story</td>
                      <td>57</td>
                      <td className="text-right">63132</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>Total</th>
                      <th>11966</th>
                      <th className="text-right">24188843</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-12 col-12">
          <div className="card overflow-hidden">
            <div className="card-header">
              <h5 className="card-title">Search by Date Range (Partnership)</h5>
            </div>
            <div className="card-body p0">
              <div className="p16">
                <div className="input-group selectGroup">
                  <select className="form-control">
                    <option selected>Today</option>
                    <option value="1">Yesterday</option>
                    <option value="2">This Week</option>
                    <option value="3">This Month</option>
                    <option value="3">This Year</option>
                    <option value="3">Custom Date Range</option>
                  </select>
                  <div className="input-group-append">
                    <button className="btn" type="button">
                      <MagnifyingGlass />
                    </button>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table infoTable">
                  <thead>
                    <tr>
                      <th>Purchase Type</th>
                      <th>Total Purchase</th>
                      <th className="text-right">Total Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Both</td>
                      <td>0</td>
                      <td className="text-right">0</td>
                    </tr>
                    <tr>
                      <td>Post</td>
                      <td>11909</td>
                      <td className="text-right">24125711</td>
                    </tr>
                    <tr>
                      <td>Story</td>
                      <td>57</td>
                      <td className="text-right">63132</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>Total</th>
                      <th>11966</th>
                      <th className="text-right">24188843</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {vendorDetailData?.length > 0 && (
        <View
          version={1}
          columns={dataGridcolumns}
          data={vendorDetailData}
          isLoading={
            isVendorDetailLoading ||
            isVendorDetailFetching ||
            isVendorAdvancedDetailFetching ||
            isVendorAdvancedDetailLoading
          }
          // showTotal={true}
          title="Vendor Overview"
          rowSelectable={true}
          pagination={[100, 200, 1000]}
          tableName="Vendor Overview"
        />
      )}
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <Calendar
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
            </div>
          </div>
        </div>
      </div>
      <View
        version={1}
        columns={monthWiseDataColumns}
        data={vendorLedgerMonthWise?.monthWiseLedger}
        isLoading={
          isVendorLedgerMonthWiseLoading || isVendorLedgerMonthWiseFetching
        }
        title="Month Wise Ledger"
        rowSelectable={true}
        pagination={[100, 200, 1000]}
        tableName="Vendor Overview"
        showTotal={true}
      />
    </>
  );
};

export default Dashboard;
