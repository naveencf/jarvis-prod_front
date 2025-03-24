import React, { useState } from 'react'
import { useGetInstaBoostingDataQuery } from '../Store/API/Boosting/BoostingApi';
import View from '../AdminPanel/Sales/Account/View/View';
import { utcToIst } from '../../utils/helper';
import Calendar from '../Purchase/Calender';

const RecentlyBoosted = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  console.log("formattedStartDate",);
  const { data: boostingPosts, error, isFetching, isLoading } = useGetInstaBoostingDataQuery({
    ...(formattedStartDate && formattedEndDate && { startDate: formattedStartDate, endDate: formattedEndDate }),

  });
  const totalExpense = (arr) => {
    return arr.reduce((acc,item) => acc+item.price, 0)
  }
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
      renderRowCell: (row) => <img
        src={row?.postImage}
        style={{
          aspectRatio: "6/9",
        }}
      />
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
      renderRowCell: (row) => totalExpense(row.orders)
    },
    // {
    //   name: "Like Boost Count",
    //   key: "like_boost_count",
    //   width: 120,
    // },
    // {
    //   name: "View Boost Count",
    //   key: "view_boost_count",
    //   width: 120,
    // },
    // {
    //   name: "Share Boost Count",
    //   key: "share_boost_count",
    //   width: 120,
    // },
    {
      name: "Status",
      key: "status",
      width: 100,
    },
    {
      name: "Posted On",
      key: "postedOnIST",
      width: 160,
      renderRowCell: (row) => utcToIst(row.postedOnIST)

    },
    {
      name: "Orders Count",
      key: "orders",
      width: 100,
      renderRowCell: (row) => row.orders.length,
    },
    {
      name: "Created At",
      key: "createdAt",
      width: 160,
      renderRowCell: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      name: "Updated At",
      key: "updatedAt",
      width: 160,
      renderRowCell: (row) => new Date(row.updatedAt).toLocaleString(),
    },
  ];

  console.log("data", boostingPosts);
  return (
    <div>
      <Calendar
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
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
  )
}

export default RecentlyBoosted
