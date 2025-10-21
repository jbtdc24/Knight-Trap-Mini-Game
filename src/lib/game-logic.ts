import { BOARD_SIZE } from './constants';
import type { BoardSquare, Position, Bomb } from './types';

const KNIGHT_MOVES: Position[] = [
  [1, 2], [1, -2], [-1, 2], [-1, -2],
  [2, 1], [2, -1], [-2, 1], [-2, -1],
];

export const isOutOfBounds = (pos: Position): boolean => {
  const [row, col] = pos;
  return row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE;
};

export const isSamePosition = (pos1: Position, pos2: Position): boolean => {
  return pos1[0] === pos2[0] && pos1[1] === pos2[1];
}

export const getValidKnightMoves = (
  position: Position,
  board: BoardSquare[][],
  occupied: Position[]
): Position[] => {
  const [row, col] = position;
  const validMoves: Position[] = [];

  for (const move of KNIGHT_MOVES) {
    const newPos: Position = [row + move[0], col + move[1]];
    if (
      !isOutOfBounds(newPos) &&
      !occupied.some(p => isSamePosition(p, newPos))
    ) {
      validMoves.push(newPos);
    }
  }
  return validMoves;
};

export const isMoveLegal = (
  from: Position,
  to: Position,
): boolean => {
    // Is it a valid knight move pattern?
    const dx = Math.abs(from[0] - to[0]);
    const dy = Math.abs(from[1] - to[1]);
    return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
};


export const getRandomEmptySquare = (
  board: BoardSquare[][],
  occupiedPositions: Position[]
): Position | null => {
  const emptySquares: Position[] = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const pos: Position = [i, j];
      const isOccupied = occupiedPositions.some(p => isSamePosition(p, pos));
      if (!isOccupied) {
        emptySquares.push(pos);
      }
    }
  }

  if (emptySquares.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
};
