'use client';

import { motion } from 'framer-motion';
import { Zap, ShieldCheck } from 'lucide-react';

type GameTopBarProps = {
  score: number;
  multiplier: number;
  bombDuration: number;
};

export default function GameTopBar({
  score,
  multiplier,
  bombDuration,
}: GameTopBarProps) {
  return (
    <div className="w-full max-w-lg rounded-lg bg-card/80 border border-border p-2 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Score */}
        <div className="flex flex-col items-center justify-center px-4 py-2 rounded-md bg-background/50 min-w-[120px]">
           <span className="text-xs font-semibold text-foreground/80">SCORE</span>
            <motion.div
              key={score}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-bold font-headline"
            >
              {score}
            </motion.div>
        </div>

        {/* Multiplier and Bomb Duration */}
        <div className="flex-grow flex justify-center gap-6">
            <div className="flex flex-col items-center">
                <div className="flex items-center text-sm font-semibold mb-1 text-foreground/80">
                    <Zap className="w-4 h-4 mr-1 text-accent" />
                    <span>MULTIPLIER</span>
                </div>
                <span className="font-bold font-headline text-2xl">{multiplier}X</span>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex items-center text-sm font-semibold mb-1 text-foreground/80">
                    <ShieldCheck className="w-4 h-4 mr-1 text-primary" />
                    <span>BOMB DURATION</span>
                </div>
                <span className="font-bold font-headline text-2xl">{bombDuration}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
