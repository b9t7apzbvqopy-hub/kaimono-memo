import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF8C42",
        "primary-dark": "#E07030",
        "primary-light": "#FFB380",
      },
      fontFamily: {
        sans: ["var(--font-zen-maru)", "Hiragino Kaku Gothic ProN", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
  safelist: [
    "bg-gradient-to-br",
    "from-orange-300", "to-rose-400",
    "from-emerald-100", "to-teal-300",
    "from-purple-100", "to-violet-300",
    "from-sky-100", "to-blue-300",
    "from-pink-100", "to-rose-200",
    "from-amber-100", "to-yellow-200",
    "from-gray-800", "to-gray-950",
    "from-green-700", "to-emerald-950",
    "text-white", "text-emerald-900", "text-violet-900",
    "text-blue-900", "text-rose-900", "text-amber-900",
    "text-gray-100", "text-green-50",
  ],
};

export default config;
