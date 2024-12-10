import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const CatAssignment = createApi({
  reducerPath: "CatAssignment",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllCatAssignment: builder.query({
      query: () => "v1/get_all_page_cat_assignment",
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetAllCatAssignmentQuery } = CatAssignment;

export default CatAssignment;
