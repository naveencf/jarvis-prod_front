// utils/dateFilters.js
import moment from "moment";

export const CommonFilterFunction = (apiData, dateFilter) => {
  const now = moment();
  switch (dateFilter) {
    case "last7Days":
      return apiData.filter((item) =>
        moment(item.creation_date).isBetween(
          now.clone().subtract(7, "days"),
          now,
          "day",
          "[]"
        )
      );
    case "last30Days":
      return apiData.filter((item) =>
        moment(item.creation_date).isBetween(
          now.clone().subtract(30, "days"),
          now,
          "day",
          "[]"
        )
      );
    case "thisWeek":
      const startOfWeek = now.clone().startOf("week");
      const endOfWeek = now.clone().endOf("week");
      return apiData.filter((item) =>
        moment(item.creation_date).isBetween(
          startOfWeek,
          endOfWeek,
          "day",
          "[]"
        )
      );
    case "lastWeek":
      const startOfLastWeek = now.clone().subtract(1, "weeks").startOf("week");
      const endOfLastWeek = now.clone().subtract(1, "weeks").endOf("week");
      return apiData.filter((item) =>
        moment(item.creation_date).isBetween(
          startOfLastWeek,
          endOfLastWeek,
          "day",
          "[]"
        )
      );
    case "currentMonth":
      const startOfMonth = now.clone().startOf("month");
      const endOfMonth = now.clone().endOf("month");
      return apiData.filter((item) =>
        moment(item.creation_date).isBetween(
          startOfMonth,
          endOfMonth,
          "day",
          "[]"
        )
      );
    case "currentQuarter":
      const quarterStart = moment().startOf("quarter");
      const quarterEnd = moment().endOf("quarter");
      return apiData.filter((item) =>
        moment(item.creation_date).isBetween(
          quarterStart,
          quarterEnd,
          "day",
          "[]"
        )
      );
    case "today":
      return apiData.filter((item) =>
        moment(item.creation_date).isSame(now, "day")
      );
    default:
      return apiData;
  }
};
