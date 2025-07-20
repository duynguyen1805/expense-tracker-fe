"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeCustomProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    // Lấy theme từ localStorage
    const saved = localStorage.getItem("theme") as Theme;
    if (saved) setThemeState(saved);
    // TODO: Nếu đã đăng nhập, gọi API GET /api/user/profile để lấy theme từ backend
    const user = JSON.parse(localStorage.getItem("user_data") || "{}");
    if (user.theme) setThemeState(user.theme);
  }, []);

  const setTheme = async (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    let user = JSON.parse(localStorage.getItem("user_data") || "{}");
    if (user) {
      const userUpdated = await api.user.updateProfile({ theme: t });
      if (userUpdated.data.success) {
        user.theme = t;
        localStorage.setItem("user_data", JSON.stringify(user));
      }
      setThemeState(t);
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (theme === "system") {
      // Theo dõi theme hệ điều hành
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
