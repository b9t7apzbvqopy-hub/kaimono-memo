"use client";

import { useState } from "react";
import { ItemRow } from "./ItemRow";
import type { ShoppingItem } from "@/types";

interface ItemListProps {
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function ItemList({ items, onToggle, onEdit, onDelete }: ItemListProps) {
  const [showCompleted, setShowCompleted] = useState(true);

  const pending = items.filter((i) => !i.checked);
  const completed = items.filter((i) => i.checked);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-current opacity-50">
        <span className="text-5xl mb-3">🛒</span>
        <p className="text-sm">アイテムを追加してみましょう</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {pending.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {completed.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted((v) => !v)}
            className="flex items-center gap-1 text-sm opacity-60 hover:opacity-80 transition-opacity py-2"
          >
            <span>{showCompleted ? "▼" : "▶"}</span>
            <span>完了 ({completed.length})</span>
          </button>
          {showCompleted && (
            <div className="space-y-2">
              {completed.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
