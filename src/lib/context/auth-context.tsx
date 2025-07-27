"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/lib/types";
import { api } from "../api/client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, twoFaCode?: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => void;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("auth_token");
    const refresh = localStorage.getItem("refresh_token");
    const userData = localStorage.getItem("user_data");

    if (token && refresh && userData) {
      try {
        setUser(JSON.parse(userData));
        setAccessToken(token);
        setRefreshTokenValue(refresh);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_data");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, twoFaCode?: string) => {
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const body: any = { email, password };
      if (twoFaCode) body.twoFaCode = twoFaCode;

      const response = await fetch(`${API_BASE_URL}/auth/login-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const res = await response.json();

      if (!response.ok) {
        if (res.code) throw res;
        throw new Error(res.message || "Login failed");
      }

      localStorage.setItem("auth_token", res.data.token);
      localStorage.setItem("refresh_token", res.data.refreshToken);
      localStorage.setItem("user_data", JSON.stringify(res.data.user));
      setAccessToken(res.data.token);
      setRefreshTokenValue(res.data.refreshToken);
      setUser(res.data.user);
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) throw new Error("No refresh token");

      const response = await api.auth.refreshToken({ refreshToken: refresh });
      if (!response.data.success) {
        throw new Error(response.data.message || "Refresh token failed");
      }
      localStorage.setItem("auth_token", response.data.data.token);
      if (response.data.data.refreshToken) {
        localStorage.setItem("refresh_token", response.data.data.refreshToken);
        setRefreshTokenValue(response.data.data.refreshToken);
      }
      setAccessToken(response.data.data.token);
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // After registration, user needs to verify OTP
      // Don't set user yet, wait for OTP verification
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("refresh_token", data.refreshToken);
      localStorage.setItem("user_data", JSON.stringify(data.user));
      setAccessToken(data.token);
      setRefreshTokenValue(data.refreshToken);
      setUser(data.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) throw new Error("No refresh token");

      const response = await api.auth.logout({ refreshToken: refresh });
      if (!response.data.success) {
        throw new Error(response.data.message || "Logout failed");
      }
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_data");
      setAccessToken(null);
      setRefreshTokenValue(null);
      setUser(null);
      return true;
    } catch (error) {
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    verifyOtp,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
