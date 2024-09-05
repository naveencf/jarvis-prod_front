import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const BrandCategoryTypeApi = createApi({
  reducerPath: "brandCategoryTypeApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllBrandCategoryType: builder.query({
      query: () => "accounts/brand_category",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    getSingleBrandCategoryType: builder.query({
      query: (id) => `accounts/brand_category/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    addBrandCategoryType: builder.mutation({
      query: (newBrandCategoryType) => ({
        url: "accounts/brand_category",
        method: "POST",
        body: newBrandCategoryType,
      }),
      onQueryStarted: async (
        newBrandCategoryType,
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: addedBrandCategoryType } = await queryFulfilled;

          dispatch(
            BrandCategoryTypeApi.util.updateQueryData(
              "getAllBrandCategoryType",
              undefined,
              (draft) => {
                draft.unshift(addedBrandCategoryType.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add brand category type:", error);
        }

        /*
        // Optimistic update (commented out)
        const patchResult = dispatch(
          BrandCategoryTypeApi.util.updateQueryData('getAllBrandCategoryType', undefined, (draft) => {
            draft.unshift(newBrandCategoryType);
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error('Failed to add brand category type:', error);
        }
        */
      },
    }),

    editBrandCategoryType: builder.mutation({
      query: ({ id, ...updatedBrandCategoryType }) => ({
        url: `accounts/brand_category/${id}`,
        method: "PUT",
        body: updatedBrandCategoryType,
      }),
      onQueryStarted: async (
        { id, ...updatedBrandCategoryType },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedBrandCategoryType } = await queryFulfilled;

          dispatch(
            BrandCategoryTypeApi.util.updateQueryData(
              "getAllBrandCategoryType",
              undefined,
              (draft) => {
                const brandCategoryIndex = draft.findIndex(
                  (brandCategory) => brandCategory._id === id
                );
                if (brandCategoryIndex !== -1) {
                  draft[brandCategoryIndex] = returnedBrandCategoryType.data; // Update the object in its current position
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit brand category type:", error);
        }

        /*
        // Optimistic update (commented out)
        const patchResult = dispatch(
          BrandCategoryTypeApi.util.updateQueryData('getAllBrandCategoryType', undefined, (draft) => {
            const brandCategoryIndex = draft.findIndex(brandCategory => brandCategory.id === id);
            if (brandCategoryIndex !== -1) {
              draft[brandCategoryIndex] = { ...draft[brandCategoryIndex], ...updatedBrandCategoryType };
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error('Failed to edit brand category type:', error);
        }
        */
      },
    }),

    deleteBrandCategoryType: builder.mutation({
      query: (id) => ({
        url: `accounts/brand_category/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(
            BrandCategoryTypeApi.util.updateQueryData(
              "getAllBrandCategoryType",
              undefined,
              (draft) => {
                return draft.filter((brandCategory) => brandCategory.id !== id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete brand category type:", error);
        }

        /*
        // Optimistic update (commented out)
        const patchResult = dispatch(
          BrandCategoryTypeApi.util.updateQueryData('getAllBrandCategoryType', undefined, (draft) => {
            return draft.filter(brandCategory => brandCategory.id !== id);
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error('Failed to delete brand category type:', error);
        }
        */
      },
    }),
  }),
});

export const {
  useGetAllBrandCategoryTypeQuery,
  useGetSingleBrandCategoryTypeQuery,
  useAddBrandCategoryTypeMutation,
  useEditBrandCategoryTypeMutation,
  useDeleteBrandCategoryTypeMutation,
} = BrandCategoryTypeApi;

export default BrandCategoryTypeApi;
