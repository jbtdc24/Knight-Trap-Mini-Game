import { getValidKnightMoves, isSamePosition } from './game-logic';
import type { BoardSquare, Position, Bomb } from './types';

// Heuristic function to estimate distance for a knight
const getDistance = (pos1: Position, pos2: Position): number => {
    const dx = Math.abs(pos1[0] - pos2[0]);
    const dy = Math.abs(pos1[1] - pos2[1]);
    // A rough estimation of knight moves needed
    return Math.max(Math.ceil(dx / 2), Math.ceil(dy / 2), Math.ceil((dx + dy) / 3));
};

export const getOfflineShadowKnightMoves = (
    whiteKnightPos: Position,
    shadowKnightPositions: Position[],
    board: BoardSquare[][],
    bombs: Bomb[],
    turn: number,
    previousShadowKnightPositions: Position[],
): Position[] => {
    if (shadowKnightPositions.length === 0) {
        return [];
    }

    const finalMoves: Position[] = [];
    // Start with the current knight positions as obstacles
    const occupiedForThisTurn: Position[] = [...shadowKnightPositions];

    // Process knights one by one, making the logic sequential
    shadowKnightPositions.forEach((knightPos, index) => {
        // Obstacles are other knights and the already decided moves of previous knights in the loop
        const otherKnightObstacles = occupiedForThisTurn.filter(p => !isSamePosition(p, knightPos));

        let possibleMoves = getValidKnightMoves(knightPos, board, otherKnightObstacles);

        // --- Priority #1: Capture the White Knight ---
        const captureMove = possibleMoves.find(move => isSamePosition(move, whiteKnightPos));
        if (captureMove) {
            finalMoves.push(captureMove);
            // Update the occupied list for the next knight's calculation
            occupiedForThisTurn[index] = captureMove;
            return; // Next knight
        }

        // --- Priority #2: Avoid Previous Position (to prevent simple back-and-forth loops) ---
        const previousPos = previousShadowKnightPositions[index];
        if (previousPos) {
            const movesWithoutRepetition = possibleMoves.filter(move => !isSamePosition(move, previousPos));
            if (movesWithoutRepetition.length > 0) {
                possibleMoves = movesWithoutRepetition;
            }
        }

        // If no moves are possible, the knight stays put.
        if (possibleMoves.length === 0) {
            finalMoves.push(knightPos);
            occupiedForThisTurn[index] = knightPos;
            return; // Next knight
        }

        // --- Priority #3: Find the best move by scoring (move closer to the white knight) ---
        const scoredMoves = possibleMoves.map(move => {
            const distanceToWhite = getDistance(move, whiteKnightPos);
            // Simple heuristic: the best move is the one that minimizes the distance to the white knight.
            const score = -distanceToWhite;
            return { move, score };
        });

        scoredMoves.sort((a, b) => b.score - a.score);
        const bestMove = scoredMoves[0].move;
        finalMoves.push(bestMove);
        
        // Update the occupied list for the next knight's calculation
        occupiedForThisTurn[index] = bestMove;
    });
    
    return finalMoves;
};
