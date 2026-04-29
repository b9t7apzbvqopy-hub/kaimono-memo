"use client";

import { useCallback, useState } from "react";
import * as api from "@/lib/api-client";
import type { ShoppingItem, ShoppingList } from "@/types";

export function useShoppingList(initialData: ShoppingList) {
  const [list, setList] = useState<ShoppingList>(initialData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addItem = useCallback(
    async (text: string) => {
      const tempId = `temp-${Date.now()}`;
      const tempItem: ShoppingItem = {
        id: tempId,
        text,
        checked: false,
        createdAt: Date.now(),
      };
      setList((prev) => ({
        ...prev,
        items: [...prev.items, tempItem],
      }));

      try {
        const item = await api.addItem(list.id, text);
        setList((prev) => ({
          ...prev,
          items: prev.items.map((i) => (i.id === tempId ? item : i)),
        }));
      } catch {
        setList((prev) => ({
          ...prev,
          items: prev.items.filter((i) => i.id !== tempId),
        }));
        showToast("追加に失敗しました");
      }
    },
    [list.id]
  );

  const toggleItem = useCallback(
    async (itemId: string) => {
      const item = list.items.find((i) => i.id === itemId);
      if (!item) return;
      const newChecked = !item.checked;

      setList((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.id === itemId ? { ...i, checked: newChecked } : i
        ),
      }));

      try {
        await api.patchItem(list.id, itemId, { checked: newChecked });
      } catch {
        setList((prev) => ({
          ...prev,
          items: prev.items.map((i) =>
            i.id === itemId ? { ...i, checked: !newChecked } : i
          ),
        }));
        showToast("更新に失敗しました");
      }
    },
    [list.id, list.items]
  );

  const editItem = useCallback(
    async (itemId: string, text: string) => {
      const prev_text =
        list.items.find((i) => i.id === itemId)?.text ?? "";

      setList((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === itemId ? { ...i, text } : i)),
      }));

      try {
        await api.patchItem(list.id, itemId, { text });
      } catch {
        setList((prev) => ({
          ...prev,
          items: prev.items.map((i) =>
            i.id === itemId ? { ...i, text: prev_text } : i
          ),
        }));
        showToast("編集に失敗しました");
      }
    },
    [list.id, list.items]
  );

  const deleteItem = useCallback(
    async (itemId: string) => {
      const removed = list.items.find((i) => i.id === itemId);
      setList((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== itemId),
      }));

      try {
        await api.deleteItem(list.id, itemId);
      } catch {
        if (removed) {
          setList((prev) => ({
            ...prev,
            items: [...prev.items, removed].sort(
              (a, b) => a.createdAt - b.createdAt
            ),
          }));
        }
        showToast("削除に失敗しました");
      }
    },
    [list.id, list.items]
  );

  const updateMeta = useCallback(
    async (
      patch: Partial<Pick<ShoppingList, "name" | "icon" | "background">>
    ) => {
      const prev = { name: list.name, icon: list.icon, background: list.background };
      setList((l) => ({ ...l, ...patch }));

      try {
        const updated = await api.updateList(list.id, patch);
        setList(updated);
      } catch {
        setList((l) => ({ ...l, ...prev }));
        showToast("保存に失敗しました");
      }
    },
    [list.id, list.name, list.icon, list.background]
  );

  return {
    list,
    toastMessage,
    addItem,
    toggleItem,
    editItem,
    deleteItem,
    updateMeta,
  };
}
