import type { ShoppingList, ShoppingItem } from "@/types";
import { v4 as uuidv4 } from "uuid";

const STORE_KEY = "kaimono_store";

function load(): Record<string, ShoppingList> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function save(store: Record<string, ShoppingList>): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {}
}

export function createList(): ShoppingList {
  const list: ShoppingList = {
    id: uuidv4(),
    name: "かいものメモ",
    items: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const store = load();
  store[list.id] = list;
  save(store);
  return list;
}

export function getList(id: string): ShoppingList | null {
  return load()[id] ?? null;
}

export function updateListName(id: string, name: string): ShoppingList | null {
  const store = load();
  if (!store[id]) return null;
  store[id] = { ...store[id], name, updatedAt: Date.now() };
  save(store);
  return store[id];
}

export function deleteList(id: string): void {
  const store = load();
  delete store[id];
  save(store);
}

export function addItem(listId: string, text: string): ShoppingItem {
  const item: ShoppingItem = {
    id: uuidv4(),
    text,
    checked: false,
    createdAt: Date.now(),
  };
  const store = load();
  if (store[listId]) {
    store[listId].items.push(item);
    store[listId].updatedAt = Date.now();
    save(store);
  }
  return item;
}

export function patchItem(
  listId: string,
  itemId: string,
  patch: Partial<Pick<ShoppingItem, "text" | "checked">>
): void {
  const store = load();
  if (!store[listId]) return;
  const idx = store[listId].items.findIndex((i) => i.id === itemId);
  if (idx === -1) return;
  store[listId].items[idx] = { ...store[listId].items[idx], ...patch };
  store[listId].updatedAt = Date.now();
  save(store);
}

export function removeItem(listId: string, itemId: string): void {
  const store = load();
  if (!store[listId]) return;
  store[listId].items = store[listId].items.filter((i) => i.id !== itemId);
  store[listId].updatedAt = Date.now();
  save(store);
}
