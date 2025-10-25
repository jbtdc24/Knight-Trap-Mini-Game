'use client';

import { useState } from 'react';
import KnightTrapGame from '@/components/game/KnightTrapGame';
import HomeScreen from '@/components/game/HomeScreen';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleGameStart = () => setGameStarted(true);
  const handleReturnToHome = () => setGameStarted(false);

  if (gameStarted) {
    return <KnightTrapGame onReturnToHome={handleReturnToHome} />;
  }

  return <HomeScreen onPlayClick={handleGameStart} />;
}
