'use client';

import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Swords } from 'lucide-react';

type GameTopBarProps = {
  score: number;
  multiplier: number;
  bombDuration: number;
  totalCaptures: number;
};

const StatItem = ({ icon: Icon, label, value, colorClass }) => (
    <div className="flex flex-col items-center justify-center text-center">
        <span className="text-[0.6rem] font-semibold text-foreground/70 tracking-wider mb-0.5">{label}</span>
        <div className="flex items-center gap-1.5">
            <Icon className={`w-4 h-4 ${colorClass}`} />
            <motion.div
                key={value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold font-headline text-white"
            >
                {value}
            </motion.div>
        </div>
    </div>
);


export default function GameTopBar({
  score,
  multiplier,
  bombDuration,
  totalCaptures,
}: GameTopBarProps) {
  return (
    <div className="w-full rounded-full bg-black/30 border border-white/10 p-1 shadow-lg backdrop-blur-md">
      <div className="grid grid-cols-4 items-center gap-2">
        {/* Score */}
        <div className="col-span-1 flex flex-col items-center justify-center px-3 rounded-full bg-primary/20 border border-primary/50 h-full">
            <span className="text-[0.6rem] font-semibold text-primary-foreground/80">SCORE</span>
            <motion.div
              key={score}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-bold font-headline text-white leading-tight"
            >
              {score}
            </motion.div>
        </div>

        {/* Stats */}
        <div className="col-span-3 grid grid-cols-3 items-center gap-2 text-center">
            <StatItem icon={Swords} label="Captures" value={totalCaptures} colorClass="text-destructive" />
            <StatItem icon={Zap} label="Multiplier" value={`${multiplier}X`} colorClass="text-accent" />
            <StatItem icon={ShieldCheck} label="Bomb Fuse" value={bombDuration} colorClass="text-primary" />
        </div>
      </div>
    </div>
  );
}
