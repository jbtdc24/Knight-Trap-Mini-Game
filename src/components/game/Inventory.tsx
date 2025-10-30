'use client';

import React from 'react';
import InventoryItem from './InventoryItem';
import { INVENTORY_SIZE } from '@/lib/constants';

const Inventory = ({ items, onUseItem }: { items: string[], onUseItem: (item: string) => void }) => {
  const inventorySlots = new Array(INVENTORY_SIZE).fill(null);

  return (
    <div className="p-4">
      <div className="bg-gray-800/50 p-2 rounded-lg flex space-x-2">
        {inventorySlots.map((_, index) => {
          const item = items[index];
          return item ? (
            <InventoryItem key={index} item={item} onUse={() => onUseItem(item)} />
          ) : (
            <div key={index} className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center">
              <span className="text-gray-500 text-xs">Empty</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Inventory;
