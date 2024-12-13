import React from "react";
import { useGetUserWieOutStandingQuery } from "../../Store/API/Finance/OutstandingNew";
import View from "./Account/View/View";
import { showText } from "pdf-lib";
import { formatNumber } from "../../../utils/formatNumber";

const OutstandingComp = () => {
  const {
    data: userWieOutStanding,
    error: userWieOutStandingError,
    isLoading: userWieOutStandingLoading,
  } = useGetUserWieOutStandingQuery();

  const Column = [
    {
      key: "S.no",
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
      width: 100,
    },
    {
      key: "sales_executive_name",
      name: "Sales Executive Name",
      width: 200,
    },
    {
      key: "totalOutstandingAmount",
      name: "Total Outstanding",
      width: 200,
      getTotal: true,
    },
    {
      key: "totalSaleBookingCounts",
      name: "Sale Booking Counts",
      width: 200,
    },
    {
      key: "totalUnEarnedOutstandingAmount",
      name: "TDS Outstanding",
      width: 200,
      getTotal: true,
      renderRowCell: (row) => (row?.totalOutstandingAmount - row?.totalUnEarnedOutstandingAmount)?.toFixed(),
    },
    {
      key: "totalUnEarnedWithInvoiceUploadedOutstandingAmount",
      name: "Billed Outstanding",
      width: 200,
      getTotal: true,
    },
    {
      key: "totalUnEarnedCampaignAmount",
      name: "Un-Billed Outstanding",
      width: 200,
      getTotal: true,
      renderRowCell: (row) => (row?.totalUnEarnedOutstandingAmount - row?.totalUnEarnedWithInvoiceUploadedOutstandingAmount)?.toFixed(),
    },
  ];
  return (
    <View
      version={1}
      title={"User Wise Outstanding"}
      data={userWieOutStanding}
      isLoading={userWieOutStandingLoading}
      tableName={"sales_dashboard_userwise_Outstanding"}
      columns={Column}
      showTotal={true}
      pagination
    />
  );
};

export default OutstandingComp;
