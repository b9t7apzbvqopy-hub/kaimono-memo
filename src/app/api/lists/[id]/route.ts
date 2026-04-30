import { NextRequest, NextResponse } from "next/server";
import { redis, TTL } from "@/lib/redis";
import type { ShoppingList } from "@/types";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const list = await redis.get<ShoppingList>(`list:${params.id}`);
  if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(list);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const list = await redis.get<ShoppingList>(`list:${params.id}`);
  if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const updated: ShoppingList = {
    ...list,
    name: typeof body.name === "string" ? body.name.trim() || list.name : list.name,
    updatedAt: Date.now(),
  };
  await redis.set(`list:${params.id}`, updated, { ex: TTL });
  return NextResponse.json(updated);
}
