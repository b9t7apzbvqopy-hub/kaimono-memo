"use client";

import { useEffect, useState } from "react";
import { useShoppingList } from "@/hooks/useShoppingList";
import { useMyLists } from "@/hooks/useMyLists";
import { AppHeader } from "@/components/layout/AppHeader";
import { BackgroundWrapper } from "@/components/layout/BackgroundWrapper";
import { ItemInput } from "./ItemInput";
import { ItemList } from "./ItemList";
import { ShareButton } from "./ShareButton";
import { CustomizeDrawer } from "@/components/customize/CustomizeDrawer";
import { Toast } from "@/components/ui/Toast";
import type { ShoppingList } from "@/types";

interface ShoppingListPageProps {
  initialData: ShoppingList;
}

export function ShoppingListPage({ initialData }: ShoppingListPageProps) {
  const { list, toastMessage, addItem, toggleItem, editItem, deleteItem, updateMeta } =
    useShoppingList(initialData);
  const { addListId } = useMyLists();
  const [customizeOpen, setCustomizeOpen] = useState(false);

  useEffect(() => {
    addListId(list.id);
  }, [list.id, addListId]);

  return (
    <BackgroundWrapper background={list.background}>
      <div className="min-h-screen flex flex-col max-w-lg mx-auto">
        <AppHeader
          name={list.name}
          icon={list.icon}
          onCustomize={() => setCustomizeOpen(true)}
          showBack
        />

        <div className="flex items-center justify-end px-4 py-2">
          <ShareButton listId={list.id} />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 pb-4">
          <ItemList
            items={list.items}
            onToggle={toggleItem}
            onEdit={editItem}
            onDelete={deleteItem}
          />
        </div>

        <div className="sticky bottom-0">
          <ItemInput onAdd={addItem} />
        </div>
      </div>

      <CustomizeDrawer
        list={list}
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        onSave={updateMeta}
      />

      <Toast message={toastMessage} />
    </BackgroundWrapper>
  );
}
