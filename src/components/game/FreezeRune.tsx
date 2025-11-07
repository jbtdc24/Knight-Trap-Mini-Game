'use client';

import { motion } from 'framer-motion';

const FreezeRune = () => {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <motion.img
        src="/FreezeRune.png"
        alt="Freeze Rune"
        animate={{
          scale: [1, 1.1, 1],
          filter: [
            'drop-shadow(0 0 2px #60A5FA)',
            'drop-shadow(0 0 10px #3B82F6)',
            'drop-shadow(0 0 2px #60A5FA)',
          ]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default FreezeRune;
