import React, { createContext, useContext, useEffect, useState } from "react";

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

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    // Lấy theme từ localStorage
    const saved = localStorage.getItem("theme") as Theme;
    if (saved) setThemeState(saved);
    // TODO: Nếu đã đăng nhập, gọi API GET /api/user/profile để lấy theme từ backend
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    // TODO: Nếu đã đăng nhập, gọi API PUT /api/user/profile với { theme: t }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 