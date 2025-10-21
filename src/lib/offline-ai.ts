import { getValidKnightMoves, isSamePosition } from './game-logic';
import type { BoardSquare, Position, ShadowKnight } from './types';

const getDistance = (pos1: Position, pos2: Position): number => {
    // Using Manhattan distance as a simple heuristic
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
};

// This AI is not aware of bombs, matching the original design
export const getOfflineShadowKnightMoves = (
    whiteKnightPos: Position,
    shadowKnightPositions: Position[],
    board: BoardSquare[][],
): Position[] => {
    if (shadowKnightPositions.length === 0) {
        return [];
    }

    const finalMoves: Position[] = [];

    // --- Process First Knight ---
    const knight1 = shadowKnightPositions[0];
    const otherKnightPos = shadowKnightPositions.length > 1 ? shadowKnightPositions[1] : null;

    // Get all valid moves for the first knight
    const occupiedForKnight1 = [whiteKnightPos, ...shadowKnightPositions];
    let knight1Moves = getValidKnightMoves(knight1, board, occupiedForKnight1);

    // If a capture is possible, prioritize it
    const captureMove1 = knight1Moves.find(move => isSamePosition(move, whiteKnightPos));
    if (captureMove1) {
        finalMoves.push(captureMove1);
    } else {
        // Evaluate moves based on distance to white knight and other shadow knight
        const scoredMoves1 = knight1Moves.map(move => {
            const distanceToWhite = getDistance(move, whiteKnightPos);
            const distanceToOther = otherKnightPos ? getDistance(move, otherKnightPos) : 0;
            // We want to maximize distance from both
            const score = distanceToWhite + (otherKnightPos ? distanceToOther * 0.5 : 0);
            return { move, score };
        });

        if (scoredMoves1.length > 0) {
            scoredMoves1.sort((a, b) => b.score - a.score); // Higher score is better
            finalMoves.push(scoredMoves1[0].move);
        } else {
            // No valid moves, knight stays put
            finalMoves.push(knight1);
        }
    }


    // --- Process Second Knight (if exists) ---
    if (shadowKnightPositions.length > 1) {
        const knight2 = shadowKnightPositions[1];
        const firstKnightNewPos = finalMoves[0];

        // Occupied positions now include the white knight and the *new* position of the first knight
        const occupiedForKnight2 = [whiteKnightPos, firstKnightNewPos];
        let knight2Moves = getValidKnightMoves(knight2, board, occupiedForKnight2);

        // Prioritize capture
        const captureMove2 = knight2Moves.find(move => isSamePosition(move, whiteKnightPos));
        if (captureMove2) {
            finalMoves.push(captureMove2);
        } else {
            const scoredMoves2 = knight2Moves.map(move => {
                const distanceToWhite = getDistance(move, whiteKnightPos);
                // The second knight wants to stay away from the first knight's *new* position
                const distanceToOther = getDistance(move, firstKnightNewPos);
                const score = distanceToWhite + distanceToOther * 0.5;
                return { move, score };
            });

            if (scoredMoves2.length > 0) {
                scoredMoves2.sort((a, b) => b.score - a.score);
                finalMoves.push(scoredMoves2[0].move);
            } else {
                finalMoves.push(knight2);
            }
        }
    }

    // Final check to prevent knights from landing on the same square
    if (finalMoves.length > 1 && isSamePosition(finalMoves[0], finalMoves[1])) {
        // The second knight will just stay in its original spot if a collision is predicted.
        finalMoves[1] = shadowKnightPositions[1];
    }
    
    return finalMoves;
};
