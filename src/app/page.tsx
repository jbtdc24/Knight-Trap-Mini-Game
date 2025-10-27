'use client';

import { useState, useEffect } from 'react';
import KnightTrapGame from '@/components/game/KnightTrapGame';
import HomeScreen from '@/components/game/HomeScreen';
import VolumeControl from '@/components/game/VolumeControl';
import LoadingScreen from '@/components/game/LoadingScreen';

const assets = [
  '/Blackknight.png',
  '/Board.png',
  '/Bomb.png',
  '/explosion-mark.png',
  '/home-background.png',
  '/howto.png',
  '/Ingamebackground.png',
  '/Logo 8bit.png',
  '/Playbutton.png',
  '/sfx/Blackmove.MP3',
  '/sfx/Bomb.MP3',
  '/sfx/Capture.MP3',
  '/sfx/Click.MP3',
  '/sfx/Gamestart.MP3',
  '/sfx/HomeScreen.MP3',
  '/sfx/Hover.MP3',
  '/sfx/Ingame.MP3',
  '/sfx/Whitemove.MP3',
  '/WhiteKnight.png'
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const handleGameStart = () => setGameStarted(true);
  const handleReturnToHome = () => setGameStarted(false);
  const handleLoadingComplete = () => setIsLoading(false);

  return (
    <main>
      {isLoading ? (
        <LoadingScreen assets={assets} onLoadingComplete={handleLoadingComplete} />
      ) : (
        <>
          <VolumeControl />
          {gameStarted ? (
            <KnightTrapGame onReturnToHome={handleReturnToHome} />
          ) : (
            <HomeScreen onPlayClick={handleGameStart} />
          )}
        </>
      )}
    </main>
  );
}
