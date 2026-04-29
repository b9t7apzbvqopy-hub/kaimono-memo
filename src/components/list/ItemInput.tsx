"use client";

import { useState, useRef } from "react";

interface ItemInputProps {
  onAdd: (text: string) => void;
}

export function ItemInput({ onAdd }: ItemInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
    inputRef.current?.focus();
  };

  return (
    <div className="px-4 py-3 bg-white/80 backdrop-blur-md border-t border-white/60">
      <div className="flex gap-2 max-w-[440px] mx-auto">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="アイテムを入力..."
          className="flex-1 px-4 py-2.5 rounded-[14px] border border-orange-100 bg-orange-50/60 text-gray-800 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all text-base"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="px-5 py-2.5 btn-orange disabled:opacity-40 text-base"
        >
          追加
        </button>
      </div>
    </div>
  );
}
