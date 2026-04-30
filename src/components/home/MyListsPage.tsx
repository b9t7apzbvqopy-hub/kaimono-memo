"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyLists } from "@/hooks/useMyLists";
import { useAppSettings } from "@/context/AppSettingsContext";
import { ListCard } from "./ListCard";
import { IconPicker } from "@/components/customize/IconPicker";
import { CustomizeDrawer } from "@/components/customize/CustomizeDrawer";
import * as api from "@/lib/api-client";
import { ICON_PRESETS } from "@/lib/constants";
import { Toast } from "@/components/ui/Toast";
import type { ShoppingList } from "@/types";

export function MyListsPage() {
  const router = useRouter();
  const { listIds, addListId, removeListId } = useMyLists();
  const { settings, homeTheme, updateSettings } = useAppSettings();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(settings.name);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);

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
    setCreateError(null);
    try {
      const list = await api.createList();
      addListId(list.id);
      router.push(`/list/${list.id}`);
    } catch {
      setCreating(false);
      setCreateError("リストの作成に失敗しました。もう一度お試しください。");
      setTimeout(() => setCreateError(null), 3000);
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

  const iconDisplay = settings.icon.startsWith("data:") ? (
    <img src={settings.icon} alt="icon" className="w-12 h-12 rounded-xl object-cover" />
  ) : (
    <span className="text-5xl">{ICON_PRESETS[settings.icon] ?? "🛒"}</span>
  );

  const textColor = homeTheme.isDark ? "text-white" : "text-gray-800";
  const mutedColor = homeTheme.isDark ? "text-white/50" : "text-gray-400";
  const inputColor = homeTheme.isDark ? "white" : "#374151";

  const homeBgStyle = settings.homeTheme.startsWith("data:")
    ? { backgroundImage: `url(${settings.homeTheme})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: homeTheme.gradient };

  return (
    <div className="min-h-screen" style={homeBgStyle}>
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
          <button
            onClick={() => setCustomizeOpen(true)}
            className="mt-3 px-4 py-1.5 rounded-full text-xs transition-all hover:opacity-80"
            style={{
              background: homeTheme.isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)",
              color: homeTheme.isDark ? "rgba(255,255,255,0.7)" : "#6B7280",
            }}
          >
            ✏️ カスタマイズ
          </button>
        </div>

        {/* Create */}
        <button onClick={handleCreate} disabled={creating} className="w-full py-4 text-lg btn-primary">
          {creating ? "作成中..." : "+ 新しいリストを作る"}
        </button>

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

      <Toast message={createError} />

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

      <CustomizeDrawer
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
      />
    </div>
  );
}
