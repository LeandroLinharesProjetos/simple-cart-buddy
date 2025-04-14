
import React from "react";
import { useTranslation } from "react-i18next";
import { ShoppingListProvider } from "@/context/ShoppingListContext";
import ShoppingList from "@/components/ShoppingList";
import AddItemForm from "@/components/AddItemForm";
import LanguageSelector from "@/components/LanguageSelector";
import FilterMenu from "@/components/FilterMenu";
import ShareMenu from "@/components/ShareMenu";
import { ShoppingBasket } from "lucide-react";

const Index = () => {
  const { t } = useTranslation();

  return (
    <ShoppingListProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <header className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <ShoppingBasket className="h-6 w-6 text-teal-500 mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">{t('app.title')}</h1>
              </div>
              <div className="flex items-center gap-1">
                <ShareMenu />
                <LanguageSelector />
              </div>
            </header>
            
            <AddItemForm />
            <FilterMenu />
            <ShoppingList />
          </div>
        </div>
      </div>
    </ShoppingListProvider>
  );
};

export default Index;
