import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./config";

const getToken = () => {
  return sessionStorage.getItem("token");
};

const authBaseQuery = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.meta?.response) {
    const statusCode = result.meta.response.status;
    // const headers = result.meta.response.headers;

    // Handle specific status codes
    if (statusCode === 401) {
      sessionStorage.clear("token");
      alert("Session expired. Please login again.");
    }

    // Example: Extract a custom header
    // const customHeader = headers.get("X-Custom-Header");
    // if (customHeader) {
    //   console.log("Custom Header Value:", customHeader);
    // }
  }

  return result;
};

export default authBaseQuery;
