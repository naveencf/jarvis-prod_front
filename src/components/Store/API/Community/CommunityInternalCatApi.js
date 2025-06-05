import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { insightsBaseUrl } from "../../../../utils/config";

const getToken = () => sessionStorage.getItem("token");

const communityInternalCatApi = createApi({
  reducerPath: "communityInternalCatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://insights.ist:8080/api",
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["communityInternalCat"],

  endpoints: (builder) => ({
    // ── GET ALL
    getAllCommunityInternalCats: builder.query({
      query: () => "/v1/community/internal_category",
      transformResponse: (response) => response?.data,
      providesTags: ["communityInternalCat"],
    }),

    // ── CREATE
    createCommunityInternalCat: builder.mutation({
      query: (payload) => ({
        url: "/v1/community/internal_category",
        method: "POST",
        body: payload,
      }),
    }),

    // ── UPDATE
    updateCommunityInternalCatById: builder.mutation({
      query: ({ body }) => ({
        url: `/v1/community/internal_category/`,
        method: "PUT",
        body,
      }),
    }),

    // ── DELETE
    deleteCommunityInternalCatById: builder.mutation({
      query: (id) => ({
        url: `/v1/community/internal_category/${id}`,
        method: "DELETE",
      }),
    }),
    // ── UPDATE PROJECTX
    projectxUpdate: builder.mutation({
      query: ({ body }) => ({
        url: `projectxupdate/`,
        method: "PUT",
        body,
      }),
    }),

    // ── GET SUPER TRACKER PAGES
    getSuperTrackerPagesByST: builder.query({
      query: () => "/v1/community/super_tracker_page_by_st/1",
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const {
  useGetAllCommunityInternalCatsQuery,
  useCreateCommunityInternalCatMutation,
  useUpdateCommunityInternalCatByIdMutation,
  useDeleteCommunityInternalCatByIdMutation,
  useProjectxUpdateMutation,
  useGetSuperTrackerPagesBySTQuery
} = communityInternalCatApi;

export default communityInternalCatApi;
