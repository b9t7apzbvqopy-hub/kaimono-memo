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
  name: string;
  icon: string;
  theme: string;
  fontSize: "small" | "medium" | "large";
  fontWeight: "normal" | "bold";
}
