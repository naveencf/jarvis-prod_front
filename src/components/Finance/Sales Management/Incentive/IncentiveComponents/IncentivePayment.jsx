import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../../../../AdminPanel/FormContainer";
import { useGlobalContext } from "../../../../../Context/Context";
import DataTable from "react-data-table-component";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../../utils/config";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import moment from "moment";
import IncentiveRelease from "../../../../AdminPanel/Sales/Incenti Dashboard/IncentiveRelease";

const IncentivePayment = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [incentiveRelease, setIncentiveRelease] = useState();
  const [selectedTrue, setp_TotalTrue] = useState(0);
  const [selectedFalse, setp_TotalFalse] = useState(0);
  const [total, setp_Total] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [accountNo, setAccountNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const [balanceReleaseAmount, setBalanceReleaseAmount] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [paymentDate, setPaymentDate] = useState(dayjs(new Date()));
  const [paymentType, setPaymentType] = useState("Full Payment");
  const [partialPaymentReason, setPartialPaymentReason] = useState("");
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [salesExecutive, setSalesExecutive] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [requestAmountFilter, setRequestAmountFilter] = useState("");
  const [requestedAmountField, setRequestAmountField] = useState("");
  const [releasedAmountFilter, setReleasedAmountFilter] = useState("");
  const [releasedAmountField, setReleasedAmountField] = useState("");
  const [adminApprovedAmountFilter, setAdminApprovedAmountFilter] =
    useState("");
  const [adminApprovedAmountField, setAdminApprovedAmountField] = useState("");
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [sameSalesExecutiveDialog, setSameSalesExecutiveDialog] = useState("");
  const [sameSalesExecutiveData, setSameSalesExecutiveData] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [balRelInvc, setBalRelInvc] = useState("");
  const [viewPendingStatus, setViewPendingStatus] = useState(true);
  const DateFormateToYYYYMMDD = (date) => {
    const d = new Date(date);
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    return `${ye}-${mo}-${da}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBalRelInvc(file);
    // setPreview(URL.createObjectURL(file));
  };

  const calculateAging = (date1, date2) => {
    const oneHour = 60 * 60 * 1000; // minutes * seconds * milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    const diffHours = Math.round(Math.abs((firstDate - secondDate) / oneHour));

    return diffHours;
  };

  const releaseIncentive = async () => {
    const saleBookingIds = [
      ...selectedTrue.map((c) => c.sale_booking_id),
      ...selectedFalse.map((c) => c.sale_booking_id),
    ];

    try {
      const response = await axios.post(
        `${baseUrl}sales/incentive_request`,
        {
          sales_executive_id: selectedData.sales_executive_id,
          sale_booking_ids: saleBookingIds,
          created_by: loginUserId,
          user_requested_amount: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error releasing campaigns:", error);
      return error;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const saleBookingIds = [
      ...selectedTrue?.map((c) => c.sale_booking_id),
      ...selectedFalse?.map((c) => c.sale_booking_id),
    ];
    const payload = {
      incentive_request_id: selectedData._id,
      sale_booking_ids: saleBookingIds,

      finance_released_amount: total,
      account_number: accountNo,
      payment_ref_no: paymentRef,
      payment_date: DateFormateToYYYYMMDD(paymentDate),
      remarks: remarks,
      updated_by: selectedData.updated_by,
      incentive_invoices: balRelInvc,
    };

    try {
      await axios.put(
        baseUrl +
          `/sales/incentive_request_release_by_finance/${selectedData._id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getData();
      setModalOpen(false);
      toastAlert("Data updated");
      setIsFormSubmitted(true);
    } catch (error) {
      toastError("Error releasing campaigns:", error);
    }
  };

  function getData() {
    axios
      .get(baseUrl + "sales/incentive_request_list_for_finance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Set data received from the API response
        setData(res?.data?.data);
        setFilterData(res?.data?.data);

        const salesExecuteiveData = res?.data?.data;
        const uniqueSalesEx = new Set(
          salesExecuteiveData?.map((item) => item?.sales_executive_name)
        );
        setUniqueSalesExecutiveCount(uniqueSalesEx?.size);
        const SEData = [];
        uniqueSalesEx?.forEach((vendorName) => {
          const salesRows = salesExecuteiveData?.filter(
            (item) => item.sales_executive_name === vendorName
          );
          SEData?.push(salesRows[0]);
        });
        setUniqueSalesExecutiveData(SEData);
        const dateFilterData = filterDataBasedOnSelection(res?.data?.data);
        setFilterData(dateFilterData);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.sales_executive_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  //  All Filters :-
  const handleAllFilters = () => {
    const filterData = datas.filter((item) => {
      const date = new Date(item.createdAt);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      // Date Range Filter:-
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Sales Executive Filter:-
      const salesExecutiveFilterPassed =
        !salesExecutive?.label ||
        item?.sales_executive_name
          ?.toLowerCase()
          ?.includes(salesExecutive?.label.toLowerCase());
      // request amount filter:-
      const requestAmountFilterPassed = () => {
        const requestAmount = parseFloat(requestedAmountField);
        switch (requestAmountFilter) {
          case "greaterThan":
            return +item.user_requested_amount > requestAmount;
          case "lessThan":
            return +item.user_requested_amount < requestAmount;
          case "equalTo":
            return +item.user_requested_amount === requestAmount;
          default:
            return true;
        }
      };
      const releasedAmountFilterPassed = () => {
        const releasedAmount = parseFloat(releasedAmountField);
        switch (releasedAmountFilter) {
          case "greaterThan":
            return +item.finance_released_amount > releasedAmount;
          case "lessThan":
            return +item.finance_released_amount < releasedAmount;
          case "equalTo":
            return +item.finance_released_amount === releasedAmount;
          default:
            return true;
        }
      };
      const balancetAmountFilterPassed = () => {
        const balanceAmount = parseFloat(adminApprovedAmountField);
        switch (adminApprovedAmountFilter) {
          case "greaterThan":
            return +item.admin_approved_amount > balanceAmount;
          case "lessThan":
            return +item.admin_approved_amount < balanceAmount;
          case "equalTo":
            return +item.admin_approved_amount === balanceAmount;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        dateFilterPassed &&
        salesExecutiveFilterPassed &&
        requestAmountFilterPassed() &&
        releasedAmountFilterPassed() &&
        balancetAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);

    const uniqueSalesEx = new Set(
      filterData?.map((item) => item?.sales_executive_name)
    );
    setUniqueSalesExecutiveCount(uniqueSalesEx?.size);
    const SEData = [];
    uniqueSalesEx?.forEach((vendorName) => {
      const salesRows = filterData?.filter(
        (item) => item.sales_executive_name === vendorName
      );
      SEData?.push(salesRows[0]);
    });
    setUniqueSalesExecutiveData(SEData);
  };
  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setSalesExecutive("");
    setRequestAmountFilter("");
    setRequestAmountField("");
    setReleasedAmountField("");
    setReleasedAmountFilter("");
    setAdminApprovedAmountField("");
    setAdminApprovedAmountFilter("");
    const uniqueSalesEx = new Set(
      datas?.map((item) => item?.sales_executive_name)
    );
    setUniqueSalesExecutiveCount(uniqueSalesEx?.size);
    const SEData = [];
    uniqueSalesEx?.forEach((vendorName) => {
      const salesRows = datas?.filter(
        (item) => item.sales_executive_name === vendorName
      );
      SEData?.push(salesRows[0]);
    });
    setUniqueSalesExecutiveData(SEData);

    // const salesExecuteiveData = res?.data?.data;
  };

  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const handleCloseUniquesalesExecutive = () => {
    setUniqueSalesExecutiveDialog(false);
  };

  const handleOpenSameSalesExecutive = (salesEName) => {
    setSameSalesExecutiveDialog(true);

    const sameNameSalesExecutive = datas.filter(
      (item) => item.sales_executive_name === salesEName
    );
    // Calculate the total amount for vendors with the same name
    // const totalAmount = sameNameVendors.reduce(
    //   (total, item) => total + item.request_amount,
    //   0
    // );

    // Set the selected vendor data including the vendor name, data, and total amount
    setSameSalesExecutiveData(sameNameSalesExecutive);
  };

  const handleCloseSameSalesExecutive = () => {
    setSameSalesExecutiveDialog(false);
  };

  // const calculateRequestedAmountTotal = () => {
  //   let totalAmount = 0;
  //   uniqueSalesExecutiveData.forEach((customer) => {
  //     totalAmount += parseFloat(customer.request_amount);
  //   });
  //   return totalAmount;
  // };
  // const requestedAmountTotal = calculateRequestedAmountTotal();
  const requestedAmountTotal = filterData?.reduce(
    (total, item) => total + parseFloat(item.user_requested_amount),
    0
  );
  const incentiveReleasedAmtTotal = filterData?.reduce((total, item) => {
    // Ensure released_amount is a number
    const amount = parseFloat(item.released_amount) || 0;
    return total + amount;
  }, 0);
  const sameSalesExecutivecolumn = [
    {
      field: "s._no",
      headerName: "S.No",
      renderCell: (params, index) => (
        <div>{[...sameSalesExecutiveData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "sales_executive_name",
      headerName: "Sales Executive Name",
      renderCell: (params) => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              handleOpenSameSalesExecutive(params.row.sales_executive_name)
            }
          >
            {params.row.sales_executive_name}
          </div>
        );
      },
    },
    {
      headerName: "Requested Date & Time",
      field: "request_creation_date",
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
            {" "}
            {params.row.user_requested_amount}
          </div>
        ),
    },
    {
      headerName: "Admin Approved Amount",
      width: 230,
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
      width: 230,
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
            Complete Release
          </button>
        ) : (
          //   <button
          //   className="btn cmnbtn btn_sm btn-outline-primary"
          //   // data-toggle="modal"
          //   // data-target="#incentiveModal"
          //   onClick={(e) => {
          //     e.preventDefault();
          //     setSelectedData(params.row),
          //     setBalanceReleaseAmount(params.row.balance_release_amount);
          //     setAccountNo("");
          //     setRemarks("");
          //     setPaymentRef("");
          //     setModalOpen(true);
          //   }}
          // >
          //   Complete Release
          // </button>
          <span>Released</span>
        );
      },
    },
    {
      headerName: "Aging",
      renderCell: (params) => {
        const currentDate = new Date(
          params.row.action == "Complete Release Button"
            ? new Date()
            : params.row.request_creation_date
        );
        const requestedDate = new Date(
          params.row.action == "Complete Release Button"
            ? params.row.request_creation_date
            : params.row.payment_date
        );
        const diffTime = Math.abs(currentDate - requestedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return params.row.sales_executive_name !== "Total" ? diffDays : null;
      },
    },
  ];
  const uniqueSalesExecutivecolumn = [
    {
      field: "s._no",
      headerName: "S.No",
      renderCell: (params, index) => (
        <div>{[...uniqueSalesExecutiveData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "sales_executive_name",
      headerName: "Sales Executive name",
      renderCell: (params) => {
        return (
          <a
            href="#"
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() =>
              handleOpenSameSalesExecutive(params.row.sales_executive_name)
            }
          >
            {params.row.sales_executive_name}
          </a>
        );
      },
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
            {" "}
            {params.row.user_requested_amount}
          </div>
        ),
    },
    {
      headerName: "Admin Approved Amount",
      width: 230,
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
      width: 230,
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
            Complete Release
          </button>
        ) : (
          //   <button
          //   className="btn cmnbtn btn_sm btn-outline-primary"
          //   // data-toggle="modal"
          //   // data-target="#incentiveModal"
          //   onClick={(e) => {
          //     e.preventDefault();
          //     setSelectedData(params.row),
          //     setBalanceReleaseAmount(params.row.balance_release_amount);
          //     setAccountNo("");
          //     setRemarks("");
          //     setPaymentRef("");
          //     setModalOpen(true);
          //   }}
          // >
          //   Complete Release
          // </button>
          <span>Released</span>
        );
      },
    },
    {
      field: "Aging",
      renderCell: (params) => {
        const currentDate = new Date(
          params.row.action == "Complete Release Button"
            ? new Date()
            : params.row.request_creation_date
        );
        const requestedDate = new Date(
          params.row.action == "Complete Release Button"
            ? params.row.request_creation_date
            : params.row.payment_date
        );
        const diffTime = Math.abs(currentDate - requestedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return params.row.sales_executive_name !== "Total" ? diffDays : null;
      },
    },
  ];
  console.log(viewPendingStatus, "viewPendingStatus----");
  const columns = [
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
            Complete Release
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
  useEffect(() => {
    balanceReleaseAmount * 1 + selectedData.released_amount * 1 ==
    selectedData.request_amount
      ? setPaymentType("Full Payment")
      : setPaymentType("Partial Payment");
    setPartialPaymentReason("");
  }, [balanceReleaseAmount]);

  useEffect(() => {
    filterAndCalculateTotal("pending");
  }, [datas]);

  const filterAndCalculateTotal = (status) => {
    const filtered = datas?.filter((item) => item.finance_status === status);
    const totalRequested = filtered?.reduce(
      (sum, row) => sum + row.user_requested_amount || 0,
      0
    );
    const totalApproved = filtered?.reduce(
      (sum, row) => sum + row.admin_approved_amount || 0,
      0
    );
    const totalReleased = filtered?.reduce(
      (sum, row) => sum + row.finance_released_amount || 0,
      0
    );

    const totalRow = {
      _id: "total",
      sales_executive_name: "Total",
      user_requested_amount: totalRequested,
      admin_approved_amount: totalApproved,
      finance_released_amount: totalReleased,
    };
    if (status == "approved") {
      setViewPendingStatus(false);
    } else {
      setViewPendingStatus(true);
    }
    setFilterData([...filtered, totalRow]);
  };

  const handlePendingFilterData = () => {
    filterAndCalculateTotal("pending");
    // setStatus("pending");
  };

  const handleCompletedFilterData = () => {
    filterAndCalculateTotal("approved");
    // setStatus("approved");
  };

  const filterDataBasedOnSelection = (apiData) => {
    const now = moment();
    switch (dateFilter) {
      case "last7Days":
        return apiData.filter((item) =>
          moment(item.request_creation_date).isBetween(
            now.clone().subtract(7, "days"),
            now,
            "day",
            "[]"
          )
        );
      case "last30Days":
        return apiData.filter((item) =>
          moment(item.request_creation_date).isBetween(
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
          moment(item.request_creation_date).isBetween(
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
          moment(item.request_creation_date).isBetween(
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
          moment(item.request_creation_date).isBetween(
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
          moment(item.request_creation_date).isBetween(
            quarterStart,
            quarterEnd,
            "day",
            "[]"
          )
        );
      case "today":
        return apiData.filter((item) =>
          moment(item.request_creation_date).isSame(now, "day")
        );
      default:
        return apiData;
    }
  };

  return (
    <div>
      <FormContainer
        mainTitle="Incentive Disbursement Request"
        link="/admin/incentive-payment-list"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
        requestedAmountTotal={requestedAmountTotal}
        incentiveReleasedAmtTotal={incentiveReleasedAmtTotal}
        incentivePaymentAdditionalTitles={true}
      />
      {/* Same Sales Executive Dialog Box */}
      <Dialog
        open={sameSalesExecutiveDialog}
        onClose={handleCloseSameSalesExecutive}
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
          onClick={handleCloseSameSalesExecutive}
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
            rows={sameSalesExecutiveData}
            columns={sameSalesExecutivecolumn}
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
            getRowId={(row) => sameSalesExecutiveData.indexOf(row)}
          />
        </DialogContent>
      </Dialog>
      {/* Unique Sales Executive Dialog Box */}
      <Dialog
        open={uniqueSalesExecutiveDialog}
        onClose={handleCloseUniquesalesExecutive}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Unique Sales Executive</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUniquesalesExecutive}
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
            rows={uniqueSalesExecutiveData}
            columns={uniqueSalesExecutivecolumn}
            fullWidth={"md"}
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
            getRowId={(row) => uniqueSalesExecutiveData.indexOf(row)}
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Sales Executive</label>
                    <Autocomplete
                      value={salesExecutive}
                      onChange={(event, newValue) =>
                        setSalesExecutive(newValue)
                      }
                      options={
                        Array.from(
                          new Set(
                            datas
                              ?.filter(
                                (option) =>
                                  option.sales_executive_name !== "Total"
                              )
                              ?.map((option) => option?.sales_executive_name)
                          )
                        ).map((name) => ({ label: name })) || []
                      }
                      getOptionLabel={(option) => option?.label || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sales Executive Name"
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
                    <label> User Requested Amount Filter</label>
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
                    <label> User Requested Amount</label>
                    <input
                      value={requestedAmountField}
                      type="number"
                      placeholder="Requested Amount"
                      className="form-control"
                      onChange={(e) => {
                        setRequestAmountField(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Released Amount Filter</label>
                    <select
                      value={releasedAmountFilter}
                      className="form-control"
                      onChange={(e) => setReleasedAmountFilter(e.target.value)}
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
                    <label>Released Amount</label>
                    <input
                      value={releasedAmountField}
                      type="number"
                      placeholder="Released Amount"
                      className="form-control"
                      onChange={(e) => {
                        setReleasedAmountField(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label> Admin Approved Amount Filter</label>
                    <select
                      value={adminApprovedAmountFilter}
                      className="form-control"
                      onChange={(e) =>
                        setAdminApprovedAmountFilter(e.target.value)
                      }
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
                    <label>Admin Approved Amount</label>
                    <input
                      value={adminApprovedAmountField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setAdminApprovedAmountField(e.target.value);
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
                  onClick={handleAllFilters}
                  className="btn cmnbtn btn-primary"
                >
                  <i className="fas fa-search"></i> Search
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClearAllFilter}
                  className="btn cmnbtn btn-secondary"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <DialogTitle>Balance Release</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setModalOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <form onSubmit={(e) => handleSubmit(e)}>
            <label>Request Amount</label>
            <input
              type="number"
              className="form-control"
              value={selectedData.user_requested_amount}
              readOnly
            />

            <label>Balance To Release</label>
            <input
              type="number"
              className="form-control"
              value={
                selectedData.finance_released_amount
                  ? selectedData.finance_released_amount
                  : 0
              }
              readOnly
            />

            <label>
              Paid Amount <sup className="text-danger">*</sup>
            </label>
            <input
              className="form-control"
              id="images"
              name="images"
              required
              // type="number"
              value={total}
              // onChange={(e) => {
              //   const enteredValue = e.target.value;

              //   // Check if the value is a non-empty string and a valid number
              //   if (enteredValue !== "" && !isNaN(enteredValue)) {
              //     const numericValue = parseFloat(enteredValue);

              //     // Check if the numeric value is within the allowed range
              //     if (numericValue <= selectedData.finance_released_amount) {
              //       setBalanceReleaseAmount(numericValue);
              //     } else {
              //       // Handle the case where the value exceeds the maximum
              //       toastError(
              //         `Please enter a valid amount that does not exceed the maximum limit ${selectedData.finance_released_amount}.`
              //       );
              //       setBalanceReleaseAmount("");
              //     }
              //   } else {
              //     // Reset if the input is not a valid number
              //     setBalanceReleaseAmount("");
              //   }
              // }}
            />

            <IncentiveRelease
              selectedRow={selectedData}
              setp_Total={setp_Total}
              setIncentiveRelease={setIncentiveRelease}
              setp_TotalTrue={setp_TotalTrue}
              setp_TotalFalse={setp_TotalFalse}
            />

            <label> Payment Type</label>
            <input
              className="form-control"
              type="text"
              value={paymentType}
              readOnly
            />

            {paymentType === "Partial Payment" && (
              <div>
                <label>
                  Partial Payment Reason <sup className="text-danger">*</sup>
                </label>
                <Autocomplete
                  placeholder="Partial Payment Reason"
                  disablePortal
                  value={partialPaymentReason}
                  onChange={(e, value) => setPartialPaymentReason(value)}
                  options={[
                    "Fund Management",
                    "Tax Deduction",
                    "Bad Debt Adjustment",
                  ]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required={paymentType === "Partial Payment"}
                    />
                  )}
                />
              </div>
            )}

            <label>
              Last 4 digit of account Number{" "}
              <sup className="text-danger">*</sup>
            </label>
            <input
              type="number"
              className="form-control"
              id="images"
              name="images"
              value={accountNo}
              onChange={(e) => {
                return e?.target?.value?.length <= 4
                  ? setAccountNo(e.target.value)
                  : toastError("Please enter valid account number");
              }}
              required
            />
            <label>Payment ref number </label>
            <input
              type="number"
              className="form-control"
              id="images"
              name="images"
              value={accountNo}
              onChange={(e) => setPaymentRef(e.target.value)}
              required
            />

            <div className="row">
              <label htmlFor="paymentProof">Payment Proof/ScreenShot</label>
              {/* <input
                          type="file"
                          className="form-control col-md-6"
                          id="paymentProof"
                          onChange={(e) => setPayMentProof(e.target.files[0])}
                        /> */}
              {/* <Button
                          variant="contained"
                          className="col-md-5 ms-3"
                          fullWidth
                          onClick={setOpenImageDialog}
                        >
                          view image
                        </Button> */}
              {/* {openImageDialog && (
                          <ImageView
                            viewImgSrc={payMentProof}
                            fullWidth={true}
                            maxWidth={"md"}
                            setViewImgDialog={setOpenImageDialog}
                          />
                        )} */}

              <input
                type="file"
                className="form-control mt-3"
                id="paymentProof"
                onChange={handleFileChange}
              />
              {/* <Button
                          variant="contained"
                          className="col-md-5 ms-3"
                          fullWidth
                          onClick={openImgDialog}
                        >
                          view image
                        </Button> */}
              {/* {openDialog && preview && (
                          <div
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: "rgba(0,0,0,0.5)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              zIndex: 9999,
                            }}
                            onClick={() => setOpenDialog(false)}
                          >
                            <img
                              src={preview}
                              alt="Selected file"
                              style={{
                                maxWidth: "50%",
                                maxHeight: "80%",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                        )} */}
            </div>
            <label>Remarks</label>
            <input
              type="text"
              className="form-control"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={paymentDate}
                className="mt-3 w-100 mb"
                format="DD/MM/YYYY"
                onChange={(e) => setPaymentDate(e)}
                label="Payment Date"
              />
            </LocalizationProvider>
            <button
              type="submit"
              className="btn btn-primary d-block"
              style={{ marginTop: "15px" }}
            >
              Submit
            </button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body flexCenterBetween">
              <div className="flexCenter colGap12">
                <Button
                  variant="contained"
                  onClick={handlePendingFilterData}
                  className="btn cmnbtn btn-primary"
                >
                  Pending
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCompletedFilterData}
                  className="btn cmnbtn btn-success"
                >
                  Completed
                </Button>
              </div>
              {/* <div>
                <Button
                  variant="contained"
                  onClick={() => getData()}
                  className="btn cmnbtn btn-danger"
                >
                  Refresh
                </Button>
              </div> */}
            </div>
            <div className="card-body thm_table pt0">
              <DataGrid
                rows={filterData}
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
                // rowCount={filterData?.length - 1}
                getRowId={(row) => row?._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncentivePayment;
