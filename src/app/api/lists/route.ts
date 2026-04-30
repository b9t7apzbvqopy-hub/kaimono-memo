import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { redis, TTL } from "@/lib/redis";
import type { ShoppingList } from "@/types";

export async function POST() {
  const list: ShoppingList = {
    id: uuidv4(),
    name: "かいものメモ",
    items: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await redis.set(`list:${list.id}`, list, { ex: TTL });
  return NextResponse.json(list, { status: 201 });
}
