import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const vendorSaleApi = createApi({
  reducerPath: "vendorSaleApi",
  baseQuery: authBaseQuery,
  tagTypes: ["vendorSales"],
  endpoints: (builder) => ({
    getVendorSalesInventory: builder.query({
      query: () => "/v1/sales/vendor_sales/inventory",
      transformResponse: (response) => response?.data,
      providesTags: ["vendorSales"],
    }),
    getAllVendorSalesPostLinks: builder.query({
      query: () => "/v1/get_all_vendor_sales_post_links",
    }),
    addPostStats: builder.mutation({
      query: (body) => ({
        url: "/v1/sales/vendor_sales/add_post_stats",
        method: "POST",
        body,
      }),
    }),

    getAllVendorSalesPostLinksByVendorId: builder.query({
      query: (vendorCustomerId) =>
        `v1/sales/vendor_sales/get_all_vendor_sales_post_links?vendor_customer_id=${vendorCustomerId}`,
      transformResponse: (response) => response?.data,
    }),

    updateVendorSalesPostLinkById: builder.mutation({
      query: ({ id, body }) => ({
        url: `v1/sales/vendor_sales/vendor-post-link/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    getVendorInventory: builder.query({
      query: (id) =>
        `/v1/sales/vendor_sales/inventory?vendor_customer_id=${id}`,
    }),

    addVendorInventory: builder.mutation({
      query: (payload) => ({
        url: "/v1/sales/vendor_sales/inventory",
        method: "POST",
        body: payload,
      }),
    }),
    
  }),
});

export const {
  useGetVendorSalesInventoryQuery,
  useGetAllVendorSalesPostLinksQuery,
  useAddPostStatsMutation,
  useGetAllVendorSalesPostLinksByVendorIdQuery,
  useUpdateVendorSalesPostLinkByIdMutation,
  useGetVendorInventoryQuery,
  useAddVendorInventoryMutation
} = vendorSaleApi;

export default vendorSaleApi;
