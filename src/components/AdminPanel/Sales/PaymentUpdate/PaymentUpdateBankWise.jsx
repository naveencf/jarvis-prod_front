import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import { useParams } from "react-router-dom";
import View from "../Account/View/View";
import { useGetAllPaymentUpdatesPaymentDetailWiseQuery } from "../../../Store/API/Sales/PaymentUpdateApi";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";

const PaymentUpdateBankWise = () => {
  const { id } = useParams();

  const {
    data: allPaymentDetailsData,
    refetch: refetchPaymentDetails,
    isError: paymentDetailsError,
    isLoading: paymentDetailsLoading,
  } = useGetAllPaymentUpdatesPaymentDetailWiseQuery(id);

  const columns = [
    {
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
      width: 50,
    },
    {
      key: "account_name",
      width: 100,
      name: "Account Name",
    },
    {
      key: "created_by_name",
      width: 100,
      name: "Created By",
    },
    {
      key: "payment_ref_no",
      width: 100,
      name: "Payment Refrence Number",
    },
    {
      key: "payment_approval_status",
      width: 100,
      name: "Payment Approval Status",
    },
    {
      key: "createdAt",
      width: 100,
      name: "Created At",
      renderRowCell: (row) => DateISOtoNormal(row?.createdAt),
    },
    {
      key: "updatedAt",
      width: 100,
      name: "Updated At",
      renderRowCell: (row) => DateISOtoNormal(row?.updatedAt),
    },
    {
      key: "sale_booking_date",
      width: 100,
      name: "Sale Booking Date",
      renderRowCell: (row) => DateISOtoNormal(row?.sale_booking_date),
    },
    {
      key: "campaign_amount",
      width: 100,
      name: "Campaign Amount",
    },
    {
      key: "base_amount",
      width: 100,
      name: "Base Amount",
    },
    {
      key: "gst_status",
      width: 100,
      name: "GST Status",
    },
    {
      key: "balance_payment_ondate",
      width: 100,
      name: "Balance Payment Ondate",
    },
    {
      key: "title",
      width: 100,
      name: "Payment Title",
    },
    {
      key: "details",
      width: 100,
      name: "Details",
      renderRowCell: (row) =>
        row?.payment_detail?.details?.split("\n").map((line, index) => (
          <div key={index}>
            {line}
            <br />
          </div>
        )),
    },

    {
      key: "payment_mode_name",
      width: 100,
      name: "Payment Mode",
    },
    {
      key: "gst_bank",
      width: 100,
      name: "GST Bank",
      renderRowCell: (row) => (row.gst_bank ? "GST" : "Non GST"),
      compare: true,
    },
  ];

  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Payment Update Logs"
            link="/admin/sales/create-payment-details"
            // buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>
      <div className="page_height">
        <View
          title={"Details"}
          columns={columns}
          data={allPaymentDetailsData}
          pagination={[100]}
          isLoading={paymentDetailsLoading}
          tableName={"PaymentUpdateBankWise"}
          //   rowSelectable={true}
        />
      </div>
    </>
  );
};

export default PaymentUpdateBankWise;
