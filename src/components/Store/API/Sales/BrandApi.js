import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const BrandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllBrand: builder.query({
      query: () => "accounts/brand",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    getSingleBrand: builder.query({
      query: (id) => `accounts/brand/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    addBrand: builder.mutation({
      query: (newBrand) => ({
        url: `accounts/brand`,
        method: "POST",
        body: newBrand,
      }),
      onQueryStarted: async (newBrand, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedBrand } = await queryFulfilled;
          dispatch(
            BrandApi.util.updateQueryData("getAllBrand", undefined, (draft) => {
              draft.unshift(addedBrand.data);
            })
          );
        } catch (error) {
          console.error("Failed to add Insta Brand: ", error);
        }
      },
    }),

    editBrand: builder.mutation({
      query: ({ id, ...updatedBrand }) => ({
        url: `accounts/brand/${id}`,
        method: "PUT",
        body: updatedBrand,
      }),
      onQueryStarted: async (
        { id, ...updatedBrand },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedBrand } = await queryFulfilled;
          dispatch(
            BrandApi.util.updateQueryData("getAllBrand", undefined, (draft) => {
              const brandIndex = draft.findIndex((brand) => brand.id === id);
              if (brandIndex !== -1) {
                draft[brandIndex] = returnedBrand.data;
              }
            })
          );
        } catch (error) {
          console.error("Failed to edit Insta Brand: ", error);
        }
      },
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `accounts/brand/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            BrandApi.util.updateQueryData("getAllBrand", undefined, (draft) => {
              return draft.filter((brand) => brand.id !== arg);
            })
          );
        } catch (error) {
          console.error("Failed to delete Insta Brand: ", error);
        }
      },
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
