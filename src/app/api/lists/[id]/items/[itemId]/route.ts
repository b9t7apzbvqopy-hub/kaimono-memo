import { NextResponse } from "next/server";
import { getKV } from "@/lib/kv";
import type { ShoppingItem, ShoppingList } from "@/types";

type Params = { params: { id: string; itemId: string } };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const kv = getKV();
    const list = await kv.get<ShoppingList>(`list:${params.id}`);
    if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const itemIndex = list.items.findIndex((i) => i.id === params.itemId);
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const body = await request.json();
    const patch: Partial<Pick<ShoppingItem, "text" | "checked">> = {};
    if (typeof body.text === "string") patch.text = body.text.trim();
    if (typeof body.checked === "boolean") patch.checked = body.checked;

    const updatedItem: ShoppingItem = { ...list.items[itemIndex], ...patch };
    const updatedItems = [...list.items];
    updatedItems[itemIndex] = updatedItem;

    const updated: ShoppingList = {
      ...list,
      items: updatedItems,
      updatedAt: Date.now(),
    };
    await kv.set(`list:${params.id}`, updated);
    return NextResponse.json(updatedItem);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const kv = getKV();
    const list = await kv.get<ShoppingList>(`list:${params.id}`);
    if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated: ShoppingList = {
      ...list,
      items: list.items.filter((i) => i.id !== params.itemId),
      updatedAt: Date.now(),
    };
    await kv.set(`list:${params.id}`, updated);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
