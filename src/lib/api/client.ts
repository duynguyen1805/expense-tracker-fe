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
    getAll: () => apiClient.get<ApiResponse<any[]>>("/categories"),
    create: (data: any) =>
      apiClient.post<ApiResponse<any>>("/categories", data),
    update: (id: string, data: any) =>
      apiClient.put<ApiResponse<any>>(`/categories/${id}`, data),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<any>>(`/categories/${id}`),
  },

  // Income
  income: {
    getAll: (params?: any) =>
      apiClient.get<ApiResponse<any[]>>("/income", { params }),
    create: (data: any) => apiClient.post<ApiResponse<any>>("/income", data),
    update: (id: string, data: any) =>
      apiClient.put<ApiResponse<any>>(`/income/${id}`, data),
    delete: (id: string) => apiClient.delete<ApiResponse<any>>(`/income/${id}`),
  },

  // Expenses
  expenses: {
    getAll: (params?: any) =>
      apiClient.get<ApiResponse<any[]>>("/expenses", { params }),
    create: (data: any) => apiClient.post<ApiResponse<any>>("/expenses", data),
    update: (id: string, data: any) =>
      apiClient.put<ApiResponse<any>>(`/expenses/${id}`, data),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<any>>(`/expenses/${id}`),
  },

  // Budgets
  budgets: {
    getAll: () => apiClient.get<ApiResponse<any[]>>("/budgets"),
    create: (data: any) => apiClient.post<ApiResponse<any>>("/budgets", data),
    update: (id: string, data: any) =>
      apiClient.put<ApiResponse<any>>(`/budgets/${id}`, data),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<any>>(`/budgets/${id}`),
  },

  // Financial Goals
  goals: {
    getAll: () => apiClient.get<ApiResponse<any[]>>("/financial-goals"),
    create: (data: any) =>
      apiClient.post<ApiResponse<any>>("/financial-goals", data),
    update: (id: string, data: any) =>
      apiClient.put<ApiResponse<any>>(`/financial-goals/${id}`, data),
    delete: (id: string) =>
      apiClient.delete<ApiResponse<any>>(`/financial-goals/${id}`),
  },

  // Dashboard
  dashboard: {
    getStats: () => apiClient.get<ApiResponse<any>>("/dashboard/stats"),
  },
};
