import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const FinancePaymentModeApi = createApi({
  reducerPath: "FinancePaymentModeApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getPaymentMode: builder.query({
      query: (id) => `sales/payment_mode/${id}`,
      transformResponse: (response) => response?.data,

      keepUnusedDataFor: 60 * 60,
    }),
  }),
});

export const { useGetPaymentModeQuery } = FinancePaymentModeApi;

export default FinancePaymentModeApi;
