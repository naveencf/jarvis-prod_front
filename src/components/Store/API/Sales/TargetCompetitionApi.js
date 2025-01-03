import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const TargetCompetitionApi = createApi({
  reducerPath: "targetCompetitionApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllTargetCompetitions: builder.query({
      query: (Cat_id) =>
        `sales/target_competition${
          Cat_id ? `?sales_category_id=${Cat_id}` : ""
        }`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    getSingleTargetCompetition: builder.query({
      query: (id) => `sales/target_competition/${id}`,
      transformResponse: (res) => res.data,
      keepUnusedDataFor: 0,
    }),

    addTargetCompetition: builder.mutation({
      query: (newTargetCompetition) => ({
        url: "sales/target_competition",
        method: "POST",
        body: newTargetCompetition,
      }),
      onQueryStarted: async (
        newTargetCompetition,
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: addedTargetCompetition } = await queryFulfilled;

          dispatch(
            TargetCompetitionApi.util.updateQueryData(
              "getAllTargetCompetitions",
              undefined,
              (draft) => {
                draft.unshift(addedTargetCompetition.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add target competition:", error);
        }
      },
    }),

    editTargetCompetition: builder.mutation({
      query: ({ id, ...updatedTargetCompetition }) => ({
        url: `sales/target_competition/${id}`,
        method: "PUT",
        body: updatedTargetCompetition,
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        try {
          const { data: returnedTargetCompetition } = await queryFulfilled;

          dispatch(
            TargetCompetitionApi.util.updateQueryData(
              "getAllTargetCompetitions",
              undefined,
              (draft) => {
                const targetCompetitionIndex = draft.findIndex(
                  (competition) => competition.id === id
                );
                if (targetCompetitionIndex !== -1) {
                  draft[targetCompetitionIndex] =
                    returnedTargetCompetition.data;
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit target competition:", error);
        }
      },
    }),

    deleteTargetCompetition: builder.mutation({
      query: (id) => ({
        url: `sales/target_competition/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(
            TargetCompetitionApi.util.updateQueryData(
              "getAllTargetCompetitions",
              undefined,
              (draft) => {
                return draft.filter((competition) => competition.id !== id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete target competition:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllTargetCompetitionsQuery,
  useGetSingleTargetCompetitionQuery,
  useAddTargetCompetitionMutation,
  useEditTargetCompetitionMutation,
  useDeleteTargetCompetitionMutation,
} = TargetCompetitionApi;

export default TargetCompetitionApi;
