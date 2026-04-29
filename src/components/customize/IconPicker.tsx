"use client";

import { useRef } from "react";
import { ICON_PRESETS } from "@/lib/constants";

interface IconPickerProps {
  current: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ current, onChange }: IconPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(ICON_PRESETS).map(([key, emoji]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`
              h-14 text-2xl flex items-center justify-center rounded-2xl
              transition-all
              ${current === key
                ? "bg-primary/20 ring-2 ring-primary scale-105"
                : "bg-white/40 hover:bg-white/60"
              }
            `}
            aria-label={key}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="pt-2 border-t border-white/30">
        <button
          onClick={() => fileRef.current?.click()}
          className={`
            w-full py-2 rounded-2xl text-sm text-center transition-all
            ${isCustom
              ? "bg-primary/20 ring-2 ring-primary"
              : "bg-white/40 hover:bg-white/60"
            }
          `}
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
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <p className="text-xs opacity-50 text-center mt-1">推奨: 1MB以下</p>
      </div>
    </div>
  );
}

async function resizeImage(
  dataUrl: string,
  maxW: number,
  maxH: number
): Promise<string> {
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
