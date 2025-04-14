
import React from "react";
import { ShoppingListProvider } from "@/context/ShoppingListContext";
import ShoppingList from "@/components/ShoppingList";
import AddItemForm from "@/components/AddItemForm";
import { ShoppingBasket } from "lucide-react";

const Index = () => {
  return (
    <ShoppingListProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <header className="flex items-center justify-center mb-6">
              <ShoppingBasket className="h-6 w-6 text-teal-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">Shopping List</h1>
            </header>
            
            <AddItemForm />
            <ShoppingList />
          </div>
        </div>
      </div>
    </ShoppingListProvider>
  );
};

export default Index;
