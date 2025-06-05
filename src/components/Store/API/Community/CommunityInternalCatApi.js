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
    // ── GET ALL INTERNAL CATEGORIES
    getAllCommunityInternalCats: builder.query({
      query: () => "/v1/community/internal_category",
      transformResponse: (response) => response?.data,
      providesTags: ["communityInternalCat"],
    }),

    // ── CREATE INTERNAL CATEGORY
    createCommunityInternalCat: builder.mutation({
      query: (payload) => ({
        url: "/v1/community/internal_category",
        method: "POST",
        body: payload,
      }),
    }),

    // ── UPDATE INTERNAL CATEGORY
    updateCommunityInternalCatById: builder.mutation({
      query: ({ body }) => ({
        url: "/v1/community/internal_category/",
        method: "PUT",
        body,
      }),
    }),

    // ── DELETE INTERNAL CATEGORY
    deleteCommunityInternalCatById: builder.mutation({
      query: (id) => ({
        url: `/v1/community/internal_category/${id}`,
        method: "DELETE",
      }),
    }),

    // ── UPDATE PROJECTX PAGE CATEGORY / INTERNAL CATEGORY
    projectxUpdate: builder.mutation({
      query: ({ id, page_category_id, page_internal_category_id }) => ({
        url: `projectxupdate/`,
        method: "PUT",
        body: {
          id,
          ...(page_category_id && { page_category_id }),
          ...(page_internal_category_id && { page_internal_category_id }),
        },
      }),
    }),

    // ── GET SUPER TRACKER PAGES
    getSuperTrackerPagesByST: builder.query({
      query: () => "/v1/community/super_tracker_page_by_st/1",
      transformResponse: (response) => response?.data,
    }),

    // ── GET TEAM BY PAGE NAME
    getTeamByPageName: builder.query({
      query: (pageName) => `/v1/community/team_by_page_name/${pageName}`,
    }),

    // ── GET TEAM USERS BY PAGE NAME
    getTeamUsersByPageName: builder.mutation({
      query: (pageName) => ({
        url: `/v1/community/team_users`,
        method: "POST",
        body: { page_name: pageName },
      }),
    }),

    // ── GET ALL PROJECTX PAGES
    getAllProjectxPages: builder.query({
      query: () => "/getallprojectx",
      transformResponse: (response) => response?.data,
    }),

    // ── GET PAGE CATEGORIES
    getPageCategories: builder.query({
      query: () => "/projectxpagecategory",
      transformResponse: (response) => response?.data,
    }),

    // ── GET SUPER TRACKER POST ANALYTICS
    getSuperTrackerPostAnalytics: builder.mutation({
      query: ({ startDate, endDate }) => ({
        url: "/v1/community/super_tracker_post_analytics",
        method: "POST",
        body: { startDate, endDate },
      }),
    }),

    // ── GET CATEGORY MANAGER BY USER
    getCategoryManagerByUser: builder.query({
      query: (userId) => `/v1/community/category_manager_by_user/${userId}`,
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
  useGetSuperTrackerPagesBySTQuery,
  useLazyGetTeamByPageNameQuery,
  useGetTeamUsersByPageNameMutation,
  useGetAllProjectxPagesQuery,
  useGetPageCategoriesQuery,
  useGetSuperTrackerPostAnalyticsMutation,
  useGetCategoryManagerByUserQuery,
} = communityInternalCatApi;

export default communityInternalCatApi;
