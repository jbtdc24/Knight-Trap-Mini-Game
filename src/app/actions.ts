// @ts-nocheck
'use server';

import type { Bomb, BoardSquare, Position } from '@/lib/types';
import { getOfflineShadowKnightMoves } from '@/lib/offline-ai';

export async function getShadowKnightMoves(
  whiteKnightPos: Position,
  shadowKnightPositions: Position[],
  board: BoardSquare[][],
  bombs: Bomb[],
  turnNumber: number
): Promise<{ newPositions: Position[], oldPositions: Position[] }> {

  // If there are no shadow knights, return empty arrays
  if (shadowKnightPositions.length === 0) {
    return { newPositions: [], oldPositions: [] };
  }
  
  try {
    const aiPositions = getOfflineShadowKnightMoves(
        whiteKnightPos,
        shadowKnightPositions,
        board
    );
    
    return { newPositions: aiPositions, oldPositions: shadowKnightPositions };

  } catch (error) {
    console.error("Offline AI move generation failed, knights will skip their turn:", error);
    // If the AI fails, the knights just stay in place. This prevents a crash and is a safe fallback.
    return { newPositions: shadowKnightPositions, oldPositions: shadowKnightPositions };
  }
}
