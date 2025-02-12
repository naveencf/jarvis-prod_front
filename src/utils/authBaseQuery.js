import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./config";

const getToken = () => sessionStorage.getItem("token");

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

const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;

  try {
    const tokenData = JSON.parse(atob(token.split(".")[1])); // Decode JWT
    return tokenData.exp * 1000 < Date.now();
  } catch (err) {
    console.error("Error decoding token:", err);
    return true;
  }
};

const authBaseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.meta?.response) {
    const statusCode = result.meta.response.status;

    if (statusCode === 401) {
      if (!getToken() || isTokenExpired()) {
        console.warn("Token expired or invalid. Logging out...");
        sessionStorage.clear();
        localStorage.removeItem("tab");
        window.location.href = "/login";
        return;
      }
    }

    // Handle errors explicitly
    if (statusCode >= 400) {
      throw new Error(
        result.data?.message || `Request failed with status ${statusCode}`
      );
    }
  }

  return result;
};

export default authBaseQuery;
