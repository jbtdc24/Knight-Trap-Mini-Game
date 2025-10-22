'use client';

import { useState } from 'react';
import KnightTrapGame from '@/components/game/KnightTrapGame';
import HomeScreen from '@/components/game/HomeScreen';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  if (gameStarted) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-2 sm:p-4 lg:p-8">
        <KnightTrapGame />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-2 sm:p-4 lg:p-8">
      <HomeScreen onPlayClick={() => setGameStarted(true)} />
    </main>
  );
}
