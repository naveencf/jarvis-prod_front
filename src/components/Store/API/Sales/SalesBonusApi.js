import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";
import { use } from "react";

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
    }),
    editBonusMaster: builder.mutation({
      query: ({ id, ...updateBonusMaster }) => ({
        url: `bonus/${id}`,
        method: "PUT",
        body: updateBonusMaster,
      }),
    }),

    // Get Sales Category Details
    getBonusMasterById: builder.query({
      query: (id) => `bonus/${id}`,
      transformResponse: (response) => response.data,
    }),
    getBonusSummaryById: builder.query({
      query: (id) => `get_bonus_summary/${id}`,
      transformResponse: (response) => response.data,
    }),

    getBonusUserListById: builder.query({
      query: (id) => `bonus/user_list/${id}`,
      transformResponse: (response) => response.data,
    }),

    getAllSlab: builder.query({
      query: () => "bonus_slab",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),
    getBonusStatementById: builder.query({
      query: (id) => `bonus_statement/${id}`,
      transformResponse: (response) => response.data,
    }),
    getUserStatementById: builder.query({
      query: (id) => `bonus_statement/${id}`,
      transformResponse: (response) => response.data,
    }),

    getSlabDataById: builder.query({
      query: (id) => `bonus_slab/by_bonus/${id}`,
      transformResponse: (response) => response.data,
    }),

    addAssigntoUser: builder.mutation({
      query: (assigntoUser) => ({
        url: "assign_slab_to_user",
        method: "POST",
        body: assigntoUser,
      }),
    }),
    assigntoUserRemove: builder.mutation({
      query: (assigntoUser) => ({
        url: "unassign_slab_to_user",
        method: "POST",
        body: assigntoUser,
      }),
    }),
  }),
});

export const {
  useGetAllSalesBonusQuery,
  useGetSalesBonusByIdQuery,
  useGetAllBonusMasterDataQuery,
  useAddBonusMasterMutation,
  useGetBonusMasterByIdQuery,
  useGetBonusSummaryByIdQuery,
  useEditBonusMasterMutation,
  useGetBonusUserListByIdQuery,
  useGetBonusStatementByIdQuery,
  useGetAllSlabQuery,
  useAddAssigntoUserMutation,
  useAssigntoUserRemoveMutation,
  useGetUserStatementByIdQuery,
  useGetSlabDataByIdQuery,
} = SalesBonusApi;

export default SalesBonusApi;
