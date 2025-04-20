
import React, { useState } from 'react';
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

  const onNewScanResult = (decodedText: string, decodedResult: any) => {
    console.log("QR Code scanned successfully:", decodedText);
    
    try {
      // Tentar parsear o texto como JSON
      let parsedData;
      try {
        parsedData = JSON.parse(decodedText);
        console.log("Parsed QR code data:", parsedData);
      } catch (parseError) {
        console.warn("Failed to parse QR code as JSON, treating as plain text:", parseError);
        // Se falhar ao parsear como JSON, apenas use o texto como está
        const currentDate = new Date().toISOString();
        saveScannedItem(decodedText, undefined, '', '', currentDate);
        toast.success(t('qrcode.basicTextScanned'));
        setOpen(false);
        return;
      }
      
      const currentDate = new Date().toISOString();
      
      // Processar dados em formato JSON
      if (parsedData.items && Array.isArray(parsedData.items)) {
        // Salvar cada item do recibo sem adicionar à lista de compras
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
      } else {
        // Se não for um formato de recibo conhecido, salvar como um item único
        saveScannedItem(
          parsedData.name || parsedData.text || decodedText,
          parsedData.price,
          parsedData.store || '',
          parsedData.address || '',
          currentDate
        );
        toast.success(t('qrcode.itemScanned'));
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Failed to process QR code data:', error);
      
      // Se ocorrer qualquer outro erro, salvar como texto simples
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
          <Html5QrcodePlugin
            fps={10}
            qrbox={{ width: 250, height: 250 }}
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
