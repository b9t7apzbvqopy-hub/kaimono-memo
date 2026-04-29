"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "kaimono_memo_lists";

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // private mode or storage full
  }
}

export function useMyLists() {
  const [listIds, setListIds] = useState<string[]>([]);

  useEffect(() => {
    setListIds(readIds());
  }, []);

  const addListId = useCallback((id: string) => {
    setListIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [id, ...prev];
      writeIds(next);
      return next;
    });
  }, []);

  const removeListId = useCallback((id: string) => {
    setListIds((prev) => {
      const next = prev.filter((x) => x !== id);
      writeIds(next);
      return next;
    });
  }, []);

  return { listIds, addListId, removeListId };
}
