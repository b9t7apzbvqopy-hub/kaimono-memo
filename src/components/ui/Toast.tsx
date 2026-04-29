"use client";

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-gray-800 text-white text-sm px-4 py-2 rounded-2xl shadow-lg">
        {message}
      </div>
    </div>
  );
}
