'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { GameOverReason } from '@/lib/types';
import { Repeat, Home } from 'lucide-react';

type GameOverDialogProps = {
  isOpen: boolean;
  score: number;
  reason: GameOverReason;
  onRestart: () => void;
  onReturnToHome: () => void;
};

const reasons: Record<NonNullable<GameOverReason>, { title: string, description: string }> = {
    trapped: {
        title: 'Trapped!',
        description: 'The Shadow Knights cornered you, leaving no safe escape.'
    },
    bomb: {
        title: 'KABOOM!',
        description: 'You moved onto a square with a passive bomb.'
    },
    captured: {
        title: 'Captured!',
        description: 'A Shadow Knight landed on your square.'
    },
    illegalMove: {
        title: 'Misstep!',
        description: 'That was not a valid knight move.'
    }
}

export default function GameOverDialog({
  isOpen,
  score,
  reason,
  onRestart,
  onReturnToHome,
}: GameOverDialogProps) {
  const reasonText = reason ? reasons[reason] : { title: 'Game Over', description: '' };
  
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl font-headline text-center">
            {reasonText.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {reasonText.description}
          </AlertDialogDescription>
          <div className="text-center py-4">
            <p className="text-lg text-muted-foreground">Final Score</p>
            <p className="text-6xl font-bold font-headline text-foreground">{score}</p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row sm:justify-center gap-2">
          <AlertDialogAction onClick={onReturnToHome} className="w-full sm:w-auto">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </AlertDialogAction>
          <AlertDialogAction onClick={onRestart} className="w-full sm:w-auto">
            <Repeat className="mr-2 h-4 w-4" />
            Play Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
