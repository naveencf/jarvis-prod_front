import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const PaymentModeApi = createApi({
  reducerPath: "paymentModeApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    // Get a list of all payment modes
    getAllPaymentModes: builder.query({
      query: () => "sales/payment_mode",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    // Get details of a single payment mode
    getSinglePaymentMode: builder.query({
      query: (id) => `sales/payment_mode/${id}`,
      transformResponse: (response) => response.data,
    }),

    // Create a new payment mode
    addPaymentMode: builder.mutation({
      query: (newPaymentMode) => ({
        url: "sales/payment_mode",
        method: "POST",
        body: newPaymentMode,
      }),
      onQueryStarted: async (newPaymentMode, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedPaymentMode } = await queryFulfilled;
          dispatch(
            PaymentModeApi.util.updateQueryData(
              "getAllPaymentModes",
              undefined,
              (draft) => {
                draft.unshift(addedPaymentMode.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add payment mode:", error);
        }
      },
    }),

    // Update an existing payment mode
    updatePaymentMode: builder.mutation({
      query: ({ id, ...updatedPaymentMode }) => ({
        url: `sales/payment_mode/${id}`,
        method: "PUT",
        body: updatedPaymentMode,
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        try {
          const { data: returnedPaymentMode } = await queryFulfilled;
          dispatch(
            PaymentModeApi.util.updateQueryData(
              "getAllPaymentModes",
              undefined,
              (draft) => {
                const paymentModeIndex = draft.findIndex(
                  (mode) => mode.id === id
                );
                if (paymentModeIndex !== -1) {
                  draft[paymentModeIndex] = returnedPaymentMode.data;
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to update payment mode:", error);
        }
      },
    }),

    // Delete a payment mode
    deletePaymentMode: builder.mutation({
      query: (id) => ({
        url: `sales/payment_mode/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            PaymentModeApi.util.updateQueryData(
              "getAllPaymentModes",
              undefined,
              (draft) => {
                return draft.filter((mode) => mode.id !== id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete payment mode:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllPaymentModesQuery,
  useGetSinglePaymentModeQuery,
  useAddPaymentModeMutation,
  useUpdatePaymentModeMutation,
  useDeletePaymentModeMutation,
} = PaymentModeApi;

export default PaymentModeApi;
