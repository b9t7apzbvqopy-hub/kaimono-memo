"use client";

import Link from "next/link";
import { useAppSettings } from "@/context/AppSettingsContext";
import { ICON_PRESETS } from "@/lib/constants";

interface AppHeaderProps {
  name: string;
  onCustomize?: () => void;
  showBack?: boolean;
}

export function AppHeader({ name, onCustomize, showBack }: AppHeaderProps) {
  const { settings, theme } = useAppSettings();

  const iconDisplay = settings.icon.startsWith("data:") ? (
    <img src={settings.icon} alt="icon" className="w-7 h-7 rounded-lg object-cover" />
  ) : (
    <span className="text-xl leading-none">{ICON_PRESETS[settings.icon] ?? "🛒"}</span>
  );

  const textColor = theme.isDark ? "text-white" : "text-gray-800";
  const bgColor = theme.isDark ? "bg-black/30" : "bg-white/70";

  return (
    <header className={`flex items-center gap-3 px-4 py-3 ${bgColor} backdrop-blur-md sticky top-0 z-40 border-b ${theme.isDark ? "border-white/10" : "border-white/50"}`}>
      {showBack && (
        <Link
          href="/"
          className={`w-9 h-9 flex items-center justify-center rounded-xl ${theme.isDark ? "bg-white/10 text-white" : "bg-white/60 text-gray-600"} hover:opacity-80 transition-opacity text-lg flex-shrink-0`}
          aria-label="戻る"
        >
          ←
        </Link>
      )}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: settings.iconColor
              ? settings.iconColor
              : `linear-gradient(135deg, var(--accent-from), var(--accent-to))`,
          }}
        >
          {iconDisplay}
        </div>
        <h1 className={`font-bold text-lg truncate ${textColor}`}>{name}</h1>
      </div>
      {onCustomize && (
        <button
          onClick={onCustomize}
          className={`w-9 h-9 flex items-center justify-center rounded-xl ${theme.isDark ? "bg-white/10 text-white" : "bg-white/60"} hover:opacity-80 transition-opacity text-lg flex-shrink-0`}
          aria-label="カスタマイズ"
        >
          ✏️
        </button>
      )}
    </header>
  );
}
