import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const UsersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    // Fetch all Users data
    getAllUsersData: builder.query({
      query: () => "/get_all_users",
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const { useGetAllUsersDataQuery } = UsersApi;

export default UsersApi;
