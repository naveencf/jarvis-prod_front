import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../utils/authBaseQuery";
import { get } from "jquery";
import jwtDecode from "jwt-decode";
import { use } from "react";

export const PageBaseURL = createApi({
  baseQuery: authBaseQuery,
  reducerPath: "PageBaseURL",
  tagTypes: [
    "profileList",
    "categoryList",
    "PageList",
    "subCategoryList",
    "pageClosedbyList",
    "getPageCount",
  ],
  endpoints: (builder) => ({
    getAllProfileList: builder.query({
      query: () => `v1/profile_type`,
      providesTags: ["profileList"],
    }),
    addProfileType: builder.mutation({
      query: (data) => ({
        url: `v1/profile_type`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["profileList"],
    }),
    updateProfileType: builder.mutation({
      query: (data) => ({
        url: `v1/profile_type/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["profileList"],
    }),
    addPageCategory: builder.mutation({
      query: (data) => ({
        // url: `projectxpagecategory`,
        url: `v1/page_category`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categoryList"],
    }),
    getAllPageCategory: builder.query({
      // query: () => `getPageCatgList`,
      query: () => `v1/page_category`,
      // query: () => `projectxpagecategory`,
      providesTags: ["categoryList"],
    }),

    updatePageCategory: builder.mutation({
      query: (data) => {
        const { _id, ...payload } = data;
        // console.log(data, 'hello data')
        return {
          url: `v1/page_category/${_id}`,
          method: "PUT",
          body: {
            page_category: payload.page_category,
            description: payload.description,
            last_updated_by: payload.last_updated_by,
            // ...payload
          },
        };
      },
    }),

    //price List
    getAllPriceList: builder.query({
      query: () => `getPriceList`,
    }),

    // Platform Price
    addPlatformPrice: builder.mutation({
      query: (data) => ({
        url: `v1/pagePriceType`,
        method: "POST",
        body: data,
      }),
    }),
    getPlatformPrice: builder.query({
      query: () => `v1/pagePriceType`,
      transformResponse: (response) => response.data,
    }),
    updatePlatformPrice: builder.mutation({
      query: (data) => {
        const { _id, ...bodyWithoutId } = data;
        return {
          url: `v1/pagePriceType/${_id}`,
          method: "PUT",
          body: bodyWithoutId,
        };
      },
    }),

    getAllCountWisePage: builder.query({
      query: ({ activeTab }) => `/v1/count_page_group/${activeTab}`,
      method: "GET",
      transformResponse: (response) => response.data,
    }),

    //Page ALl Pages
    getAllPageList: builder.query({
      query: ({ decodedToken, userID, pagequery, limit, page, search }) => {
        const isAdmin = decodedToken?.role_id === 1;
        let queryParams = pagequery ? `${pagequery}` : "";

        // Append limit & page only if they are provided (not undefined or null)
        if (limit !== undefined) queryParams += `&limit=${limit}`;
        if (page !== undefined) queryParams += `&page=${page}`;
        if (search !== undefined) queryParams += `&search${search}`;

        return isAdmin
          ? {
              url: `v1/get_all_pages?${queryParams}`, // Admin: GET request
              method: "GET",
            }
          : {
              url: `v1/get_all_pages?${queryParams}`, // Admin: GET request
              method: "GET",
              // url: `v1/get_all_pages_for_users/${userID}`, // User: GET request
              // method: "GET",
            };
      },
      transformResponse: (response, meta, { decodedToken }) => {
        const isAdmin = decodedToken?.role_id === 1;
        const pageData = isAdmin
          ? response.data.pageData || [] // Admin response structure
          : response.data || []; // User response structure

        return pageData.sort((a, b) => b.followers_count - a.followers_count);
      },
      keepUnusedDataFor: 300,
    }),
    getAllPageListWithPagination: builder.query({
      query: ({ decodedToken, userID, pagequery, limit, page, search }) => {
        const isAdmin = decodedToken?.role_id === 1;
        let queryParams = [];

        if (pagequery) queryParams.push(pagequery);

        if (limit !== undefined) queryParams.push(`limit=${limit}`);
        if (page !== undefined) queryParams.push(`page=${page}`);
        if (search !== undefined)
          queryParams.push(`page_name=${encodeURIComponent(search)}`);

        const queryString =
          queryParams.length > 0 ? `${queryParams.join("&")}` : "";
        return isAdmin
          ? {
              url: `v1/get_all_pages?${queryString}`, // Admin: GET request
              method: "GET",
            }
          : {
              url: `v1/get_all_pages_for_users/${userID}`, // User: GET request
              method: "GET",
              // body: { user_id: userID },
            };
      },
      transformResponse: (response, meta, { decodedToken }) => {
        const isAdmin = decodedToken?.role_id === 1;

        const pageData = isAdmin
          ? response.data.pageData || [] // Admin response structure
          : response.data || []; // User response structure

        const sortedPages = pageData.sort(
          (a, b) => b.followers_count - a.followers_count
        );

        const pagesData = {
          pages: sortedPages,
          pagination: isAdmin ? response.data?.pagination : null,
        };

        return pagesData;
      },
      keepUnusedDataFor: 300,
    }),
    getPageById: builder.query({
      query: (id) => `v1/pageMaster/${id}`,
      transformResponse: (response) => response.data,
    }),
    getSpecificPages: builder.query({
      query: () => `v1/retrive_all_pages_specific_data`,
      transformResponse: (response) => response.data.pageData,
    }),

    //Page price Multiple
    getMultiplePagePrice: builder.query({
      query: (data) => `v1/pagePriceMultipleByPageId/${data}`,
      transformResponse: (response) => response.data,
    }),

    // getpagePriceType
    getpagePriceType: builder.query({
      query: () => `v1/pagePriceType`,
      transformResponse: (response) => response.data,
    }),

    // page States
    addPageState: builder.mutation({
      query: (data) => ({
        url: `v1/page_states`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pageState"],
    }),
    getPageState: builder.query({
      query: () => `v1/page_states`,
      transformResponse: (response) => response.data,
      providesTags: ["pageState"],
    }),
    getPageStateById: builder.query({
      query: (data) => `v1/page_states/${data}`,
      transformResponse: (response) => response.data,
    }),
    updatePageState: builder.mutation({
      query: (data) => ({
        url: `v1/page_states/${data.id}`,
        method: "PUT",
        body: data.formData,
      }),
    }),

    //cities
    getAllCities: builder.query({
      query: () => `get_all_cities`,
      transformResponse: (response) => response.data,
    }),

    //ownership type
    getOwnershipType: builder.query({
      query: () => `accounts/get_all_account_company_type`,
      transformResponse: (response) => response.data,
    }),
    //vendor document count
    getCountDocuments: builder.query({
      query: () => `v1/count_documents/`,
      transformResponse: (response) => response.data,
    }),
    //Vendor company detail by vendor id
    getVendorCompanyDetail: builder.query({
      query: (data) => `v1/company_name_wise_vendor/${data}`,
      transformResponse: (response) => response.data,
    }),

    addPageSubCategory: builder.mutation({
      query: (data) => ({
        url: `v1/page_sub_category`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subCategoryList"],
    }),

    updatePageSubCategory: builder.mutation({
      query: (data) => {
        const { _id, ...payload } = data;
        return {
          url: `v1/page_sub_category/${_id}`,
          method: "PUT",
          body: {
            page_sub_category: payload.sub_category_name,
            description: payload.description,
            last_updated_by: payload.last_updated_by,
            ...payload,
          },
        };
      },
      invalidatesTags: ["subCategoryList"],
    }),

    deletePageSubCategory: builder.mutation({
      query: (id) => {
        return {
          url: `v1/page_sub_category/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["subCategoryList"],
    }),

    getAllPageSubCategory: builder.query({
      query: () => `v1/page_sub_category`,
      providesTags: ["subCategoryList"],
    }),

    deletePageCategory: builder.mutation({
      query: (id) => {
        return {
          url: `v1/page_category/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["categoryList"],
    }),

    //PageCloseby
    // getAllPageClosebyList: builder.query({
    //   query: (bodyData) => ({
    //     url: `v1/get_page_count`,
    //     method: "POST",
    //     body: bodyData,
    //   }),
    //   providesTags: ["pageClosedbyList"],
    // }),
    getAllCounts: builder.query({
      query: () => `v1/get_all_counts`,
      transformResponse: (response) => response.data,
    }),

    // get page counts
    getPageCount: builder.query({
      query: ({ start_date, end_date } = {}) => {
        let url = "v1/get_page_count";
        if (start_date || end_date) {
          url += `?${start_date ? `start_date=${start_date}` : ""}${
            start_date && end_date ? "&" : ""
          }${end_date ? `end_date=${end_date}` : ""}`;
        }

        return {
          url,
          method: "GET",
        };
      },
    }),

    //get category wise invetory details
    getAllCategoryWiseInventory: builder.query({
      query: (platform) => `v1/category_wise_inventory_details/${platform}`,
      transformResponse: (response) => {
        return response.data.sort(
          (a, b) => b.totalPageCount - a.totalPageCount
        ); // Ascending order
      },
    }),

    getOperationContentCost: builder.query({
      query: () => `v1/operation_content_cost`,
      transformResponse: (response) => response?.data[0],
    }),

    updateOperationContentCost: builder.mutation({
      query: (data) => ({
        url: `v1/operation_content_cost`,
        method: "PUT",
        body: {
          id: data._id,
          operation_cost: Number(data.operation_cost),
          content_cost: Number(data.content_cost),
          twitter_trend_cost: Number(data.twitter_trend_cost),
          ugc_video_cost: Number(data.ugc_video_cost),
        },
      }),
    }),
    // Vendor Pages
    getPageByVendorId: builder.query({
      query: (vendorId) => `v1/vendor_wise_page_master_data/${vendorId}`,
      transformResponse: (response) => response.data,
    }),

    getPageLogsById: builder.query({
      query: (page_id) => `v1/get_page_master_log_data?page_id=${page_id}`,
      transformResponse: (response) => response.data.data,
    }),

    getStateandCityVendoDataCount: builder.query({
      query: () => `v1/count_vendor_with_state_and_city`,
      transformResponse: (response) => response.data,
    }),

    getVendorDataWithStateCity: builder.query({
      query: ({ home_city, home_state }) => {
        let url = "v1/get_vendor_data_with_state_or_city";

        if (home_city && !home_state) {
          url += `?home_city=${home_city}`;
        } else if (home_state && !home_city) {
          url += `?home_state=${home_state}`;
          console.log(home_state, "home_state");
        }

        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response) => response.data,
    }),

    getVendorWithCategory: builder.query({
      query: ({ vendor_category, vendor_platform }) => {
        let url = "v1/get_vendor_statistic_data";

        if (vendor_category && !vendor_platform) {
          url += `?vendor_category=${vendor_category}`;
        } else if (vendor_platform && !vendor_category) {
          url += `?vendor_platform=${vendor_platform}`;
          console.log(vendor_platform, "vendor_platform");
        }

        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response) => response.data,
    }),

    getPageCountWithState: builder.mutation({
      query: (body) => ({
        url: "v1/get_page_count_with_state",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response.data,
    }),
    getVendorRetain: builder.mutation({
      query: (body) => ({
        url: "v1/convert_disable_vendor_to_enable_in_vendor",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response.data,
    }),

    getDeletedVendorData: builder.query({
      query: () => `v1/deleted_vendor`,
      transformResponse: (response) => response.data,
    }),

    getAllSubCategoryWiseInventory: builder.query({
      query: ({ page_category_name } = {}) => {
        let url = `v1/sub_category_wise_inventory_details`;
        if (page_category_name) {
          url += `?page_sub_category=${page_category_name}`;
        }
        return url;
      },
      transformResponse: (response) => response.data,
    }),

    getRecentlyLogs: builder.query({
      query: () => `v1/get_recently_log_page`,
      transformResponse: (response) => response.data,
    }),

    getVendorStaticsCountData: builder.query({
      query: () => `v1/count_vendor_data_statistic`,
      transformResponse: (response) => response.data,
    }),
    getVendorWithoutWhatsappLink: builder.query({
      query: () => `v1/unlinked_vendors`,
      transformResponse: (response) => response.data,
    }),

    getPlanxlogDateWise: builder.query({
      query: ({ month_year, status }) => 
        `v1/planxlog_date_wise?month_year=${encodeURIComponent(month_year)}&status=${status}`,
    }),
    // getVendorDataWithStateCity: builder.query({
    //   //   query: (city) =>
    //   //     `v1/get_vendor_data_with_state_or_city?home_city=${city}`,
    //   //   transformResponse: (response) => response.data,
    //   // }),
    //   query: ({ home_city, home_state } = {}) => {
    //     let url = "v1/get_vendor_data_with_state_or_city";
    //     if (home_city || home_state) {
    //       url += `?${home_city ? `home_city=${home_city}` : ""}${
    //         start_date && end_date ? "&" : ""
    //       }${home_state ? `home_state=${home_state}` : ""}`;
    //     }

    //     return {
    //       url,
    //       method: "GET",
    //     };
    //   },
    //   transformResponse: (response) => response.data,
    // }),
  }),
});

export const {
  useGetAllProfileListQuery,
  useAddProfileTypeMutation,
  useUpdateProfileTypeMutation,
  useAddPageCategoryMutation,
  useGetAllPageCategoryQuery,
  useUpdatePageCategoryMutation,
  useGetAllPriceListQuery,
  useAddPlatformPriceMutation,
  useGetPlatformPriceQuery,
  useUpdatePlatformPriceMutation,
  useGetAllPageListQuery,
  useGetAllPageListWithPaginationQuery,
  useGetSpecificPagesQuery,
  useGetPageByIdQuery,
  useGetMultiplePagePriceQuery,
  useGetpagePriceTypeQuery,
  useAddPageStateMutation,
  useGetPageStateQuery,
  useGetPageStateByIdQuery,
  useUpdatePageStateMutation,
  useGetAllCitiesQuery,
  useGetOwnershipTypeQuery,
  useGetVendorCompanyDetailQuery,
  useAddPageSubCategoryMutation,
  useUpdatePageSubCategoryMutation,
  useDeletePageSubCategoryMutation,
  useGetAllPageSubCategoryQuery,
  useDeletePageCategoryMutation,
  useGetAllCountsQuery,
  useGetAllPageClosebyListQuery,
  useGetPageCountQuery,
  useGetAllCategoryWiseInventoryQuery,
  useGetCountDocumentsQuery,
  useGetOperationContentCostQuery,
  useUpdateOperationContentCostMutation,
  useGetPageByVendorIdQuery,
  useGetPageLogsByIdQuery,
  useGetAllCountWisePageQuery,
  useGetStateandCityVendoDataCountQuery,
  useGetVendorDataWithStateCityQuery,
  useGetPageCountWithStateMutation,
  useGetDeletedVendorDataQuery,
  useGetVendorRetainMutation,
  useGetAllSubCategoryWiseInventoryQuery,
  useGetRecentlyLogsQuery,
  useGetVendorStaticsCountDataQuery,
  useGetVendorWithCategoryQuery,
  useGetVendorWithoutWhatsappLinkQuery,
  useGetPlanxlogDateWiseQuery
} = PageBaseURL;
