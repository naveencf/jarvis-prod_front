import React, { useState } from "react";
import { useGetInstaBoostingDataQuery } from "../Store/API/Boosting/BoostingApi";
import View from "../AdminPanel/Sales/Account/View/View";
import { utcToIst } from "../../utils/helper";
import Calendar from "../Purchase/Calender";
import ReportPriceCard from "./ReportPriceCard";
import PurchaseTransactionFilter from "../Purchase/PurchaseTransactionFilter";
import dayjs from "dayjs";

const RecentlyBoosted = () => {
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(
    dayjs().add(1, "day").format("YYYY-MM-DD")
  );
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  const {
    data: boostingPosts,
    error,
    isFetching,
    isLoading,
  } = useGetInstaBoostingDataQuery({
    ...(formattedStartDate &&
      formattedEndDate && {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }),
  });
  const totalExpense = (arr) => {
    return arr.reduce((acc, item) => acc + item.price, 0);
  };

  const columns = [
    {
      name: "S.No",
      key: "Sr.No",
      width: 40,
      renderRowCell: (row, index) => index + 1,
    },
    {
      name: "Creator Name",
      key: "creatorName",
      width: 150,
    },
    {
      name: "Handle",
      key: "handle",
      width: 120,
    },
    {
      name: "Title",
      key: "title",
      width: 250,
    },
    {
      name: "Post Type",
      key: "postType",
      width: 100,
    },
    {
      name: "Post Image",
      key: "postImage",
      width: 120,
      renderRowCell: (row) => (
        <a
          target="_blank"
          rel="noreferrer"
          href={row.postUrl}
          className="link-primary"
        >
          <img
            src={row?.postImage}
            style={{
              aspectRatio: "6/9",
              cursor: "pointer",
            }}
            alt="Post"
          />
        </a>
      ),
    },

    {
      name: "Likes",
      key: "allLike",
      width: 80,
    },
    {
      name: "Comments",
      key: "allComments",
      width: 80,
    },
    {
      name: "Views",
      key: "allView",
      width: 80,
    },
    {
      name: "Boost Count",
      key: "boost_count",
      width: 100,
    },
    {
      name: "Expense",
      key: "expense",
      width: 100,
      renderRowCell: (row) => totalExpense(row.orders),
    },
    {
      name: "Status",
      key: "status",
      width: 100,
    },
    {
      name: "Posted On",
      key: "postedOnIST",
      width: 160,
      renderRowCell: (row) => utcToIst(row.postedOnIST),
    },
    {
      name: "Orders Count",
      key: "orders",
      width: 100,
      renderRowCell: (row) => row.orders.length,
    },
  ];

  return (
    <div>
      <PurchaseTransactionFilter
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <ReportPriceCard
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      {/* <Calendar
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      /> */}
      <View
        pagination
        version={1}
        data={boostingPosts}
        columns={columns}
        title={`Recently boosted`}
        // rowSelectable={true}
        // selectedData={handleSelection}
        tableName={"boosting-pages"}
        isLoading={isFetching || isLoading}
      />
    </div>
  );
};

export default RecentlyBoosted;
