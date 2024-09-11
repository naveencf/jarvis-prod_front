import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import ImageView from "../../ImageView";
import { baseUrl } from "../../../../utils/config";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useGlobalContext } from "../../../../Context/Context";
import moment from "moment";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import FormContainer from "../../../AdminPanel/FormContainer";

export default function GSThold() {
  const { toastAlert } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
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
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [uniqueVenderDialog, setUniqueVenderDialog] = useState(false);
  const [uniqueVendorData, setUniqueVendorData] = useState([]);
  const [sameVendorDialog, setSameVendorDialog] = useState(false);
  const [sameVendorData, setSameVendorData] = useState([]);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [bankDetail, setBankDetail] = useState(false);
  const [bankDetailRowData, setBankDetailRowData] = useState([]);
  const [nodeData, setNodeData] = useState([]);
  const [type, setHistoryType] = useState("");
  const [row, setRowData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [phpData, setPhpData] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const callApi = () => {
    axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      setNodeData(res.data.modifiedData);
      const x = res.data.modifiedData;

      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          setPhpData(res.data.body);

          let y = x.filter((item) => {
            if (item.status == 1) {
              return item;
            }
          });
          let u = res.data.body.filter((item) => {
            return y.some(
              (item2) =>
                item.request_id == item2.request_id &&
                item2.gst_Hold_Bool == true
            );
          });
          setData(u);
          setFilterData(u);
          setPendingRequestCount(u.length);
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
  };

  const handleOpenBankDetail = (row) => {
    let x = [];
    x.push(row);

    setBankDetailRowData(x);
    setBankDetail(true);
  };

  const handleCloseBankDetail = () => {
    setBankDetail(false);
  };

  useEffect(() => {
    callApi();
  }, [dateFilter]);

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
  // total requested  amount data :-
  const filterPaymentAmount = nodeData.filter((item) =>
    filterData.some((e) => e.request_id == item.request_id)
  );

  const totalRequestAmount = filterPaymentAmount.reduce(
    (total, item) => total + parseFloat(Math.round(item.payment_amount)),
    0
  );

  // ==============================================================

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
        item.vendor_name.toLowerCase().includes(vendorName.toLowerCase());

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
    setPendingRequestCount(filterData.length);
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
    setFromDate("");
    setToDate("");
    setVendorName("");
    setPriorityFilter("");
    setRequestAmountFilter("");
    setRequestedAmountField("");
    setPendingRequestCount(data.length);
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
    // Set the selected vendor data including the vendor name, data, and total amount
    setSameVendorData(sameNameVendors);
  };

  const handleCloseSameVender = () => {
    setSameVendorDialog(false);
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

    // let outstandings = 0;
    // let request_amount = 0;

    // type=="FY"?dataFY:dataTP.forEach((row) => {
    //   outstandings += +row.outstandings;
    //   request_amount += +row.request_amount || 0;
    // });

    // // Create total row
    // const totalRow = {
    //   outstandings: outstandings,
    //   request_amount: request_amount,
    //   vendor_name: "Total",

    // };

    // setHistoryData(type === "FY" ? [...dataFY, totalRow] : [...dataTP, totalRow]);

    setHistoryData(type == "FY" ? dataFY : dataTP);
  };
  const handleClosePaymentHistory = () => {
    setPaymentHistory(false);
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
        return params.row.vendorName;
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
  // bank Payment Detail column:-
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

  const columns = [
    {
      field: "s_no",
      headerName: "S.NO",
      width: 90,
      editable: false,
      valueGetter: (params) => filterData.indexOf(params.row) + 1,
      renderCell: (params) => {
        const rowIndex = filterData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "invc_img",
      headerName: "Invoice Image",
      renderCell: (params) => {
        // Extract file extension and check if it's a PDF
        const fileExtension = params.row.invc_img
          .split(".")
          .pop()
          .toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = `https://purchase.creativefuel.io/${params.row.invc_img}`;
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
        return params.row.name;
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
          .filter(
            (e) => e.vendor_name === params.row.vendor_name && e.status == 1
          )
          .reduce((acc, item) => acc + +item.payment_amount, 0);
        return totalPaid;
      },
      renderCell: (params) => {
        return nodeData.filter((e) => e.vendor_name === params.row.vendor_name)
          .length > 0 ? (
          <span className="row ml-2 ">
            <h5
              onClick={() => handleOpenPaymentHistory(params.row, "TP")}
              style={{ cursor: "pointer" }}
              className="fs-5 col-3 pointer font-sm lead text-decoration-underline text-black-50"
            >
              {/* Total Paid */}
              {nodeData
                .filter(
                  (e) =>
                    e.vendor_name === params.row.vendor_name && e.status == 1
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
      // renderCell: (params) => {
      //   const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
      //   const currentYear = new Date().getFullYear();
      //   const startDate = new Date(
      //     `04/01/${
      //       isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
      //     }`
      //   );
      //   const endDate = new Date(
      //     `03/31/${
      //       isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
      //     }`
      //   );
      //   const dataFY = nodeData.filter((e) => {
      //     const paymentDate = new Date(e.request_date);
      //     return (
      //       paymentDate >= startDate &&
      //       paymentDate <= endDate &&
      //       e.vendor_name === params.row.vendor_name &&
      //       e.status !== 0 &&
      //       e.status !== 2
      //     );
      //   });
      //   return nodeData.filter((e) => e.vendor_name === params.row.vendor_name)
      //     .length > 0 ? (
      //     <h5
      //       onClick={() => handleOpenPaymentHistory(params.row, "FY")}
      //       style={{ cursor: "pointer" }}
      //       className="fs-5 col-3  font-sm lead  text-decoration-underline text-black-50"
      //     >
      //       {/* Financial Year */}

      //       {dataFY.reduce(
      //         (acc, item) => acc + parseFloat(item.payment_amount),
      //         0
      //       )}
      //     </h5>
      //   ) : (
      //     <h5
      //       style={{ cursor: "pointer" }}
      //       className="fs-5 col-3  font-sm lead  text-decoration-underline text-black-50"
      //     >
      //       0
      //     </h5>
      //   );
      // },
    },
    {
      field: "Pan Img",
      headerName: "Pan Img",
      valueGetter: (params) =>
        params?.row?.pan_img.includes("uploads") ? params?.row?.pan_img : "NA",
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
      field: "outstandings",
      headerName: "OutStanding ",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.outstandings}</p>;
      },
    },
    {
      filed: "payment_amount",
      headerName: "Payment Amount",
      width: 150,
      renderCell: (params) => {
        const paymentAmount = nodeData.filter(
          (e) => e.request_id == params.row.request_id
        )[0]?.payment_amount;
        return paymentAmount ? <p>&#8377; {paymentAmount}</p> : "NA";
      },
    },
    {
      field: "aging",
      headerName: "Aging",
      width: 150,
      renderCell: (params) => {
        return (
          <p> {calculateDays(params.row.request_date, new Date())} Days</p>
        );
      },
    },
    {
      field: "gst_Hold_Bool",
      headerName: "GST Hold",
      renderCell: (params) => {
        return params.row.gstHold == 1 ? "Yes" : "No";
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
  const handleRowSelectionModelChange = async (rowIds) => {
    setRowSelectionModel(rowIds);
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
  function CustomColumnMenu(props) {
    return (
      <GridColumnMenu
        {...props}
        slots={{
          columnMenuColumnsItem: null,
        }}
      />
    );
  }
  return (
    <div>
      <FormContainer
        mainTitle="GST Hold"
        link="/admin/finance-pruchasemanagement-paymentdone"
        uniqueVendorCount={uniqueVendorCount}
        totalRequestAmount={totalRequestAmount}
        pendingRequestCount={pendingRequestCount}
        handleOpenUniqueVendorClick={handleOpenUniqueVendorClick}
        gstHoldAdditionalTitles={true}
      />
      {/* Same Vendors Dialog */}
      <Dialog
        open={sameVendorDialog}
        onClose={handleCloseSameVender}
        fullWidth={"md"}
        maxWidth={"md"}
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
          <div className="fx-head thm_table">
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
          </div>
        </DialogContent>
      </Dialog>
      {/* Unique Vendor Dialog Box */}
      <Dialog
        open={uniqueVenderDialog}
        onClose={handleCloseUniqueVendor}
        fullWidth={"md"}
        maxWidth={"md"}
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
          <div className="thm_table fx-head">
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
              getRowId={(row) => uniqueVendorData.indexOf(row)}
            />
          </div>
        </DialogContent>
      </Dialog>

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
                {/* <option value="nextMonth">Next Month</option> */}
                <option value="currentQuarter">This Quarter</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row thm_form">
            <div className="col-md-4 col-sm-12">
              <div className="form-group">
                <label>Vendor Name</label>
                <Autocomplete
                  value={vendorName}
                  onChange={(event, newValue) => setVendorName(newValue)}
                  options={Array.from(
                    new Set(data.map((option) => option.vendor_name))
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vendor Name"
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
                  <option value="">Select Date</option>
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

      <div className="card">
        <div className="card-body thm_table">
          {rowSelectionModel.length > 0 && (
            <Button
              className="btn btn-primary ml-3 mb-2"
              variant="contained"
              color="primary"
              size="small"
              onClick={handleDownloadInvoices}
            >
              Download PDF Zip
            </Button>
          )}
          <DataGrid
            rows={filterData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            checkboxSelection
            slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row?.request_id}
            onRowSelectionModelChange={(rowIds) => {
              handleRowSelectionModelChange(rowIds);
            }}
            rowSelectionModel={rowSelectionModel}
          />
          {openImageDialog && (
            <ImageView
              viewImgSrc={viewImgSrc}
              setViewImgDialog={setOpenImageDialog}
            />
          )}
          {/* Bank Detail */}
          <Dialog
            open={bankDetail}
            onClose={handleCloseBankDetail}
            fullWidth={"md"}
            maxWidth={"md"}
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
              multiline
              value={
                bankDetailRowData[0]?.payment_details +
                "\n" +
                "Mob:" +
                bankDetailRowData[0]?.mob1 +
                "\n" +
                (bankDetailRowData[0]?.email
                  ? "Email:" + bankDetailRowData[0]?.email
                  : "")
              }
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
          {/* Pyament History */}
          <Dialog
            open={paymentHistory}
            onClose={handleClosePaymentHistory}
            fullWidth={"md"}
            maxWidth={"md"}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DialogTitle>Payment History</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClosePaymentHistory}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>

            <DataGrid
              rows={historyData}
              columns={paymentDetailColumns}
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
              getRowId={(row) => row.request_id}
            />
          </Dialog>
        </div>
      </div>
    </div>
  );
}
