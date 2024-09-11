import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../../../AdminPanel/FormContainer";
import { useGlobalContext } from "../../../../Context/Context";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import DataTable from "react-data-table-component";
import {
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { get } from "jquery";
import ImageView from "../../ImageView";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { baseUrl } from "../../../../utils/config";
import pdfImg from "../../pdf-file.png";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { set } from "date-fns";
import moment from "moment";
import { useGetPaymentModeQuery } from "../../../Store/API/Finance/FinancePaymentModeApi";
import PendingApprovalStatusDialog from "./Components/PendingApprovalStatusDialog";
import {
  pendingApprovalColumn,
  uniquePendingApprovalCustomerColumn,
  uniquePendingApprovalSalesExecutiveColumn,
} from "../../CommonColumn/Columns";
import PendingApprovalFilters from "./Components/PendingApprovalFilters";
import CommonDialogBox from "../../CommonDialog/CommonDialogBox";
import { CommonFilterFunction } from "../../CommonDialog/CommonFilterFunction";

const PendingApprovalUpdate = () => {
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [status, setStatus] = useState("");
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [viewImgDialog, setViewImgDialog] = useState(false);
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [nonInvoiceCount, setNonInvoiceCount] = useState(0);
  const [nonGstCount, setNonGstCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [reason, setReason] = useState("");
  const [statusDialog, setStatusDialog] = useState(false);
  const [reasonField, setReasonField] = useState(false);
  const [paymentModeArray, setPaymentModeArray] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  const handleCopyDetail = (detail) => {
    navigator.clipboard.writeText(detail);
    toastAlert("Detail copied");
  };

  const handleStatusChange = async (row, selectedStatus) => {
    setSelectedRow(row);
    if (selectedStatus) {
      if (selectedStatus === "reject") {
        setStatusDialog(true);
        return;
      }
      const userConfirmed = confirm(
        "Are you sure you want to approve this Payment?"
      );
      if (!userConfirmed) {
        return; // Exit the function if the user cancels the confirmation
      }
      // confirm("Are you sure you want to submit this data?");
      {
        const payload = {
          payment_approval_status: selectedStatus,
          action_reason: reasonField,
          payment_amount: row?.payment_amount,
        };

        await axios
          .put(
            baseUrl + `sales/finance_approval_payment_update/${row?._id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.status === 200) {
              toastAlert("Status Approved Successfully");
            }
          })
          .catch((err) => {
            toastAlert("Status Approval Failed");
          })
          .finally(() => {
            getData();
            setStatus("");
          });
        setStatus(selectedStatus);
        setIsFormSubmitted(true);
      }
    } else {
      setStatus(null);
    }
  };

  const handlePaymentModeData = () => {
    axios
      .get(baseUrl + "sales/payment_mode", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setPaymentModeArray(res?.data?.data);
      })
      .catch((error) =>
        console.log(error, "Error While getting payment mode data")
      );
  };
  const getData = () => {
    setLoading(true);
    axios
      .get(baseUrl + `sales/payment_update?status=pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const resData = res?.data?.data;
        const accData = resData?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setData(accData);
        setFilterData(accData);
        setLoading(false);
        calculateUniqueData(accData);

        const nonGstCount = accData?.filter(
          (gst) => gst.gst_status === "false"
        );
        setNonGstCount(nonGstCount.length);

        const withInvoiceImage = accData?.filter(
          (item) =>
            item.payment_screenshot && item.payment_screenshot.length > 0
        );
        const withoutInvoiceImage = accData?.filter(
          (item) =>
            !item.payment_screenshot || item.payment_screenshot.length === 0
        );
        setInvoiceCount(withInvoiceImage.length);
        setNonInvoiceCount(withoutInvoiceImage.length);

        const dateFilterData = CommonFilterFunction(accData, dateFilter);
        setFilterData(dateFilterData);
      });
  };
  const calculateUniqueData = (sortedData) => {
    const aggregateData = (data, keyName) => {
      return data?.reduce((acc, curr) => {
        const key = curr[keyName];
        if (!acc[key]) {
          acc[key] = {
            ...curr,
            campaign_amount: 0,
            base_amount: 0,
            gst_amount: 0,
            payment_amount: 0,
          };
        }
        acc[key].campaign_amount += curr.campaign_amount;
        acc[key].base_amount += curr.base_amount;
        acc[key].gst_amount += curr.gst_amount;
        acc[key].payment_amount += curr.payment_amount;
        const balanceAmount = curr.campaign_amount - curr.payment_amount;
        acc[key].balance_amount += balanceAmount;
        // params.row.campaign_amount - params.row.payment_amount

        return acc;
      }, {});
    };

    // Aggregate data by account name:-
    const aggregatedAccountData = aggregateData(sortedData, "account_name");
    const uniqueAccData = Object.values(aggregatedAccountData);
    setUniqueCustomerData(uniqueAccData);
    setUniqueCustomerCount(uniqueAccData?.length);

    // Aggregate data by sales executive name :-
    const aggregatedSalesExData = aggregateData(sortedData, "created_by_name");
    const uniqueSalesExData = Object.values(aggregatedSalesExData);
    setUniqueSalesExecutiveData(uniqueSalesExData);
    setUniqueSalesExecutiveCount(uniqueSalesExData?.length);
  };

  useEffect(() => {
    getData();
    handlePaymentModeData();
  }, [dateFilter]);

  useEffect(() => {
    const result = datas?.filter((d) => {
      return d.sales_executive_name?.toLowerCase().match(search?.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleOpenUniqueAccountClick = () => {
    setUniqueCustomerDialog(true);
  };

  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const handleOpenSameAccounts = (accName) => {
    setSameCustomerDialog(true);

    const sameNameCustomers = datas.filter(
      (item) => item?.account_name === accName
    );
    setFilterData(sameNameCustomers);
    setUniqueCustomerDialog(false);
  };
  const handleOpenSameSalesExecutive = (salesEName) => {
    const sameNameSalesExecutive = datas?.filter(
      (item) => item.created_by_name === salesEName
    );
    setFilterData(sameNameSalesExecutive);
    setUniqueSalesExecutiveDialog(false);
  };
  // Clear Button Action For Table
  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    setFilterData(datas);
  };

  // Function to calculate total requested amount and counts
  const calculateTotalsAndCounts = (data) => {
    const requestedAmountTotal = data?.reduce(
      (total, item) => total + parseFloat(item.payment_amount) || 0,
      0
    );

    const pendingCount = data?.filter(
      (item) => item.payment_approval_status === "pending"
    )?.length;

    return { requestedAmountTotal, pendingCount };
  };

  const { requestedAmountTotal, pendingCount } =
    calculateTotalsAndCounts(filterData);

  const handleCloseStatusDialog = () => {
    setStatusDialog(false);
  };

  return (
    <div>
      <FormContainer
        mainTitle="Pending Approval "
        link="/admin/finance-alltransaction"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
        uniqueCustomerCount={uniqueCustomerCount}
        uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
        totalRequestAmount={requestedAmountTotal}
        pendingCount={pendingCount}
        nonGstCount={nonGstCount}
        invoiceCount={invoiceCount}
        nonInvoiceCount={nonInvoiceCount}
        handleOpenUniqueCustomerClick={handleOpenUniqueAccountClick}
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        pendingApprovalAdditionalTitles={true}
      />

      <PendingApprovalStatusDialog
        statusDialog={statusDialog}
        handleCloseStatusDialog={handleCloseStatusDialog}
        setReasonField={setReasonField}
        reasonField={reasonField}
        rowData={selectedRow}
        getData={getData}
        status={status}
        setStatus={setStatus}
      />
      <PendingApprovalFilters
        datas={datas}
        setFilterData={setFilterData}
        setUniqueCustomerCount={setUniqueCustomerCount}
        setUniqueCustomerData={setUniqueCustomerData}
        paymentModeArray={paymentModeArray}
        setDateFilter={setDateFilter}
        dateFilter={dateFilter}
      />

      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title">Pending Approval</h5>
          <div className="flexCenter colGap12">
            <button
              className="btn cmnbtn btn_sm btn-secondary"
              onClick={(e) => handleClearSameRecordFilter(e)}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="card-body thm_table fx-head data_tbl table-responsive">
          {/* {!loading ? ( */}
          <DataGrid
            rows={filterData}
            columns={pendingApprovalColumn({
              filterData,
              handleCopyDetail,
              paymentModeArray,
              handleStatusChange,
              setViewImgSrc,
              setViewImgDialog,
            })}
            disableSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => filterData?.indexOf(row)}
          />
          {/* ) : ( */}
          {/* <Skeleton
                  sx={{ bgcolor: "grey.900", borderRadius: "0.25rem" }}
                  variant="rectangular"
                  width="100%"
                  height={200}
                />
              )} */}
          {viewImgDialog && (
            <ImageView
              viewImgSrc={viewImgSrc}
              setViewImgDialog={setViewImgDialog}
            />
          )}
        </div>
      </div>
      {/* Unique Accounts Dialog Box */}
      <CommonDialogBox
        data={uniqueCustomerData}
        columns={uniquePendingApprovalCustomerColumn({
          uniqueCustomerData,
          handleOpenSameAccounts,
          handleStatusChange,
        })}
        setDialog={setUniqueCustomerDialog}
        dialog={uniqueCustomerDialog}
        title="Unique Accounts"
      />
      <CommonDialogBox
        data={uniqueSalesExecutiveData}
        columns={uniquePendingApprovalSalesExecutiveColumn({
          uniqueSalesExecutiveData,
          handleOpenSameSalesExecutive,
          handleStatusChange,
        })}
        setDialog={setUniqueSalesExecutiveDialog}
        dialog={uniqueSalesExecutiveDialog}
        title="Unique Sales Executive Dialog"
      />
    </div>
  );
};

export default PendingApprovalUpdate;
