"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

export type Currency = "VNĐ" | "USD" | "EUR" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "VNĐ",
  setCurrency: () => {},
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyCustomProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currency, setCurrencyState] = useState<Currency>("VNĐ");

  useEffect(() => {
    const saved = localStorage.getItem("currency") as Currency;
    if (saved) setCurrencyState(saved);

    const user = JSON.parse(localStorage.getItem("user_data") || "{}");
    if (user) setCurrencyState(user.currency);
  }, []);

  const setCurrency = async (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("currency", c);

    const user = JSON.parse(localStorage.getItem("user_data") || "{}");
    if (user) {
      const userUpdated = await api.user.updateProfile({ currency: c });
      console.log("userUpdated", userUpdated);
      if (userUpdated.data.success) {
        user.currency = c;
        localStorage.setItem("user_data", JSON.stringify(user));
      }
      setCurrencyState(c);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
