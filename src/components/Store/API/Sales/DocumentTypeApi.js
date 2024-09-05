import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const DocumentTypeApi = createApi({
  reducerPath: "documentTypeApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllDocumentType: builder.query({
      query: () => "accounts/get_document_master_list",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    getSingleDocumentType: builder.query({
      query: (id) => `accounts/get_document_overview/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    addDocumentType: builder.mutation({
      query: (Documentsdata) => ({
        url: "accounts/add_document_master",
        method: "POST",
        body: Documentsdata,
      }),
      onQueryStarted: async (Documentsdata, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedDocumnet } = await queryFulfilled;

          dispatch(
            DocumentTypeApi.util.updateQueryData(
              "getAllDocumentType",
              undefined,
              (draft) => {
                draft.unshift(addedDocumnet.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add account type:", error);
        }
      },
    }),

    editDocumentType: builder.mutation({
      query: ({ id, ...updatedDocument }) => ({
        url: `accounts/update_document_master/${id}`,
        method: "PUT",
        body: updatedDocument,
      }),
      onQueryStarted: async (
        { id, ...updatedDocument },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedDocument } = await queryFulfilled;

          dispatch(
            DocumentTypeApi.util.updateQueryData(
              "getAllDocumentType",
              undefined,
              (draft) => {
                const DocumentIndex = draft.findIndex((Doc) => Doc._id === id);

                if (DocumentIndex !== -1) {
                  draft[DocumentIndex] = returnedDocument.data; // Update the object in its current position
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit account type:", error);
        }
      },
    }),

    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `accounts/delete_document_master/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(
            DocumentTypeApi.util.updateQueryData(
              "getAllDocumentType",
              undefined,
              (draft) => {
                return draft.filter((account) => account.id !== id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete account type:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllDocumentTypeQuery,
  useGetSingleDocumentTypeQuery,
  useAddDocumentTypeMutation,
  useEditDocumentTypeMutation,
  useDeleteDocumentMutation,
} = DocumentTypeApi;

export default DocumentTypeApi;
