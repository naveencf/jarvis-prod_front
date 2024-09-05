import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./config";

const getToken = () => {
  return sessionStorage.getItem("token");
};

const authBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export default authBaseQuery;
