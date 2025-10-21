// @ts-nocheck
'use server';

import type { Bomb, BoardSquare, Position } from '@/lib/types';
import { getOfflineShadowKnightMoves } from '@/lib/offline-ai';

export async function getShadowKnightMoves(
  whiteKnightPos: Position,
  shadowKnightPositions: Position[],
  board: BoardSquare[][],
  bombs: Bomb[],
  turnNumber: number,
  previousShadowKnightPositions: Position[] // New parameter
): Promise<{ newPositions: Position[], oldPositions: Position[] }> {

  if (shadowKnightPositions.length === 0) {
    return { newPositions: [], oldPositions: [] };
  }
  
  try {
    const aiPositions = getOfflineShadowKnightMoves(
        whiteKnightPos,
        shadowKnightPositions,
        board,
        previousShadowKnightPositions // Pass it to the AI
    );
    
    return { newPositions: aiPositions, oldPositions: shadowKnightPositions };

  } catch (error) {
    console.error("Offline AI move generation failed, knights will skip their turn:", error);
    return { newPositions: shadowKnightPositions, oldPositions: shadowKnightPositions };
  }
}
