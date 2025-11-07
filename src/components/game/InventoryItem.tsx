'use client';

import React from 'react';
import { motion } from 'framer-motion';
import FreezeRune from './FreezeRune';
import FluxRune from './FluxRune';

const itemMap: { [key: string]: React.ComponentType } = {
  freeze: FreezeRune,
  flux: FluxRune,
};

const InventoryItem = ({ item, onUse }: { item: string; onUse: () => void }) => {
  const ItemComponent = itemMap[item];

  return (
    <div className="w-full h-full">
      <motion.div
        className="w-full h-full cursor-pointer"
        onClick={onUse}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
      >
        {ItemComponent && <ItemComponent />}
      </motion.div>
    </div>
  );
};

export default InventoryItem;
