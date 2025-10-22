// @ts-nocheck
'use server';

import type { BoardSquare, Position, Bomb } from '@/lib/types';
import { getOfflineShadowKnightMoves } from '@/lib/offline-ai';

export async function getShadowKnightMoves(
  whiteKnightPos: Position,
  shadowKnightPositions: Position[],
  board: BoardSquare[][],
  bombs: Bomb[],
  turn: number,
  previousShadowKnightPositions: Position[],
): Promise<{ newPositions: Position[], oldPositions: Position[] }> {

  if (shadowKnightPositions.length === 0) {
    return { newPositions: [], oldPositions: [] };
  }
  
  try {
    const aiPositions = getOfflineShadowKnightMoves(
        whiteKnightPos,
        shadowKnightPositions,
        board,
        bombs,
        turn,
        previousShadowKnightPositions,
    );
    
    return { newPositions: aiPositions, oldPositions: shadowKnightPositions };

  } catch (error) {
    console.error("Offline AI move generation failed, knights will skip their turn:", error);
    return { newPositions: shadowKnightPositions, oldPositions: shadowKnightPositions };
  }
}
