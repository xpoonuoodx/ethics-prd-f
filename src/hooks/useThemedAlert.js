import { createContext, useContext } from "react";

export const ThemedAlertContext = createContext(null);

export const useThemedAlert = () => {
  const ctx = useContext(ThemedAlertContext);
  if (!ctx) {
    throw new Error("useThemedAlert must be used within ThemedAlertProvider");
  }
  return ctx;
};
