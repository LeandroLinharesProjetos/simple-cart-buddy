
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { useShoppingList } from '@/context/ShoppingListContext';

const SearchProduct = () => {
  const { t } = useTranslation();
  const { addItem } = useShoppingList();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error(t('search.emptySearch'));
      return;
    }
    
    setLoading(true);
    try {
      // Wikipedia API request
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      toast.error(t('search.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = () => {
    if (searchResults) {
      addItem(searchResults.title, undefined, 'Wikipedia', searchResults.extract);
      toast.success(t('search.itemAdded'));
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Search className="h-5 w-5 text-teal-500 hover:text-teal-600 transition-colors" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>{t('search.title')}</DialogTitle>
          <DialogClose className="absolute top-4 right-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="mt-2 w-full space-y-4">
          <div className="flex space-x-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('search.placeholder')}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? t('search.searching') : t('search.button')}
            </Button>
          </div>
          
          {searchResults && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-bold text-lg mb-2">{searchResults.title}</h3>
              {searchResults.thumbnail && (
                <img 
                  src={searchResults.thumbnail.source} 
                  alt={searchResults.title}
                  className="w-full max-h-48 object-contain mb-2" 
                />
              )}
              <p className="text-sm text-gray-700 mb-4">{searchResults.extract}</p>
              <div className="flex justify-end">
                <Button onClick={handleAddToList}>
                  {t('search.addToList')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchProduct;
