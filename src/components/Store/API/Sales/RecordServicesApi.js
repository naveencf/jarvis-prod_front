import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const RecordServicesApi = createApi({
  reducerPath: "recordServicesApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllRecordServices: builder.query({
      query: (id) => `sales/record_service${id ? `?userId=${id}` : ""}`,
      transformResponse: (response, args) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getAllDeletedRecordServices: builder.query({
      query: () => "sales/record_service_deleted",
      transformResponse: (response, args) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getSingleRecordService: builder.query({
      query: (id) => `sales/record_service/${id}`,
      transformResponse: (response, args) => response.data,
      keepUnusedDataFor: 0,
    }),

    addRecordService: builder.mutation({
      query: (newRecordService) => ({
        url: "sales/record_service",
        method: "POST",
        body: newRecordService,
      }),
      onQueryStarted: async (
        newRecordService,
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: addedRecordService } = await queryFulfilled;

          dispatch(
            RecordServicesApi.util.updateQueryData(
              "getAllRecordServices",
              undefined,
              (draft) => {
                draft.unshift(addedRecordService.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add record service:", error);
        }
      },
    }),

    editRecordService: builder.mutation({
      query: ({ id, ...updatedRecordService }) => ({
        url: `sales/record_service/${id}`,
        method: "PUT",
        body: updatedRecordService,
      }),
      // onQueryStarted: async (
      //   { id, ...updatedRecordService },
      //   { dispatch, queryFulfilled }
      // ) => {
      //   try {
      //     const { data: returnedRecordService } = await queryFulfilled;

      //     dispatch(
      //       RecordServicesApi.util.updateQueryData(
      //         "getAllRecordServices",
      //         undefined,
      //         (draft) => {
      //           const recordServiceIndex = draft.findIndex(
      //             (recordService) => recordService.id === id
      //           );
      //           if (recordServiceIndex !== -1) {
      //             draft[recordServiceIndex] = returnedRecordService.data; // Update the object in its current position
      //           }
      //         }
      //       )
      //     );
      //   } catch (error) {
      //     console.error("Failed to edit record service:", error);
      //   }
      // },
    }),
    editMultipleRecordServices: builder.mutation({
      query: ({ id, ...updatedMultipleRecordServices }) => ({
        url: `/sales/update_multiple_record_service/${id}`,
        method: "PUT",
        body: updatedMultipleRecordServices,
      }),
    }),

    deleteRecordService: builder.mutation({
      query: (id) => ({
        url: `sales/record_service/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(
            RecordServicesApi.util.updateQueryData(
              "getAllRecordServices",
              undefined,
              (draft) => {
                return draft.filter((recordService) => recordService.id !== id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete record service:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllRecordServicesQuery,
  useGetAllDeletedRecordServicesQuery,
  useGetSingleRecordServiceQuery,
  useAddRecordServiceMutation,
  useEditRecordServiceMutation,
  useEditMultipleRecordServicesMutation,
  useDeleteRecordServiceMutation,
} = RecordServicesApi;

export default RecordServicesApi;
