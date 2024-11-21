import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const SalesCategoryApi = createApi({
  reducerPath: "salesCategoryApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    // Create Sales Category
    createSalesCategory: builder.mutation({
      query: (newCategory) => ({
        url: "sales/sales_category",
        method: "POST",
        body: newCategory,
      }),
    }),

    // Update Sales Category
    updateSalesCategory: builder.mutation({
      query: ({ id, ...updatedCategory }) => ({
        url: `sales/sales_category/${id}`,
        method: "PUT",
        body: updatedCategory,
      }),
    }),

    // Get Sales Category Details
    getSalesCategoryDetails: builder.query({
      query: (id) => `sales/sales_category/${id}`,
      transformResponse: (response) => response.data,
    }),

    // Get Sales Category List
    getSalesCategoryList: builder.query({
      query: () => `sales/sales_category`,
      transformResponse: (response) => response.data,
    }),

    // Delete Sales Category
    deleteSalesCategory: builder.mutation({
      query: (id) => ({
        url: `sales/sales_category/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateSalesCategoryMutation,
  useUpdateSalesCategoryMutation,
  useGetSalesCategoryDetailsQuery,
  useGetSalesCategoryListQuery,
  useDeleteSalesCategoryMutation,
} = SalesCategoryApi;

export default SalesCategoryApi;
