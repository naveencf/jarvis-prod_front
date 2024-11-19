import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const OutstandingApi = createApi({
  reducerPath: "OutstandingApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllOutstandingList: builder.query({
      query: () => `sales/sales_booking_outstanding_for_finanace`,
      transformResponse: (response) => response,
      keepUnusedDataFor: 0,
    }),
    updateOutstandingBalancePayment: builder.mutation({
      query: (data) => ({
        url: `sales/sale_balance_update`,
        method: "PUT",
        body: data,
      }),
    }),
    updateOutstandingSaleBookingClose: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `sales/booking_closed_with_tds_amount/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  // useGetAllOutstandingListQuery,
  // useUpdateOutstandingBalancePaymentMutation,
  // useUpdateOutstandingSaleBookingCloseMutation,
} = OutstandingApi;

export default OutstandingApi;
