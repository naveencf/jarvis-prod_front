import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const SaleStatusApi = createApi({
  reducerPath: "saleStatusApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAccountWiseStatus: builder.query({
      query: (id) => `sales/account_outstanding${id ? `?userId=${id}` : ""}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24, // Cache data for 24 hours
    }),
    getUserWiseStatus: builder.query({
      query: (id) =>
        `sales/sales_executive_outstanding${id ? `?userId=${id}` : ""}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24, // Cache data for 24 hours
    }),
  }),
});

export const { useGetAccountWiseStatusQuery, useGetUserWiseStatusQuery } =
  SaleStatusApi;
export default SaleStatusApi;
