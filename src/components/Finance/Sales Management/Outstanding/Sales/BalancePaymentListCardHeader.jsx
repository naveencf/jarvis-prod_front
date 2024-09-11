import React, { useEffect, useState } from "react";
import FormattedNumberWithTooltip from "../../../FormateNumWithTooltip/FormattedNumberWithTooltip";

function BalancePaymentListHeader({ filterData }) {
  const [headerCardArray, setHeaderCardArray] = useState({});

  useEffect(() => {
    if (filterData?.length > 0) {
      const results = calculateAmounts(filterData);
      setHeaderCardArray(results);
    }
  }, [filterData]);

  const calculateAmounts = (data) => {
    const calculateTotalAmount = (key) =>
      data.reduce((total, item) => total + parseFloat(item[key] || 0), 0);

    const calculateBalanceAmount = (condition) =>
      data
        .filter(condition)
        .reduce(
          (total, item) =>
            total +
            (parseFloat(item.campaign_amount || 0) -
              parseFloat(item.paid_amount || 0)),
          0
        );

    const filterDataByCondition = (condition) => data.filter(condition);

    // GST counts
    const gstCounts = filterDataByCondition((item) => item.gst_status);
    const totalGstBalanceAmount = calculateBalanceAmount(
      (item) => item.gst_status
    );
    const totalGstReceivedAmount = calculateTotalAmount("paid_amount");

    // Non-GST counts
    const nonGstCounts = filterDataByCondition((item) => !item.gst_status);
    const totalNonGstBalanceAmount = calculateBalanceAmount(
      (item) => !item.gst_status
    );
    const totalNonGstReceivedAmount = calculateTotalAmount("paid_amount");

    // Invoice counts
    const invoiceCounts = filterDataByCondition(
      (item) =>
        item.invoice_type_id === "tax-invoice" &&
        item.invoice_creation_status !== "pending"
    );
    const totalInvoiceBalanceAmount = calculateBalanceAmount(
      (item) =>
        item.invoice_type_id === "tax-invoice" &&
        item.invoice_creation_status !== "pending"
    );
    const totalInvoiceReceivedAmount = calculateTotalAmount("paid_amount");

    // Non-invoice counts
    const nonInvoiceCounts = filterDataByCondition(
      (item) =>
        item.invoice_type_id !== "tax-invoice" ||
        item.invoice_creation_status === "pending"
    );
    const totalNonInvoiceBalanceAmount = calculateBalanceAmount(
      (item) =>
        item.invoice_type_id !== "tax-invoice" ||
        item.invoice_creation_status === "pending"
    );
    const totalNonInvoiceReceivedAmount = calculateTotalAmount("paid_amount");

    return {
      gstCounts: gstCounts.length,
      nonGstCounts: nonGstCounts.length,
      invoiceCounts: invoiceCounts.length,
      nonInvoiceCounts: nonInvoiceCounts.length,
      totalGstBalanceAmount,
      totalGstReceivedAmount,
      totalNonGstBalanceAmount,
      totalNonGstReceivedAmount,
      totalInvoiceBalanceAmount,
      totalInvoiceReceivedAmount,
      totalNonInvoiceBalanceAmount,
      totalNonInvoiceReceivedAmount,
    };
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title w-100 flexCenterBetween">
              Invoice Created
            </h5>
          </div>
          <div className="card-body flex-row sb">
            <div>
              <h5 className="mediumText">Invoice Count</h5>
              <h4
                className="font-weight-bold mt8"
                style={{ color: "var(--orange)" }}
              >
                {headerCardArray.invoiceCounts}
              </h4>
            </div>
            <div>
              <h5 className="mediumText">Total Balance Amount</h5>
              <h4
                className="font-weight-bold mt8"
                style={{ color: "var(--yellow)" }}
              >
                ₹{" "}
                <FormattedNumberWithTooltip
                  value={headerCardArray.totalInvoiceBalanceAmount}
                />
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title w-100 flexCenterBetween">
              Non Invoice Created
            </h5>
          </div>
          <div className="card-body flex-row sb">
            <div>
              <h5 className="mediumText">Non Invoice Count</h5>
              <h4
                className="font-weight-bold mt8"
                style={{ color: "var(--orange)" }}
              >
                {headerCardArray.nonInvoiceCounts}
              </h4>
            </div>
            <div>
              <h5 className="mediumText">Total Balance Amount</h5>
              <h4
                className="font-weight-bold mt8"
                style={{ color: "var(--yellow)" }}
              >
                ₹{" "}
                <FormattedNumberWithTooltip
                  value={headerCardArray.totalNonInvoiceBalanceAmount}
                />
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title w-100 flexCenterBetween">GST</h5>
          </div>
          <div className="card-body flex-row sb">
            <div>
              <h5 className="mediumText">GST Count</h5>
              <h4
                className="font-weight-bold mt8"
                style={{ color: "var(--orange)" }}
              >
                {headerCardArray.gstCounts}
              </h4>
            </div>
            <div>
              <h5 className="mediumText">Total Balance Amount</h5>
              <h4
                className="font-weight-bold mt8"
                style={{ color: "var(--yellow)" }}
              >
                ₹{" "}
                <FormattedNumberWithTooltip
                  value={headerCardArray.totalGstBalanceAmount}
                />
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title w-100 flexCenterBetween">Non GST</h5>
          </div>
          <div className="card-body flex-row sb">
            <div>
              <h5 className="mediumText">Non GST Count</h5>
              <h4
                className="font-weight-bold mt8"
                style={{ color: "var(--orange)" }}
              >
                {headerCardArray.nonGstCounts}
              </h4>
            </div>
            <div>
              <h5 className="mediumText">Total Balance Amount</h5>
              <h4
                className="font-weight-bold mt8"
                style={{ color: "var(--yellow)" }}
              >
                ₹{" "}
                <FormattedNumberWithTooltip
                  value={headerCardArray.totalNonGstBalanceAmount}
                />
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BalancePaymentListHeader;
