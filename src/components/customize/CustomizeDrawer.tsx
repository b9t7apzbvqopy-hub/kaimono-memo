"use client";

import { useEffect, useState } from "react";
import { IconPicker } from "./IconPicker";
import { ThemePicker } from "./ThemePicker";
import { useAppSettings } from "@/context/AppSettingsContext";
import { getListTheme, saveListTheme } from "@/lib/listThemes";
import type { ShoppingList } from "@/types";

type Tab = "name" | "icon" | "theme" | "font";

interface CustomizeDrawerProps {
  list?: ShoppingList;
  listId?: string;
  open: boolean;
  onClose: () => void;
  onSaveName?: (name: string) => void;
  onListThemeChange?: (themeKey: string) => void;
}

export function CustomizeDrawer({ list, listId, open, onClose, onSaveName, onListThemeChange }: CustomizeDrawerProps) {
  const { settings, updateSettings } = useAppSettings();
  const hasListContext = !!list && !!onSaveName;
  const defaultTab: Tab = hasListContext ? "name" : "theme";

  const [tab, setTab] = useState<Tab>(defaultTab);
  const [name, setName] = useState(list?.name ?? "");
  const [icon, setIcon] = useState(settings.icon);
  const [homeTheme, setHomeTheme] = useState(settings.homeTheme);
  const [listTheme, setListTheme] = useState(settings.theme);
  const [fontSize, setFontSize] = useState(settings.fontSize);
  const [fontWeight, setFontWeight] = useState(settings.fontWeight);

  useEffect(() => {
    if (open) {
      setName(list?.name ?? "");
      setIcon(settings.icon);
      setHomeTheme(settings.homeTheme);
      setFontSize(settings.fontSize);
      setFontWeight(settings.fontWeight);
      setTab(hasListContext ? "name" : "theme");

      if (listId) {
        const saved = getListTheme(listId);
        setListTheme(saved ?? settings.theme);
      } else {
        setListTheme(settings.theme);
      }
    }
  }, [open, list?.name, listId, settings.icon, settings.homeTheme, settings.theme, settings.fontSize, settings.fontWeight, hasListContext]);

  const handleSave = () => {
    if (hasListContext) {
      onSaveName!(name.trim() || list!.name);
    }

    if (listId) {
      saveListTheme(listId, listTheme);
      onListThemeChange?.(listTheme);
    }

    if (hasListContext) {
      updateSettings({ icon, fontSize, fontWeight });
    } else {
      updateSettings({ icon, homeTheme, fontSize, fontWeight });
    }

    onClose();
  };

  if (!open) return null;

  const TABS: { key: Tab; label: string }[] = [
    ...(hasListContext ? [{ key: "name" as Tab, label: "リスト名" }] : []),
    { key: "icon", label: "アイコン" },
    { key: "theme", label: "背景" },
    { key: "font", label: "文字" },
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
          {tab === "name" && hasListContext && (
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
          {tab === "theme" && (
            listId ? (
              <ThemePicker current={listTheme} onChange={setListTheme} />
            ) : (
              <ThemePicker current={homeTheme} onChange={setHomeTheme} />
            )
          )}
          {tab === "font" && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-3">文字サイズ</p>
                <div className="flex gap-2">
                  {(["small", "medium", "large"] as const).map((size) => {
                    const labels = { small: "小", medium: "中", large: "大" };
                    const selected = fontSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className="flex-1 py-3 rounded-2xl text-sm font-medium transition-all"
                        style={selected
                          ? { outline: "2px solid var(--accent)", outlineOffset: "1px", background: "rgba(255,255,255,0.7)", color: "var(--accent)" }
                          : { background: "rgba(255,255,255,0.4)", color: "#6B7280" }}
                      >
                        {labels[size]}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">文字の太さ</p>
                <div className="flex gap-2">
                  {(["normal", "bold"] as const).map((weight) => {
                    const labels = { normal: "普通", bold: "太字" };
                    const selected = fontWeight === weight;
                    return (
                      <button
                        key={weight}
                        onClick={() => setFontWeight(weight)}
                        className="flex-1 py-3 rounded-2xl text-sm transition-all"
                        style={{
                          fontWeight: weight === "bold" ? 700 : 400,
                          ...(selected
                            ? { outline: "2px solid var(--accent)", outlineOffset: "1px", background: "rgba(255,255,255,0.7)", color: "var(--accent)" }
                            : { background: "rgba(255,255,255,0.4)", color: "#6B7280" }),
                        }}
                      >
                        {labels[weight]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
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
