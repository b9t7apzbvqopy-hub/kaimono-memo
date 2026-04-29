"use client";

import Link from "next/link";
import { ICON_PRESETS } from "@/lib/constants";

interface AppHeaderProps {
  name: string;
  icon: string;
  onCustomize?: () => void;
  showBack?: boolean;
}

export function AppHeader({ name, icon, onCustomize, showBack }: AppHeaderProps) {
  const iconDisplay = icon.startsWith("data:")
    ? <img src={icon} alt="icon" className="w-8 h-8 rounded-lg object-cover" />
    : <span className="text-2xl">{ICON_PRESETS[icon] ?? "🛒"}</span>;

  return (
    <header className="flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm sticky top-0 z-40">
      {showBack && (
        <Link
          href="/"
          className="mr-1 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="戻る"
        >
          ←
        </Link>
      )}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {iconDisplay}
        <h1 className="font-bold text-lg truncate">{name}</h1>
      </div>
      {onCustomize && (
        <button
          onClick={onCustomize}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/30 hover:bg-white/50 transition-colors"
          aria-label="カスタマイズ"
        >
          ✏️
        </button>
      )}
    </header>
  );
}
