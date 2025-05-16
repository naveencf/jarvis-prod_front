import React from "react";
import { useParams } from "react-router-dom";
import View from "../../../AdminPanel/Sales/Account/View/View";
import { useGetVendorStatementQuery } from "../../../Store/API/Sales/PaymentDetailsApi";
import { formatDate } from "../../../../utils/formatDate";
import formatString from "../../../../utils/formatString";

const VendorStatementView = () => {
  const { id } = useParams();

  const {
    data: vendorStatementData,
    isLoading,
    isFetching,
  } = useGetVendorStatementQuery(id);

  let runningBalance =
    vendorStatementData?.payment_amount - vendorStatementData?.invoice_amount;

  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "invoice_date",
      name: "Invoice Date",
      renderRowCell: (row) =>
        new Date(row?.invoice_date).toLocaleString().split(",")[0],
      width: 120,
    },
    {
      key: "invoice_type_id",
      name: "Invoice Type",
      width: 120,
      renderRowCell: (row) => row.invoice_type_id,
    },
    {
      key: "payment_approval_status",
      name: "Status",
      width: 100,
      renderRowCell: (row) => formatString(row.payment_approval_status),
    },
    {
      key: "invoice_amount",
      name: "Invoice Amount",
      renderRowCell: (row) => (Number(row.invoice_amount) || 0).toFixed(2),
      width: 80,
      getTotal: true,
    },
    {
      key: "payment_amount",
      name: "Payment Amount",
      renderRowCell: (row) => (Number(row.payment_amount) || 0).toFixed(2),
      width: 80,
      getTotal: true,
    },
    {
      key: "balance",
      name: "Balance",
      renderRowCell: (row, index) => {
        if (index === 0)
          runningBalance =
            Number(row.invoice_amount) - (Number(row.payment_amount) || 0);
        else
          runningBalance +=
            (Number(row.invoice_amount) || 0) -
            (Number(row.payment_amount) || 0);
        return runningBalance.toFixed(2);
      },
      width: 100,
    },
  ];

  return (
    <>
      <div className="table-responsive noCardHeader">
        <View
          title={"Statement"}
          columns={columns}
          showTotal={true}
          data={vendorStatementData}
          isLoading={isLoading || isFetching}
          tableName={"StatementUserwise"}
          pagination={[100, 200, 1000]}
        />
      </div>
    </>
  );
};

export default VendorStatementView;
