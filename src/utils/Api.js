// api.js
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { baseUrl } from "./config";

const api = axios.create({
  baseURL: baseUrl, // Replace with your API base URL
});

export const useApiInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Perform the desired action for 401 status code
          alert("Unauthorized access. Redirecting to login page.");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);
};

export default api;
