import axios from "axios";
import { ApiResponse } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth endpoints
  auth: {
    register: (data: { email: string; password: string; name: string }) =>
      apiClient.post<ApiResponse<any>>("/auth/register", data),
    // login: (data: { email: string; password: string }) =>
    //   apiClient.post<ApiResponse<any>>("/auth/login-account", data),
    verifyOtp: (data: { email: string; otp: string }) =>
      apiClient.post<ApiResponse<any>>("/auth/verify-otp", data),
    resendOtp: (data: { email: string }) =>
      apiClient.post<ApiResponse<any>>("/auth/resend-otp", data),
  },

  // Categories
  categories: {
    getAll: () => apiClient.get<ApiResponse<any[]>>("/categories/get-all"),
    create: (data: any) =>
      apiClient.post<ApiResponse<any>>("/categories/create", data),
    update: (id: string, data: any) =>
      apiClient.post<ApiResponse<any>>(`/categories/update/${id}`, data),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<any>>(`/categories/delete/${id}`),
  },

  // Income
  income: {
    getAll: (params?: any) =>
      apiClient.get<ApiResponse<any[]>>("/income/get-all", { params }),
    create: (data: any) =>
      apiClient.post<ApiResponse<any>>("/income/create", data),
    update: (id: string, data: any) =>
      apiClient.post<ApiResponse<any>>(`/income/update/${id}`, data),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<any>>(`/income/delete/${id}`),
  },

  // Expenses
  expenses: {
    getAll: (params?: any) =>
      apiClient.get<ApiResponse<any[]>>("/expenses/get-all", { params }),
    create: (data: any) =>
      apiClient.post<ApiResponse<any>>("/expenses/create", data),
    update: (id: string, data: any) =>
      apiClient.post<ApiResponse<any>>(`/expenses/update/${id}`, data),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<any>>(`/expenses/delete/${id}`),
  },

  // Budgets
  budgets: {
    getAll: () => apiClient.get<ApiResponse<any[]>>("/budgets/get-all"),
    create: (data: any) =>
      apiClient.post<ApiResponse<any>>("/budgets/create", data),
    update: (id: string, data: any) =>
      apiClient.post<ApiResponse<any>>(`/budgets/update/${id}`, data),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<any>>(`/budgets/delete/${id}`),
  },

  // Financial Goals
  goals: {
    getAll: () => apiClient.get<ApiResponse<any[]>>("/financial-goals/get-all"),
    create: (data: any) =>
      apiClient.post<ApiResponse<any>>("/financial-goals/create", data),
    update: (id: string, data: any) =>
      apiClient.post<ApiResponse<any>>(`/financial-goals//update/${id}`, data),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<any>>(`/financial-goals/delete/${id}`),
  },

  // Dashboard
  dashboard: {
    getStats: () => apiClient.get<ApiResponse<any>>("/dashboard/stats"),
  },
};
