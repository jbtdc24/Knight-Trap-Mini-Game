'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BOARD_SIZE } from '@/lib/constants';
import type { Bomb as BombType, Position } from '@/lib/types';
import Image from 'next/image';

interface BombProps {
  bomb: BombType;
  isTransitioning?: { from: Position; to: Position };
}

const Bomb = ({ bomb, isTransitioning }: BombProps) => {
  const initialPosition = isTransitioning ? isTransitioning.from : bomb.position;
  const animatePosition = isTransitioning ? isTransitioning.to : bomb.position;

  return (
    <motion.div
      key={bomb.id}
      className="absolute"
      style={{
        filter: 'drop-shadow(0 0 0.5rem crimson)',
      }}
      initial={{
        left: `${(initialPosition[1] / BOARD_SIZE) * 100}%`,
        top: `${(initialPosition[0] / BOARD_SIZE) * 100}%`,
        width: `${100 / BOARD_SIZE}%`,
        height: `${100 / BOARD_SIZE}%`,
      }}
      animate={{
        left: `${(animatePosition[1] / BOARD_SIZE) * 100}%`,
        top: `${(animatePosition[0] / BOARD_SIZE) * 100}%`,
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        scale: {
          repeat: Infinity,
          duration: 1,
          ease: 'easeInOut',
        },
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src="/Bomb.png"
          alt="Bomb"
          layout="fill"
          className="object-contain"
        />
      </div>
    </motion.div>
  );
};

export default Bomb;
