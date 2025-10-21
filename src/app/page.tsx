import KnightTrapGame from '@/components/game/KnightTrapGame';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-2 sm:p-4 lg:p-8">
      <KnightTrapGame />
    </main>
  );
}
