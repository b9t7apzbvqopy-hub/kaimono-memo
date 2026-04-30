import { notFound } from "next/navigation";
import { redis } from "@/lib/redis";
import { ShoppingListPage } from "@/components/list/ShoppingListPage";
import type { ShoppingList } from "@/types";

export const dynamic = "force-dynamic";

export default async function ListPage({ params }: { params: { id: string } }) {
  const list = await redis.get<ShoppingList>(`list:${params.id}`);
  if (!list) notFound();
  return <ShoppingListPage initialData={list} />;
}
