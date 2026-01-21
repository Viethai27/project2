import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Có lỗi xảy ra");
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await axiosInstance.post("/reset-password", {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Có lỗi xảy ra");
  }
};
