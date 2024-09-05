import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const CreditApprovalApi = createApi({
  reducerPath: "creditApprovalApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    // Fetch all reason credit approvals
    getAllCreditApprovals: builder.query({
      query: () => "sales/reason_credit_approval",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24, // 24 hours
    }),

    // Fetch a single reason credit approval by ID
    getCreditApprovalDetail: builder.query({
      query: (id) => `sales/reason_credit_approval/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60, // 1 hour
    }),

    // Add a new reason credit approval
    addCreditApproval: builder.mutation({
      query: (newCreditApproval) => ({
        url: "sales/reason_credit_approval",
        method: "POST",
        body: newCreditApproval,
      }),
      onQueryStarted: async ({ dispatch, queryFulfilled }) => {
        try {
          const { data: addedCreditApproval } = await queryFulfilled;

          dispatch(
            CreditApprovalApi.util.updateQueryData(
              "getAllCreditApprovals",
              undefined,
              (draft) => {
                draft.unshift(addedCreditApproval);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add Credit Approval:", error);
        }
      },
    }),

    // Update an existing reason credit approval by ID
    editCreditApproval: builder.mutation({
      query: ({ id, ...updatedCreditApproval }) => ({
        url: `sales/reason_credit_approval/${id}`,
        method: "PUT",
        body: updatedCreditApproval,
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        try {
          const { data: returnedCreditApproval } = await queryFulfilled;

          dispatch(
            CreditApprovalApi.util.updateQueryData(
              "getAllCreditApprovals",
              undefined,
              (draft) => {
                const creditApprovalIndex = draft.findIndex(
                  (creditApproval) => creditApproval.id === id
                );
                if (creditApprovalIndex !== -1) {
                  draft[creditApprovalIndex] = returnedCreditApproval;
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit Credit Approval:", error);
        }
      },
    }),

    // Delete a reason credit approval by ID
    deleteCreditApproval: builder.mutation({
      query: (id) => ({
        url: `sales/reason_credit_approval/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(
          CreditApprovalApi.util.updateQueryData(
            "getAllCreditApprovals",
            undefined,
            (draft) => {
              const creditApprovalIndex = draft.findIndex(
                (creditApproval) => creditApproval.id === id
              );
              if (creditApprovalIndex !== -1) {
                draft.splice(creditApprovalIndex, 1); // Remove the deleted item
              }
            }
          )
        );
      },
    }),
  }),
});

export const {
  useGetAllCreditApprovalsQuery,
  useGetCreditApprovalDetailQuery,
  useAddCreditApprovalMutation,
  useEditCreditApprovalMutation,
  useDeleteCreditApprovalMutation,
} = CreditApprovalApi;

export default CreditApprovalApi;
