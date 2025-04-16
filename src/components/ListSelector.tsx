
import React, { useState } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useTranslation } from "react-i18next";
import { PlusCircle, ChevronDown, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ListSelector = () => {
  const { t } = useTranslation();
  const { lists, activeListId, setActiveListId, createNewList, removeList, activeList } = useShoppingList();
  const [newListName, setNewListName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    createNewList(newListName);
    setNewListName("");
    setDialogOpen(false);
  };

  return (
    <div className="flex items-center mb-4 justify-between">
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 px-3 flex items-center">
              <span className="mr-1">{activeList?.name || t('lists.select')}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52">
            {lists.map((list) => (
              <DropdownMenuItem 
                key={list.id} 
                onClick={() => setActiveListId(list.id)}
                className="flex items-center justify-between"
              >
                <span>{list.name}</span>
                {lists.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 ml-2" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeList(list.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <PlusCircle className="h-5 w-5 text-teal-500 hover:text-teal-600 transition-colors" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('lists.createNew')}</DialogTitle>
            <DialogDescription>
              {t('lists.createDescription')}
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder={t('lists.namePlaceholder')}
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="mb-4"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('general.cancel')}
            </Button>
            <Button onClick={handleCreateList}>{t('general.create')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListSelector;
