"use client";

import { BACKGROUND_THEMES } from "@/lib/constants";
import { ReactNode } from "react";

interface BackgroundWrapperProps {
  background: string;
  children: ReactNode;
}

export function BackgroundWrapper({ background, children }: BackgroundWrapperProps) {
  const isCustom = background.startsWith("data:");

  if (isCustom) {
    return (
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        {children}
      </div>
    );
  }

  const theme = BACKGROUND_THEMES[background] ?? BACKGROUND_THEMES.sunset;
  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.fromClass} ${theme.toClass}`}
    >
      {children}
    </div>
  );
}
