import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const GetGstDetailApi = createApi({
  reducerPath: "GetGstDetailApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://insights.ist:8080", // Set your actual base URL here
    prepareHeaders: (headers) => {
      headers.set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8"
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    GstDetails: builder.mutation({
      query: (gstDetails) => ({
        url: "/api/v1/get_gst_details", // Adjust the endpoint path
        method: "POST",
        body: gstDetails,
      }),
      transformResponse: (response) =>
        response?.data?.enrichment_details?.online_provider?.details,
    }),
  }),
});

export const { useGstDetailsMutation } = GetGstDetailApi;

export default GetGstDetailApi;
