'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { BoardSquare, Bomb, GameStatus, Position, ShadowKnight, ExplosionMark as ExplosionMarkType } from '@/lib/types';
import { KnightIcon } from '../icons/KnightIcon';
import { ShadowKnightIcon } from '../icons/ShadowKnightIcon';
import { BombIcon } from '../icons/BombIcon';
import { Explosion } from '../icons/Explosion';
import { useEffect, useRef } from 'react';
import { ExplosionMark } from '../icons/ExplosionMark';
import { isSamePosition } from '@/lib/game-logic';

// Custom hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


type GameBoardProps = {
  board: BoardSquare[][];
  whiteKnightPos: Position;
  shadowKnights: ShadowKnight[];
  bombs: Bomb[];
  explosions: Position[];
  explosionMarks: ExplosionMarkType[];
  onMove: (pos: Position) => void;
  gameStatus: GameStatus;
  isAiThinking: boolean;
  boardShake: number;
  illegalMovePos: Position | null;
};

const getLMoveAnimation = (from: Position | undefined, to: Position) => {
  if (!from) {
    return {
      y: `${to[0] * 100}%`,
      x: `${to[1] * 100}%`,
      transition: { duration: 0 },
    };
  }
  
  const fromY = `${from[0] * 100}%`;
  const fromX = `${from[1] * 100}%`;
  const toY = `${to[0] * 100}%`;
  const toX = `${to[1] * 100}%`;

  const dy = to[0] - from[0];
  const dx = to[1] - from[1];

  // Prefer moving vertically first if the vertical distance is greater
  if (Math.abs(dy) > Math.abs(dx)) {
     return {
      y: [fromY, toY, toY],
      x: [fromX, fromX, toX],
    };
  } 
  // Otherwise, move horizontally first
  else {
    return {
      y: [fromY, fromY, toY],
      x: [fromX, toX, toX],
    };
  }
};


const GameBoard = ({
  board,
  whiteKnightPos,
  shadowKnights,
  bombs,
  explosions,
  explosionMarks,
  onMove,
  gameStatus,
  isAiThinking,
  boardShake,
  illegalMovePos,
}: GameBoardProps) => {

  const prevWhiteKnightPos = usePrevious(whiteKnightPos);
  const prevShadowKnights = usePrevious(shadowKnights);

  const getSquareStyle = (row: number, col: number) => {
    return (row + col) % 2 === 0
      ? 'bg-background'
      : 'bg-muted';
  };
  
  const shakeVariants = {
    shake: {
      x: [0, -2, 2, -2, 2, 0],
      y: [0, 1, -1, 1, -1, 0],
      transition: { duration: 0.3 }
    },
    initial: {
      x: 0,
      y: 0
    }
  }

  return (
    <motion.div 
      className="relative grid aspect-square w-full max-w-[calc(100vh-12rem)] grid-cols-8 rounded-lg border-2 border-black/20 bg-black/10 shadow-lg sm:max-w-lg md:max-w-xl"
      key={boardShake}
      variants={shakeVariants}
      initial="initial"
      animate={boardShake > 0 ? "shake" : "initial"}
    >
      <AnimatePresence>
        {board.map((row, rowIndex) =>
          row.map((_, colIndex) => {
            const isBomb = bombs.some(b => b.position[0] === rowIndex && b.position[1] === colIndex);
            const isExplosionMark = explosionMarks.some(m => isSamePosition(m.position, [rowIndex, colIndex]));
            const isIllegal = illegalMovePos && isSamePosition(illegalMovePos, [rowIndex, colIndex]);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'relative flex items-center justify-center',
                  getSquareStyle(rowIndex, colIndex)
                )}
              >
                 <AnimatePresence>
                  {isIllegal && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="absolute inset-0 border-4 border-destructive rounded-sm"
                    />
                  )}
                </AnimatePresence>

                <button
                  onClick={() => onMove([rowIndex, colIndex])}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-none transition-colors"
                  aria-label={`Move to square ${rowIndex + 1}, ${colIndex + 1}`}
                  disabled={isAiThinking || gameStatus !== 'playing'}
                >
                </button>
                <AnimatePresence>
                  {isBomb && (
                    <motion.div
                      key={`bomb-${rowIndex}-${colIndex}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <BombIcon />
                    </motion.div>
                  )}
                  {isExplosionMark && (
                    <motion.div 
                      key={`mark-${rowIndex}-${colIndex}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 0.7, scale: 1, transition: { duration: 0.2 } }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5, ease: 'easeOut' } }}
                      className="absolute inset-0 z-0"
                    >
                      <ExplosionMark />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        <motion.div
            key="white-knight"
            className="pointer-events-none absolute h-[12.5%] w-[12.5%]"
            initial={false}
            animate={getLMoveAnimation(prevWhiteKnightPos, whiteKnightPos)}
            transition={{ duration: 0.2, ease: 'linear' }}
        >
            <KnightIcon />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {shadowKnights.map((knight) => {
          const oldKnightState = prevShadowKnights?.find(k => k.id === knight.id);
          const oldPos = oldKnightState ? oldKnightState.position : knight.position;
          
          return (
            <motion.div
                key={`shadow-knight-${knight.id}`}
                className="pointer-events-none absolute h-[12.5%] w-[12.5%]"
                initial={false}
                animate={getLMoveAnimation(oldPos, knight.position)}
                transition={{ duration: 0.9, ease: "easeInOut" }}
            >
                <ShadowKnightIcon />
            </motion.div>
          )
        })}
      </AnimatePresence>
      <AnimatePresence>
        {explosions.map((pos, index) => (
          <motion.div
            key={`explosion-${pos[0]}-${pos[1]}-${index}`}
            className="pointer-events-none absolute h-[12.5%] w-[12.5%]"
            style={{ 
              x: `${pos[1] * 100}%`,
              y: `${pos[0] * 100}%`,
            }}
          >
            <Explosion />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default GameBoard;
