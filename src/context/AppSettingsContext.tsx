"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AppSettings } from "@/types";
import { getAppSettings, saveAppSettings, DEFAULT_APP_SETTINGS } from "@/lib/appSettings";
import { THEMES, DEFAULT_THEME_KEY } from "@/lib/themes";
import type { ThemeDef } from "@/lib/themes";

interface ContextValue {
  settings: AppSettings;
  theme: ThemeDef;
  homeTheme: ThemeDef;
  updateSettings: (patch: Partial<AppSettings>) => void;
}

const AppSettingsContext = createContext<ContextValue>({
  settings: DEFAULT_APP_SETTINGS,
  theme: THEMES[DEFAULT_THEME_KEY],
  homeTheme: THEMES[DEFAULT_THEME_KEY],
  updateSettings: () => {},
});

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);

  useEffect(() => {
    setSettings(getAppSettings());
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveAppSettings(next);
      return next;
    });
  }, []);

  const theme = THEMES[settings.theme] ?? THEMES[DEFAULT_THEME_KEY];
  const homeTheme = THEMES[settings.homeTheme] ?? THEMES[DEFAULT_THEME_KEY];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-from", theme.accentFrom);
    root.style.setProperty("--accent-to", theme.accentTo);
    root.style.setProperty("--accent", theme.accent);
    root.setAttribute("data-dark", theme.isDark ? "true" : "false");
    const fontSizeMap = { small: "13px", medium: "16px", large: "20px" };
    root.style.fontSize = fontSizeMap[settings.fontSize] ?? "16px";
    root.style.setProperty("--font-weight-body", settings.fontWeight === "bold" ? "700" : "400");
  }, [theme, settings.fontSize, settings.fontWeight]);

  return (
    <AppSettingsContext.Provider value={{ settings, theme, homeTheme, updateSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  return useContext(AppSettingsContext);
}

export function ListThemeProvider({ themeKey, children }: { themeKey: string; children: React.ReactNode }) {
  const parent = useContext(AppSettingsContext);
  const listTheme = THEMES[themeKey] ?? THEMES[DEFAULT_THEME_KEY];

  return (
    <AppSettingsContext.Provider value={{ ...parent, theme: listTheme }}>
      {children}
    </AppSettingsContext.Provider>
  );
}
