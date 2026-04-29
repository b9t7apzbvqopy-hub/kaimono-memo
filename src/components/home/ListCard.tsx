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
  const swatchStyle = list.background.startsWith("data:")
    ? { backgroundImage: `url(${list.background})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: theme?.swatchColor ?? "linear-gradient(135deg, #FF8C42, #FF6B35)" };

  const iconDisplay = list.icon.startsWith("data:")
    ? <img src={list.icon} alt="icon" className="w-8 h-8 rounded-lg object-cover" />
    : <span className="text-2xl">{ICON_PRESETS[list.icon] ?? "🛒"}</span>;

  return (
    <div className="relative group">
      <Link
        href={`/list/${list.id}`}
        className="card flex items-center gap-4 px-4 py-4 hover:shadow-md active:scale-[0.98] transition-all block"
      >
        {/* Color swatch */}
        <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center" style={swatchStyle}>
          {iconDisplay}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 truncate">{list.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {total === 0 ? "アイテムなし" : `${done} / ${total} 完了`}
          </p>
          {total > 0 && (
            <div className="w-full bg-orange-100 rounded-full h-1 mt-1.5">
              <div
                className="rounded-full h-1 transition-all"
                style={{ width: `${(done / total) * 100}%`, background: "linear-gradient(135deg, #FF8C42, #FF6B35)" }}
              />
            </div>
          )}
        </div>

        <span className="text-gray-300 text-xl flex-shrink-0">›</span>
      </Link>

      <button
        onClick={() => onDelete(list.id)}
        className="absolute top-3 right-8 w-7 h-7 flex items-center justify-center rounded-full text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-50 transition-all text-lg"
        aria-label="リストを削除"
      >
        ×
      </button>
    </div>
  );
}
