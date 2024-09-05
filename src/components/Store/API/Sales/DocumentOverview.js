import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const DocumentOverviewApi = createApi({
  reducerPath: "documentOverviewApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getSingleDocumentOverview: builder.query({
      query: (id) => `/accounts/get_document_overview/${id}`,
      transformErrorResponse: (Response) => Response.data,

      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetSingleDocumentOverviewQuery } = DocumentOverviewApi;

export default DocumentOverviewApi;
