
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";

export interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  price?: number;
  store?: string;
  address?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
}

type FilterType = "all" | "pending" | "completed";

interface ShoppingListContextType {
  lists: ShoppingList[];
  activeListId: string;
  setActiveListId: (id: string) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  filteredItems: ShoppingItem[];
  addItem: (name: string, price?: number, store?: string, address?: string) => void;
  removeItem: (id: string) => void;
  toggleItemCompletion: (id: string) => void;
  createNewList: (name: string) => void;
  removeList: (id: string) => void;
  reorderItems: (startIndex: number, endIndex: number) => void;
  activeList: ShoppingList | undefined;
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

// Local storage key
const STORAGE_KEY = "shopping-lists-data";

export const ShoppingListProvider = ({ children }: ShoppingListProviderProps) => {
  // Initialize state from local storage or with default values
  const [lists, setLists] = useState<ShoppingList[]>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error("Failed to parse stored data:", error);
        return initialLists;
      }
    }
    return initialLists;
  });
  
  const [activeListId, setActiveListId] = useState<string>(() => {
    return lists[0]?.id || "";
  });
  
  const [filter, setFilter] = useState<FilterType>("all");

  // Save to local storage whenever the lists change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

  const activeList = lists.find(list => list.id === activeListId);

  const createNewList = (name: string) => {
    if (!name.trim()) return;
    
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name: name.trim(),
      items: [],
    };
    
    setLists([...lists, newList]);
    setActiveListId(newList.id);
    toast.success(`Created new list: ${name}`);
  };

  const removeList = (id: string) => {
    const listToRemove = lists.find(list => list.id === id);
    if (!listToRemove) return;
    
    const newLists = lists.filter(list => list.id !== id);
    setLists(newLists);
    
    if (activeListId === id && newLists.length > 0) {
      setActiveListId(newLists[0].id);
    }
    
    toast.info(`Removed list: ${listToRemove.name}`);
  };

  const addItem = (name: string, price?: number, store?: string, address?: string) => {
    if (!name.trim() || !activeListId) return;
    
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: name.trim(),
      completed: false,
      price,
      store,
      address
    };
    
    setLists(lists.map(list => 
      list.id === activeListId 
        ? { ...list, items: [...list.items, newItem] } 
        : list
    ));
    
    toast.success(`Added ${name} to your shopping list`);
  };

  const removeItem = (id: string) => {
    if (!activeListId) return;
    
    const listToUpdate = lists.find(list => list.id === activeListId);
    if (!listToUpdate) return;
    
    const itemToRemove = listToUpdate.items.find(item => item.id === id);
    
    setLists(lists.map(list => 
      list.id === activeListId 
        ? { ...list, items: list.items.filter(item => item.id !== id) } 
        : list
    ));
    
    if (itemToRemove) {
      toast.info(`Removed ${itemToRemove.name} from your shopping list`);
    }
  };

  const toggleItemCompletion = (id: string) => {
    if (!activeListId) return;
    
    setLists(lists.map(list => 
      list.id === activeListId 
        ? { 
            ...list, 
            items: list.items.map(item => 
              item.id === id ? { ...item, completed: !item.completed } : item
            ) 
          } 
        : list
    ));
  };

  const reorderItems = (startIndex: number, endIndex: number) => {
    if (!activeListId) return;
    
    const listToUpdate = lists.find(list => list.id === activeListId);
    if (!listToUpdate) return;
    
    const newItems = Array.from(listToUpdate.items);
    const [removed] = newItems.splice(startIndex, 1);
    newItems.splice(endIndex, 0, removed);
    
    setLists(lists.map(list => 
      list.id === activeListId 
        ? { ...list, items: newItems } 
        : list
    ));
  };

  const filteredItems = activeList?.items.filter(item => {
    if (filter === "all") return true;
    if (filter === "pending") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  }) || [];

  const value = {
    lists,
    activeListId,
    setActiveListId,
    filter,
    setFilter,
    filteredItems,
    addItem,
    removeItem,
    toggleItemCompletion,
    createNewList,
    removeList,
    reorderItems,
    activeList
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
};

// Default list data
const initialLists: ShoppingList[] = [
  {
    id: "default",
    name: "My Shopping List",
    items: [
      { id: "1", name: "Milk", completed: false },
      { id: "2", name: "Bread", completed: false },
      { id: "3", name: "Eggs", completed: false },
    ],
  },
];
