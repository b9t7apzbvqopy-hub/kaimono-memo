import { NextRequest, NextResponse } from "next/server";
import { redis, TTL } from "@/lib/redis";
import type { ShoppingList } from "@/types";

type Ctx = { params: { id: string; itemId: string } };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const list = await redis.get<ShoppingList>(`list:${params.id}`);
  if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const idx = list.items.findIndex((i) => i.id === params.itemId);
  if (idx === -1) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  const items = [...list.items];
  items[idx] = { ...items[idx], ...body };

  await redis.set(`list:${params.id}`, { ...list, items, updatedAt: Date.now() }, { ex: TTL });
  return NextResponse.json(items[idx]);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const list = await redis.get<ShoppingList>(`list:${params.id}`);
  if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await redis.set(
    `list:${params.id}`,
    { ...list, items: list.items.filter((i) => i.id !== params.itemId), updatedAt: Date.now() },
    { ex: TTL }
  );
  return new NextResponse(null, { status: 204 });
}
