
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShoppingList } from '@/context/ShoppingListContext';
import FilterMenu from './FilterMenu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ShoppingList from './ShoppingList';
import NotesView from './NotesView';
import { Receipt } from 'lucide-react';

const FilterMenuWithNotes = () => {
  const { t } = useTranslation();
  const { filter, setFilter } = useShoppingList();
  const [activeTab, setActiveTab] = useState<string>("list");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // When switching to list tab, restore the previous filter state
    if (value === "list") {
      // We don't need to change the filter here as it's managed by FilterMenu
    }
  };

  return (
    <div className="mt-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="list" className="flex items-center">
            {t('shoppingList.toBuy')}
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center">
            <Receipt className="mr-2 h-4 w-4" />
            {t('shoppingList.notes')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-0">
          <FilterMenu />
          <ShoppingList />
        </TabsContent>
        
        <TabsContent value="notes" className="mt-0">
          <NotesView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FilterMenuWithNotes;
