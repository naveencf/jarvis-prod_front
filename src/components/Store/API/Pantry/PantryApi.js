import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const PantryApi = createApi({
  reducerPath: "pantryApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getPantryById: builder.query({
      query: (id) => `v1/cf_pentry_status`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),
    createPantry: builder.mutation({
      query: (userStatus) => ({
        url: `v1/add_user_to_online`,
        method: "POST",
        body: userStatus,
      }),
      keepUnusedDataFor: 0,
    }),
    offlineFromPantry: builder.mutation({
      query: (userDetail) => ({
        url: `v1/user_offline`,
        method: "POST",
        body: userDetail,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetPantryByIdQuery,
  useCreatePantryMutation,
  useOfflineFromPantryMutation,
} = PantryApi;

export default PantryApi;
