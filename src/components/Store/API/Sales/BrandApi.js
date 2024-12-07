import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";
const BrandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: authBaseQuery,
  tagTypes: ["Brand"], // Used for cache invalidation
  endpoints: (builder) => ({
    getAllBrand: builder.query({
      query: () => "accounts/brand",
      transformResponse: (response) => response?.data,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Brand", id })), "Brand"]
          : ["Brand"],
    }),
    getSingleBrand: builder.query({
      query: (id) => `accounts/brand/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Brand", id }],
    }),
    addBrand: builder.mutation({
      query: (newBrand) => ({
        url: "accounts/brand",
        method: "POST",
        body: newBrand,
      }),
      invalidatesTags: ["Brand"],
    }),
    editBrand: builder.mutation({
      query: ({ id, ...updatedBrand }) => ({
        url: `accounts/brand/${id}`,
        method: "PUT",
        body: updatedBrand,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Brand", id }],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `accounts/brand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Brand", id }],
    }),
  }),
});
export const {
  useGetAllBrandQuery,
  useGetSingleBrandQuery,
  useAddBrandMutation,
  useEditBrandMutation,
  useDeleteBrandMutation,
} = BrandApi;
export default BrandApi;