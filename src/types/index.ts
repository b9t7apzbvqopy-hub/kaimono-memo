export interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
  createdAt: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  icon: string;
  background: string;
  items: ShoppingItem[];
  createdAt: number;
  updatedAt: number;
}
