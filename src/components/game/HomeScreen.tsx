import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/Logo';
import { Play } from 'lucide-react';

export default function HomeScreen() {{
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-gray-800">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="font-bold text-white">HIGH SCORE</span>
        <span className="text-2xl font-bold text-white">0</span>
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="font-bold text-white">SCORE</span>
        <span className="text-2xl font-bold text-white">0</span>
      </div>

      <div className="flex flex-col items-center gap-8">
        <Logo />
        <Button size="lg" className="font-headline text-xl">
          <Play className="mr-2" />
          PLAY
        </Button>
      </div>

      <div className="absolute bottom-4 flex w-full items-center justify-around">
        <div className="flex flex-col items-center gap-2">
          <Button variant="outline" size="icon" className="h-16 w-16 rounded-full">
            {/* Placeholder for Time Warp */}
          </Button>
          <span className="font-bold text-white">TIME WARP</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button variant="outline" size="icon" className="h-16 w-16 rounded-full">
            {/* Placeholder for Void Shield */}
          </Button>
          <span className="font-bold text-white">VOID SHIELD</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button variant="outline" size="icon" className="h-16 w-16 rounded-full">
            {/* Placeholder for Aether Blast */}
          </Button>
          <span className="font-bold text-white">AETHER BLAST</span>
        </div>
      </div>
    </div>
  );
}}
