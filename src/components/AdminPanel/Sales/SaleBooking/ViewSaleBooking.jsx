import React, { use, useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useDeleteSaleBookingMutation,
  useGetAllSaleBookingQuery,
} from "../../../Store/API/Sales/SaleBookingApi";
import View from "../Account/View/View";
import { useGetAllAccountQuery } from "../../../Store/API/Sales/SalesAccountApi";
import { useGlobalContext } from "../../../../Context/Context";
import Modal from "react-modal";
import ExecutionModal from "./ExecutionModal";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import FieldContainer from "../../FieldContainer";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import formatString from "../../../../utils/formatString";
import InvoiceRequest from "./InvoiceRequest";
import getDecodedToken from "../../../../utils/DecodedToken";
import InvoiceDownload from "./InvoiceDownload";
import ExecutionData from "./ExecutionData";
import { useGetExeCampaignsNameWiseDataQuery } from "../../../Store/API/Sales/ExecutionCampaignApi";
import {
  format,
  startOfWeek,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  subQuarters,
  set,
} from "date-fns";
import { Accordion } from "@mui/material";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import CustomTable from "../../../CustomTable/CustomTable";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteButton from "../../DeleteButton";

const ViewSaleBooking = () => {
  const token = getDecodedToken();
  let loginUserId;
  const loginUserRole = token.role_id;
  if (loginUserRole !== 1) {
    loginUserId = token.id;
  }
  const filterDate = useLocation().state;
  const [stats, setStats] = useState("");
  const { toastAlert, toastError } = useGlobalContext();
  const { userContextData } = useAPIGlobalContext();

  const navigate = useNavigate();
  const {
    data: allExeCampaignList,
    error: allExeCampaignListError,
    isLoading: allExeCampaignListLoading,
  } = useGetExeCampaignsNameWiseDataQuery(loginUserId);
  const {
    data: allSaleBooking,
    refetch: refetchSaleBooking,
    error: allSalebBookingError,
    isLoading: allSaleBookingLoading,
  } = useGetAllSaleBookingQuery({ loginUserId, stats });
  const {
    data: allAccount,
    error: allAccountError,
    isLoading: allAccountLoading,
  } = useGetAllAccountQuery(loginUserId);

  const [deleteSaleBooking, { isLoading }] = useDeleteSaleBookingMutation();
  const [executionModal, setExecutionModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();
  const [filteredData, setFilteredData] = useState(
    loginUserRole === 1
      ? allSaleBooking?.filter((item) => !item?.is_dummy_sale_booking)
      : allSaleBooking
  );
  const [campaignList, setCampaignList] = useState([]);
  const [filterByCampaignName, setFilterByCampaignName] = useState("");
  const [filterByAccountName, setFilterByAccountName] = useState("");
  const [filterBySalesExecutiveName, setFilterBySalesExecutiveName] =
    useState("");
  const [pivotData, setPivotData] = useState([]);

  const [modalName, setModalName] = useState();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterByIncentive, setFilterByIncentive] = useState("");
  const [quickFiltring, setQuickFiltring] = useState("");

  const handleDelete = async (rowId) => {
    try {
      await deleteSaleBooking(rowId).unwrap();
      toastAlert("Booking Deleted Successfully");
    } catch (error) {
      toastError("Error deleting sale booking:", error);
    }
  };
  const dateFilterOptions = [
    { value: "today", label: "Today" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "this_quarter", label: "This Quarter" },
    { value: "this_year", label: "This Year" },
    { value: "yesterday", label: "Yesterday" },
    { value: "previous_week", label: "Previous Week" },
    { value: "previous_month", label: "Previous Month" },
    { value: "previous_year", label: "Previous Year" },
    { value: "previous_quarter", label: "Previous Quarter" },

    { value: "custom", label: "Custom" },
  ];
  const handleDateFilterChange = () => {
    const today = new Date();
    let from, to;

    switch (quickFiltring) {
      case "today":
        from = to = today;
        break;
      case "this_week":
        from = startOfWeek(today);
        to = today;
        break;
      case "this_month":
        from = startOfMonth(today);
        to = today;
        break;
      case "this_quarter":
        from = startOfQuarter(today);
        to = today;
        break;
      case "this_year":
        from = startOfYear(today);
        to = today;
        break;
      case "yesterday":
        from = to = subDays(today, 1);
        break;
      case "previous_week":
        from = startOfWeek(subWeeks(today, 1));
        to = subDays(startOfWeek(today), 1);
        break;
      case "previous_month":
        from = startOfMonth(subMonths(today, 1));
        to = subDays(startOfMonth(today), 1);
        break;
      case "previous_quarter":
        from = startOfQuarter(subQuarters(today, 1));
        to = subDays(startOfQuarter(today), 1);
        break;
      case "previous_year":
        from = startOfYear(subYears(today, 1));
        to = subDays(startOfYear(today), 1);
        break;
      case "custom":
      default:
        from = "";
        to = "";
        break;
    }

    setFromDate(from ? format(from, "yyyy-MM-dd") : "");
    setToDate(to ? format(to, "yyyy-MM-dd") : "");
  };

  useEffect(() => {
    handleDateFilterChange();
  }, [quickFiltring]);
  const openModal = (row, name) => {
    setSelectedRowData(row);
    setExecutionModal(true);
    if (name === "Execution") {
      setModalName(name);
    }
    if (name === "Invoice") {
      setModalName(name);
    }
    if (name === "InvoiceDownload") {
      setModalName(name);
    }
  };

  const closeModal = () => {
    setExecutionModal(false);
  };
  const incentiveFilterOption = [
    { value: "un-earned", label: "Un-Earned" },
    { value: "earned", label: "Earned" },
  ];

  const renderModalComponent = (modalComp) => {
    switch (modalComp) {
      case "Execution":
        return (
          <ExecutionModal
            saleBookingData={selectedRowData}
            closeModal={closeModal}
            refetchSaleBooking={refetchSaleBooking}
          />
        );
      case "Invoice": {
        return (
          <InvoiceRequest
            saleBookingData={selectedRowData}
            closeModal={closeModal}
            refetchSaleBooking={refetchSaleBooking}
          />
        );
      }
      case "InvoiceDownload": {
        return (
          <InvoiceDownload
            taxInvoiceData={selectedRowData}
            closeModal={closeModal}
          />
        );
      }
      case "testModal": {
        return <ExecutionData selectedRowData={selectedRowData} />;
      }
    }
  };

  function handelRemoveFiltter() {
    setFilteredData(
      loginUserRole === 1
        ? allSaleBooking?.filter((item) => !item?.is_dummy_sale_booking)
        : allSaleBooking
    );
    setFilterByCampaignName("");
    setFilterByAccountName("");
    setFilterBySalesExecutiveName("");
    setFilterByIncentive("");
  }

  useEffect(() => {
    if (filterDate?.booking_status) {
      setStats(filterDate.booking_status);
      handelRemoveFiltter();
    } else if (filterDate != null) {
      setFromDate(filterDate.start.split("T")[0]);
      setToDate(filterDate?.end?.split("T")[0]);
      dataFiltter();
    } else {
      setFilteredData(
        loginUserRole === 1
          ? allSaleBooking?.filter((item) => !item?.is_dummy_sale_booking)
          : allSaleBooking
      );
    }
  }, [filterDate, allSaleBooking, allAccountLoading]);

  function dataFiltter() {
    let filteredData1 = filteredData?.filter((data) => {
      let matchesCampaignName = true,
        matchesAccountName = true,
        matchesSalesExecutiveName = true,
        matchesBookingDate = true,
        matchesIncentive = true;

      if (filterByCampaignName !== "") {
        matchesCampaignName = data.campaign_name === filterByCampaignName;
      }
      if (filterByAccountName !== "") {
        matchesAccountName = data.account_id === filterByAccountName;
      }
      if (filterBySalesExecutiveName !== "") {
        matchesSalesExecutiveName =
          data.created_by === filterBySalesExecutiveName;
      }
      if (filterByIncentive !== "") {
        matchesIncentive = data.incentive_earning_status == filterByIncentive;
      }
      if (fromDate !== "" && toDate !== "") {
        let saleBookingDate = new Date(data.sale_booking_date);
        let from = new Date(fromDate);
        let to = new Date(toDate);

        matchesBookingDate = saleBookingDate >= from && saleBookingDate <= to;
      }

      return (
        matchesCampaignName &&
        matchesAccountName &&
        matchesSalesExecutiveName &&
        matchesBookingDate &&
        matchesIncentive
      );
    });

    setFilteredData(filteredData1);
  }

  useEffect(() => {
    setCampaignList(allExeCampaignList);
  }, [allExeCampaignListLoading]);

  function pivotDataFunction() {
    const ranges = [
      { range: "0-100K" },
      { range: "100-200K" },
      { range: "200-300K" },
      { range: "300-400K" },
      { range: "400-500K" },
      { range: "500-600K" },
      { range: "600-700K" },
      { range: "700-800K" },
      { range: "800-900K" },
      { range: "900-1000K" },
      { range: "10L+" },
    ];
    const newPivot = ranges?.map((data) => {
      let range = data?.range;
      let rangeData = allSaleBooking?.filter((item) => {
        let amount = item?.base_amount;
        if (range === "0-100K") {
          return amount >= 0 && amount <= 100000;
        }
        if (range === "100-200K") {
          return amount >= 100000 && amount <= 200000;
        }
        if (range === "200-300K") {
          return amount >= 200000 && amount <= 300000;
        }
        if (range === "300-400K") {
          return amount >= 300000 && amount <= 400000;
        }
        if (range === "400-500K") {
          return amount >= 400000 && amount <= 500000;
        }
        if (range === "500-600K") {
          return amount >= 500000 && amount <= 600000;
        }
        if (range === "600-700K") {
          return amount >= 600000 && amount <= 700000;
        }
        if (range === "700-800K") {
          return amount >= 700000 && amount <= 800000;
        }
        if (range === "800-900K") {
          return amount >= 800000 && amount <= 900000;
        }
        if (range === "900-1000K") {
          return amount >= 900000 && amount <= 1000000;
        }
        if (range === "10L+") {
          return amount >= 1000000;
        }
      });
      return {
        ...data,
        count: rangeData?.length,
        total: rangeData?.reduce((acc, item) => acc + item.base_amount, 0),
      };
    });
    setPivotData(newPivot);
  }
  useEffect(() => {
    if (allSaleBookingLoading === false) pivotDataFunction();
  }, [allSaleBookingLoading]);

  const pivotColumn = [
    {
      key: "sno",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "range",
      name: "Range",
      width: 100,
    },
    {
      key: "count",
      name: "Count",
      width: 100,
      getTotal: true,
    },
    {
      key: "total",
      name: "Total",
      width: 100,
      getTotal: true,
    },
  ];

  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
      showCol: true,
      compare: true,
    },
    {
      key: "campaign_name",
      name: "Campaign Name",
      renderRowCell: (row) => formatString(row?.campaign_name),
      showCol: true,
      width: 100,
    },
    {
      key: "account_name",
      name: "Account name",
      renderRowCell: (row) => {
        const info = allAccount?.find(
          (account) => account.account_id === row.account_id
        );
        return (
          <Link to={`/sales-account-info/${info?._id}`}>
            {formatString(row?.account_name)}
          </Link>
        );
      },

      showCol: true,
      width: 100,
    },

    {
      key: "sale_booking_id",
      name: "Sale Booking Id",
      width: 50,
    },
    {
      key: "sale_booking_date",
      name: "Booking Date",
      renderRowCell: (row) => DateISOtoNormal(row.sale_booking_date),

      showCol: true,
      width: 100,
    },
    {
      key: "campaign_amount",
      name: "Campaign Amount / Net Amount",
      renderRowCell: (row) => row.campaign_amount,
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "record_service_counts",
      name: "Token & Service count",
      renderRowCell: (row) => {
        if (row.record_service_counts)
          return (
            <div
              onClick={() => {
                setModalName("testModal");
                setExecutionModal(row?.is_execution_token_show);
                setSelectedRowData(row);
              }}
            >
              {row?.record_service_counts}
            </div>
          );
        else return 0;
      },
      width: 100,
    },
    {
      key: "base_amount",
      name: "Base Amount",
      renderRowCell: (row) => row.base_amount,
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "invoice_download",
      name: "Invoice Request",
      compare: true,
      renderRowCell: (row) =>
        row.gst_amount > 0 ? (
          row?.campaign_amount == row?.invoice_requested_amount &&
          "uploaded" == row?.invoice_request_status ? (
            "Total Invoice Requested Amount Equals to Campaign Amount"
          ) : row.invoice_request_status !== "requested" ? (
            <>
              <div
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => openModal(row, "Invoice")}
              >
                Request for Invoice
              </div>
            </>
          ) : (
            "Invoice Requested"
          )
        ) : (
          "N/A"
        ),
      comapare: true,
      showCol: true,
      width: 100,
    },
    {
      key: "gst_amount",
      name: "GST Amount",
      renderRowCell: (row) => row.gst_amount,
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "approved_amount",
      compare: true,
      name: "Approved Amount",
      renderRowCell: (row) => row.approved_amount,
      width: 100,
      getTotal: true,
    },
    {
      key: "Payment Requested",
      name: "Payment Requested",
      comapare: true,
      renderRowCell: (row) => (
        <div
          style={{
            color: `${row.requested_amount > 0 ? "green" : "red"}`,
          }}
        >
          {row.requested_amount > 0 ? "Requested" : "Not Requested"}
        </div>
      ),
      width: 100,
    },
    {
      key: "requested_amount",
      name: "Requested Amount",
      renderRowCell: (row) => row?.requested_amount,
      colorRow: (row) => {
        if (row?.incentive_earning_status === "earned") {
          return "#c4fac4";
        } else {
          return "#ffff008c";
        }
      },
      width: 100,
      getTotal: true,
      compare: true,
    },
    {
      key: "Outstanding_Amount",
      name: "Outstanding Amount",
      renderRowCell: (row) => row.campaign_amount - row.approved_amount,
      width: 100,
      getTotal: true,
      compare: true,
    },
    {
      key: "incentive_status",
      name: "Incentive",
      renderRowCell: (row) =>
        row.incentive_status === "incentive" ? "Yes" : "No",
      showCol: true,
      width: 100,
    },
    {
      key: "incentive_amount",
      name: "Incentive Amount",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "incentive_percent",
      name: "Incentive Percent",
      renderRowCell: (row) => (row.incentive_amount / row?.base_amount) * 100,
      showCol: true,
      width: 100,
    },
    {
      key: "earned_incentive_amount",
      name: "Earned Incentive",
      renderRowCell: (row) => row.earned_incentive_amount,
      compare: true,
      showCol: true,
      width: 100,
      getTotal: true,
    },

    {
      key: "createdAt",
      name: "Booking Date Created",
      compare: true,
      renderRowCell: (row) => DateISOtoNormal(row.createdAt),
      showCol: true,
      width: 100,
    },
    {
      key: "record_service_amount",
      name: "Record Service Amount",
      renderRowCell: (row) => row.record_service_amount,
      showCol: true,
      width: 100,
    },
    {
      key: "booking_status",
      name: "Booking Status",
      renderRowCell: (row) =>
        row.booking_status === "Request for Execution" ? (
          <div
            onClick={() => openModal(row, "Execution")}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Request for Execution
          </div>
        ) : (
          row.booking_status
        ),
      width: 200,
      showCol: true,
    },
    {
      key: "multiSharing",
      name: "Incentive Multisharing",
      renderRowCell: (row) => (row?.is_incentive_sharing ? "Yes" : "No"),
      showCol: true,
      width: 100,
      compare: true,
    },
    {
      key: "record_service_file_url",
      name: "Record Service File",
      renderRowCell: (row) =>
        row.record_service_file_url ? (
          <div className="flex-row">
            <a
              className="icon-1"
              target="_blank"
              href={row?.record_service_file_url}
            >
              <i className="bi bi-download" />
            </a>

            <a
              href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                row?.record_service_file_url
              )}&embedded=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-1"
            >
              <i className="bi bi-eye" />
            </a>
          </div>
        ) : (
          "N/A"
        ),
      width: 200,
      showCol: true,
    },
    {
      key: "salesInvoiceRequestData",
      name: "Proforma Invoice",
      width: 100,
      renderRowCell: (row) => {
        const save = row?.salesInvoiceRequestData?.find(
          (obj) => obj?.invoice_type_id == "proforma"
        )?.invoice_file;
        if (save)
          return (
            <div className="flex-row gap-1">
              <a
                className="icon-1"
                target="_blank"
                href={row?.url + "/" + save}
              >
                <i className="bi bi-eye" />
              </a>
              <Link
                target="_blank"
                to={row?.url + "/" + save}
                download={true}
                className="icon-1"
              >
                <i className="bi bi-download" />
              </Link>
            </div>
          );
        else return "N/A";
      },
    },
    {
      key: "TaxInvoice",
      name: "Tax Invoice",
      compare: true,
      width: 100,
      renderRowCell: (row) => {
        const save = row?.salesInvoiceRequestData?.filter(
          (obj) =>
            obj?.invoice_type_id == "tax-invoice" &&
            obj?.invoice_creation_status == "uploaded"
        );
        if (save?.length == 0) {
          return "N/A";
        } else if (save?.length == 1) {
          return (
            <a
              className="icon-1"
              target="__blank"
              href={row?.url + "/" + save[0]?.invoice_file}
            >
              <i className="bi bi-eye" />
            </a>
          );
        } else {
          return (
            <button
              className="icon-1"
              onClick={() => openModal(row, "InvoiceDownload")}
            >
              {
                save?.filter(
                  (item) => item.invoice_creation_status == "uploaded"
                ).length
              }
            </button>
          );
        }
      },
    },

    {
      key: "actions",
      name: "Actions",
      width: 100,
      renderRowCell: (row) => (
        <>
          {!row?.is_dummy_sale_booking && (
            <div className="flex-row">
              {/* {row.incentive_earning_status === "un-earned" &&  */}
              <Link
                title="Edit sale booking"
                to={`/admin/create-sales-booking/${row.sale_booking_id}/${row._id}`}
              >
                <div className="icon-1">
                  <i className="bi bi-pencil" />
                </div>
              </Link>
              {/* } */}

              {loginUserRole == 1 && (
                <DeleteButton
                  endpoint={"sales/sales_booking"}
                  id={row._id}
                  getData={refetchSaleBooking}
                />
              )}

              {row?.campaign_amount >= row?.approved_amount && (
                <button
                  title="Payment Update"
                  className="icon-1"
                  onClick={() => {
                    navigate(`/admin/create-payment-update/0`, {
                      state: {
                        sale_id: row.sale_booking_id,
                        userdata: row,
                      },
                    });
                  }}
                >
                  <i className="bi bi-credit-card-2-back" />
                </button>
              )}
            </div>
          )}
        </>
      ),
      showCol: true,
    },
  ];

  if (loginUserRole == 1) {
    columns.push({
      key: "executive_name",
      name: "Executive name",
      compare: true,
      renderRowCell: (row) =>
        userContextData?.find((user) => user?.user_id === row?.created_by)
          ?.user_name,
      showCol: true,
      width: 100,
    });
  }

  return (
    <div>
      <Modal
        className="executionModal"
        isOpen={executionModal}
        onRequestClose={closeModal}
        contentLabel="modal"
        preventScroll={true}
        appElement={document.getElementById("root")}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            height: "100vh",
          },
          content: {
            position: "absolute",

            maxWidth: "900px",
            top: "50px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
            maxHeight: "650px",
          },
        }}
      >
        {renderModalComponent(modalName)}
      </Modal>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={"Sale Bookings Overview"} link={true} />
        </div>
        <div className="action_btns">
          {loginUserRole == 1 && (
            <Link to={"/admin/view-payment-details"}>
              <button className="btn cmnbtn btn-primary btn_sm">
                Payment Details
              </button>
            </Link>
          )}
          {loginUserRole == 1 && (
            <Link to={"/admin/sales-services-overview"}>
              <button className="btn cmnbtn btn-primary btn_sm">
                Services
              </button>
            </Link>
          )}
          <Link to={"/admin/record-servcies"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Record Services
            </button>
          </Link>
          <Link to={"/admin/sales-account-overview"}>
            <button className="btn cmnbtn btn-primary btn_sm">Accounts</button>
          </Link>
          <Link to={"/admin/view-payment-update"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Payment update
            </button>
          </Link>
          <Link to={"/admin/create-sales-booking"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Create Sale Booking
            </button>
          </Link>
        </div>
      </div>

      <div className="card mt24">
        <div className="card-body row">
          <CustomSelect
            label="Campaign Name"
            fieldGrid={4}
            dataArray={campaignList}
            optionId="exe_campaign_name"
            optionLabel="exe_campaign_name"
            selectedId={filterByCampaignName}
            setSelectedId={setFilterByCampaignName}
          />
          <CustomSelect
            label="Account Name"
            fieldGrid={4}
            dataArray={allAccount}
            optionId="account_id"
            optionLabel="account_name"
            selectedId={filterByAccountName}
            setSelectedId={setFilterByAccountName}
          />
          {loginUserRole === 1 && (
            <CustomSelect
              label="Sales Executive Name"
              fieldGrid={4}
              dataArray={userContextData?.filter((item) => item.dept_id == 36)}
              optionId="user_id"
              optionLabel="user_name"
              selectedId={filterBySalesExecutiveName}
              setSelectedId={setFilterBySalesExecutiveName}
            />
          )}

          <CustomSelect
            label="Incentive Status"
            fieldGrid={4}
            dataArray={incentiveFilterOption}
            optionId="value"
            optionLabel="label"
            selectedId={filterByIncentive}
            setSelectedId={setFilterByIncentive}
          />
          <CustomSelect
            label="date"
            fieldGrid={4}
            dataArray={dateFilterOptions}
            optionId="value"
            optionLabel="label"
            selectedId={quickFiltring}
            setSelectedId={setQuickFiltring}
          />
          {quickFiltring === "custom" && (
            <>
              <FieldContainer
                type="date"
                label="From Date"
                fieldGrid={4}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <FieldContainer
                type="date"
                label="To Date"
                fieldGrid={4}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </>
          )}
          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 flexCenter colGap12 pt8 mb-3">
            <button
              className="cmnbtn btn-primary"
              onClick={() => dataFiltter()}
            >
              Search
            </button>
            {allSaleBooking?.length !== filteredData?.length && (
              <button
                className="iconBtn btn btn-outline-danger"
                onClick={() => handelRemoveFiltter()}
              >
                <i className="bi bi-x-circle"></i>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="cardAccordion">
        <Accordion>
          <AccordionSummary
            className="flexCenter"
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <h5 className="card-title">Pivot</h5>
          </AccordionSummary>
          <AccordionDetails>
            <CustomTable
              columns={pivotColumn}
              data={pivotData}
              dataLoading={allSaleBookingLoading || allAccountLoading}
              title={"Sale Booking Pivot"}
              Pagination
              tableName={"SaleBookingPivotView"}
              showTotal={true}
            />
          </AccordionDetails>
        </Accordion>
      </div>
      <View
        columns={columns}
        data={filteredData}
        isLoading={allSaleBookingLoading || allAccountLoading}
        title={"Sale Booking"}
        // rowSelectable={true}
        pagination={[100, 200]}
        tableName={"SaleBookingView"}
        showTotal={true}
        // rowSelectable={true}
      />
    </div>
  );
};

export default ViewSaleBooking;
