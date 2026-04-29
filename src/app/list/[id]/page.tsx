"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import * as storage from "@/lib/storage";
import { ShoppingListPage } from "@/components/list/ShoppingListPage";
import type { ShoppingList } from "@/types";

export default function ListPage() {
  const params = useParams();
  const id = params.id as string;
  const [list, setList] = useState<ShoppingList | null | "loading">("loading");

  useEffect(() => {
    setList(storage.getList(id));
  }, [id]);

  if (list === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(168deg, #FFF8F0 0%, #FFF1E6 40%, #FFE8D6 100%)" }}>
        <div className="w-10 h-10 border-4 border-orange-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (list === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 text-center" style={{ background: "linear-gradient(168deg, #FFF8F0 0%, #FFF1E6 40%, #FFE8D6 100%)" }}>
        <span className="text-6xl">🤔</span>
        <div>
          <h1 className="text-xl font-bold text-gray-700 mb-2">リストが見つかりません</h1>
          <p className="text-sm text-gray-400">このリストはこのデバイスのブラウザに保存されていません</p>
        </div>
        <Link href="/" className="btn-orange px-6 py-3 inline-block">
          ホームに戻る
        </Link>
      </div>
    );
  }

  return <ShoppingListPage initialData={list} />;
}
