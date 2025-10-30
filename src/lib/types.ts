export type Position = [number, number];

export type GameStatus = 'starting' | 'playing' | 'lost';

export type PieceType = 'empty' | 'white-knight' | 'shadow-knight' | 'bomb';

export interface BoardSquare {
  type: PieceType;
}

export interface Bomb {
  position: Position;
  placedBy: 'white' | 'shadow';
  turnPlaced: number;
}

export interface ExplosionMark {
    position: Position;
    id: string;
}

export type GameOverReason = 'captured' | 'trapped' | 'bomb' | 'illegalMove' | null;

export interface ShadowKnight {
  id: string;
  position: Position;
  status: 'active' | 'respawning';
  respawnTurn: number | null;
  isFrozen: boolean;
}

export interface Trail {
    id: string;
    path: Position[];
}

export interface FreezeRune {
    id: string;
    position: Position;
}
