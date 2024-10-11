import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const TagCategoryApi = createApi({
  reducerPath: "TagCategoryApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllTagCategory: builder.query({
      query: () => "v1/page_tag_cat",
      transformResponse: (response) => response,
      keepUnusedDataFor: 0,
    }),

    addTagCategory:builder.mutation({
        query:(payload)=>({
            url:"v1/page_tag_cat",
            method:"POST",
            body:payload
        }),
    }),
    updateTagCategory:builder.mutation({
        query:(payload)=>({
            url:"v1/page_tag_cat",
            method:"PUT",
            body:payload
        }),
    }),
    deleteTagCategory:builder.mutation({
        query:(id)=>({
            url:`v1/page_tag_cat/${id}`,
            method:"DELETE",
        }),
    })
   
  }),
});

export const {
  useGetAllTagCategoryQuery,
  useAddTagCategoryMutation,
  useUpdateTagCategoryMutation,
  useDeleteTagCategoryMutation
  
} = TagCategoryApi;

export default TagCategoryApi;