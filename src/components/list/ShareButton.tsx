"use client";

import { useState } from "react";

interface ShareButtonProps {
  listId: string;
}

export function ShareButton({ listId }: ShareButtonProps) {
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
    } catch {
      // user cancelled or not supported
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-4 py-2 rounded-[14px] bg-white/70 hover:bg-white/90 text-sm font-medium text-gray-600 transition-colors shadow-sm backdrop-blur-sm"
      aria-label="共有"
    >
      <span>{copied ? "✓" : "🔗"}</span>
      <span>{copied ? "コピーしました！" : "共有"}</span>
    </button>
  );
}
