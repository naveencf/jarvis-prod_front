import { useEffect, useState } from "react";
import FormContainer from "../../../AdminPanel/FormContainer";
import { GridToolbar } from "@mui/x-data-grid";
import { Badge, Button, Dialog, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import ImageView from "../../ImageView";
import { baseUrl } from "../../../../utils/config";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PaymentHistoryDialog from "../../../PaymentHistory/PaymentHistoryDialog";
import ShowDataModal from "../../../Finance/Purchase Management/PendingPaymentRequest/Components/ShowDataModal";
import { useGlobalContext } from "../../../../Context/Context";
import jwtDecode from "jwt-decode";
import moment from "moment";
import View from "../../../AdminPanel/Sales/Account/View/View";
import DiscardFilters from "./Components/DiscardFilters";
import CommonDialogBox from "../../CommonDialog/CommonDialogBox";
import {
  DiscardColumns,
  DiscardUniqueVendorColumns,
} from "../../CommonColumn/Columns";

export default function Discard() {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const { toastAlert } = useGlobalContext();
  const [data, setData] = useState([]);
  const [aknowledgementDialog, setAknowledgementDialog] = useState(false);
  const [remainderDialog, setRemainderDialog] = useState(false);
  const [reminderData, setReminderData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [uniqueVendorCount, setUniqueVendorCount] = useState(0);
  const [uniqueVenderDialog, setUniqueVenderDialog] = useState(false);
  const [uniqueVendorData, setUniqueVendorData] = useState([]);
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
  const [selectedData, setSelectedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [columnsData, setColumnsData] = useState([]);

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
          return "Pending";
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
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    return diffDays;
  }

  const totalRequestAmount = filterData.reduce(
    (total, item) => total + parseFloat(item.request_amount),
    0
  );

  const handleOpenUniqueVendorClick = () => {
    setUniqueVenderDialog(true);
  };

  const handleOpenSameVender = (vendorName) => {
    const sameNameVendors = data.filter(
      (item) => item.vendor_name === vendorName
    );
    setSameVendorData(sameNameVendors);
  };

  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    setFilterData(data);
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

      {console.log(uniqueVendorData, "ppppp")}
      <CommonDialogBox
        setDialog={setUniqueVenderDialog}
        dialog={uniqueVenderDialog}
        columns={DiscardUniqueVendorColumns({
          handleOpenSameVender,
          filterData,
          uniqueVendorData,
        })}
        data={uniqueVendorData}
        title={"Unique Vendor"}
      />

      <DiscardFilters
        setFilterData={setFilterData}
        filterData={filterData}
        data={data}
        setUniqueVendorCount={setUniqueVendorCount}
        setUniqueVendorData={setUniqueVendorData}
        setDiscardCount={setDiscardCount}
      />

      <div>
        <View
          columns={DiscardColumns({
            phpRemainderData,
            nodeData,
            setOpenImageDialog,
            setViewImgSrc,
            handleRemainderModal,
            handleOpenSameVender,
            calculateDays,
            handleOpenPaymentHistory,
            handleOpenBankDetail,
          })}
          data={filterData}
          isLoading={isLoading}
          title={"Discard"}
          showTotal={true}
          rowSelectable={true}
          pagination={[100, 200]}
          tableName={"finance-discard"}
          selectedData={setSelectedData}
          addHtml={
            <>
              <button
                className="btn cmnbtn btn_sm btn-secondary ms-2"
                onClick={(e) => handleClearSameRecordFilter(e)}
              >
                Clear
              </button>
            </>
          }
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
