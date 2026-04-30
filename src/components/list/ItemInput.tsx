"use client";

import { useState, useRef } from "react";
import { useAppSettings } from "@/context/AppSettingsContext";

interface ItemInputProps {
  onAdd: (text: string) => void;
}

export function ItemInput({ onAdd }: ItemInputProps) {
  const { theme } = useAppSettings();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
    inputRef.current?.focus();
  };

  const inputBg = theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)";
  const inputColor = theme.isDark ? "white" : "#374151";
  const wrapperBg = theme.isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)";

  return (
    <div className="px-4 py-3 backdrop-blur-md border-t" style={{ background: wrapperBg, borderColor: theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.6)" }}>
      <div className="flex gap-2 max-w-[440px] mx-auto">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="アイテムを入力..."
          className="flex-1 px-4 py-2.5 rounded-[14px] border outline-none transition-all text-base"
          style={{
            background: inputBg,
            color: inputColor,
            borderColor: "rgba(0,0,0,0.12)",
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="px-5 py-2.5 btn-primary text-base"
        >
          追加
        </button>
      </div>
    </div>
  );
}
