import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const PurchaseRequestPaymentApi = createApi({
    reducerPath: "PurchaseRequestPaymentApi",
    baseQuery: authBaseQuery,
    endpoints: (builder) => ({
        // Add a new vendor payment request
        addPurchase: builder.mutation({
            query: (formData) => ({
                url: "v1/vendor_payment_request",
                method: "POST",
                body: formData,
            }),
            onQueryStarted: async (formData, { dispatch, queryFulfilled }) => {
                try {
                    const { data: addedPurchase } = await queryFulfilled;

                    if (addedPurchase && addedPurchase.data) {
                        // // console.log("Purchase added successfully:", addedPurchase.data);
                    }
                } catch (error) {
                    console.error("Failed to add purchase:", error);
                }
            },
        }),
        // Fetch vendor payment transactions
        getVendorPaymentTransactions: builder.query({
            query: ({ startDate, endDate }) => ({
                url: `v1/vendor_payment_transactions?startDate=${startDate}&endDate=${endDate}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data.filter((item) => item.payment_mode != "advanced-settled"), // Optional: transform the response
        }),
        getPaymentRequestTransactions: builder.query({
            query: ({ request_id }) => ({
                url: `v1/vendor_payment_transactions?requestId=${request_id}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data, // Optional: transform the response
        }),
        getVendorPaymentRequests: builder.query({
            query: (status) => ({
                url: `v1/vendor_payment_request?${status}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data.filter((res) => (res.proccessingAmount == 0 || res.proccessingAmount == null) && (res.status == 0 || res.status == 3)), // Optional: transform the response
        }),
        getVendorFinancialDetail: builder.query({
            query: (_id) => ({
                url: `v1/vendor_wise_financials_details/${_id}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data// Optional: transform the response
        }),
        // Update a vendor payment request
        updatePurchaseRequest: builder.mutation({
            query: ({ _id, formData }) => ({
                url: `v1/vendor_payment_request/${_id}`,
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async ({ id, formData }, { dispatch, queryFulfilled }) => {
                try {
                    const { data: updatedPurchase } = await queryFulfilled;
                    if (updatedPurchase && updatedPurchase.data) {
                        // // console.log("Purchase updated successfully:", updatedPurchase.data);
                    }
                } catch (error) {
                    console.error("Failed to update purchase:", error);
                }
            },
        }),
        // Delete a vendor payment request
        deletePurchaseRequest: builder.mutation({
            query: (_id) => ({
                url: `v1/vendor_payment_request/${_id}`,
                method: "DELETE",
            }),
            onQueryStarted: async (_id, { dispatch, queryFulfilled }) => {
                try {
                    const { data: deletedPurchase } = await queryFulfilled;
                    if (deletedPurchase && deletedPurchase.success) {
                        // // console.log("Purchase request deleted successfully:", _id);
                    }
                } catch (error) {
                    console.error("Failed to delete purchase request:", error);
                }
            },
        }),

        // Fetch advanced payment details
        getAdvancedPayment: builder.query({
            query: (vendorObjId) => ({
                url: `purchase/advanced_payment/${vendorObjId}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data, // Optional: transform the response
        }),
        // Advanced Payment Settlement
        advancedPaymentSettlement: builder.mutation({
            query: ({ settlementData, vendorObjId }) => ({
                url: `purchase/advanced_payment_settlement/${vendorObjId}`,
                method: "PUT",
                body: settlementData,
            }),
            onQueryStarted: async (settlementData, { dispatch, queryFulfilled }) => {
                try {
                    const { data: settlementResponse } = await queryFulfilled;
                    if (settlementResponse && settlementResponse.data) {
                        // // console.log("Advanced payment settled successfully:", settlementResponse.data);
                    }
                } catch (error) {
                    console.error("Failed to settle advanced payment:", error);
                }
            },
        }),
    }),
});
// ?vendorId=${vendorId}&page=${page}&limit=${limit}
export const {
    useAddPurchaseMutation,
    useGetVendorPaymentTransactionsQuery,
    useGetVendorPaymentRequestsQuery,
    useGetPaymentRequestTransactionsQuery,
    useGetVendorFinancialDetailQuery,
    useUpdatePurchaseRequestMutation,
    useDeletePurchaseRequestMutation,
    useGetAdvancedPaymentQuery,
    useAdvancedPaymentSettlementMutation
} = PurchaseRequestPaymentApi;

export default PurchaseRequestPaymentApi;
