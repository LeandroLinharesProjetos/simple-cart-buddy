
import React from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import { Check, Trash, GripVertical, Store } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShoppingListItemProps {
  id: string;
  name: string;
  completed: boolean;
  price?: number;
  store?: string;
  address?: string;
}

const ShoppingListItem = ({ id, name, completed, price, store }: ShoppingListItemProps) => {
  const { toggleItemCompletion, removeItem } = useShoppingList();

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-gray-300 cursor-move" />
      </div>
      <div className="flex items-center gap-3 flex-grow">
        <button
          onClick={() => toggleItemCompletion(id)}
          className={cn(
            "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
            completed 
              ? "bg-teal-500 border-teal-500 text-white" 
              : "border-gray-300 hover:border-teal-500"
          )}
          aria-label={completed ? "Mark as not purchased" : "Mark as purchased"}
        >
          {completed && <Check className="h-4 w-4" />}
        </button>
        <div className="flex flex-col">
          <span 
            className={cn(
              "text-gray-800 transition-all", 
              completed && "line-through text-gray-400"
            )}
          >
            {name}
          </span>
          {(price !== undefined || store) && (
            <div className="flex items-center text-xs text-gray-500 mt-1">
              {price !== undefined && (
                <span className="mr-2">${price.toFixed(2)}</span>
              )}
              {store && (
                <div className="flex items-center">
                  <Store className="h-3 w-3 mr-1" />
                  <span>{store}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => removeItem(id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Remove item"
      >
        <Trash className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ShoppingListItem;
