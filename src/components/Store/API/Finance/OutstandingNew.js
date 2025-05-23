import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const OutstandingNewApi = createApi({
  reducerPath: "OutstandingNewApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllOutstandingListNew: builder.query({
      query: () => `sales/sales_booking_outstanding_for_finanace`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),
    getUserWieOutStanding: builder.query({
      query: () => `sales/user_wise_outstanding_amount`,
      transformResponse: (response) => response.data,
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
    updateOutstandingRevert: builder.mutation({
      query: (data) => ({
        url: `sales/sale_balance_update_revert`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllOutstandingListNewQuery,
  useGetUserWieOutStandingQuery,
  useUpdateOutstandingBalancePaymentMutation,
  useUpdateOutstandingSaleBookingCloseMutation,
  useUpdateOutstandingRevertMutation,
} = OutstandingNewApi;

export default OutstandingNewApi;
