import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { useScannedItems, ScannedItem } from "@/hooks/use-scanned-items";

export interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  price?: number;
  store?: string;
  address?: string;
  purchaseDate?: string;
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
  addItem: (name: string, price?: number, store?: string, address?: string, purchaseDate?: string) => void;
  removeItem: (id: string) => void;
  toggleItemCompletion: (id: string) => void;
  createNewList: (name: string) => void;
  removeList: (id: string) => void;
  reorderItems: (startIndex: number, endIndex: number) => void;
  activeList: ShoppingList | undefined;
  getBestPriceForProduct: (productName: string) => number | undefined;
  scannedItems: ScannedItem[];
  saveScannedItem: (name: string, price?: number | string, store?: string, address?: string, purchaseDate?: string) => void;
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

// Map to keep track of best prices across lists
interface BestPricesMap {
  [productName: string]: number;
}

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
  
  // Track best prices for products across all lists
  const [bestPrices, setBestPrices] = useState<BestPricesMap>(() => {
    // Calculate initial best prices from all items in all lists
    const prices: BestPricesMap = {};
    lists.forEach(list => {
      list.items.forEach(item => {
        if (item.price !== undefined) {
          const existingPrice = prices[item.name.toLowerCase()];
          if (existingPrice === undefined || item.price < existingPrice) {
            prices[item.name.toLowerCase()] = item.price;
          }
        }
      });
    });
    return prices;
  });

  const { scannedItems, saveScannedItem } = useScannedItems();

  // Save to local storage whenever the lists change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    
    // Update best prices whenever lists change
    const newBestPrices: BestPricesMap = {...bestPrices};
    lists.forEach(list => {
      list.items.forEach(item => {
        if (item.price !== undefined) {
          const lowerName = item.name.toLowerCase();
          const existingPrice = newBestPrices[lowerName];
          if (existingPrice === undefined || item.price < existingPrice) {
            newBestPrices[lowerName] = item.price;
          }
        }
      });
    });
    setBestPrices(newBestPrices);
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

  const addItem = (name: string, price?: number, store?: string, address?: string, purchaseDate?: string) => {
    if (!name.trim() || !activeListId) return;
    
    const activeList = lists.find(list => list.id === activeListId);
    if (!activeList) return;
    
    const normalizedName = name.trim();
    const lowerName = normalizedName.toLowerCase();
    
    // Check if item with same name already exists in the list
    const existingItemIndex = activeList.items.findIndex(
      item => item.name.toLowerCase() === lowerName
    );
    
    if (existingItemIndex >= 0) {
      // If existing item has no price or new price is lower, update it
      if (
        price !== undefined && 
        (activeList.items[existingItemIndex].price === undefined || 
         price < activeList.items[existingItemIndex].price!)
      ) {
        // Update with new lower price
        const updatedItems = [...activeList.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          price,
          store: store || updatedItems[existingItemIndex].store,
          address: address || updatedItems[existingItemIndex].address,
          purchaseDate: purchaseDate || updatedItems[existingItemIndex].purchaseDate
        };
        
        setLists(lists.map(list => 
          list.id === activeListId 
            ? { ...list, items: updatedItems } 
            : list
        ));
        
        toast.success(`Updated ${normalizedName} with better price: ${price}`);
        return;
      } else {
        // Item exists and has same/better price, don't add duplicate
        toast.info(`${normalizedName} is already in your list`);
        return;
      }
    }
    
    // If we get here, item doesn't exist in the list yet
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: normalizedName,
      completed: false,
      price,
      store,
      address,
      purchaseDate
    };
    
    setLists(lists.map(list => 
      list.id === activeListId 
        ? { ...list, items: [...list.items, newItem] } 
        : list
    ));
    
    // Update best price if this is a new lowest price
    if (price !== undefined) {
      const currentBestPrice = bestPrices[lowerName];
      if (currentBestPrice === undefined || price < currentBestPrice) {
        setBestPrices({
          ...bestPrices,
          [lowerName]: price
        });
      }
    }
    
    toast.success(`Added ${normalizedName} to your shopping list`);
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

  const getBestPriceForProduct = (productName: string): number | undefined => {
    return bestPrices[productName.toLowerCase()];
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
    activeList,
    getBestPriceForProduct,
    scannedItems,
    saveScannedItem
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
