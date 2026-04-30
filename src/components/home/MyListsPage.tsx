"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyLists } from "@/hooks/useMyLists";
import { useAppSettings } from "@/context/AppSettingsContext";
import { ListCard } from "./ListCard";
import { IconPicker } from "@/components/customize/IconPicker";
import * as api from "@/lib/api-client";
import { ICON_PRESETS } from "@/lib/constants";
import type { ShoppingList } from "@/types";

export function MyListsPage() {
  const router = useRouter();
  const { listIds, addListId, removeListId } = useMyLists();
  const { settings, theme, updateSettings } = useAppSettings();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [shareCode, setShareCode] = useState("");

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(settings.name);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [iconModalOpen, setIconModalOpen] = useState(false);

  useEffect(() => { setNameInput(settings.name); }, [settings.name]);
  useEffect(() => { if (editingName) nameInputRef.current?.focus(); }, [editingName]);

  const commitName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) updateSettings({ name: trimmed });
    else setNameInput(settings.name);
    setEditingName(false);
  };

  useEffect(() => {
    if (listIds.length === 0) { setLoading(false); setLists([]); return; }
    setLoading(true);
    Promise.all(listIds.map((id) => api.getList(id))).then((results) => {
      const valid: ShoppingList[] = [];
      results.forEach((list, i) => {
        if (list) valid.push(list);
        else removeListId(listIds[i]);
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
    } catch {
      setCreating(false);
    }
  }, [addListId, router, creating]);

  const handleDelete = useCallback(
    (id: string) => {
      if (!confirm("このリストをマイリストから削除しますか？")) return;
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

  const iconDisplay = settings.icon.startsWith("data:") ? (
    <img src={settings.icon} alt="icon" className="w-12 h-12 rounded-xl object-cover" />
  ) : (
    <span className="text-5xl">{ICON_PRESETS[settings.icon] ?? "🛒"}</span>
  );

  const textColor = theme.isDark ? "text-white" : "text-gray-800";
  const mutedColor = theme.isDark ? "text-white/50" : "text-gray-400";
  const inputBg = theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)";
  const inputColor = theme.isDark ? "white" : "#374151";
  const cardBg = theme.isDark ? "rgba(255,255,255,0.1)" : "white";

  return (
    <div className="min-h-screen" style={{ background: theme.gradient }}>
      <div className="max-w-[440px] mx-auto px-4 pt-12 pb-24">

        {/* Hero */}
        <div className="flex flex-col items-center mb-10">
          <button
            onClick={() => setIconModalOpen(true)}
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg mb-5 transition-opacity hover:opacity-85 active:scale-95"
            style={{ background: `linear-gradient(135deg, var(--accent-from), var(--accent-to))` }}
            aria-label="アイコンを変更"
          >
            {iconDisplay}
          </button>

          {editingName ? (
            <input
              ref={nameInputRef}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitName();
                if (e.key === "Escape") { setNameInput(settings.name); setEditingName(false); }
              }}
              maxLength={20}
              className="text-2xl font-bold text-center bg-transparent border-b-2 outline-none w-full max-w-[220px]"
              style={{ borderColor: "var(--accent)", color: inputColor }}
            />
          ) : (
            <h1
              onClick={() => setEditingName(true)}
              className={`text-2xl font-bold tracking-wide cursor-pointer hover:opacity-70 transition-opacity ${textColor}`}
              title="タップして名前を変更"
            >
              {settings.name}
            </h1>
          )}
          <p className={`text-sm mt-1 ${mutedColor}`}>みんなで使える買い物リスト</p>
        </div>

        {/* Create */}
        <button onClick={handleCreate} disabled={creating} className="w-full py-4 text-lg btn-primary">
          {creating ? "作成中..." : "+ 新しいリストを作る"}
        </button>

        {/* Share code */}
        <div className="mt-4 p-4 rounded-[20px] shadow-sm" style={{ background: cardBg }}>
          <p className={`text-sm mb-3 font-medium ${theme.isDark ? "text-white/70" : "text-gray-500"}`}>
            共有リンク・IDから参加
          </p>
          <div className="flex gap-2">
            <input
              value={shareCode}
              onChange={(e) => setShareCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleOpenShare()}
              placeholder="URLまたはリストIDを貼り付け"
              className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none transition-all"
              style={{ background: inputBg, color: inputColor, borderColor: "rgba(0,0,0,0.12)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
            />
            <button onClick={handleOpenShare} disabled={!shareCode.trim()} className="px-4 py-2.5 btn-primary text-sm">
              開く
            </button>
          </div>
        </div>

        {/* My lists */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `var(--accent) transparent transparent transparent` }} />
          </div>
        ) : lists.length > 0 ? (
          <div className="mt-8">
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 px-1 ${mutedColor}`}>マイリスト</h2>
            <div className="space-y-3">
              {lists.map((list) => <ListCard key={list.id} list={list} onDelete={handleDelete} />)}
            </div>
          </div>
        ) : null}
      </div>

      {/* Icon Modal */}
      {iconModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={() => setIconModalOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md rounded-t-3xl shadow-xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h2 className="font-bold text-gray-800 text-lg">アイコンを選択</h2>
              <button onClick={() => setIconModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-lg">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <IconPicker
                current={settings.icon}
                onChange={(icon) => { updateSettings({ icon }); setIconModalOpen(false); }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
