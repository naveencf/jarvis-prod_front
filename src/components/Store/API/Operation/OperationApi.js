import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";
import { use } from "react";

const OperationApi = createApi({
  reducerPath: "operationApi",
  baseQuery: authBaseQuery,
  tagTypes: ["Operation"],
  endpoints: (builder) => ({
    // Endpoint to fetch all PlanX data
    getAllPlanXData: builder.query({
      query: () => "v1/planxlogs",
      transformResponse: (response) => response?.data,
    }),

    GetAllPagessByPlatform: builder.query({
      query: (platform) =>
        `v1/get_all_pages${platform ? `?platform_name=${platform}` : ""}`,
      transformResponse: (response) => response.data,
    }),

    getPlanById: builder.query({
      query: (id) =>
        `v1/operation/get_post_details_by_campaign${
          id == 0 || id == null || id == "null" ? "" : `/${id}`
        }`,
      transformResponse: (response) => response?.data,
    }),
    getDeleteStoryData: builder.query({
      query: (id) => `v1/operation/exclude_story_from_post_link/${id}`,
    }),

    getPlanWiseData: builder.query({
      query: ({ selectPlan }) => {
        return {
          url: `operation/operation_execution_master/${selectPlan}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response?.data,
    }),
    PlanDataUpload: builder.mutation({
      query: (data) => ({
        url: `v1/operation/campaign_post_details`,
        method: "POST",
        body: data,
      }),
    }),
    PlanDataUploadPlatformWise: builder.mutation({
      query: (data) => ({
        url: `v1/operation/add_campaign_post_for_platform`,
        method: "POST",
        body: data,
      }),
    }),

    PostDataUpdate: builder.mutation({
      query: (data) => ({
        url: `v1/operation/update_campaign_post_data/${data.get("_id")}`,
        method: "PUT",
        body: data,
      }),
    }),
    updatePhaseDate: builder.mutation({
      query: (data) => ({
        url: `v1/operation/update_phase_date`,
        method: "PUT",
        body: data,
      }),
    }),
    updateVendor: builder.mutation({
      query: (data) => ({
        url: `v1/operation/update_vendor_for_links`,
        method: "PUT",
        body: data,
      }),
    }),

    auditedDataUpload: builder.mutation({
      query: (data) => ({
        url: `v1/operation/record_purchase`,
        method: "POST",
        body: data,
      }),
    }),
    addStoryData: builder.mutation({
      query: (data) => ({
        url: `v1/operation/add_instagram_story`,
        method: "POST",
        body: data,
      }),
    }),

    vendorData: builder.query({
      query: (name) =>
        `v1/getPageMasterDetailByPageName/${name}?platform_name=instagram`,
      transformResponse: (response) => response?.data,
    }),
    updateMultipleAuditStatus: builder.mutation({
      query: (data) => ({
        url: `v1/operation/update_audit_status`,
        method: "PUT",
        body: data,
      }),
    }),
    updatePriceforPost: builder.mutation({
      query: (data) => ({
        url: `v1/operation/update_post_price/${data.shortCode}`,
        method: "PUT",
        body: data,
      }),
    }),
    addMultipleService: builder.mutation({
      query: (data) => ({
        url: `v1/operation/add_service_in_multiple_campaigns`,
        method: "POST",
        body: data,
      }),
    }),
    getPostDetailsBasedOnFilter: builder.mutation({
      query: (data) => ({
        url: "v1/operation/get_post_details_based_on_filter",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useGetAllPlanXDataQuery,
  useGetPlanWiseDataQuery,
  useGetPlanByIdQuery,
  useGetAllPagessByPlatformQuery,
  usePlanDataUploadMutation,
  usePlanDataUploadPlatformWiseMutation,
  usePostDataUpdateMutation,
  useVendorDataQuery,
  useAuditedDataUploadMutation,
  useUpdatePhaseDateMutation,
  useUpdateVendorMutation,
  useUpdateMultipleAuditStatusMutation,
  useUpdatePriceforPostMutation,
  useGetPostDetailsBasedOnFilterMutation,
  useAddStoryDataMutation,
  useAddMultipleServiceMutation,
  useGetDeleteStoryDataQuery,
} = OperationApi;

export default OperationApi;
