import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const PostBoostingApi = createApi({
  reducerPath: "DirectPuchaseApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: () => `v1/vendor_v2`,
      transformResponse: (response) => response?.data?.data,
    }),

    // api/purchase/advanced_payment/66827bcf8e6fbfb72f5c8afe?startDate=2025-03-04&&endDate=2025-03-04
  }),
});

export const { useGetVendorsQuery } = PostBoostingApi;

export default PostBoostingApi;
