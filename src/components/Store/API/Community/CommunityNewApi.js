// src/Store/API/UserApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../../utils/config";

const getToken = () => sessionStorage.getItem("token");

export const CommunityNewApi = createApi({
  reducerPath: "CommunityNewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPaginatedUsers: builder.query({
      queryFn: async (
        { page, limit, search,deptId } = {},
        _queryApi,
        _extraOptions,
        baseQuery
      ) => {
        const storedToken = sessionStorage.getItem("token");
        if (!storedToken) {
          return { error: { status: 401, message: "No token found" } };
        }

        const queryParams = [];
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if(search===""){
            if (deptId) queryParams.push(`dept_id=${deptId}`);
        }
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);

        const queryString =
          queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

        const res = await baseQuery({
          url: `${baseUrl}/get_all_users_new${queryString}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.error) {
          return { error: res.error };
        }

        return { data: res.data.data || [] };
      },
      keepUnusedDataFor: 600,  
    }),
  }),
});

export const { useGetPaginatedUsersQuery } = CommunityNewApi;
export default CommunityNewApi;
