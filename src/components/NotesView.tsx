
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useShoppingList } from '@/context/ShoppingListContext';
import { Store, MapPin, ShoppingBag, Receipt, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

const NotesView = () => {
  const { t } = useTranslation();
  const { activeList } = useShoppingList();
  
  // Get unique stores from items with store info
  const storesWithInfo = activeList?.items
    .filter(item => item.store || item.address)
    .reduce((stores: { store: string; address: string; date?: string; items: any[] }[], item) => {
      const store = item.store || t('notes.noStore');
      const address = item.address || t('notes.noAddress');
      const date = item.purchaseDate;
      
      // Create a unique key for grouping by store, address and date
      const key = `${store}-${address}-${date || ''}`;
      
      // Check if we already have this store+date combo in our array
      const existingStoreIndex = stores.findIndex(s => 
        s.store === store && 
        s.address === address && 
        s.date === date
      );
      
      if (existingStoreIndex >= 0) {
        stores[existingStoreIndex].items.push(item);
      } else {
        stores.push({
          store,
          address,
          date,
          items: [item]
        });
      }
      
      return stores;
    }, []);

  if (!storesWithInfo || storesWithInfo.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <Receipt className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500">{t('notes.empty')}</h3>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {storesWithInfo.map((storeInfo, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Store className="mr-2 h-5 w-5 text-teal-500" />
                {storeInfo.store}
              </CardTitle>
              {storeInfo.address !== t('notes.noAddress') && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="mr-2 h-4 w-4" />
                  {storeInfo.address}
                </div>
              )}
              {storeInfo.date && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(storeInfo.date), 'dd/MM/yyyy')}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" />
                {t('notes.items')}:
              </p>
              <div className="space-y-2">
                {storeInfo.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="text-sm">
                    <div className="flex justify-between">
                      <span>{item.name}</span>
                      {item.price && (
                        <span className="font-medium">
                          {typeof item.price === 'number'
                            ? new Intl.NumberFormat(undefined, {
                                style: 'currency',
                                currency: 'USD'
                              }).format(item.price)
                            : item.price}
                        </span>
                      )}
                    </div>
                    {itemIndex < storeInfo.items.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotesView;
