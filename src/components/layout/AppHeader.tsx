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
    ? <img src={icon} alt="icon" className="w-8 h-8 rounded-xl object-cover" />
    : <span className="text-2xl leading-none">{ICON_PRESETS[icon] ?? "🛒"}</span>;

  return (
    <header className="flex items-center gap-3 px-4 py-3 bg-white/70 backdrop-blur-md sticky top-0 z-40 border-b border-white/50">
      {showBack && (
        <Link
          href="/"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 hover:bg-white/80 transition-colors text-gray-600 text-lg flex-shrink-0"
          aria-label="戻る"
        >
          ←
        </Link>
      )}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-orange-100 flex-shrink-0">
          {iconDisplay}
        </div>
        <h1 className="font-bold text-lg text-gray-800 truncate">{name}</h1>
      </div>
      {onCustomize && (
        <button
          onClick={onCustomize}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 hover:bg-white/80 transition-colors text-lg flex-shrink-0"
          aria-label="カスタマイズ"
        >
          ✏️
        </button>
      )}
    </header>
  );
}
