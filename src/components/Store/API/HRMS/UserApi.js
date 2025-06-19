import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const UsersApi = createApi({
  reducerPath: "UsersApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllUserData: builder.query({
      query: () => "get_all_users_new",
      transformResponse: (response) => response?.data?.paginatedUsers,
      // keepUnusedDataFor: 60 * 60 * 24,
    }),

    addGroup: builder.mutation({
      query: (addGroup) => ({
        url: "v1/group",
        method: "POST",
        body: addGroup,
      }),
    }),
    editGroup: builder.mutation({
      query: (updateGroup) => ({
        url: `v1/group`,
        method: "PUT",
        body: updateGroup,
      }),
    }),
    deleteGroup: builder.mutation({
      query: (id) => ({
        url: `v1/group/${id}`,
        method: "DELETE",
      }),
    }),

    monetizeGroupById: builder.query({
      query: (id) => ({
        url: `v1/group/${id}`,
        transformResponse: (response) => response.data,
      }),
    }),
  }),
});

export const {
  useAddGroupMutation,
  useEditGroupMutation,
  useDeleteGroupMutation,
  useMonetizeGroupByIdQuery,

  useGetAllUserDataQuery,
} = UsersApi;

export default UsersApi;
