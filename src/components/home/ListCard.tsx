"use client";

import Link from "next/link";
import { BACKGROUND_THEMES, ICON_PRESETS } from "@/lib/constants";
import type { ShoppingList } from "@/types";

interface ListCardProps {
  list: ShoppingList;
  onDelete: (id: string) => void;
}

export function ListCard({ list, onDelete }: ListCardProps) {
  const total = list.items.length;
  const done = list.items.filter((i) => i.checked).length;

  const theme = BACKGROUND_THEMES[list.background];
  const bgStyle = list.background.startsWith("data:")
    ? { backgroundImage: `url(${list.background})`, backgroundSize: "cover", backgroundPosition: "center" }
    : undefined;
  const bgClass = theme
    ? `bg-gradient-to-br ${theme.fromClass} ${theme.toClass}`
    : "bg-gradient-to-br from-orange-300 to-rose-400";
  const textClass = theme?.textClass ?? "text-white";

  const iconDisplay = list.icon.startsWith("data:")
    ? <img src={list.icon} alt="icon" className="w-8 h-8 rounded-lg object-cover" />
    : <span className="text-2xl">{ICON_PRESETS[list.icon] ?? "🛒"}</span>;

  return (
    <div className="relative group">
      <Link
        href={`/list/${list.id}`}
        className={`block rounded-3xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.02] transition-all ${bgClass} ${textClass}`}
        style={bgStyle}
      >
        <div className="bg-black/10 p-4 space-y-2">
          <div className="flex items-center gap-2">
            {iconDisplay}
            <h2 className="font-bold text-lg truncate">{list.name}</h2>
          </div>
          <div className="text-sm opacity-80">
            {total === 0 ? "アイテムなし" : `${done} / ${total} 完了`}
          </div>
          {total > 0 && (
            <div className="w-full bg-white/30 rounded-full h-1.5">
              <div
                className="bg-white rounded-full h-1.5 transition-all"
                style={{ width: `${(done / total) * 100}%` }}
              />
            </div>
          )}
        </div>
      </Link>

      <button
        onClick={() => onDelete(list.id)}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all text-sm"
        aria-label="リストを削除"
      >
        ×
      </button>
    </div>
  );
}
