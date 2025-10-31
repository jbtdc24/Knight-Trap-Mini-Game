'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { GameBoardProps } from '@/lib/types';
import { KnightIcon } from '../icons/KnightIcon';
import { ShadowKnightIcon } from '../icons/ShadowKnightIcon';
import { Explosion } from '../icons/Explosion';
import { useEffect, useRef } from 'react';
import { isSamePosition } from '@/lib/game-logic';
import Trail from './Trail';
import FreezeRune from './FreezeRune';

// Custom hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const getLMoveAnimation = (from: Position | undefined, to: Position) => {
  if (!from || (to && isSamePosition(from, to))) {
    const y = to ? `${to[0] * 100}%` : (from ? `${from[0] * 100}%` : '0%');
    const x = to ? `${to[1] * 100}%` : (from ? `${from[1] * 100}%` : '0%');
    return { y, x, scale: 1.5 }; // Keep it scaled
  }

  const fromY = `${from[0] * 100}%`;
  const fromX = `${from[1] * 100}%`;
  const toY = `${to[0] * 100}%`;
  const toX = `${to[1] * 100}%`;

  const dx = to[1] - from[1];
  const dy = to[0] - from[0];

  if (dx === 0 && dy === 0) {
    return { y: toY, x: toX, scale: 1.5 };
  }

  // Midpoint of the move
  const midX = from[1] + dx / 2;
  const midY = from[0] + dy / 2;

  // Calculate a perpendicular offset
  const dist = Math.sqrt(dx * dx + dy * dy);
  const arcMagnitude = 0.75; // Controls the "height" of the arc.

  // Perpendicular vector: (-dy, dx), normalized and scaled
  const offsetX = (-dy / dist) * arcMagnitude;
  const offsetY = (dx / dist) * arcMagnitude;

  const arcX = `${(midX + offsetX) * 100}%`;
  const arcY = `${(midY + offsetY) * 100}%`;

  return {
    y: [fromY, arcY, toY],
    x: [fromX, arcX, toX],
    scale: [1.5, 2, 1.5], // From normal size, to bigger, back to normal
    zIndex: 10,
  };
};

const GameBoard = ({
  whiteKnightPos,
  shadowKnights,
  bombs,
  explosions,
  explosionMarks,
  trails,
  onMove,
  gameStatus,
  isAiThinking,
  boardShake,
  illegalMovePos,
  availableMoves,
  freezeRune,
  runeCollecting,
  onRuneAnimationComplete,
}: GameBoardProps) => {
  const prevWhiteKnightPos = usePrevious(whiteKnightPos);
  const prevShadowKnights = usePrevious(shadowKnights);

  const shakeVariants = {
    shake: { x: [0, -2, 2, -2, 2, 0], y: [0, 1, -1, 1, -1, 0], transition: { duration: 0.3 } },
    initial: { x: 0, y: 0 },
  };

  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameStatus !== 'playing' || isAiThinking) return;

    const board = e.currentTarget;
    const rect = board.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor((x / rect.width) * 8);
    const row = Math.floor((y / rect.height) * 8);

    onMove([row, col]);
  };
  
  const knightTransition = {
    default: { ease: 'backOut', duration: 0.6 },
    y: { ease: 'backOut', duration: 0.6, times: [0, 0.5, 1] },
    x: { ease: 'backOut', duration: 0.6, times: [0, 0.5, 1] },
    scale: { ease: 'backOut', duration: 0.6, times: [0, 0.5, 1] },
  }

  return (
    <motion.div
      className="relative aspect-square w-full max-w-[calc(100vh-12rem)] sm:max-w-lg md:max-w-xl cursor-pointer"
      key={boardShake}
      variants={shakeVariants}
      initial="initial"
      animate={boardShake > 0 ? 'shake' : 'initial'}
      style={{ backgroundImage: 'url(/Board.png)', backgroundSize: 'cover' }}
      onClick={handleBoardClick}
    >
      <AnimatePresence>
        {trails.map((trail) => (
          <Trail key={trail.id} path={trail.path} />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {availableMoves.map((move) => (
          <motion.div
            key={`available-move-${move[0]}-${move[1]}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="pointer-events-none absolute h-[12.5%] w-[12.5%] flex items-center justify-center"
            style={{ top: `${move[0] * 12.5}%`, left: `${move[1] * 12.5}%` }}
          >
            <motion.div
                className="h-1/3 w-1/3 rounded-full bg-green-500/50"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.7, 0.5]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {bombs.map((bomb) => (
          <motion.div
            key={`bomb-${bomb.position[0]}-${bomb.position[1]}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="pointer-events-none absolute h-[12.5%] w-[12.5%] flex items-center justify-center"
            style={{ top: `${bomb.position[0] * 12.5}%`, left: `${bomb.position[1] * 12.5}%` }}
          >
            <motion.img
              src="/Bomb.png"
              alt="Bomb"
              animate={{
                filter: [
                  'drop-shadow(0 0 2px #F87171)',
                  'drop-shadow(0 0 10px #EF4444)',
                  'drop-shadow(0 0 2px #F87171)',
                ],
                scale: [1, 1.1, 1, 0.9, 1],
                rotate: [0, 5, -5, 5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {runeCollecting && (
          <motion.div
            key="rune-collecting"
            className="absolute h-[12.5%] w-[12.5%] z-30"
            initial={{
              top: `${runeCollecting[0] * 12.5}%`,
              left: `${runeCollecting[1] * 12.5}%`,
              scale: 1,
            }}
            animate={{
              top: `100%`,
              left: `45%`,
              scale: 0.2,
              opacity: 0.5,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onAnimationComplete={onRuneAnimationComplete}
          >
            <FreezeRune />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {freezeRune && !runeCollecting && (
          <motion.div
            key={freezeRune.id}
            className="absolute h-[12.5%] w-[12.5%]"
            style={{ top: `${freezeRune.position[0] * 12.5}%`, left: `${freezeRune.position[1] * 12.5}%` }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <FreezeRune />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {explosionMarks.map((mark) => (
          <motion.div
            key={`mark-${mark.id}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.7, scale: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5, ease: 'easeOut' } }}
            className="pointer-events-none absolute h-[12.5%] w-[12.5%] z-0 flex items-center justify-center"
            style={{ top: `${mark.position[0] * 12.5}%`, left: `${mark.position[1] * 12.5}%` }}
          >
            <img src="/explosion-mark.png" alt="Explosion Mark" />
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {illegalMovePos && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="pointer-events-none absolute h-[12.5%] w-[12.5%] border-4 border-destructive rounded-sm"
            style={{ top: `${illegalMovePos[0] * 12.5}%`, left: `${illegalMovePos[1] * 12.5}%` }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameStatus !== 'lost' && (
          <motion.div
            key="white-knight"
            className="pointer-events-none absolute h-[12.5%] w-[12.5%]"
            initial={false}
            animate={getLMoveAnimation(prevWhiteKnightPos, whiteKnightPos)}
            exit={{ scale: 0, opacity: 0, rotate: 45, transition: { duration: 0.5, ease: 'easeInOut' } }}
            transition={knightTransition}
          >
            <div className="h-full w-full">
              <KnightIcon />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shadowKnights.map((knight) => {
          const oldKnightState = prevShadowKnights?.find((k) => k.id === knight.id);
          const oldPos = oldKnightState ? oldKnightState.position : knight.position;

          return (
            <motion.div
              key={`shadow-knight-${knight.id}`}
              className="pointer-events-none absolute h-[12.5%] w-[12.5%]"
              initial={false}
              animate={getLMoveAnimation(oldPos, knight.position)}
              exit={{ scale: 0, opacity: 0, rotate: 45, transition: { duration: 0.5, ease: 'easeInOut' } }}
              transition={knightTransition}
            >
              <div className="relative h-full w-full">
                <ShadowKnightIcon />
                {knight.isFrozen && (
                  <motion.div 
                    className="absolute inset-0 bg-blue-500/50 rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {explosions.map((pos, index) => (
          <motion.div
            key={`explosion-${pos[0]}-${pos[1]}-${index}`}
            className="pointer-events-none absolute h-[12.5%] w-[12.5%] z-20"
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
