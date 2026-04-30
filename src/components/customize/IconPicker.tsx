"use client";

import { useRef } from "react";
import { ICON_PRESETS } from "@/lib/constants";
import { useAppSettings } from "@/context/AppSettingsContext";

interface IconPickerProps {
  current: string;
  onChange: (icon: string) => void;
}

const ICON_COLORS = [
  "#FF6B35",
  "#2D9B6A",
  "#7C4DBC",
  "#3574D4",
  "#D4507A",
  "#B09030",
  "#E94560",
  "#4A8B40",
];

export function IconPicker({ current, onChange }: IconPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { settings, updateSettings } = useAppSettings();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const resized = await resizeImage(dataUrl, 64, 64);
      onChange(resized);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const isCustom = current.startsWith("data:");
  const currentColor = settings.iconColor;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(ICON_PRESETS).map(([key, emoji]) => {
          const selected = current === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="h-14 text-2xl flex items-center justify-center rounded-2xl transition-all bg-white/40 hover:bg-white/60"
              style={selected ? { outline: "2px solid var(--accent)", outlineOffset: "1px", background: "rgba(255,255,255,0.7)" } : {}}
              aria-label={key}
            >
              {emoji}
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-gray-200">
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full py-2.5 rounded-2xl text-sm text-center transition-all bg-white/40 hover:bg-white/60"
          style={isCustom ? { outline: "2px solid var(--accent)", outlineOffset: "1px" } : {}}
        >
          {isCustom ? (
            <span className="flex items-center justify-center gap-2">
              <img src={current} alt="custom" className="w-6 h-6 rounded object-cover" />
              カスタム画像を変更
            </span>
          ) : (
            "📷 カメラロールから選択"
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      <div className="pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-3">アイコンの色</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => updateSettings({ iconColor: "" })}
            className="w-10 h-10 rounded-full transition-all flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--accent-from), var(--accent-to))",
              outline: currentColor === "" ? "2px solid #1a1a1a" : "none",
              outlineOffset: "2px",
            }}
            aria-label="テーマの色"
            title="テーマの色"
          >
            <span className="text-white text-xs font-bold">A</span>
          </button>
          {ICON_COLORS.map((color) => {
            const selected = currentColor === color;
            return (
              <button
                key={color}
                onClick={() => updateSettings({ iconColor: color })}
                className="w-10 h-10 rounded-full transition-all"
                style={{
                  background: color,
                  outline: selected ? "2px solid #1a1a1a" : "none",
                  outlineOffset: "2px",
                }}
                aria-label={color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

async function resizeImage(dataUrl: string, maxW: number, maxH: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = dataUrl;
  });
}
