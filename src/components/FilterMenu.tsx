
import React from "react";
import { useTranslation } from "react-i18next";
import { useShoppingList } from "@/context/ShoppingListContext";
import { cn } from "@/lib/utils";

const FilterMenu = () => {
  const { filter, setFilter } = useShoppingList();
  const { t } = useTranslation();

  return (
    <div className="flex justify-center mb-4 border-b">
      <div className="inline-flex" role="group">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-4 py-2 text-sm transition-colors border-b-2 focus:outline-none",
            filter === "all" 
              ? "border-teal-500 text-teal-600 font-medium" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
          aria-current={filter === "all"}
        >
          {t('filterMenu.all')}
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={cn(
            "px-4 py-2 text-sm transition-colors border-b-2 focus:outline-none",
            filter === "pending" 
              ? "border-teal-500 text-teal-600 font-medium" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
          aria-current={filter === "pending"}
        >
          {t('filterMenu.pending')}
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={cn(
            "px-4 py-2 text-sm transition-colors border-b-2 focus:outline-none",
            filter === "completed" 
              ? "border-teal-500 text-teal-600 font-medium" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
          aria-current={filter === "completed"}
        >
          {t('filterMenu.completed')}
        </button>
      </div>
    </div>
  );
};

export default FilterMenu;
