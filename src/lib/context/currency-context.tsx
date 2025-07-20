import React, { createContext, useContext, useEffect, useState } from "react";

export type Currency = "VND" | "USD" | "EUR" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "VND",
  setCurrency: () => {},
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>("VND");

  useEffect(() => {
    // Lấy currency từ localStorage
    const saved = localStorage.getItem("currency") as Currency;
    if (saved) setCurrencyState(saved);
    // TODO: Nếu đã đăng nhập, gọi API GET /api/user/profile để lấy currency từ backend
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("currency", c);
    // TODO: Nếu đã đăng nhập, gọi API PUT /api/user/profile với { currency: c }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}; 