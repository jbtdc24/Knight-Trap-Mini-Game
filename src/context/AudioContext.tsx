'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type AudioContextType = {
  musicVolume: number;
  sfxVolume: number;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [musicVolume, setMusicVolume] = useState(1);
  const [sfxVolume, setSfxVolume] = useState(1);

  return (
    <AudioContext.Provider value={{ musicVolume, sfxVolume, setMusicVolume, setSfxVolume }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
