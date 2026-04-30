import type { AppSettings } from "@/types";

const KEY = "kaimono_app_settings";

export const DEFAULT_APP_SETTINGS: AppSettings = {
  name: "かいものメモ",
  icon: "cart",
  theme: "sunset",
  homeTheme: "sunset",
  fontSize: "medium",
  fontWeight: "normal",
};

export function getAppSettings(): AppSettings {
  if (typeof window === "undefined") return { ...DEFAULT_APP_SETTINGS };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_APP_SETTINGS };
    return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_APP_SETTINGS };
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {}
}
