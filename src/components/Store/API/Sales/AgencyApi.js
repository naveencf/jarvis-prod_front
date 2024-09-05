import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const AgencyApi = createApi({
  reducerPath: "agencyApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllAgencies: builder.query({
      query: () => "get_all_agencys",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),
    getSingleAgency: builder.query({
      query: (id) => `get_single_agency/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),
    addAgency: builder.mutation({
      query: (agencyData) => ({
        url: "add_agency",
        method: "POST",
        body: agencyData,
      }),
    }),

    editAgency: builder.mutation({
      query: ({ id, ...updatedAgency }) => ({
        url: `update_agency/${id}`,
        method: "PUT",
        body: updatedAgency,
      }),
    }),
    deleteAgency: builder.mutation({
      query: (id) => ({
        url: `delete_agency/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllAgenciesQuery,
  useGetSingleAgencyQuery,
  useEditAgencyMutation,
  useAddAgencyMutation,
  useDeleteAgencyMutation,
} = AgencyApi;

export default AgencyApi;
