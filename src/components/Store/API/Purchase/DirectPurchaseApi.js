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
          return `v1/vendor?search=${encodeURIComponent(query)}&page=1&limit=10`;
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
      query: ({ amount, shortCode, audit_status, updatedBy }) => ({
        url: `v1/purchase/update_purchased_status_data`,
        method: "PUT",
        body: { amount, shortCode, audit_status, updatedBy },
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
      query: (vendor_id) => `v1/get_vendor_pending_audited_outstanding/${vendor_id}`,
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
    // api/purchase/advanced_payment/66827bcf8e6fbfb72f5c8afe?startDate=2025-03-04&&endDate=2025-03-04
  }),
});

export const { useGetVendorsQuery, useGetVendorsWithSearchQuery, useAddServiceMutation, useAuditReportMutation, useRefetchPostPriceMutation, useRecordPurchaseMutation, useGetLedgerQuery, useUpdatePurchasedStatusDataMutation, useUpdatePurchasedStatusVendorMutation,
  useGetTotalDataQuery, useGetVendorOutstandingQuery, useGetCountOfUnregisteredPagesQuery, useGetVendorPendingAuditedOutstandingQuery, useGetVendorAdvancedPaymentQuery, useGetVendorDetailQuery } = DirectPurchaseApi;

export default DirectPurchaseApi;
