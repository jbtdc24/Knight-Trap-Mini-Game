'use client';

import { useState } from 'react';
import KnightTrapGame from '@/components/game/KnightTrapGame';
import HomeScreen from '@/components/game/HomeScreen';
import VolumeControl from '@/components/game/VolumeControl';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleGameStart = () => setGameStarted(true);
  const handleReturnToHome = () => setGameStarted(false);

  return (
    <main>
      <VolumeControl />
      {gameStarted ? (
        <KnightTrapGame onReturnToHome={handleReturnToHome} />
      ) : (
        <HomeScreen onPlayClick={handleGameStart} />
      )}
    </main>
  );
}
