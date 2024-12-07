import moment from "moment";
import FormatString from "../FormateString/FormatString";
import { Link } from "react-router-dom";
import pdfImg from "../pdf-file.png";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Autocomplete, Badge, Button, TextField } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import {
  KeyOff,
  NearMeDisabledOutlined,
  NearMeDisabledSharp,
} from "@mui/icons-material";

export const saleBookingCloseColumns = ({
  handleOpenVerifyDialog,
  setViewImgSrc,
  setViewImgDialog,
}) => [
    {
      key: "s_no",
      name: "S.NO",
      width: 70,
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "sale_booking_id",
      name: "Booking Id",
      renderRowCell: (row) => {
        return <div>{row?.sale_booking_id}</div>;
      },
      width: 150,
    },
    {
      key: "account_name",
      name: "Account Name",
      renderRowCell: (row) => {
        return <div>{FormatString(row?.account_name)}</div>;
      },
      width: 150,
    },
    {
      key: "created_by_name",
      name: "Sales Executive Name",
      renderRowCell: (row) => <div>{FormatString(row?.created_by_name)}</div>,
      width: 200,
    },
    {
      key: "sale_booking_date",
      name: "Booking Date",
      renderRowCell: (row) =>
        moment(row?.sale_booking_date)?.format("DD/MM/YYYY"),
      width: 150,
    },
    {
      key: "campaign_amount",
      name: "Campaign Amount",
      getTotal: true,
      renderRowCell: (row) => row?.campaign_amount,
      width: 150,
    },

    {
      key: "base_amount",
      name: "Base Amount",
      getTotal: true,
      renderRowCell: (row) => row?.base_amount,
      width: 150,
    },
    {
      key: "tds_amount",
      name: "TDS Amount",
      width: 150,
      renderRowCell: (row) => (
        <div>{row?.tds_amount !== "" ? row?.tds_amount : 0}</div>
      ),
    },
    {
      key: "tds_percentage",
      name: "TDS Percentage",
      width: 150,
      renderRowCell: (row) => <div>{row?.tds_percentage} %</div>,
    },
    {
      key: "gst_amount",
      name: "GST Amount",
      getTotal: true,
      renderRowCell: (row) => row?.gst_amount,
      width: 150,
    },
    {
      key: "paid_amount",
      name: "Paid Amount",
      getTotal: true,
      renderRowCell: (row) => row?.paid_amount,
      width: 150,
    },
    {
      key: "invoice_number",
      name: "Invoice Number",
      renderRowCell: (row) => row?.invoice_number,
      width: 150,
    },
    {
      key: "invoice_uploaded_date",
      name: "Invoice Date",
      renderRowCell: (row) =>
        moment(row?.invoice_uploaded_date).format("DD/MM/YYYY hh:mm"),
      width: 150,
    },
    {
      key: "Invoice File",
      name: "Invoice File",
      width: 150,
      conpare: true,
      renderRowCell: (row) => {
        const invoiceData = row?.invoice_file !== "" ? row?.invoice_file : null;
        const imgUrl = `${row?.invoice_file_url}/${invoiceData}`;

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
            <img
              onClick={() => {
                setViewImgSrc(imgUrl);
                setViewImgDialog(true);
              }}
              src={imgUrl}
              alt="payment screenshot"
              style={{ width: "50px", height: "50px" }}
            />
          )
        ) : (
          "No Image"
        );
      },
    },
    {
      key: "booking_created_date",
      name: "Booking Created Date",
      width: 150,
      renderRowCell: (row) =>
        moment(row?.booking_created_date).format("DD/MM/YYYY hh:mm"),
    },
    {
      key: "tds_status",
      name: "Status",
      width: 150,
      renderRowCell: (row) => FormatString(row?.tds_status),
    },
    {
      key: "Transaction History",
      name: "Transaction History",
      width: 150,
      renderRowCell: (row) => (
        <div className="flex-row">
          {row?.tds_status === "close" && (
            <Link
              to={`/admin/finance-transaction-list/${row?.sale_booking_id}`}
              className="link-primary"
            >
              {row?.paid_amount > 0 ? (
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
      key: "Action",
      name: "Action",
      renderRowCell: (row) => {
        return (
          <div className="flex-row gap16">
            {/* {params.row.tds_status === "close" ? ( */}
            <button
              className="btn cmnbtn btn_sm btn-outline-primary mr4"
              onClick={(e) => handleOpenVerifyDialog(e, row)}
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

export const saleBookingVerifyColumn = () => [
  {
    key: "s_no",
    name: "S.No",
    width: 80,
    renderRowCell: (row, index) => index + 1,
  },
  {
    key: "sale_booking_id",
    name: "Booking Id",
    renderRowCell: (row) => {
      return <div>{row?.sale_booking_id}</div>;
    },
    width: 150,
  },
  {
    key: "account_name",
    name: "Account Name",
    renderRowCell: (row) => FormatString(row?.account_name),
    width: 150,
  },
  {
    key: "created_by_name",
    name: "Sales Executive Name",
    renderRowCell: (row) => FormatString(row?.created_by_name),
    width: 150,
  },
  {
    key: "sale_booking_date",
    name: "Booking Date",
    width: 150,
    renderRowCell: (row) =>
      moment(row?.sale_booking_date)?.format("DD-MM-YYYY HH:MM"),
  },
  {
    key: "campaign_amount",
    name: "Campaign Amount",
    getTotal: true,
    renderRowCell: (row) => row?.campaign_amount,
    width: 150,
  },
  {
    key: "base_amount",
    name: "Base Amount",
    getTotal: true,
    renderRowCell: (row) => row?.base_amount,
    width: 150,
  },
  {
    key: "tds_amount",
    name: "TDS Amount",
    width: 150,
    renderRowCell: (row) => (
      <div>{row?.tds_amount !== "" ? row?.tds_amount : 0}</div>
    ),
  },
  {
    key: "tds_percentage",
    name: "TDS Percentage",
    width: 150,
    renderRowCell: (row) => row?.tds_percentage,
  },
  {
    key: "gst_amount",
    name: "GST Amount",
    getTotal: true,
    renderRowCell: (row) => row?.gst_amount,
    width: 150,
  },
  {
    key: "paid_amount",
    name: "Paid Amount",
    getTotal: true,
    renderRowCell: (row) => row?.paid_amount,
    width: 150,
  },
  {
    key: "Balance Amount",
    name: "Balance Amount",
    getTotal: true,
    renderRowCell: (row) => {
      return row?.campaign_amount - row?.paid_amount;
    },
    width: 150,
  },
  {
    key: "createdAt",
    name: "Booking Created Date",
    renderRowCell: (row) => moment(row?.createdAt).format("DD-MM-YYYY HH:MM"),
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
      key: "s_no",
      name: "S.NO",
      width: 70,
      compare: true,
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "account_name",
      name: "Account Name",
      width: 260,
      renderRowCell: (row) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenSameAccounts(row?.account_name)}
        >
          {FormatString(row?.account_name)}
        </div>
      ),
    },
    {
      name: "Requested By",
      key: "created_by_name",
      width: 180,
      renderRowCell: (row) => FormatString(row?.created_by_name),
    },
    {
      name: "Sale Booking Date & Time",
      key: "sale_booking_date",
      width: 180,
      compare: true,
      renderRowCell: (row) =>
        moment(row?.sale_booking_date).format("DD/MM/YYYY HH:MM"),
    },

    {
      name: "Campaign Amount",
      key: "campaign_amount",
      width: 180,
      compare: true,
      getTotal: true,
      renderRowCell: (row) => row?.campaign_amount,
    },
    {
      name: "Base Amount",
      key: "base_amount",
      width: 180,
      compare: true,
      getTotal: true,
      renderRowCell: (row) => row?.base_amount,
    },
    {
      key: "balance_payment_ondate",
      name: "Payment On Date",
      width: 180,
      compare: true,
      renderRowCell: (row) =>
        moment(row?.balance_payment_ondate).format("DD/MM/YYYY HH:MM"),
    },
    {
      name: "Payment Screenshot",
      key: "payment_screenshot",
      width: 180,
      renderRowCell: (row) => {
        const imgUrl = row?.payment_screenshot_url;

        if (!imgUrl) {
          return "No Image";
        }

        const fileExtension = imgUrl?.split(".")?.pop()?.toLowerCase();
        const isPdf = fileExtension === "pdf";

        return isPdf ? (
          <img
            onClick={() => {
              setViewImgDialog(true);
              setViewImgSrc(imgUrl);
            }}
            src={pdfImg}
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
      key: "Balance Amount",
      name: "Balance Amount",
      width: 180,
      compare: true,
      getTotal: true,
      renderRowCell: (row) => row?.campaign_amount - row?.payment_amount,
    },
    {
      name: "Payment Amount",
      key: "payment_amount",
      width: 180,
      getTotal: true,
      renderRowCell: (row) => row?.payment_amount,
    },
    {
      name: "Payment Mode",
      field: "payment_mode",
      width: 180,
      compare: true,
      renderRowCell: (row) => {
        return <div>{row?.payment_mode_name} </div>;
      },
    },
    {
      name: "Payment Status",
      key: "payment_approval_status",
      width: 190,
      renderRowCell: (row) =>
        row?.payment_approval_status === "pending" ? "Pending" : "",
    },
    {
      name: "Bank Name ",
      key: "title",
      width: 180,
      compare: true,
      renderRowCell: (row) => FormatString(row?.payment_detail?.title),
    },
    {
      name: "Bank Detail ",
      Key: "details",
      width: 490,
      compare: true,
      renderRowCell: (row) => (
        (
          <button
            className="btn tableIconBtn btn_sm "
            onClick={() => handleCopyDetail(row?.payment_detail?.details)}
          >
            <ContentCopyIcon />
            {/* or any other icon */}
          </button>
        ),
        FormatString(row?.payment_detail?.details)
      ),
      // width: 150,
    },
    {
      name: "Reference No ",
      key: "payment_ref_no",
      width: 190,
      renderRowCell: (row) => row?.payment_ref_no,
    },
    {
      name: "Remarks ",
      key: "remarks",
      width: 200,
      renderRowCell: (row) => FormatString(row?.remarks),
    },
    {
      width: 200,
      key: "Status",
      name: "Status",
      renderRowCell: (row) => (
        <>
          <Autocomplete
            className="my-2"
            id="combo-box-demo"
            value={row?.statusDropdown || null}
            options={[
              { label: "Approved", value: "approval" },
              { label: "Rejected", value: "reject" },
            ]}
            getOptionLabel={(option) => option?.label}
            onChange={(event, newValue) => {
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
      name: "Payment Requested Date and Time ",
      key: "createdAt",
      width: 180,
      renderRowCell: (row) =>
        row?.createdAt ? moment(row?.createdAt)?.format("DD/MM/YYYY HH:MM") : "",
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
  setOpenImageDialog,
  setViewImgSrc,
  handleOpenEditFieldAction,
}) => [
    {
      key: "s_no",
      name: "S.NO",
      width: 70,
      compare: true,
      renderRowCell: (row, index) => index + 1,
    },
    {
      width: 150,
      name: "Sale Booking ID",
      key: "sale_booking_id",
      showCol: true,
      renderRowCell: (row, index) => <div>{row?.sale_booking_id || ""}</div>,
    },
    {
      name: "Sales Person name",
      key: "user_name",
      width: 220,
      renderRowCell: (row) => {
        return <div>{FormatString(row?.user_name || "")} </div>;
      },
    },
    {
      name: " Requested On",
      key: "createdAt",
      width: 220,
      renderRowCell: (row) => {
        return moment(row?.createdAt)?.format("DD/MM/YYYY HH:MM");
      },
    },
    {
      name: "Sale Booking Date",
      key: "sale_booking_date",
      width: 220,
      renderRowCell: (row) => {
        return moment(row?.saleData?.sale_booking_date).format(
          "DD/MM/YYYY HH:MM"
        );
      },
    },
    {
      name: "Account Name",
      key: "account_name",
      width: 220,
      renderRowCell: (row) => (
        <>
          <Link
            className="text-primary"
            to={`/admin/finance-pending-invoice/customer-details/${row?.saleData?.account_id}`}
          >
            {FormatString(row?.saleData?.account_name)}
          </Link>
        </>
      ),
    },
    {
      name: "Invoice Particular Name",
      key: "invoice_particular_name",
      width: 200,
      renderRowCell: (row) =>
        FormatString(row?.saleData?.invoice_particular_name),
    },
    {
      key: "po_file",
      name: "PO File",
      width: 210,
      renderRowCell: (row) => {
        const fileExtension = row?.purchase_order_upload_url
          ?.split(".")
          .pop()
          .toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = row?.purchase_order_upload_url;

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
      key: "purchase_order_number",
      name: "PO Number",
      width: 210,
      renderRowCell: (row) => row?.purchase_order_number,
    },
    {
      name: "Invoice Type",
      key: "invoice_type_id",
      width: 180,
      renderRowCell: (row) => FormatString(row?.invoice_type_id),
    },
    {
      key: "invoice_amount",
      name: "Invoice Amount",
      width: 200,
      compare: true,
      getTotal: true,
      renderRowCell: (row) => (row?.invoice_amount ? row?.invoice_amount : 0),
    },
    {
      name: "Base Amount",
      key: "base_amount",
      width: 180,
      compare: true,
      getTotal: true,
      renderRowCell: (row) =>
        row?.saleData?.base_amount ? row?.saleData.base_amount : 0,
    },
    {
      name: "GST Amount",
      field: "gst_amount",
      width: 180,
      compare: true,
      getTotal: true,
      renderRowCell: (row) =>
        row?.saleData?.gst_amount ? row?.saleData?.gst_amount : 0,
    },
    {
      name: "Campaign Amount",
      key: "campaign_amount",
      width: 180,
      compare: true,
      getTotal: true,
      renderRowCell: (row) =>
        row?.saleData?.campaign_amount ? row?.saleData?.campaign_amount : 0,
    },
    {
      key: "invoice_action_reason",
      name: "Invoice Reason",
      width: 200,
      compare: true,
      renderRowCell: (row) => FormatString(row?.invoice_action_reason),
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
      key: "Action",
      name: "Action",
      width: 180,
      compare: true,
      renderRowCell: (row) => (
        <div>
          <Button
            variant="contained"
            onClick={() => handleOpenEditFieldAction(row)}
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
      key: "s_no",
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
    },
    {
      width: 150,
      name: "Sale Booking ID",
      key: "sale_booking_id",
      renderRowCell: (row) => <div>{row?.sale_booking_id}</div>,
    },
    {
      key: "cust_name",
      name: "Account name",
      width: 340,
      renderRowCell: (row) => (
        <div>{FormatString(row?.saleData?.account_name) || ""}</div>
      ),
    },
    {
      name: "Sales Person name",
      key: "user_name",
      width: 220,
      renderRowCell: (row) => {
        return <div>{FormatString(row?.user_name) || ""} </div>;
      },
    },
    {
      key: "invoice_particular_name",
      name: "Invoice Particular",
      width: 200,
      renderRowCell: (row) => {
        return (
          <div> {FormatString(row?.saleData?.invoice_particular_name) || ""}</div>
        );
      },
    },
    {
      key: "invoice_file",
      name: "Invoice",
      width: 210,
      renderRowCell: (row) => {
        // Extract file extension and check if it's a PDF
        const fileExtension = row?.invoice_file_url
          ?.split(".")
          .pop()
          .toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = row?.invoice_file_url;

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
      key: "invoice_amount",
      name: "Invoice Amount",
      width: 200,
      getTotal: true,
      renderRowCell: (row) => row?.saleData?.invoice_amount,
    },
    {
      key: "invoice_number",
      name: "Invoice Number",
      width: 200,
      renderRowCell: (row) => row?.invoice_number,
    },
    {
      key: "invoice_uploaded_date",
      name: "Invoice Date",
      width: 200,
      renderRowCell: (row) => row?.invoice_uploaded_date,
    },
    {
      key: "party_name",
      name: "Party Name",
      width: 210,
      renderRowCell: (row) => FormatString(row?.party_name),
    },
    {
      key: "invoice_type_id",
      name: "Invoice Type",
      width: 200,
      renderRowCell: (row) => FormatString(row?.invoice_type_id),
    },
    {
      key: "createdAt",
      name: "Requested Date",
      width: 190,
      renderRowCell: (row) => (
        <div style={{ whiteSpace: "normal" }}>
          {moment(row?.createdAt)?.format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      name: "Campaign Amount",
      key: "campaign_amount",
      width: 210,
      getTotal: true,
      renderRowCell: (row) => row?.saleData?.campaign_amount,
    },
    {
      name: "Reason",
      key: "invoice_action_reason",
      renderRowCell: (row) => FormatString(row?.invoice_action_reason),
    },
    {
      key: "Action",
      name: "Action",
      width: 180,
      renderRowCell: (row) => (
        <div>
          <Button
            variant="contained"
            onClick={() => handleOpenEditFieldAction(row)}
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
  calculateAging,
  setViewImgSrc,
  setViewImgDialog,
  handleImageClick,
  handleDiscardOpenDialog,
  handleOpenEditAction,
  activeAccordionIndex,
  handleOpenCreditNote,
}) => [
    {
      width: 70,
      key: "s_no",
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "sale_booking_id",
      name: "Booking Id",
      renderRowCell: (row) => <div>{row?.sale_booking_id}</div>,
    },
    {
      key: "aging",
      name: "Aging",
      renderRowCell: (row) => {
        const hours = calculateAging(row?.sale_booking_date, new Date());
        const days = Math.round(hours / 24);
        return `${days} Days`;
      },
    },
    {
      key: "account_name",
      name: "Account Name",
      width: 320,
      renderRowCell: (row) => FormatString(row?.account_name),
    },
    {
      key: "created_by_name",
      name: "Sales Executive Name",
      width: 190,
      renderRowCell: (row) => FormatString(row?.created_by_name),
    },
    {
      key: "party_name",
      name: "Party Name",
      width: 210,
      renderRowCell: (row) => FormatString(row?.party_name),
    },
    {
      key: "invoice_number",
      name: "Invoice Number",
      width: 190,
      // renderCell: (params) => {
      //   const salesInvoiceData = params?.row?.salesInvoiceRequestData[0];
      //   return salesInvoiceData?.invoice_number || "";
      // },
    },
    {
      key: "invoice_uploaded_date",
      name: "Invoice Date",
      width: 190,
      renderRowCell: (row) => (
        <div style={{ whiteSpace: "normal" }}>
          {moment(row?.invoice_uploaded_date).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      key: "balance_payment_ondate",
      name: "Expected Payment Receive Date",
      width: 190,
      renderRowCell: (row) => (
        <div style={{ whiteSpace: "normal" }}>
          {moment(row?.balance_payment_ondate).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      key: "sale_booking_date",
      name: "Sale Booking Date",
      width: 190,
      renderRowCell: (row) => (
        <div style={{ whiteSpace: "normal" }}>
          {moment(row?.sale_booking_date).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      key: "campaign_amount",
      name: "Campaign Amount",
      width: 190,
      getTotal: true,
      renderRowCell: (row) => row?.campaign_amount,
    },
    {
      key: "paid_amount",
      name: "Paid Amount",
      width: 190,
      getTotal: true,
      renderRowCell: (row) => (
        <div style={{ whiteSpace: "normal" }}>
          {row?.paid_amount ? row?.paid_amount : 0}
        </div>
      ),
    },
    {
      name: "Balance Amount",
      key: "Balance Amount",
      compare: true,
      getTotal: true,
      renderRowCell: (row) => row?.campaign_amount - row?.paid_amount || 0,
    },
    {
      key: "base_amount",
      name: "Base Amount",
      getTotal: true,
      renderRowCell: (row) => row?.base_amount,
    },
    {
      key: "gst_status",
      name: "GST",
      renderRowCell: (row) => (row.gst_status === true ? "GST" : "Non GST"),
    },
    {
      key: "invoice_file",
      name: "Screen Shot",
      width: 190,
      renderRowCell: (row) => {
        const invoiceData = row?.invoice_file !== "" ? row?.invoice_file : null;
        const imgUrl = `${row?.url}/${invoiceData}`;

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

    (activeAccordionIndex == 0 || activeAccordionIndex == 4) && {
      key: "status",
      name: "Status",
      width: 190,
      renderRowCell: (row) => (
        <div className="d-flex">
          <button
            className="btn cmnbtn btn_sm btn-outline-primary"
            onClick={(e) => handleImageClick(e, row)}
          >
            Balance Update
          </button>
          <button
            className="btn cmnbtn btn_sm btn-outline-primary ms-2"
            onClick={(e) => handleOpenCreditNote(e, row)}
          >
            Credit Note
          </button>
        </div>
      ),
    },
    (activeAccordionIndex == 0 || activeAccordionIndex == 4) && {
      key: "Action",
      name: "Action",
      width: 190,
      renderRowCell: (row) => (
        <div className="flex-row">
          {row?.gst_status === false ? (
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
            to={`/admin/finance-transaction-list/${row?.sale_booking_id}`}
            className="link-primary"
          >
            {row?.paid_amount > 0 ? (
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
      key: "Edit Action",
      name: "Edit Action",
      renderRowCell: (row) => (
        <div>
          <Button variant="contained" onClick={() => handleOpenEditAction(row)}>
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
      name: "S.No",
      key: "s_no",
      renderRowCell: (row, index) =>
        row?.sales_executive_name !== "Total" ? <div>{index + 1}</div> : null,
    },
    {
      name: "Sales Executive Name",
      width: 230,
      key: "sales_executive_name",
      renderRowCell: (row) =>
        row?.sales_executive_name !== "Total" ? (
          <Link
            to={`/admin/Incentive-Request-Released-List/${row?._id}`}
            className="link-primary"
          >
            {row?.sales_executive_name}
          </Link>
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {" "}
            {row?.sales_executive_name}
          </div>
        ),
    },
    {
      name: "Created Date & Time",
      width: 230,
      key: "createdAt",
      renderRowCell: (row) =>
        row?.sales_executive_name !== "Total"
          ? new Date(row?.createdAt).toLocaleDateString("en-IN") +
          " " +
          new Date(row?.createdAt).toLocaleTimeString("en-IN")
          : null,
    },
    {
      name: "User Requested Amount",
      width: 230,
      key: "user_requested_amount",
      getTotal: true,
      renderRowCell: (row) =>
        row?.sales_executive_name !== "Total" ? (
          row?.user_requested_amount
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {row?.user_requested_amount?.toFixed(2)}
          </div>
        ),
    },
    {
      name: "Admin Approved Amount",
      width: 180,
      key: "admin_approved_amount",
      getTotal: true,
      renderRowCell: (row) =>
        row?.sales_executive_name !== "Total" ? (
          row?.admin_approved_amount
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {row?.admin_approved_amount?.toFixed(2)}
          </div>
        ),
    },
    viewPendingStatus !== true && {
      name: "Released Amount",
      key: "finance_released_amount",
      getTotal: true,
      renderRowCell: (row) =>
        row?.sales_executive_name !== "Total" ? (
          <Link
            to={`/admin/Incentive-balance-Released/${row?._id}`}
            className="link-primary"
          >
            {row?.finance_released_amount
              ? row?.finance_released_amount?.toLocaleString("en-IN")
              : 0}
          </Link>
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {row?.finance_released_amount?.toLocaleString("en-IN")}
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
      key: "Status",
      name: "Status",
      width: 230,
      renderRowCell: (row) => {
        return row?.sales_executive_name === "Total" ? (
          ""
        ) : (
          // <span>Released</span>
          <button
            className="btn cmnbtn btn_sm btn-outline-primary"
            // data-toggle="modal"
            // data-target="#incentiveModal"
            onClick={(e) => {
              e.preventDefault();
              setSelectedData(row),
                setBalanceReleaseAmount(row?.balance_release_amount);
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
      key: "Aging",
      name: "Aging",
      renderRowCell: (row) => {
        if (row?.sales_executive_name === "Total") {
          return "";
        } else {
          const hours = calculateAging(row?.createdAt, new Date());
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
      key: "s_no",
      name: "S.NO",
      // width: 70,
      renderRowCell: (row, index) => index + 1,
      // editable: false,
      // renderRowCell: (row) => {
      //   const rowIndex =
      //     activeAccordionIndex == 0
      //       ? filterData?.indexOf(row)
      //       : activeAccordionIndex == 1
      //         ? filterData?.filter((d) => d.status === "3").indexOf(row)
      //         : filterData?.filter((d) => d.status === "0").indexOf(row);

      //   return <div>{rowIndex + 1}</div>;
      // },
    },
    {
      key: "invc_img",
      name: "Invoice Image",
      renderRowCell: (row) => {
        if (!row?.invc_img) {
          return "No Image";
        }
        // Extract file extension and check if it's a PDF
        const fileExtension = row?.invc_img.split(".").pop().toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = `https://purchase.creativefuel.io/${row?.invc_img}`;

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
      key: "zoho_status",
      name: "Zoho Status",
      width: 130,
      renderRowCell: (row) => {
        return <div>{row?.zoho_status === "1" ? "Uploaded" : ""}</div>;
      },
    },
    {
      key: "Zoho Uploaded",
      name: "Zoho Uploaded",
      width: 130,
      renderRowCell: (row) => {
        return (
          <div>
            <button
              className="btn btn-primary cmnbtn btn_sm "
              onClick={() => handleZohoStatusUpload(row)}
            >
              Zoho Uploaded
            </button>
          </div>
        );
      },
    },
    {
      key: "invc_no",
      name: "Invoice Number",
      width: 150,
      renderRowCell: (row) => {
        return <div>{row?.invc_no}</div>;
      },
    },
    {
      key: "invc_Date",
      name: "Invoice Date",
      width: 150,
      renderRowCell: (row) => moment(row?.invc_Date).format("DD/MM/YYYY hh:mm"),
    },

    {
      key: "request_date",
      name: "Requested Date",
      width: 150,
      renderRowCell: (row) =>
        moment(row?.request_date).format("DD/MM/YYYY hh:mm"),
    },
    {
      key: "name",
      name: "Requested By",
      width: 150,
      renderRowCell: (row) => {
        return (
          <>
            <span>{row?.name}</span> &nbsp;{" "}
          </>
        );
      },
    },
    {
      key: "Reminder",
      name: "Reminder",
      width: 150,
      renderRowCell: (row) => {
        const reminder = phpRemainderData?.filter(
          (item) => item.request_id == row?.request_id
        );

        return (
          <>
            <span>
              {reminder?.length > 0 ? (
                <Badge badgeContent={reminder?.length} color="primary">
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
      key: "vendor_name",
      name: "Vendor Name",
      width: 200,
      renderRowCell: (row) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Hold for confirmation of sourabh sir */}
            <Button
              disabled={
                row?.payment_details ? !row?.payment_details.length > 0 : true
              }
              onClick={() => handleOpenBankDetail(row)}
            >
              <AccountBalanceIcon style={{ fontSize: "25px" }} />
            </Button>
            <a
              style={{ cursor: "pointer", marginRight: "20px", color: "blue" }}
              onClick={() => handleOpenSameVender(row?.vendor_name)}
            >
              {row?.vendor_name}
            </a>
          </div>
        );
      },
    },

    {
      key: "account_no",
      name: "Account No.",
      width: 150,
    },
    {
      key: "ifsc",
      name: "IFSC",
      width: 150,
    },
    {
      key: "request_amount",
      name: "Requested Amount",
      width: 150,
      getTotal: true,
      renderCell: (row) => {
        return row?.request_amount;
      },
    },
    {
      key: "remark_audit",
      name: "Remark",
      width: 150,
      renderRowCell: (row) => {
        return row?.remark_audit;
      },
    },

    {
      key: "email",
      name: "Email",
      width: 150,
    },
    {
      key: "page_name",
      name: "Page Name",
      width: 150,
    },
    {
      key: "payment_cycle",
      name: "Payment Cycle",
      width: 150,
    },
    {
      key: "total_paid",
      name: "Total Paid",
      width: 150,
      renderRowCell: (row) => {
        return nodeData?.filter((e) => e.vendor_name === row?.vendor_name)
          .length > 0 ? (
          <span>
            <h6
              onClick={() => handleOpenPaymentHistory(row, "TP")}
              style={{ cursor: "pointer" }}
              className="pointer lead  text-decoration-underline text-black-50"
            >
              {/* Total Paid */}
              {nodeData
                .filter(
                  (e) => e.vendor_name === row?.vendor_name && e.status == 1
                )
                .reduce((acc, item) => acc + +item.payment_amount, 0)}
            </h6>
          </span>
        ) : (
          <h6
            style={{ cursor: "pointer" }}
            className="pointer lead  text-decoration-underline text-black-50"
          >
            0
          </h6>
        );
      },
    },
    {
      key: "F.Y",
      name: "F.Y",
      width: 150,
      renderRowCell: (row) => {
        const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
        const currentYear = new Date().getFullYear();
        const startDate = new Date(
          `04/01/${isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
          }`
        );
        const endDate = new Date(
          `03/31/${isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
          }`
        );
        const dataFY = nodeData?.filter((e) => {
          const paymentDate = new Date(e.request_date);
          return (
            paymentDate >= startDate &&
            paymentDate <= endDate &&
            e.vendor_name === row?.vendor_name &&
            e.status !== 0 &&
            e.status !== 2 &&
            e.status !== 3
          );
        });
        return nodeData?.filter((e) => e.vendor_name === row?.vendor_name)
          .length > 0 ? (
          <h5
            onClick={() => handleOpenPaymentHistory(row, "FY")}
            style={{ cursor: "pointer" }}
            className="pointer font-sm lead  text-decoration-underline text-black-50"
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
            className="pointer font-sm lead  text-decoration-underline text-black-50"
          >
            0
          </h5>
        );
      },
    },
    {
      key: "pan_img",
      name: "Pan Img",
      renderRowCell: (row) => {
        const ImgUrl = `https://purchase.creativefuel.io/${row?.pan_img}`;
        return row?.pan_img.includes("uploads") ? (
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
      key: "pan",
      name: "Pan",
      width: 150,
    },
    {
      key: "gst",
      name: "GST Status",
      NearMeDisabledOutlined: "GST",
      width: 200,
    },

    {
      key: "priority",
      name: "Priority",
      width: 150,
      renderRowCell: (row) => {
        return row?.priority;
      },
    },

    {
      key: "paid_amount",
      name: "Paid Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.paid_amount;
      },
    },
    {
      key: "balance_amount",
      name: "Balance Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.balance_amount;
      },
    },
    {
      key: "base_amount",
      name: "Base Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.base_amount ? row?.base_amount : "NA";
      },
    },
    {
      key: "gst_amount",
      name: "GST Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.gst_amount ? row?.gst_amount : "NA";
      },
    },
    {
      key: "outstandings",
      name: "OutStanding ",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.outstandings;
      },
    },
    {
      key: "TDSDeduction",
      name: "TDS Deducted ",
      width: 150,
      renderRowCell: (row) => {
        return <p> &#8377; {row?.TDSDeduction === "1" ? "Yes" : "No"}</p>;
      },
    },
    {
      key: "aging",
      name: "Aging",
      width: 150,
      // valueGetter: (params) => {
      //   const hours = calculateHours(params.row.request_date, new Date());
      //   const days = Math.round(hours / 24);
      //   // console.log(`Calculating aging for request_date ${params.row.request_date}: ${hours} hours, ${days} days`);
      //   return `${days} Days`;
      // },
      renderRowCell: (row) => row?.aging + " Days",
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
      key: "status",
      name: "Status",
      width: 150,
      renderRowCell: (row) => (
        <div>
          {row?.status === "0"
            ? "Pending"
            : row?.status === "1"
              ? "Paid"
              : row?.status === "2"
                ? "Discard"
                : row?.status === "3"
                  ? "Partial"
                  : ""}
        </div>
      ),
    },
    {
      key: "Action",
      name: "Action",
      width: 400,
      renderRowCell: (row) => {
        return (
          <div className="flexCenter colGap8">
            <button
              className="btn cmnbtn btn_sm btn-success"
              onClick={(e) => handlePayClick(e, row)}
            >
              Pay
            </button>
            <button
              className="btn cmnbtn btn_sm btn-danger"
              onClick={(e) => handleDiscardClick(e, row)}
            >
              Discard
            </button>
            <button className="btn cmnbtn btn_sm btn-success">
              <Link
                to={`/admin/finance-pruchasemanagement-paymentdone-transactionlist/${row?.request_id}`}
              >
                Transaction List
              </Link>
            </button>
            {/* <button
            className="btn btn-primary cmnbtn btn_sm "
            onClick={(e) => handleZohoStatusUpload(e)}
          >
            Zoho Uploaded
          </button> */}
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
      key: "s_no",
      name: "S.NO",
      width: 90,
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "invc_img",
      name: "Invoice Image",
      renderRowCell: (row) => {
        if (!row?.invc_img) {
          return "No Image";
        }
        // Extract file extension and check if it's a PDF
        const fileExtension = row?.invc_img?.split(".")?.pop()?.toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = `https://purchase.creativefuel.io/${row?.invc_img}`;
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
      key: "evidence",
      name: "Payment Screenshot",
      renderRowCell: (row) => {
        if (!row?.evidence) {
          return "No Image";
        }
        // Extract file extension and check if it's a PDF
        const fileExtension = row?.invc_img?.split(".")?.pop()?.toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = `https://purchase.creativefuel.io/${row?.evidence}`;

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
      key: "request_date",
      name: "Requested Date",
      width: 200,
      renderRowCell: (row) => {
        return moment(row?.request_date)?.format("DD-MM-YYYY HH:MM A");
      },
    },
    {
      key: "payment_date",
      name: "Payment Date",
      width: 200,
      renderRowCell: (row) => {
        return moment(row?.payment_date).format("DD-MM-YYYY HH:MM A");
      },
    },
    {
      key: "name",
      name: "Requested By",
      width: 300,
      renderRowCell: (row) => {
        const reminder = phpRemainderData?.filter(
          (item) => item?.request_id == row?.request_id
        );

        return (
          <>
            <span>{row?.name}</span> &nbsp;{" "}
            <span>
              {reminder?.length > 0 ? (
                <Badge badgeContent={reminder?.length} color="primary">
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
      key: "vendor_name",
      name: "Vendor Name",
      width: 200,
      renderRowCell: (row) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Hold for confirmation of sourabh sir */}
            <Button
              disabled={
                row?.payment_details ? !row?.payment_details?.length > 0 : true
              }
              onClick={() => handleOpenBankDetail(row)}
            >
              <AccountBalanceIcon style={{ fontSize: "25px" }} />
            </Button>
            <div
              style={{ cursor: "pointer", marginRight: "20px" }}
              onClick={() => handleOpenSameVender(row?.vendor_name)}
            >
              {row?.vendor_name}
            </div>
          </div>
        );
      },
    },
    {
      key: "page_name",
      name: "Page Name",
      width: 150,
    },
    {
      key: "total_paid",
      name: "Total Paid",
      width: 150,
      renderRowCell: (row) => {
        return nodeData?.filter((e) => e?.vendor_name === row?.vendor_name)
          .length > 0 ? (
          <span className="row ml-2 ">
            <h5
              onClick={() => handleOpenPaymentHistory(row, "TP")}
              style={{ cursor: "pointer" }}
              className="pointer font-sm lead  text-decoration-underline text-black-50"
            >
              {/* Total Paid */}
              {nodeData
                ?.filter(
                  (e) => e?.vendor_name === row?.vendor_name && e?.status == 1
                )
                ?.reduce((acc, item) => acc + +item.payment_amount, 0)}
            </h5>
          </span>
        ) : (
          <h5
            style={{ cursor: "pointer" }}
            className=" pointer font-sm lead  text-decoration-underline text-black-50"
          >
            0
          </h5>
        );
      },
    },
    {
      key: "F.Y",
      name: "F.Y",
      width: 150,
      renderRowCell: (row) => {
        const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
        const currentYear = new Date().getFullYear();
        const startDate = new Date(
          `04/01/${isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
          }`
        );
        const endDate = new Date(
          `03/31/${isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
          }`
        );
        const dataFY = nodeData.filter((e) => {
          const paymentDate = new Date(e.request_date);
          return (
            paymentDate >= startDate &&
            paymentDate <= endDate &&
            e.vendor_name === row?.vendor_name &&
            e.status !== 0 &&
            e.status !== 2
          );
        });
        return nodeData?.filter((e) => e.vendor_name === row?.vendor_name)
          ?.length > 0 ? (
          <h5
            onClick={() => handleOpenPaymentHistory(row, "FY")}
            style={{ cursor: "pointer" }}
            className="font-sm lead  text-decoration-underline text-black-50"
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
            className="font-sm lead  text-decoration-underline text-black-50"
          >
            0
          </h5>
        );
      },
    },
    {
      key: "pan_img",
      name: "Pan Img",
      renderRowCell: (row) => {
        const ImgUrl = `https://purchase.creativefuel.io/${row?.pan_img}`;
        return row?.pan_img?.includes("uploads") ? (
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
      key: "pan",
      name: "PAN",
      width: 200,
    },
    {
      key: "gst",
      name: "GST",
      width: 200,
    },
    {
      key: "remark_audit",
      name: "Remark",
      width: 150,
      renderRowCell: (row) => {
        return row?.remark_audit;
      },
    },
    {
      key: "priority",
      name: "Priority",
      width: 150,
      renderRowCell: (row) => {
        return row?.priority;
      },
    },
    {
      key: "request_amount",
      name: "Requested Amount",
      width: 150,
      renderRowCell: (row) => {
        return row?.request_amount;
      },
    },
    {
      key: "base_amount",
      name: "Base Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.base_amount ? row?.base_amount : "NA";
      },
    },
    {
      key: "paid_amount",
      name: "Paid Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.paid_amount ? row?.paid_amount : "NA";
      },
    },
    {
      key: "gst_amount",
      name: "GST Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row.gst_amount ? row.gst_amount : "NA";
      },
    },
    {
      key: "gst_hold_amount",
      name: "GST Hold Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.gst_hold_amount ? row?.gst_hold_amount : "NA";
      },
    },
    {
      key: "tds_deduction",
      name: "TDS Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.tds_deduction ? row?.tds_deduction : "NA";
      },
    },
    {
      key: "tds_percentage",
      name: "TDS Percentage",
      width: 150,
      renderRowCell: (row) => {
        return row?.tds_percentage ? <p>{row?.tds_percentage} %</p> : "NA";
      },
    },
    {
      key: "outstandings",
      name: "OutStanding ",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.outstandings;
      },
    },
    {
      key: "payment_amount",
      name: "Payment Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        const paymentAmount = nodeData?.filter(
          (e) => e.request_id == row?.request_id
        )[0]?.payment_amount;
        return paymentAmount ? paymentAmount : "NA";
      },
    },
    {
      key: "payment_by",
      name: "Payment By",
      width: 150,
      renderRowCell: (row) => <div>{row?.payment_by}</div>,
    },
    {
      key: "aging",
      name: "Aging",
      width: 150,
      renderRowCell: (row) => {
        return <p> {row?.aging} Days</p>;
      },
    },
    {
      key: "status",
      name: "Status",
      width: 150,
      renderRowCell: (row) => (
        <div>
          {row?.status === "1"
            ? "Paid"
            : row?.status === "2"
              ? "Discard"
              : row?.status === "3"
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
      key: "gstHold",
      name: "GST Hold",
      width: 150,
      renderRowCell: (row) => {
        return row?.gstHold == 1 ? "Yes" : "No";
      },
    },
    {
      key: "TDSDeduction",
      name: "TDS Deduction",
      width: 150,
      renderRowCell: (row) => {
        return row?.TDSDeduction == 1 ? "Yes" : "No";
      },
    },
    {
      key: "Action",
      name: "Action",
      width: 150,
      renderRowCell: (row) => (
        <Button variant="outline" className="btn cmnbtn btn-primary">
          <Link
            to={`/admin/finance-pruchasemanagement-paymentdone-transactionlist/${row?.request_id}`}
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
export const DiscardColumns = ({
  phpRemainderData,
  nodeData,
  setOpenImageDialog,
  setViewImgSrc,
  handleRemainderModal,
  handleOpenSameVender,
  calculateDays,
  handleOpenPaymentHistory,
  handleOpenBankDetail,
}) => [
    {
      key: "s_no",
      name: "S.NO",
      width: 90,
      editable: false,
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "invc_img",
      name: "Invoice Image",
      renderRowCell: (row) => {
        // Extract file extension and check if it's a PDF
        const fileExtension = row?.invc_img.split(".").pop().toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = `https://purchase.creativefuel.io/${row?.invc_img}`;
        return row?.invc_img ? (
          isPdf ? (
            <iframe
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(imgUrl);
              }}
              src={imgUrl}
              style={{ width: "100px", height: "45px" }}
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
              style={{ width: "40px", height: "40px" }}
            />
          )
        ) : (
          ""
        );
      },
      width: 250,
    },
    {
      key: "request_date",
      name: "Requested Date",
      width: 150,
      renderRowCell: (row) =>
        moment(row?.request_date).format("DD/MM/YYYY hh:mm"),
    },
    {
      key: "name",
      name: "Requested By",
      width: 150,
      renderRowCell: (row) => {
        const reminder = phpRemainderData?.filter(
          (item) => item.request_id == row?.request_id
        );

        return (
          <>
            <span>{row?.name}</span> &nbsp;{" "}
            <span>
              {reminder?.length > 0 ? (
                <Badge badgeContent={reminder?.length} color="primary">
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
      key: "vendor_name",
      name: "Vendor Name",
      width: 200,
      renderRowCell: (row) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{ cursor: "pointer", marginRight: "20px" }}
              onClick={() => handleOpenSameVender(row?.vendor_name)}
            >
              {row?.vendor_name}
            </div>
            {/* <div onClick={() => handleOpenBankDetail()}>
            <AccountBalanceIcon style={{ fontSize: "25px" }} />
          </div> */}
            <Button
              disabled={
                row?.payment_details ? !row?.payment_details.length > 0 : true
              }
              onClick={() => handleOpenBankDetail(params.row)}
            >
              <AccountBalanceIcon style={{ fontSize: "25px" }} />
            </Button>
          </div>
        );
      },
    },
    {
      key: "page_name",
      name: "Page Name",
      width: 150,
    },
    {
      key: "total_paid",
      name: "Total Paid",
      width: 150,
      renderRowCell: (row) => {
        return nodeData?.filter((e) => e.vendor_name === row?.vendor_name)
          .length > 0 ? (
          <span className="row ml-2 ">
            <h5
              onClick={() => handleOpenPaymentHistory(row, "TP")}
              style={{ cursor: "pointer" }}
              className=" pointer font-sm lead  text-decoration-underline text-black-50"
            >
              {/* Total Paid */}
              {nodeData
                .filter(
                  (e) => e.vendor_name === row?.vendor_name && e.status == 1
                )
                .reduce((acc, item) => acc + +item.payment_amount, 0)}
            </h5>
          </span>
        ) : (
          <h5
            style={{ cursor: "pointer" }}
            className=" pointer font-sm lead  text-decoration-underline text-black-50"
          >
            0
          </h5>
        );
      },
    },
    {
      key: "F.Y",
      name: "F.Y",
      width: 150,
      renderRowCell: (row) => {
        const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
        const currentYear = new Date().getFullYear();
        const startDate = new Date(
          `04/01/${isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
          }`
        );
        const endDate = new Date(
          `03/31/${isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
          }`
        );
        const dataFY = nodeData?.filter((e) => {
          const paymentDate = new Date(e.request_date);
          return (
            paymentDate >= startDate &&
            paymentDate <= endDate &&
            e.vendor_name === row?.vendor_name &&
            e.status !== 0 &&
            e.status !== 2
          );
        });
        return nodeData?.filter((e) => e.vendor_name === row?.vendor_name)
          ?.length > 0 ? (
          <h5
            onClick={() => handleOpenPaymentHistory(row, "FY")}
            style={{ cursor: "pointer" }}
            className="font-sm lead  text-decoration-underline text-black-50"
          >
            {/* Financial Year */}

            {dataFY?.reduce(
              (acc, item) => acc + parseFloat(item.payment_amount),
              0
            )}
          </h5>
        ) : (
          <h5
            style={{ cursor: "pointer" }}
            className="font-sm lead  text-decoration-underline text-black-50"
          >
            0
          </h5>
        );
      },
    },
    {
      key: "pan_img",
      name: "Pan Img",
      renderRowCell: (row) => {
        return row?.pan_img ? (
          <img
            src={row?.pan_img}
            alt="Pan"
            style={{ width: "40px", height: "40px" }}
          />
        ) : (
          "NA"
        );
      },
    },
    {
      key: "remark_audit",
      name: "Remark",
      width: 150,
      renderRowCell: (row) => {
        return row?.remark_audit;
      },
    },
    {
      key: "priority",
      name: "Priority",
      width: 150,
      renderRowCell: (row) => {
        return row?.priority;
      },
    },
    {
      key: "request_amount",
      name: "Requested Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.request_amount;
      },
    },
    {
      key: "base_amount",
      name: "Base Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.base_amount ? row?.base_amount : "NA";
      },
    },
    {
      key: "gst_amount",
      name: "GST Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.gst_amount ? row?.gst_amount : "NA";
      },
    },
    {
      key: "outstandings",
      name: "OutStanding ",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.outstandings;
      },
    },
    {
      key: "aging",
      name: "Aging",
      width: 150,
      renderRowCell: (row) => {
        return <p> {calculateDays(row?.request_date, new Date())} Days</p>;
      },
    },
  ];
export const DiscardUniqueVendorColumns = ({
  handleOpenSameVender,
  filterData,
  uniqueVendorData = [],
}) => [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = uniqueVendorData?.indexOf(params?.row);
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
            style={{ cursor: "pointer", color: "#" }}
            onClick={() => handleOpenSameVender(params?.row?.vendor_name)}
          >
            {params?.row?.vendor_name}
          </a>
        );
      },
    },
    {
      field: "total_amount",
      headerName: "Total Amount",
      width: 150,
      renderCell: (params) => {
        const sameVendor = filterData.filter(
          (e) => e.vendor_name === params?.row.vendor_name
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
        return <p> &#8377; {params?.Daterow?.outstandings}</p>;
      },
    },
  ];

export const TDSDeductedColumns = ({
  nodeData,
  setOpenImageDialog,
  setViewImgSrc,
  handleOpenSameVender,
  calculateDays,
  handleOpenPaymentHistory,
  handleOpenBankDetail,
}) => [
    {
      key: "s_no",
      name: "S.NO",
      width: 90,
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "invc_img",
      name: "Invoice Image",
      renderRowCell: (row) => {
        const fileExtension = row?.invc_img.split(".").pop().toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = `https://purchase.creativefuel.io/${row?.invc_img}`;
        return isPdf ? (
          <>
            <iframe
              allowFullScreen={true}
              src={imgUrl}
              title="PDF Preview"
              style={{ width: "80px", height: "45px" }}
            />
            <div
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(imgUrl);
              }}
              style={{
                position: "absolute",
                width: "4.2%",
                height: "29%",
                top: "107px",
                left: "104px",
                cursor: "pointer",
                background: "rgba(0, 0, 0, 0)",
                zIndex: 10,
              }}
            ></div>
          </>
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
      key: "request_date",
      name: "Requested Date",
      width: 150,
      renderRowCell: (row) =>
        moment(row?.request_date).format("DD/MM/YYYY hh:mm"),
    },
    {
      key: "name",
      name: "Requested By",
      width: 150,
      renderRowCell: (row) => {
        return row?.name;
      },
    },
    {
      key: "vendor_name",
      name: "Vendor Name",
      width: 200,
      renderRowCell: (row) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Hold for confirmation of sourabh sir */}
            <Button
              disabled={
                row?.payment_details ? !row?.payment_details.length > 0 : true
              }
              onClick={() => handleOpenBankDetail(row)}
            >
              <AccountBalanceIcon style={{ fontSize: "25px" }} />
            </Button>
            <div
              style={{ cursor: "pointer", marginRight: "20px" }}
              onClick={() => handleOpenSameVender(row?.vendor_name)}
            >
              {row?.vendor_name}
            </div>
          </div>
        );
      },
    },
    {
      key: "page_name",
      name: "Page Name",
      width: 150,
    },
    {
      key: "total_paid",
      name: "Total Paid",
      width: 150,
      renderRowCell: (row) => {
        return nodeData?.filter((e) => e.vendor_name === row?.vendor_name)
          .length > 0 ? (
          <span>
            <h5
              onClick={() => handleOpenPaymentHistory(row, "TP")}
              style={{ cursor: "pointer" }}
              className=" pointer font-sm lead  text-decoration-underline text-black-50"
            >
              {/* Total Paid */}
              {nodeData
                .filter(
                  (e) => e.vendor_name === row?.vendor_name && e.status == 1
                )
                .reduce((acc, item) => acc + +item.payment_amount, 0)}
            </h5>
          </span>
        ) : (
          <h5
            style={{ cursor: "pointer" }}
            className="pointer font-sm lead  text-decoration-underline text-black-50"
          >
            0
          </h5>
        );
      },
    },
    {
      key: "F.Y",
      name: "F.Y",
      width: 150,
      renderRowCell: (row) => {
        const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
        const currentYear = new Date().getFullYear();
        const startDate = new Date(
          `04/01/${isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
          }`
        );
        const endDate = new Date(
          `03/31/${isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
          }`
        );
        const dataFY = nodeData.filter((e) => {
          const paymentDate = new Date(e.request_date);
          return (
            paymentDate >= startDate &&
            paymentDate <= endDate &&
            e.vendor_name === row?.vendor_name &&
            e.status !== 0 &&
            e.status !== 2
          );
        });
        return nodeData.filter((e) => e.vendor_name === row?.vendor_name).length >
          0 ? (
          <h5
            onClick={() => handleOpenPaymentHistory(row, "FY")}
            style={{ cursor: "pointer" }}
            className=" font-sm lead  text-decoration-underline text-black-50"
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
            className=" font-sm lead  text-decoration-underline text-black-50"
          >
            0
          </h5>
        );
      },
    },
    {
      key: "Pan Img",
      name: "Pan Img",
      renderRowCell: (row) => {
        const ImgUrl = `https://purchase.creativefuel.io/${row?.pan_img}`;
        return row?.pan_img?.includes("uploads") ? (
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
      key: "pan",
      name: "PAN",
      width: 200,
    },
    {
      key: "gst",
      name: "GST",
      width: 200,
    },
    {
      key: "remark_audit",
      name: "Remark",
      width: 150,
      renderCell: (row) => {
        return row?.remark_audit;
      },
    },
    {
      key: "priority",
      name: "Priority",
      width: 150,
      renderRowCell: (row) => {
        return row?.priority;
      },
    },
    {
      key: "request_amount",
      name: "Requested Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.request_amount;
      },
    },
    {
      key: "base_amount",
      name: "Base Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.base_amount ? row?.base_amount : "NA";
      },
    },
    {
      key: "gst_amount",
      name: "GST Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.gst_amount ? row?.gst_amount : "NA";
      },
    },
    {
      key: "gst_hold_amount",
      name: "GST Hold Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.gst_hold_amount ? row?.gst_hold_amount : "NA";
      },
    },
    {
      key: "tds_deduction",
      name: "TDS Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.tds_deduction ? row?.tds_deduction : "NA";
      },
    },
    {
      key: "outstandings",
      name: "OutStanding ",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.outstandings;
      },
    },
    {
      key: "payment_amount",
      name: "Payment Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        const paymentAmount = nodeData?.filter(
          (e) => e.request_id == row?.request_id
        )[0]?.payment_amount;
        return paymentAmount ? paymentAmount : "NA";
      },
    },
    {
      key: "aging",
      name: "Aging",
      width: 150,
      renderRowCell: (row) => {
        return <p> {calculateDays(row?.request_date, new Date())} Days</p>;
      },
    },
    {
      key: "gst_Hold_Bool",
      name: "GST Hold",
      renderRowCell: (row) => {
        return row?.gstHold == 1 ? "Yes" : "No";
      },
    },
  ];

export const TDSDeductedUniqueVendorColumns = ({
  handleOpenSameVender,
  filterData,
  uniqueVendorData = [],
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
      width: 250,
      renderCell: (params) => {
        return (
          <a
            href="#"
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => handleOpenSameVender(params?.row.vendor_name)}
          >
            {params?.row?.vendor_name}
          </a>
        );
      },
    },
    {
      field: "total_amount",
      headerName: "Total Amount",
      width: 150,
      renderCell: (params) => {
        const sameVendor = filterData?.filter(
          (e) => e.vendor_name === params?.row?.vendor_name
        );
        const reduceAmt = sameVendor?.reduce(
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
        const sameVendor = filterData?.filter(
          (e) => e.vendor_name === params?.row?.vendor_name
        );
        const reduceAmt = sameVendor?.reduce((a, b) => a + 1 * b.outstandings, 0);
        return <p> &#8377; {reduceAmt}</p>;
      },
    },
  ];

export const GSTHoldColumns = ({
  setOpenImageDialog,
  setViewImgSrc,
  handleOpenBankDetail,
  handleOpenSameVender,
  calculateDays,
  nodeData,
  handleOpenPaymentHistory,
}) => [
    {
      key: "s_no",
      name: "S.NO",
      width: 90,
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "invc_img",
      name: "Invoice Image",
      renderRowCell: (row) => {
        // Extract file extension and check if it's a PDF
        const fileExtension = row?.invc_img?.split(".").pop().toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = `https://purchase.creativefuel.io/${row?.invc_img}`;
        return isPdf ? (
          <>
            <iframe
              allowFullScreen={true}
              src={imgUrl}
              title="PDF Preview"
              style={{ width: "80px", height: "65px", padding: "10px" }}
            />
            <div
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(imgUrl);
              }}
              style={{
                position: "absolute",
                width: "2.7%",
                height: "74%",
                top: "2px",
                left: "104px",
                cursor: "pointer",
                background: "rgba(0, 0, 0, 0)",
                zIndex: 10,
              }}
            ></div>
          </>
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
      key: "request_date",
      name: "Requested Date",
      width: 150,
      renderRowCell: (row) =>
        moment(row?.request_date).format("DD/MM/YYYY hh:mm"),
    },
    {
      key: "name",
      name: "Requested By",
      width: 150,
      renderRowCell: (row) => {
        return row?.name;
      },
    },
    {
      key: "vendor_name",
      name: "Vendor Name",
      width: 200,
      renderRowCell: (row) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Hold for confirmation of sourabh sir */}
            <Button
              disabled={
                row?.payment_details ? !row?.payment_details.length > 0 : true
              }
              onClick={() => handleOpenBankDetail(row)}
            >
              <AccountBalanceIcon style={{ fontSize: "25px" }} />
            </Button>
            <div
              style={{ cursor: "pointer", marginRight: "20px" }}
              onClick={() => handleOpenSameVender(row?.vendor_name)}
            >
              {row?.vendor_name}
            </div>
          </div>
        );
      },
    },
    {
      key: "page_name",
      name: "Page Name",
      width: 150,
    },
    {
      key: "total_paid",
      name: "Total Paid",
      width: 150,
      renderRowCell: (row) => {
        return nodeData.filter((e) => e.vendor_name === row?.vendor_name).length >
          0 ? (
          <span className="row ml-2 ">
            <h5
              onClick={() => handleOpenPaymentHistory(row, "TP")}
              style={{ cursor: "pointer" }}
              className="pointer font-sm lead text-decoration-underline text-black-50"
            >
              {/* Total Paid */}
              {nodeData
                .filter(
                  (e) => e.vendor_name === row?.vendor_name && e.status == 1
                )
                .reduce((acc, item) => acc + +item.payment_amount, 0)}
            </h5>
          </span>
        ) : (
          <h5
            style={{ cursor: "pointer" }}
            className="pointer font-sm lead  text-decoration-underline text-black-50"
          >
            0
          </h5>
        );
      },
    },
    {
      key: "F.Y",
      name: "F.Y",
      width: 150,
      renderRowCell: (row) => {
        const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
        const currentYear = new Date().getFullYear();
        const startDate = new Date(
          `04/01/${isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
          }`
        );
        const endDate = new Date(
          `03/31/${isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
          }`
        );
        const dataFY = nodeData.filter((e) => {
          const paymentDate = new Date(e.request_date);
          return (
            paymentDate >= startDate &&
            paymentDate <= endDate &&
            e.vendor_name === row?.vendor_name &&
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
    },
    {
      key: "Pan Img",
      name: "Pan Img",
      valueGetter: (row) =>
        row?.pan_img.includes("uploads") ? row?.pan_img : "NA",
      renderRowCell: (row) => {
        const ImgUrl = `https://purchase.creativefuel.io/${row?.pan_img}`;
        return row?.pan_img?.includes("uploads") ? (
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
      key: "pan",
      name: "PAN",
      width: 200,
    },
    {
      key: "gst",
      name: "GST",
      width: 200,
    },
    {
      key: "remark_audit",
      name: "Remark",
      width: 150,
      renderRowCell: (row) => {
        return row?.remark_audit;
      },
    },
    {
      key: "priority",
      name: "Priority",
      width: 150,
      renderRowCell: (row) => {
        return row?.priority;
      },
    },
    {
      key: "request_amount",
      name: "Requested Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.request_amount;
      },
    },
    {
      key: "base_amount",
      name: "Base Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.base_amount ? row?.base_amount : "NA";
      },
    },
    {
      key: "gst_amount",
      name: "GST Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.gst_amount ? row?.gst_amount : "NA";
      },
    },
    {
      key: "gst_hold_amount",
      name: "GST Hold Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.gst_hold_amount ? row?.gst_hold_amount : "NA";
      },
    },
    {
      key: "tds_deduction",
      name: "TDS Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.tds_deduction ? row?.tds_deduction : "NA";
      },
    },
    {
      key: "outstandings",
      name: "OutStanding ",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        return row?.outstandings;
      },
    },
    {
      key: "payment_amount",
      name: "Payment Amount",
      width: 150,
      getTotal: true,
      renderRowCell: (row) => {
        const paymentAmount = nodeData?.filter(
          (e) => e.request_id == row?.request_id
        )[0]?.payment_amount;
        return paymentAmount ? paymentAmount : "NA";
      },
    },
    {
      key: "aging",
      name: "Aging",
      width: 150,
      renderRowCell: (row) => {
        return <p> {calculateDays(row.request_date, new Date())} Days</p>;
      },
    },
    {
      key: "gst_Hold_Bool",
      name: "GST Hold",
      renderRowCell: (row) => {
        return row.gstHold == 1 ? "Yes" : "No";
      },
    },
  ];

export const GSTHoldUniqueVendorColumns = ({
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
