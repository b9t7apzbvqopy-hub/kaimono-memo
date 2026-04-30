"use client";

import { useCallback, useEffect, useState } from "react";
import { useShoppingList } from "@/hooks/useShoppingList";
import { useMyLists } from "@/hooks/useMyLists";
import { useAppSettings, ListThemeProvider } from "@/context/AppSettingsContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { BackgroundWrapper } from "@/components/layout/BackgroundWrapper";
import { ItemInput } from "./ItemInput";
import { ItemList } from "./ItemList";
import { ShareButton } from "./ShareButton";
import { CustomizeDrawer } from "@/components/customize/CustomizeDrawer";
import { Toast } from "@/components/ui/Toast";
import { getListTheme, getListIcon } from "@/lib/listThemes";
import type { ShoppingList } from "@/types";

interface ShoppingListPageProps {
  initialData: ShoppingList;
}

export function ShoppingListPage({ initialData }: ShoppingListPageProps) {
  const { list, toastMessage, addItem, toggleItem, editItem, deleteItem, updateName } =
    useShoppingList(initialData);
  const { addListId } = useMyLists();
  const { settings } = useAppSettings();
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [listThemeKey, setListThemeKey] = useState<string>(settings.theme);
  const [listIcon, setListIcon] = useState<string>(settings.icon);

  useEffect(() => {
    addListId(list.id);
  }, [list.id, addListId]);

  useEffect(() => {
    const saved = getListTheme(list.id);
    setListThemeKey(saved ?? settings.theme);
  }, [list.id, settings.theme]);

  useEffect(() => {
    const saved = getListIcon(list.id);
    setListIcon(saved ?? settings.icon);
  }, [list.id, settings.icon]);

  const handleListThemeChange = useCallback((themeKey: string) => {
    setListThemeKey(themeKey);
  }, []);

  const handleListIconChange = useCallback((icon: string) => {
    setListIcon(icon);
  }, []);

  return (
    <ListThemeProvider themeKey={listThemeKey}>
      <BackgroundWrapper>
        <div className="min-h-screen flex flex-col">
          <div className="max-w-[440px] mx-auto w-full flex flex-col flex-1">
            <AppHeader
              name={list.name}
              onCustomize={() => setCustomizeOpen(true)}
              showBack
              listIcon={listIcon}
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
        </div>

        <CustomizeDrawer
          list={list}
          listId={list.id}
          open={customizeOpen}
          onClose={() => setCustomizeOpen(false)}
          onSaveName={updateName}
          onListThemeChange={handleListThemeChange}
          onListIconChange={handleListIconChange}
        />

        <Toast message={toastMessage} />
      </BackgroundWrapper>
    </ListThemeProvider>
  );
}
