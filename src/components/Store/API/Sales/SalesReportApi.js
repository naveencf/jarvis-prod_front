import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const SalesReportApi = createApi({
  reducerPath: "SalesReportApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getSalesReport: builder.query({
      query: ({ filter, fromDate, toDate, Cat_id }) =>
        `sales/sales_users_report_list${
          filter
            ? filter === "custom"
              ? `?filter=${filter}&&start_date=${fromDate}&&end_date=${toDate}`
              : `?filter=${filter}`
            : ""
        }${Cat_id ? `${!filter ? "?" : "&"}sales_category_id=${Cat_id}` : ""}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 1000 * 60 * 60,
    }),
  }),
});

export const { useLazyGetSalesReportQuery } = SalesReportApi;

export default SalesReportApi;
