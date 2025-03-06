import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getPurchases: builder.query({
      query: () => "/purchases",
    }),
    getPurchaseById: builder.query({
      query: (id) => `/purchases/${id}`,
    }),
    createPurchase: builder.mutation({
      query: (purchaseData) => ({
        url: "/purchases",
        method: "POST",
        body: purchaseData,
      }),
    }),
    updatePurchase: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/purchases/${id}`,
        method: "PUT",
        body: updateData,
      }),
    }),
    deletePurchase: builder.mutation({
      query: (id) => ({
        url: `/purchases/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetPurchasesQuery,
  useGetPurchaseByIdQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi;
