export interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
  createdAt: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  name: string;   // "かいものメモ"
  icon: string;   // emoji key or "data:..."
  theme: string;  // theme key or "data:..." for custom bg
}
