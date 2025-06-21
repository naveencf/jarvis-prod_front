import { useCallback, useState } from "react";
import View from "../../AdminPanel/Sales/Account/View/View";
import Calendar from "../Calender";
import formatString from "../../../utils/formatString";
import { useGetPurchaseOverviewWithPaginationQuery } from "../../Store/API/Purchase/DirectPurchaseApi";
import { TextField } from "@mui/material";
import { debounce } from "../../../utils/helper";
import { formatIndianNumber } from "../../../utils/formatIndianNumber";

const CampaignReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  const { data, error, isLoading } = useGetPurchaseOverviewWithPaginationQuery({
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    page,
    limit,
    search
  });
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 300),
    []
  );
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };
  console.log("data", data?.data?.campaigns);
  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "exe_campaign_name",
      name: "Campaign Name",
      renderRowCell: (row) => formatString(row.exe_campaign_name) || "-",
      width: 150,
    },
    // {
    //   key: "campaign_amount",
    //   name: "Campaign Amount",
    //   renderRowCell: (row) => row.campaign_amount || 0,
    //   width: 120,
    // },
    {
      key: "cf_purchase_amount",
      name: "CF Purchase",
      renderRowCell: (row) => row.cf_purchase_amount || 0,
      width: 120,
    },
    {
      key: "other_purchase_amount",
      name: "Actual Purchase",
      renderRowCell: (row) => formatIndianNumber((row.campaign_post_amount - row.cf_purchase_amount) || 0),

      width: 120,
    },
    {
      key: "profit_amount",
      name: "Profit",
      renderRowCell: (row) => formatIndianNumber((row.base_amount - (row.campaign_post_amount - row.cf_purchase_amount)) || 0),
      width: 120,


    },
    {
      key: "base_amount",
      name: "Sale",
      renderRowCell: (row) => row.base_amount || 0,
      width: 120,
    },
    {
      key: "campaign_post_amount",
      name: "Total Purchase",
      renderRowCell: (row) => row.campaign_post_amount || 0,
      width: 120,
    },
    // {
    //   key: "gst_amount",
    //   name: "GST Amount",
    //   renderRowCell: (row) => row.gst_amount || 0,
    //   width: 100,
    // },
    {
      key: "link_count",
      name: "Total Link",
      renderRowCell: (row) => row.link_count || 0,
      width: 100,
    },
    {
      key: "cf_link_count",
      name: "CF Link",
      renderRowCell: (row) => row.cf_link_count || 0,
      width: 100,
    },
    {
      key: "other_link_count",
      name: "Other Link",
      renderRowCell: (row) => (row.link_count - row.cf_link_count) || 0,
      width: 100,
    },
    {
      key: "last_purchase_date",
      name: "Last Purchase",
      renderRowCell: (row) =>
        row.last_purchase_date
          ? new Date(row.last_purchase_date).toLocaleDateString()
          : "-",
      width: 140,
    },
  ];
  const campaignData = data?.data?.campaigns;
  const totalPages = Math.ceil((data?.data?.totalCount || 0) / limit);

  return (
    <div>
      <div className="p-4">
        <Calendar
          startDate={startDate}
          endDate={endDate}
          setStartDate={(date) => setStartDate(date)}
          setEndDate={(date) => setEndDate(date)}
        />
        <View
          columns={columns}
          data={data?.data?.campaigns}
          title={`Campaign Report`}
          isLoading={isLoading}
          pagination={[10, 50]}
          cloudPagination={true}
          tableName="Campaign Report"
          pageNavigator={{
            prev: {
              disabled: page === 1,
              onClick: () => setPage((prev) => Math.max(prev - 1, 1)),
            },
            next: {
              disabled: page >= totalPages,
              onClick: () => setPage((prev) => Math.min(prev + 1, totalPages)),
            },
            totalRows: data?.data?.totalCount || 0,
            currentPage: page,
          }}
        // addHtml={
        //   <>
        //     <TextField
        //       label="Search Campaign"
        //       variant="outlined"
        //       size="small"
        //       value={inputValue}
        //       onChange={handleSearchChange}
        //     />
        //   </>
        // }
        />
      </div>
    </div>
  );
};

export default CampaignReport;
