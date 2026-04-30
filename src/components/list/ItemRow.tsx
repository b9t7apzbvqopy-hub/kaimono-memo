"use client";

import { useState, useRef, useEffect } from "react";
import { useAppSettings } from "@/context/AppSettingsContext";
import type { ShoppingItem } from "@/types";

interface ItemRowProps {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function ItemRow({ item, onToggle, onEdit, onDelete }: ItemRowProps) {
  const { theme } = useAppSettings();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== item.text) {
      onEdit(item.id, trimmed);
    } else {
      setEditText(item.text);
    }
    setEditing(false);
  };

  const cardBg = theme.isDark ? "rgba(255,255,255,0.1)" : "white";
  const textColor = theme.isDark ? "white" : "#374151";
  const mutedColor = theme.isDark ? "rgba(255,255,255,0.4)" : "#9CA3AF";

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-[20px] shadow-sm" style={{ background: cardBg }}>
      <button
        onClick={() => onToggle(item.id)}
        className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
        style={
          item.checked
            ? { background: `linear-gradient(135deg, var(--accent-from), var(--accent-to))`, borderColor: "transparent" }
            : { borderColor: "var(--accent)", background: "transparent" }
        }
        aria-label={item.checked ? "チェックを外す" : "チェックする"}
      >
        {item.checked && <span className="text-xs font-bold text-white">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") {
                setEditText(item.text);
                setEditing(false);
              }
            }}
            className="w-full bg-transparent border-b-2 outline-none pb-0.5"
            style={{ borderColor: "var(--accent)", color: textColor }}
          />
        ) : (
          <span
            className="block truncate cursor-pointer select-none transition-all"
            style={{
              color: item.checked ? mutedColor : textColor,
              textDecoration: item.checked ? "line-through" : "none",
            }}
            onClick={() => !item.checked && setEditing(true)}
          >
            {item.text}
          </span>
        )}
      </div>

      <button
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors text-lg"
        style={{ color: mutedColor }}
        aria-label="削除"
      >
        ×
      </button>
    </div>
  );
}
