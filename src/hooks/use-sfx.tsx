'use client';

import { useCallback } from 'react';

// Defines the mapping of game events to sound files
const sounds = {
  startGame: '/sfx/start-game.mp3',
  move: '/sfx/move.mp3',
  illegalMove: '/sfx/illegal-move.mp3',
  capture: '/sfx/capture.mp3',
  levelUp: '/sfx/level-up.mp3',
  explosion: '/sfx/explosion.mp3',
  gameOver: '/sfx/game-over.mp3',
};

export type SoundEvent = keyof typeof sounds;

/**
 * A custom hook to play sound effects corresponding to game events.
 * @returns A function that takes a SoundEvent and plays the corresponding sound.
 */
export function useSfx() {
  const playSound = useCallback((event: SoundEvent) => {
    // Ensure this code runs only in the browser
    if (typeof window !== 'undefined') {
      const soundSrc = sounds[event];
      if (soundSrc) {
        const audio = new Audio(soundSrc);
        audio.play().catch(e => {
          // This can happen if the user hasn't interacted with the page yet
          console.error(`Could not play sound for event "${event}":`, e);
        });
      }
    }
  }, []);

  return playSound;
}
