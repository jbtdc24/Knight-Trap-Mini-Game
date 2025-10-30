'use client';

import React from 'react';
import InventoryItem from './InventoryItem';

const Inventory = ({ items, onUseItem }: { items: string[], onUseItem: (item: string) => void }) => {
  return (
    <div className="absolute top-0 left-0 p-4">
      <div className="bg-gray-800/50 p-2 rounded-lg flex space-x-2">
        {items.map((item, index) => (
          <InventoryItem key={index} item={item} onUse={() => onUseItem(item)} />
        ))}
        {items.length === 0 && (
          <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center">
            <span className="text-gray-500 text-xs">Empty</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
