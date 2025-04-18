
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
  const { saveScannedItem } = useShoppingList();
  const [open, setOpen] = useState(false);

  const onNewScanResult = (decodedText: string, decodedResult: any) => {
    try {
      console.log("QR Code scanned successfully:", decodedText);
      
      // Attempt to parse the QR code data
      const data = JSON.parse(decodedText);
      const currentDate = new Date().toISOString();
      
      if (data.items && Array.isArray(data.items)) {
        // Salvar cada item do recibo sem adicionar à lista de compras
        data.items.forEach((item: any) => {
          saveScannedItem(
            item.name || 'Unknown item',
            item.price,
            data.store || '',
            data.address || '',
            currentDate
          );
        });
        
        toast.success(t('qrcode.itemsScanned', { count: data.items.length }));
      } else {
        // Se for um texto simples, salvar como um item
        saveScannedItem(decodedText, undefined, '', '', currentDate);
        toast.success(t('qrcode.itemScanned'));
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Failed to parse QR code data:', error);
      
      // Se a análise falhar, apenas salvar como texto
      const currentDate = new Date().toISOString();
      saveScannedItem(decodedText, undefined, '', '', currentDate);
      toast.info(t('qrcode.basicTextScanned'));
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
