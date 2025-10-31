export type Position = [number, number];
export type GameStatus = 'starting' | 'playing' | 'lost';
export type BoardSquare = { type: 'empty' | 'bomb' };
export type Bomb = { id: string; position: Position; placedBy: 'white' | 'shadow'; turnPlaced: number };
export type GameOverReason = 'captured' | 'trapped' | 'bomb' | 'illegalMove' | null;
export type ShadowKnight = {
  id: string;
  position: Position;
  status: 'active' | 'respawning';
  respawnTurn: number | null;
  isFrozen: boolean;
};
export type ExplosionMark = { position: Position; id: string };
export type Trail = { id: string | number; path: Position[] };
export type FreezeRune = { position: Position; id: string };
export type FluxRune = { position: Position; id: string };

export interface GameBoardProps {
  whiteKnightPos: Position;
  shadowKnights: ShadowKnight[];
  bombs: Bomb[];
  bombTransitions: any[];
  explosions: Position[];
  explosionMarks: ExplosionMark[];
  trails: Trail[];
  onMove: (pos: Position) => void;
  gameStatus: GameStatus;
  isAiThinking: boolean;
  boardShake: number;
  illegalMovePos: Position | null;
  availableMoves: Position[];
  freezeRune: FreezeRune | null;
  fluxRune: FluxRune | null;
  runeCollecting: Position | null;
  onRuneAnimationComplete: () => void;
  collectingItemType: string | null;
}
