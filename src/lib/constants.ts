export const ICON_PRESETS: Record<string, string> = {
  cart: "🛒",
  ramen: "🍜",
  bento: "🍱",
  rice: "🍚",
  bread: "🍞",
  milk: "🥛",
  egg: "🥚",
  veggie: "🥦",
  fruit: "🍎",
  fish: "🐟",
  meat: "🥩",
  snack: "🍪",
  drink: "🧃",
  coffee: "☕",
  cleaning: "🧹",
  bag: "🛍️",
};

export const DEFAULT_ICON = "cart";
export const DEFAULT_BACKGROUND = "sunset";
export const DEFAULT_LIST_NAME = "かいものメモ";

export interface BackgroundTheme {
  label: string;
  swatchColor: string;
  fromClass: string;
  toClass: string;
  textClass: string;
}

export const BACKGROUND_THEMES: Record<string, BackgroundTheme> = {
  sunset: {
    label: "夕焼け",
    swatchColor: "#FF8C42",
    fromClass: "from-orange-300",
    toClass: "to-rose-400",
    textClass: "text-white",
  },
  mint: {
    label: "ミント",
    swatchColor: "#A8E6CF",
    fromClass: "from-emerald-100",
    toClass: "to-teal-300",
    textClass: "text-emerald-900",
  },
  lavender: {
    label: "ラベンダー",
    swatchColor: "#C3B1E1",
    fromClass: "from-purple-100",
    toClass: "to-violet-300",
    textClass: "text-violet-900",
  },
  sky: {
    label: "空",
    swatchColor: "#87CEEB",
    fromClass: "from-sky-100",
    toClass: "to-blue-300",
    textClass: "text-blue-900",
  },
  sakura: {
    label: "桜",
    swatchColor: "#FFB7C5",
    fromClass: "from-pink-100",
    toClass: "to-rose-200",
    textClass: "text-rose-900",
  },
  sunaha: {
    label: "砂浜",
    swatchColor: "#F5DEB3",
    fromClass: "from-amber-100",
    toClass: "to-yellow-200",
    textClass: "text-amber-900",
  },
  dark: {
    label: "夜",
    swatchColor: "#2D2D2D",
    fromClass: "from-gray-800",
    toClass: "to-gray-950",
    textClass: "text-gray-100",
  },
  forest: {
    label: "森",
    swatchColor: "#228B22",
    fromClass: "from-green-700",
    toClass: "to-emerald-950",
    textClass: "text-green-50",
  },
};
