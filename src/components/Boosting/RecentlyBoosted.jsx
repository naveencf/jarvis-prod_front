import React, { useState } from "react";
import {
  useCreatorDecisionUpdateMutation,
  useGetInstaBoostingDataQuery,
} from "../Store/API/Boosting/BoostingApi";
import View from "../AdminPanel/Sales/Account/View/View";
import { utcToIst } from "../../utils/helper";
import ReportPriceCard from "./ReportPriceCard";
import PurchaseTransactionFilter from "../Purchase/PurchaseTransactionFilter";
import dayjs from "dayjs";
import { Autocomplete, TextField } from "@mui/material";
import { useGlobalContext } from "../../Context/Context";
import formatString from "../../utils/formatString";

const RecentlyBoosted = () => {
  const { toastAlert } = useGlobalContext();
  const [creatorName, setCreatorName] = useState("");
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
  const [creatorDicisionUpdate, { isSuccess, isError }] =
    useCreatorDecisionUpdateMutation();
  const {
    data: boostingPosts,
    error,
    isFetching,
    isLoading,
    refetch,
  } = useGetInstaBoostingDataQuery({
    ...(formattedStartDate &&
      formattedEndDate && {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        creatorName: creatorName,
      }),
  });
  const totalExpense = (arr) => {
    return arr.reduce((acc, item) => acc + item.price, 0)?.toFixed(0);
  };

  const handleSelectorDecision = async (row, status) => {
    try {
      const response = await creatorDicisionUpdate({
        id: row._id,
        updatedData: { selector_decision: status },
      });

      if (response?.error) {
        console.error("Error updating status:", response.error);
      } else {
        toastAlert("Status updated successfully");
        refetch();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
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
      width: 150,
      renderRowCell: (row) => formatString(row.creatorName),
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
      name: "Creator Decision",
      key: "action",
      width: 100,
      renderRowCell: (row) => (
        <div className="">
          {row.selector_decision === 0 ? (
            <>
              <div
                className="btn btn-sm btn-success ml-2 mb-1"
                style={{ padding: "4px 16px" }}
                title="paid"
                onClick={() => handleSelectorDecision(row, 1)}
              >
                Paid
              </div>

              <div
                className="btn btn-sm  btn-danger ml-2"
                title="unpaid"
                onClick={() => handleSelectorDecision(row, 2)}
              >
                Unpaid
              </div>
            </>
          ) : (
            <>
              {row.selector_decision === 1 && (
                <span
                  className="badge badge-success"
                  style={{ fontSize: "15px" }}
                >
                  Paid
                </span>
              )}
              {row.selector_decision === 2 && (
                <span
                  className="badge badge-danger"
                  style={{ fontSize: "15px" }}
                >
                  Unpaid
                </span>
              )}
            </>
          )}
        </div>
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
      <div className="d-flex">
        <PurchaseTransactionFilter
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <Autocomplete
          sx={{ width: 200, mb: 2 }}
          id="combo-box-demo"
          options={boostingPosts?.map((cat) => ({
            label: cat.creatorName,
            value: cat.creatorName,
          }))}
          // value={}
          onChange={(_, newValue) => {
            if (newValue) setCreatorName(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Creator Name" />
          )}
        />
      </div>
      <ReportPriceCard
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        creatorName={creatorName.value}
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
  );
};

export default RecentlyBoosted;
