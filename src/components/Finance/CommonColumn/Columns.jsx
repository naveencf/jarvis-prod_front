import moment from "moment";
import FormatString from "../FormateString/FormatString";
import { Link } from "react-router-dom";
import PendingApprovalStatusDialog from "../Sales Management/PaymentRequestUpdate/Components/PendingApprovalStatusDialog";
import pdfImg from "../pdf-file.png";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Autocomplete, Button, TextField } from "@mui/material";

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
      const pmData =
        paymentModeArray.find((mode) => mode._id === params.row.payment_mode)
          ?.payment_mode_name || "";

      return <div>{FormatString(pmData)} </div>;
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
    renderCell: (params, index) => (
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
  // {
  //   headerName: " Requested On",
  //   field: "createdAt",
  //   width: 220,
  //   renderCell: (params) =>
  //     moment(params.row.createdAt).format("DD/MM/YYYY HH:MM"),
  // },
  // {
  //   headerName: "Sale Booking Date",
  //   field: "sale_booking_date",
  //   width: 220,
  //   renderCell: (params) =>
  //     // convertDateToDDMMYYYY(params.row.sale_booking_date),
  //     moment(params.row.sale_booking_date).format("YYYY/MM/DD"),
  // },
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
      <a
        href="#"
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => handleOpenSameCustomer(params.row.saleData.account_name)}
      >
        {params.row.saleData.account_name}
        {/* <Link
            className="text-primary"
            to={`/admin/finance-pendinginvoice/customer-details/${params.row._id}`}
          >
            
          </Link> */}
      </a>
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
      // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

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
  // {
  //   headerName: " Requested On",
  //   field: "createdAt",
  //   width: 220,
  //   renderCell: (params) => moment(params.row.createdAt).format("YYYY/MM/DD"),
  // },
  // {
  //   headerName: "Sale Booking Date",
  //   field: "sale_booking_date",
  //   width: 220,
  //   renderCell: (params) =>
  //     moment(params.row.sale_booking_date).format("YYYY/MM/DD"),
  // },
  // {
  //   headerName: "Sale Booking Description",
  //   field: "description",
  //   width: 220,
  //   renderCell: (params) => params.row.saleData.description,
  // },
  {
    headerName: "Customer Name",
    field: "account_name",
    width: 220,
    renderCell: (params) => (
      <div
      // style={{ cursor: "pointer" }}
      // onClick={() => handleOpenSameCustomer(params.row.saleData.account_name)}
      >
        {/* <Link
          className="text-primary"
          to={`/admin/finance-pendinginvoice/customer-details/${params.row.saleData.account_id}`}
        > */}
        {params.row.saleData.account_name}
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
