'use client';

import { useState } from 'react';
import HowToPlayDialog from './HowToPlayDialog';

export default function HomeScreen({ onPlayClick }: { onPlayClick: () => void }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <>
      <div 
        className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/home-background.png')" }}
      >
        <div className="flex flex-col items-center gap-12 mb-20">
          <img src="/Logo 8bit.png" alt="Logo" className="w-80 sm:w-96 md:w-[500px]" />
          
          <div className="flex flex-col items-center gap-4">
            <img 
             src="/Playbutton.png" 
             alt="Play" 
             className="cursor-pointer h-20 sm:h-24 md:h-28 transition-transform hover:scale-105"
             onClick={onPlayClick} 
           />
            <img 
              src="/howto.png" 
              alt="How to Play"
              className="cursor-pointer h-12 sm:h-16 transition-transform hover:scale-105"
              onClick={() => setShowHowToPlay(true)}
            />
          </div>
        </div>
      </div>
      {showHowToPlay && <HowToPlayDialog onClose={() => setShowHowToPlay(false)} />}
    </>
  );
}