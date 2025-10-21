import { getValidKnightMoves, isSamePosition } from './game-logic';
import type { BoardSquare, Position, ShadowKnight } from './types';

const getDistance = (pos1: Position, pos2: Position): number => {
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
};

export const getOfflineShadowKnightMoves = (
    whiteKnightPos: Position,
    shadowKnightPositions: Position[],
    board: BoardSquare[][],
    previousShadowKnightPositions: Position[] // New parameter
): Position[] => {
    if (shadowKnightPositions.length === 0) {
        return [];
    }

    const finalMoves: Position[] = [];

    shadowKnightPositions.forEach((knightPos, index) => {
        const otherKnightCurrentPos = finalMoves.length > 0 ? finalMoves[0] : (shadowKnightPositions.length > 1 ? shadowKnightPositions[1] : null);
        const occupiedForThisKnight = [whiteKnightPos, ...shadowKnightPositions.filter(p => !isSamePosition(p, knightPos)), ...finalMoves];

        let possibleMoves = getValidKnightMoves(knightPos, board, occupiedForThisKnight);

        // --- The New Logic: Avoid Previous Position ---
        const previousPos = previousShadowKnightPositions[index];
        if (previousPos) {
            possibleMoves = possibleMoves.filter(move => !isSamePosition(move, previousPos));
        }

        const captureMove = possibleMoves.find(move => isSamePosition(move, whiteKnightPos));
        if (captureMove) {
            finalMoves.push(captureMove);
            return; // Next knight
        }

        if (possibleMoves.length === 0) {
            finalMoves.push(knightPos); // Stay put if no moves
            return; // Next knight
        }

        const scoredMoves = possibleMoves.map(move => {
            const distanceToWhite = getDistance(move, whiteKnightPos);
            const distanceToOther = otherKnightCurrentPos ? getDistance(move, otherKnightCurrentPos) : 0;
            // Heuristic: move closer to the white knight, but maintain some distance from the other shadow knight.
            const score = (otherKnightCurrentPos ? distanceToOther * 0.5 : 0) - distanceToWhite;
            return { move, score };
        });

        scoredMoves.sort((a, b) => b.score - a.score);
        finalMoves.push(scoredMoves[0].move);
    });

    // Final check to prevent knights from landing on the same square
    if (finalMoves.length > 1 && isSamePosition(finalMoves[0], finalMoves[1])) {
        // The second knight (if it was the one to move into the same square) will stay put.
        finalMoves[1] = shadowKnightPositions[1];
    }
    
    return finalMoves;
};
