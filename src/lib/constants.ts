import type { Position, ShadowKnight } from './types';

export const BOARD_SIZE = 8;

// Points
export const POINTS_PER_MOVE = 10;
export const POINTS_PER_CAPTURE = 25;

// Bombs
export const INITIAL_BOMB_DURATION = 3; // In player moves

// Knights
export const WHITE_KNIGHT_START: Position = [4, 4];
export const SHADOW_KNIGHTS_START: ShadowKnight[] = [
  { id: 1, position: [0, 0], status: 'active', respawnTurn: null },
  { id: 2, position: [0, 7], status: 'active', respawnTurn: null },
];
export const SHADOW_KNIGHT_RESPAWN_DELAY = 3; // in player moves


// Gameplay Rules
export const VALID_MOVE_INDICATOR_CAPTURE_THRESHOLD = 5;
