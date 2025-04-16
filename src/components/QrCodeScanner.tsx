
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScanLine, X } from 'lucide-react';
import { useShoppingList } from '@/context/ShoppingListContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Html5QrcodePlugin from './Html5QrcodePlugin';
import { toast } from 'sonner';

const QrCodeScanner = () => {
  const { t } = useTranslation();
  const { addItem } = useShoppingList();
  const [open, setOpen] = useState(false);

  const onNewScanResult = (decodedText: string) => {
    try {
      // Attempt to parse the QR code data
      // This is a simplified example - real receipt QR codes would have a specific format
      const data = JSON.parse(decodedText);
      
      if (data.items && Array.isArray(data.items)) {
        // Add each item from the receipt
        data.items.forEach((item: any) => {
          addItem(
            item.name || 'Unknown item',
            item.price,
            data.store || '',
            data.address || ''
          );
        });
        
        toast.success(t('qrcode.itemsAdded', { count: data.items.length }));
      } else {
        // If it's a simple text, just add as an item
        addItem(decodedText);
        toast.success(t('qrcode.itemAdded'));
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Failed to parse QR code data:', error);
      
      // If parsing fails, just add as text
      addItem(decodedText);
      toast.info(t('qrcode.basicTextAdded'));
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ScanLine className="h-5 w-5 text-teal-500 hover:text-teal-600 transition-colors" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>{t('qrcode.scanTitle')}</DialogTitle>
          <DialogClose className="absolute top-4 right-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="mt-2 w-full">
          <Html5QrcodePlugin
            fps={10}
            qrbox={250}
            disableFlip={false}
            qrCodeSuccessCallback={onNewScanResult}
          />
          <p className="text-sm text-gray-500 mt-2 text-center">
            {t('qrcode.instructions')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeScanner;
