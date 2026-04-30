"use client";

import { useAppSettings } from "@/context/AppSettingsContext";
import type { ReactNode } from "react";

export function BackgroundWrapper({ children }: { children: ReactNode }) {
  const { settings, theme } = useAppSettings();
  const isCustom = settings.theme.startsWith("data:");

  const bgStyle = isCustom
    ? { backgroundImage: `url(${settings.theme})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: theme.gradient };

  return (
    <div className="min-h-screen" style={bgStyle}>
      {children}
    </div>
  );
}
