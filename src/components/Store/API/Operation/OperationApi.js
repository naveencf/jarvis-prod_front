import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

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

    getPlanById: builder.query({
      query: (id) =>
        `v1/operation/get_post_details_by_campaign/${id ? id : ""}`,
      transformResponse: (response) => response?.data,
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
    vendorData: builder.query({
      query: (name) =>
        `v1/getPageMasterDetailByPageName/${name}?platform_name=instagram`,
      transformResponse: (response) => response?.data,
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useGetAllPlanXDataQuery,
  useGetPlanWiseDataQuery,
  useGetPlanByIdQuery,
  usePlanDataUploadMutation,
  usePostDataUpdateMutation,
  useVendorDataQuery,
  useAuditedDataUploadMutation,
  useUpdatePhaseDateMutation,
  useUpdateVendorMutation,
} = OperationApi;

export default OperationApi;
