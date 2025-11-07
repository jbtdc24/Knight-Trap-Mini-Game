'use client';

import React from 'react';
import InventoryItem from './InventoryItem';
import { INVENTORY_SIZE } from '@/lib/constants';

const Inventory = ({ items, onUseItem }: { items: string[], onUseItem: (item: string) => void }) => {
  // Create an array representing the total number of inventory slots.
  const inventorySlots = Array.from({ length: INVENTORY_SIZE });

  return (
    <div className="p-4">
      <div className="bg-gray-800/50 p-2 rounded-lg flex space-x-2">
        {inventorySlots.map((_, index) => {
          const item = items[index];
          return (
            // Each slot has a consistent wrapper div, ensuring layout stability.
            <div key={index} className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center">
              {item ? (
                // If an item exists for this slot, render the InventoryItem component.
                <InventoryItem item={item} onUse={() => onUseItem(item)} />
              ) : (
                // Otherwise, display the "Empty" text.
                <span className="text-gray-500 text-xs">Empty</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Inventory;
