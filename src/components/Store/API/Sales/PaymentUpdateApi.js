import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const PaymentUpdateApi = createApi({
  reducerPath: "paymentUpdateApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllPaymentUpdates: builder.query({
      query: (id) => `sales/payment_update${id ? `?userId=${id}` : ""}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),
    getAllPaymentUpdatesPaymentDetailWise: builder.query({
      query: (id) =>
        `sales/payment_update${id ? `?payment_detail_id=${id}` : ""}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    getAllPaymentUpdatesPaymentStatusWise: builder.query({
      query: (status) => `sales/payment_update${`?status=${status}`}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    // Get details of a single payment update
    getSinglePaymentUpdate: builder.query({
      query: (id) => `sales/payment_update/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    // Create a new payment update
    addPaymentUpdate: builder.mutation({
      query: (newPaymentUpdate) => ({
        url: "sales/payment_update",
        method: "POST",
        body: newPaymentUpdate,
      }),
      onQueryStarted: async (
        newPaymentUpdate,
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: addedPaymentUpdate } = await queryFulfilled;
          dispatch(
            PaymentUpdateApi.util.updateQueryData(
              "getAllPaymentUpdates",
              undefined,
              (draft) => {
                draft.unshift(addedPaymentUpdate.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add payment update:", error);
        }
      },
    }),

    // Update an existing payment update
    updatePaymentUpdate: builder.mutation({
      query: ({ id, ...updatedPaymentUpdate }) => ({
        url: `sales/payment_update/${id}`,
        method: "PUT",
        body: updatedPaymentUpdate,
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        try {
          const { data: returnedPaymentUpdate } = await queryFulfilled;
          dispatch(
            PaymentUpdateApi.util.updateQueryData(
              "getAllPaymentUpdates",
              undefined,
              (draft) => {
                const index = draft.findIndex((update) => update.id === id);
                if (index !== -1) {
                  draft[index] = returnedPaymentUpdate.data;
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to update payment update:", error);
        }
      },
    }),

    updatePaymentUpdateStatus: builder.mutation({
      query: ({ id, ...updatedPaymentUpdateStatus }) => ({
        url: `sales/finance_approval_payment_update/${id}`,
        method: "PUT",
        body: updatedPaymentUpdateStatus,
      }),
    }),

    // Delete a payment update
    deletePaymentUpdate: builder.mutation({
      query: (id) => ({
        url: `sales/payment_update/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            PaymentUpdateApi.util.updateQueryData(
              "getAllPaymentUpdates",
              undefined,
              (draft) => {
                return draft.filter((update) => update.id !== id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete payment update:", error);
        }
      },
    }),

    getAllPendingSalesBookingPayments: builder.query({
      query: () => "sales/getAll_pending_sales_booking_payment_list",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getAllRejectedSalesBookingPayments: builder.query({
      query: () => "sales/getAll_rejected_sales_booking_payment_list",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getAllTransactionList: builder.query({
      query: ({ id, status }) =>
        `sales/payment_update?status=${status}&sale_booking_id=${id}`,
      transformResponse: (response) => response?.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),
  }),
});

export const {
  useUpdatePaymentUpdateStatusMutation,
  useGetAllPaymentUpdatesPaymentStatusWiseQuery,
  useGetAllPaymentUpdatesQuery,
  useGetAllPaymentUpdatesPaymentDetailWiseQuery,
  useGetSinglePaymentUpdateQuery,
  useAddPaymentUpdateMutation,
  useUpdatePaymentUpdateMutation,
  useDeletePaymentUpdateMutation,
  useGetAllPendingSalesBookingPaymentsQuery,
  useGetAllRejectedSalesBookingPaymentsQuery,
  useGetAllTransactionListQuery,
} = PaymentUpdateApi;

export default PaymentUpdateApi;
