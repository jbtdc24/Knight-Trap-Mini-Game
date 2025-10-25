import React from 'react';
import { motion } from 'framer-motion';

export default function StartingBattleOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-20 flex items-center justify-center bg-gradient-to-b from-[#B54B2A] to-[#5B3A2C]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-5xl font-bold text-white font-headline">
        STARTING BATTLE
      </h2>
    </motion.div>
  );
}
