import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const ExecutionApi = createApi({
  reducerPath: "executionApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllExecutions: builder.query({
      query: () => "sales/sales_booking_execution",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 3600,
    }),

    getSingleExecution: builder.query({
      query: (id) => `sales/sales_booking_execution/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 3600,
    }),

    addExecution: builder.mutation({
      query: (newExecution) => ({
        url: "sales/sales_booking_execution",
        method: "POST",
        body: newExecution,
      }),
      onQueryStarted: async (newExecution, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedExecution } = await queryFulfilled;

          dispatch(
            ExecutionApi.util.updateQueryData(
              "getAllExecutions",
              undefined,
              (draft) => {
                draft.unshift(addedExecution.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add execution:", error);
        }
      },
    }),

    editExecution: builder.mutation({
      query: ({ id, ...updatedExecution }) => ({
        url: `sales/sales_booking_execution/${id}`,
        method: "PUT",
        body: updatedExecution,
      }),
      onQueryStarted: async (
        { id, ...updatedExecution },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedExecution } = await queryFulfilled;

          dispatch(
            ExecutionApi.util.updateQueryData(
              "getAllExecutions",
              undefined,
              (draft) => {
                const executionIndex = draft.findIndex(
                  (execution) => execution.id === id
                );
                if (executionIndex !== -1) {
                  draft[executionIndex] = returnedExecution.data; // Update the object in its current position
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit execution:", error);
        }
      },
    }),

    deleteExecution: builder.mutation({
      query: (id) => ({
        url: `sales/sales_booking_execution/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(
            ExecutionApi.util.updateQueryData(
              "getAllExecutions",
              undefined,
              (draft) => {
                return draft.filter((execution) => execution.id !== id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete execution:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllExecutionsQuery,
  useGetSingleExecutionQuery,
  useAddExecutionMutation,
  useEditExecutionMutation,
  useDeleteExecutionMutation,
} = ExecutionApi;

export default ExecutionApi;
