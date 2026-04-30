export interface ThemeDef {
  label: string;
  gradient: string;
  accentFrom: string;
  accentTo: string;
  accent: string;
  isDark: boolean;
  swatch: string;
}

export const THEMES: Record<string, ThemeDef> = {
  sunset: {
    label: "サンセット",
    gradient: "linear-gradient(168deg, #FFF8F0 0%, #FFF1E6 40%, #FFE8D6 100%)",
    accentFrom: "#FF8C42",
    accentTo: "#FF6B35",
    accent: "#FF6B35",
    isDark: false,
    swatch: "linear-gradient(135deg, #FFF8F0, #FF8C42, #FF6B35)",
  },
  mint: {
    label: "ミント",
    gradient: "linear-gradient(168deg, #F0FFF8 0%, #E0F7EE 40%, #CCEDDF 100%)",
    accentFrom: "#3DBB8A",
    accentTo: "#2D9B6A",
    accent: "#2D9B6A",
    isDark: false,
    swatch: "linear-gradient(135deg, #F0FFF8, #3DBB8A, #2D9B6A)",
  },
  lavender: {
    label: "ラベンダー",
    gradient: "linear-gradient(168deg, #F8F0FF 0%, #EDE0FF 40%, #DFD0F5 100%)",
    accentFrom: "#9C5DDD",
    accentTo: "#7C4DBC",
    accent: "#7C4DBC",
    isDark: false,
    swatch: "linear-gradient(135deg, #F8F0FF, #9C5DDD, #7C4DBC)",
  },
  sky: {
    label: "スカイ",
    gradient: "linear-gradient(168deg, #F0F7FF 0%, #E0EEFF 40%, #CCDFFF 100%)",
    accentFrom: "#4A8AE8",
    accentTo: "#3574D4",
    accent: "#3574D4",
    isDark: false,
    swatch: "linear-gradient(135deg, #F0F7FF, #4A8AE8, #3574D4)",
  },
  sakura: {
    label: "さくら",
    gradient: "linear-gradient(168deg, #FFF0F5 0%, #FFE0EB 40%, #FFD0E0 100%)",
    accentFrom: "#E86A90",
    accentTo: "#D4507A",
    accent: "#D4507A",
    isDark: false,
    swatch: "linear-gradient(135deg, #FFF0F5, #E86A90, #D4507A)",
  },
  sunaha: {
    label: "すなはま",
    gradient: "linear-gradient(168deg, #FEFCF0 0%, #F8F0DA 40%, #F0E8C8 100%)",
    accentFrom: "#D4AD40",
    accentTo: "#B09030",
    accent: "#B09030",
    isDark: false,
    swatch: "linear-gradient(135deg, #FEFCF0, #D4AD40, #B09030)",
  },
  dark: {
    label: "ダーク",
    gradient: "linear-gradient(168deg, #1A1A2E 0%, #16213E 40%, #0F3460 100%)",
    accentFrom: "#FF6080",
    accentTo: "#E94560",
    accent: "#E94560",
    isDark: true,
    swatch: "linear-gradient(135deg, #1A1A2E, #E94560)",
  },
  forest: {
    label: "フォレスト",
    gradient: "linear-gradient(168deg, #F0F5F0 0%, #D8E8D0 40%, #C0D8B8 100%)",
    accentFrom: "#65B558",
    accentTo: "#4A8B40",
    accent: "#4A8B40",
    isDark: false,
    swatch: "linear-gradient(135deg, #F0F5F0, #65B558, #4A8B40)",
  },
};

export const DEFAULT_THEME_KEY = "sunset";
