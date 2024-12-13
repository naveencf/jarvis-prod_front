import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const InvoiceRequestApi = createApi({
  reducerPath: "InvoiceRequestApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllInvoiceRequest: builder.query({
      query: (status) => `sales/invoice_request?status=${status}`,
      transformResponse: (response) => response?.data,
      keepUnusedDataFor: 0,
    }),

    getAllProformaList: builder.query({
      query: (data) =>
        `sales/invoice_request/?status=${data?.status}&invoice_type_id=${data?.type}`,
      transformResponse: (response) => response?.data,
      keepUnusedDataFor: 0,
    }),

    updatePendingInvoiceReq: builder.mutation({
      query: ({ id, data }) => ({
        url: `sales/invoice_request/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deletePendingInvoice: builder.mutation({
      query: ({ id, data }) => ({
        url: `sales/invoice_request_rejected/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllInvoiceRequestQuery,
  useGetAllProformaListQuery,
  useUpdatePendingInvoiceReqMutation,
  useDeletePendingInvoiceMutation,
} = InvoiceRequestApi;

export default InvoiceRequestApi;
