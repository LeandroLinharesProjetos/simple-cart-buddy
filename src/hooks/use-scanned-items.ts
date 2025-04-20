
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
  
  // Chave para o localStorage
  const STORAGE_KEY = 'scannedItems';

  // Carregar itens escaneados do localStorage ao inicializar
  useEffect(() => {
    const loadItems = () => {
      try {
        const storedItems = localStorage.getItem(STORAGE_KEY);
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          console.log("Loaded scanned items from localStorage:", parsedItems);
          setScannedItems(parsedItems);
        } else {
          console.log("No scanned items found in localStorage");
        }
      } catch (error) {
        console.error("Error loading scanned items from localStorage:", error);
      }
    };
    
    loadItems();
  }, []);

  // Salvar itens no localStorage quando houver mudanças
  useEffect(() => {
    if (scannedItems.length > 0) {
      console.log("Saving scanned items to localStorage:", scannedItems);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scannedItems));
      } catch (error) {
        console.error("Error saving scanned items to localStorage:", error);
      }
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
    console.log("Saving new scanned item:", { name, price, store, address });
    
    if (!name || name.trim() === '') {
      console.warn("Attempted to save item with empty name, ignoring");
      return;
    }
    
    const newItem: ScannedItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      price,
      store,
      address,
      purchaseDate,
      completed: false
    };

    setScannedItems(prevItems => {
      const updatedItems = [...prevItems, newItem];
      console.log("Updated scanned items:", updatedItems);
      return updatedItems;
    });
    
    // Confirme que os dados foram salvos verificando o localStorage
    setTimeout(() => {
      try {
        const storedItems = localStorage.getItem(STORAGE_KEY);
        console.log("Verification - items in localStorage:", storedItems ? JSON.parse(storedItems) : "none");
      } catch (error) {
        console.error("Error verifying localStorage data:", error);
      }
    }, 100);
  };

  return {
    scannedItems,
    saveScannedItem
  };
};
