
import React from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import ShoppingListItem from "@/components/ShoppingListItem";
import { ShoppingBasket } from "lucide-react";

const ShoppingList = () => {
  const { items } = useShoppingList();

  return (
    <div className="w-full">
      <div className="mb-4">
        {items.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingBasket className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">Your shopping list is empty</p>
            <p className="text-gray-400 text-sm">Add items to get started</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-700">Items to Buy</h2>
              {items.filter(item => !item.completed).map(item => (
                <ShoppingListItem 
                  key={item.id} 
                  id={item.id} 
                  name={item.name} 
                  completed={item.completed} 
                />
              ))}
            </div>
            
            {items.some(item => item.completed) && (
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-2">Purchased</h2>
                {items.filter(item => item.completed).map(item => (
                  <ShoppingListItem 
                    key={item.id} 
                    id={item.id} 
                    name={item.name} 
                    completed={item.completed} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
