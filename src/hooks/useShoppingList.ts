"use client";

import { useCallback, useState } from "react";
import type { ShoppingList } from "@/types";
import * as storage from "@/lib/storage";

export function useShoppingList(initialData: ShoppingList) {
  const [list, setList] = useState<ShoppingList>(initialData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const addItem = useCallback(
    (text: string) => {
      const item = storage.addItem(list.id, text);
      setList((prev) => ({
        ...prev,
        items: [...prev.items, item],
        updatedAt: Date.now(),
      }));
    },
    [list.id]
  );

  const toggleItem = useCallback(
    (itemId: string) => {
      const item = list.items.find((i) => i.id === itemId);
      if (!item) return;
      const checked = !item.checked;
      storage.patchItem(list.id, itemId, { checked });
      setList((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === itemId ? { ...i, checked } : i)),
        updatedAt: Date.now(),
      }));
    },
    [list.id, list.items]
  );

  const editItem = useCallback(
    (itemId: string, text: string) => {
      storage.patchItem(list.id, itemId, { text });
      setList((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === itemId ? { ...i, text } : i)),
        updatedAt: Date.now(),
      }));
    },
    [list.id]
  );

  const deleteItem = useCallback(
    (itemId: string) => {
      storage.removeItem(list.id, itemId);
      setList((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== itemId),
        updatedAt: Date.now(),
      }));
    },
    [list.id]
  );

  const updateName = useCallback(
    (name: string) => {
      const updated = storage.updateListName(list.id, name);
      if (updated) {
        setList(updated);
        showToast("保存しました ✓");
      }
    },
    [list.id]
  );

  return { list, toastMessage, addItem, toggleItem, editItem, deleteItem, updateName };
}
