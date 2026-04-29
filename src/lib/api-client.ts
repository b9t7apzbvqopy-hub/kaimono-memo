import type { ShoppingItem, ShoppingList } from "@/types";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function createList(name?: string): Promise<ShoppingList> {
  return apiFetch("/api/lists", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function getList(id: string): Promise<ShoppingList | null> {
  try {
    return await apiFetch(`/api/lists/${id}`);
  } catch {
    return null;
  }
}

export async function updateList(
  id: string,
  patch: Partial<Pick<ShoppingList, "name" | "icon" | "background">>
): Promise<ShoppingList> {
  return apiFetch(`/api/lists/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export async function deleteList(id: string): Promise<void> {
  return apiFetch(`/api/lists/${id}`, { method: "DELETE" });
}

export async function addItem(
  listId: string,
  text: string
): Promise<ShoppingItem> {
  return apiFetch(`/api/lists/${listId}/items`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export async function patchItem(
  listId: string,
  itemId: string,
  patch: Partial<Pick<ShoppingItem, "text" | "checked">>
): Promise<ShoppingItem> {
  return apiFetch(`/api/lists/${listId}/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteItem(
  listId: string,
  itemId: string
): Promise<void> {
  return apiFetch(`/api/lists/${listId}/items/${itemId}`, {
    method: "DELETE",
  });
}
