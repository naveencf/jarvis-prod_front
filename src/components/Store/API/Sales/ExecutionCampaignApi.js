import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const ExecutionCampaignApi = createApi({
  reducerPath: "executionCampaignApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllExeCampaigns: builder.query({
      query: () => "exe_campaign",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getExeCampaignById: builder.query({
      query: (id) => `exe_campaign/${id}`,
    }),

    addExeCampaign: builder.mutation({
      query: (newExeCampaign) => ({
        url: "exe_campaign",
        method: "POST",
        body: newExeCampaign,
      }),
      onQueryStarted: async (newExeCampaign, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedExeCampaign } = await queryFulfilled;

          dispatch(
            ExecutionCampaignApi.util.updateQueryData(
              "getAllExeCampaigns",
              undefined,
              (draft) => {
                draft.unshift(addedExeCampaign.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add execution campaign:", error);
        }
      },
    }),

    editExeCampaign: builder.mutation({
      query: ({ id, ...updatedExeCampaign }) => ({
        url: `exe_campaign/${id}`,
        method: "PUT",
        body: updatedExeCampaign,
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        try {
          const { data: returnedExeCampaign } = await queryFulfilled;

          dispatch(
            ExecutionCampaignApi.util.updateQueryData(
              "getAllExeCampaigns",
              undefined,
              (draft) => {
                const exeCampaignIndex = draft.findIndex(
                  (exeCampaign) => exeCampaign.id === id
                );
                if (exeCampaignIndex !== -1) {
                  draft[exeCampaignIndex] = returnedExeCampaign.data;
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit execution campaign:", error);
        }
      },
    }),

    deleteExeCampaign: builder.mutation({
      query: (id) => ({
        url: `exe_campaign/${id}`,
        method: "DELETE",
      }),
    }),

    getExeCampaignsNameWiseData: builder.query({
      query: () => `exe_campaign_name_wise`,
      transformResponse: (response) => response.data,
    }),
    getNewExeCampaignsNameWiseData: builder.query({
      query: ({ userId, search, page, limit } = {}) => {
        const params = new URLSearchParams();

        if (userId) params.append("userId", userId);
        if (search) params.append("exe_campaign_name", search);
        if (page !== undefined && page !== null) params.append("page", page);
        if (limit !== undefined && limit !== null)
          params.append("limit", limit);

        const queryString = params.toString();
        return `new_exe_campaign_name_wise${
          queryString ? `?${queryString}` : ""
        }`;
      },
      transformResponse: (response) => response.data,
    }),

    getAllExeCampaignList: builder.query({
      query: (id) => `exe_campaign_wise_list/${id}`,
      transformResponse: (response) => response.data,
    }),

    getAdvancedPaymentsByVendor: builder.query({
      query: (vendorObjId) => {
        const params = new URLSearchParams({
          advanced_payment_status: "active",
          vendor_obj_id: vendorObjId,
        });

        return `purchase/advanced_payment?${params.toString()}`;
      },
      transformResponse: (response) => response.data,
    }),

    verifyAdvancePurchase: builder.mutation({
      query: (data) => ({
        url: "v1/operation/advance_purchase",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllExeCampaignsQuery,
  useGetExeCampaignByIdQuery,
  useAddExeCampaignMutation,
  useEditExeCampaignMutation,
  useDeleteExeCampaignMutation,
  useGetExeCampaignsNameWiseDataQuery,
  useGetNewExeCampaignsNameWiseDataQuery,
  useGetAllExeCampaignListQuery,
  useGetAdvancedPaymentsByVendorQuery,
  useVerifyAdvancePurchaseMutation,
} = ExecutionCampaignApi;

export default ExecutionCampaignApi;
