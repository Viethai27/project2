import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post("/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Đăng nhập thất bại"
    );
  }
};

export const register = async (userData) => {
  try {
    const response = await axiosInstance.post("/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Đăng ký thất bại"
    );
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("rememberMe");
  window.location.href = "/login";
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
