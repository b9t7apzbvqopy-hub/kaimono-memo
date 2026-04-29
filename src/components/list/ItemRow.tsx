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
    <div className="flex items-center gap-3 px-4 py-3 bg-white/40 backdrop-blur-sm rounded-2xl">
      <button
        onClick={() => onToggle(item.id)}
        className={`
          w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
          ${item.checked
            ? "bg-primary border-primary text-white"
            : "border-gray-400 bg-white/50"
          }
        `}
        aria-label={item.checked ? "チェックを外す" : "チェックする"}
      >
        {item.checked && <span className="text-xs">✓</span>}
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
            className="w-full bg-transparent border-b border-primary outline-none text-gray-800"
          />
        ) : (
          <span
            className={`
              block truncate cursor-pointer select-none
              ${item.checked ? "line-through opacity-50" : "text-gray-800"}
            `}
            onClick={() => !item.checked && setEditing(true)}
          >
            {item.text}
          </span>
        )}
      </div>

      <button
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50/50 transition-colors"
        aria-label="削除"
      >
        ×
      </button>
    </div>
  );
}
