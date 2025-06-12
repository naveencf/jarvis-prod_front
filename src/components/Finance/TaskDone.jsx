import { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import ImageView from "./ImageView";
import { baseUrl } from "../../utils/config";
import {
  Autocomplete,
  Button,
  // ButtonGroupButtonContext,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { set } from "date-fns";
import { useGlobalContext } from "../../Context/Context";

export default function TaskDone() {
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

  const [paymentHistory, setPaymentHistory] = useState(false);
  const [bankDetail, setBankDetail] = useState(false);
  const [nodeData, setNodeData] = useState([]);
  const [type, setHistoryType] = useState("");
  const [row, setRowData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [phpData, setPhpData] = useState([]);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [TDStableData, setTDStableData] = useState([]);
  const [uniqueVendorTDSdoneData, setUniqueVendorTDSdoneData] = useState([]);
  const [bankDetailRowData, setBankDetailRowData] = useState([]);

  const accordionButtons = ["Zoho", "GST", "TDS"];

  const { toastAlert } = useGlobalContext();

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
              (item2) => item.request_id == item2.request_id
              // item.zoho_status === "Done" &&
              // item.gst_status === "Done" &&
              // item.tds_status === "Done"
            );
          });

          setData(y);
          setFilterData(y);
          setPendingRequestCount(u.length);
          const uniqueVendors = new Set(y.map((item) => item.vendor_name));
          const uvData = [];
          uniqueVendors.forEach((vendorName) => {
            const vendorRows = y.filter(
              (item) => item.vendor_name == vendorName
            );
            uvData.push(vendorRows[0]);
          });
          setUniqueVendorData(uvData);
        });
    });
  };

  let uniqueVendorCountFun = () => {
    let uniqueVendorCountae = new Set(
      activeAccordionIndex == 0
        ? zohoDoneData.map((item) => item.vendor_name)
        : activeAccordionIndex == 1
          ? gstDoneData.map((item) => item.vendor_name)
          : tdsDoneData.map((item) => item.vendor_name)
    );
    let uvData = [];
    uniqueVendorCountae.forEach((vendorName) => {
      const vendorRows =
        activeAccordionIndex !== 2
          ? nodeData
          : tdsDoneData.filter((item) => item.vendor_name === vendorName);
      uvData.push(vendorRows[0]);
    });

    let lengthData = uvData.filter((item) => {
      return activeAccordionIndex === 0
        ? item?.zoho_status === "Done"
        : activeAccordionIndex === 1
          ? item?.gst_status === "Done"
          : activeAccordionIndex === 2
            ? item?.tds_status === "Done"
            : "";
    });

    setUniqueVendorCount(lengthData.length);
  };
  useEffect(() => {
    uniqueVendorCountFun();
  }, [activeAccordionIndex, filterData]);

  // pending data submit

  // useEffect(() => {
  //   callApi();
  // }, []);

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

  const filterPaymentAmount = nodeData.filter((item) =>
    data.some((e) => e.request_id == item.request_id)
  );
  // total requested  amount data :-
  const totalRequestAmount = filterPaymentAmount.reduce(
    (total, item) => total + parseFloat(Math.round(item.payment_amount)),
    0
  );

  // ==============================================================
  //iterate for totalAmount of same name venders :-
  const vendorAmounts = [];
  uniqueVendorData.forEach((item) => {
    const vendorName = item.vendor_name;
    const requestAmount = item.request_amount;

    if (vendorAmounts[vendorName]) {
      vendorAmounts[vendorName] += requestAmount; // Add request amount to existing total
    } else {
      vendorAmounts[vendorName] = requestAmount; // Initialize with request amount
    }
  });

  // calculate the total amount for vendors with the same name
  let totalSameVendorAmount = Object.values(vendorAmounts).reduce(
    (total, amount) => total + amount,
    0
  );
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
  };

  const handleClearDateFilter = () => {
    setFilterData(data);
    setFromDate("");
    setToDate("");
    setVendorName("");
    setPriorityFilter("");
    setRequestAmountFilter("");
    setRequestedAmountField("");
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
  // Bank Detail :-
  const handleOpenBankDetail = (row) => {
    let x = [];
    x.push(row);

    setBankDetailRowData(x);
    setBankDetail(true);
  };
  const handleCloseBankDetail = () => {
    setBankDetail(false);
  };
  // =========================================
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  // status for zoho:-
  const zohoDoneData = filterData.filter((item) => {
    return item.zoho_status === "Done";
  });
  // status for gst:-
  const gstDoneData = filterData.filter((item) => {
    return item.gst_status === "Done";
  });
  // status for TDS :-
  const tdsDoneData = filterData.filter((item) => {
    return item.tds_status === "Done";
  });

  useEffect(() => {
    setTDStableData(tdsDoneData);
  }, []);
  useEffect(() => {
    setTDStableData(tdsDoneData);
  }, [activeAccordionIndex]);
  // same Vender columns:-
  const sameVenderColumns = [
    {
      field: "s._no",
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
      renderCell: (params) => {
        return params.row.vendorName;
      },
    },
    {
      field: "request_amount",
      headerName: "Requested Amount",
      renderCell: (params) => {
        return <p> &#8377; {params.row.request_amount}</p>;
      },
    },
    {
      field: "total_amount",
      headerName: "Total Amount",
      width: 150,
      renderCell: () => {
        return <p> &#8377; {totalSameVendorAmount}</p>;
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
  // unique vender column :-
  const uniqueVendorColumns = [
    {
      field: "s._no",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        let rowIndex;
        if (activeAccordionIndex === 0) {
          rowIndex = uniqueVendorData
            .filter((e) => e.zoho_status === "Done")
            .indexOf(params.row);
        } else if (activeAccordionIndex === 1) {
          rowIndex = uniqueVendorData
            .filter((e) => e.gst_status === "Done")
            .indexOf(params.row);
        } else if (activeAccordionIndex === 2) {
          rowIndex = uniqueVendorTDSdoneData.indexOf(params.row);
        } else {
          rowIndex = -1; // default case when activeAccordionIndex is neither 0 nor 1 nor 2
        }

        return <div>{rowIndex !== -1 ? rowIndex + 1 : ""}</div>;
      },
    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      // width: "auto",
      width: 250,
      renderCell: (params) => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleOpenSameVender(params.row.vendor_name)}
          >
            {params.row.vendor_name}
          </div>
        );
      },
    },
    {
      field: "total_amount",
      headerName: "Total Amount",
      width: 150,
      renderCell: () => {
        return <p> &#8377; {totalSameVendorAmount}</p>;
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
        return (
          <p> {calculateDays(params.row.request_date, new Date())} Days</p>
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
  const columns = [
    {
      field: "s._no",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex =
          activeAccordionIndex === 0
            ? zohoDoneData.indexOf(params.row)
            : activeAccordionIndex === 1
              ? gstDoneData.indexOf(params.row)
              : activeAccordionIndex === 2
                ? tdsDoneData.indexOf(params.row)
                : "";
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "invc_img",
      headerName: "Invoice Image",
      renderCell: (params) => {
        const fileExtension = phpData.filter((item) => {
          return item.request_id == params.row.request_id;
        });

        // Extract file extension and check if it's a PDF
        let f = fileExtension[0]?.invc_img?.split(".").pop().toLowerCase();
        const isPdf = f === "pdf";

        const imgUrl = `https://purchase.creativefuel.io/${fileExtension[0]?.invc_img}`;
        return isPdf ? (
          <>
            <iframe
              allowFullScreen={true}
              src={imgUrl}
              title="PDF Viewer"
              style={{ width: "80px", height: "80px" }}
            />
            <div
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(imgUrl);
              }}
              style={{
                position: "absolute",
                width: "2.9%",
                height: "19%",
                top: "258px",
                left: "104px",
                cursor: "pointer",
                background: "rgba(0, 0, 0, 0)",
                zIndex: 10,
              }}
            ></div>
          </>
        ) : fileExtension[0]?.invc_img &&
          fileExtension[0].invc_img.length > 1 ? (
          <img
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(imgUrl);
            }}
            src={imgUrl}
            alt="Invoice"
            style={{ width: "80px", height: "80px" }}
          />
        ) : (
          "No Img"
        );
      },
      width: 250,
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
      width: 200,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{ cursor: "pointer", marginRight: "20px" }}
              onClick={() => handleOpenSameVender(params.row.vendor_name)}
            >
              {params.row.vendor_name}
            </div>
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
      renderCell: (params) => {
        return nodeData.filter((e) => e.vendor_name === params.row.vendor_name)
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
      renderCell: (params) => {
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
    // {
    //   field: "Pan Img",
    //   headerName: "Pan Img",
    //   renderCell: (params) => {
    //     const ImgUrl = `https://purchase.creativefuel.io/${params.row.pan_img}`;
    //     return params.row.pan_img.includes("uploads") ? (
    //       <img
    //         onClick={() => {
    //           setOpenImageDialog(true);
    //           setViewImgSrc(ImgUrl);
    //         }}
    //         src={ImgUrl}
    //         alt="Pan"
    //         style={{ width: "40px", height: "40px" }}
    //       />
    //     ) : (
    //       "NA"
    //     );
    //   },
    // },
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
  const zohocolumn = [
    ...columns,
    {
      field: "zoho_remark",
      headerName: "Zoho Remark",
      width: 150,
      renderCell: (params) => {
        return params.row.zoho_remark;
      },
    },
    {
      field: "zoho_date",
      headerName: "Zoho Date",
      width: 150,
      renderCell: (params) => {
        return convertDateToDDMMYYYY(params.row.zoho_date);
      },
    },
  ];
  const gstColumn = [
    ...columns,
    {
      field: "gst_remark",
      headerName: "GST Remark",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_remark;
      },
    },
    {
      field: "gst_date",
      headerName: "GST Date",
      width: 150,
      renderCell: (params) => {
        return convertDateToDDMMYYYY(params.row.gst_date);
      },
    },
  ];
  const tdsColumn = [
    ...columns,
    {
      field: "tds_remark",
      headerName: "TDS Remark",
      width: 150,
      renderCell: (params) => {
        return params.row.tds_remark;
      },
    },
    {
      field: "gst_date",
      headerName: "TDS Date",
      width: 150,
      renderCell: (params) => {
        return convertDateToDDMMYYYY(params.row.tds_date);
      },
    },
  ];

  useEffect(() => {
    let newData = new Set(TDStableData.map((item) => item.vendor_name));

    let uvData = [];
    newData.forEach((vendorName) => {
      const vendorRows = TDStableData.filter(
        (item) => item.vendor_name == vendorName
      );
      uvData.push(vendorRows[0]);
    });

    return setUniqueVendorTDSdoneData(uvData);
  }, [activeAccordionIndex, TDStableData]);

  return (
    <div>
      <FormContainer
        mainTitle="Done"
        link="/admin/finance/finance-pruchasemanagement-paymentdone"
        uniqueVendorCount={uniqueVendorCount}
        totalRequestAmount={totalRequestAmount}
        pendingRequestCount={pendingRequestCount}
        handleOpenUniqueVendorClick={handleOpenUniqueVendorClick}
        paymentDoneAdditionalTitles={true}
      />
      {/* Same Vendors Dialog */}
      <Dialog
        open={sameVendorDialog}
        onClose={handleCloseSameVender}
        fullWidth={"md"}
        maxWidth={"md"}
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
            disableColumnMenu
            disableColumnSelector
            disableColumnFilter
            disableColumnReorder
            disableColumnResize
            disableMultipleColumnsSorting
            components={{
              Toolbar: GridToolbar,
            }}
            fv
            componentsProps={{
              toolbar: {
                value: search,
                onChange: (event) => setSearch(event.target.value),
                placeholder: "Search",
                clearSearch: true,
                clearSearchAriaLabel: "clear",
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
          <DataGrid
            rows={
              activeAccordionIndex == 2
                ? uniqueVendorTDSdoneData
                : uniqueVendorData.filter((e) =>
                  activeAccordionIndex == 0
                    ? e.zoho_status == "Done"
                    : activeAccordionIndex == 1
                      ? e.gst_status == "Done"
                      : ""
                )
            }
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
            getRowId={(row) => row.request_id}
          />
        </DialogContent>
      </Dialog>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Search by filter</h5>
            </div>
            <div className="card-body pb4">
              <div className="row thm_form">
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body p0 thm_table">
              <FormContainer
                submitButton={false}
                accordionButtons={accordionButtons}
                activeAccordionIndex={activeAccordionIndex}
                onAccordionButtonClick={handleAccordionButtonClick}
                mainTitleRequired={false}
              >
                <div className="tab-content">
                  {activeAccordionIndex === 0 && (
                    <div>
                      <DataGrid
                        rows={zohoDoneData}
                        columns={zohocolumn}
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
                        getRowId={(row) => zohoDoneData.indexOf(row)}
                      />
                    </div>
                  )}
                  {activeAccordionIndex === 1 && (
                    <div className="mt-3">
                      <DataGrid
                        rows={gstDoneData}
                        columns={gstColumn}
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
                        getRowId={(row) => gstDoneData.indexOf(row)}
                      />
                    </div>
                  )}
                  {activeAccordionIndex === 2 && (
                    <div className="mt-3">
                      <DataGrid
                        rows={tdsDoneData}
                        columns={tdsColumn}
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
                    </div>
                  )}
                </div>
              </FormContainer>
              {openImageDialog && (
                <ImageView
                  viewImgSrc={viewImgSrc}
                  setViewImgDialog={setOpenImageDialog}
                />
              )}
              {/* Bank Detail dialog */}
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

                {/* <DataGrid
                  rows={bankDetailRowData}
                  columns={bankDetailColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  autoHeight
                  disableColumnMenu
                  disableColumnSelector
                  disableColumnFilter
                  disableColumnReorder
                  disableColumnResize
                  disableMultipleColumnsSorting
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  fv
                  componentsProps={{
                    toolbar: {
                      value: search,
                      onChange: (event) => setSearch(event.target.value),
                      placeholder: "Search",
                      clearSearch: true,
                      clearSearchAriaLabel: "clear",
                    },
                  }}
                  getRowId={(row) => filterData.indexOf(row)}
                /> */}

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
      </div>
    </div>
  );
}
