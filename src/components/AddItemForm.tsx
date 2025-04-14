
import React, { useState } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const AddItemForm = () => {
  const [itemName, setItemName] = useState("");
  const { addItem } = useShoppingList();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim()) {
      addItem(itemName);
      setItemName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Add new item..."
        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
        autoFocus
      />
      <Button 
        type="submit" 
        className="bg-teal-500 hover:bg-teal-600 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add
      </Button>
    </form>
  );
};

export default AddItemForm;
