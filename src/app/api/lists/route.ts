import { NextResponse } from "next/server";
import { getKV } from "@/lib/kv";
import { generateId } from "@/lib/uuid";
import { DEFAULT_BACKGROUND, DEFAULT_ICON, DEFAULT_LIST_NAME } from "@/lib/constants";
import type { ShoppingList } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name: string = body.name || DEFAULT_LIST_NAME;

    const kv = getKV();
    const id = generateId();

    const list: ShoppingList = {
      id,
      name,
      icon: DEFAULT_ICON,
      background: DEFAULT_BACKGROUND,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await kv.set(`list:${id}`, list);
    return NextResponse.json(list, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
