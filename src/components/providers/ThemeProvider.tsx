"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Theme } from "@/types";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [highContrast, setHighContrastState] = useState(false);
  const [mounted, setMounted] = useState(false);

  const getSystemTheme = useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  const resolveTheme = useCallback(
    (t: Theme): "light" | "dark" => {
      return t === "system" ? getSystemTheme() : t;
    },
    [getSystemTheme]
  );

  const applyTheme = useCallback(
    (resolved: "light" | "dark", contrast: boolean) => {
      const root = document.documentElement;
      root.classList.remove("light", "dark", "high-contrast");
      root.classList.add(resolved);
      if (contrast) root.classList.add("high-contrast");
      root.style.colorScheme = resolved;
    },
    []
  );

  // Initialize theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("sequenzia-theme") as Theme | null;
    const storedContrast =
      localStorage.getItem("sequenzia-high-contrast") === "true";
    const initialTheme = storedTheme || defaultTheme;

    setThemeState(initialTheme);
    setHighContrastState(storedContrast);
    const resolved = resolveTheme(initialTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved, storedContrast);
    setMounted(true);
  }, [defaultTheme, resolveTheme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const resolved = getSystemTheme();
        setResolvedTheme(resolved);
        applyTheme(resolved, highContrast);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, highContrast, mounted, getSystemTheme, applyTheme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem("sequenzia-theme", newTheme);
      const resolved = resolveTheme(newTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved, highContrast);
    },
    [resolveTheme, highContrast, applyTheme]
  );

  const setHighContrast = useCallback(
    (enabled: boolean) => {
      setHighContrastState(enabled);
      localStorage.setItem("sequenzia-high-contrast", String(enabled));
      applyTheme(resolvedTheme, enabled);
    },
    [resolvedTheme, applyTheme]
  );

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, highContrast, setHighContrast }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
