'use client';

import { useState } from 'react';
import KnightTrapGame from '@/components/game/KnightTrapGame';
import HomeScreen from '@/components/game/HomeScreen';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  if (gameStarted) {
    return <KnightTrapGame />;
  }

  return <HomeScreen onPlayClick={() => setGameStarted(true)} />;
}
