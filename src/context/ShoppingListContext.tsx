
import React, { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "sonner";

export interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
}

type FilterType = "all" | "pending" | "completed";

interface ShoppingListContextType {
  items: ShoppingItem[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  filteredItems: ShoppingItem[];
  addItem: (name: string) => void;
  removeItem: (id: string) => void;
  toggleItemCompletion: (id: string) => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error("useShoppingList must be used within a ShoppingListProvider");
  }
  return context;
};

interface ShoppingListProviderProps {
  children: ReactNode;
}

export const ShoppingListProvider = ({ children }: ShoppingListProviderProps) => {
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: "1", name: "Milk", completed: false },
    { id: "2", name: "Bread", completed: false },
    { id: "3", name: "Eggs", completed: false },
  ]);
  const [filter, setFilter] = useState<FilterType>("all");

  const addItem = (name: string) => {
    if (!name.trim()) return;
    
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: name.trim(),
      completed: false,
    };
    
    setItems([...items, newItem]);
    toast.success(`Added ${name} to your shopping list`);
  };

  const removeItem = (id: string) => {
    const itemToRemove = items.find(item => item.id === id);
    setItems(items.filter(item => item.id !== id));
    
    if (itemToRemove) {
      toast.info(`Removed ${itemToRemove.name} from your shopping list`);
    }
  };

  const toggleItemCompletion = (id: string) => {
    setItems(
      items.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const filteredItems = items.filter(item => {
    if (filter === "all") return true;
    if (filter === "pending") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  const value = {
    items,
    filter,
    setFilter,
    filteredItems,
    addItem,
    removeItem,
    toggleItemCompletion,
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
};
