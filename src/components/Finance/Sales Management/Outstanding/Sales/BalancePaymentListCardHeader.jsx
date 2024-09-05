import React, { useEffect, useState } from "react";
import FormattedNumberWithTooltip from "../../../FormateNumWithTooltip/FormattedNumberWithTooltip";

function BalancePaymentListHeader({ filterData }) {
  const [headerCardArray, setHeaderCardArray] = useState([]);

  useEffect(() => {
    if (filterData.length > 0) {
      const results = calculateAmounts(filterData);
      setHeaderCardArray(results);
    }
  }, [filterData]);

  const calculateAmounts = (data) => {
    const calculateTotalAmount = (data, key) =>
      data.reduce((total, item) => total + parseFloat(item[key]) || 0, 0);

    const calculateBalanceAmount = (data) =>
      data.reduce(
        (total, item) =>
          total + parseFloat(item?.campaign_amount - item?.paid_amount) || 0,
        0
      );

    const filterDataByCondition = (data, condition) => data.filter(condition);

    // GST counts
    const gstCounts = filterDataByCondition(
      data,
      (count) => count.gst_status === true
    );
    const totalGstBalanceAmount = calculateBalanceAmount(gstCounts);
    const totalGstReceivedAmount = calculateTotalAmount(
      gstCounts,
      "paid_amount"
    );

    // Non-GST counts
    const nonGstCounts = filterDataByCondition(
      data,
      (count) => count.gst_status === false
    );
    const totalNonGstBalanceAmount = calculateBalanceAmount(nonGstCounts);
    const totalNonGstReceivedAmount = calculateTotalAmount(
      nonGstCounts,
      "paid_amount"
    );

    // Invoice counts
    const invoiceCounts = filterDataByCondition(
      data,
      (invc) =>
        invc?.salesInvoiceRequestData?.[0]?.invoice_file !== "" &&
        invc?.salesInvoiceRequestData?.[0]?.invoice_type_id === "tax-invoice"
    );
    const totalInvoiceBalanceAmount = calculateBalanceAmount(invoiceCounts);
    const totalInvoiceReceivedAmount = calculateTotalAmount(
      invoiceCounts,
      "paid_amount"
    );

    // Non-invoice counts
    const nonInvoiceCounts = filterDataByCondition(
      data,
      (invc) =>
        invc?.salesInvoiceRequestData?.[0]?.invoice_file === "" ||
        invc?.salesInvoiceRequestData?.[0]?.invoice_type_id !== "tax-invoice"
    );
    const totalNonInvoiceBalanceAmount =
      calculateBalanceAmount(nonInvoiceCounts);
    const totalNonInvoiceReceivedAmount = calculateTotalAmount(
      nonInvoiceCounts,
      "paid_amount"
    );

    return {
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
                {headerCardArray?.invoiceCounts?.length}
              </h4>
            </div>
            <div>
              <h5 className="mediumText"> Total Balance Amount</h5>
              <h4
                className="font-weight-bold mt8"
                style={{ color: "var(--yellow)" }}
              >
                ₹{" "}
                <FormattedNumberWithTooltip
                  value={headerCardArray?.totalInvoiceBalanceAmount}
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
                {headerCardArray?.nonInvoiceCounts?.length}
              </h4>
            </div>
            <div>
              <h5 className="mediumText">Total Balance Amount</h5>
              <h4
                className="font-weight-bold mt8"
                style={{ color: "var(--yellow)" }}
              >
                ₹
                <FormattedNumberWithTooltip
                  value={headerCardArray?.totalNonInvoiceBalanceAmount}
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
                {headerCardArray?.gstCounts?.length}
              </h4>
            </div>

            <div>
              <h5 className="mediumText">Total Balance Amount</h5>
              <h4
                className="font-weight-bold mt8"
                style={{ color: "var(--yellow)" }}
              >
                {" "}
                ₹{" "}
                <FormattedNumberWithTooltip
                  value={headerCardArray?.totalGstBalanceAmount}
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
                {headerCardArray?.nonGstCounts?.length}
              </h4>
            </div>
            <div>
              <h5 className="mediumText"> Total Balance Amount</h5>
              <h4
                className="font-weight-bold mt8"
                style={{ color: "var(--bs-yellow)" }}
              >
                ₹{" "}
                <FormattedNumberWithTooltip
                  value={headerCardArray?.totalNonGstBalanceAmount}
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
