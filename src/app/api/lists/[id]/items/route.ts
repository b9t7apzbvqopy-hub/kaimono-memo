import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { redis, TTL } from "@/lib/redis";
import type { ShoppingItem, ShoppingList } from "@/types";

type Ctx = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Ctx) {
  const list = await redis.get<ShoppingList>(`list:${params.id}`);
  if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { text } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: "text required" }, { status: 400 });

  const item: ShoppingItem = {
    id: uuidv4(),
    text: text.trim(),
    checked: false,
    createdAt: Date.now(),
  };

  await redis.set(
    `list:${params.id}`,
    { ...list, items: [...list.items, item], updatedAt: Date.now() },
    { ex: TTL }
  );
  return NextResponse.json(item, { status: 201 });
}
