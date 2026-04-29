"use client";

import { useEffect, useRef, useState } from "react";
import { IconPicker } from "./IconPicker";
import { BackgroundPicker } from "./BackgroundPicker";
import type { ShoppingList } from "@/types";

type Tab = "name" | "icon" | "background";

interface CustomizeDrawerProps {
  list: ShoppingList;
  open: boolean;
  onClose: () => void;
  onSave: (
    patch: Partial<Pick<ShoppingList, "name" | "icon" | "background">>
  ) => void;
}

export function CustomizeDrawer({
  list,
  open,
  onClose,
  onSave,
}: CustomizeDrawerProps) {
  const [tab, setTab] = useState<Tab>("name");
  const [name, setName] = useState(list.name);
  const [icon, setIcon] = useState(list.icon);
  const [background, setBackground] = useState(list.background);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setName(list.name);
      setIcon(list.icon);
      setBackground(list.background);
      setTab("name");
    }
  }, [open, list.name, list.icon, list.background]);

  const handleSave = () => {
    onSave({ name: name.trim() || list.name, icon, background });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md rounded-t-3xl shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="font-bold text-gray-800 text-lg">カスタマイズ</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex border-b border-gray-200 px-4">
          {(["name", "icon", "background"] as Tab[]).map((t) => {
            const labels: Record<Tab, string> = {
              name: "名前",
              icon: "アイコン",
              background: "背景",
            };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  tab === t
                    ? "border-orange-400 text-orange-500"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {labels[t]}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "name" && (
            <div className="space-y-2">
              <label className="text-sm text-gray-500">リスト名</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="かいものメモ"
                maxLength={30}
                className="w-full px-4 py-3 rounded-[14px] border border-orange-100 bg-orange-50/40 focus:outline-none focus:ring-2 focus:ring-orange-200 text-gray-800 text-lg"
              />
            </div>
          )}
          {tab === "icon" && (
            <IconPicker current={icon} onChange={setIcon} />
          )}
          {tab === "background" && (
            <BackgroundPicker current={background} onChange={setBackground} />
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full py-3.5 btn-orange text-lg"
          >
            保存する
          </button>
        </div>
      </div>
    </>
  );
}
