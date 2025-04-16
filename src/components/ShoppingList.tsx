
import React from "react";
import { useTranslation } from "react-i18next";
import { useShoppingList } from "@/context/ShoppingListContext";
import ShoppingListItem from "@/components/ShoppingListItem";
import { ShoppingBasket } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ShoppingItem } from "@/context/ShoppingListContext";

const ShoppingList = () => {
  const { filteredItems, filter, reorderItems, getBestPriceForProduct } = useShoppingList();
  const { t } = useTranslation();

  const onDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    // Reorder items
    reorderItems(result.source.index, result.destination.index);
  };

  const renderItems = (items: ShoppingItem[], isDraggable: boolean = true) => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" isDropDisabled={!isDraggable}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {items.map((item, index) => {
                // Get the best price for this product
                const bestPrice = getBestPriceForProduct(item.name);
                
                return (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                    isDragDisabled={!isDraggable}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ShoppingListItem
                          id={item.id}
                          name={item.name}
                          completed={item.completed}
                          price={item.price}
                          store={item.store}
                          bestPrice={bestPrice}
                          purchaseDate={item.purchaseDate}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingBasket className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">{t('shoppingList.emptyTitle')}</p>
            <p className="text-gray-400 text-sm">{t('shoppingList.emptyDescription')}</p>
          </div>
        ) : (
          filter !== "completed" && (
            <div className="mb-6">
              {renderItems(filteredItems.filter(item => !item.completed), true)}
            </div>
          )
        )}
        
        {filter !== "pending" && filteredItems.some(item => item.completed) && (
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">{t('shoppingList.purchased')}</h2>
            {renderItems(filteredItems.filter(item => item.completed), false)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
