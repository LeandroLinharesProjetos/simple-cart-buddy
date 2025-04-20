
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Scan, X } from 'lucide-react';
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
  const [scanActive, setScanActive] = useState(false);

  const onNewScanResult = useCallback((decodedText: string, decodedResult: any) => {
    console.log("📱 QR Code scanned successfully:", decodedText);
    
    try {
      // Tentar parsear o texto como JSON
      let parsedData;
      try {
        parsedData = JSON.parse(decodedText);
        console.log("Parsed QR code JSON data:", parsedData);
      } catch (parseError) {
        console.warn("Not JSON format, using plain text:", decodedText);
        // Se não for JSON, usar o texto como nome do item
        const currentDate = new Date().toISOString();
        saveScannedItem(decodedText, undefined, '', '', currentDate);
        toast.success(t('qrcode.basicTextScanned'));
        setOpen(false);
        return;
      }
      
      const currentDate = new Date().toISOString();
      
      // Processar dados em formato JSON
      if (parsedData.items && Array.isArray(parsedData.items)) {
        // Formato de recibo com múltiplos itens
        console.log("Processing receipt with multiple items:", parsedData.items);
        parsedData.items.forEach((item: any) => {
          saveScannedItem(
            item.name || 'Unknown item',
            item.price,
            parsedData.store || '',
            parsedData.address || '',
            currentDate
          );
        });
        
        toast.success(t('qrcode.itemsScanned', { count: parsedData.items.length }));
      } else if (parsedData.name || parsedData.text) {
        // Item único em formato JSON
        console.log("Processing single item:", parsedData);
        saveScannedItem(
          parsedData.name || parsedData.text,
          parsedData.price,
          parsedData.store || '',
          parsedData.address || '',
          currentDate
        );
        toast.success(t('qrcode.itemScanned'));
      } else {
        // JSON sem formato reconhecido, usar como texto
        console.log("Unknown JSON format, using as text");
        saveScannedItem(
          JSON.stringify(parsedData).substring(0, 50),
          undefined,
          '',
          '',
          currentDate
        );
        toast.success(t('qrcode.basicTextScanned'));
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Failed to process QR code data:', error);
      
      // Em caso de erro, salvar como texto simples
      const currentDate = new Date().toISOString();
      saveScannedItem(decodedText, undefined, '', '', currentDate);
      toast.info(t('qrcode.basicTextScanned'));
      setOpen(false);
    }
  }, [saveScannedItem, t]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setScanActive(true);
    } else {
      setScanActive(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Scan className="h-5 w-5 text-teal-500 hover:text-teal-600 transition-colors" />
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
          {scanActive && (
            <Html5QrcodePlugin
              fps={15}
              qrbox={{ width: 270, height: 270 }}
              disableFlip={false}
              qrCodeSuccessCallback={onNewScanResult}
            />
          )}
          <p className="text-sm text-gray-500 mt-2 text-center">
            {t('qrcode.instructions')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeScanner;
