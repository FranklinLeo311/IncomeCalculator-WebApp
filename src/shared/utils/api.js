import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosApi = axios.create({
  baseURL: API_BASE_URL,
});

axiosApi.interceptors.request.use(
  (config) => {
    // const token = sessionStorage.getItem("auth_token");
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiUmFteWEgTXVuaXJhdGhuYW0iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJybXVuaXJhdGhuYW1AY2EtdXNhLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiOTEiLCJuYmYiOiIxNzYyNDkzNjE1IiwiZXhwIjoiMTc2MjU4MDAxNSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ik1hc3RlciBBZG1pbiIsIlBlcm1pc3Npb24iOlsiVXNlciBNYW5hZ2VtZW50IiwiRnVsbCBBY2Nlc3MiLCJXcml0ZSBBY2Nlc3MiLCJSZWFkIE9ubHkgQWNjZXNzIiwiUmVwb3J0cyIsIkRvY3VtZW50IFVwbG9hZCIsIkNyZWF0ZSBMb2FuIiwiRWRpdCBMb2FuIElEIiwiRGVsZXRlIExvYW4iXX0.ke81ZzIi4F7a6sg0lgbas8oyazc3dzscZuS_UoI_Vu4`;

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
    const { outStatus, outJSON } = response.data;
    if (outStatus === "pass") {
      return outJSON;
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
const handlePostApi = async (apiName, data = {}, contentType = 'application/json') => {
  try {
    const config = {
      headers: {
        'Content-Type': contentType,
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
