
import { useState, useEffect } from 'react';

// Definição do tipo para item escaneado
export interface ScannedItem {
  id: string;
  name: string;
  price?: number | string;
  store: string;
  address: string;
  purchaseDate: string;
  completed?: boolean;
}

export const useScannedItems = () => {
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);

  // Carregar itens escaneados do localStorage ao inicializar
  useEffect(() => {
    const storedItems = localStorage.getItem('scannedItems');
    if (storedItems) {
      setScannedItems(JSON.parse(storedItems));
    }
  }, []);

  // Salvar itens no localStorage quando houver mudanças
  useEffect(() => {
    if (scannedItems.length > 0) {
      localStorage.setItem('scannedItems', JSON.stringify(scannedItems));
    }
  }, [scannedItems]);

  // Função para salvar um item escaneado
  const saveScannedItem = (
    name: string,
    price?: number | string,
    store: string = '',
    address: string = '',
    purchaseDate: string = new Date().toISOString()
  ) => {
    const newItem: ScannedItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      price,
      store,
      address,
      purchaseDate,
      completed: false
    };

    setScannedItems(prevItems => [...prevItems, newItem]);
  };

  return {
    scannedItems,
    saveScannedItem
  };
};
