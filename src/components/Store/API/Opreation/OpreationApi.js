import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const OperationApi = createApi({
  reducerPath: "operationApi",
  baseQuery: authBaseQuery,
  tagTypes: ["Operation"],
  endpoints: (builder) => ({
    // Endpoint to fetch all PlanX data
    getAllPlanXData: builder.query({
      query: () => "v1/planxlogs",
      transformResponse: (response) => response?.data,
    }),

    getPlanWiseData: builder.query({
      query: ({ selectPlan }) => {
        console.log("Page Query:", selectPlan); 
        return {
          url: `operation/operation_execution_master/${selectPlan}`, 
          method: "GET",
        };
      },
      transformResponse: (response) => response?.data,
    }),    
  }),
});

// Export hooks for each endpoint
export const { useGetAllPlanXDataQuery, useGetPlanWiseDataQuery } = OperationApi;

export default OperationApi;
