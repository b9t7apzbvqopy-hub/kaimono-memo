"use client";

import { useEffect, useState } from "react";
import { IconPicker } from "./IconPicker";
import { ThemePicker } from "./ThemePicker";
import { useAppSettings } from "@/context/AppSettingsContext";
import type { ShoppingList } from "@/types";

type Tab = "name" | "icon" | "theme";

interface CustomizeDrawerProps {
  list: ShoppingList;
  open: boolean;
  onClose: () => void;
  onSaveName: (name: string) => void;
}

export function CustomizeDrawer({ list, open, onClose, onSaveName }: CustomizeDrawerProps) {
  const { settings, updateSettings } = useAppSettings();
  const [tab, setTab] = useState<Tab>("name");
  const [name, setName] = useState(list.name);
  const [icon, setIcon] = useState(settings.icon);
  const [theme, setTheme] = useState(settings.theme);

  useEffect(() => {
    if (open) {
      setName(list.name);
      setIcon(settings.icon);
      setTheme(settings.theme);
      setTab("name");
    }
  }, [open, list.name, settings.icon, settings.theme]);

  const handleSave = () => {
    onSaveName(name.trim() || list.name);
    updateSettings({ icon, theme });
    onClose();
  };

  if (!open) return null;

  const TABS: { key: Tab; label: string }[] = [
    { key: "name", label: "リスト名" },
    { key: "icon", label: "アイコン" },
    { key: "theme", label: "背景" },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md rounded-t-3xl shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="font-bold text-gray-800 text-lg">カスタマイズ</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-lg transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex border-b border-gray-200 px-4">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
              style={
                tab === key
                  ? { borderColor: "var(--accent)", color: "var(--accent)" }
                  : { borderColor: "transparent", color: "#6B7280" }
              }
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "name" && (
            <div className="space-y-2">
              <label className="text-sm text-gray-500">リスト名</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="かいものメモ"
                maxLength={30}
                className="w-full px-4 py-3 rounded-[14px] border border-gray-200 bg-gray-50 focus:outline-none text-gray-800 text-lg transition-all"
                style={{ "--tw-ring-color": "var(--accent)" } as React.CSSProperties}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>
          )}
          {tab === "icon" && <IconPicker current={icon} onChange={setIcon} />}
          {tab === "theme" && <ThemePicker current={theme} onChange={setTheme} />}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleSave} className="w-full py-3.5 btn-primary text-lg">
            保存する
          </button>
        </div>
      </div>
    </>
  );
}
