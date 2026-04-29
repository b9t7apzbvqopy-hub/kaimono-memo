"use client";

import { useState, useRef, useEffect } from "react";
import type { ShoppingItem } from "@/types";

interface ItemRowProps {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function ItemRow({ item, onToggle, onEdit, onDelete }: ItemRowProps) {
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

  return (
    <div className="card flex items-center gap-3 px-4 py-3.5">
      <button
        onClick={() => onToggle(item.id)}
        className={`
          w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
          ${item.checked
            ? "border-transparent text-white"
            : "border-orange-300 bg-white"
          }
        `}
        style={item.checked ? { background: "linear-gradient(135deg, #FF8C42, #FF6B35)" } : undefined}
        aria-label={item.checked ? "チェックを外す" : "チェックする"}
      >
        {item.checked && <span className="text-xs font-bold">✓</span>}
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
            className="w-full bg-transparent border-b-2 border-orange-300 outline-none text-gray-800 pb-0.5"
          />
        ) : (
          <span
            className={`block truncate cursor-pointer select-none transition-all ${
              item.checked ? "line-through text-gray-300" : "text-gray-700"
            }`}
            onClick={() => !item.checked && setEditing(true)}
          >
            {item.text}
          </span>
        )}
      </div>

      <button
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors text-lg"
        aria-label="削除"
      >
        ×
      </button>
    </div>
  );
}
