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
  const [creating, setCreating] = useState(false);
  const [shareCode, setShareCode] = useState("");

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
    if (creating) return;
    setCreating(true);
    try {
      const list = await api.createList();
      addListId(list.id);
      router.push(`/list/${list.id}`);
    } finally {
      setCreating(false);
    }
  }, [addListId, router, creating]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("このリストを削除しますか？")) return;
      await api.deleteList(id);
      removeListId(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
    },
    [removeListId]
  );

  const handleOpenShare = () => {
    const code = shareCode.trim();
    if (!code) return;
    const id = code.includes("/") ? code.split("/").pop()! : code;
    addListId(id);
    router.push(`/list/${id}`);
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(168deg, #FFF8F0 0%, #FFF1E6 40%, #FFE8D6 100%)" }}>
      <div className="max-w-[440px] mx-auto px-4 pt-12 pb-24">

        {/* Hero */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg mb-5"
            style={{ background: "linear-gradient(135deg, #FF8C42, #FF6B35)" }}
          >
            <span className="text-5xl">🛒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">かいものメモ</h1>
          <p className="text-sm text-gray-400 mt-1">みんなで使える買い物リスト</p>
        </div>

        {/* Create button */}
        <button
          onClick={handleCreate}
          disabled={creating}
          className="w-full py-4 text-lg btn-orange disabled:opacity-60"
        >
          {creating ? "作成中..." : "+ 新しいリストを作る"}
        </button>

        {/* Share code input */}
        <div className="card mt-4 p-4">
          <p className="text-sm text-gray-500 mb-3 font-medium">共有リンク・IDから開く</p>
          <div className="flex gap-2">
            <input
              value={shareCode}
              onChange={(e) => setShareCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleOpenShare()}
              placeholder="URLまたはリストIDを貼り付け"
              className="flex-1 px-3 py-2.5 rounded-xl border border-orange-100 bg-orange-50/50 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
            />
            <button
              onClick={handleOpenShare}
              disabled={!shareCode.trim()}
              className="px-4 py-2.5 btn-orange text-sm disabled:opacity-40"
            >
              開く
            </button>
          </div>
        </div>

        {/* My lists */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-orange-300 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : lists.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">マイリスト</h2>
            <div className="space-y-3">
              {lists.map((list) => (
                <ListCard key={list.id} list={list} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
