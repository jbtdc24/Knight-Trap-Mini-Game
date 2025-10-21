'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { getShadowKnightMoves } from '@/app/actions';
import {
  BOARD_SIZE,
  WHITE_KNIGHT_START,
  SHADOW_KNIGHTS_START,
  INITIAL_BOMB_DURATION,
  POINTS_PER_MOVE,
  POINTS_PER_CAPTURE,
  SHADOW_KNIGHT_RESPAWN_DELAY,
} from '@/lib/constants';
import { isMoveLegal, isSamePosition, getRandomEmptySquare, getValidKnightMoves, deepCopy } from '@/lib/game-logic';
import type {
  Position,
  GameStatus,
  BoardSquare,
  Bomb,
  GameOverReason,
  ShadowKnight,
  ExplosionMark as ExplosionMarkType,
} from '@/lib/types';
import GameBoard from './GameBoard';
import GameTopBar from './GameTopBar';
import GameOverDialog from './GameOverDialog';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Play } from 'lucide-react';
import { Logo } from '../icons/Logo';

const createInitialBoard = (): BoardSquare[][] =>
  Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill({ type: 'empty' }));

export default function KnightTrapGame() {
  const [board, setBoard] = useState<BoardSquare[][]>(createInitialBoard);
  const [whiteKnightPos, setWhiteKnightPos] = useState<Position>(WHITE_KNIGHT_START);
  const [shadowKnights, setShadowKnights] = useState<ShadowKnight[]>(() => deepCopy(SHADOW_KNIGHTS_START));
  const [previousShadowKnightPositions, setPreviousShadowKnightPositions] = useState<Position[]>([]); // New state
  const [bombs, setBombs] = useState<Bomb[]>([]);
  const [explosions, setExplosions] = useState<Position[]>([]);
  const [explosionMarks, setExplosionMarks] = useState<ExplosionMarkType[]>([]);
  const [score, setScore] = useState(0);
  const [turn, setTurn] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('pre-game');
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>(null);
  const [bombDuration, setBombDuration] = useState(INITIAL_BOMB_DURATION);
  const [totalCaptures, setTotalCaptures] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isAiThinking, startAiTransition] = useTransition();
  const { toast } = useToast();
  const [boardShake, setBoardShake] = useState(0);
  const [illegalMovePos, setIllegalMovePos] = useState<Position | null>(null);

  const startGame = () => {
    resetGame();
    setGameStatus('playing');
  };

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setWhiteKnightPos(WHITE_KNIGHT_START);
    setShadowKnights(deepCopy(SHADOW_KNIGHTS_START));
    setPreviousShadowKnightPositions([]); // Reset new state
    setBombs([]);
    setExplosions([]);
    setExplosionMarks([]);
    setScore(0);
    setTurn(0);
    setGameStatus('pre-game');
    setGameOverReason(null);
    setBombDuration(INITIAL_BOMB_DURATION);
    setTotalCaptures(0);
    setMultiplier(1);
  }, []);
  
  const triggerExplosion = (pos: Position) => {
    setExplosions(prev => [...prev, pos]);
    setExplosionMarks(prev => [...prev, { position: pos, id: Date.now() }]);
    setBoardShake(prev => prev + 1);
  }

  useEffect(() => {
    if (illegalMovePos) {
      const timer = setTimeout(() => setIllegalMovePos(null), 300);
      return () => clearTimeout(timer);
    }
  }, [illegalMovePos]);

  useEffect(() => {
    if (explosions.length > 0) {
      const timer = setTimeout(() => setExplosions([]), 500);
      return () => clearTimeout(timer);
    }
  }, [explosions]);

  useEffect(() => {
    if (explosionMarks.length > 0) {
      const latestMark = explosionMarks[explosionMarks.length - 1];
      if (latestMark) {
        const timer = setTimeout(() => {
          setExplosionMarks(prev => prev.filter(mark => mark.id !== latestMark.id));
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [explosionMarks]);

  const handleGameOver = useCallback((reason: GameOverReason) => {
    if (gameStatus === 'playing') {
      setGameStatus('lost');
      setGameOverReason(reason);
    }
  }, [gameStatus]);

  const handlePlayerMove = (newPos: Position) => {
    if (gameStatus !== 'playing' || isAiThinking) return;

    if (!isMoveLegal(whiteKnightPos, newPos)) {
      setIllegalMovePos(newPos);
      setTimeout(() => handleGameOver('illegalMove'), 500);
      return;
    }

    const nextTurn = turn + 1;
    let tempScore = score;
    let tempMultiplier = multiplier;
    let tempBombDuration = bombDuration;
    let tempTotalCaptures = totalCaptures;
    let tempShadowKnights = deepCopy(shadowKnights);
    let tempBombs = deepCopy(bombs);

    const landingOnBombIndex = tempBombs.findIndex((bomb: Bomb) => isSamePosition(bomb.position, newPos));
    if (landingOnBombIndex > -1) {
      setWhiteKnightPos(newPos);
      triggerExplosion(newPos);
      setBombs(bombs.filter((b: Bomb) => !isSamePosition(b.position, newPos)));
      setTimeout(() => handleGameOver('bomb'), 500);
      return;
    }

    tempBombs.push({ position: whiteKnightPos, placedBy: 'white', turnPlaced: turn });
    setWhiteKnightPos(newPos);

    const capturedKnightIndex = tempShadowKnights.findIndex(
      (k: ShadowKnight) => k.status === 'active' && isSamePosition(k.position, newPos)
    );

    if (capturedKnightIndex > -1) {
      tempTotalCaptures++;
      const newMultiplier = 1 + Math.floor(tempTotalCaptures / 2);
      tempScore += POINTS_PER_CAPTURE * tempMultiplier;
      tempBombDuration++;

      if (newMultiplier > tempMultiplier) {
        toast({
          title: `Shadow Knight Captured!`,
          description: `Multiplier is now ${newMultiplier}x! Bomb duration is ${tempBombDuration}!`,
        });
        tempMultiplier = newMultiplier;
      } else {
        toast({
          title: `Shadow Knight Captured!`,
          description: `Bomb duration increased to ${tempBombDuration}!`,
        });
      }
      
      const knightToRespawn = tempShadowKnights[capturedKnightIndex];
      if(knightToRespawn) {
        triggerExplosion(knightToRespawn.position);
        knightToRespawn.status = 'respawning';
        knightToRespawn.respawnTurn = nextTurn + SHADOW_KNIGHT_RESPAWN_DELAY;
      }
    }
    
    tempScore += POINTS_PER_MOVE * tempMultiplier;

    startAiTransition(async () => {
      const activeKnightsForAI = tempShadowKnights.filter((k: ShadowKnight) => k.status === 'active');
      const oldShadowPositions = activeKnightsForAI.map((k: ShadowKnight) => k.position);
      
      const { newPositions: aiPositions } = await getShadowKnightMoves(
        newPos, 
        oldShadowPositions, 
        board, 
        tempBombs, 
        nextTurn,
        previousShadowKnightPositions // Pass the new argument
      );
      
      // For the *next* turn, the AI needs to know where the knights were before this move.
      setPreviousShadowKnightPositions(oldShadowPositions);
      
      const destroyedKnightOriginalPositions: Position[] = [];

      aiPositions.forEach((newAiPos: Position, index: number) => {
        const knightId = activeKnightsForAI[index]?.id;
        const knightInState = tempShadowKnights.find((k: ShadowKnight) => k.id === knightId);

        if (knightInState) {
          const isBomb = tempBombs.some((bomb: Bomb) => isSamePosition(bomb.position, newAiPos));
          if (isBomb) {
            tempBombs = tempBombs.filter((b: Bomb) => !isSamePosition(b.position, newAiPos));
            destroyedKnightOriginalPositions.push(knightInState.position);
            triggerExplosion(newAiPos);
            knightInState.status = 'respawning';
            knightInState.respawnTurn = nextTurn + SHADOW_KNIGHT_RESPAWN_DELAY;
            
            tempTotalCaptures++;
            const newMultiplier = 1 + Math.floor(tempTotalCaptures / 2);
            tempScore += POINTS_PER_CAPTURE * tempMultiplier;
            tempBombDuration++;

            if (newMultiplier > tempMultiplier) {
              toast({
                title: `A Shadow Knight fell into a trap!`,
                description: `Multiplier up to ${newMultiplier}x! Bomb duration increased.`,
              });
              tempMultiplier = newMultiplier;
            } else {
              toast({
                title: `A Shadow Knight fell into a trap!`,
                description: `Bomb duration increased.`,
              });
            }

          } else {
            knightInState.position = newAiPos;
          }
        }
      });
      
      oldShadowPositions.forEach((oldPos: Position) => {
        const wasDestroyedByBomb = destroyedKnightOriginalPositions.some(destroyedPos => isSamePosition(destroyedPos, oldPos));
        const capturedKnightInfo = shadowKnights[capturedKnightIndex];
        const wasCapturedByPlayer = capturedKnightIndex > -1 && capturedKnightInfo && isSamePosition(capturedKnightInfo.position, oldPos);

        if (!wasDestroyedByBomb && !wasCapturedByPlayer) {
            tempBombs.push({ position: oldPos, placedBy: 'shadow', turnPlaced: turn });
        }
      });
      
      tempShadowKnights.forEach((knight: ShadowKnight) => {
        if (knight.status === 'respawning' && knight.respawnTurn !== null && nextTurn >= knight.respawnTurn) {
          const occupiedForRespawn = [newPos, ...tempShadowKnights.filter((k: ShadowKnight) => k.status === 'active').map((k: ShadowKnight) => k.position)];
          const respawnSquare = getRandomEmptySquare(board, occupiedForRespawn);
          if (respawnSquare) {
            knight.position = respawnSquare;
            knight.status = 'active';
            knight.respawnTurn = null;
          }
        }
      });
      
      setScore(tempScore);
      setTotalCaptures(tempTotalCaptures);
      setMultiplier(tempMultiplier);
      setBombDuration(tempBombDuration);
      setShadowKnights(tempShadowKnights);
      const turnCutoff = nextTurn - tempBombDuration;
      setBombs(tempBombs.filter((b: Bomb) => b.turnPlaced >= turnCutoff));
      setTurn(nextTurn);

      const activeAfterRespawn = tempShadowKnights.filter((k: ShadowKnight) => k.status === 'active');
      if (activeAfterRespawn.some((p: ShadowKnight) => isSamePosition(p.position, newPos))) {
        setTimeout(() => handleGameOver('captured'), 100); // Short delay to see the capture
        return;
      }
      
      const finalAllPiecePositions = [newPos, ...activeAfterRespawn.map((k: ShadowKnight) => k.position)];
      const validPlayerMoves = getValidKnightMoves(newPos, board, finalAllPiecePositions);

      if (validPlayerMoves.length === 0) {
        setTimeout(() => handleGameOver('trapped'), 100);
        return;
      }

      if (validPlayerMoves.every(move => tempBombs.some((bomb: Bomb) => isSamePosition(bomb.position, move)))) {
        setTimeout(() => handleGameOver('trapped'), 100);
      }
    });
  };
  
  const activeShadowKnights = shadowKnights.filter(k => k.status === 'active');

  if (gameStatus === 'pre-game') {
    return (
      <div className="flex flex-col items-center justify-center gap-8 text-center">
        <Logo />
        <Button onClick={startGame} size="lg" className="font-headline text-xl">
            <Play className="mr-2" />
            Start Game
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-8">
      <GameTopBar 
        score={score} 
        multiplier={multiplier} 
        bombDuration={bombDuration}
      />
      <GameBoard
        board={board}
        whiteKnightPos={whiteKnightPos}
        shadowKnights={activeShadowKnights}
        bombs={bombs}
        explosions={explosions}
        explosionMarks={explosionMarks}
        onMove={handlePlayerMove}
        gameStatus={gameStatus}
        isAiThinking={isAiThinking}
        boardShake={boardShake}
        illegalMovePos={illegalMovePos}
      />

      <GameOverDialog
        isOpen={gameStatus === 'lost'}
        score={score}
        reason={gameOverReason}
        onRestart={() => {
          resetGame();
          startGame();
        }}
      />
    </div>
  );
}
