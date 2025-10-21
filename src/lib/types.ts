export type Position = [number, number];

export type GameStatus = 'pre-game' | 'playing' | 'lost' | 'paused';

export type GameOverReason = 'trapped' | 'bomb' | 'captured' | 'illegalMove' | null;

export type BoardSquare = {
  type: 'empty';
};

export type Knight = 'white' | 'shadow';

export type Bomb = {
  position: Position;
  placedBy: Knight;
  turnPlaced: number;
};

export type ShadowKnight = {
  id: number;
  position: Position;
  status: 'active' | 'respawning';
  respawnTurn: number | null;
}

export type ExplosionMark = {
  position: Position;
  id: number;
}
