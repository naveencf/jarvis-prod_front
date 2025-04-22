import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const SalesBonusApi = createApi({
  reducerPath: "SalesBonusApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllSalesBonus: builder.query({
      query: () => "assigned_slabs",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),
    // Get Sales Category Details
    getSalesBonusById: builder.query({
      query: (id) => `assigned_slabs/${id}`,
      transformResponse: (response) => response.data,
    }),

    getAllBonusMasterData: builder.query({
      query: () => "bonus",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    addBonusMaster: builder.mutation({
      query: (addBonusMaster) => ({
        url: "bonus",
        method: "POST",
        body: addBonusMaster,
      }),
      onQueryStarted: async (addBonusMaster, { dispatch, queryFulfilled }) => {
        try {
          const { data: addBonusMaster } = await queryFulfilled;

          dispatch(
            DocumentTypeApi.util.updateQueryData(
              "addBonusMaster",
              undefined,
              (draft) => {
                draft.unshift(addBonusMaster.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add account type:", error);
        }
      },
    }),
    // Get Sales Category Details
    getBonusMasterById: builder.query({
      query: (id) => `bonus/${id}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetAllSalesBonusQuery,
  useGetSalesBonusByIdQuery,
  useGetAllBonusMasterDataQuery,
  useAddBonusMasterMutation,
  useGetBonusMasterByIdQuery,
} = SalesBonusApi;

export default SalesBonusApi;
