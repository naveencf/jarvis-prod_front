import moment from "moment";
import FormatString from "../FormateString/FormatString";
import { Link } from "react-router-dom";
import pdfImg from "../pdf-file.png";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Autocomplete, Badge, Button, TextField } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";

export const saleBookingCloseColumns = ({
  filterData = [],
  handleOpenVerifyDialog,
}) => [
  {
    field: "s_no",
    headerName: "S.No",
    renderCell: (params) => (
      <div>{[...filterData].indexOf(params.row) + 1}</div>
    ),
    sortable: true,
  },
  {
    field: "sale_booking_id",
    headerName: "Booking Id",
    renderCell: (params) => {
      return <div>{params.row.sale_booking_id}</div>;
    },
    width: 150,
  },
  {
    field: "account_name",
    headerName: "Account Name",
    renderCell: (params) => {
      return <div>{FormatString(params.row.account_name)}</div>;
    },
    width: 150,
  },
  {
    field: "created_by_name",
    headerName: "Sales Executive Name",
    renderCell: (params) => (
      <div>{FormatString(params.row.created_by_name)}</div>
    ),
    width: 200,
  },
  {
    field: "sale_booking_date",
    headerName: "Booking Date",
    renderCell: (params) =>
      moment(params.row.sale_booking_date).format("DD/MM/YYYY"),
    width: 150,
  },
  {
    field: "campaign_amount",
    headerName: "Campaign Amount",
    renderCell: (params) => params.row.campaign_amount,
    width: 150,
  },

  {
    field: "base_amount",
    headerName: "Base Amount",
    renderCell: (params) => params.row.base_amount,
    width: 150,
  },
  {
    field: "tds_amount",
    headerName: "TDS Amount",
    width: 150,
    renderCell: (params) => (
      <div>{params.row.tds_amount !== "" ? params.row.tds_amount : 0}</div>
    ),
  },
  {
    field: "tds_percentage",
    headerName: "TDS Percentage",
    width: 150,
    renderCell: (params) => <div>{params.row.tds_percentage} %</div>,
  },
  {
    field: "gst_amount",
    headerName: "GST Amount",
    renderCell: (params) => params.row.gst_amount,
    width: 150,
  },
  {
    field: "paid_amount",
    headerName: "Paid Amount",
    renderCell: (params) => params.row.paid_amount,
    width: 150,
  },

  // {
  //   field: "total_refund_amount",
  //   headerName: "Refund Amount",
  //   width: 150,

  //   renderCell: (params) => params.row.total_refund_amount,
  // },
  // {
  //   field: "balance_refund_amount",
  //   headerName: "Refund Balance Amount",
  //   width: 250,

  //   renderCell: (params) => params.row.balance_refund_amount,
  // },
  // {
  //   field: "net_balance_amount_to_pay_percentage",
  //   headerName: "Net Bal Cust to pay Amt (%)",
  //   renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
  //   width: 250,
  // },
  {
    field: "booking_created_date",
    headerName: "Booking Created Date",
    renderCell: (params) => params.row.booking_created_date,
    width: 200,
  },
  {
    field: "tds_status",
    headerName: "Status",
    renderCell: (params) => FormatString(params.row.tds_status),
  },
  {
    field: "Transaction History",
    headerName: "Transaction History",
    width: 190,
    renderCell: (params) => (
      <div className="flex-row">
        {params.row.tds_status === "close" && (
          <Link
            to={`/admin/finance-transaction-list/${params.row.sale_booking_id}`}
            className="link-primary"
          >
            {params.row.paid_amount > 0 ? (
              <button className="icon-1" title="Transaction History">
                <i className="bi bi-file-earmark-text-fill"></i>
              </button>
            ) : (
              ""
            )}
          </Link>
        )}
      </div>
    ),
  },
  {
    field: "Action",
    headerName: "Action",
    renderCell: (params) => {
      return (
        <div className="flex-row gap16">
          {/* {params.row.tds_status === "close" ? ( */}
          <button
            className="btn cmnbtn btn_sm btn-outline-primary mr4"
            onClick={(e) => handleOpenVerifyDialog(e, params.row)}
          >
            Verify
          </button>
          {/* ) : null} */}
        </div>
      );
    },
  },
  // {
  //   field: "Action",
  //   fieldName: "Action",
  //   renderCell: (params) => <></>,
  //   width: "170px",
  // },
];

export const uniqueSaleBookingAccountColumn = ({
  uniqueCustomerData = [],
  handleOpenVerifyDialog,
  handleOpenSameAccount,
}) => [
  {
    field: "S.No",
    width: 80,

    renderCell: (params, index) => (
      <div>{[...uniqueCustomerData].indexOf(params.row) + 1}</div>
    ),
    sortable: true,
  },
  {
    field: "sale_booking_id",
    headerName: "Booking Id",
    renderCell: (params) => {
      return <div>{params.row.sale_booking_id}</div>;
    },
  },
  {
    field: "Account Name",
    fieldName: "account_name",
    width: 200,
    renderCell: (params) => (
      <a
        href="#"
        style={{
          cursor: "pointer",
          color: "blue",
        }}
        onClick={() => handleOpenSameAccount(params.row.account_name)}
        title={params.row.account_name}
      >
        {params.row.account_name}
      </a>
    ),
  },
  {
    field: "created_by_name",
    headerName: "Sales Executive Name",
    renderCell: (params) => <div>{params.row.created_by_name}</div>,
    width: 200,
  },
  {
    field: "sale_booking_date",
    headerName: "Booking Date",
    renderCell: (params) =>
      moment(params.row.sale_booking_date).format("DD/MM/YYYY"),
    width: 150,
  },
  {
    field: "campaign_amount",
    headerName: "Campaign Amount",
    renderCell: (params) => params.row.campaign_amount,
    width: 150,
  },

  {
    field: "base_amount",
    headerName: "Base Amount",
    renderCell: (params) => params.row.base_amount,
    width: 150,
  },
  {
    field: "tds_amount",
    headerName: "TDS Amount",
    width: 150,
    renderCell: (params) => (
      <div>{params.row.tds_amount !== "" ? params.row.tds_amount : 0}</div>
    ),
  },
  {
    field: "tds_percentage",
    headerName: "TDS Percentage",
    width: 150,
    renderCell: (params) => <div>{params.row.tds_percentage} %</div>,
  },
  {
    field: "gst_amount",
    headerName: "GST Amount",
    renderCell: (params) => params.row.gst_amount,
    width: 150,
  },
  {
    field: "paid_amount",
    headerName: "Paid Amount",
    renderCell: (params) => params.row.paid_amount,
    width: 150,
  },
  {
    field: "booking_created_date",
    headerName: "Booking Created Date",
    renderCell: (params) => params.row.booking_created_date,
    width: 200,
  },
  {
    field: "tds_status",
    headerName: "Status",
    renderCell: (params) => params.row.tds_status,
  },
  {
    field: "Transaction History",
    headerName: "Transaction History",
    width: 190,
    renderCell: (params) => (
      <div className="flex-row">
        {params.row.tds_status === "close" && (
          <Link
            to={`/admin/finance-transaction-list/${params.row.sale_booking_id}`}
            className="link-primary"
          >
            {params.row.paid_amount > 0 ? (
              <button className="icon-1" title="Transaction History">
                <i className="bi bi-file-earmark-text-fill"></i>
              </button>
            ) : (
              ""
            )}
          </Link>
        )}
      </div>
    ),
  },
  {
    field: "Action",
    headerName: "Action",
    renderCell: (params) => {
      return (
        <div className="flex-row gap16">
          {params.row.tds_status === "close" ? (
            <button
              className="btn cmnbtn btn_sm btn-outline-primary mr4"
              onClick={(e) => handleOpenVerifyDialog(e, params.row)}
            >
              Verify
            </button>
          ) : null}
        </div>
      );
    },
  },
  // {
  //   field: "Action",
  //   fieldName: "Action",
  //   renderCell: (params) => <></>,
  //   width: "170px",
  // },
];

export const uniqueSaleBookingSalesExecutiveColumn = ({
  uniqueSalesExecutiveData = [],
  handleOpenVerifyDialog,
  handleOpenSameSalesExecutive,
}) => [
  {
    field: "S.No",
    renderCell: (params) => (
      <div>{[...uniqueSalesExecutiveData]?.indexOf(params.row) + 1}</div>
    ),
    sortable: true,
    width: 80,
  },
  // {
  //   field: "sale_booking_id",
  //   headerName: "Booking Id",
  //   renderCell: (params) => {
  //     return <div>{params.row.sale_booking_id}</div>;
  //   },
  // },
  // {
  //   field: "Account Name",
  //   fieldName: "account_name",
  //   renderCell: (params) => {
  //     return <div>{params.row.account_name}</div>;
  //   },
  //   width: 200,
  // },
  {
    field: "Sales Executive Name",
    fieldName: "created_by_name",
    renderCell: (params) => (
      <a
        href="#"
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => handleOpenSameSalesExecutive(params.row.created_by_name)}
      >
        {params.row.created_by_name}
      </a>
    ),
    width: 200,
  },
  // {
  //   field: "sale_booking_date",
  //   headerName: "Booking Date",
  //   renderCell: (params) =>
  //     moment(params.row.sale_booking_date).format("DD/MM/YYYY"),
  //   width: 150,
  // },
  {
    field: "campaign_amount",
    headerName: "Campaign Amount",
    renderCell: (params) => params.row.campaign_amount,
    width: 150,
  },

  {
    field: "base_amount",
    headerName: "Base Amount",
    renderCell: (params) => params.row.base_amount,
    width: 150,
  },
  {
    field: "tds_amount",
    headerName: "TDS Amount",
    width: 150,
    renderCell: (params) => (
      <div>{params.row.tds_amount !== "" ? params.row.tds_amount : 0}</div>
    ),
  },
  {
    field: "tds_percentage",
    headerName: "TDS Percentage",
    width: 150,
    renderCell: (params) => <div>{params.row.tds_percentage} %</div>,
  },
  {
    field: "gst_amount",
    headerName: "GST Amount",
    renderCell: (params) => params.row.gst_amount,
    width: 150,
  },
  {
    field: "paid_amount",
    headerName: "Paid Amount",
    renderCell: (params) => params.row.paid_amount,
    width: 150,
  },

  // {
  //   field: "total_refund_amount",
  //   headerName: "Refund Amount",
  //   width: 150,

  //   renderCell: (params) => params.row.total_refund_amount,
  // },
  // {
  //   field: "balance_refund_amount",
  //   headerName: "Refund Balance Amount",
  //   width: 250,

  //   renderCell: (params) => params.row.balance_refund_amount,
  // },
  // {
  //   field: "net_balance_amount_to_pay_percentage",
  //   headerName: "Net Bal Cust to pay Amt (%)",
  //   renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
  //   width: 250,
  // },
  // {
  //   field: "booking_created_date",
  //   headerName: "Booking Created Date",
  //   renderCell: (params) => params.row.booking_created_date,
  //   width: 200,
  // },
  // {
  //   field: "tds_status",
  //   headerName: "Status",
  //   renderCell: (params) => params.row.tds_status,
  // },
  {
    field: "Transaction History",
    headerName: "Transaction History",
    width: 190,
    renderCell: (params) => (
      <div className="flex-row">
        {params.row.tds_status === "close" && (
          <Link
            to={`/admin/finance-transaction-list/${params.row.sale_booking_id}`}
            className="link-primary"
          >
            {params.row.paid_amount > 0 ? (
              <button className="icon-1" title="Transaction History">
                <i className="bi bi-file-earmark-text-fill"></i>
              </button>
            ) : (
              ""
            )}
          </Link>
        )}
      </div>
    ),
  },
  {
    field: "Action",
    headerName: "Action",
    renderCell: (params) => {
      return (
        <div className="flex-row gap16">
          {params.row.tds_status === "close" ? (
            <button
              className="btn cmnbtn btn_sm btn-outline-primary mr4"
              onClick={(e) => handleOpenVerifyDialog(e, params.row)}
            >
              Verify
            </button>
          ) : null}
        </div>
      );
    },
  },
];

export const saleBookingVerifyColumn = ({ filterData }) => [
  {
    field: "S.No",
    width: 80,

    renderCell: (params, index) => (
      <div>{[...filterData].indexOf(params.row) + 1}</div>
    ),
    sortable: true,
  },
  {
    field: "sale_booking_id",
    headerName: "Booking Id",
    renderCell: (params) => {
      return <div>{params.row.sale_booking_id}</div>;
    },
    width: 150,
  },
  {
    field: "account_name",
    headerName: "Account Name",
    renderCell: (params) => FormatString(params.row.account_name),
    width: 150,
  },
  {
    field: "created_by_name",
    headerName: "Sales Executive Name",
    renderCell: (params) => FormatString(params.row.created_by_name),
    width: 150,
  },
  {
    field: "sale_booking_date",
    headerName: "Booking Date",
    width: 150,
    renderCell: (params) =>
      moment(params.row.sale_booking_date).format("DD-MM-YYYY HH:MM"),
  },
  {
    field: "campaign_amount",
    headerName: "Campaign Amount",
    renderCell: (params) => params.row.campaign_amount,
    width: 150,
  },
  {
    field: "base_amount",
    headerName: "Base Amount",
    renderCell: (params) => params.row.base_amount,
    width: 150,
  },
  {
    field: "tds_amount",
    headerName: "TDS Amount",
    width: 150,
    renderCell: (params) => (
      <div>{params.row.tds_amount !== "" ? params.row.tds_amount : 0}</div>
    ),
  },
  {
    field: "tds_percentage",
    headerName: "TDS Percentage",
    width: 150,
    renderCell: (params) => <div>{params.row.tds_percentage}</div>,
  },
  {
    field: "gst_amount",
    headerName: "GST Amount",
    renderCell: (params) => params.row.gst_amount,
    width: 150,
  },
  {
    field: "paid_amount",
    headerName: "Paid Amount",
    renderCell: (params) => params.row.paid_amount,
    width: 150,
  },
  // {
  //   field: "total_refund_amount",
  //   headerName: "Refund Amount",
  //   renderCell: (params) => params.row.total_refund_amount,
  //   width: 150,
  // },
  // {
  //   field: "balance_refund_amount",
  //   headerName: "Refund Balance Amount",

  //   renderCell: (params) => {
  //     return params.row.balance_refund_amount;
  //   },
  //   width: 200,
  // },
  {
    field: "Balance Amount",
    headerName: "Balance Amount",
    renderCell: (params) => {
      return params.row.campaign_amount - params.row.paid_amount;
    },
    width: 150,
  },
  // {
  //   field: "net_balance_amount_to_pay",
  //   headerName: "Net Bal Cust to pay Amt",
  //   renderCell: (params) => params.row.net_balance_amount_to_pay,
  //   width: 200,
  // },
  // {
  //   field: "net_balance_amount_to_pay_percentage",
  //   headerName: "Net Bal Cust to pay Amt (%)",
  //   renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
  //   width: 200,
  // },
  {
    field: "createdAt",
    headerName: "Booking Created Date",
    renderCell: (params) =>
      moment(params.row.createdAt).format("DD-MM-YYYY HH:MM"),
    width: 200,
  },
];

export const uniqueSalesExeVerifyColumn = ({
  uniqueSalesExecutiveData = [],
  handleOpenSameSalesExecutive,
}) => [
  {
    field: "S.No",
    width: 80,

    renderCell: (params, index) => (
      <div>{[...uniqueSalesExecutiveData].indexOf(params.row) + 1}</div>
    ),
    sortable: true,
  },
  {
    field: "sale_booking_id",
    headerName: "Booking Id",
    renderCell: (params) => {
      return <div>{params.row.sale_booking_id}</div>;
    },
  },
  {
    field: "Account Name",
    fieldName: "account_name",
    width: 200,

    renderCell: (params) => <div>{params.row.account_name}</div>,
  },
  {
    field: "Sales Executive Name",
    fieldName: "created_by_name",
    width: 200,

    renderCell: (params) => (
      <a
        style={{ cursor: "pointer", color: "blue" }}
        href="#"
        onClick={() => handleOpenSameSalesExecutive(params.row.created_by_name)}
      >
        {params.row.created_by_name}
      </a>
    ),
  },
  {
    field: "sale_booking_date",
    headerName: "Booking Date",
    renderCell: (params) =>
      moment(params.row.sale_booking_date).format("DD-MM-YYYY HH:MM"),
    width: 150,
  },
  {
    field: "campaign_amount",
    headerName: "Campaign Amount",
    renderCell: (params) => params.row.campaign_amount,
    width: 150,
  },
  {
    field: "base_amount",
    headerName: "Base Amount",
    renderCell: (params) => params.row.base_amount,
    width: 150,
  },
  {
    field: "tds_amount",
    headerName: "TDS Amount",
    width: 150,
    renderCell: (params) => (
      <div>{params.row.tds_amount !== "" ? params.row.tds_amount : 0}</div>
    ),
  },
  {
    field: "tds_percentage",
    headerName: "TDS Amount",
    width: 150,
    renderCell: (params) => <div>{params.row.tds_percentage}</div>,
  },
  {
    field: "gst_amount",
    headerName: "GST Amount",
    renderCell: (params) => params.row.gst_amount,
    width: 150,
  },
  {
    field: "paid_amount",
    headerName: "Paid Amount",
    renderCell: (params) => params.row.paid_amount,
    width: 150,
  },
  // {
  //   field: "total_refund_amount",
  //   headerName: "Refund Amount",
  //   renderCell: (params) => params.row.total_refund_amount,
  //   width: 150,
  // },
  // {
  //   field: "balance_refund_amount",
  //   headerName: "Refund Balance Amount",

  //   renderCell: (params) => {
  //     return params.row.balance_refund_amount;
  //   },
  //   width: 200,
  // },
  {
    field: "Balance Amount",
    headerName: "Balance Amount",
    renderCell: (params) => {
      return params.row.campaign_amount - params.row.paid_amount;
    },
    width: 150,
  },
  // {
  //   field: "net_balance_amount_to_pay",
  //   headerName: "Net Bal Cust to pay Amt",
  //   renderCell: (params) => params.row.net_balance_amount_to_pay,
  //   width: 200,
  // },
  // {
  //   field: "net_balance_amount_to_pay_percentage",
  //   headerName: "Net Bal Cust to pay Amt (%)",
  //   renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
  //   width: 200,
  // },
  {
    field: "createdAt",
    headerName: "Booking Created Date",
    renderCell: (params) =>
      moment(params.row.createdAt).format("DD-MM-YYYY HH:MM"),
    width: 200,
  },
];

export const uniqueAccountVerifyColumn = ({
  uniqueCustomerData = [],
  handleOpenSameCustomer,
}) => [
  {
    field: "S.No",
    width: 80,

    renderCell: (params) => (
      <div>{[...uniqueCustomerData].indexOf(params.row) + 1}</div>
    ),
    sortable: true,
  },
  {
    field: "sale_booking_id",
    headerName: "Booking Id",
    renderCell: (params) => {
      return <div>{params.row.sale_booking_id}</div>;
    },
  },
  {
    field: "Account Name",
    fieldName: "account_name",
    width: 200,
    renderCell: (params) => (
      <a
        href="#"
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => handleOpenSameCustomer(params.row.account_name)}
      >
        {params.row.account_name}
      </a>
    ),
  },
  {
    field: "created_by_name",
    headerName: "Sales Executive Name",
    renderCell: (params) => params.row.created_by_name,
    width: 150,
  },
  {
    field: "sale_booking_date",
    headerName: "Booking Date",
    renderCell: (params) =>
      moment(params.row.sale_booking_date).format("DD-MM-YYYY HH:MM"),

    width: 150,
  },
  {
    field: "campaign_amount",
    headerName: "Campaign Amount",
    renderCell: (params) => params.row.campaign_amount,
    width: 150,
  },
  {
    field: "base_amount",
    headerName: "Base Amount",
    renderCell: (params) => params.row.base_amount,
    width: 150,
  },
  {
    field: "tds_amount",
    headerName: "TDS Amount",
    width: 150,
    renderCell: (params) => (
      <div>{params.row.tds_amount !== "" ? params.row.tds_amount : 0}</div>
    ),
  },
  {
    field: "tds_percentage",
    headerName: "TDS Amount",
    width: 150,
    renderCell: (params) => <div>{params.row.tds_percentage}</div>,
  },
  {
    field: "gst_amount",
    headerName: "GST Amount",
    renderCell: (params) => params.row.gst_amount,
    width: 150,
  },
  {
    field: "paid_amount",
    headerName: "Paid Amount",
    renderCell: (params) => params.row.paid_amount,
    width: 150,
  },
  // {
  //   field: "total_refund_amount",
  //   headerName: "Refund Amount",
  //   renderCell: (params) => params.row.total_refund_amount,
  //   width: 150,
  // },
  // {
  //   field: "balance_refund_amount",
  //   headerName: "Refund Balance Amount",

  //   renderCell: (params) => {
  //     return params.row.balance_refund_amount;
  //   },
  //   width: 200,
  // },
  {
    field: "Balance Amount",
    headerName: "Balance Amount",
    renderCell: (params) => {
      return params.row.campaign_amount - params.row.paid_amount;
    },
    width: 150,
  },
  // {
  //   field: "net_balance_amount_to_pay",
  //   headerName: "Net Bal Cust to pay Amt",
  //   renderCell: (params) => params.row.net_balance_amount_to_pay,
  //   width: 200,
  // },
  // {
  //   field: "net_balance_amount_to_pay_percentage",
  //   headerName: "Net Bal Cust to pay Amt (%)",
  //   renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
  //   width: 200,
  // },
  {
    field: "createdAt",
    headerName: "Booking Created Date",
    renderCell: (params) =>
      moment(params.row.createdAt).format("DD-MM-YYYY HH:MM"),
    width: 200,
  },
];

export const pendingApprovalColumn = ({
  filterData = [],
  handleCopyDetail,
  paymentModeArray,
  handleStatusChange,
  setViewImgSrc,
  setViewImgDialog,
}) => [
  {
    field: "s_no",
    headerName: "S.NO",
    width: 70,
    renderCell: (params, index) => (
      <div>{[...filterData].indexOf(params.row) + 1}</div>
    ),
  },
  {
    field: "account_name",
    headerName: "Account Name",
    width: 260,
    renderCell: (params) => (
      <div
        style={{ cursor: "pointer" }}
        onClick={() => handleOpenSameAccounts(params.row.account_name)}
      >
        {FormatString(params.row.account_name)}{" "}
      </div>
    ),
  },
  {
    headerName: "Requested By",
    field: "created_by_name",
    width: 180,
    name: <div style={{ whiteSpace: "normal" }}>Requested By</div>,
    renderCell: (params, index) => (
      <div>{FormatString(params.row.created_by_name)} </div>
    ),
  },
  {
    headerName: "Sale Booking Date & Time",
    field: "sale_booking_date",
    width: 180,
    renderCell: (params) =>
      moment(params.row.sale_booking_date).format("DD/MM/YYYY HH:MM"),
  },

  {
    headerName: "Campaign Amount",
    field: "campaign_amount",
    width: 180,
    renderCell: (params) => <div>{params.row.campaign_amount} </div>,
  },
  {
    headerName: "Campaign Amount Without GST",
    field: "base_amount",
    width: 180,
    renderCell: (params) => <div>{params.row.base_amount} </div>,
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
    headerName: "Payment Screenshot",
    field: "payment_screenshot",
    width: 180,
    renderCell: (params) => {
      const imgUrl = params.row.payment_screenshot_url;

      if (!imgUrl) {
        return "No Image";
      }

      // Extract file extension and check if it's a PDF
      const fileExtension = imgUrl?.split(".")?.pop()?.toLowerCase();
      const isPdf = fileExtension === "pdf";

      return isPdf ? (
        <img
          onClick={() => {
            setViewImgDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={pdfImg} // Display a PDF icon
          alt="PDF Preview"
          style={{ width: "40px", height: "40px", cursor: "pointer" }}
          title="PDF Preview"
        />
      ) : (
        <img
          onClick={() => {
            setViewImgDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={imgUrl}
          alt="Payment Screenshot"
          style={{ width: "100px", height: "100px", cursor: "pointer" }}
        />
      );
    },
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
    headerName: "Payment Amount",
    field: "payment_amount",
    width: 180,
    renderCell: (params) => <div>{params.row.payment_amount} </div>,
  },
  {
    headerName: "Payment Mode",
    field: "payment_mode",
    width: 180,
    renderCell: (params) => {
      // const pmData =
      //   paymentModeArray.find((mode) => mode._id === params.row.payment_mode)
      //     ?.payment_mode_name || "";

      return <div>{params.row.payment_mode_name} </div>;
    },
  },
  {
    headerName: "Payment Status",
    field: "payment_approval_status",
    width: 190,
    renderCell: (params) => (
      <div>
        {params.row.payment_approval_status === "pending" ? "Pending" : ""}
      </div>
    ),
  },
  {
    headerName: "Bank Name ",
    field: "title",
    width: 180,
    renderCell: (params) => (
      <div>{FormatString(params.row.payment_detail.title)} </div>
    ),
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
        {FormatString(params.row.payment_detail.details)}
      </div>
    ),
    // width: 150,
  },
  {
    headerName: "Reference No ",
    field: "payment_ref_no",
    width: 190,
    renderCell: (params) => <div>{params.row.payment_ref_no} </div>,
  },
  {
    headerName: "Remarks ",
    field: "remarks",
    width: 200,
    renderCell: (params) => <div>{FormatString(params.row.remarks)} </div>,
  },
  {
    width: 200,
    // field: "Status",
    headerName: "Status",
    renderCell: ({ row }) => (
      <>
        <Autocomplete
          className="my-2"
          id="combo-box-demo"
          value={row.statusDropdown || null}
          options={[
            { label: "Approved", value: "approval" },
            { label: "Rejected", value: "reject" },
          ]}
          getOptionLabel={(option) => option?.label}
          onChange={(event, newValue) => {
            // console.log(newValue, "newValue--- newValueData---");
            handleStatusChange(row, newValue?.value);
            row.statusDropdown = newValue;
          }}
          style={{ width: 180 }}
          renderInput={(params) => (
            <TextField {...params} label="Status" variant="outlined" />
          )}
        />
      </>
    ),
  },

  {
    headerName: "Payment Requested Date and Time ",
    field: "createdAt",
    width: 180,
    renderCell: (params) => (
      <div>
        {params.row.createdAt
          ? moment(params.row.createdAt).format("DD/MM/YYYY HH:MM")
          : ""}{" "}
      </div>
    ),
  },
  // {
  //   field: "Action ",
  //   renderCell: (params) => (
  //     <>
  //       <Link to={`/admin/payment-summary/${params.row.cust_id}`}>
  //         <button
  //           title="Summary"
  //           className="btn tableIconBtn btn_sm btn-outline-primary user-button"
  //         >
  //           <i className="bi bi-journal-text"></i>
  //         </button>
  //       </Link>
  //     </>
  //   ),
  // },
];

export const uniquePendingApprovalSalesExecutiveColumn = ({
  uniqueSalesExecutiveData = [],
  handleOpenSameSalesExecutive,
  handleStatusChange,
}) => [
  {
    field: "s_no",
    headerName: "S.No",
    renderCell: (params, index) => (
      // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

      <div>{[...uniqueSalesExecutiveData].indexOf(params.row) + 1}</div>
    ),
  },
  {
    field: "account_name",
    headerName: "Account Name",
    width: 260,
    renderCell: (params) => <div>{params.row.account_name} </div>,
  },
  {
    headerName: "Requested By",
    field: "sales_executive_name",
    width: 180,
    name: <div style={{ whiteSpace: "normal" }}>Requested By</div>,
    renderCell: (params, index) => (
      <a
        style={{ cursor: "pointer", color: "blue" }}
        href="#"
        onClick={() => handleOpenSameSalesExecutive(params.row.created_by_name)}
      >
        {params.row.created_by_name}{" "}
      </a>
    ),
  },
  {
    field: "campaign_amount",
    headerName: "Campaign Amount Without GST",
    renderCell: (params) => <div>{params.row.campaign_amount} </div>,
  },
  {
    field: "base_amount",
    headerName: "Campaign Amount Without GST",
    renderCell: (params) => <div>{params.row.base_amount} </div>,
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
    width: 200,
    // field: "Status",
    headerName: "Status",
    renderCell: ({ row }) => (
      <>
        <Autocomplete
          className="my-2"
          id="combo-box-demo"
          value={row.statusDropdown || null}
          options={[
            { label: "Approved", value: "approval" },
            { label: "Rejected", value: "reject" },
          ]}
          getOptionLabel={(option) => option?.label}
          onChange={(event, newValue) => {
            handleStatusChange(row, newValue?.value);
            row.statusDropdown = newValue;
          }}
          style={{ width: 150 }}
          renderInput={(params) => (
            <TextField {...params} label="Status" variant="outlined" />
          )}
        />
      </>
    ),
  },
];

export const uniquePendingApprovalCustomerColumn = ({
  uniqueCustomerData = [],
  handleOpenSameAccounts,
  handleStatusChange,
}) => [
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
    headerName: "Account Name",
    width: 260,
    renderCell: (params) => (
      <a
        style={{ cursor: "pointer", color: "blue" }}
        href="#"
        onClick={() => handleOpenSameAccounts(params.row.account_name)}
      >
        {params.row.account_name}
      </a>
    ),
  },
  {
    headerName: "Requested By",
    field: "sales_executive_name",
    width: 180,
    name: <div style={{ whiteSpace: "normal" }}>Requested By</div>,
    renderCell: (params, index) => <div>{params.row.created_by_name} </div>,
  },
  {
    field: "campaign_amount",
    headerName: "Campaign Amount Without GST",
    renderCell: (params) => <div>{params.row.campaign_amount} </div>,
  },
  {
    field: "base_amount",
    headerName: "Campaign Amount Without GST",
    renderCell: (params) => <div>{params.row.base_amount} </div>,
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
    width: 200,
    // field: "Status",
    headerName: "Status",
    renderCell: ({ row }) => (
      <>
        <Autocomplete
          className="my-2"
          id="combo-box-demo"
          value={row.statusDropdown || null}
          options={[
            { label: "Approved", value: "approval" },
            { label: "Rejected", value: "reject" },
          ]}
          getOptionLabel={(option) => option?.label}
          onChange={(event, newValue) => {
            // console.log(newValue, "newValue--- newValueData---");
            handleStatusChange(row, newValue?.value);
            row.statusDropdown = newValue;
          }}
          style={{ width: 180 }}
          renderInput={(params) => (
            <TextField {...params} label="Status" variant="outlined" />
          )}
        />
      </>
    ),
  },
];

export const pendingInvoiceColumn = ({
  filterData = [],
  setOpenImageDialog,
  setViewImgSrc,
  handleOpenEditFieldAction,
}) => [
  {
    width: 60,
    headerName: "S.No",
    field: "s_no",
    renderCell: (params, index) => (
      <div>{[...filterData]?.indexOf(params.row) + 1}</div>
    ),
  },
  {
    width: 150,
    headerName: "Sale Booking ID",
    field: "sale_booking_id",
    renderCell: (params, index) => <div>{params.row.sale_booking_id}</div>,
  },
  {
    headerName: "Sales Person name",
    field: "user_name",
    width: 220,
    height: "200px",
    renderCell: (params) => {
      return <div>{FormatString(params.row.user_name)} </div>;
    },
  },
  {
    headerName: " Requested On",
    field: "createdAt",
    width: 220,
    renderCell: (params) => {
      return moment(params.row.createdAt).format("DD/MM/YYYY HH:MM");
    },
  },
  {
    headerName: "Sale Booking Date",
    field: "sale_booking_date",
    width: 220,
    renderCell: (params) => {
      return moment(params.row.saleData.sale_booking_date).format(
        "DD/MM/YYYY HH:MM"
      );
    },
  },
  // {
  //   headerName: "Sale Booking Description",
  //   field: "description",
  //   width: 220,
  //   renderCell: (params) => params.row.saleData.description,
  // },
  {
    headerName: "Account Name",
    field: "account_name",
    width: 220,
    renderCell: (params) => (
      <>
        <Link
          className="text-primary"
          to={`/admin/finance-pending-invoice/customer-details/${params.row.saleData.account_id}`}
        >
          {FormatString(params.row.saleData.account_name)}
        </Link>
      </>
    ),
  },
  {
    headerName: "Invoice Particular Name",
    field: "invoice_particular_name",
    width: 200,
    renderCell: (params) =>
      FormatString(params.row.saleData.invoice_particular_name),
  },
  {
    field: "po_file",
    headerName: "PO File",
    width: 210,
    renderCell: (params) => {
      // Extract file extension and check if it's a PDF
      const fileExtension = params.row.purchase_order_upload_url
        ?.split(".")
        .pop()
        .toLowerCase();
      const isPdf = fileExtension === "pdf";

      const imgUrl = params.row.purchase_order_upload_url;

      return isPdf ? (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={pdfImg}
          style={{ width: "40px", height: "40px" }}
          title="PDF Preview"
        />
      ) : (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={imgUrl}
          alt="Invoice"
          style={{ width: "100px", height: "100px" }}
        />
      );
    },
  },
  {
    field: "po_number",
    headerName: "PO Number",
    width: 210,
    renderCell: (params) => params.row.purchase_order_number,
  },
  {
    headerName: "Invoice Type",
    field: "invoice_type_id",
    width: 180,
    renderCell: (params) => FormatString(params.row.invoice_type_id),
  },
  {
    field: "invoice_amount",
    headerName: "Invoice Amount",
    width: 200,
    renderCell: (params) =>
      params.row.invoice_amount ? params.row.invoice_amount : 0,
  },
  {
    headerName: "Base Amount",
    field: "base_amount",
    width: 180,
    renderCell: (params) =>
      params.row.saleData.base_amount ? params.row.saleData.base_amount : 0,
  },
  {
    headerName: "GST Amount",
    field: "gst_amount",
    width: 180,
    renderCell: (params) =>
      params.row.saleData.gst_amount ? params.row.saleData.gst_amount : 0,
  },
  {
    headerName: "Campaign Amount",
    field: "campaign_amount",
    width: 180,
    renderCell: (params) =>
      params.row.saleData.campaign_amount
        ? params.row.saleData.campaign_amount
        : 0,
  },
  {
    field: "invoice_action_reason",
    headerName: "Invoice Reason",
    width: 200,
    renderCell: (params) => FormatString(params.row.invoice_action_reason),
  },
  // {
  //   field: "aging",
  //   headerName: "Aging",
  //   renderCell: (params) => {
  //     const hours = calculateAging(params.row.sale_booking_date, new Date());
  //     const days = Math?.round(hours / 24);
  //     return `${days} Days`;
  //   },
  // },
  {
    field: "Action",
    headerName: "Action",
    width: 180,
    renderCell: (params) => (
      <div>
        <Button
          variant="contained"
          onClick={() => handleOpenEditFieldAction(params.row)}
        >
          Invoice Update
        </Button>
      </div>
    ),
  },
];

export const uniquePendingInvoiceAccountColumn = ({
  uniqueCustomerData = [],
  handleOpenSameCustomer,
}) => [
  {
    field: "s_no",
    headerName: "S.No",
    renderCell: (params) => (
      <div>{[...uniqueCustomerData].indexOf(params.row) + 1}</div>
    ),
  },
  {
    headerName: "Sales Person name",
    field: "user_name",
    width: 220,
    height: "200px",
    renderCell: (params) => {
      return <div>{params.row.user_name} </div>;
    },
  },
  {
    headerName: "Account Name",
    field: "account_name",
    width: 220,
    renderCell: (params) => (
      <a
        href="#"
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => handleOpenSameCustomer(params?.row?.account_name)}
      >
        {params?.row?.account_name}
      </a>
    ),
  },
  {
    field: "invoice_amount",
    headerName: "Invoice Amount",
    width: 200,
    renderCell: (params) =>
      params.row.invoice_amount ? params.row.invoice_amount : 0,
  },
  {
    headerName: "Base Amount",
    field: "base_amount",
    width: 180,
    renderCell: (params) =>
      params.row.saleData.base_amount ? params.row.saleData.base_amount : 0,
  },
  {
    headerName: "GST Amount",
    field: "gst_amount",
    width: 180,
    renderCell: (params) =>
      params.row.saleData.gst_amount ? params.row.saleData.gst_amount : 0,
  },
  {
    headerName: "Campaign Amount",
    field: "campaign_amount",
    width: 180,
    renderCell: (params) =>
      params.row.saleData.campaign_amount
        ? params.row.saleData.campaign_amount
        : 0,
  },
];

export const uniquePendingInvoiceSalesExecutiveColumn = ({
  uniqueSalesExecutiveData = [],
  handleOpenSameSalesExecutive,
  setOpenImageDialog,
  setViewImgSrc,
}) => [
  {
    field: "s_no",
    headerName: "S.No",
    renderCell: (params, index) => (
      <div>{[...uniqueSalesExecutiveData].indexOf(params.row) + 1}</div>
    ),
  },
  {
    headerName: "Sales Person name",
    field: "user_name",
    width: 220,
    height: "200px",
    renderCell: (params) => {
      return (
        <a
          href="#"
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => handleOpenSameSalesExecutive(params.row.user_name)}
        >
          {params.row.user_name}
        </a>
      );
    },
  },
  {
    headerName: "Account Name",
    field: "account_name",
    width: 220,
    renderCell: (params) => (
      <div>
        {params?.row?.account_name}
        {/* </Link> */}
      </div>
    ),
  },
  // {
  //   headerName: "Invoice Particular Name",
  //   field: "invoice_particular_name",
  //   width: 200,
  //   renderCell: (params) => params.row.saleData.invoice_particular_name,
  // },
  // {
  //   field: "po_file",
  //   headerName: "PO File",
  //   width: 210,
  //   renderCell: (params) => {
  //     // Extract file extension and check if it's a PDF
  //     const fileExtension = params.row.purchase_order_upload_url
  //       ?.split(".")
  //       .pop()
  //       .toLowerCase();
  //     const isPdf = fileExtension === "pdf";

  //     const imgUrl = params.row.purchase_order_upload_url;

  //     return isPdf ? (
  //       <img
  //         onClick={() => {
  //           setOpenImageDialog(true);
  //           setViewImgSrc(imgUrl);
  //         }}
  //         src={pdfImg}
  //         style={{ width: "40px", height: "40px" }}
  //         title="PDF Preview"
  //       />
  //     ) : (
  //       <img
  //         onClick={() => {
  //           setOpenImageDialog(true);
  //           setViewImgSrc(imgUrl);
  //         }}
  //         src={imgUrl}
  //         alt="Invoice"
  //         style={{ width: "100px", height: "100px" }}
  //       />
  //     );
  //   },
  // },
  // {
  //   field: "po_number",
  //   headerName: "PO Number",
  //   width: 210,
  //   renderCell: (params) => params.row.purchase_order_number,
  // },
  // {
  //   headerName: "Invoice Type",
  //   field: "invoice_type_id",
  //   width: 180,
  //   renderCell: (params) => params.row.invoice_type_id,
  // },
  {
    field: "invoice_amount",
    headerName: "Invoice Amount",
    width: 200,
    renderCell: (params) =>
      params.row.invoice_amount ? params.row.invoice_amount : 0,
  },
  {
    headerName: "Base Amount",
    field: "base_amount",
    width: 180,
    renderCell: (params) =>
      params.row.saleData.base_amount ? params.row.saleData.base_amount : 0,
  },
  {
    headerName: "GST Amount",
    field: "gst_amount",
    width: 180,
    renderCell: (params) =>
      params.row.saleData.gst_amount ? params.row.saleData.gst_amount : 0,
  },
  {
    headerName: "Campaign Amount",
    field: "campaign_amount",
    width: 180,
    renderCell: (params) =>
      params.row.saleData.campaign_amount
        ? params.row.saleData.campaign_amount
        : 0,
  },
  // {
  //   field: "invoice_action_reason",
  //   headerName: "Invoice Reason",
  //   width: 200,
  //   renderCell: (params) => params.row.invoice_action_reason,
  // },
];

export const pendingInvoiceProformaColumns = ({
  proformaData = [],
  setOpenImageDialog,
  setViewImgSrc,
  handleOpenEditFieldAction,
}) => [
  {
    width: 60,
    headerName: "S.No",
    field: "s_no",
    renderCell: (params) => (
      <div>{[...proformaData]?.indexOf(params.row) + 1}</div>
    ),
  },
  {
    width: 150,
    headerName: "Sale Booking ID",
    field: "sale_booking_id",
    renderCell: (params, index) => <div>{params.row.sale_booking_id}</div>,
  },
  {
    headerName: "Sales Person name",
    field: "user_name",
    width: 220,
    height: "200px",
    renderCell: (params) => {
      return <div>{params.row.user_name} </div>;
    },
  },
  {
    headerName: " Requested On",
    field: "createdAt",
    width: 220,
    renderCell: (params) => moment(params.row.createdAt).format("YYYY/MM/DD"),
  },
  {
    headerName: "Sale Booking Date",
    field: "sale_booking_date",
    width: 220,
    renderCell: (params) =>
      // convertDateToDDMMYYYY(params.row.sale_booking_date),
      moment(params.row.sale_booking_date).format("YYYY/MM/DD"),
  },
  // {
  //   headerName: "Sale Booking Description",
  //   field: "description",
  //   width: 220,
  //   renderCell: (params) => params.row.saleData.description,
  // },
  {
    headerName: "Account Name",
    field: "account_name",
    width: 220,
    renderCell: (params) => (
      <>
        <div>
          {/* <Link
          className="text-primary"
          to={`/admin/finance-pendinginvoice/customer-details/${params.row.saleData.account_id}`}
        > */}
          {params.row.saleData.account_name}
          {/* </Link> */}
        </div>
      </>
    ),
  },
  {
    field: "invoice_number",
    headerName: "Invoice Number",
    width: 200,
    renderCell: (params) => params.row.invoice_number,
  },
  {
    field: "invoice_uploaded_date",
    headerName: "Invoice Date",
    width: 200,
    renderCell: (params) => params.row.invoice_uploaded_date,
  },
  {
    field: "party_name",
    headerName: "Party Name",
    width: 210,
    renderCell: (params) => params.row.party_name,
  },
  {
    field: "invoice_file",
    headerName: "Invoice",
    width: 210,
    renderCell: (params) => {
      // Extract file extension and check if it's a PDF
      const fileExtension = params.row.invoice_file_url
        ?.split(".")
        .pop()
        .toLowerCase();
      const isPdf = fileExtension === "pdf";

      const imgUrl = params.row.invoice_file_url;

      return isPdf ? (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={pdfImg}
          style={{ width: "40px", height: "40px" }}
          title="PDF Preview"
        />
      ) : (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={imgUrl}
          alt="Invoice"
          style={{ width: "100px", height: "100px" }}
        />
      );
    },
  },
  {
    headerName: "Invoice Particular Name",
    field: "invoice_particular_name",
    width: 200,
    renderCell: (params) => params?.row?.saleData?.invoice_particular_name,
  },
  {
    field: "po_file",
    headerName: "PO File",
    width: 210,
    renderCell: (params) => {
      // Extract file extension and check if it's a PDF
      const fileExtension = params.row.purchase_order_upload_url
        ?.split(".")
        .pop()
        .toLowerCase();
      const isPdf = fileExtension === "pdf";

      const imgUrl = params.row.purchase_order_upload_url;

      return isPdf ? (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={pdfImg}
          style={{ width: "40px", height: "40px" }}
          title="PDF Preview"
        />
      ) : (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={imgUrl}
          alt="Invoice"
          style={{ width: "100px", height: "100px" }}
        />
      );
    },
  },
  {
    field: "purchase_order_number",
    headerName: "PO Number",
    width: 210,
    renderCell: (params) => params.row.purchase_order_number,
  },
  {
    headerName: "Invoice Type",
    field: "invoice_type_id",
    width: 180,
    renderCell: (params) => params.row.invoice_type_id,
  },
  {
    headerName: "Base Amount",
    field: "base_amount",
    width: 180,
    renderCell: (params) => params.row.saleData.base_amount,
  },
  {
    headerName: "GST Amount",
    field: "gst_amount",
    width: 180,
    renderCell: (params) => params.row.saleData.gst_amount,
  },
  {
    headerName: "Campaign Amount",
    field: "campaign_amount",
    width: 180,
    renderCell: (params) => params.row.saleData.campaign_amount,
  },
  {
    field: "invoice_action_reason",
    headerName: "Invoice Reason",
    width: 210,
    renderCell: (params) => params.row.invoice_action_reason,
  },
];

export const invoiceCreatedColumns = ({
  filterDataInvoice = [],
  setOpenImageDialog,
  setViewImgSrc,
  handleOpenEditFieldAction,
}) => [
  {
    width: 60,
    field: "s_no",
    renderCell: (params, index) => (
      <div>{[...filterDataInvoice].indexOf(params.row) + 1}</div>
    ),
    sortable: true,
  },
  {
    width: 150,
    headerName: "Sale Booking ID",
    field: "sale_booking_id",
    renderCell: (params, index) => <div>{params.row.sale_booking_id}</div>,
  },
  {
    field: "cust_name",
    headerName: "Account name",
    width: 340,
    renderCell: (params) => (
      <div>{FormatString(params?.row?.saleData?.account_name) || ""}</div>
    ),
  },
  {
    headerName: "Sales Person name",
    field: "user_name",
    width: 220,
    height: "200px",
    renderCell: (params) => {
      return <div>{FormatString(params.row.user_name) || ""} </div>;
    },
  },
  {
    field: "invoice_particular_name",
    headerName: "Invoice Particular",
    width: 200,
    renderCell: (params) => {
      return (
        <div>
          {" "}
          {FormatString(params?.row?.saleData?.invoice_particular_name) || ""}
        </div>
      );
    },
  },
  {
    field: "invoice_file",
    headerName: "Invoice",
    width: 210,
    renderCell: (params) => {
      // Extract file extension and check if it's a PDF
      const fileExtension = params.row.invoice_file_url
        ?.split(".")
        .pop()
        .toLowerCase();
      const isPdf = fileExtension === "pdf";

      const imgUrl = params.row.invoice_file_url;

      return isPdf ? (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={pdfImg}
          style={{ width: "40px", height: "40px" }}
          title="PDF Preview"
        />
      ) : (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={imgUrl}
          alt="Invoice"
          style={{ width: "100px", height: "100px" }}
        />
      );
    },
  },
  {
    field: "invoice_amount",
    headerName: "Invoice Amount",
    width: 200,
    renderCell: (params) => params.row.saleData.invoice_amount,
  },
  {
    field: "invoice_number",
    headerName: "Invoice Number",
    width: 200,
    renderCell: (params) => params.row.invoice_number,
  },
  {
    field: "invoice_uploaded_date",
    headerName: "Invoice Date",
    width: 200,
    renderCell: (params) => params.row.invoice_uploaded_date,
  },
  {
    field: "party_name",
    headerName: "Party Name",
    width: 210,
    renderCell: (params) => FormatString(params.row.party_name),
  },
  {
    field: "invoice_type_id",
    headerName: "Invoice Type",
    width: 200,
    renderCell: (params) => FormatString(params.row.invoice_type_id),
  },
  {
    field: "createdAt",
    headerName: "Requested Date",
    width: 190,
    renderCell: (params) => (
      <div style={{ whiteSpace: "normal" }}>
        {moment(params.row.createdAt).format("DD/MM/YYYY")}
      </div>
    ),
  },
  {
    headerName: "Campaign Amount",
    field: "campaign_amount",
    width: 210,
    renderCell: (params) => params.row.saleData.campaign_amount,
  },
  {
    headerName: "Reason",
    field: "invoice_action_reason",
    renderCell: (params) => FormatString(params.row.invoice_action_reason),
  },
  {
    field: "Action",
    headerName: "Action",
    width: 180,
    renderCell: (params) => (
      <div>
        <Button
          variant="contained"
          onClick={() => handleOpenEditFieldAction(params.row)}
        >
          Update Invoice
        </Button>
      </div>
    ),
  },
];

export const invoiceCreatedUniqueAccountsColumns = ({
  uniqueCustomerInvoiceData = [],
  handleOpenEditFieldAction,
  handleOpenSameCustomer,
}) => [
  {
    field: "s_no",
    headerName: "S.No",
    renderCell: (params) => (
      <div>{[...uniqueCustomerInvoiceData]?.indexOf(params.row) + 1}</div>
    ),
  },
  {
    field: "account_name",
    headerName: "Account name",
    renderCell: (params) => (
      <a
        href="#"
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => handleOpenSameCustomer(params?.row?.account_name)}
      >
        {params?.row?.account_name}
      </a>
    ),
  },
  {
    headerName: "Sales Person name",
    field: "user_name",
    width: 220,
    height: "200px",
    renderCell: (params) => {
      return <div>{params.row.user_name} </div>;
    },
  },
  {
    field: "invoice_amount",
    headerName: "Invoice Amount",
    width: 200,
    renderCell: (params) => params?.row?.invoice_amount,
  },
  {
    headerName: "Campaign Amount",
    field: "campaign_amount",
    width: 210,
    renderCell: (params) => params.row.saleData.campaign_amount,
  },
  {
    field: "Action",
    headerName: "Action",
    renderCell: (params) => (
      <div>
        <Button
          variant="contained"
          onClick={() =>
            handleOpenEditFieldAction(
              params.row.sale_booking_id,
              params.row.invoice_number,
              params.row
            )
          }
        >
          Update Invoice
        </Button>
      </div>
    ),
  },
];

export const invoiceCreatedUniqueSalesExecutiveColumns = ({
  uniqueSalesExecutiveInvoiceData = [],
  handleOpenEditFieldAction,
  handleOpenSameSalesExecutive,
}) => [
  {
    field: "s_no",
    headerName: "S.No",
    renderCell: (params) =>
      //   (
      //   <div>
      //     {[...uniqueSalesExecutiveInvoiceData]?.indexOf(params.row.item) + 1}
      //   </div>
      // ),
      {
        const index = uniqueSalesExecutiveInvoiceData?.findIndex(
          (item) =>
            item.account_name === params.row.account_name &&
            item.user_name === params.row.user_name
        );

        return <div>{index !== -1 ? index + 1 : ""}</div>;
      },
  },
  {
    headerName: "Account Name",
    field: "account_name",
    renderCell: (params) => params?.row?.account_name,
  },
  {
    field: "user_name",
    headerName: "Sales Person Name",
    renderCell: (params) => {
      return (
        <a
          href="#"
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => handleOpenSameSalesExecutive(params.row.user_name)}
        >
          {params.row.user_name}
        </a>
      );
    },
  },
  {
    field: "invoice_amount",
    headerName: "Invoice Amount",
    width: 200,
    renderCell: (params) => params?.row?.invoice_amount,
  },
  {
    headerName: "Campaign Amount",
    field: "campaign_amount",
    width: 210,
    renderCell: (params) => params?.row?.saleData?.campaign_amount,
  },
  {
    field: "Action",
    headerName: "Action",
    renderCell: (params) => (
      <div>
        <Button
          variant="contained"
          onClick={() =>
            handleOpenEditFieldAction(
              params.row.sale_booking_id,
              params.row.invoice_number,
              params.row
            )
          }
        >
          Update Invoice
        </Button>
      </div>
    ),
  },
];

export const outstandingColumns = ({
  filterData = [],
  calculateAging,
  setViewImgSrc,
  setViewImgDialog,
  handleImageClick,
  handleDiscardOpenDialog,
  handleOpenEditAction,
  activeAccordionIndex,
}) => [
  {
    width: 70,
    field: "sno",
    headerName: "S.No",
    valueGetter: (params) => {
      // Apply the filter logic once
      const invcForCreated =
        activeAccordionIndex === 3
          ? filterData?.filter((invc) => invc.invoice_type_id !== "proforma")
          : activeAccordionIndex === 0
          ? filterData?.filter(
              (invc) =>
                invc.invoice_type_id === "tax-invoice" &&
                invc.invoice_creation_status !== "pending" &&
                invc.gst_status === true &&
                invc.paid_amount <= invc.campaign_amount * 0.9
            )
          : activeAccordionIndex === 1
          ? filterData?.filter(
              (invc) =>
                invc.invoice_type_id !== "tax-invoice" ||
                invc.invoice_creation_status === "pending"
            )
          : [];

      // Return the index for the S.No
      return invcForCreated.indexOf(params?.row) + 1;
    },
    renderCell: (params) => {
      // Reuse the same filter logic
      const invcForCreated =
        activeAccordionIndex === 3
          ? filterData?.filter((invc) => invc.invoice_type_id !== "proforma")
          : activeAccordionIndex === 0
          ? filterData?.filter(
              (invc) =>
                invc.invoice_type_id === "tax-invoice" &&
                invc.invoice_creation_status !== "pending" &&
                invc.gst_status === true &&
                invc.paid_amount <= invc.campaign_amount * 0.9
            )
          : activeAccordionIndex === 1
          ? filterData?.filter(
              (invc) =>
                invc.invoice_type_id !== "tax-invoice" ||
                invc.invoice_creation_status === "pending"
            )
          : [];
      // Render the serial number in the cell
      return <div>{invcForCreated.indexOf(params?.row) + 1}</div>;
    },
    sortable: true,
  },
  {
    field: "sale_booking_id",
    headerName: "Booking Id",
    renderCell: (params) => <div>{params.row.sale_booking_id}</div>,
  },
  {
    field: "aging",
    headerName: "Aging",
    valueGetter: (params) => {
      const hours = calculateAging(params.row.sale_booking_date, new Date());
      const days = Math.round(hours / 24);
      return `${days} Days`;
    },
    renderCell: (params) => {
      const hours = calculateAging(params.row.sale_booking_date, new Date());
      const days = Math.round(hours / 24);
      return `${days} Days`;
    },
  },
  {
    field: "account_name",
    headerName: "Account Name",
    width: 320,
    renderCell: (params) => FormatString(params.row.account_name),
    sortable: true,
  },
  {
    field: "created_by_name",
    headerName: "Sales Executive Name",
    width: 190,
    fieldName: "username",
    renderCell: (params) => FormatString(params.row.created_by_name),
  },
  {
    field: "party_name",
    headerName: "Party Name",
    width: 210,
    renderCell: (params) => FormatString(params.row.party_name),
  },
  {
    field: "invoice_number",
    headerName: "Invoice Number",
    width: 190,
    // renderCell: (params) => {
    //   const salesInvoiceData = params?.row?.salesInvoiceRequestData[0];
    //   return salesInvoiceData?.invoice_number || "";
    // },
  },
  {
    field: "invoice_uploaded_date",
    headerName: "Invoice Date",
    width: 190,
    renderCell: (params) => (
      <div style={{ whiteSpace: "normal" }}>
        {moment(params.row.invoice_uploaded_date).format("DD/MM/YYYY")}
      </div>
    ),
  },
  {
    field: "balance_payment_ondate",
    headerName: "Expected Payment Receive Date",
    width: 190,
    renderCell: (params) => (
      <div style={{ whiteSpace: "normal" }}>
        {moment(params.row.balance_payment_ondate).format("DD/MM/YYYY")}
      </div>
    ),
  },
  {
    field: "sale_booking_date",
    headerName: "Sale Booking Date",
    width: 190,
    renderCell: (params) => (
      <div style={{ whiteSpace: "normal" }}>
        {moment(params.row.sale_booking_date).format("DD/MM/YYYY")}
      </div>
    ),
  },
  {
    field: "campaign_amount",
    headerName: "Campaign Amount",
    width: 190,
    renderCell: (params) => params.row.campaign_amount,
  },
  {
    field: "paid_amount",
    headerName: "Paid Amount",
    width: 190,
    renderCell: (params) => (
      <div style={{ whiteSpace: "normal" }}>
        {params.row.paid_amount ? params.row.paid_amount : 0}
      </div>
    ),
  },
  {
    field: "Balance Amount",
    headerName: "Balance Amount",
    valueGetter: (params) => {
      return params.row.campaign_amount - params.row.paid_amount || 0;
    },

    renderCell: (params) =>
      params.row.campaign_amount - params.row.paid_amount || 0,
  },
  {
    field: "base_amount",
    headerName: "Base Amount",
    renderCell: (params) => params.row.base_amount,
  },
  {
    field: "gst_status",
    headerName: "GST",
    renderCell: (params) =>
      params.row.gst_status === true ? "GST" : "Non GST",
  },
  {
    field: "invoice_file",
    headerName: "Screen Shot",
    width: 190,
    renderCell: (params) => {
      const invoiceData =
        params?.row?.invoice_file !== "" ? params.row.invoice_file : null;
      const imgUrl = `${params.row.url}/${invoiceData}`;

      return invoiceData ? (
        invoiceData?.endsWith(".pdf") ? (
          <img
            src={pdfImg}
            onClick={() => {
              setViewImgSrc(imgUrl);
              setViewImgDialog(true);
            }}
            style={{ width: "40px", height: "40px" }}
            alt="PDF Icon"
          />
        ) : invoiceData?.endsWith(".xls") || invoiceData?.endsWith(".xlsx") ? (
          <img
            src={pdfImg}
            onClick={() => {
              setViewImgSrc(imgUrl);
              setViewImgDialog(true);
            }}
            style={{ width: "40px", height: "40px" }}
            alt="PDF Icon"
          />
        ) : (
          <>
            <img
              onClick={() => {
                setViewImgSrc(imgUrl);
                setViewImgDialog(true);
              }}
              src={imgUrl}
              alt="payment screenshot"
              style={{ width: "50px", height: "50px" }}
            />
          </>
        )
      ) : (
        "No Image"
      );
    },
  },
  // <img
  //   src={pdf}
  //   onClick={() => {
  //     setViewImgSrc(imgUrl);
  //     setViewImgDialog(true);
  //   }}
  //   style={{ width: "40px", height: "40px" }}
  //   alt="PDF Icon"
  // />

  activeAccordionIndex == 0 && {
    field: "status",
    headerName: "Status",
    width: 190,
    renderCell: (params) => (
      <button
        className="btn cmnbtn btn_sm btn-outline-primary"
        onClick={(e) => handleImageClick(e, params.row)}
      >
        Balance Update
      </button>
    ),
  },
  activeAccordionIndex == 0 && {
    field: "Action",
    headerName: "Action",
    width: 190,
    renderCell: (params) => (
      <div className="flex-row">
        {params.row.gst_status === false ? (
          <button
            variant="contained"
            autoFocus
            className="icon-1"
            title="Discard"
            onClick={(e) => handleDiscardOpenDialog(e, params.row)}
          >
            <i className="bi bi-trash"></i>
          </button>
        ) : (
          ""
        )}
        <Link
          to={`/admin/finance-transaction-list/${params.row.sale_booking_id}`}
          className="link-primary"
        >
          {params.row.paid_amount > 0 ? (
            <button className="icon-1" title="Transaction History">
              <i className="bi bi-file-earmark-text-fill"></i>
            </button>
          ) : (
            ""
          )}
        </Link>
      </div>
    ),
  },
  // activeAccordionIndex == 1 &&
  {
    field: "Edit Action",
    headerName: "Edit Action",
    renderCell: (params) => (
      <div>
        <Button
          variant="contained"
          onClick={() => handleOpenEditAction(params?.row)}
        >
          Edit
        </Button>
      </div>
    ),
  },
];

export const incentivePaymentColumns = ({
  filterData = [],
  setSelectedData,
  setBalanceReleaseAmount,
  setAccountNo,
  setRemarks,
  setPaymentRef,
  setModalOpen,
  calculateAging,
  viewPendingStatus,
}) => [
  {
    width: 70,
    headerName: "S.No",
    field: "s_no",
    renderCell: (params, index) =>
      params.row.sales_executive_name !== "Total" ? (
        <div>{[...filterData].indexOf(params.row) + 1}</div>
      ) : null,
    sortable: true,
  },
  {
    headerName: "Sales Executive Name",
    width: 230,
    field: "sales_executive_name",
    renderCell: (params) =>
      params.row.sales_executive_name !== "Total" ? (
        <Link
          to={`/admin/Incentive-Request-Released-List/${params.row._id}`}
          className="link-primary"
        >
          {params.row.sales_executive_name}
        </Link>
      ) : (
        <div className="fs-6 font-bold text-black-50">
          {" "}
          {params.row.sales_executive_name}
        </div>
      ),
  },
  {
    headerName: "Created Date & Time",
    width: 230,
    field: "createdAt",
    renderCell: (params) =>
      params.row.sales_executive_name !== "Total"
        ? new Date(params.row.createdAt).toLocaleDateString("en-IN") +
          " " +
          new Date(params.row.createdAt).toLocaleTimeString("en-IN")
        : null,
  },
  {
    headerName: "User Requested Amount",
    width: 230,
    field: "user_requested_amount",
    renderCell: (params) =>
      params.row.sales_executive_name !== "Total" ? (
        params.row.user_requested_amount
      ) : (
        <div className="fs-6 font-bold text-black-50">
          {params.row.user_requested_amount?.toFixed(2)}
        </div>
      ),
  },
  {
    headerName: "Admin Approved Amount",
    width: 180,
    field: "admin_approved_amount",
    renderCell: (params) =>
      params.row.sales_executive_name !== "Total" ? (
        params.row.admin_approved_amount
      ) : (
        <div className="fs-6 font-bold text-black-50">
          {params.row.admin_approved_amount?.toFixed(2)}
        </div>
      ),
  },
  viewPendingStatus !== true && {
    headerName: "Released Amount",
    field: "finance_released_amount",
    renderCell: (params) =>
      params.row.sales_executive_name !== "Total" ? (
        <Link
          to={`/admin/Incentive-balance-Released/${params.row._id}`}
          className="link-primary"
        >
          {params.row.finance_released_amount
            ? params.row.finance_released_amount?.toLocaleString("en-IN")
            : 0}
        </Link>
      ) : (
        <div className="fs-6 font-bold text-black-50">
          {params.row.finance_released_amount?.toLocaleString("en-IN")}
        </div>
      ),
  },
  // {
  //   headerName: "Balance Release Amount",
  //   width: 230,
  //   field: "balance_release_amount",
  //   renderCell: (params) =>
  //     params.row.sales_executive_name !== "Total" ? (
  //       params.row.balance_release_amount?.toLocaleString("en-IN")
  //     ) : (
  //       <div className="fs-6 font-bold text-black-50">
  //         {params.row.balance_release_amount}
  //       </div>
  //     ),
  // },
  viewPendingStatus && {
    field: "Status",
    headerName: "Status",
    width: 230,
    renderCell: (params) => {
      return params.row.sales_executive_name === "Total" ? (
        ""
      ) : (
        // <span>Released</span>
        <button
          className="btn cmnbtn btn_sm btn-outline-primary"
          // data-toggle="modal"
          // data-target="#incentiveModal"
          onClick={(e) => {
            e.preventDefault();
            setSelectedData(params.row),
              setBalanceReleaseAmount(params.row.balance_release_amount);
            setAccountNo("");
            setRemarks("");
            setPaymentRef("");
            setModalOpen(true);
          }}
        >
          Release
        </button>
      );
    },
  },
  viewPendingStatus && {
    field: "Aging",
    headerName: "Aging",
    renderCell: (params) => {
      if (params.row.sales_executive_name === "Total") {
        return "";
      } else {
        const hours = calculateAging(params.row.createdAt, new Date());
        const days = Math.round(hours / 24);
        return `${days} Days`;
      }
    },
  },
];

export const incentiveUniqueSalesExecutiveColumns = ({
  uniqueSalesExecutiveData = [],
  setSelectedData,
  setBalanceReleaseAmount,
  setAccountNo,
  setRemarks,
  setPaymentRef,
  setModalOpen,
  handleOpenSameSalesExecutive,
}) => [
  {
    field: "s._no",
    headerName: "S.No",
    renderCell: (params) => (
      <div>{[...uniqueSalesExecutiveData].indexOf(params.row) + 1}</div>
    ),
    sortable: true,
  },
  {
    field: "sales_executive_name",
    headerName: "Sales Executive name",
    width: 200,
    renderCell: (params) => {
      return (
        <a
          href="#"
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() =>
            handleOpenSameSalesExecutive(
              params?.row?.sales_executive_name || "NA"
            )
          }
        >
          {params?.row?.sales_executive_name || "NA"}
        </a>
      );
    },
  },
  {
    headerName: "User Requested Amount",
    width: 200,
    field: "user_requested_amount",
    renderCell: (params) =>
      params.row.sales_executive_name !== "Total" ? (
        params.row.user_requested_amount
      ) : (
        <div className="fs-6 font-bold text-black-50">
          {" "}
          {params.row.user_requested_amount}
        </div>
      ),
  },
  {
    headerName: "Admin Approved Amount",
    width: 200,
    field: "admin_approved_amount",
    renderCell: (params) =>
      params.row.sales_executive_name !== "Total" ? (
        params.row.admin_approved_amount
      ) : (
        <div className="fs-6 font-bold text-black-50">
          {" "}
          {params.row.admin_approved_amount}
        </div>
      ),
  },
  {
    headerName: "Released Amount",
    width: 200,
    field: "finance_released_amount",
    renderCell: (params) =>
      params.row.sales_executive_name !== "Total" ? (
        <Link
          to={`/admin/Incentive-balance-Released/${params.row._id}`}
          className="link-primary"
        >
          {params.row.finance_released_amount
            ? params.row.finance_released_amount?.toLocaleString("en-IN")
            : 0}
        </Link>
      ) : (
        <div className="fs-6 font-bold text-black-50">
          {params.row.finance_released_amount?.toLocaleString("en-IN")}
        </div>
      ),
  },
  {
    field: "Status",
    headerName: "Status",
    width: 230,
    renderCell: (params) => {
      return params.row.admin_approved_amount ===
        params.row.finance_released_amount ? (
        <button
          className="btn cmnbtn btn_sm btn-outline-primary"
          onClick={(e) => {
            e.preventDefault();
            setSelectedData(params.row),
              setBalanceReleaseAmount(params.row.balance_release_amount);
            setAccountNo("");
            setRemarks("");
            setPaymentRef("");
            setModalOpen(true);
          }}
        >
          Release
        </button>
      ) : (
        <span>Released</span>
      );
    },
  },
];

export const pendingPaymentRequestColumns = ({
  activeAccordionIndex,
  filterData,
  setOpenImageDialog,
  setViewImgSrc,
  phpRemainderData,
  handleRemainderModal,
  handleOpenBankDetail,
  handleOpenSameVender,
  handleOpenPaymentHistory,
  getStatusText,
  handlePayClick,
  handleDiscardClick,
  handleZohoStatusUpload,
  nodeData,
}) => [
  {
    field: "S.NO",
    headerName: "S.NO",
    width: 70,
    editable: false,
    valueGetter: (params) => filterData?.indexOf(params.row) + 1,
    renderCell: (params) => {
      // const rowIndex = filterData.indexOf(params.row);
      const rowIndex =
        activeAccordionIndex == 0
          ? filterData.indexOf(params.row)
          : activeAccordionIndex == 1
          ? filterData.filter((d) => d.status === "3").indexOf(params.row)
          : filterData.filter((d) => d.status === "0").indexOf(params.row);

      return <div>{rowIndex + 1}</div>;
    },
  },
  {
    field: "invc_img",
    headerName: "Invoice Image",
    renderCell: (params) => {
      if (!params.row.invc_img) {
        return "No Image";
      }
      // Extract file extension and check if it's a PDF
      const fileExtension = params.row.invc_img.split(".").pop().toLowerCase();
      const isPdf = fileExtension === "pdf";

      const imgUrl = `https://purchase.creativefuel.io/${params.row.invc_img}`;

      return isPdf ? (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={pdfImg}
          style={{ width: "40px", height: "40px" }}
          title="PDF Preview"
        />
      ) : (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={imgUrl}
          alt="Invoice"
          style={{ width: "100px", height: "100px" }}
        />
      );
    },
    width: 130,
  },
  {
    field: "zoho_status",
    headerName: "Zoho Status",
    width: 130,
    editable: false,
    valueGetter: (params) => filterData?.indexOf(params.row) + 1,
    renderCell: (params) => {
      return <div>{params.row.zoho_status === "1" ? "Uploaded" : ""}</div>;
    },
  },
  {
    field: "invc_no",
    headerName: "Invoice Number",
    width: 150,
    renderCell: (params) => {
      return <div>{params.row.invc_no}</div>;
    },
  },
  {
    field: "invc_Date",
    headerName: "Invoice Date",
    width: 150,
    renderCell: (params) => {
      new Date(params.row.invc_Date).toLocaleDateString("en-IN") +
        " " +
        new Date(params.row.invc_Date).toLocaleTimeString("en-IN");
    },
  },

  {
    field: "request_date",
    headerName: "Requested Date",
    width: 150,
    renderCell: (params) => {
      new Date(params.row.request_date).toLocaleDateString("en-IN") +
        " " +
        new Date(params.row.request_date).toLocaleTimeString("en-IN");
    },
  },
  {
    field: "name",
    headerName: "Requested By",
    width: 150,
    renderCell: (params) => {
      return (
        <>
          <span>{params.row.name}</span> &nbsp;{" "}
        </>
      );
    },
  },
  {
    field: "Reminder",
    headerName: "Reminder",
    width: 150,
    valueGetter: (params) => {
      const reminder = phpRemainderData.filter(
        (item) => item.request_id == params.row.request_id
      );
      return reminder.length;
    },
    renderCell: (params) => {
      const reminder = phpRemainderData.filter(
        (item) => item.request_id == params.row.request_id
      );

      return (
        <>
          <span>
            {reminder.length > 0 ? (
              <Badge badgeContent={reminder.length} color="primary">
                <NotificationsActiveTwoToneIcon
                  onClick={() => handleRemainderModal(reminder)}
                />
              </Badge>
            ) : (
              0
            )}
          </span>
        </>
      );
    },
  },
  {
    field: "vendor_name",
    headerName: "Vendor Name",
    width: 200,
    renderCell: (params) => {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Hold for confirmation of sourabh sir */}
          <Button
            disabled={
              params.row.payment_details
                ? !params.row.payment_details.length > 0
                : true
            }
            onClick={() => handleOpenBankDetail(params.row)}
          >
            <AccountBalanceIcon style={{ fontSize: "25px" }} />
          </Button>
          <a
            style={{ cursor: "pointer", marginRight: "20px", color: "blue" }}
            onClick={() => handleOpenSameVender(params.row.vendor_name)}
          >
            {params.row.vendor_name}
          </a>
        </div>
      );
    },
  },
  {
    field: "page_name",
    headerName: "Page Name",
    width: 150,
  },
  {
    field: "payment_cycle",
    headerName: "Payment Cycle",
    width: 150,
  },
  {
    field: "total_paid",
    headerName: "Total Paid",
    width: 150,
    valueGetter: (params) => {
      const totalPaid = nodeData
        .filter(
          (e) => e.vendor_name === params.row.vendor_name && e.status == 1
        )
        .reduce((acc, item) => acc + +item.payment_amount, 0);
      return totalPaid;
    },
    renderCell: (params) => {
      return nodeData?.filter((e) => e.vendor_name === params.row.vendor_name)
        .length > 0 ? (
        <span className="row ml-2 ">
          <h5
            onClick={() => handleOpenPaymentHistory(params.row, "TP")}
            style={{ cursor: "pointer" }}
            className="fs-5 col-3 pointer font-sm lead  text-decoration-underline text-black-50"
          >
            {/* Total Paid */}
            {nodeData
              .filter(
                (e) => e.vendor_name === params.row.vendor_name && e.status == 1
              )
              .reduce((acc, item) => acc + +item.payment_amount, 0)}
          </h5>
        </span>
      ) : (
        <h5
          style={{ cursor: "pointer" }}
          className="fs-5 col-3 pointer font-sm lead  text-decoration-underline text-black-50"
        >
          0
        </h5>
      );
    },
  },
  {
    field: "F.Y",
    headerName: "F.Y",
    width: 150,
    valueGetter: (params) => {
      const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
      const currentYear = new Date().getFullYear();
      const startDate = new Date(
        `04/01/${
          isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
        }`
      );
      const endDate = new Date(
        `03/31/${
          isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
        }`
      );

      const dataFY = nodeData.filter((e) => {
        const paymentDate = new Date(e?.request_date);
        return (
          paymentDate >= startDate &&
          paymentDate <= endDate &&
          e?.vendor_name === params?.row?.vendor_name &&
          e.status !== 0 &&
          e.status !== 2 &&
          e.status !== 3
        );
      });

      const totalFY = dataFY.reduce(
        (acc, item) => acc + parseFloat(item.payment_amount),
        0
      );

      return totalFY;
    },
    renderCell: (params) => {
      const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
      const currentYear = new Date().getFullYear();
      const startDate = new Date(
        `04/01/${
          isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
        }`
      );
      const endDate = new Date(
        `03/31/${
          isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
        }`
      );
      const dataFY = nodeData.filter((e) => {
        const paymentDate = new Date(e.request_date);
        return (
          paymentDate >= startDate &&
          paymentDate <= endDate &&
          e.vendor_name === params.row.vendor_name &&
          e.status !== 0 &&
          e.status !== 2 &&
          e.status !== 3
        );
      });
      return nodeData.filter((e) => e.vendor_name === params.row.vendor_name)
        .length > 0 ? (
        <h5
          onClick={() => handleOpenPaymentHistory(params.row, "FY")}
          style={{ cursor: "pointer" }}
          className="fs-5 col-3  font-sm lead  text-decoration-underline text-black-50"
        >
          {/* Financial Year */}

          {dataFY.reduce(
            (acc, item) => acc + parseFloat(item.payment_amount),
            0
          )}
        </h5>
      ) : (
        <h5
          style={{ cursor: "pointer" }}
          className="fs-5 col-3  font-sm lead  text-decoration-underline text-black-50"
        >
          0
        </h5>
      );
    },
  },
  {
    field: "Pan Img",
    headerName: "Pan Img",
    valueGetter: (params) =>
      params.row.pan_img.includes("uploads") ? params.row.pan_img : "NA",
    renderCell: (params) => {
      const ImgUrl = `https://purchase.creativefuel.io/${params.row.pan_img}`;
      return params.row.pan_img.includes("uploads") ? (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(ImgUrl);
          }}
          src={ImgUrl}
          alt="Pan"
          style={{ width: "40px", height: "40px" }}
        />
      ) : (
        "NA"
      );
    },
  },
  {
    field: "pan",
    headerName: "Pan",
    width: 150,
  },
  {
    field: "gst",
    headerName: "GST",
    width: 200,
  },
  {
    field: "remark_audit",
    headerName: "Remark",
    width: 150,
    renderCell: (params) => {
      return params.row.remark_audit;
    },
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 150,
    renderCell: (params) => {
      return params.row.priority;
    },
  },
  {
    field: "request_amount",
    headerName: "Requested Amount",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.request_amount}</p>;
    },
  },
  {
    field: "paid_amount",
    headerName: "Paid Amount",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.paid_amount}</p>;
    },
  },
  {
    field: "balance_amount",
    headerName: "Balance Amount",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.balance_amount}</p>;
    },
  },
  {
    field: "base_amount",
    headerName: "Base Amount",
    width: 150,
    renderCell: (params) => {
      return params.row.base_amount ? (
        <p> &#8377; {params.row.base_amount}</p>
      ) : (
        "NA"
      );
    },
  },
  {
    field: "gst_amount",
    headerName: "GST Amount",
    width: 150,
    renderCell: (params) => {
      return params.row.gst_amount ? (
        <p>&#8377; {params.row.gst_amount}</p>
      ) : (
        "NA"
      );
    },
  },
  {
    field: "outstandings",
    headerName: "OutStanding ",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.outstandings}</p>;
    },
  },
  {
    field: "TDSDeduction",
    headerName: "TDS Deducted ",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.TDSDeduction === "1" ? "Yes" : "No"}</p>;
    },
  },
  {
    field: "aging",
    headerName: "Aging",
    width: 150,
    // valueGetter: (params) => {
    //   const hours = calculateHours(params.row.request_date, new Date());
    //   const days = Math.round(hours / 24);
    //   // console.log(`Calculating aging for request_date ${params.row.request_date}: ${hours} hours, ${days} days`);
    //   return `${days} Days`;
    // },
    renderCell: (params) => (
      <p>
        {params.row.aging}
        Days
      </p>
    ),
  },
  // {
  //   field: "aging",
  //   headerName: "Aging",
  //   width: 150,

  //   renderCell: (params) => {
  //     // const paymentDate = nodeData.filter(
  //     //   (dateData) => dateData.request_id === params.row.request_id
  //     // );
  //     return (
  //       <p>
  //         {" "}
  //         {Math.round(
  //           (
  //             calculateHours(params.row.request_date, new Date()) / 24
  //           ).toFixed(1)
  //         )}
  //         Days
  //       </p>
  //     );
  //   },
  // },
  {
    field: "Status",
    headerName: "Status",
    width: 150,
    valueGetter: (params) => getStatusText(params.row.status),
    renderCell: (params) => (
      <div>
        {params.row.status === "0"
          ? "Pending"
          : params.row.status === "1"
          ? "Paid"
          : params.row.status === "2"
          ? "Discard"
          : params.row.status === "3"
          ? "Partial"
          : ""}
      </div>
    ),
  },
  {
    field: "Action",
    headerName: "Action",
    width: 400,
    renderCell: (params) => {
      return (
        <div className="flexCenter colGap8">
          <button
            className="btn cmnbtn btn_sm btn-success"
            onClick={(e) => handlePayClick(e, params.row)}
          >
            Pay
          </button>
          <button
            className="btn cmnbtn btn_sm btn-danger"
            onClick={(e) => handleDiscardClick(e, params.row)}
          >
            Discard
          </button>
          <button className="btn cmnbtn btn_sm btn-success">
            <Link
              to={`/admin/finance-pruchasemanagement-paymentdone-transactionlist/${params.row.request_id}`}
            >
              Transaction List
            </Link>
          </button>
          <button
            className="btn btn-primary cmnbtn btn_sm "
            onClick={(e) => handleZohoStatusUpload(e)}
          >
            Zoho Uploaded
          </button>
        </div>
      );
    },
  },
];

export const pendingPaymentUniqueVendorColumns = ({
  activeAccordionIndex,
  uniqueVendorData = [],
  handleOpenSameVender,
  filterData = [],
}) => [
  {
    field: "S.NO",
    headerName: "S.NO",
    width: 90,
    editable: false,
    renderCell: (params) => {
      const rowIndex =
        activeAccordionIndex == 0
          ? uniqueVendorData?.indexOf(params.row)
          : activeAccordionIndex == 1
          ? uniqueVendorData
              ?.filter((d) => d.status === "3")
              ?.indexOf(params.row)
          : uniqueVendorData
              ?.filter((d) => d.status === "0")
              ?.indexOf(params.row);
      return <div>{rowIndex + 1}</div>;
    },
  },
  {
    field: "vendor_name",
    headerName: "Vendor Name",
    width: 250,
    renderCell: (params) => {
      return (
        <a
          href="#"
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => handleOpenSameVender(params.row.vendor_name)}
        >
          {params.row.vendor_name}
        </a>
      );
    },
  },
  {
    field: "total_amount",
    headerName: "Total Amount",
    width: 150,
    renderCell: ({ row }) => {
      const sameVendor = filterData?.filter(
        (e) => e.vendor_name === row.vendor_name
      );

      const reduceAmt = sameVendor?.reduce(
        (a, b) => a + 1 * b.request_amount,
        0
      );

      return <p> &#8377; {reduceAmt}</p>;
    },
  },
  {
    field: "balance_amount",
    headerName: "Balance Amount",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.balance_amount}</p>;
    },
  },
  {
    field: "outstandings",
    headerName: "OutStanding ",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.outstandings}</p>;
    },
  },
];

export const pendingPaymentDetailColumns = ({ historyData = [], nodeData }) => [
  {
    field: "S.NO",
    headerName: "S.NO",
    width: 90,
    editable: false,
    renderCell: (params) => (
      // const rowIndex = historyData?.indexOf(params.row);
      // return <div>{rowIndex + 1}</div>;
      <div>{[...historyData]?.indexOf(params.row) + 1}</div>
    ),
  },
  {
    field: "request_amount",
    headerName: "Requested Amount",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.request_amount}</p>;
    },
  },
  {
    field: "outstandings",
    headerName: "OutStanding ",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.outstandings}</p>;
    },
  },
  // {
  //   field: "invc_img",
  //   headerName: "Invoice Image",
  //   renderCell: (params) => {
  //     if (params.row.invc_img) {
  //       // Extract file extension and check if it's a PDF
  //       const fileExtension = params.row.invc_img
  //         .split(".")
  //         .pop()
  //         .toLowerCase();
  //       const isPdf = fileExtension === "pdf";

  //       const imgUrl = `https://purchase.creativefuel.io/${params.row.invc_img}`;

  //       return isPdf ? (
  //         <img
  //           onClick={() => {
  //             setOpenImageDialog(true);
  //             setViewImgSrc(imgUrl);
  //           }}
  //           src={pdf}
  //           style={{ width: "40px", height: "40px" }}
  //           title="PDF Preview"
  //         />
  //       ) : (
  //         <img
  //           onClick={() => {
  //             setOpenImageDialog(true);
  //             setViewImgSrc(imgUrl);
  //           }}
  //           src={imgUrl}
  //           alt="Invoice"
  //           style={{ width: "100px", height: "100px" }}
  //         />
  //       );
  //     } else {
  //       return null;
  //     }
  //   },
  // },
  {
    field: "request_date",
    headerName: "Requested Date",
    width: 150,
    renderCell: (params) => {
      return moment(params.row.request_date).format("DD/MM/YYYY");
    },
  },
  {
    field: "name",
    headerName: "Requested By",
    width: 150,
    renderCell: (params) => {
      return params.row.name;
    },
  },
  {
    field: "vendor_name",
    headerName: "Vendor Name",
    // width: "auto",
    width: 250,
    renderCell: (params) => {
      return params.row.vendor_name;
    },
  },
  {
    field: "remark_audit",
    headerName: "Remark",
    width: 150,
    renderCell: (params) => {
      return params.row.remark_audit;
    },
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 150,
    renderCell: (params) => {
      return params.row.priority;
    },
  },
  {
    field: "aging",
    headerName: "Aging",
    width: 150,
    renderCell: (params) => {
      return (
        <p>
          {params.row.aging}
          Days
        </p>
      );
    },
  },
  {
    field: "Status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => {
      const matchingItems = nodeData?.filter(
        (item) => item.request_id == params.row.request_id
      );
      if (matchingItems.length > 0) {
        return matchingItems.map((item, index) => (
          <p key={index}>
            {item.status == 0
              ? "Pending"
              : item.status == 2
              ? "Discarded"
              : "Paid"}
          </p>
        ));
      } else {
        return "Pending"; // Default value if no matching item is found
      }
    },
  },
];

export const pendingPaymentReqRemainderDialogColumns = ({
  reminderData = [],
  handleAcknowledgeClick,
}) => [
  {
    field: "S.NO",
    headerName: "S.NO",
    width: 90,
    editable: false,
    renderCell: (params) => {
      const rowIndex = reminderData?.indexOf(params.row);
      return <div>{rowIndex + 1}</div>;
    },
  },
  {
    field: "request_date",
    headerName: "Requested Date",
    width: 150,
    renderCell: (params) => {
      return moment(params.row.request_date).format("Dd/MM/YYYY");
    },
  },
  {
    field: "remind_remark",

    headerName: "Remark",
    width: 150,
    renderCell: (params) => {
      return params.row.remark_audit;
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => {
      return (
        <div>
          <button
            className="btn btn-sm btn-success"
            onClick={() => handleAcknowledgeClick(params.row)}
          >
            Acknowledge
          </button>
        </div>
      );
    },
  },
];

export const paymentDoneColumns = ({
  filterData = [],
  setOpenImageDialog,
  setViewImgSrc,
  phpRemainderData,
  nodeData,
  getStatusText,
  handleOpenPaymentHistory,
  handleOpenBankDetail,
}) => [
  {
    field: "S.NO",
    headerName: "S.NO",
    width: 90,
    editable: false,
    valueGetter: (params) => filterData?.indexOf(params.row) + 1,
    renderCell: (params) => {
      const rowIndex = filterData?.indexOf(params.row);
      return <div>{rowIndex + 1}</div>;
    },
  },
  {
    field: "invc_img",
    headerName: "Invoice Image",
    renderCell: (params) => {
      if (!params.row.invc_img) {
        return "No Image";
      }
      // Extract file extension and check if it's a PDF
      const fileExtension = params.row.invc_img.split(".").pop().toLowerCase();
      const isPdf = fileExtension === "pdf";

      const imgUrl = `https://purchase.creativefuel.io/${params.row.invc_img}`;
      return isPdf ? (
        <div
          style={{ position: "relative", overflow: "hidden", height: "40px" }}
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
        >
          <embed
            allowFullScreen={true}
            src={imgUrl}
            title="PDF Viewer"
            scrollbar="0"
            type="application/pdf"
            style={{
              width: "80px",
              height: "80px",
              cursor: "pointer",
              pointerEvents: "none",
            }}
          />
          {/* <div
           
            style={{
              position: "absolute",
              width: "5%",
              height: "36%",
              left: "104px",
              cursor: "pointer",
              background: "rgba(0, 0, 0, 0)",
              zIndex: 10,
            }}
          ></div> */}
        </div>
      ) : (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={imgUrl}
          alt="Invoice"
          style={{ width: "80px", height: "80px" }}
        />
      );
    },
    width: 250,
  },
  {
    field: "evidence",
    headerName: "Payment Screenshot",
    renderCell: (params) => {
      if (!params.row.evidence) {
        return "No Image";
      }
      // Extract file extension and check if it's a PDF
      const fileExtension = params.row.invc_img.split(".").pop().toLowerCase();
      const isPdf = fileExtension === "pdf";

      const imgUrl = `https://purchase.creativefuel.io/${params.row.evidence}`;

      return isPdf ? (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={imgUrl}
          style={{ width: "40px", height: "40px" }}
          title="PDF Preview"
        />
      ) : (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(imgUrl);
          }}
          src={imgUrl}
          alt="Invoice"
          style={{ width: "100px", height: "100px" }}
        />
      );
    },
    width: 130,
  },
  {
    field: "request_date",
    headerName: "Requested Date",
    width: 150,
    valueGetter: (params) =>
      moment(params.row.request_date).format("DD-MM-YYYY HH:MM A"),
    renderCell: (params) => {
      return moment(params?.row?.request_date).format("DD-MM-YYYY HH:MM A");
    },
  },
  {
    field: "payment_date",
    headerName: "Payment Date",
    width: 150,
    valueGetter: (params) =>
      moment(params?.row?.payment_date).format("DD-MM-YYYY HH:MM A"),
    renderCell: (params) => {
      return moment(params.row.payment_date).format("DD-MM-YYYY HH:MM A");
    },
  },
  {
    field: "name",
    headerName: "Requested By",
    width: 150,
    valueGetter: (params) => {
      const reminder = phpRemainderData?.filter(
        (item) => item.request_id == params.row.request_id
      );
      return reminder.length;
    },
    renderCell: (params) => {
      const reminder = phpRemainderData?.filter(
        (item) => item.request_id == params.row.request_id
      );

      return (
        <>
          <span>{params.row.name}</span> &nbsp;{" "}
          <span>
            {reminder.length > 0 ? (
              <Badge badgeContent={reminder.length} color="primary">
                <NotificationsActiveTwoToneIcon
                  onClick={() => handleRemainderModal(reminder)}
                />{" "}
              </Badge>
            ) : (
              ""
            )}
          </span>
        </>
      );
    },
  },
  {
    field: "vendor_name",
    headerName: "Vendor Name",
    width: 200,
    renderCell: (params) => {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Hold for confirmation of sourabh sir */}
          <Button
            disabled={
              params.row.payment_details
                ? !params.row.payment_details.length > 0
                : true
            }
            onClick={() => handleOpenBankDetail(params.row)}
          >
            <AccountBalanceIcon style={{ fontSize: "25px" }} />
          </Button>
          <div
            style={{ cursor: "pointer", marginRight: "20px" }}
            onClick={() => handleOpenSameVender(params.row.vendor_name)}
          >
            {params.row.vendor_name}
          </div>
        </div>
      );
    },
  },
  {
    field: "page_name",
    headerName: "Page Name",
    width: 150,
  },
  {
    field: "total_paid",
    headerName: "Total Paid",
    width: 150,
    valueGetter: (params) => {
      const totalPaid = nodeData
        ?.filter(
          (e) => e.vendor_name === params.row.vendor_name && e.status == 1
        )
        ?.reduce((acc, item) => acc + +item.payment_amount, 0);
      return totalPaid;
    },
    renderCell: (params) => {
      return nodeData?.filter((e) => e.vendor_name === params.row.vendor_name)
        .length > 0 ? (
        <span className="row ml-2 ">
          <h5
            onClick={() => handleOpenPaymentHistory(params.row, "TP")}
            style={{ cursor: "pointer" }}
            className="fs-5 col-3 pointer font-sm lead  text-decoration-underline text-black-50"
          >
            {/* Total Paid */}
            {nodeData
              .filter(
                (e) => e.vendor_name === params.row.vendor_name && e.status == 1
              )
              .reduce((acc, item) => acc + +item.payment_amount, 0)}
          </h5>
        </span>
      ) : (
        <h5
          style={{ cursor: "pointer" }}
          className="fs-5 col-3 pointer font-sm lead  text-decoration-underline text-black-50"
        >
          0
        </h5>
      );
    },
  },
  {
    field: "F.Y",
    headerName: "F.Y",
    width: 150,
    valueGetter: (params) => {
      const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
      const currentYear = new Date().getFullYear();
      const startDate = new Date(
        `04/01/${
          isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
        }`
      );
      const endDate = new Date(
        `03/31/${
          isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
        }`
      );
      const dataFY = nodeData.filter((e) => {
        const paymentDate = new Date(e.request_date);
        return (
          paymentDate >= startDate &&
          paymentDate <= endDate &&
          e.vendor_name === params.row.vendor_name &&
          e.status !== 0 &&
          e.status !== 2
        );
      });
      const totalFY = dataFY.reduce(
        (acc, item) => acc + parseFloat(item.payment_amount),
        0
      );
      return totalFY;
    },
    renderCell: (params) => {
      const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
      const currentYear = new Date().getFullYear();
      const startDate = new Date(
        `04/01/${
          isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
        }`
      );
      const endDate = new Date(
        `03/31/${
          isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
        }`
      );
      const dataFY = nodeData.filter((e) => {
        const paymentDate = new Date(e.request_date);
        return (
          paymentDate >= startDate &&
          paymentDate <= endDate &&
          e.vendor_name === params.row.vendor_name &&
          e.status !== 0 &&
          e.status !== 2
        );
      });
      return nodeData.filter((e) => e.vendor_name === params.row.vendor_name)
        .length > 0 ? (
        <h5
          onClick={() => handleOpenPaymentHistory(params.row, "FY")}
          style={{ cursor: "pointer" }}
          className="fs-5 col-3  font-sm lead  text-decoration-underline text-black-50"
        >
          {/* Financial Year */}

          {dataFY.reduce(
            (acc, item) => acc + parseFloat(item.payment_amount),
            0
          )}
        </h5>
      ) : (
        <h5
          style={{ cursor: "pointer" }}
          className="fs-5 col-3  font-sm lead  text-decoration-underline text-black-50"
        >
          0
        </h5>
      );
    },
  },
  {
    field: "Pan Img",
    headerName: "Pan Img",
    valueGetter: (params) =>
      params?.row?.pan_img?.includes("uploads") ? params?.row?.pan_img : "NA",
    renderCell: (params) => {
      const ImgUrl = `https://purchase.creativefuel.io/${params?.row?.pan_img}`;
      return params?.row?.pan_img?.includes("uploads") ? (
        <img
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(ImgUrl);
          }}
          src={ImgUrl}
          alt="Pan"
          style={{ width: "40px", height: "40px" }}
        />
      ) : (
        "NA"
      );
    },
  },
  {
    field: "pan",
    headerName: "PAN",
    width: 200,
  },
  {
    field: "gst",
    headerName: "GST",
    width: 200,
  },
  {
    field: "remark_audit",
    headerName: "Remark",
    width: 150,
    renderCell: (params) => {
      return params.row.remark_audit;
    },
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 150,
    renderCell: (params) => {
      return params.row.priority;
    },
  },
  {
    field: "request_amount",
    headerName: "Requested Amount",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.request_amount}</p>;
    },
  },
  {
    field: "base_amount",
    headerName: "Base Amount",
    width: 150,
    renderCell: (params) => {
      return params.row.base_amount ? (
        <p> &#8377; {params.row.base_amount}</p>
      ) : (
        "NA"
      );
    },
  },
  {
    field: "paid_amount",
    headerName: "Paid Amount",
    width: 150,
    renderCell: (params) => {
      return params.row.paid_amount ? (
        <p> &#8377; {params.row.paid_amount}</p>
      ) : (
        "NA"
      );
    },
  },
  {
    field: "gst_amount",
    headerName: "GST Amount",
    width: 150,
    renderCell: (params) => {
      return params.row.gst_amount ? (
        <p>&#8377; {params.row.gst_amount}</p>
      ) : (
        "NA"
      );
    },
  },
  {
    field: "gst_hold_amount",
    headerName: "GST Hold Amount",
    width: 150,
    renderCell: (params) => {
      return params.row.gst_hold_amount ? (
        <p>&#8377; {params.row.gst_hold_amount}</p>
      ) : (
        "NA"
      );
    },
  },
  {
    field: "tds_deduction",
    headerName: "TDS Amount",
    width: 150,
    renderCell: (params) => {
      return params.row.tds_deduction ? (
        <p>&#8377; {params.row.tds_deduction}</p>
      ) : (
        "NA"
      );
    },
  },
  {
    field: "tds_percentage",
    headerName: "TDS Percentage",
    width: 150,
    renderCell: (params) => {
      return params.row.tds_percentage ? (
        <p>{params.row.tds_percentage} %</p>
      ) : (
        "NA"
      );
    },
  },
  {
    field: "outstandings",
    headerName: "OutStanding ",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.outstandings}</p>;
    },
  },
  {
    field: "payment_amount",
    headerName: "Payment Amount",
    width: 150,
    renderCell: (params) => {
      const paymentAmount = nodeData?.filter(
        (e) => e.request_id == params.row.request_id
      )[0]?.payment_amount;
      return paymentAmount ? <p>&#8377; {paymentAmount}</p> : "NA";
    },
  },
  {
    field: "payment_by",
    headerName: "Payment By",
    width: 150,
    renderCell: (params) => <div>{params.row.payment_by}</div>,
  },
  {
    field: "aging",
    headerName: "Aging",
    width: 150,
    renderCell: (params) => {
      return <p> {params.row.aging} Days</p>;
    },
  },
  {
    field: "Status",
    headerName: "Status",
    width: 150,
    valueGetter: (params) => getStatusText(params.row.status),
    renderCell: (params) => (
      <div>
        {params.row.status === "1"
          ? "Paid"
          : params.row.status === "2"
          ? "Discard"
          : params.row.status === "3"
          ? "Partial"
          : ""}
      </div>
    ),
  },
  // {
  //   field: "Aging (in hours)",
  //   headerName: "Aging (in hours)",
  //   width: 150,
  //   renderCell: (params) => {
  //     return (
  //       <p> {calculateHours(params.row.request_date, new Date())} Hours</p>
  //     );
  //   },
  // },
  {
    field: "gstHold",
    headerName: "GST Hold",
    width: 150,
    renderCell: (params) => {
      return params.row.gstHold == 1 ? "Yes" : "No";
    },
  },
  {
    field: "TDSDeduction",
    headerName: "TDS Deduction",
    width: 150,
    renderCell: (params) => {
      return params.row.TDSDeduction == 1 ? "Yes" : "No";
    },
  },
  {
    field: "Action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => (
      <Button variant="outline" className="btn cmnbtn btn-primary">
        <Link
          to={`/admin/finance-pruchasemanagement-paymentdone-transactionlist/${params.row.request_id}`}
        >
          Transaction List
          {/* ({totalCount}) */}
        </Link>
      </Button>
    ),
  },
];

export const paymentDoneUniqueVendorColumns = ({
  uniqueVendorData = [],
  handleOpenSameVender,
  filterData,
}) => [
  {
    field: "S.NO",
    headerName: "S.NO",
    width: 90,
    editable: false,
    renderCell: (params) => {
      const rowIndex = uniqueVendorData?.indexOf(params.row);
      return <div>{rowIndex + 1}</div>;
    },
  },
  {
    field: "vendor_name",
    headerName: "Vendor Name",
    // width: "auto",
    width: 250,
    renderCell: (params) => {
      return (
        <a
          href="#"
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => handleOpenSameVender(params.row.vendor_name)}
        >
          {params.row.vendor_name}
        </a>
      );
    },
  },
  {
    field: "total_amount",
    headerName: "Total Amount",
    width: 150,
    renderCell: ({ row }) => {
      const sameVendor = filterData.filter(
        (e) => e.vendor_name === row.vendor_name
      );

      const reduceAmt = sameVendor.reduce(
        (a, b) => a + 1 * b.request_amount,
        0
      );

      return <p> &#8377; {reduceAmt}</p>;
    },
  },
  {
    field: "outstandings",
    headerName: "OutStanding ",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.outstandings}</p>;
    },
  },
];

export const PaymentDonePaymentDetailColumns = ({
  historyData = [],
  nodeData,
}) => [
  {
    field: "S.NO",
    headerName: "S.NO",
    width: 90,
    editable: false,
    renderCell: (params) => {
      const rowIndex = historyData?.indexOf(params.row);
      return <div>{rowIndex + 1}</div>;
    },
  },
  {
    field: "request_amount",
    headerName: "Requested Amount",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.request_amount}</p>;
    },
  },
  {
    field: "outstandings",
    headerName: "OutStanding ",
    width: 150,
    renderCell: (params) => {
      return <p> &#8377; {params.row.outstandings}</p>;
    },
  },
  {
    field: "request_date",
    headerName: "Requested Date",
    width: 150,
    renderCell: (params) => {
      return moment(params.row.request_date).format("DD/MM/YYYY");
    },
  },
  {
    field: "name",
    headerName: "Requested By",
    width: 150,
    renderCell: (params) => {
      return params.row.name;
    },
  },
  {
    field: "vendor_name",
    headerName: "Vendor Name",
    width: 250,
    renderCell: (params) => {
      return params.row.vendor_name;
    },
  },
  {
    field: "remark_audit",
    headerName: "Remark",
    width: 150,
    renderCell: (params) => {
      return params.row.remark_audit;
    },
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 150,
    renderCell: (params) => {
      return params.row.priority;
    },
  },
  {
    field: "aging",
    headerName: "Aging",
    width: 150,
    renderCell: (params) => {
      return <p> {params.row.aging} Days</p>;
    },
  },
  {
    field: "Status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => {
      const matchingItems = nodeData?.filter(
        (item) => item.request_id == params.row.request_id
      );
      if (matchingItems.length > 0) {
        return matchingItems.map((item, index) => (
          <p key={index}>
            {item.status == 0
              ? "Pending"
              : item.status == 2
              ? "Discarded"
              : "Paid"}
          </p>
        ));
      } else {
        return "Pending";
      }
    },
  },
];

export const PaymentDoneRemainderDialogColumns = ({
  reminderData = [],
  handleAcknowledgeClick,
}) => [
  {
    field: "S.NO",
    headerName: "S.NO",
    width: 90,
    editable: false,
    renderCell: (params) => {
      const rowIndex = reminderData?.indexOf(params.row);
      return <div>{rowIndex + 1}</div>;
    },
  },
  {
    field: "request_date",
    headerName: "Requested Date",
    width: 150,
    renderCell: (params) => {
      return moment(params.row.request_date).format("DD/MM/YYYY");
    },
  },
  {
    field: "remind_remark",

    headerName: "Remark",
    width: 150,
    renderCell: (params) => {
      return params.row.remark_audit;
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => {
      return (
        <div>
          <button
            className="btn btn-sm btn-success"
            onClick={() => handleAcknowledgeClick(params.row)}
          >
            Acknowledge
          </button>
        </div>
      );
    },
  },
];
