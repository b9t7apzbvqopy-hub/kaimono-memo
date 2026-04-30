"use client";

import { useState } from "react";
import { useAppSettings } from "@/context/AppSettingsContext";

interface ShareButtonProps {
  listId: string;
}

export function ShareButton({ listId }: ShareButtonProps) {
  const { theme } = useAppSettings();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/list/${listId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "かいものメモ", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  const bg = theme.isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.7)";
  const color = theme.isDark ? "white" : "#4B5563";

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-4 py-2 rounded-[14px] text-sm font-medium transition-opacity hover:opacity-80 shadow-sm backdrop-blur-sm"
      style={{ background: bg, color }}
      aria-label="共有"
    >
      <span>{copied ? "✓" : "🔗"}</span>
      <span>{copied ? "コピーしました！" : "共有"}</span>
    </button>
  );
}
