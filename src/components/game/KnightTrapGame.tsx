'use client';

import { useState, useEffect, useCallback, useTransition, useRef } from 'react';
import { getShadowKnightMoves } from '@/app/actions';
import {
  BOARD_SIZE,
  WHITE_KNIGHT_START,
  INITIAL_BOMB_DURATION,
  POINTS_PER_MOVE,
  POINTS_PER_CAPTURE,
  SHADOW_KNIGHT_RESPAWN_DELAY,
  FREEZE_RUNE_SPAWN_CHANCE,
  FREEZE_RUNE_DURATION,
  FREEZE_TURNS
} from '@/lib/constants';
import { isMoveLegal, isSamePosition, getRandomEmptySquare, getValidKnightMoves, deepCopy, getFurthestEmptySquare } from '@/lib/game-logic';
import type {
  Position,
  GameStatus,
  BoardSquare,
  Bomb,
  GameOverReason,
  ShadowKnight,
  ExplosionMark as ExplosionMarkType,
  Trail,
  FreezeRune as FreezeRuneType
} from '@/lib/types';
import GameBoard from './GameBoard';
import GameTopBar from './GameTopBar';
import GameOverDialog from './GameOverDialog';
import Inventory from './Inventory';
import { useToast } from '@/hooks/use-toast';
import StartingBattleOverlay from './StartingBattleOverlay';
import { AnimatePresence } from 'framer-motion';
import { useSfx, SoundEvent } from '@/hooks/use-sfx';
import { useAudio } from '@/context/AudioContext';

const createInitialBoard = (): BoardSquare[][] =>
  Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill({ type: 'empty' }));

const initializeShadowKnights = (board: BoardSquare[][], whiteKnightPos: Position): ShadowKnight[] => {
    const initialPositions: Position[] = [];
    const shadowKnights: ShadowKnight[] = [];
    let occupied = [whiteKnightPos];

    for (let i = 0; i < 2; i++) {
        const newPos = getRandomEmptySquare(board, occupied);
        if (newPos) {
            initialPositions.push(newPos);
            occupied.push(newPos);
            shadowKnights.push({ id: `shadow-${i + 1}`, position: newPos, status: 'active', respawnTurn: null, frozenTurnsLeft: 0 });
        } else {
            const fallbackPos: Position = [0, i * 7];
            initialPositions.push(fallbackPos);
            occupied.push(fallbackPos);
            shadowKnights.push({ id: `shadow-${i + 1}`, position: fallbackPos, status: 'active', respawnTurn: null, frozenTurnsLeft: 0 });
        }
    }
    return shadowKnights;
};


export default function KnightTrapGame({ onReturnToHome }: { onReturnToHome: () => void }) {
  const [board, setBoard] = useState<BoardSquare[][]>(createInitialBoard);
  const [whiteKnightPos, setWhiteKnightPos] = useState<Position>(WHITE_KNIGHT_START);
  const [shadowKnights, setShadowKnights] = useState<ShadowKnight[]>(() => initializeShadowKnights(board, whiteKnightPos));
  const [previousShadowKnightPositions, setPreviousShadowKnightPositions] = useState<Position[]>([]);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [bombs, setBombs] = useState<Bomb[]>([]);
  const [explosions, setExplosions] = useState<Position[]>([]);
  const [explosionMarks, setExplosionMarks] = useState<ExplosionMarkType[]>([]);
  const [score, setScore] = useState(0);
  const [turn, setTurn] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('starting');
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>(null);
  const [bombDuration, setBombDuration] = useState(INITIAL_BOMB_DURATION);
  const [totalCaptures, setTotalCaptures] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isAiThinking, startAiTransition] = useTransition();
  const { toast } = useToast();
  const [boardShake, setBoardShake] = useState(0);
  const [illegalMovePos, setIllegalMovePos] = useState<Position | null>(null);
  const playSound = useSfx();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { musicVolume } = useAudio();
  const [availableMoves, setAvailableMoves] = useState<Position[]>([]);
  const [freezeRune, setFreezeRune] = useState<FreezeRuneType | null>(null);
  const [inventory, setInventory] = useState<string[]>([]);

  useEffect(() => {
    if (gameStatus === 'playing' && totalCaptures < 6) {
      const allPiecePositions = [whiteKnightPos, ...shadowKnights.filter(k => k.status === 'active').map(k => k.position)];
      setAvailableMoves(getValidKnightMoves(whiteKnightPos, board, allPiecePositions));
    } else {
      setAvailableMoves([]);
    }
  }, [turn, gameStatus, totalCaptures, whiteKnightPos, shadowKnights, board]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio.volume = musicVolume;
      if (gameStatus === 'playing') {
        audio.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audio.pause();
      }
    }
  }, [gameStatus, musicVolume]);

  const resetGame = useCallback(() => {
    const newBoard = createInitialBoard();
    const newWhiteKnightPos = WHITE_KNIGHT_START;
    setBoard(newBoard);
    setWhiteKnightPos(newWhiteKnightPos);
    setShadowKnights(initializeShadowKnights(newBoard, newWhiteKnightPos));
    setPreviousShadowKnightPositions([]);
    setTrails([]);
    setBombs([]);
    setExplosions([]);
    setExplosionMarks([]);
    setScore(0);
    setTurn(0);
    setGameOverReason(null);
    setBombDuration(INITIAL_BOMB_DURATION);
    setTotalCaptures(0);
    setMultiplier(1);
    setFreezeRune(null);
    setInventory([]);
    playSound('startGame');
    setGameStatus('playing');
  }, [playSound]);

  useEffect(() => {
    if (gameStatus === 'starting') {
      const timer = setTimeout(() => {
        playSound('startGame');
        setGameStatus('playing');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [gameStatus, playSound]);

  useEffect(() => {
    if (freezeRune && gameStatus === 'playing') {
      const timer = setTimeout(() => {
        setFreezeRune(null);
      }, FREEZE_RUNE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [freezeRune, gameStatus]);

  const triggerVisualExplosion = useCallback((pos: Position) => {
    setExplosions(prev => [...prev, pos]);
    setExplosionMarks(prev => [...prev, { position: pos, id: Date.now().toString() }]);
    setBoardShake(prev => prev + 1);
  }, []);
  
  const triggerExplosion = useCallback((pos: Position) => {
    playSound('explosion');
    triggerVisualExplosion(pos);
  }, [playSound, triggerVisualExplosion]);

  const useItem = (item: string) => {
    if (item === 'freeze') {
      playSound('freeze');
      setShadowKnights(prev => 
        prev.map(k => k.status === 'active' ? { ...k, frozenTurnsLeft: FREEZE_TURNS } : k)
      );
      setInventory(prev => prev.filter(i => i !== 'freeze'));
      toast({ title: "Ice Age!", description: "Shadow Knights are frozen for 5 turns." });
    }
  };

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
      if (reason !== 'bomb') {
        playSound('gameOver');
      }
      setGameStatus('lost');
      setGameOverReason(reason);
    }
  }, [gameStatus, playSound]);

  const handlePlayerMove = (newPos: Position) => {
    if (gameStatus !== 'playing' || isAiThinking) return;

    setTrails([]);

    if (!isMoveLegal(whiteKnightPos, newPos)) {
      setIllegalMovePos(newPos);
      playSound('illegalMove');
      setTimeout(() => handleGameOver('illegalMove'), 500);
      return;
    }

    playSound('move');
    const nextTurn = turn + 1;
    let tempScore = score;
    let tempMultiplier = multiplier;
    let tempBombDuration = bombDuration;
    let tempTotalCaptures = totalCaptures;
    let tempShadowKnights = deepCopy(shadowKnights);
    let tempBombs = deepCopy(bombs);
    let tempFreezeRune = deepCopy(freezeRune);

    // Check for rune collection
    if (tempFreezeRune && isSamePosition(newPos, tempFreezeRune.position)) {
      playSound('collect');
      if (!inventory.includes('freeze')) {
        setInventory(prev => [...prev, 'freeze']);
      }
      tempFreezeRune = null;
      setFreezeRune(null);
    }

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
      playSound('capture');
      tempTotalCaptures++;
      const newMultiplier = 1 + Math.floor(tempTotalCaptures / 2);
      tempScore += POINTS_PER_CAPTURE * tempMultiplier;
      tempBombDuration++;

      if (newMultiplier > tempMultiplier) {
        playSound('levelUp');
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
        triggerVisualExplosion(knightToRespawn.position);
        knightToRespawn.status = 'respawning';
        knightToRespawn.respawnTurn = nextTurn + SHADOW_KNIGHT_RESPAWN_DELAY;
      }
    }
    
    tempScore += POINTS_PER_MOVE * tempMultiplier;

    startAiTransition(async () => {
      const activeKnightsForAI = tempShadowKnights.filter(k => k.status === 'active' && k.frozenTurnsLeft === 0);
      const frozenKnights = tempShadowKnights.filter(k => k.frozenTurnsLeft > 0);
      const oldShadowPositions = activeKnightsForAI.map(k => k.position);
      
      let aiPositions: Position[] = [];
      if (activeKnightsForAI.length > 0) {
        const { newPositions } = await getShadowKnightMoves(
          newPos, 
          oldShadowPositions, 
          board, 
          tempBombs, 
          nextTurn,
          previousShadowKnightPositions
        );
        aiPositions = newPositions;
      }
      
      setPreviousShadowKnightPositions(oldShadowPositions);

      if (aiPositions.length > 0) {
        playSound('shadowMove');
      }

      const newTrails: Trail[] = [];
      const destroyedKnightOriginalPositions: Position[] = [];

      aiPositions.forEach((newAiPos: Position, index: number) => {
        const knightId = activeKnightsForAI[index]?.id;
        const knightInState = tempShadowKnights.find((k: ShadowKnight) => k.id === knightId);

        if (knightInState) {
          const oldPos = knightInState.position;
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
              playSound('levelUp');
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
            newTrails.push({ id: knightId, path: [oldPos, newAiPos] });
            knightInState.position = newAiPos;
          }
        }
      });

      // Decrement freeze counter
      frozenKnights.forEach(k => k.frozenTurnsLeft--);

      setTrails(prev => [...prev, ...newTrails]);
      
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
          const respawnSquare = getFurthestEmptySquare(board, occupiedForRespawn, tempBombs, newPos);
          if (respawnSquare) {
            knight.position = respawnSquare;
            knight.status = 'active';
            knight.respawnTurn = null;
          }
        }
      });

      // Rune Spawning Logic
      if (tempTotalCaptures > 0 && !tempFreezeRune && Math.random() < FREEZE_RUNE_SPAWN_CHANCE) {
        const occupiedForRune = [newPos, ...tempShadowKnights.map(k => k.position)];
        const runePos = getRandomEmptySquare(board, occupiedForRune, tempBombs.map(b => b.position));
        if (runePos) {
          setFreezeRune({ position: runePos, id: Date.now().toString() });
        }
      }
      
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
        setTimeout(() => handleGameOver('captured'), 500);
        return;
      }
      
      const finalAllPiecePositions = [newPos, ...activeAfterRespawn.map((k: ShadowKnight) => k.position)];
      const validPlayerMoves = getValidKnightMoves(newPos, board, finalAllPiecePositions);

      if (validPlayerMoves.length === 0) {
        setTimeout(() => handleGameOver('trapped'), 500);
        return;
      }
    });
  };
  
  const activeShadowKnights = shadowKnights.filter(k => k.status === 'active');

  return (
    <div 
      className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/Ingamebackground.png')" }}
    >
      <audio ref={audioRef} src="/sfx/Ingame.MP3" preload="auto"></audio>
      <AnimatePresence>
        {gameStatus === 'starting' && <StartingBattleOverlay />}
      </AnimatePresence>
      <div className="w-full max-w-[560px]">
        <GameTopBar 
          score={score} 
          multiplier={multiplier} 
          bombDuration={bombDuration}
          totalCaptures={totalCaptures}
        />
      </div>
      <Inventory items={inventory} onUseItem={useItem} />
      <GameBoard
        whiteKnightPos={whiteKnightPos}
        shadowKnights={activeShadowKnights}
        bombs={bombs}
        explosions={explosions}
        explosionMarks={explosionMarks}
        trails={trails}
        onMove={handlePlayerMove}
        gameStatus={gameStatus}
        isAiThinking={isAiThinking}
        boardShake={boardShake}
        illegalMovePos={illegalMovePos}
        availableMoves={availableMoves}
        freezeRune={freezeRune}
      />

      <GameOverDialog
        isOpen={gameStatus === 'lost'}
        score={score}
        reason={gameOverReason}
        onRestart={resetGame}
        onReturnToHome={onReturnToHome}
      />
    </div>
  );
}
