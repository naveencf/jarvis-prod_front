import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegFilePdf } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa"; // Import Excel icon
import jwtDecode from "jwt-decode";
import FormContainer from "../../../AdminPanel/FormContainer";
import { useGlobalContext } from "../../../../Context/Context";
import { Autocomplete, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import { baseUrl } from "../../../../utils/config";
import ImageView from "../../ImageView";
import pdf from "../../pdf-file.png";
import moment from "moment";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import Tab from "../../../Tab/Tab";
import ApprovedList from "../../ApprovedList";
import EditButtonActionDialog from "../../CommonDialog/EditButtonActionDialog";
import FormatString from "../../FormateString/FormatString";
import BalancePaymentListCardHeader from "../Outstanding/Sales/BalancePaymentListCardHeader";
import UniqueSalesExecutiveDialog from "../Outstanding/Sales/Dialog/UniqueSalesExecutiveDialog";
import UniqueSalesCustomerDialog from "../Outstanding/Sales/Dialog/UniqueSalesCustomerDialog";
import SalesInvoiceEditAction from "../Outstanding/Sales/Dialog/SalesInvoiceEditAction";
import BalancePaymentListFilter from "../Outstanding/Sales/BalancePaymentListFilter";
import TDSDialog from "../Outstanding/Sales/Dialog/TDSDialog";
import DialogforBalancePaymentUpdate from "../Outstanding/Sales/Dialog/DialogforBalancePaymentUpdate";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BalancePaymentList = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [balAmount, setBalAmount] = useState("");
  const [paymentRefNo, setPaymentRefNo] = useState("");
  const [paymentRefImg, setPaymentRefImg] = useState("");
  const [paymentType, setPaymentType] = useState({ label: "", value: "" });
  const [paymentDetails, setPaymentDetails] = useState("");
  const [singleRow, setSingleRow] = useState({});
  const [dropdownData, setDropDownData] = useState([]);
  const [paidAmount, setPaidAmount] = useState([]);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [viewImgDialog, setViewImgDialog] = useState(false);
  const [paymentDate, setPaymentDate] = useState(dayjs(new Date()));

  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [uniqueNonInvoiceCustomerCount, setUniqueNonInvoiceCustomerCount] =
    useState(0);
  const [uniqueNonInvoiceCustomerData, setUniqueNonInvoiceCustomerData] =
    useState(0);
  const [
    uniqueNonInvoiceSalesExecutiveCount,
    setUniqueNonInvoiceSalesExecutiveCount,
  ] = useState(0);
  const [
    uniqueNonInvoiceSalesExecutiveData,
    setUniqueNonInvoiceSalesExecutiveData,
  ] = useState(0);
  const [partyName, setPartyName] = useState("");

  const [dateFilter, setDateFilter] = useState("");
  const [closeDialog, setCloseDialog] = useState(false);
  const [tdsFieldSaleBookingId, setTDSFieldSaleBookingId] = useState("");
  const [discardSaleBookingId, setDiscardSaleBookingId] = useState("");
  const [paidPercentage, setPaidPercentage] = useState("");
  const [tdsPercentage, setTDSPercentage] = useState("");
  const [showField, setShowField] = useState(false);
  const [baseAmount, setBaseAmount] = useState();
  const [campaignAmountData, setCampaignAmountData] = useState();
  const [paidAmountData, setPaidAmountData] = useState();
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [customerList, setCustomerList] = useState([]);
  const [salesExecutiveList, setSalesExecutiveList] = useState([]);
  const [nonGstStatus, setNonGstStatus] = useState("");
  const [discardDialog, setDiscardDialog] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [paymentModeDropDownData, setPaymentModeDropDownData] = useState("");
  const [filteredPaymentModes, setFilteredPaymentModes] = useState("");
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [editActionDialog, setEditActionDialog] = useState(false);
  const [outstandingRowData, setOutstandingRowData] = useState([]);

  const [invcDate, setInvcDate] = useState("");

  const accordionButtons = [
    "Oustanding Invoice",
    "Non Invoice Created",
    "Approved", 
    "All Tax Invoice",
  ];

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken?.id;

  useEffect(() => {
    getData();
    pendingApprovalApi();
  }, [dateFilter]);

  useEffect(() => {
    getDropdownData();
    getPaymentModeDropdown();
  }, []);

  useEffect(() => {
    totalPA();
  }, [paidAmount]);

  useEffect(() => {
    calculatePaidPercentage();
    calculateTDSPercentage();
  }, [balAmount, paidAmount, baseAmount]);

  const calculatePaidPercentage = () => {
    if (paidAmount !== 0) {
      const percentage =
        ((+paidAmount + +paidAmountData) / +campaignAmountData) * 100;
      // const roundedPercentage = percentage * 10;
      setPaidPercentage(percentage.toFixed(1));
    } else {
      setPaidPercentage(0);
    }
  };

  const calculateTDSPercentage = () => {
    const remainingData = balAmount - paidAmount;
    if (remainingData === 0) {
      setTDSPercentage(0);
    } else {
      const percentage = (remainingData / baseAmount) * 100;
      const roundedPercentage = parseFloat(percentage.toFixed(2));
      setTDSPercentage(roundedPercentage);
    }
  };

  const handleDiscardOpenDialog = (e, rowData) => {
    e.preventDefault();
    setDiscardSaleBookingId(rowData.sale_booking_id);
    setDiscardDialog(true);
  };

  const getData = () => {
    axios
      .get(baseUrl + "sales/sales_booking_outstanding_for_finanace", {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // Create a new array with transformed data
        const transformedData = res?.data?.data?.reduce((acc, object) => {
          if (object?.salesInvoiceRequestData?.length > 0) {
            const invoices = object?.salesInvoiceRequestData.map((invoice) => ({
              ...invoice,
              account_id: object.account_id,
              sale_booking_date: object.sale_booking_date,
              campaign_amount: object.campaign_amount,
              base_amount: object.base_amount,
              balance_payment_ondate: object.balance_payment_ondate,
              gst_status: object.gst_status,
              created_by: object.created_by,
              createdAt: object.createdAt,
              updatedAt: object.updatedAt,
              sale_booking_id: object.sale_booking_id,
              url: object.url,
              account_name: object.account_name,
              created_by_name: object.created_by_name,
              paid_amount: object.paid_amount,
            }));
            acc.push(...invoices);
          } else {
            const tempObject = {
              ...object,
              // account_id: object.account_id,
              // sale_booking_date: object.sale_booking_date,
              // campaign_amount: object.campaign_amount,
              // base_amount: object.base_amount,
              // balance_payment_ondate: object.balance_payment_ondate,
              // gst_status: object.gst_status,
              // created_by: object.created_by,
              // createdAt: object.createdAt,
              // updatedAt: object.updatedAt,
              // sale_booking_id: object.sale_booking_id,
              // url: object.url,
              // account_name: object.account_name,
              // created_by_name: object.created_by_name,
              // paid_amount: object.paid_amount,
            };
            acc?.push(tempObject);
          }
          return acc;
        }, []);
        const reversedData = transformedData?.reverse();
        setData(reversedData);
        setFilterData(reversedData);

        setUniqueCustomerCount(111);

        setUniqueCustomerData(transformedData);

        setUniqueSalesExecutiveCount(111);

        setUniqueSalesExecutiveData(111);

        setUniqueNonInvoiceCustomerCount(111);

        setUniqueNonInvoiceCustomerData(111);

        setUniqueNonInvoiceSalesExecutiveCount(111);

        setUniqueNonInvoiceSalesExecutiveData(111);
      });
  };
  function pendingApprovalApi() {
    axios
      .get(
        baseUrl + `sales/payment_update_status_list_data/?status=${"pending"}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const pedingAppData = res?.data?.data;
        setTotalCount(pedingAppData?.length);
      });
  }

  const getDropdownData = async () => {
    const response = await axios.get(baseUrl + `sales/payment_details`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    const responseData = response?.data?.data;
    setDropDownData(responseData);
  };

  const getPaymentModeDropdown = async () => {
    await axios
      .get(baseUrl + `sales/payment_mode`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setPaymentModeDropDownData(res?.data?.data);
      })
      .catch((err) => console.log(err, "Error while getting payment mode"));
  };

  const handleImageClick = (e, row) => {
    e.preventDefault();
    setBalAmount(row.campaign_amount - row.paid_amount);
    setBaseAmount(row.base_amount);
    setPaidAmountData(row.paid_amount);
    setCampaignAmountData(row.campaign_amount);
    setTDSFieldSaleBookingId(row.sale_booking_id);
    setNonGstStatus(row.gst_status);
    setSingleRow(row);
    getData();
    setImageModalOpen(true);
  };

  const convertDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  function calculateAging(date1, date2) {
    const oneHour = 60 * 60 * 1000; // minutes * seconds * milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    const diffHours = Math.round(Math.abs((firstDate - secondDate) / oneHour));

    return diffHours;
  }

  const handleOpenUniqueCustomerClick = () => {
    setUniqueCustomerDialog(true);
  };

  // For Sales Executive
  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const calculateRequestedAmountTotal = () => {
    const invc = filterData?.filter(
      (invc) =>
        invc?.salesInvoiceRequestData?.[0]?.invoice_file !== "" &&
        invc?.salesInvoiceRequestData?.[0]?.invoice_type_id === "tax-invoice"
    );
    let totalAmount = 0;
    invc?.forEach((customer) => {
      totalAmount += parseFloat(
        customer?.campaign_amount - customer?.paid_amount
      );
    });

    return totalAmount;
  };

  const calculateNonRequestedAmountTotal = () => {
    const nonInvc = filterData?.filter(
      (invc) =>
        invc?.salesInvoiceRequestData?.[0]?.invoice_file === "" ||
        invc?.salesInvoiceRequestData?.[0]?.invoice_type_id !== "tax-invoice"
    );
    let totalAmount = 0;
    nonInvc?.forEach((customer) => {
      totalAmount += parseFloat(
        customer.campaign_amount - customer.paid_amount
      );
    });

    return totalAmount;
  };

  // Call the function to get the total sum of requested amount
  const balanceAmountTotal = calculateRequestedAmountTotal();
  const nonInvcbalanceAmountTotal = calculateNonRequestedAmountTotal();
  // All counts :-
  const approvedCount = datas?.filter(
    (item) => item.finance_refund_status === 1
  )?.length;
  const rejectedCount = datas?.filter(
    (item) => item.finance_refund_status === 2
  )?.length;


  const columns = [
    {
      width: 70,
      field: "sno",
      headerName: "S.No",
      valueGetter: (params) => {
        // Apply the filter logic once
        const invcForCreated =
        activeAccordionIndex === 3
        ?  filterData?.filter(
          (invc) => invc.invoice_type_id !== "proforma")
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
        : []
    
        // Return the index for the S.No
        return invcForCreated.indexOf(params?.row) + 1;
      },
      renderCell: (params) => {
        // Reuse the same filter logic
        const invcForCreated =
        activeAccordionIndex === 3
        ?  filterData?.filter(
          (invc) => invc.invoice_type_id !== "proforma")
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
        : []
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
          {convertDateToDDMMYYYY(params.row.invoice_uploaded_date)}
        </div>
      ),
    },
    {
      field: "balance_payment_ondate",
      headerName: "Expected Payment Receive Date",
      width: 190,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(params.row.balance_payment_ondate)}
        </div>
      ),
    },
    {
      field: "sale_booking_date",
      headerName: "Sale Booking Date",
      width: 190,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(params.row.sale_booking_date)}
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
              src={pdf}
              onClick={() => {
                setViewImgSrc(imgUrl);
                setViewImgDialog(true);
              }}
              style={{ width: "40px", height: "40px" }}
              alt="PDF Icon"
            />
          ) : invoiceData?.endsWith(".xls") ||
            invoiceData?.endsWith(".xlsx") ? (
            <img
              src={pdf}
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

  // accordin function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  const totalPA = () => {
    return +campaignAmountData - (+paidAmountData + paidAmount);
  };

  // csv download----
  const handleDownloadInvoices = async () => {
    const zip = new JSZip();
    // Generate CSVs and add them to the zip
    rowSelectionModel?.forEach((rowId) => {
      const rowData = filterData?.find((row) => row._id === rowId); // Adjusted to find the correct row data
      if (rowData) {
        // Prepare CSV content
        let csvContent = ""; // Initialize CSV content
        // Generate headers row
        const headers = Object.keys(rowData);
        csvContent += headers.join(",") + "\n";
        // Generate CSV content for the row
        const values = Object.values(rowData);
        const rowContent = values?.map((value) => `"${value}"`).join(",");
        csvContent += `${rowContent}\n`;

        // Add CSV to the zip
        zip.file(`invoice_${rowId}.csv`, csvContent);
      }
    });

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Save the zip file
    saveAs(zipBlob, "invoices.zip");
  };

  const handleOpenEditAction = (rowData) => {
    setOutstandingRowData(rowData);
    setEditActionDialog(true);
  };

  useEffect(() => {
    if (paymentDetails) {
      const filteredModes = paymentModeDropDownData?.filter(
        (mode) => mode?._id === paymentDetails?.payment_mode_id
      );
      setFilteredPaymentModes(filteredModes);
    } else {
      setFilteredPaymentModes(paymentModeDropDownData);
    }
  }, [paymentDetails, paymentModeDropDownData]);

  return (
    <div>
      {activeAccordionIndex === 2 ? (
        ""
      ) : (
        <>
          {/* <FormContainer
            mainTitle="Sale Booking - Outstanding Payment"
            link="/admin/balance-payment-list"
            buttonAccess={
              contextData &&
              contextData[2] &&
              contextData[2].insert_value === 1 &&
              false
            }
            uniqueCustomerCount={uniqueCustomerCount}
            uniqueNonInvoiceCustomerCount={uniqueNonInvoiceCustomerCount}
            uniqueNonInvoiceSalesExecutiveCount={
              uniqueNonInvoiceSalesExecutiveCount
            }
            accIndex={activeAccordionIndex}
            balanceAmountTotal={balanceAmountTotal}
            nonInvcbalanceAmountTotal={nonInvcbalanceAmountTotal}
            approvedCount={approvedCount}
            rejectedCount={rejectedCount}
            handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
            uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
            handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
            balancePaymentAdditionalTitles={true}
          /> */}

          <Button variant="contained" className="mb-4">
            <Link to="/admin/finance-pendingapproveupdate/">
              Pending Approval ({totalCount})
            </Link>
          </Button>
          {/* Add Icon TDS */}
          {closeDialog && (
            <TDSDialog
              closeDialog={closeDialog}
              setCloseDialog={setCloseDialog}
              singleRow={singleRow}
              balAmount={balAmount}
              setBalAmount={setBalAmount}
              paidAmount={paidAmount}
              tdsPercentage={tdsPercentage}
              paymentRefNo={paymentRefNo}
              paymentDetails={paymentDetails}
              paymentRefImg={paymentRefImg}
              setPaymentRefImg={setPaymentRefImg}
              paymentDate={paymentDate}
              tdsFieldSaleBookingId={tdsFieldSaleBookingId}
              getData={getData}
            />
          )}

          {/* Edit action Dialog */}
          {editActionDialog && (
            <SalesInvoiceEditAction
              editActionDialog={editActionDialog}
              setEditActionDialog={setEditActionDialog}
              outstandingRowData={outstandingRowData}
              getData={getData}
              setViewImgDialog={setViewImgDialog}
              viewImgSrc={viewImgSrc}
              setViewImgSrc={setViewImgSrc}
              viewImgDialog={viewImgDialog}
            />
          )}

          {/* Unique Sales Executive Dialog Box */}
          {uniqueSalesExecutiveDialog && (
            <UniqueSalesExecutiveDialog
              columns={columns}
              filterData={filterData}
              uniqueSalesExecutiveDialog={uniqueSalesExecutiveDialog}
              activeAccordionIndex={activeAccordionIndex}
              uniqueSalesExecutiveData={uniqueSalesExecutiveData}
              uniqueNonInvoiceSalesExecutiveData={
                uniqueNonInvoiceSalesExecutiveData
              }
              setUniqueSalesExecutiveDialog={setUniqueSalesExecutiveDialog}
            />
          )}

          {/* Unique Customer Dialog Box */}
          {uniqueCustomerDialog && (
            <UniqueSalesCustomerDialog
              columns={columns}
              filterData={filterData}
              uniqueCustomerDialog={uniqueCustomerDialog}
              setUniqueCustomerDialog={setUniqueCustomerDialog}
              activeAccordionIndex={activeAccordionIndex}
            />
          )}

          <BalancePaymentListCardHeader filterData={filterData} />
          {/* <BalancePaymentListFilter
            customerList={customerList}
            salesExecutiveList={salesExecutiveList}
          /> */}
        </>
      )}

      <Tab
        tabName={accordionButtons}
        activeTabindex={activeAccordionIndex}
        onTabClick={handleAccordionButtonClick}
      />
      <div className="card">
        <div className="pack w-75">
          {rowSelectionModel?.length > 0 && (
            <Button
              className="btn btn-primary cmnbtn btn_sm"
              variant="contained"
              color="primary"
              size="small"
              onClick={handleDownloadInvoices}
            >
              Download PDF Zip
            </Button>
          )}
        </div>
        <div className="card-body thm_table fx-head">
          {(activeAccordionIndex === 3 ||
            activeAccordionIndex === 0 ||
            activeAccordionIndex === 1) && (
            <DataGrid
              rows={
                activeAccordionIndex === 3
                  ?  filterData?.filter(
                    (invc) => invc.invoice_type_id !== "proforma")
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
                  : []
              }
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
              getRowId={(row) => row._id}
            />
          )}

          {activeAccordionIndex === 2 && <ApprovedList />}
        </div>
      </div>

      {/* Dialog box for balance payment update*/}
      {ImageModalOpen && (
        <DialogforBalancePaymentUpdate
          setPaymentDetails={setPaymentDetails}
          paidPercentage={paidPercentage}
          paymentDetails={paymentDetails}
          dropdownData={dropdownData}
          paymentDate={paymentDate}
          setPaymentDate={setPaymentDate}
          balAmount={balAmount}
          setBalAmount={setBalAmount}
          paidAmountData={paidAmountData}
          paidAmount={paidAmount}
          setPaidAmount={setPaidAmount}
          paymentRefNo={paymentRefNo}
          setPaymentRefNo={setPaymentRefNo}
          ImageModalOpen={ImageModalOpen}
          setImageModalOpen={setImageModalOpen}
          setPaidPercentage={setPaidPercentage}
          singleRow={singleRow}
          getData={getData}
          setCloseDialog={setCloseDialog}
          paymentRefImg={paymentRefImg}
          setPaymentRefImg={setPaymentRefImg}
        />
      )}

      {viewImgDialog && (
        <ImageView
          viewImgSrc={viewImgSrc}
          setViewImgDialog={setViewImgDialog}
        />
      )}
    </div>
  );
};

export default BalancePaymentList;
