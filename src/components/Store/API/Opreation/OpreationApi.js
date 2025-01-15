import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const OperationApi = createApi({
  reducerPath: "operationApi",
  baseQuery: authBaseQuery,
  tagTypes: ["Operation"],
  endpoints: (builder) => ({

    getAllPlanXData: builder.query({
      query: () => "v1/planxlogs",
      transformResponse: (response) => response?.data,
    }),

  }),
});

export const { useGetAllPlanXDataQuery } = OperationApi;
export default OperationApi;


