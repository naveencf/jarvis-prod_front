import { useEffect, useState } from "react";
import axios from "axios";
import FormContainer from "../../../AdminPanel/FormContainer";
import { useGlobalContext } from "../../../../Context/Context";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ImageView from "../../ImageView";
import { baseUrl } from "../../../../utils/config";
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
  const [statusDialog, setStatusDialog] = useState(false);
  const [reasonField, setReasonField] = useState(false);
  const [paymentModeArray, setPaymentModeArray] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const token = sessionStorage.getItem("token");

  const handleCopyDetail = (detail) => {
    navigator.clipboard
      .writeText(detail)
      .then(() => toastAlert("Detail copied"));
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
        return;
      }
      const payload = {
        payment_approval_status: selectedStatus,
        action_reason: reasonField,
        payment_amount: row?.payment_amount,
      };

      try {
        const res = await axios.put(
          `${baseUrl}sales/finance_approval_payment_update/${row?._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          toastAlert("Status Approved Successfully");
        }
      } catch (error) {
        toastAlert("Status Approval Failed");
      } finally {
        getData();
        setStatus("");
        setIsFormSubmitted(true);
      }
    } else {
      setStatus(null);
    }
  };

  const handlePaymentModeData = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}sales/payment_mode`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setPaymentModeArray(data?.data);
    } catch (error) {
      console.error("Error while getting payment mode data", error);
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${baseUrl}sales/payment_update?status=pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const sortedData =
        data?.data?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ) || [];

      setData(sortedData);
      setFilterData(sortedData);
      calculateUniqueData(sortedData);

      // Non-GST count
      const nonGstCount = sortedData.filter(
        (item) => item.gst_status === "false"
      ).length;
      setNonGstCount(nonGstCount);

      // Invoice image counts
      const withInvoiceImage = sortedData.filter(
        (item) => item.payment_screenshot?.length > 0
      );
      const withoutInvoiceImage = sortedData.filter(
        (item) => !item.payment_screenshot?.length
      );

      setInvoiceCount(withInvoiceImage.length);
      setNonInvoiceCount(withoutInvoiceImage.length);

      // Apply date filter
      const dateFilteredData = CommonFilterFunction(sortedData, dateFilter);
      setFilterData(dateFilteredData);
    } catch (error) {
      console.error("Error fetching payment update data", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateUniqueData = (sortedData) => {
    const aggregateData = (data, keyName) => {
      return data.reduce((acc, curr) => {
        const key = curr[keyName];
        if (!acc[key]) {
          acc[key] = {
            ...curr,
            campaign_amount: 0,
            base_amount: 0,
            gst_amount: 0,
            payment_amount: 0,
            balance_amount: 0,
          };
        }
        acc[key].campaign_amount += curr.campaign_amount;
        acc[key].base_amount += curr.base_amount;
        acc[key].gst_amount += curr.gst_amount;
        acc[key].payment_amount += curr.payment_amount;
        acc[key].balance_amount += curr.campaign_amount - curr.payment_amount;

        return acc;
      }, {});
    };

    // Aggregate data by account name
    const uniqueCustomerData = Object.values(
      aggregateData(sortedData, "account_name")
    );
    setUniqueCustomerData(uniqueCustomerData);
    setUniqueCustomerCount(uniqueCustomerData.length);

    // Aggregate data by sales executive name
    const uniqueSalesExData = Object.values(
      aggregateData(sortedData, "created_by_name")
    );
    setUniqueSalesExecutiveData(uniqueSalesExData);
    setUniqueSalesExecutiveCount(uniqueSalesExData.length);
  };

  useEffect(() => {
    getData();
    handlePaymentModeData();
  }, [dateFilter]);

  // Optimized search filter with RegExp for case-insensitive matching
  useEffect(() => {
    if (!search) {
      setFilterData(datas);
      return;
    }
    const result = datas?.filter((d) =>
      new RegExp(search, "i").test(d?.sales_executive_name)
    );
    setFilterData(result);
  }, [search, datas]);

  // Open unique customer dialog
  const handleOpenUniqueAccountClick = () => setUniqueCustomerDialog(true);

  // Open unique sales executive dialog
  const handleOpenUniqueSalesExecutive = () =>
    setUniqueSalesExecutiveDialog(true);

  // Open filtered accounts by account name
  const handleOpenSameAccounts = (accName) => {
    const sameNameCustomers = datas?.filter(
      (item) => item?.account_name === accName
    );
    setFilterData(sameNameCustomers);
    setSameCustomerDialog(true);
    setUniqueCustomerDialog(false);
  };

  // Open filtered sales executives by name
  const handleOpenSameSalesExecutive = (salesEName) => {
    const sameNameSalesExecutive = datas?.filter(
      (item) => item?.created_by_name === salesEName
    );
    setFilterData(sameNameSalesExecutive);
    setUniqueSalesExecutiveDialog(false);
    setSameCustomerDialog(true);
  };

  // Clear filtered records
  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    setFilterData(datas);
  };

  // Function to calculate total requested amount and counts
  const calculateTotalsAndCounts = (data = []) => {
    return data.reduce(
      (totals, item) => {
        const paymentAmount = parseFloat(item.payment_amount) || 0;
        totals.requestedAmountTotal += paymentAmount;

        if (item.payment_approval_status === "pending") {
          totals.pendingCount += 1;
        }

        return totals;
      },
      { requestedAmountTotal: 0, pendingCount: 0 }
    );
  };

  const { requestedAmountTotal, pendingCount } =
    calculateTotalsAndCounts(filterData);

  const handleCloseStatusDialog = () => setStatusDialog(false);

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
