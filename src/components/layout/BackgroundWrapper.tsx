"use client";

import { useAppSettings } from "@/context/AppSettingsContext";
import type { ReactNode } from "react";

export function BackgroundWrapper({ children }: { children: ReactNode }) {
  const { theme } = useAppSettings();

  return (
    <div
      className="min-h-screen"
      style={{
        background: theme.gradient,
        "--accent-from": theme.accentFrom,
        "--accent-to": theme.accentTo,
        "--accent": theme.accent,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
