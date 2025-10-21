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
import { Repeat } from 'lucide-react';

type GameOverDialogProps = {
  isOpen: boolean;
  score: number;
  reason: GameOverReason;
  onRestart: () => void;
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
        <AlertDialogFooter>
          <AlertDialogAction onClick={onRestart} className="w-full">
            <Repeat className="mr-2 h-4 w-4" />
            Play Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
