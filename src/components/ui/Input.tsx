"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ fullWidth = false, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          px-4 py-2 rounded-2xl
          bg-white/70 backdrop-blur-sm
          border border-white/50
          text-gray-800 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary/50
          transition-all
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
