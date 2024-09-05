import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const SaleServiceApi = createApi({
  reducerPath: "saleServiceApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getSingleSaleService: builder.query({
      query: (id) => `/sales/service_master/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    getAllSaleService: builder.query({
      query: () => "/sales/service_master",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    addSaleService: builder.mutation({
      query: (saleServiceData) => ({
        url: "/sales/service_master",
        method: "POST",
        body: saleServiceData,
      }),
      onQueryStarted: async (saleServiceData, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedSaleService } = await queryFulfilled;

          dispatch(
            SaleServiceApi.util.updateQueryData(
              "getAllSaleService",
              undefined,
              (draft) => {
                draft.unshift(addedSaleService.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add sale service master:", error);
        }
      },
    }),

    editSaleService: builder.mutation({
      query: ({ id, ...updatedSaleService }) => ({
        url: `/sales/service_master/${id}`,
        method: "PUT",
        body: updatedSaleService,
      }),
      onQueryStarted: async (
        { id, ...updatedSaleService },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedSaleService } = await queryFulfilled;

          dispatch(
            SaleServiceApi.util.updateQueryData(
              "getAllSaleService",
              undefined,
              (draft) => {
                const saleServiceIndex = draft.findIndex(
                  (service) => service._id === id
                );
                if (saleServiceIndex !== -1) {
                  draft[saleServiceIndex] = returnedSaleService.data;
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit sale service master:", error);
        }
      },
    }),

    deleteSaleService: builder.mutation({
      query: (id) => ({
        url: `/sales/service_master/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(
            SaleServiceApi.util.updateQueryData(
              "getAllSaleService",
              undefined,
              (draft) => {
                return draft.filter((service) => service._id !== id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete sale service master:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllSaleServiceQuery,
  useGetSingleSaleServiceQuery,
  useAddSaleServiceMutation,
  useEditSaleServiceMutation,
  useDeleteSaleServiceMutation,
} = SaleServiceApi;

export default SaleServiceApi;
