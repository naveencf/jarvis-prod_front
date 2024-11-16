import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const CreditNoteApi = createApi({
  reducerPath: "OutstandingApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    updateCreditNote: builder.mutation({
      query: ({ id, data }) => ({
        url: `sales/credit_note_by_finance/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useUpdateCreditNoteMutation } = CreditNoteApi;

export default CreditNoteApi;
