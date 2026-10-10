"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

const STORAGE_KEY = "ksd-theme";

/** Светлая тема временно отключена — всегда тёмный режим. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.remove("light");
    try {
      if (localStorage.getItem(STORAGE_KEY) === "light") {
        localStorage.setItem(STORAGE_KEY, "dark");
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "dark", toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
