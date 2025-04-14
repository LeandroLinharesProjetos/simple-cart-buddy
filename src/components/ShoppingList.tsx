
import React from "react";
import { useTranslation } from "react-i18next";
import { useShoppingList } from "@/context/ShoppingListContext";
import ShoppingListItem from "@/components/ShoppingListItem";
import { ShoppingBasket } from "lucide-react";

const ShoppingList = () => {
  const { filteredItems, filter } = useShoppingList();
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="mb-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingBasket className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">{t('shoppingList.emptyTitle')}</p>
            <p className="text-gray-400 text-sm">{t('shoppingList.emptyDescription')}</p>
          </div>
        ) : (
          filter !== "completed" && (
            <div className="mb-6">
              {filteredItems.filter(item => !item.completed).map(item => (
                <ShoppingListItem 
                  key={item.id} 
                  id={item.id} 
                  name={item.name} 
                  completed={item.completed} 
                />
              ))}
            </div>
          )
        )}
        
        {filter !== "pending" && filteredItems.some(item => item.completed) && (
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">{t('shoppingList.purchased')}</h2>
            {filteredItems.filter(item => item.completed).map(item => (
              <ShoppingListItem 
                key={item.id} 
                id={item.id} 
                name={item.name} 
                completed={item.completed} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
