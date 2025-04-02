import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateISOtoNormal from "../../../utils/DateISOtoNormal";
import { formatIndianNumber } from "../../../utils/formatIndianNumber";
import { formatNumber } from "../../../utils/formatNumber";
import getDecodedToken from "../../../utils/DecodedToken";

const MonthlyWeeklyCard = ({
  data,
  title,
  previousData,
  titleClass = "colorPrimary",
  colorClass = "bgPrimary",
  getData,
  loading,
}) => {
  let loginUserRole = getDecodedToken().role_id;
  const navigate = useNavigate();
  const [slectedOption, SetSelectedOption] = useState("");
  const [Options, SetOption] = useState([]);

  let startDate = useRef(null);
  let endDate = useRef(null);
  let laststartDate = useRef(null);
  let lastendDate = useRef(null);

  useEffect(() => {
    function getPastMonths() {
      const curr = new Date();
      const currStart = new Date(curr.getFullYear(), curr.getMonth(), 1);

      const months = [];

      for (let i = 0; i < 5; i++) {
        const pastMonthStart = new Date(currStart);
        pastMonthStart.setMonth(pastMonthStart.getMonth() - i);
        pastMonthStart.setDate(1);

        const pastMonthEnd = new Date(pastMonthStart);
        pastMonthEnd.setMonth(pastMonthEnd.getMonth() + 1);
        pastMonthEnd.setDate(0);

        const monthName = pastMonthStart.toLocaleString("default", {
          month: "long",
        });

        months.push({
          month: monthName,
          startdate: new Date(
            pastMonthStart.getTime() -
              pastMonthStart.getTimezoneOffset() * 60000
          )
            .toISOString()
            .split("T")[0],
          enddate: new Date(
            pastMonthEnd.getTime() - pastMonthEnd.getTimezoneOffset() * 60000
          )
            .toISOString()
            .split("T")[0],
        });
      }

      return months;
    }
    if (data && title === "Monthly") SetOption(getPastMonths());
  }, [data]);

  useEffect(() => {
    if (slectedOption) {
      const selectedOptionData = Options.find(
        (option) => option.month === slectedOption
      );

      startDate.current = selectedOptionData?.startdate;
      endDate.current = selectedOptionData?.enddate;

      const nextOptionData = Options[Options.indexOf(selectedOptionData) + 1];
      laststartDate.current = nextOptionData?.startdate;
      lastendDate.current = nextOptionData?.enddate;
    }
  }, [slectedOption]);

  useEffect(() => {
    if (slectedOption && title === "Monthly") {
      // console.log("getData");
      getData(
        startDate.current,
        endDate.current,
        laststartDate.current,
        lastendDate.current
      );
    }
  }, [slectedOption]);
  // // console.log("startDate", startDate.current);
  // // console.log("endDate", endDate.current);
  // // console.log("laststartDate", laststartDate.current);
  // // console.log("lastendDate", lastendDate.current);

  const handleNavigate = (start, end) => {
    navigate("/admin/view-sales-booking", { state: { start, end } });
  };

  const calculateDifference = (current, previous) => {
    return (previous || 0) - (current || 0);
  };

  const getGrowthBadgeClass = (current, previous) => {
    const difference = calculateDifference(current, previous);
    if (difference == 0) return "growthBlank";
    return difference > 0 ? "growthDown" : "growthUp";
  };

  const renderGrowthBadge = (current, previous) => {
    const difference = calculateDifference(current, previous);
    const badgeClass = getGrowthBadgeClass(current, previous);
    return (
      <div className={`growthBadge ${badgeClass}`}>
        {badgeClass !== "growthBlank" && <span></span>}
        {formatNumber(Math.abs(difference))}
      </div>
    );
  };

  return (
    <div className={`col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12`}>
      <div className={`timeDataCard card `}>
        <div className="card-header">
          <div className="titleCard w-100">
            <div className={`titleCardImg ${colorClass} border-0 `}>
              <i className="bi bi-calendar4-week"></i>
            </div>
            <div className="titleCardText w-75">
              <h2 className={titleClass}>{title}</h2>
              {title === "Total" ? null : loginUserRole == 1 &&
                title === "Monthly" ? (
                <select
                  value={slectedOption}
                  onChange={(e) => {
                    SetSelectedOption(e.target.value);
                  }}
                >
                  {Options.slice(0, 4).map((option, index) => (
                    <option key={index} value={option.month}>
                      {option.month}
                    </option>
                  ))}
                </select>
              ) : (
                <h3>
                  {DateISOtoNormal(data?.startDate)} to{" "}
                  {DateISOtoNormal(data?.endDate)}
                </h3>
              )}
            </div>
            {title == "Monthly" && loading && (
              <div class="spinner-border text-primary  " role="status">
                <span class="sr-only">Loading...</span>
              </div>
            )}
          </div>
        </div>
        <div className="card-body">
          <div className="timeDataCardInfo">
            <ul>
              <li>
                <span>Accounts</span>
                {data?.totalAccountCounts}
              </li>
              <li
                className="pointer"
                onClick={() => handleNavigate(data?.startDate, data?.endDate)}
              >
                <span>Sales</span>{" "}
                {data?.totalSaleBookingCounts
                  ? data?.totalSaleBookingCounts
                  : ""}
                {title !== "Total" &&
                  renderGrowthBadge(
                    data?.totalSaleBookingCounts,
                    previousData?.totalSaleBookingCounts || 0
                  )}
              </li>
              <li
                className="pointer"
                onClick={() => handleNavigate(data?.startDate, data?.endDate)}
              >
                <span>Booking Amount</span>{" "}
                {data?.totalCampaignAmount
                  ? formatIndianNumber(Number(data?.totalCampaignAmount))
                  : ""}
                {title !== "Total" &&
                  renderGrowthBadge(
                    data?.totalCampaignAmount,
                    previousData?.totalCampaignAmount
                  )}
              </li>
              <li>
                <span>Average</span>{" "}
                {data?.totalCampaignAmount && data?.totalSaleBookingCounts
                  ? formatIndianNumber(
                      Number(data?.totalCampaignAmount) /
                        Number(data?.totalSaleBookingCounts)
                    )
                  : ""}
                {title !== "Total" &&
                  renderGrowthBadge(
                    data?.totalCampaignAmount / data?.totalSaleBookingCounts,
                    previousData?.totalCampaignAmount /
                      previousData?.totalSaleBookingCounts
                  )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyWeeklyCard;
