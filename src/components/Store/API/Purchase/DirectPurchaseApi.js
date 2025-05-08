import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const DirectPurchaseApi = createApi({
  reducerPath: "DirectPuchaseApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: () => `v1/vendor`,
      transformResponse: (response) => response?.data,
    }),
    getVendorsWithSearch: builder.query({
      query: (query) => {
        if (typeof query === "string" && query.trim() !== "") {
          return `v1/vendor?search=${encodeURIComponent(
            query
          )}&page=1&limit=10`;
        }
        return `v1/vendor?page=1&limit=10`;
      },
      transformResponse: (response) => response?.data,
    }),
    addService: builder.mutation({
      query: (data) => ({
        url: `v1/operation/add_service_in_campaign`,
        method: "POST",
        body: data,
      }),
    }),
    auditReport: builder.mutation({
      query: (data) => ({
        url: `v1/purchase/get_report_for_audit_status`,
        method: "POST",
        body: data,
      }),
    }),
    refetchPostPrice: builder.mutation({
      query: (data) => ({
        url: `v1/purchase/refetch_price_for_posts`,
        method: "POST",
        body: data,
      }),
    }),
    recordPurchase: builder.mutation({
      query: (data) => ({
        url: `v1/operation/record_purchase`,
        method: "POST",
        body: data,
      }),
    }),
    updatePurchasedStatusData: builder.mutation({
      query: ({
        amount,
        shortCode,
        updatedBy,
        pageName,
        campaignId,
        platform_id,
        phaseDate,
        platform_name,
      }) => ({
        url: `v1/purchase/update_purchased_status_data`,
        method: "PUT",
        body: {
          amount,
          shortCode,
          updatedBy,
          pageName,
          campaignId,
          platform_id,
          phaseDate,
          platform_name,
        },
      }),
    }),
    updateMultiplePurchasedStatusData: builder.mutation({
      query: ({ amount, shortCodes, updatedBy }) => ({
        url: `v1/purchase/update_purchased_status_multiple_data`,
        method: "PUT",
        body: { amount, shortCodes, updatedBy },
      }),
    }),
    updatePurchasedStatusVendor: builder.mutation({
      query: ({ shortCodes, vendor_id, userId }) => ({
        url: `v1/purchase/update_purchased_status_vendor`,
        method: "PUT",
        body: { shortCodes, vendor_id, userId },
      }),
    }),
    getLedger: builder.query({
      query: ({ id, query }) => `v1/get_vendor_ledger_details/${id}?${query}`,
      transformResponse: (response) => response?.data,
    }),
    getTotalData: builder.query({
      query: () => `v1/get_total_data`,
      transformResponse: (response) => response?.data,
    }),
    getVendorOutstanding: builder.query({
      query: (range) => `v1/get_vendor_outstanding/${range}`,
      transformResponse: (response) => response?.data,
    }),
    getCountOfUnregisteredPages: builder.query({
      query: () => `v1/get_count_of_unregistered_pages`,
      transformResponse: (response) => response?.data,
    }),
    getVendorPendingAuditedOutstanding: builder.query({
      query: (vendor_id) =>
        `v1/get_vendor_pending_audited_outstanding/${vendor_id}`,
      transformResponse: (response) => response?.data,
    }),
    getVendorAdvancedPayment: builder.query({
      query: ({ id, query }) => `purchase/advanced_payment/${id}?${query}`,
      transformResponse: (response) => response?.data,
    }),
    getVendorDetail: builder.query({
      query: (vendor_id) => `v1/vendor/${vendor_id}`,
      transformResponse: (response) => response?.data,
    }),
    getVendorAdvanceSummaryAndDetails: builder.query({
      query: (range) => `v1/get_vendor_advance_summary_and_details/${range}`,
      // ${range}?page=${page}&limit=${limit}
      transformResponse: (response) => response?.data,
    }),
    getVendorLedgerMonthWise: builder.query({
      query: ({ startDate, endDate }) => {
        const params = new URLSearchParams();

        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        return `v1/get_vendor_ledger_month_wise?${params.toString()}`;
      },
      transformResponse: (response) => response?.data,
    }),
    getAuditedAndPendingLinkStatsByVendors: builder.mutation({
      query: ({ page = 1, limit = 10 ,audit_status}) => ({
        url: `v1/purchase/get_audited_and_pending_link_stats_by_vendors`,
        method: 'POST',
        body: { page, limit, audit_status }
      }),
      transformResponse: (response) => response?.data,
    }),
    getVendorWiseAdvancedPaymentDetails: builder.query({
      query: () => 'purchase/vendor_wise_advanced_payment_details',
      transformResponse: (response) => response?.data,
    }),

    getPageWiseAdvancedPaymentDetails: builder.query({
      query: () => 'purchase/page_wise_advanced_payment_details',
      transformResponse: (response) => response?.data,
    }),
    getLedgerAmountByVendor: builder.query({
      query: (id) => `v1/purchase/get_ledger_amt_by_vendor/${id}`,
      transformResponse: (response) => response?.data,
    }),

    getAdvancePaymentsByPageAndVendor: builder.query({
      query: ({ vendor_obj_id, page_name }) => {
        const params = new URLSearchParams();
    
        if (vendor_obj_id) params.append('vendor_obj_id', vendor_obj_id);
        if (page_name) params.append('page_name', page_name);
    
        return `purchase/advanced_payment?${params.toString()}`;
      },
      transformResponse: (response) => response?.data,
    }),
    
    // api/purchase/advanced_payment/66827bcf8e6fbfb72f5c8afe?startDate=2025-03-04&&endDate=2025-03-04
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorsWithSearchQuery,
  useAddServiceMutation,
  useAuditReportMutation,
  useRefetchPostPriceMutation,
  useRecordPurchaseMutation,
  useGetLedgerQuery,
  useUpdatePurchasedStatusDataMutation,
  useUpdateMultiplePurchasedStatusDataMutation,
  useUpdatePurchasedStatusVendorMutation,
  useGetTotalDataQuery,
  useGetVendorOutstandingQuery,
  useGetCountOfUnregisteredPagesQuery,
  useGetVendorPendingAuditedOutstandingQuery,
  useGetVendorAdvancedPaymentQuery,
  useGetVendorDetailQuery,
  useGetVendorAdvanceSummaryAndDetailsQuery,
  useGetVendorLedgerMonthWiseQuery,
  useGetAuditedAndPendingLinkStatsByVendorsMutation,
  useGetVendorWiseAdvancedPaymentDetailsQuery,
  useGetPageWiseAdvancedPaymentDetailsQuery,
  useGetLedgerAmountByVendorQuery,
  useLazyGetAdvancePaymentsByPageAndVendorQuery
} = DirectPurchaseApi;

export default DirectPurchaseApi;
