import { NextResponse } from "next/server";
import { getKV } from "@/lib/kv";
import { generateId } from "@/lib/uuid";
import type { ShoppingItem, ShoppingList } from "@/types";

type Params = { params: { id: string } };

export async function POST(request: Request, { params }: Params) {
  try {
    const kv = getKV();
    const list = await kv.get<ShoppingList>(`list:${params.id}`);
    if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    if (!body.text || typeof body.text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const item: ShoppingItem = {
      id: generateId(),
      text: body.text.trim(),
      checked: false,
      createdAt: Date.now(),
    };

    const updated: ShoppingList = {
      ...list,
      items: [...list.items, item],
      updatedAt: Date.now(),
    };
    await kv.set(`list:${params.id}`, updated);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
