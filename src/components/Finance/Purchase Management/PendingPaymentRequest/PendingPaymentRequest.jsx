import { useEffect, useState } from "react";
import FormContainer from "../../../AdminPanel/FormContainer";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import pdf from "../../pdf-file.png";
import logo from "../../../../../public/logo.png";
import { Button } from "@mui/material";
import DiscardConfirmation from "./Components/DiscardConfirmation";
import jwtDecode from "jwt-decode";
import ImageView from "../../ImageView";
import { useGlobalContext } from "../../../../Context/Context";
import { baseUrl } from "../../../../utils/config";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import Badge from "@mui/material/Badge";
import ShowDataModal from "./Components/ShowDataModal";
import WhatsappAPI from "../../../WhatsappAPI/WhatsappAPI";
import moment from "moment";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import PayVendorDialog from "././Components/PayVendorDialog";
import { Link } from "react-router-dom";
import CommonDialogBox from "./Components/CommonDialogBox";
import BankDetailPendingPaymentDialog from "./Components/BankDetailPendingPaymentDialog";
import PayThroughVendorDialog from "./Components/PayThroughVendorDialog";
import BulkPayThroughVendorDialog from "./Components/BulkPayThroughVendorDialog";
import OverviewContainedDialog from "./Components/OverviewContainedDialog";
import PendingPaymentReqFilters from "./Components/PendingPaymentReqFilters";
import {
  pendingPaymentRequestColumns,
  pendingPaymentUniqueVendorColumns,
} from "../../CommonColumn/Columns";

export default function PendingPaymentRequest() {
  const whatsappApi = WhatsappAPI();

  const { toastAlert, toastError } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [payDialog, setPayDialog] = useState(false);
  const [rowData, setRowData] = useState({});
  const [showDisCardModal, setShowDiscardModal] = useState(false);
  const [paymentAmout, setPaymentAmount] = useState("");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [userName, setUserName] = useState("");
  const [uniqueVendorCount, setUniqueVendorCount] = useState(0);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [uniqueVenderDialog, setUniqueVenderDialog] = useState(false);
  const [uniqueVendorData, setUniqueVendorData] = useState([]);
  const [sameVendorDialog, setSameVendorDialog] = useState(false);
  const [sameVendorData, setSameVendorData] = useState([]);
  const [bankDetail, setBankDetail] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [reminderData, setReminderData] = useState([]);
  const [remainderDialog, setRemainderDialog] = useState(false);
  const [aknowledgementDialog, setAknowledgementDialog] = useState(false);
  const [nodeData, setNodeData] = useState([]);
  const [phpData, setPhpData] = useState([]);
  const [phpRemainderData, setPhpRemainderData] = useState([]);
  const [historyType, setHistoryType] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [gstHold, setGstHold] = useState(false);
  const [GSTHoldAmount, setGSTHoldAmount] = useState(0);
  const [baseAmount, setBaseAmount] = useState(0);
  const [bankDetailRowData, setBankDetailRowData] = useState([]);

  const [dateFilter, setDateFilter] = useState("");
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [nonInvoiceCount, setNonInvoiceCount] = useState(0);
  const [nonGstCount, setNonGstCount] = useState(0);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [vendorNameList, setVendorNameList] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [adjustAmount, setAdjustAmount] = useState("");
  // const [preview, setPreview] = useState("");
  const [overviewDialog, setOverviewDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [netAmount, setNetAmount] = useState("");
  const [tdsDeductedCount, setTdsDeductedCount] = useState(0);
  const accordionButtons = ["All", "Partial", "Instant"];
  const [payThroughVendor, setPayThroughVendor] = useState(false);
  const [bulkPayThroughVendor, setBulkPayThroughVendor] = useState("");
  const [isZohoStatusFileUploaded, setIsZohoStatusFileUploaded] = useState("");

  var handleAcknowledgeClick = () => {
    setAknowledgementDialog(true);
  };

  const getValidationCSSForRemainder = (params) => {
    const reminder = phpRemainderData?.filter(
      (item) => item.request_id == params.row.request_id
    );
    return reminder?.length > 2 ? "bg-danger" : "";
  };

  const remainderDialogColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = reminderData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "request_date",
      headerName: "Requested Date",
      width: 150,
      renderCell: (params) => {
        return convertDateToDDMMYYYY(params.row.request_date);
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

  const callApi = async () => {
    //Reminder API
    let remindData = "";
    await axios
      .get(
        "https://purchase.creativefuel.io//webservices/RestController.php?view=getpaymentrequestremind"
      )
      .then((res) => {
        setPhpRemainderData(res.data.body);
        remindData = res.data.body;
      })
      .catch((error) => {
        console.log("Error while getting reminder data");
      });

    axios
      .get(baseUrl + "phpvendorpaymentrequest")
      .then((res) => {
        console.log(res, "getting node vendorpaymentrequest data");
        const x = res.data.modifiedData;
        setNodeData(x);
        axios
          .get(
            "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
          )
          .then((res) => {
            console.log(res, "getting paymentrequest user data from php");
            let y = res.data.body.filter((item) => {
              return !x.some((item2) => item.request_id === item2.request_id);
            });
            setPhpData(y); // Setting the filtered data to state

            let c = res.data.body.filter((item) => {
              return remindData.some(
                (item2) => item.request_id === item2.request_id
              );
            });

            y.push(...c);

            let mergedArray = [...y, ...c];

            // Creating a set of unique request_ids from the merged data
            let t = new Set(mergedArray.map((item) => item.request_id));
            mergedArray = Array.from(t).map((request_id) => {
              return mergedArray.find((item) => item.request_id === request_id);
            });

            mergedArray = mergedArray.filter(
              (item) => item.status == 0 || item.status == 3 || item.status == 2
            );

            mergedArray = mergedArray.sort((a, b) => {
              const aReminder = remindData.some(
                (remind) => remind.request_id === a.request_id
              );
              const bReminder = remindData.some(
                (remind) => remind.request_id === b.request_id
              );

              if (aReminder && !bReminder) return -1;
              if (!aReminder && bReminder) return 1;

              // Add aging sorting logic if required
              return new Date(a.request_date) - new Date(b.request_date);
            });

            mergedArray = mergedArray.sort((a, b) => {
              const aReminder = remindData.some(
                (remind) => remind.request_id === a.request_id
              );
              const bReminder = remindData.some(
                (remind) => remind.request_id === b.request_id
              );

              if (aReminder && !bReminder) return -1;
              if (!aReminder && bReminder) return 1;

              // Add aging sorting logic if required
              return b.aging - a.aging;
            });

            setData(mergedArray);
            setFilterData(mergedArray);
            setPendingRequestCount(mergedArray.length);
            const uniqueVendors = new Set(
              mergedArray.map((item) => item.vendor_name)
            );
            setUniqueVendorCount(uniqueVendors.size);
            const uvData = [];
            uniqueVendors.forEach((vendorName) => {
              const vendorRows = mergedArray.filter(
                (item) => item.vendor_name === vendorName
              );
              uvData.push(vendorRows[0]);
            });
            setUniqueVendorData(uvData);
            const nonGstCount = mergedArray.filter(
              (gst) => gst.gstHold === "0"
            );
            setNonGstCount(nonGstCount.length);

            const withInvoiceImage = mergedArray.filter(
              (item) => item.invc_img && item.invc_img.length > 0
            );
            const withoutInvoiceImage = mergedArray.filter(
              (item) => !item.invc_img || item.invc_img.length === 0
            );
            setInvoiceCount(withInvoiceImage.length);
            setNonInvoiceCount(withoutInvoiceImage.length);

            // calculate Partial Data :-
            const dateFilterData = filterDataBasedOnSelection(mergedArray);
            setFilterData(dateFilterData);

            const tdsCount = mergedArray?.filter(
              (data) =>
                data?.TDSDeduction === "1" || data?.TDSDeduction === null
            );
            setTdsDeductedCount(tdsCount);
          })
          .catch((error) => {
            console.log("Error while getting Node Data");
          });
      })
      .catch((error) => {
        console.log("Error while getting php pending payment request data");
      });

    axios
      .get(`${baseUrl}` + `get_single_user/${userID}`)
      .then((res) => {
        setUserName(res.data.user_name);
      })
      .catch((error) => {
        console.log("Error while getting single user data");
      });
  };

  useEffect(() => {
    callApi();
  }, [dateFilter]);

  const handleRemainderModal = (reaminderData) => {
    setReminderData(reaminderData);
    setRemainderDialog(true);
  };

  const convertDateToDDMMYYYY = (date) => {
    const date1 = new Date(date);
    const day = String(date1.getDate()).padStart(2, "0");
    const month = String(date1.getMonth() + 1).padStart(2, "0");
    const year = date1.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleGstHold = (e) => {
    setGstHold(e.target.checked);
    setGSTHoldAmount(rowData.gst_amount);
  };

  GridToolbar.defaultProps = {
    filterRowsButtonText: "Filter",
    filterGridToolbarButton: "Filter",
  };

  const totalPendingAmount = filterData?.reduce(
    (total, item) => total + parseFloat(item?.request_amount),
    0
  );

  const totalBalanceAmount = filterData?.reduce(
    (total, item) => total + parseFloat(item?.balance_amount),
    0
  );
  const handleDiscardClick = (e, row) => {
    e.preventDefault();
    setRowData(row);
    setShowDiscardModal(true);
  };

  const handlePayClick = (e, row) => {
    e?.preventDefault();

    let x = phpRemainderData.filter(
      (item) => item?.request_id == row?.request_id
    );
    if (x.length > 0) {
      toastError(
        `You can't pay this request as it has been reminded ${x?.length} times`
      );
      return;
    }
    const enrichedRow = {
      ...row,
      totalFY: calculateTotalFY(row),
    };
    setLoading(true);
    setRowData(enrichedRow);
    setPaymentAmount(row.balance_amount);
    setNetAmount(row.balance_amount);
    setBaseAmount(row.base_amount != 0 ? row.base_amount : row.request_amount);

    setPayDialog(true);
  };

  useEffect(() => {
    if (loading == false) return;
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [loading]);

  const handleOpenUniqueVendorClick = () => {
    setUniqueVenderDialog(true);
  };

  const handleCloseUniqueVendor = () => {
    setUniqueVenderDialog(false);
  };
  // overview functions :----
  const handleOpenOverview = () => {
    setOverviewDialog(true);
  };
  // --------------------------------------------
  const handleOpenSameVender = (vendorName) => {
    setSameVendorDialog(true);

    const sameNameVendors = data.filter(
      (item) => item.vendor_name === vendorName
    );
    setFilterData(sameNameVendors);
    handleCloseUniqueVendor();
  };

  // Bank Details:-
  const handleOpenBankDetail = (row) => {
    let x = [];
    x.push(row);
    setBankDetailRowData(x);
    setBankDetail(true);
  };
  const handleCloseBankDetail = () => {
    setBankDetail(false);
  };

  // Payment history detail:-

  const handleOpenPaymentHistory = (row, type) => {
    setHistoryType(type);
    setRowData(row);
    setPaymentHistory(true);
    const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
    const currentYear = new Date().getFullYear();

    // const startDate = new Date(`04/01/${new Date().getFullYear() -MonthisGraterThenMarch? 0:1}`);
    // const endDate = new Date(`03/31/${new Date().getFullYear()+MonthisGraterThenMarch? 1:0}`);
    const startDate = new Date(
      `04/01/${isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1}`
    );
    const endDate = new Date(
      `03/31/${isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear}`
    );

    const dataFY = nodeData.filter((e) => {
      const paymentDate = new Date(e.request_date);
      return (
        paymentDate >= startDate &&
        paymentDate <= endDate &&
        e.vendor_name === row.vendor_name &&
        e.status != 0 &&
        e.status != 2
      );
    });

    const dataTP = nodeData.filter((e) => {
      return (
        e.vendor_name === row.vendor_name && e.status != 0 && e.status != 2
      );
    });
    setHistoryData(type == "FY" ? dataFY : dataTP);
  };
  const handleClosePaymentHistory = () => {
    setPaymentHistory(false);
  };

  // ==============================================================
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay(paymentAmout) {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    var options = {
      key: "rzp_test_SIbrnELO2NP7rA", // Enter the Key ID generated from the Dashboard
      amount: paymentAmout * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Your Business Name",
      description: "Payment to " + "Harshit",
      image: { logo },
      handler: function (response) {
        alert(
          "Payment Successful! Payment ID: " + response.razorpay_payment_id
        );
        // Here you can handle the payment success event, e.g., updating the database, sending notifications, etc.
      },
      // default_payment_method:"cash",
      callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9000090000",
        method: "netbanking",
      },
      notes: {
        vendor_name: "Harshit",
        vendor_account_number: "12345678901",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  // accordin function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  const paymentDetailColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = historyData.indexOf(params.row);
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
        return convertDateToDDMMYYYY(params.row.request_date);
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
        const matchingItems = nodeData.filter(
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
  const getStatusText = (status) => {
    switch (status) {
      case "0":
        return "Pending";
      case "1":
        return "Paid";
      case "2":
        return "Discard";
      case "3":
        return "Partial";
      default:
        return "";
    }
  };

  const calculateTotalFY = (data) => {
    const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
    const currentYear = new Date().getFullYear();
    const startDate = new Date(
      `04/01/${isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1}`
    );
    const endDate = new Date(
      `03/31/${isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear}`
    );

    const dataFY = nodeData.filter((e) => {
      const paymentDate = new Date(e?.request_date);
      return (
        paymentDate >= startDate &&
        paymentDate <= endDate &&
        e?.vendor_name === data?.vendor_name &&
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
  };

  const filterDataBasedOnSelection = (apiData) => {
    const now = moment();
    switch (dateFilter) {
      case "last7Days":
        return apiData.filter((item) =>
          moment(item.request_date).isBetween(
            now.clone().subtract(7, "days"),
            now,
            "day",
            "[]"
          )
        );
      case "last30Days":
        return apiData.filter((item) =>
          moment(item.request_date).isBetween(
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
          moment(item.request_date).isBetween(
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
          moment(item.request_date).isBetween(
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
          moment(item.request_date).isBetween(
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
          moment(item.request_date).isBetween(
            quarterStart,
            quarterEnd,
            "day",
            "[]"
          )
        );
      case "today":
        return apiData.filter((item) =>
          moment(item.request_date).isSame(now, "day")
        );
      default:
        return apiData;
    }
  };

  const partialData = filterData?.filter((d) => d.status === "3");
  const instantData = filterData?.filter((d) => d.status === "0");

  const pendingPartialcount = partialData?.length;
  const pendingInstantcount = instantData?.length;
  // For partial tab :-
  const uniqueVendorPartialCount = new Set(
    partialData?.map((item) => item.vendor_name)
  );
  const pendingAmountPartial = partialData?.reduce(
    (total, item) => total + parseFloat(item.request_amount),
    0
  );
  const balanceAmountPartial = partialData?.reduce(
    (total, item) => total + parseFloat(item.balance_amount),
    0
  );
  const nonGstPartialCount = partialData?.filter((gst) => gst.gstHold === "0");

  const withInvcPartialImage = partialData?.filter(
    (item) => item.invc_img && item.invc_img.length > 0
  );

  const withoutInvcPartialImage = partialData?.filter(
    (item) => !item.invc_img || item.invc_img.length === 0
  );
  const partialTDSDeduction = partialData?.filter(
    (item) => item?.TDSDeduction === "1" || item?.TDSDeduction === null
  );
  // ===================================================================
  // For Instant tab :-
  const uniqueVendorsInstantCount = new Set(
    instantData?.map((item) => item.vendor_name)
  );
  const pendingAmountInstant = instantData?.reduce(
    (total, item) => total + parseFloat(item.request_amount),
    0
  );
  const balanceAmountInstant = instantData?.reduce(
    (total, item) => total + parseFloat(item.request_amount),
    0
  );
  const nonGstInstantCount = instantData?.filter((gst) => gst.gstHold === "0");

  const withInvcInstantImage = instantData?.filter(
    (item) => item.invc_img && item.invc_img.length > 0
  );
  const withoutInvcInstantImage = instantData?.filter(
    (item) => !item.invc_img || item.invc_img.length === 0
  );
  const instantTDSDeduction = instantData?.filter(
    (item) => item?.TDSDeduction === "1" || item?.TDSDeduction === null
  );
  // ===================================================================

  useEffect(() => {
    if (activeAccordionIndex === 0) {
      const uniqueVendorNames = [...new Set(data?.map((d) => d?.vendor_name))];

      setVendorNameList(uniqueVendorNames);
    } else if (activeAccordionIndex === 1) {
      const filteredData = data.filter((d) => d.status === "3");
      const uniqueVendorNames = [
        ...new Set(filteredData.map((d) => d?.vendor_name)),
      ];

      setVendorNameList(uniqueVendorNames);
    } else if (activeAccordionIndex === 2) {
      const filteredData = data?.filter((d) => d?.status === "0");
      const uniqueVendorNames = [
        ...new Set(filteredData.map((d) => d?.vendor_name)),
      ];
      setVendorNameList(uniqueVendorNames);
    }
  }, [activeAccordionIndex]);

  useEffect(() => {
    if (activeAccordionIndex === 0) {
      const uniqueVendorNames = [...new Set(data?.map((d) => d?.vendor_name))];

      setVendorNameList(uniqueVendorNames);
    }
  }, [data]);

  const handleRowSelectionModelChange = async (rowIds) => {
    setRowSelectionModel(rowIds);

    if (rowIds.length > 0) {
      console.log("Selected IDs:", rowIds);
      setIsZohoStatusFileUploaded(1);
    } else {
      console.log("No rows selected");
      setIsZohoStatusFileUploaded(0);
      // Handle logic for when no rows are selected
    }
  };

  // csv download----
  const handleDownloadInvoices = async () => {
    const zip = new JSZip();

    // Generate CSVs and add them to the zip
    rowSelectionModel.forEach((rowId) => {
      const rowData = filterData.find((row) => row.request_id === rowId); // Adjusted to find the correct row data
      if (rowData) {
        // Prepare CSV content
        let csvContent = ""; // Initialize CSV content

        // Generate headers row
        const headers = Object.keys(rowData);
        csvContent += headers.join(",") + "\n";

        // Generate CSV content for the row
        const values = Object.values(rowData);
        const rowContent = values.map((value) => `"${value}"`).join(",");
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
  // Zoho Status
  const handleZohoStatusUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    rowSelectionModel?.forEach((id) => {
      formData?.append("request_id", id);
    });
    formData.append("zoho_status", isZohoStatusFileUploaded);

    await axios
      .post(
        "https://purchase.creativefuel.io/webservices/RestController.php?view=updatezohostatus",
        formData
      )
      .then((res) => {
        console.log(res, "response zoho status");
        if (res) {
          toastAlert("Invoice File Uploaded On Zoho Successfully");
          callApi();
        }
      })
      .catch((error) => {
        console.log("Error while getting reminder data");
      });
  };

  const handleOpenPayThroughVendor = () => {
    setPayThroughVendor(true);
  };
  const handleOpenBulkPayThroughVendor = () => {
    setBulkPayThroughVendor(true);
  };

  useEffect(() => {
    const initialAdjustmentAmt = netAmount - paymentAmout;
    const formattedAdjustmentAmt = initialAdjustmentAmt?.toFixed(1);
    setAdjustAmount(formattedAdjustmentAmt);
  }, [rowData, paymentAmout]);

  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    setFilterData(data);
  };

  console.log(filterData, uniqueVendorData, "data--->>>------>>>--------->>>");

  return (
    <div>
      <FormContainer
        mainTitle="Pending Payment Request"
        link="/admin/finance-pruchasemanagement-pendingpaymentrequest"
        uniqueVendorCount={uniqueVendorCount}
        totalPendingAmount={totalPendingAmount}
        totalBalanceAmount={totalBalanceAmount}
        pendingRequestCount={pendingRequestCount}
        pendingPartialcount={pendingPartialcount}
        pendingInstantcount={pendingInstantcount}
        uniqueVendorPartialCount={uniqueVendorPartialCount}
        uniqueVendorsInstantCount={uniqueVendorsInstantCount}
        pendingAmountPartial={pendingAmountPartial}
        pendingAmountInstant={pendingAmountInstant}
        balanceAmountPartial={balanceAmountPartial}
        balanceAmountInstant={balanceAmountInstant}
        nonGstPartialCount={nonGstPartialCount}
        nonGstInstantCount={nonGstInstantCount}
        withInvcPartialImage={withInvcPartialImage}
        withInvcInstantImage={withInvcInstantImage}
        withoutInvcPartialImage={withoutInvcPartialImage}
        withoutInvcInstantImage={withoutInvcInstantImage}
        nonGstCount={nonGstCount}
        invoiceCount={invoiceCount}
        nonInvoiceCount={nonInvoiceCount}
        accIndex={activeAccordionIndex}
        handleOpenUniqueVendorClick={handleOpenUniqueVendorClick}
        includeAdditionalTitles={true}
        pendingpaymentRemainder={phpRemainderData.length}
        tdsDeductedCount={tdsDeductedCount}
        partialTDSDeduction={partialTDSDeduction}
        instantTDSDeduction={instantTDSDeduction}
      />
      {/* Bank Details 14 */}

      <BankDetailPendingPaymentDialog
        bankDetail={bankDetail}
        handleCloseBankDetail={handleCloseBankDetail}
        bankDetailRowData={bankDetailRowData}
      />
      {/* Payment History */}
      <CommonDialogBox
        dialog={paymentHistory}
        handleCloseDialog={handleClosePaymentHistory}
        activeAccordionIndex={0}
        data={historyData}
        columnsData={paymentDetailColumns}
      />
      {/* Unique Vendor Dialog Box */}
      <CommonDialogBox
        dialog={uniqueVenderDialog}
        handleCloseDialog={handleCloseUniqueVendor}
        activeAccordionIndex={activeAccordionIndex}
        data={uniqueVendorData}
        columnsData={pendingPaymentUniqueVendorColumns({
          activeAccordionIndex,
          uniqueVendorData,
          handleOpenSameVender,
          filterData,
        })}
      />
      {/* Overview Dialog Box */}
      <OverviewContainedDialog
        setOverviewDialog={setOverviewDialog}
        overviewDialog={overviewDialog}
        filterData={filterData}
        columns={pendingPaymentRequestColumns({
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
        })}
      />

      <PendingPaymentReqFilters
        setDateFilter={setDateFilter}
        dateFilter={dateFilter}
        data={data}
        setVendorNameList={setVendorNameList}
        vendorNameList={vendorNameList}
        setOverviewDialog={setOverviewDialog}
        setFilterData={setFilterData}
        handleOpenOverview={handleOpenOverview}
      />

      <>
        <div className="tab">
          {accordionButtons.map((button, index) => (
            <div
              className={`named-tab ${
                activeAccordionIndex === index ? "active-tab" : ""
              }`}
              onClick={() => handleAccordionButtonClick(index)}
            >
              {button}
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header sb">
            <div className="caard-title">Pending Payment Overview</div>
            <div className="pack w-75">
              {rowSelectionModel.length > 0 && (
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
              <Button
                className="btn cmnbtn btn_sm btn-secondary ms-2"
                onClick={(e) => handleClearSameRecordFilter(e)}
              >
                Clear
              </Button>
              {/* <Button
                className="btn btn-success cmnbtn btn_sm ms-2"
                variant="contained"
                color="primary"
                size="small"
                onClick={handleOpenPayThroughVendor}
              >
                Pay Through Vendor
              </Button>
              <Button
                className="btn btn-success cmnbtn btn_sm ms-2"
                variant="contained"
                color="primary"
                size="small"
                onClick={handleOpenBulkPayThroughVendor}
              >
                Bulk Pay Through Vendor
              </Button>? */}
            </div>
          </div>
          <div className="card-body thm_table fx-head">
            {(activeAccordionIndex === 0 ||
              activeAccordionIndex === 1 ||
              activeAccordionIndex === 2) && (
              <DataGrid
                rows={
                  activeAccordionIndex === 0
                    ? filterData
                    : activeAccordionIndex === 1
                    ? filterData?.filter((d) => d.status === "3")
                    : activeAccordionIndex === 2
                    ? filterData?.filter((d) => d.status === "0")
                    : []
                }
                columns={pendingPaymentRequestColumns({
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
                })}
                pageSize={5}
                rowsPerPageOptions={[5]}
                h
                getRowClassName={getValidationCSSForRemainder}
                slots={{ toolbar: GridToolbar }}
                checkboxSelection
                disableSelectionOnClick
                disableColumnMenu
                getRowId={(row) => row?.request_id}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                onRowSelectionModelChange={(rowIds) => {
                  handleRowSelectionModelChange(rowIds);
                }}
                rowSelectionModel={rowSelectionModel}
              />
            )}
            {openImageDialog && (
              <ImageView
                viewImgSrc={viewImgSrc}
                fullWidth={true}
                maxWidth={"md"}
                setViewImgDialog={setOpenImageDialog}
                openImageDialog={openImageDialog}
              />
            )}
          </div>
        </div>

        {payThroughVendor && (
          <PayThroughVendorDialog
            setPayThroughVendor={setPayThroughVendor}
            payThroughVendor={payThroughVendor}
            rowSelectionModel={rowSelectionModel}
          />
        )}
        {bulkPayThroughVendor && (
          <BulkPayThroughVendorDialog
            setBulkPayThroughVendor={setBulkPayThroughVendor}
            bulkPayThroughVendor={bulkPayThroughVendor}
            rowSelectionModel={rowSelectionModel}
            filterData={filterData}
          />
        )}

        {/*Dialog Box */}
        {/* {loading ? (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "absolute",
              top: "28%",
              width: "50%",
              zIndex: "222",
            }}
          >
            <Loader />
          </div>
        ) : ( */}
        {payDialog && (
          <PayVendorDialog
            callApi={callApi}
            userName={userName}
            loading={loading}
            setLoading={setLoading}
            phpRemainderData={phpRemainderData}
            rowData={rowData}
            setRowData={setRowData}
            paymentAmout={paymentAmout}
            setPaymentAmount={setPaymentAmount}
            netAmount={netAmount}
            setNetAmount={setNetAmount}
            baseAmount={baseAmount}
            setBaseAmount={setBaseAmount}
            payDialog={payDialog}
            setPayDialog={setPayDialog}
          />
        )}

        {showDisCardModal && (
          <DiscardConfirmation
            userName={userName}
            rowData={rowData}
            setShowDiscardModal={setShowDiscardModal}
            userID={userID}
            callApi={callApi}
          />
        )}

        {remainderDialog && (
          <ShowDataModal
            handleClose={setRemainderDialog}
            rows={reminderData}
            columns={remainderDialogColumns}
            aknowledgementDialog={aknowledgementDialog}
            setAknowledgementDialog={setAknowledgementDialog}
            userName={userName}
            callApi={callApi}
            setRemainderDialo={setRemainderDialog}
          />
        )}
      </>
    </div>
  );
}
