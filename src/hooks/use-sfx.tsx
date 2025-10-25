'use client';

import { useCallback } from 'react';
import { useAudio } from '@/context/AudioContext';

// Defines the mapping of game events to sound files
const sounds = {
  startGame: '/sfx/Gamestart.MP3',
  move: '/sfx/Whitemove.MP3',
  shadowMove: '/sfx/Blackmove.MP3',
  illegalMove: '/sfx/Click.MP3',
  capture: '/sfx/Capture.MP3',
  levelUp: '/sfx/Capture.MP3', // No level-up sound, using capture
  explosion: '/sfx/Bomb.MP3',
  gameOver: '/sfx/Bomb.MP3', // No game-over sound, using bomb
  hover: '/sfx/Hover.MP3',
  click: '/sfx/Click.MP3',
};

export type SoundEvent = keyof typeof sounds;

/**
 * A custom hook to play sound effects corresponding to game events.
 * @returns A function that takes a SoundEvent and plays the corresponding sound.
 */
export function useSfx() {
  const { sfxVolume } = useAudio();

  const playSound = useCallback((event: SoundEvent) => {
    // Ensure this code runs only in the browser
    if (typeof window !== 'undefined') {
      const soundSrc = sounds[event];
      if (soundSrc) {
        const audio = new Audio(soundSrc);
        audio.volume = sfxVolume;
        audio.play().catch(e => {
          // This can happen if the user hasn't interacted with the page yet
          console.error(`Could not play sound for event \"${event}\":`, e);
        });
      }
    }
  }, [sfxVolume]);

  return playSound;
}
