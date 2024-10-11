import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../utils/authBaseQuery";
import { get } from "jquery";

export const PageBaseURL = createApi({
  baseQuery: authBaseQuery,
  reducerPath: "PageBaseURL",
  tagTypes: ["profileList", "categoryList", "PageList", "subCategoryList"],
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
    // updatePageCategory: builder.mutation({
    //   query: (data) => {
    //     const { _id, category_name } = data;
    //     return {
    //       url:()=>`v1/page_category/${_id}`,
    //       // url: `projectxpagecategory`, // or use the commented out URL if needed: `v1/page_category/${_id}`,
    //       method: "PUT",
    //       body: {
    //         // id: _id,
    //         page_category: category_name,
    //         description: data.description,
    //         last_updated_by:data.last_updated_by
    //         // category_name: category_name
    //       },
    //     };
    //   },
    //   invalidatesTags: ["categoryList"],
    // }),

    updatePageCategory: builder.mutation({
      query: (data) => {
        const { _id, category_name } = data;
        return {
          url: `v1/page_category/${_id}`, // Directly assign the URL string
          method: "PUT",
          body: {
            page_category: category_name,
            description: data.description,
            last_updated_by: data.last_updated_by,
          },
        };
      },
      invalidatesTags: ["categoryList"], // Assuming you might want to invalidate cache after update
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

    //Page
    getAllPageList: builder.query({
      query: () => `v1/pageMaster`,
    }),
    getPageById: builder.query({
      query: (id) => `v1/pageMaster/${id}`,
      transformResponse: (response) => response.data,
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
        const { _id, sub_category_name } = data;
        return {
          url: `v1/page_sub_category/${_id}`,
          method: "PUT",
          body: {
            page_sub_category: sub_category_name,
            description: data.description,
            last_updated_by: data.last_updated_by,
          },
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
          url: `v1/page_category/${id}`, // Directly assign the URL string
          method: "DELETE",
          
        };
      },
      invalidatesTags: ["categoryList"], // Assuming you might want to invalidate cache after update
    }),
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
  useGetAllPageSubCategoryQuery,
  useDeletePageCategoryMutation,
} = PageBaseURL;
