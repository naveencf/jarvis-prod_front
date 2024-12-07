import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const IncentiveStatementApi = createApi({
  reducerPath: "brandApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getStatement: builder.query({
      query: (id) => `/sales/incentive_request${id ? "?userId=" + id : ""}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetStatementQuery } = IncentiveStatementApi;

export default IncentiveStatementApi;
