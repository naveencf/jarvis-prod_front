import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const DirectPuchaseApi = createApi({
  reducerPath: "DirectPuchaseApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: () => `v1/vendor`,

      transformResponse: (response) => response?.data,
    }),
  }),
});

export const { useGetVendorsQuery } = DirectPuchaseApi;

export default DirectPuchaseApi;
