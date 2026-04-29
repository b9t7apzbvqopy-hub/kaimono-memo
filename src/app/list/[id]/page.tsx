import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getKV } from "@/lib/kv";
import { ShoppingListPage } from "@/components/list/ShoppingListPage";
import type { ShoppingList } from "@/types";
import { ICON_PRESETS } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const kv = getKV();
  const list = await kv.get<ShoppingList>(`list:${params.id}`);
  if (!list) return { title: "リストが見つかりません" };

  const iconEmoji = list.icon.startsWith("data:") ? "🛒" : (ICON_PRESETS[list.icon] ?? "🛒");
  return {
    title: `${iconEmoji} ${list.name} | かいものメモ`,
    description: `${list.items.length}件のアイテム`,
  };
}

export default async function ListPage({ params }: Props) {
  const kv = getKV();
  const list = await kv.get<ShoppingList>(`list:${params.id}`);
  if (!list) notFound();

  return <ShoppingListPage initialData={list} />;
}
