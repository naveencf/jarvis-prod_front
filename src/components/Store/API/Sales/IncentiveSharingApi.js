import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const IncentiveSharingApi = createApi({
  reducerPath: "incentiveSharingApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    // Get all incentive sharing records
    getIncentiveSharingList: builder.query({
      query: () => "sales/incentive_sharing",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    // Get details of a specific incentive sharing record
    getIncentiveSharingDetails: builder.query({
      query: (id) => `sales/incentive_sharing/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    // Create a new incentive sharing record
    addIncentiveSharing: builder.mutation({
      query: (newIncentiveSharing) => ({
        url: "sales/incentive_sharing",
        method: "POST",
        body: newIncentiveSharing,
      }),
      onQueryStarted: async (
        newIncentiveSharing,
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: addedIncentiveSharing } = await queryFulfilled;
          dispatch(
            IncentiveSharingApi.util.updateQueryData(
              "getIncentiveSharingList",
              undefined,
              (draft) => {
                draft.unshift(addedIncentiveSharing.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add incentive sharing:", error);
        }
      },
    }),

    // Update an existing incentive sharing record
    updateIncentiveSharing: builder.mutation({
      query: ({ id, ...updatedIncentiveSharing }) => ({
        url: `sales/incentive_sharing/${id}`,
        method: "PUT",
        body: updatedIncentiveSharing,
      }),
      // onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
      //   try {
      //     const { data: updatedIncentiveSharingData } = await queryFulfilled;
      //     dispatch(
      //       IncentiveSharingApi.util.updateQueryData(
      //         "getIncentiveSharingList",
      //         undefined,
      //         (draft) => {
      //           const index = draft.findIndex(
      //             (item) => item.account_id === account_id
      //           );
      //           if (index !== -1) {
      //             draft[index] = updatedIncentiveSharingData.data;
      //           }
      //         }
      //       )
      //     );
      //   } catch (error) {
      //     console.error("Failed to update incentive sharing:", error);
      //   }
      // },
    }),

    // Delete an incentive sharing record
    deleteIncentiveSharing: builder.mutation({
      query: ({ id, ...services }) => ({
        url: `sales/incentive_sharing/${id}`,
        method: "DELETE",
        body: services,
      }),
      onQueryStarted: async (
        { service_id, ...services },
        { dispatch, queryFulfilled }
      ) => {
        try {
          await queryFulfilled;
          dispatch(
            IncentiveSharingApi.util.updateQueryData(
              "getIncentiveSharingDetails",
              undefined,
              (draft) => {
                console.log(draft);
                return draft.filter((item) => item.serviceId !== service_id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete incentive sharing:", error);
        }
      },
    }),
  }),
});

export const {
  useGetIncentiveSharingListQuery,
  useGetIncentiveSharingDetailsQuery,
  useAddIncentiveSharingMutation,
  useUpdateIncentiveSharingMutation,
  useDeleteIncentiveSharingMutation,
} = IncentiveSharingApi;

export default IncentiveSharingApi;
