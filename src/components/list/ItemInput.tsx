"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
    <div className="flex gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm border-t border-white/30">
      <Input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="アイテムを入力..."
        fullWidth
        className="flex-1"
      />
      <Button
        onClick={handleSubmit}
        disabled={!text.trim()}
        size="md"
      >
        追加
      </Button>
    </div>
  );
}
