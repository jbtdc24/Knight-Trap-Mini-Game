'use client';

import React from 'react';

const InventoryItem = ({ item, onUse }: { item: string, onUse: () => void }) => {
  const renderItem = () => {
    switch (item) {
      case 'freeze':
        return (
          <div className="w-16 h-16 bg-blue-500/30 border-2 border-blue-400 rounded-md flex items-center justify-center cursor-pointer hover:bg-blue-500/50">
            <span className="text-3xl" role="img" aria-label="freeze rune">❄️</span>
          </div>
        );
      default:
        return null;
    }
  };

  return <div onClick={onUse}>{renderItem()}</div>;
};

export default InventoryItem;
