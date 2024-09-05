import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const AccountDocumentApi = createApi({
  reducerPath: "accountDocumentApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getDocumentById: builder.query({
      query: (id) => `accounts/get_document_overview/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    editDocument: builder.mutation({
      query: ({ id, ...updatedDocument }) => ({
        url: `accounts/update_multiple_account_documents/${id}`,
        method: "PUT",
        body: updatedDocument,
      }),
      keepUnusedDataFor: 0,
    }),

    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `accounts/delete_document_overview_list/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetDocumentByIdQuery,
  useEditDocumentMutation,
  useDeleteDocumentMutation,
} = AccountDocumentApi;

export default AccountDocumentApi;
