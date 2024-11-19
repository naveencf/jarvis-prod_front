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
  useGetAllOutstandingListNewQuery,
  useUpdateOutstandingBalancePaymentMutation,
useUpdateOutstandingSaleBookingCloseMutation
  
} = OutstandingNewApi;

export default OutstandingNewApi;