import { NextResponse } from "next/server";
import { getKV } from "@/lib/kv";
import type { ShoppingList } from "@/types";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const kv = getKV();
  const list = await kv.get<ShoppingList>(`list:${params.id}`);
  if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(list);
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const kv = getKV();
    const list = await kv.get<ShoppingList>(`list:${params.id}`);
    if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const patch: Partial<Pick<ShoppingList, "name" | "icon" | "background">> = {};
    if (typeof body.name === "string") patch.name = body.name;
    if (typeof body.icon === "string") {
      if (body.icon.length > 900_000) {
        return NextResponse.json({ error: "Image too large" }, { status: 413 });
      }
      patch.icon = body.icon;
    }
    if (typeof body.background === "string") {
      if (body.background.length > 900_000) {
        return NextResponse.json({ error: "Image too large" }, { status: 413 });
      }
      patch.background = body.background;
    }

    const updated: ShoppingList = { ...list, ...patch, updatedAt: Date.now() };
    await kv.set(`list:${params.id}`, updated);
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const kv = getKV();
  await kv.del(`list:${params.id}`);
  return new NextResponse(null, { status: 204 });
}
