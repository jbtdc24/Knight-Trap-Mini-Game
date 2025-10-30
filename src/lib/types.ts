export type Position = [number, number];

export type Knight = {
  id: string;
  position: Position;
};

export type ShadowKnight = Knight & {
  isTrapped?: boolean;
};

export type Bomb = {
  position: Position;
  timer: number;
};

export type GameStatus = 'starting' | 'playing' | 'won' | 'lost';

export type ExplosionMark = {
  id: string;
  position: Position;
};

export type Trail = {
  id: string;
  path: Position[];
};
