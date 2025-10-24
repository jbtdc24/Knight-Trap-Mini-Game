'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Bomb, GameStatus, Position, ShadowKnight, ExplosionMark as ExplosionMarkType } from '@/lib/types';
import { KnightIcon } from '../icons/KnightIcon';
import { ShadowKnightIcon } from '../icons/ShadowKnightIcon';
import { Explosion } from '../icons/Explosion';
import { useEffect, useRef } from 'react';
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
  if (!from || (to && isSamePosition(from, to))) {
    const y = to ? `${to[0] * 100}%` : (from ? `${from[0] * 100}%` : '0%');
    const x = to ? `${to[1] * 100}%` : (from ? `${from[1] * 100}%` : '0%');
    return { y, x, transition: { duration: 0 } };
  }

  const fromY = `${from[0] * 100}%`;
  const fromX = `${from[1] * 100}%`;
  const toY = `${to[0] * 100}%`;
  const toX = `${to[1] * 100}%`;

  const dx = to[1] - from[1];
  const dy = to[0] - from[0];
  const dist = Math.sqrt(dx * dx + dy * dy);
  const overshootAmount = dist > 0 ? 0.2 : 0;
  const normDx = dist > 0 ? dx / dist : 0;
  const normDy = dist > 0 ? dy / dist : 0;
  const overshootX = `${(to[1] + normDx * overshootAmount) * 100}%`;
  const overshootY = `${(to[0] + normDy * overshootAmount) * 100}%`;

  return {
    y: [fromY, overshootY, toY],
    x: [fromX, overshootX, toX],
    zIndex: 10,
  };
};

const GameBoard = ({
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
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        ))}
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
        <motion.div
          key="white-knight"
          className="pointer-events-none absolute h-[12.5%] w-[12.5%]"
          initial={false}
          animate={getLMoveAnimation(prevWhiteKnightPos, whiteKnightPos)}
          transition={{ duration: 0.1, ease: 'circOut', times: [0, 0.7, 1] }}
        >
          <KnightIcon />
        </motion.div>
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
              transition={{ duration: 0.1, ease: 'circOut', times: [0, 0.7, 1] }}
            >
              <ShadowKnightIcon />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {explosions.map((pos, index) => (
          <motion.div
            key={`explosion-${pos[0]}-${pos[1]}-${index}`}
            className="pointer-events-none absolute h-[12.5%] w-[12.5%]"
            style={{ x: `${pos[1] * 100}%`, y: `${pos[0] * 100}%` }}
          >
            <Explosion />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default GameBoard;
