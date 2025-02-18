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
                        console.log("Purchase added successfully:", addedPurchase.data);
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
            transformResponse: (response) => response.data, // Optional: transform the response
        }),
        getVendorPaymentRequests: builder.query({
            query: () => ({
                url: `v1/vendor_payment_request`,
                method: "GET",
            }),
            transformResponse: (response) => response.data.filter((res) => (res.proccessingAmount == 0 || res.proccessingAmount == null) && (res.status == 0 || res.status == 3)), // Optional: transform the response
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
                        console.log("Purchase updated successfully:", updatedPurchase.data);
                    }
                } catch (error) {
                    console.error("Failed to update purchase:", error);
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
    useUpdatePurchaseRequestMutation
} = PurchaseRequestPaymentApi;

export default PurchaseRequestPaymentApi;
