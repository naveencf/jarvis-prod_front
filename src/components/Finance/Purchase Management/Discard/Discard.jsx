import { useEffect, useState } from "react";
import FormContainer from "../../../AdminPanel/FormContainer";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Autocomplete,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import ImageView from "../../ImageView";
import { baseUrl } from "../../../../utils/config";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentHistoryDialog from "../../../PaymentHistory/PaymentHistoryDialog";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import ShowDataModal from "../../../Finance/Purchase Management/PendingPaymentRequest/Components/ShowDataModal";
import { useGlobalContext } from "../../../../Context/Context";
import jwtDecode from "jwt-decode";
import moment from "moment";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import View from "../../../AdminPanel/Sales/Account/View/View";

export default function Discard() {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const { toastAlert } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [aknowledgementDialog, setAknowledgementDialog] = useState(false);
  const [remainderDialog, setRemainderDialog] = useState(false);
  const [reminderData, setReminderData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [requestAmountFilter, setRequestAmountFilter] = useState("");
  const [requestedAmountField, setRequestedAmountField] = useState("");
  const [uniqueVendorCount, setUniqueVendorCount] = useState(0);
  const [uniqueVenderDialog, setUniqueVenderDialog] = useState(false);
  const [uniqueVendorData, setUniqueVendorData] = useState([]);
  const [sameVendorDialog, setSameVendorDialog] = useState(false);
  const [sameVendorData, setSameVendorData] = useState([]);
  const [discardCount, setDiscardCount] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyType, setHistoryType] = useState("");
  const [rowData, setRowData] = useState([]);
  const [nodeData, setNodeData] = useState([]);
  const [phpData, setPhpData] = useState([]);
  const [bankDetail, setBankDetail] = useState(false);
  const [bankDetailRowData, setBankDetailRowData] = useState([]);
  const [phpRemainderData, setPhpRemainderData] = useState([]);
  const [userName, setUserName] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [columnsData, setColumnsData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const callApi = () => {
    setIsLoading(true);

    axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      const x = res.data.modifiedData;
      setNodeData(x);

      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          setPhpData(res.data.body);
          let y = x.filter((item) => {
            if (item.status == 2) {
              return item;
            }
          });
          let u = res.data.body.filter((item) => {
            return y.some((item2) => item.request_id == item2.request_id);
          });

          const initialColumns = u.length
            ? ["s_no", "name", "vendor_name", "page_name", "total_paid"]
            : ["s_no", "vendor_name", "page_name", "total_paid"];

          setIsLoading(false);
          setData(u);
          setFilterData(u);
          setColumnsData(initialColumns);
          setDiscardCount(u.length);
          const uniqueVendors = new Set(u.map((item) => item.vendor_name));
          setUniqueVendorCount(uniqueVendors.size);
          const uvData = [];
          uniqueVendors.forEach((vendorName) => {
            const vendorRows = u.filter(
              (item) => item.vendor_name === vendorName
            );
            uvData.push(vendorRows[0]);
          });
          setUniqueVendorData(uvData);

          const dateFilterData = filterDataBasedOnSelection(u);
          setFilterData(dateFilterData);
        });
    });

    axios
      .get(
        "https://purchase.creativefuel.io//webservices/RestController.php?view=getpaymentrequestremind"
      )
      .then((res) => {
        setPhpRemainderData(res.data.body);
      });

    axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
      setUserName(res.data.user_name);
    });
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

  var handleAcknowledgeClick = () => {
    setAknowledgementDialog(true);
  };

  const handleRemainderModal = (reaminderData) => {
    setReminderData(reaminderData);
    setRemainderDialog(true);
  };
  useEffect(() => {
    callApi();
  }, [dateFilter]);

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
        return <p> {params.row.aging} Days</p>;
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
  const handleOpenBankDetail = (row) => {
    let x = [];
    x.push(row);

    setBankDetailRowData(x);
    setBankDetail(true);
  };
  const handleCloseBankDetail = () => {
    setBankDetail(false);
  };

  const handleOpenPaymentHistory = (row, type) => {
    setHistoryType(type);
    setRowData(row);
    setPaymentHistory(true);
    const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
    const currentYear = new Date().getFullYear();
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

  const convertDateToDDMMYYYY = (date) => {
    const date1 = new Date(date);
    const day = String(date1.getDate()).padStart(2, "0");
    const month = String(date1.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date1.getFullYear();

    return `${day}/${month}/${year}`;
  };

  GridToolbar.defaultProps = {
    filterRowsButtonText: "Filter",
    filterGridToolbarButton: "Filter",
  };

  function calculateDays(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    return diffDays;
  }

  const totalRequestAmount = filterData.reduce(
    (total, item) => total + parseFloat(item.request_amount),
    0
  );

  // ==============================================================
  //iterate for totalAmount of same name venders :-
  // const vendorAmounts = [];
  // uniqueVendorData.forEach((item) => {
  //   const vendorName = item.vendor_name;
  //   const requestAmount = item.request_amount;

  //   if (vendorAmounts[vendorName]) {
  //     vendorAmounts[vendorName] += requestAmount; // Add request amount to existing total
  //   } else {
  //     vendorAmounts[vendorName] = requestAmount; // Initialize with request amount
  //   }
  // });

  // // calculate the total amount for vendors with the same name
  // let totalSameVendorAmount = Object.values(vendorAmounts).reduce(
  //   (total, amount) => total + amount,
  //   0
  // );
  // ================================================================
  const handleDateFilter = () => {
    const filterData = data.filter((item) => {
      const date = new Date(item.request_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);

      // Vender Name Filter
      const vendorNameFilterPassed =
        !vendorName ||
        item.vendor_name?.toLowerCase().includes(vendorName.toLowerCase());

      // Priority Filter
      const priorityFilterPassed =
        !priorityFilter || item.priority === priorityFilter;

      // Search Query Filter
      const searchFilterPassed =
        !search ||
        Object.values(item).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(search.toLowerCase())
        );

      // Requested Amount Filter
      const requestedAmountFilterPassed = () => {
        const numericRequestedAmount = parseFloat(requestedAmountField);
        switch (requestAmountFilter) {
          case "greaterThan":
            return +item.request_amount > numericRequestedAmount;
          case "lessThan":
            return +item.request_amount < numericRequestedAmount;
          case "equalTo":
            return +item.request_amount === numericRequestedAmount;
          default:
            return true;
        }
      };

      const allFiltersPassed =
        dateFilterPassed &&
        vendorNameFilterPassed &&
        priorityFilterPassed &&
        searchFilterPassed &&
        requestedAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);
    setDiscardCount(filterData.length);
    const uniqueVendors = new Set(filterData.map((item) => item.vendor_name));
    setUniqueVendorCount(uniqueVendors.size);
    const uvData = [];
    uniqueVendors.forEach((vendorName) => {
      const vendorRows = filterData.filter(
        (item) => item.vendor_name === vendorName
      );
      uvData.push(vendorRows[0]);
    });
    setUniqueVendorData(uvData);
  };

  const handleClearDateFilter = () => {
    setFilterData(data);
    setVendorName("");
    setFromDate("");
    setToDate("");
    setPriorityFilter("");
    setRequestAmountFilter("");
    setRequestedAmountField("");
    setDiscardCount(data.length);
    const uniqueVendors = new Set(data.map((item) => item.vendor_name));
    setUniqueVendorCount(uniqueVendors.size);
    const uvData = [];
    uniqueVendors.forEach((vendorName) => {
      const vendorRows = data.filter((item) => item.vendor_name === vendorName);
      uvData.push(vendorRows[0]);
    });
    setUniqueVendorData(uvData);
  };

  const handleOpenUniqueVendorClick = () => {
    setUniqueVenderDialog(true);
  };

  const handleCloseUniqueVendor = () => {
    setUniqueVenderDialog(false);
  };

  const handleOpenSameVender = (vendorName) => {
    setSameVendorDialog(true);

    const sameNameVendors = data.filter(
      (item) => item.vendor_name === vendorName
    );
    // Calculate the total amount for vendors with the same name
    // const totalAmount = sameNameVendors.reduce(
    //   (total, item) => total + item.request_amount,
    //   0
    // );

    // Set the selected vendor data including the vendor name, data, and total amount
    setSameVendorData(sameNameVendors);
  };

  const handleCloseSameVender = () => {
    setSameVendorDialog(false);
  };
  // same Vender columns:-
  const sameVenderColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = sameVendorData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
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
      field: "request_amount",
      headerName: "Requested Amount",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.request_amount}</p>;
      },
    },
    // {
    //   headerName: "Action",
    //   width: 150,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         <button
    //           className="btn btn-sm btn-success"
    //           onClick={() => handlePayClick(params.row)}
    //         >
    //           Pay
    //         </button>
    //         <button
    //           className="btn btn-sm btn-danger mx-2"
    //           onClick={() => handleDiscardClick(params.row)}
    //         >
    //           discard
    //         </button>
    //       </div>
    //     );
    //   },
    // },
  ];
  // unique vender column :-
  const uniqueVendorColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = uniqueVendorData.indexOf(params.row);
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
  const columns = [
    {
      key: "S.NO",
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
        return nodeData.filter((e) => e.vendor_name === row?.vendor_name)
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
          `04/01/${
            isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
          }`
        );
        const endDate = new Date(
          `03/31/${
            isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
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
      renderRowCell: (row) => {
        return <p> &#8377; {row?.request_amount}</p>;
      },
    },
    {
      key: "base_amount",
      name: "Base Amount",
      width: 150,
      renderRowCell: (row) => {
        return row?.base_amount ? <p> &#8377; {row?.base_amount}</p> : "NA";
      },
    },
    {
      key: "gst_amount",
      name: "GST Amount",
      width: 150,
      renderRowCell: (row) => {
        return row?.gst_amount ? <p>&#8377; {row?.gst_amount}</p> : "NA";
      },
    },
    {
      key: "outstandings",
      name: "OutStanding ",
      width: 150,
      renderRowCell: (row) => {
        return <p> &#8377; {row?.outstandings}</p>;
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

  return (
    <div>
      <FormContainer
        mainTitle="Discard Payment"
        link="/admin/inance-pruchasemanagement-discardpayment"
        uniqueVendorCount={uniqueVendorCount}
        totalRequestAmount={totalRequestAmount}
        discardCount={discardCount}
        handleOpenUniqueVendorClick={handleOpenUniqueVendorClick}
        discardAdditionalTitles={true}
      />
      {/* Same Vendor Dialog */}
      <Dialog
        open={sameVendorDialog}
        onClose={handleCloseSameVender}
        // fullWidth={"md"}
        // maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Same Vendors</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSameVender}
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
            rows={sameVendorData}
            columns={sameVenderColumns}
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
            getRowId={(row) => sameVendorData.indexOf(row)}
          />
        </DialogContent>
      </Dialog>
      {/* Unique Vendor Dialog Box */}
      <Dialog
        open={uniqueVenderDialog}
        onClose={handleCloseUniqueVendor}
        // fullWidth={"md"}
        // maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Unique Vendors</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUniqueVendor}
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
            rows={uniqueVendorData}
            columns={uniqueVendorColumns}
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
            getRowId={(row) => uniqueVendorData?.indexOf(row)}
          />
        </DialogContent>
      </Dialog>

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
                    <option value="currentQuarter">This Quarter</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body pb4">
              <div className="row thm_form">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Vendor Name</label>
                    <Autocomplete
                      value={vendorName}
                      onChange={(event, newValue) => setVendorName(newValue)}
                      options={Array.from(
                        new Set(
                          data?.map((option) => option?.vendor_name || [])
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Vendor Name"
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
                    <label>Priority</label>
                    <select
                      value={priorityFilter}
                      className="form-control"
                      onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                      <option value="">Select Priority</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Request Amount Filter</label>
                    <select
                      value={requestAmountFilter}
                      className="form-control"
                      onChange={(e) => setRequestAmountFilter(e.target.value)}
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
                    <label>Requested Amount</label>
                    <input
                      value={requestedAmountField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setRequestedAmountField(e.target.value);
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
                  onClick={handleDateFilter}
                  className="btn cmnbtn btn-primary"
                >
                  <i className="fas fa-search"></i> Search
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClearDateFilter}
                  className="btn cmnbtn btn-secondary"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <View
          columns={columns}
          data={filterData}
          isLoading={isLoading}
          title={"Discard"}
          rowSelectable={true}
          pagination={[100, 200]}
          tableName={"finance-discard"}
          selectedData={setSelectedData}
        />

        {openImageDialog && (
          <ImageView
            viewImgSrc={viewImgSrc}
            setViewImgDialog={setOpenImageDialog}
          />
        )}
        {paymentHistory && (
          <PaymentHistoryDialog
            handleClose={setPaymentHistory}
            paymentDetailColumns={paymentDetailColumns}
            filterData={historyData}
          />
        )}
        {/* Bank Detail dialog */}
        <Dialog
          open={bankDetail}
          onClose={handleCloseBankDetail}
          // fullWidth={"md"}
          // maxWidth={"md"}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DialogTitle>Bank Details</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseBankDetail}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <TextField
            id="outlined-multiline-static"
            // label="Multiline"
            multiline
            value={bankDetailRowData[0]?.payment_details}
            rows={4}
            defaultValue="Default Value"
            variant="outlined"
          />

          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                bankDetailRowData[0]?.payment_details
              );
              toastAlert("Copied to clipboard");
            }}
          >
            Copy
          </Button>
        </Dialog>
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
      </div>
    </div>
  );
}
