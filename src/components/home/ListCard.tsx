"use client";

import Link from "next/link";
import { useAppSettings } from "@/context/AppSettingsContext";
import type { ShoppingList } from "@/types";

interface ListCardProps {
  list: ShoppingList;
  onDelete: (id: string) => void;
}

export function ListCard({ list, onDelete }: ListCardProps) {
  const { theme } = useAppSettings();
  const total = list.items.length;
  const done = list.items.filter((i) => i.checked).length;

  const cardBg = theme.isDark ? "rgba(255,255,255,0.1)" : "white";
  const textColor = theme.isDark ? "white" : "#1F2937";
  const mutedColor = theme.isDark ? "rgba(255,255,255,0.5)" : "#9CA3AF";
  const trackBg = theme.isDark ? "rgba(255,255,255,0.15)" : "#FEE2D5";

  return (
    <div className="relative group">
      <Link
        href={`/list/${list.id}`}
        className="flex items-center gap-4 px-4 py-4 rounded-[20px] shadow-sm hover:shadow-md active:scale-[0.98] transition-all block"
        style={{ background: cardBg }}
      >
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
          style={{ background: `linear-gradient(135deg, var(--accent-from), var(--accent-to))` }}
        >
          {list.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold truncate" style={{ color: textColor }}>{list.name}</p>
          <p className="text-xs mt-0.5" style={{ color: mutedColor }}>
            {total === 0 ? "アイテムなし" : `${done} / ${total} 完了`}
          </p>
          {total > 0 && (
            <div className="w-full rounded-full h-1 mt-1.5" style={{ background: trackBg }}>
              <div
                className="rounded-full h-1 transition-all"
                style={{
                  width: `${(done / total) * 100}%`,
                  background: `linear-gradient(135deg, var(--accent-from), var(--accent-to))`,
                }}
              />
            </div>
          )}
        </div>

        <span className="text-xl flex-shrink-0" style={{ color: mutedColor }}>›</span>
      </Link>

      <button
        onClick={() => onDelete(list.id)}
        className="absolute top-3 right-8 w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-400 transition-all text-lg"
        style={{ color: mutedColor }}
        aria-label="リストを削除"
      >
        ×
      </button>
    </div>
  );
}
