import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosApi = axios.create({
  baseURL: API_BASE_URL,
});

axiosApi.interceptors.request.use(
  (config) => {
    // const token = sessionStorage.getItem("auth_token");
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiUmFteWEgTSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InJtdW5pcmF0aG5hbUBjYS11c2EuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI2NyIsIm5iZiI6IjE3NjI4Mzg5NzMiLCJleHAiOiIxNzYyOTI1MzczIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiTWFzdGVyIEFkbWluIiwiUGVybWlzc2lvbiI6WyJVc2VyIE1hbmFnZW1lbnQiLCJGdWxsIEFjY2VzcyJdfQ.RxgJ2AwmVoTqw-UmXj4qkR7iEZKAtV0LJR-G0SzKGbw`;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// GET request
const handleGetApi = async (apiName, params = {}) => {
  try {
    const response = await axiosApi.get(apiName, { params });

    if (response.data) {
      return response.data;
    } else {
      console.error(`GET ${apiName} failed:`, outStatus);
      return null;
    }
  } catch (error) {
    console.error(`GET ${apiName} failed:`, error);
    throw error;
  }
};

// POST request
const handlePostApi = async (
  apiName,
  data = {},
  contentType = "application/json"
) => {
  try {
    const config = {
      headers: {
        "Content-Type": contentType,
      },
    };
    const response = await axiosApi.post(apiName, data, config);
    return response.data;
  } catch (error) {
    console.error(`POST ${apiName} failed:`, error);
    throw error;
  }
};

export { handleGetApi, handlePostApi };
