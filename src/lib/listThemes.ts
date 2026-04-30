const KEY_PREFIX = "kaimono_list_theme_";

export function getListTheme(listId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(KEY_PREFIX + listId);
  } catch {
    return null;
  }
}

export function saveListTheme(listId: string, themeKey: string): void {
  try {
    localStorage.setItem(KEY_PREFIX + listId, themeKey);
  } catch {}
}
