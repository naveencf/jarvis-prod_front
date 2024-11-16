import { useEffect, useState } from "react";
import FormContainer from "../../../AdminPanel/FormContainer";
import { useGlobalContext } from "../../../../Context/Context";
import ImageView from "../../ImageView";
import PendingApprovalStatusDialog from "./Components/PendingApprovalStatusDialog";
import {
  pendingApprovalColumn,
  uniquePendingApprovalCustomerColumn,
  uniquePendingApprovalSalesExecutiveColumn,
} from "../../CommonColumn/Columns";
import PendingApprovalFilters from "./Components/PendingApprovalFilters";
import CommonDialogBox from "../../CommonDialog/CommonDialogBox";
import { CommonFilterFunction } from "../../CommonDialog/CommonFilterFunction";
import View from "../../../AdminPanel/Sales/Account/View/View";
import {
  useGetAllPaymentUpdatesPaymentStatusWiseQuery,
  useUpdatePaymentUpdateStatusMutation,
} from "../../../Store/API/Sales/PaymentUpdateApi";
import { useGetAllPaymentModesQuery } from "../../../Store/API/Sales/PaymentModeApi";

const PendingApprovalUpdate = () => {
  const {
    refetch: refetchPaymentUpdate,
    data: allPaymentUpdate,
    error: allPaymentUpdateError,
    isLoading: allPaymentUpdateLoading,
  } = useGetAllPaymentUpdatesPaymentStatusWiseQuery("pending");

  const {
    refetch: refetchPaymentMode,
    data: allPaymentMode = [],
    error: allPaymentModeError,
    isLoading: allPaymentModeLoading,
  } = useGetAllPaymentModesQuery();

  const [
    updatepaymentUpdateStatus,
    {
      isLoading: updatePaymentUpdatestatusLoading,
      isError: updatePaymentUpdateStatusError,
      isSuccess: updatePaymentUpdateStatusSuccess,
    },
  ] = useUpdatePaymentUpdateStatusMutation();

  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [status, setStatus] = useState("");
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [viewImgDialog, setViewImgDialog] = useState(false);
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [nonInvoiceCount, setNonInvoiceCount] = useState(0);
  const [nonGstCount, setNonGstCount] = useState(0);
  const [dateFilter, setDateFilter] = useState("");
  const [statusDialog, setStatusDialog] = useState(false);
  const [reasonField, setReasonField] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedData, setSelectedData] = useState([]);

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
        id: row?._id,
      };
      await updatepaymentUpdateStatus(payload).unwrap();

      toastAlert("Status Status Approved Successfully");
      refetchPaymentUpdate();
      setStatus("");
    } else {
      setStatus(null);
    }
  };
  const processData = () => {
    const sortedData =
      allPaymentUpdate
        ?.slice()
        ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

    const nonGstCount = sortedData?.filter(
      (item) => item?.gst_status === "false"
    )?.length;
    setNonGstCount(nonGstCount);

    const withInvoiceImage = sortedData?.filter(
      (item) => item?.payment_screenshot?.length > 0
    );
    const withoutInvoiceImage = sortedData?.filter(
      (item) => !item?.payment_screenshot?.length
    );

    setInvoiceCount(withInvoiceImage?.length);
    setNonInvoiceCount(withoutInvoiceImage?.length);

    const dateFilteredData = CommonFilterFunction(sortedData, dateFilter);
    setFilterData(dateFilteredData);
    calculateUniqueData(dateFilteredData);
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
    const uniqueCustomerData = Object?.values(
      aggregateData(sortedData, "account_name")
    );
    setUniqueCustomerData(uniqueCustomerData);
    setUniqueCustomerCount(uniqueCustomerData?.length);

    // Aggregate data by sales executive name
    const uniqueSalesExData = Object?.values(
      aggregateData(sortedData, "created_by_name")
    );
    setUniqueSalesExecutiveData(uniqueSalesExData);
    setUniqueSalesExecutiveCount(uniqueSalesExData?.length);
  };

  useEffect(() => {
    processData();
    refetchPaymentMode();
  }, [allPaymentUpdate, dateFilter]);

  useEffect(() => {
    if (!search) {
      setFilterData(allPaymentUpdate);
      return;
    }
    const result = allPaymentUpdate?.filter((d) =>
      new RegExp(search, "i").test(d?.sales_executive_name)
    );
    setFilterData(result);
  }, [search, allPaymentUpdate]);

  const handleOpenUniqueAccountClick = () => setUniqueCustomerDialog(true);

  const handleOpenUniqueSalesExecutive = () =>
    setUniqueSalesExecutiveDialog(true);

  const handleOpenSameAccounts = (accName) => {
    const sameNameCustomers = allPaymentUpdate?.filter(
      (item) => item?.account_name === accName
    );
    setFilterData(sameNameCustomers);
    setUniqueCustomerDialog(false);
  };

  const handleOpenSameSalesExecutive = (salesEName) => {
    const sameNameSalesExecutive = allPaymentUpdate?.filter(
      (item) => item?.created_by_name === salesEName
    );
    setFilterData(sameNameSalesExecutive);
    setUniqueSalesExecutiveDialog(false);
  };

  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    setFilterData(allPaymentUpdate);
  };

  const calculateTotalsAndCounts = (data = []) => {
    return data?.reduce(
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
        getData={refetchPaymentUpdate}
        status={status}
        setStatus={setStatus}
      />
      <PendingApprovalFilters
        datas={allPaymentUpdate}
        setFilterData={setFilterData}
        setUniqueCustomerCount={setUniqueCustomerCount}
        setUniqueCustomerData={setUniqueCustomerData}
        paymentModeArray={allPaymentMode}
        setDateFilter={setDateFilter}
        dateFilter={dateFilter}
      />
      <div>
        <View
          columns={pendingApprovalColumn({
            filterData,
            handleCopyDetail,
            allPaymentMode,
            handleStatusChange,
            setViewImgSrc,
            setViewImgDialog,
          })}
          data={filterData}
          isLoading={allPaymentUpdateLoading}
          title={"Pending Approval"}
          rowSelectable={true}
          showTotal={true}
          pagination={[100, 200]}
          tableName={"payment_update"}
          selectedData={setSelectedData}
          addHtml={
            <>
              <button
                className="btn cmnbtn btn_sm btn-secondary"
                onClick={(e) => handleClearSameRecordFilter(e)}
              >
                Clear
              </button>
            </>
          }
        />
        {viewImgDialog && (
          <ImageView
            viewImgSrc={viewImgSrc}
            setViewImgDialog={setViewImgDialog}
          />
        )}
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
