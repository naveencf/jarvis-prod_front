import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetLedgerAmountByVendorQuery,
  useGetLedgerQuery,
  useGetVendorAdvancedPaymentQuery,
  useGetVendorDetailQuery,
  useGetVendorPendingAuditedOutstandingQuery,
  useGetVendorsWithSearchQuery,
} from "../../Store/API/Purchase/DirectPurchaseApi";
import formatString from "../../../utils/formatString";
import axios from "axios";
import { phpBaseUrl } from "../../../utils/config";
import VendorStatementComponent from "./VendorStatementComponent";
import { AdvancedPaymentComponent } from "./AdvancedPaymentComponent";
import Loader from "../../Finance/Loader/Loader";
import DateISOtoNormal from "../../../utils/DateISOtoNormal";
import { formatIndianNumber } from "../../../utils/formatIndianNumber";
import { formatNumber } from "../../../utils/formatNumber";

const Ledger = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const getFinancialYears = () => {
    const currentYear = new Date().getFullYear();
    return [
      { label: `2023-2024`, value: `startDate=2023-04-01&endDate=2024-03-31` },
      { label: `2025-2026`, value: `startDate=2025-04-01&endDate=2026-03-31` },
      { label: `2021-2026`, value: `startDate=2021-04-01&endDate=2026-03-31` },
      {
        label: `${currentYear - 1}-${currentYear}`,
        value: `startDate=${currentYear - 1
          }-04-01&endDate=${currentYear}-03-31`,
      },
      {
        label: `${currentYear}-${currentYear + 1}`,
        value: `startDate=${currentYear}-04-01&endDate=${currentYear + 1
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
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(financialYears[1]?.value);
  const [selectedMonths, setSelectedMonths] = useState();
  const [vendorSearchQuery, setVendorSearchQuery] = useState("abh");
  const [selectedPaymentYear, setSelectedPaymentYear] = useState(
    financialYears[1]?.value
  );
  const [vendorPhpDetail, setVendorPhpDetail] = useState("");

  // const [filteredData, setFilterdData] = useState([]);
  const [dateRange, setDateRange] = useState(selectedYear);

  const {
    data: vendorsList,
    isLoading: isVendorLoading,
    isFetching: isVendorFetching,
  } = useGetVendorsWithSearchQuery(vendorSearchQuery);
  const {
    data: vendorData,
    isLoading: isVendorDataLoading,
    isFetching: isVendorDataFetching,
  } = useGetVendorPendingAuditedOutstandingQuery(id);
  const {
    data: vendorDetail,
    isLoading: isVendorDetailLoading,
    isFetching: isVendorDetailFetching,
  } = useGetVendorDetailQuery(id);
  const {
    data: ledgerAmountData,
    isLoading: isLedgerLoading,
    isFetching: isLedgerFetching,
  } = useGetLedgerAmountByVendorQuery(id);

  const [selectedVendor, setSelectedVendor] = useState(vendorDetail);

  const {
    data: ledgerData = [],
    isLoading,
    error,
    isFetching,
  } = useGetLedgerQuery({ id, query: dateRange });
  const {
    data: vendorAdvanced,
    isLoading: isVendorAdvanceLoading,
    isFetching: isVendorAdvancedDetailFetching,
  } = useGetVendorAdvancedPaymentQuery({
    id,
    query: selectedPaymentYear,
  });

  const handleVendorChange = (event, newValue) => {
    setSelectedVendor(newValue);
    if (newValue?._id !== undefined) {
      navigate(`/admin/purchase/ledger/${newValue?._id}`);
    }
    // setSelectedVendorId?.(newValue?._id); // Pass selected _id to parent
  };

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

  // Number(vendorPhpDetail[0]?.outstanding);
  // Number(vendorDetail?.totalAmount ?? 0)
  const actualOutstanding =
    Number(vendorDetail?.vendor_outstandings ?? 0) -
    Number(vendorDetail?.vendor_total_remaining_advance_amount ?? 0);

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

  useEffect(() => {
    if (vendorDetail) {
      setSelectedVendor(vendorDetail);
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
  let runningBalance =
    ledgerAmountData?.totalDebit - ledgerAmountData?.totalCredit;

  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "Trans_date",
      name: "Transaction Date",
      // renderRowCell: (row) => DateISOtoNormal(row?.Trans_date).trim(),
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
    {
      key: "campaign_name",
      name: "Campaign Name",
      width: 120,
      renderRowCell: (row) => formatString(row.campaign_name),
    },
    {
      key: "created_by_name",
      name: "Created By",
      width: 120,
      renderRowCell: (row) => formatString(row.created_by_name),
    },
    {
      key: "transaction_type_status",
      name: "Status",
      width: 100,
      renderRowCell: (row) => formatString(row.transaction_type_status),
    },
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
      renderRowCell: (row) => formatString(row?.advance_name),
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
      renderRowCell: (row) => formatString(row?.vendor_name),
      width: 150,
    },
    {
      key: "page_name",
      name: "Page Name",
      renderRowCell: (row) => formatString(row?.page_name),
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
  if (isVendorDetailLoading || isVendorDetailFetching || isLoading) {
    return <Loader />;
  }
  // console.log(vendorPhpDetail, "vendorPhpDetail");
  return (
    <div className="ledgerStatementDoc">
      <div className="tabs">
        <button
          className={activeTab === "Tab1" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab1")}
        >
          Ledger
        </button>
        <button
          className={activeTab === "Tab2" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab2")}
        >
          Advance Payment
        </button>
        <button
          className={activeTab === "Tab3" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab3")}
        >
          Sales Ledger
        </button>
      </div>
      <VendorStatementComponent
        activeTab={activeTab}
        vendorDetail={vendorDetail}
        ledgerData={ledgerData}
        selectedVendor={selectedVendor}
        handleVendorChange={handleVendorChange}
        vendorList={vendorsList}
        setVendorSearchQuery={setVendorSearchQuery}
        totalDebit={totalDebit}
        totalCredit={totalCredit}
        runningBalance={runningBalance}
        vendorData={vendorData}
        vendorPhpDetail={vendorPhpDetail}
        actualOutstanding={actualOutstanding}
        financialYears={financialYears}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        months={months}
        selectedMonths={selectedMonths}
        setSelectedMonths={setSelectedMonths}
        columns={columns}
        filteredData={filteredData}
        isLoading={isLoading}
        isFetching={isFetching}
        ledgerAmountData={ledgerAmountData}
      />

      <AdvancedPaymentComponent
        activeTab={activeTab}
        financialYears={financialYears}
        selectedPaymentYear={selectedPaymentYear}
        setSelectedPaymentYear={setSelectedPaymentYear}
        advancedPaymentColumns={advancedPaymentColumns}
        vendorAdvanced={vendorAdvanced}
        isLoading={isLoading}
      />
      {activeTab === "Tab3" && (
        <div>
          <div className="statementDocBody card-body p-3">
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
                    ₹ {formatNumber(Number(vendorPhpDetail[0]?.outstanding))}
                  </h6>
                </div>
              </div>
              <div className="col">
                <div className="card p16 shadow-none border-0 m0 bgInfoLight">
                  <h6 className="colorMedium">Total Remaining Advance</h6>
                  <h6 className="mt8 fs_16">
                    ₹{" "}
                    {formatIndianNumber(
                      vendorDetail?.vendor_total_remaining_advance_amount
                    )}
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
        </div>
      )}
    </div>
  );
};

export default Ledger;
