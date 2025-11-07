'use client';

import { motion } from 'framer-motion';

const FluxRune = () => {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <motion.img
        src="/FluxRune.png"
        alt="Flux Rune"
        animate={{
          scale: [1, 1.1, 1],
          filter: [
            'drop-shadow(0 0 2px #DA70D6)',
            'drop-shadow(0 0 10px #8A2BE2)',
            'drop-shadow(0 0 2px #DA70D6)',
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

export default FluxRune;
