"use client";

import { useCallback, useState } from "react";
import type { ShoppingList } from "@/types";
import * as api from "@/lib/api-client";

export function useShoppingList(initialData: ShoppingList) {
  const [list, setList] = useState<ShoppingList>(initialData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const addItem = useCallback(
    async (text: string) => {
      const tempId = `temp-${Date.now()}`;
      const tempItem = { id: tempId, text, checked: false, createdAt: Date.now() };
      setList((prev) => ({ ...prev, items: [...prev.items, tempItem] }));
      try {
        const item = await api.addItem(list.id, text);
        setList((prev) => ({
          ...prev,
          items: prev.items.map((i) => (i.id === tempId ? item : i)),
        }));
      } catch {
        setList((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== tempId) }));
        showToast("追加に失敗しました");
      }
    },
    [list.id]
  );

  const toggleItem = useCallback(
    async (itemId: string) => {
      const item = list.items.find((i) => i.id === itemId);
      if (!item) return;
      const checked = !item.checked;
      setList((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === itemId ? { ...i, checked } : i)),
      }));
      try {
        await api.patchItem(list.id, itemId, { checked });
      } catch {
        setList((prev) => ({
          ...prev,
          items: prev.items.map((i) => (i.id === itemId ? { ...i, checked: !checked } : i)),
        }));
        showToast("更新に失敗しました");
      }
    },
    [list.id, list.items]
  );

  const editItem = useCallback(
    async (itemId: string, text: string) => {
      const prevText = list.items.find((i) => i.id === itemId)?.text ?? "";
      setList((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === itemId ? { ...i, text } : i)),
      }));
      try {
        await api.patchItem(list.id, itemId, { text });
      } catch {
        setList((prev) => ({
          ...prev,
          items: prev.items.map((i) => (i.id === itemId ? { ...i, text: prevText } : i)),
        }));
        showToast("編集に失敗しました");
      }
    },
    [list.id, list.items]
  );

  const deleteItem = useCallback(
    async (itemId: string) => {
      const removed = list.items.find((i) => i.id === itemId);
      setList((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== itemId) }));
      try {
        await api.deleteItem(list.id, itemId);
      } catch {
        if (removed) {
          setList((prev) => ({
            ...prev,
            items: [...prev.items, removed].sort((a, b) => a.createdAt - b.createdAt),
          }));
        }
        showToast("削除に失敗しました");
      }
    },
    [list.id, list.items]
  );

  const updateName = useCallback(
    async (name: string) => {
      const prevName = list.name;
      setList((prev) => ({ ...prev, name }));
      try {
        await api.updateList(list.id, { name });
        showToast("保存しました ✓");
      } catch {
        setList((prev) => ({ ...prev, name: prevName }));
        showToast("保存に失敗しました");
      }
    },
    [list.id, list.name]
  );

  return { list, toastMessage, addItem, toggleItem, editItem, deleteItem, updateName };
}
