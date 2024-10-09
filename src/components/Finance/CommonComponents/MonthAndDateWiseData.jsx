import moment from "moment";

export const MonthAndDateWiseData = ({ apiData, dateFilter }) => {
  const now = moment();
  let startDate, endDate;

  switch (dateFilter) {
    case "last7Days":
      startDate = now?.clone()?.subtract(7, "days");
      endDate = now;
      break;

    case "last30Days":
      startDate = now?.clone()?.subtract(30, "days");
      endDate = now;
      break;

    case "thisWeek":
      startDate = now?.clone()?.startOf("week");
      endDate = now?.clone()?.endOf("week");
      break;

    case "lastWeek":
      startDate = now?.clone()?.subtract(1, "weeks")?.startOf("week");
      endDate = now?.clone()?.subtract(1, "weeks")?.endOf("week");
      break;

    case "currentMonth":
      startDate = now?.clone()?.startOf("month");
      endDate = now?.clone()?.endOf("month");
      break;

    case "currentQuarter":
      startDate = now?.clone()?.startOf("quarter");
      endDate = now?.clone()?.endOf("quarter");
      break;

    case "today":
      return apiData?.filter((item) =>
        moment(item.request_date)?.isSame(now, "day")
      );

    default:
      return apiData;
  }

  return apiData?.filter((item) =>
    moment(item.request_date)?.isBetween(startDate, endDate, "day", "[]")
  );
};
