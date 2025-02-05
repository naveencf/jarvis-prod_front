import React from "react";
import { useGetAllSaleBookingQuery } from "../../../Store/API/Sales/SaleBookingApi";
import jwtDecode from "jwt-decode";
import View from "../Account/View/View";
import formatString from "../../../../utils/formatString";

const EarnIncentive = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const {
    data: allSaleBooking,
    refetch: refetchSaleBooking,
    error: allSalebBookingError,
    isLoading: allSaleBookingLoading,
  } = useGetAllSaleBookingQuery({ loginUserId });

  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 50,
    },
    {
      key: "campaign_name",
      name: "Campaign Name",
      renderRowCell: (row) => formatString(row?.campaign_name),
      showCol: true,
      width: 100,
    },

    {
      key: "incentive_percent",
      name: "Incentive Percent",
      renderRowCell: (row) =>
        ((row.incentive_amount / row?.base_amount) * 100).toFixed(0),
      showCol: true,
      width: 100,
      compare: true,
    },
    {
      key: "earned_incentive_amount",
      name: "Earned Incentive",
      renderRowCell: (row) => row.earned_incentive_amount,
      compare: true,
      showCol: true,
      width: 100,
      getTotal: true,
    },
  ];

  return (
    <>
      <View
        version={1}
        columns={columns}
        data={allSaleBooking?.filter(
          (item) => item?.incentive_earning_status == "earned"
        )}
        title={"User Request"}
        pagination={[100, 200]}
        tableName={"User_request"}
        showTotal={true}
      />
    </>
  );
};

export default EarnIncentive;
