import { createApi } from "@reduxjs/toolkit/query/react";
import { authBaseInstaQuery } from "../../../../utils/authBaseQuery";


const MeetingVieCommunity = createApi({
  reducerPath: "MeetingVie",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAll: builder.query({
      query: () => "v1/page_tag_cat",
      transformResponse: (response) => response,
      keepUnusedDataFor: 0,
    }),


    // addTagCategory:builder.mutation({
    //     query:(payload)=>({
    //         url:"v1/page_tag_cat",
    //         method:"POST",
    //         body:payload
    //     }),
    // }),
    // updateTagCategory:builder.mutation({
    //     query:(payload)=>({
    //         url:"v1/page_tag_cat",
    //         method:"PUT",
    //         body:payload
    //     }),
    // }),
    // deleteTagCategory:builder.mutation({
    //     query:(id)=>({
    //         url:`v1/page_tag_cat/${id}`,
    //         method:"DELETE",
    //     }),
    // }),
   

    // getAllCatAssignment: builder.query({
    //   query: () => `v1/get_all_page_cat_assignment`,
    //   transformResponse: (response) => response.data.data,
    //   keepUnusedDataFor: 0,
    // }),
  }),
});

export const {
//   useGetAllTagCategoryQuery,
//   useAddTagCategoryMutation,
//   useUpdateTagCategoryMutation,
//   useDeleteTagCategoryMutation
  
  
} = TagCategoryApi;

export default TagCategoryApi;