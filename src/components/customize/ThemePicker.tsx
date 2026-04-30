"use client";

import { useRef } from "react";
import { THEMES } from "@/lib/themes";

interface ThemePickerProps {
  current: string;
  onChange: (theme: string) => void;
}

export function ThemePicker({ current, onChange }: ThemePickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const resized = await resizeImage(dataUrl, 800, 600);
      if (resized.length > 900_000) {
        alert("画像が大きすぎます。より小さい画像を選んでください。");
        return;
      }
      onChange(resized);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const isCustom = current.startsWith("data:");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(THEMES).map(([key, theme]) => {
          const selected = current === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex flex-col items-center gap-1.5 p-2 h-20 rounded-2xl transition-all bg-white/30 hover:bg-white/50"
              style={selected ? { outline: "2px solid var(--accent)", outlineOffset: "1px", background: "rgba(255,255,255,0.6)" } : {}}
            >
              <div
                className="w-10 h-10 rounded-xl shadow-inner flex-shrink-0"
                style={{ background: theme.swatch }}
              />
              <span className="text-xs text-gray-600">{theme.label}</span>
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
          {isCustom ? "📷 カスタム背景を変更" : "🖼️ 写真を背景にする"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <p className="text-xs text-gray-400 text-center mt-1">推奨: 1MB以下</p>
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
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = dataUrl;
  });
}
