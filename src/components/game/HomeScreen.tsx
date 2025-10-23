import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/Logo';
import { Play } from 'lucide-react';

export default function HomeScreen({ onPlayClick }: { onPlayClick: () => void }) {
  return (
    <div 
      className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/home-background.png')" }}
    >
      <div className="flex flex-col items-center gap-8">
        <Logo />
        <Button size="lg" className="font-headline text-xl" onClick={onPlayClick}>
          <Play className="mr-2" />
          PLAY
        </Button>
      </div>
    </div>
  );
}
