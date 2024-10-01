import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const SalePocApi = createApi({
  reducerPath: "salePocApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllPoc: builder.query({
      query: () => `accounts/get_account_poc_list`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 1000 * 60 * 60,
    }),
    editIndividualPoc: builder.mutation({
      query: ({ id, ...updatedPoc }) => ({
        url: `accounts/update_account_poc/${id}`,
        method: "PUT",
        body: updatedPoc,
      }),
      onQueryStarted: async (
        { id, ...updatedPoc },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: editedPoc } = await queryFulfilled;
          dispatch(
            SalePocApi.util.updateQueryData("getAllPoc", undefined, (draft) => {
              const pocIndex = draft.findIndex((poc) => poc._id === id);
              if (pocIndex !== -1) {
                draft[pocIndex] = editedPoc.data;
              }
            })
          );
        } catch (error) {
          console.error("Failed to edit POC: ", error);
        }
      },
    }),
  }),
});

export const { useGetAllPocQuery, useEditIndividualPocMutation } = SalePocApi;

export default SalePocApi;
