import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosApi = axios.create({
  baseURL: API_BASE_URL,
});

axiosApi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("auth_token");
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
const handlePostApi = async (apiName, data = {}) => {
  try {
    const response = await axiosApi.post(apiName, data);
    return response.data;
  } catch (error) {
    console.error(`POST ${apiName} failed:`, error);
    throw error;
  }
};

export { handleGetApi, handlePostApi };
