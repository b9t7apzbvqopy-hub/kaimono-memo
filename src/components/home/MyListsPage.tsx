"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyLists } from "@/hooks/useMyLists";
import { ListCard } from "./ListCard";
import * as api from "@/lib/api-client";
import type { ShoppingList } from "@/types";

export function MyListsPage() {
  const router = useRouter();
  const { listIds, addListId, removeListId } = useMyLists();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (listIds.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(listIds.map((id) => api.getList(id))).then((results) => {
      const valid: ShoppingList[] = [];
      results.forEach((list, i) => {
        if (list) {
          valid.push(list);
        } else {
          removeListId(listIds[i]);
        }
      });
      setLists(valid);
      setLoading(false);
    });
  }, [listIds.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = useCallback(async () => {
    const list = await api.createList();
    addListId(list.id);
    router.push(`/list/${list.id}`);
  }, [addListId, router]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("このリストを削除しますか？")) return;
      await api.deleteList(id);
      removeListId(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
    },
    [removeListId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <header className="px-4 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">🛒 かいものメモ</h1>
        <p className="text-sm text-gray-500 mt-1">マイリスト</p>
      </header>

      <main className="px-4 pb-24 max-w-lg mx-auto">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <span className="text-6xl">🛒</span>
            <p className="text-gray-500">リストがまだありません</p>
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-primary text-white rounded-2xl font-medium text-lg hover:bg-primary-dark active:scale-95 transition-all shadow-md"
            >
              リストを作る
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {lists.map((list) => (
              <ListCard key={list.id} list={list} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <button
        onClick={handleCreate}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark active:scale-95 transition-all text-2xl flex items-center justify-center"
        aria-label="新しいリストを作成"
      >
        +
      </button>
    </div>
  );
}
