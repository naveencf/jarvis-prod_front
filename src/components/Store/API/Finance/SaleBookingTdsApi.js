import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const SaleBookingTdsApi = createApi({
  reducerPath: "OutstandingApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllSaleBookingCloseList: builder.query({
      query: (status) =>
        `sales/sale_booking_tds_status_wise_data?status=${status}`,
      transformResponse: (response) => response?.data || [],
      keepUnusedDataFor: 0,
    }),
    updateSaleBookingSingleTdsVerify: builder.mutation({
      query: ({ id, ...saleBookingTdsVerify }) => ({
        url: `sales/update_tds_verification/${id}`,
        method: "PUT",
        body: saleBookingTdsVerify,
      }),
    }),
  }),
});

export const {
  useGetAllSaleBookingCloseListQuery,
  useUpdateSaleBookingSingleTdsVerifyMutation,
} = SaleBookingTdsApi;

export default SaleBookingTdsApi;
