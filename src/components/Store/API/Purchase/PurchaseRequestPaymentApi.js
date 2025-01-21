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
            transformResponse: (response) => response.data, // Optional: transform the response
        }),
    }),
});
// ?vendorId=${vendorId}&page=${page}&limit=${limit}
export const {
    useAddPurchaseMutation,
    useGetVendorPaymentTransactionsQuery,
    useGetVendorPaymentRequestsQuery,
} = PurchaseRequestPaymentApi;

export default PurchaseRequestPaymentApi;
