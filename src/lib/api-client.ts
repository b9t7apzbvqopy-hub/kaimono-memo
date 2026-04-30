import type { ShoppingItem, ShoppingList } from "@/types";

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function createList(): Promise<ShoppingList> {
  return req("/api/lists", { method: "POST" });
}

export function getList(id: string): Promise<ShoppingList | null> {
  return fetch(`/api/lists/${id}`)
    .then((r) => (r.status === 404 ? null : r.json()))
    .catch(() => null);
}

export function updateList(
  id: string,
  patch: Partial<Pick<ShoppingList, "name">>
): Promise<ShoppingList> {
  return req(`/api/lists/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

export function addItem(listId: string, text: string): Promise<ShoppingItem> {
  return req(`/api/lists/${listId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

export function patchItem(
  listId: string,
  itemId: string,
  patch: Partial<Pick<ShoppingItem, "text" | "checked">>
): Promise<ShoppingItem> {
  return req(`/api/lists/${listId}/items/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

export function deleteItem(listId: string, itemId: string): Promise<void> {
  return req(`/api/lists/${listId}/items/${itemId}`, { method: "DELETE" });
}
