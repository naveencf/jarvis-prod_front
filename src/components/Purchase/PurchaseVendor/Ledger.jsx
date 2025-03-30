import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Avatar } from "@mui/material";
import {
  useGetLedgerQuery,
  useGetVendorAdvancedPaymentQuery,
  useGetVendorDetailQuery,
  useGetVendorPendingAuditedOutstandingQuery,
} from "../../Store/API/Purchase/DirectPurchaseApi";
import View from "../../AdminPanel/Sales/Account/View/View";
import CustomSelect from "../../ReusableComponents/CustomSelect";
import formatString from "../../../utils/formatString";
import { FilterDrama } from "@mui/icons-material";
import { formatDateTime } from "../../../utils/formatDateTime";
import axios from "axios";
import { phpBaseUrl } from "../../../utils/config";

const Ledger = () => {
  const { id } = useParams();
  const getFinancialYears = () => {
    const currentYear = new Date().getFullYear();
    return [
      { label: `2023-2024`, value: `startDate=2023-04-01&endDate=2024-03-31` },
      {
        label: `${currentYear - 1}-${currentYear}`,
        value: `startDate=${
          currentYear - 1
        }-04-01&endDate=${currentYear}-03-31`,
      },
      {
        label: `${currentYear}-${currentYear + 1}`,
        value: `startDate=${currentYear}-04-01&endDate=${
          currentYear + 1
        }-03-31`,
      },
    ];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const months = [
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
  ];
  const [activeTab, setActiveTab] = useState("Tab1");
  const [financialYears] = useState(getFinancialYears());
  const [selectedYear, setSelectedYear] = useState(financialYears[1]?.value);
  const [selectedMonths, setSelectedMonths] = useState();
  const [selectedPaymentYear, setSelectedPaymentYear] = useState(
    financialYears[1]?.value
  );
  const [vendorPhpDetail, setVendorPhpDetail] = useState("");

  // const [filteredData, setFilterdData] = useState([]);
  const [dateRange, setDateRange] = useState(selectedYear);
  const {
    data: ledgerData = [],
    isLoading,
    error,
  } = useGetLedgerQuery({ id, query: dateRange });
  const { data: vendorAdvanced } = useGetVendorAdvancedPaymentQuery({
    id,
    query: selectedPaymentYear,
  });
  const { data: vendorData } = useGetVendorPendingAuditedOutstandingQuery(id);
  const { data: vendorDetail } = useGetVendorDetailQuery(id);

  const filteredData = useMemo(() => {
    if (selectedMonths?.length) {
      return ledgerData.filter((item) => {
        const transactionMonth = item?.Trans_date?.split("-")?.[1];
        return (
          transactionMonth &&
          selectedMonths?.includes(transactionMonth) &&
          !item?.is_deleted
        );
      });
    }
    return ledgerData;
  }, [selectedMonths, ledgerData]);

  useEffect(() => {
    setDateRange(selectedYear);
  }, [selectedYear]);
  const actualOutstanding =
    Number(vendorDetail?.totalAmount ?? 0) +
    Number(vendorDetail?.vendor_outstandings ?? 0) -
    Number(vendorDetail?.vendor_total_remaining_advance_amount ?? 0) +
    Number(vendorPhpDetail[0]?.outstanding);
  useEffect(() => {
    if (vendorDetail?.vendor_id) {
      axios
        .post(phpBaseUrl + `?view=getvendorDataListvid`, {
          vendor_id: vendorDetail?.vendor_id,
        })
        .then((res) => {
          if (res.status == 200) {
            setVendorPhpDetail(res.data.body);
            // console.log(res.data.body, 'vendorDetail', vendorDetail);
          }
        });
    }
  }, [vendorDetail]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading ledger data.</p>;

  const totalDebit = ledgerData.reduce(
    (sum, { Debit_amt }) => sum + (Number(Debit_amt) || 0),
    0
  );
  const totalCredit = ledgerData.reduce(
    (sum, { Credit_amt }) => sum + (Number(Credit_amt) || 0),
    0
  );
  let runningBalance = totalDebit - totalCredit;

  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "transaction_date",
      name: "Transaction Date",
      renderRowCell: (row) => formatDate(row?.Trans_date),
      width: 120,
    },
    {
      key: "createdAt",
      name: "Created Date",
      renderRowCell: (row) => formatDate(row?.createdAt),
      width: 120,
    },
    {
      key: "Narration",
      name: "Narration",
      // renderRowCell: (row) => row?.no_of_post,
      width: 150,
    },
    { key: "campaign_name", name: "Campaign Name", width: 120 },
    { key: "created_by_name", name: "Created By", width: 120 },
    { key: "transaction_type_status", name: "Status", width: 100 },
    {
      key: "Credit_amt",
      name: "Credit",
      renderRowCell: (row) => (Number(row.Credit_amt) || 0).toFixed(2),
      width: 80,
      getTotal: true,
    },
    {
      key: "Debit_amt",
      name: "Debit",
      renderRowCell: (row) => (Number(row.Debit_amt) || 0).toFixed(2),
      width: 80,
      getTotal: true,
    },
    {
      key: "balance",
      name: "Balance",
      renderRowCell: (row, index) => {
        if (index === 0)
          runningBalance =
            Number(row.Credit_amt) - (Number(row.Debit_amt) || 0);
        else
          runningBalance +=
            (Number(row.Credit_amt) || 0) - (Number(row.Debit_amt) || 0);
        return runningBalance.toFixed(2);
      },
      width: 100,
    },
  ];

  const advancedPaymentColumns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "advance_name",
      name: "Advance Name",
      renderRowCell: (row) => row?.advance_name,
      width: 120,
    },
    {
      key: "advance_amount",
      name: "Advance Amount",
      renderRowCell: (row) => row?.advance_amount,
      width: 120,
    },
    {
      key: "remaining_advance_amount",
      name: "Remaining Advance Amount",
      renderRowCell: (row) => row?.remaining_advance_amount,
      width: 150,
    },
    {
      key: "no_of_post",
      name: "Number of Posts",
      renderRowCell: (row) => row?.no_of_post,
      width: 150,
    },

    {
      key: "vendor_name",
      name: "Vendor Name",
      renderRowCell: (row) => row?.vendor_name,
      width: 150,
    },
    {
      key: "page_name",
      name: "Page Name",
      renderRowCell: (row) => row?.page_name,
      width: 150,
    },
    {
      key: "advanced_payment_status",
      name: "Payment Status",
      renderRowCell: (row) => row?.advanced_payment_status,
      width: 150,
    },
    {
      key: "is_upfront",
      name: "Is Upfront",
      renderRowCell: (row) => (row?.is_upfront ? "Yes" : "No"),
      width: 100,
    },
    {
      key: "status",
      name: "Status",
      renderRowCell: (row) => (row?.status === 0 ? "Inactive" : "Active"),
      width: 100,
    },
    {
      key: "createdAt",
      name: "Created At",
      renderRowCell: (row) => new Date(row?.createdAt).toLocaleString(),
      width: 150,
    },
    {
      key: "updatedAt",
      name: "Updated At",
      renderRowCell: (row) => new Date(row?.updatedAt).toLocaleString(),
      width: 150,
    },
    {
      key: "balance",
      name: "Balance",
      renderRowCell: (row, index) => {
        if (index === 0)
          runningBalance = 0 - (Number(row?.remaining_advance_amount) || 0);
        else
          runningBalance +=
            (Number(row?.advance_amount) || 0) -
            (Number(row?.remaining_advance_amount) || 0);
        return runningBalance.toFixed(2);
      },
      width: 100,
    },
  ];

  return (
    <div className="ledgerStatementDoc">
      <div className="tabs">
        <button
          className={activeTab === "Tab1" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab1")}
        >
          Overview
        </button>
        <button
          className={activeTab === "Tab2" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab2")}
        >
          Advance Payment
        </button>
      </div>

      {activeTab === "Tab1" && (
        <div className="statementDoc">
          <div className="statementDocHeader">
            <div className="vendorBox">
              <div className="vendorImg">
                <Avatar
                  alt="Vendor"
                  src={ledgerData[0]?.vendor_image || "vendor.jpg"}
                />
              </div>
              <div className="vendorTitle">
                <h2>
                  {formatString(vendorDetail?.vendor_name) || "Vendor Name"}
                </h2>
                <h4>
                  Vendor Category: {formatString(vendorDetail?.vendor_category)}
                </h4>
                {vendorDetail?.recent_purchase_date && (
                  <h4>
                    Purchase Date :{" "}
                    {formatDateTime(vendorDetail?.recent_purchase_date)}
                  </h4>
                )}
              </div>
            </div>
            <div className="stats">
              <div className="statsBox">
                <h4>Total Debited Amount</h4>
                <h2>₹ {totalDebit?.toLocaleString()}</h2>
              </div>
              <div className="statsBox">
                <h4>Total Credit Amount</h4>
                <h2>₹ {totalCredit?.toLocaleString()}</h2>
              </div>
              <div className="statsBox">
                <h4>Balance Amount</h4>
                <h2>₹ {runningBalance?.toLocaleString()}</h2>
              </div>
            </div>
          </div>
          <div className="statementDocBody card-body">
            <div className="p16">
              <div className="row">
                <div className="col">
                  <div className="card p16 shadow-none border-0 m0 bgPrimaryLight">
                    <h6 className="colorMedium">Audit Pending</h6>
                    <h6 className="mt8 fs_16">
                      ₹ {vendorData?.totalAmount?.toLocaleString()}
                    </h6>
                  </div>
                </div>
                <div className="col">
                  <div className="card p16 shadow-none border-0 m0 bgSecondaryLight">
                    <h6 className="colorMedium">Outstanding:</h6>
                    <h6 className="mt8 fs_16">
                      ₹ {vendorDetail?.vendor_outstandings?.toLocaleString()}
                    </h6>
                  </div>
                </div>
                <div className="col">
                  <div
                    className="card p16 shadow-none border-0 m0"
                    style={{ backgroundColor: "lightsteelblue" }}
                  >
                    <h6 className="colorMedium">Php Outstanding:</h6>
                    <h6 className="mt8 fs_16">
                      ₹{" "}
                      {Number(
                        vendorPhpDetail[0]?.outstanding
                      )?.toLocaleString()}
                    </h6>
                  </div>
                </div>
                <div className="col">
                  <div className="card p16 shadow-none border-0 m0 bgInfoLight">
                    <h6 className="colorMedium">Total Remaining Advance</h6>
                    <h6 className="mt8 fs_16">
                      ₹{" "}
                      {vendorDetail?.vendor_total_remaining_advance_amount?.toLocaleString()}
                    </h6>
                  </div>
                </div>
                <div className="col">
                  <div className="card p16 shadow-none border-0 m0 bgDangerLight">
                    <h6 className="colorMedium">Actual Outstanding</h6>
                    <h6 className="mt8 fs_16">
                      ₹{actualOutstanding?.toLocaleString()}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="pl8 pr8">
              <div className="row">
                <div className="col-md-6 col-12">
                  <CustomSelect
                    fieldGrid={12}
                    label="Financial Year"
                    dataArray={financialYears}
                    optionId="value"
                    optionLabel="label"
                    selectedId={selectedYear}
                    setSelectedId={setSelectedYear}
                  />
                </div>
                <div className="col-md-6 col-12">
                  <CustomSelect
                    fieldGrid={12}
                    label="Months"
                    dataArray={months}
                    optionId="value"
                    optionLabel="label"
                    selectedId={selectedMonths}
                    setSelectedId={setSelectedMonths}
                    multiple
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive noCardHeader">
              <View
                columns={columns}
                showTotal={true}
                data={filteredData}
                isLoading={isLoading}
                tableName={"Op_executions"}
                pagination={[100, 200, 1000]}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "Tab2" && (
        <div className="card noCardHeader">
          <div className="card-body p0">
            <div className="pl8 pr8 pt8">
              <div className="row">
                <div className="col-md-6 col-12">
                  <CustomSelect
                    fieldGrid={12}
                    label="Advanced Payment Year"
                    dataArray={financialYears}
                    optionId="value"
                    optionLabel="label"
                    selectedId={selectedPaymentYear}
                    setSelectedId={setSelectedPaymentYear}
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <View
                columns={advancedPaymentColumns}
                data={vendorAdvanced}
                isLoading={isLoading}
                tableName={"Op_executions"}
                pagination={[100, 200, 1000]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ledger;
