import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import View from "../Account/View/View";
import { useLocation } from "react-router-dom";
import { get } from "jquery";
import { baseUrl } from "../../../../utils/config";
import axios from "axios";
import { render } from "@react-pdf/renderer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";

const EarnedAndUnearned = () => {
  const userData = useLocation().state;

  const [earnedAndUnearnedData, setEarnedAndUnearnedData] = useState([]);
  const [isEarnedAndUnearnedDataLoading, setIsEarnedAndUnearnedDataLoading] =
    useState(false);
  function extractMonthNumber(dateString) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = dateString.split(" ")[0];
    return monthNames.indexOf(month) + 1;
  }

  function extractYear(dateString) {
    return parseInt(dateString.split(" ")[1]);
  }
  async function getEarnedAndUnearnedData() {
    setIsEarnedAndUnearnedDataLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}sales/incentive_calculation_status_wise_data/${userData.id
        }?incentive_earning_status=${userData.status}${userData.flag === 0
          ? `&year=${extractYear(userData.month)}&month=${extractMonthNumber(
            userData.month
          )}`
          : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      const uniqueData = response.data.data.dataArray.filter((item, index, self) =>
        index === self.findIndex(obj => obj.sale_booking_id === item.sale_booking_id)
      );

      setEarnedAndUnearnedData(uniqueData);

      // setEarnedAndUnearnedData(response.data.data.dataArray);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEarnedAndUnearnedDataLoading(false);
    }
  }
  useEffect(() => {
    getEarnedAndUnearnedData();
  }, []);
  const columns = [
    {
      key: "s.no",
      name: "S.No",
      width: 50,
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "account_name",
      name: "Account Name",
      width: 100,
    },
    {
      key: "sale_executive_name",
      name: "Sale Executive Name",
      width: 100,
    },
    {
      key: "campaign_amount",
      name: "Campaign Amount",
      getTotal: true,

      width: 100,
    },
    {
      key: "gst_status",
      name: "GST Status",
      width: 100,
      compare: true,
      renderRowCell: (row) => (row.gst_status ? "GST" : "No-GST"),
    },
    {
      key: "incentive_amount",
      name: "Incentive Amount",
      getTotal: true,

      width: 100,
    },
    // {
    //   key: "earned_incentive_amount",
    //   name: "Earn Incentive",
    //   getTotal: true,

    //   width: 100,
    // },
    {
      key: "incentive_earning_status",
      name: "Incentive Earning Status",
      width: 100,
      renderRowCell: (row) =>
        row.incentive_earning_status === "earned" ? "Earned" : "Unearned",
    },
    {
      key: "incentive_percentage",
      name: "Incentive Percentage",
      width: 100,
      compare: true,
      // renderRowCell: (row) => ((row.earned_incentive_amount / (row.campaign_amount / 1.18)) * 100).toFixed(2),
      renderRowCell: (row) => {

        const percentage = (row.earned_incentive_amount / row.base_amount) * 100;
        return percentage.toFixed(2);
      }

    },
    // {
    //   key: "paid_amount",
    //   name: "Paid Amount",
    //   getTotal: true,

    //   width: 100,
    // },
    {
      key: "sale_booking_id",
      name: "Booking",
      width: 100,
      // renderRowCell: (row) => row.sale_booking_id,
    },
    {
      key: "base_amount",
      name: "Base Amount",
      getTotal: true,
      // renderRowCell: (row) => row.base_amount,
      width: 100,
    },
    {
      key: "sale_booking_date",
      name: "Sale Booking Date",
      width: 100,
      compare: true,
      renderRowCell: (row) => DateISOtoNormal(row.sale_booking_date),
    },
    {
      key: "service_name",
      name: "Service Name",
      width: 100,
    },
  ];
  return (
    <div>
      <FormContainer link={true} mainTitle={userData?.name} />
      <View
        title={`${userData?.name} Overview`}
        columns={columns}
        data={earnedAndUnearnedData}
        pagination
        isLoading={isEarnedAndUnearnedDataLoading}
        tableName={"earned-and-unearned-overview"}
        showTotal={true}
      />
    </div>
  );
};

export default EarnedAndUnearned;
