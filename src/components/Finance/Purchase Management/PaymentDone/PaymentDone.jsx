import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import ImageView from "../../ImageView";
import { baseUrl } from "../../../../utils/config";
import { Button, Dialog, DialogTitle, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useGlobalContext } from "../../../../Context/Context";
import ShowDataModal from "../../../Finance/Purchase Management/PendingPaymentRequest/Components/ShowDataModal";
import jwtDecode from "jwt-decode";
import moment from "moment";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import FormContainer from "../../../AdminPanel/FormContainer";
import CommonDialogBox from "../../CommonDialog/CommonDialogBox";
import PaymentDoneFilters from "./Components/PaymentDoneFilters";
import {
  paymentDoneColumns,
  PaymentDonePaymentDetailColumns,
  PaymentDoneRemainderDialogColumns,
  paymentDoneUniqueVendorColumns,
} from "../../CommonColumn/Columns";
import View from "../../../AdminPanel/Sales/Account/View/View";

export default function PaymentDone() {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const [aknowledgementDialog, setAknowledgementDialog] = useState(false);
  const [remainderDialog, setRemainderDialog] = useState(false);
  const [reminderData, setReminderData] = useState([]);
  const [phpRemainderData, setPhpRemainderData] = useState([]);
  const [userName, setUserName] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [uniqueVendorCount, setUniqueVendorCount] = useState(0);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [uniqueVenderDialog, setUniqueVenderDialog] = useState(false);
  const [uniqueVendorData, setUniqueVendorData] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [bankDetail, setBankDetail] = useState(false);
  const [nodeData, setNodeData] = useState([]);
  const [type, setHistoryType] = useState("");
  const [row, setRowData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [phpData, setPhpData] = useState([]);
  const [bankDetailRowData, setBankDetailRowData] = useState([]);
  const [withInvoiceCount, setWithInvoiceCount] = useState(0);
  const [withoutInvoiceCount, setWithoutInvoiceCount] = useState(0);
  const [dateFilter, setDateFilter] = useState("");
  const { toastAlert, toastError } = useGlobalContext();
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [tdsDeductionCount, setTdsDeductedCount] = useState(0);
  const [selectedData, setSelectedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const callApi = () => {
    setIsLoading(true);
    axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      setNodeData(res.data.modifiedData);
      const x = res.data.modifiedData;

      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequestpaid"
        )
        .then((res) => {
          setPhpData(res?.data?.body);

          let y = x?.filter((item) => {
            if (item.status == 1) {
              return item;
            }
          });
          let u = res?.data?.body?.filter((item) => {
            return y?.some((item2) => item.request_id == item2.request_id);
          });
          setIsLoading(false);
          setData(u);
          setFilterData(u);
          setPendingRequestCount(u?.length);
          // with and without invoice count
          const withInvoiceImage = u?.filter(
            (item) => item?.invc_img && item?.invc_img?.length > 0
          );
          const withoutInvoiceImage = u?.filter(
            (item) => !item.invc_img || item.invc_img.length === 0
          );
          setWithInvoiceCount(withInvoiceImage.length);
          setWithoutInvoiceCount(withoutInvoiceImage.length);
          // ==============================================================
          const uniqueVendors = new Set(u?.map((item) => item?.vendor_name));
          setUniqueVendorCount(uniqueVendors?.size);
          const uvData = [];
          uniqueVendors?.forEach((vendorName) => {
            const vendorRows = u?.filter(
              (item) => item?.vendor_name === vendorName
            );
            uvData?.push(vendorRows[0]);
          });
          setUniqueVendorData(uvData);

          const dateFilterData = filterDataBasedOnSelection(u);
          setFilterData(dateFilterData);

          const tdsCount = u?.filter(
            (data) => data?.TDSDeduction === "1" || data?.TDSDeduction === null
          );
          setTdsDeductedCount(tdsCount);
        });
    });

    axios
      .get(
        "https://purchase.creativefuel.io//webservices/RestController.php?view=getpaymentrequest"
      )
      .then((res) => {
        setPhpRemainderData(res?.data?.body);
      });

    axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
      setUserName(res?.data?.user_name);
    });
  };

  var handleAcknowledgeClick = () => {
    setAknowledgementDialog(true);
  };

  const handleRemainderModal = (reaminderData) => {
    setReminderData(reaminderData);
    setRemainderDialog(true);
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

  GridToolbar.defaultProps = {
    filterRowsButtonText: "Filter",
    filterGridToolbarButton: "Filter",
  };

  const filterPaymentAmount = nodeData?.filter((item) =>
    filterData?.some((e) => e.request_id == item.request_id)
  );
  // total requested  amount data :-
  const totalRequestAmount = filterPaymentAmount?.reduce(
    (total, item) => total + parseFloat(Math?.round(item.payment_amount)),
    0
  );

  const handleOpenUniqueVendorClick = () => {
    setUniqueVenderDialog(true);
  };

  const handleCloseUniqueVendor = () => {
    setUniqueVenderDialog(false);
  };

  const handleOpenSameVender = (vendorName) => {
    const sameNameVendors = data?.filter(
      (item) => item?.vendor_name === vendorName
    );
    setFilterData(sameNameVendors);
    handleCloseUniqueVendor();
  };

  // Payment history detail:-
  const handleOpenPaymentHistory = (row, type) => {
    setHistoryType(type);
    setRowData(row);
    setPaymentHistory(true);
    const isCurrentMonthGreaterThanMarch = new Date()?.getMonth() + 1 > 3;
    const currentYear = new Date()?.getFullYear();
    const startDate = new Date(
      `04/01/${isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1}`
    );
    const endDate = new Date(
      `03/31/${isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear}`
    );

    const dataFY = nodeData?.filter((e) => {
      const paymentDate = new Date(e.request_date);
      return (
        paymentDate >= startDate &&
        paymentDate <= endDate &&
        e.vendor_name === row.vendor_name &&
        e.status != 0 &&
        e.status != 2
      );
    });

    const dataTP = nodeData?.filter((e) => {
      return (
        e.vendor_name === row.vendor_name && e.status != 0 && e.status != 2
      );
    });

    setHistoryData(type == "FY" ? dataFY : dataTP);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "0":
        return "Paid";
      case "1":
        return "Discard";
      case "2":
        return "Partial";
      default:
        return "";
    }
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
        mainTitle="Payment Done"
        link="/admin/finance-pruchasemanagement-paymentdone"
        uniqueVendorCount={uniqueVendorCount}
        totalRequestAmount={totalRequestAmount}
        pendingRequestCount={pendingRequestCount}
        withInvoiceCount={withInvoiceCount}
        withoutInvoiceCount={withoutInvoiceCount}
        tdsDeductionCount={tdsDeductionCount}
        handleOpenUniqueVendorClick={handleOpenUniqueVendorClick}
        paymentDoneAdditionalTitles={true}
      />
      {/* Unique Vendor Dialog Box */}
      <CommonDialogBox
        setDialog={setUniqueVenderDialog}
        dialog={uniqueVenderDialog}
        columns={paymentDoneUniqueVendorColumns({
          uniqueVendorData,
          handleOpenSameVender,
          filterData,
        })}
        data={uniqueVendorData}
        title={"Unique Vendor"}
      />
      {/* Payment History Dialog Box */}
      <CommonDialogBox
        setDialog={setPaymentHistory}
        dialog={paymentHistory}
        columns={PaymentDonePaymentDetailColumns({ historyData, nodeData })}
        data={historyData}
        title={"Payment History"}
      />
      {/* Payment Done Filters */}
      <PaymentDoneFilters
        data={data}
        setFilterData={setFilterData}
        setDateFilter={setDateFilter}
        dateFilter={dateFilter}
        setPendingRequestCount={setPendingRequestCount}
        setUniqueVendorCount={setUniqueVendorCount}
        setUniqueVendorData={setUniqueVendorData}
      />

      <div>
        <View
          columns={paymentDoneColumns({
            filterData,
            setOpenImageDialog,
            setViewImgSrc,
            phpRemainderData,
            nodeData,
            getStatusText,
            handleOpenPaymentHistory,
            handleOpenBankDetail,
          })}
          data={filterData}
          isLoading={isLoading}
          showTotal={true}
          title={"Payment Done"}
          rowSelectable={true}
          pagination={[100, 200]}
          tableName={"finance-payment-done"}
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
      </div>

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

      {remainderDialog && (
        <ShowDataModal
          handleClose={setRemainderDialog}
          rows={reminderData}
          columns={PaymentDoneRemainderDialogColumns({
            reminderData,
            handleAcknowledgeClick,
          })}
          aknowledgementDialog={aknowledgementDialog}
          setAknowledgementDialog={setAknowledgementDialog}
          userName={userName}
          callApi={callApi}
          setRemainderDialo={setRemainderDialog}
        />
      )}
    </div>
  );
}
